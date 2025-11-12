---
title: "A Cloud Run service in Go calling a Workflows callback endpoint"
date: 2022-09-27T16:02:00+01:00
tags:
- cloud-run
- google-cloud
- workflows
- go

similar:
  - "posts/2021/10/02/introducing-workflows-callbacks.md"
  - "posts/2020/12/15/day-8-with-workflows-calling-an-HTTP-endpoint.md"
  - "posts/2022/11/28/workflows-patterns-and-best-practices-part-2.md"
---

It's all [Richard Seroter](https://seroter.com/)'s fault, I ended up dabbling with [Golang](https://go.dev/)! 
We were chatting about a use case using Google Cloud [Workflows](https://cloud.google.com/workflows) and a [Cloud Run](https://cloud.run/) service implemented in Go. 
So it was the occasion to play a bit with Go. Well, I still don't like error handling... But let's rewind the story a bit!

Workflows is a fully-managed service/API orchestrator on Google Cloud. You can create some advanced business workflows using YAML syntax. 
I've built numerous little projects using it, and [blogged](https://cloud.google.com/blog/topics/developers-practitioners/introducing-workflows-callbacks) about it. 
I particularly like its ability to pause a workflow execution, creating a [callback endpoint](https://cloud.google.com/workflows/docs/creating-callback-endpoints) 
that you can call from an external system to resume the execution of the workflow. 
With callbacks, you're able to implement human validation steps, for example in an expense report application 
where a manager validates or rejects an expense from someone in their team (this is what I implemented in this 
[article](https://cloud.google.com/blog/topics/developers-practitioners/smarter-applications-document-ai-workflows-and-cloud-functions)).

For my use case with Richard, we had a workflow that was creating such a callback endpoint. 
This endpoint is called from a Cloud Run service implemented in Go. 
Let's see how to implement the workflow:

```yaml
main:
    params: [input]
    steps:

    - create_callback:
        call: events.create_callback_endpoint
        args:
            http_callback_method: "POST"
        result: callback_details

    - log_callback_creation:
        call: sys.log
        args:
            text: ${"Callback created, awaiting calls on " + callback_details.url}

    - await_callback:
        call: events.await_callback
        args:
            callback: ${callback_details}
            timeout: 86400
        result: callback_request

    - log_callback_received:
        call: sys.log
        args:
            json: ${callback_request.http_request}

    - return_callback_request:
        return: ${callback_request.http_request}
```

The above workflow definition creates a callback endpoint. The URL of the callback endpoint is returned by that first step. 
Then the workflow is waiting for the callback endpoint to be called externally. 
The execution then resumes and logs some info about the incoming call and returns.

I deployed that workflow with a service account that has the Workflows Editor role, the Log Writer role (to log information), 
and the Service Account Token Creator role (to create OAuth2 tokens), 
as [explained](https://cloud.google.com/workflows/docs/creating-callback-endpoints#oauth-token) in the documentation.

Now let's look at the Go service. I did a go mod init to create a new project. 
I created a main.go source file with the following content:



```go
package main

import (
	metadata "cloud.google.com/go/compute/metadata"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)
```

The metadata module is used to fetch an OAuth2 token from the [Cloud Run metadata server](https://cloud.google.com/run/docs/container-contract#metadata-server).

```go
// OAuth2 JSON struct
type OAuth2TokenInfo struct {
	// defining struct variables
	Token      string `json:"access_token"`
	TokenType  string `json:"token_type"`
	Expiration uint32 `json:"expires_in"`
}
```

The metadata information in `instance/service-accounts/default/token` returns a JSON document that we map with the above struct. 
We're interested in the access_token field, that we use further down to make the authenticated call to the Workflows callback endpoint.

```go
func main() {
	log.Print("Starting server...")
	http.HandleFunc("/", handler)

	// Determine port for HTTP service.	port := os.Getenv("PORT")	
    if port == "" {		
        port = "8080"		
        log.Printf("Defaulting to port %s", port)	
    }

	// Start HTTP server.	
    log.Printf("Listening on port %s", port)	
    if err := http.ListenAndServe(":"+port, nil); err != nil {		
        log.Fatal(err)	
    }
}
```

The `main()` function starts our Go service. Let's now see the `handler()` function in more detail:

```go
func handler(w http.ResponseWriter, r *http.Request) {
	callbackUrl := r.URL.Query().Get("callback_url")
	log.Printf("Callback URL: %s", callbackUrl)
```

We retrieve the `?callback_url` query parameter that will contain our callback endpoint URL.

```go
	// Fetch an OAuth2 access token from the metadata server
	oauthToken, errAuth := metadata.Get("instance/service-accounts/default/token")
	if errAuth != nil {
		log.Fatal(errAuth)
	}
```

Above, we make a call to the metadata server thanks to the metadata Go module. 
And then we unmarshall the returned JSON document in our previously defined struct, with the following code:

```go
	data := OAuth2TokenInfo{}
	errJson := json.Unmarshal([]byte(oauthToken), &data)
	if errJson != nil {
		fmt.Println(errJson.Error())
	}
	log.Printf("OAuth2 token: %s", data.Token)
```

Now it's time to prepare the call to our workflow callback endpoint, with a POST request:

```go
	workflowReq, errWorkflowReq := http.NewRequest("POST", callbackUrl, strings.NewReader("{}"))
	if errWorkflowReq != nil {
		fmt.Println(errWorkflowReq.Error())
	}
```

We add the OAuth2 token as a bearer authorization via headers:

```go
	workflowReq.Header.Add("authorization", "Bearer "+data.Token)
	workflowReq.Header.Add("accept", "application/json")
	workflowReq.Header.Add("content-type", "application/json")

    client := &http.Client{}	
    workflowResp, workflowErr := client.Do(workflowReq)	
    if workflowErr != nil {
        fmt.Printf("Error making callback request: %s\n", workflowErr)	
    }
    log.Printf("Status code: %d", workflowResp.StatusCode)
	fmt.Fprintf(w, "Workflow callback called. Status code: %d", workflowResp.StatusCode)}

```

We simply return the status code at the end of our Go service.

To deploy the Go service, I simply used the source deployment approach, by running gcloud run deploy, 
and answering some questions (service name, region deployment, etc.) 
After a couple of minutes, the service is up and running.

I create a new execution of the workflow from the Google Cloud console. 
Once it's started, it logs the callback endpoint URL. 
I copy its value, then I'm calling my Cloud Run service with the `?callback_url=` query string pointing at that URL. 
And voilà, the service resumes the execution of the workflow, and the workflow finishes.