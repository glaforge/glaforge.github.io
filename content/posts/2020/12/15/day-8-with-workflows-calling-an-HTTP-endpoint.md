---
title: "Day 8 with Workflows — Calling an HTTP endpoint"
date: 2020-12-15T19:51:12+01:00
tags:
- google-cloud
- workflows

similar:
  - "posts/2020/11/18/orchestrating-microservices-with-cloud-workflows.md"
  - "posts/2022/02/04/using-the-secret-manager-connector-for-workflows-to-call-an-authenticated-service.md"
  - "posts/2022/02/01/sending-an-email-with-sendgrid-from-workflows.md"
---

Time to do something pretty handy: calling an HTTP endpoint, from your Google Cloud Workflows definitions. 
Whether calling GCP specific APIs such as the ML APIs, REST APIs of other products like Cloud Firestore, 
or when calling your own services, third-party, external APIs, this capability lets you plug your business processes to the external world!

Let's see calling HTTP endpoints in action in the following video, before diving into the details below:

{{< youtube jyIonG-u4eM >}}

By default, when creating a new workflow definition, a default snippet / example is provided for your inspiration. 
We'll take a look at it for this article. 
There are actually two HTTP endpoint calls, the latter depending on the former: 
the first step (`getCurrentTime`) is a cloud function returning the day of the week, 
whereas the second step (`readWikipedia`) searches Wikipedia for articles about that day of the week.

```yaml
- getCurrentTime:
    call:  http.get
    args:
        url:  https://us-central1-workflowsample.cloudfunctions.net/datetime
    result:  CurrentDateTime
```

The `getCurrentTime` step contains a call attribute of type `http.get`, to make HTTP GET requests to an API endpoint. 
You have the ability to do either `call: http.get` or `call: http.post`. 
For other methods, you'll have to do call: `http.request`, and add another key/value pair under `args`, with method: 
`GET`, `POST`, `PATCH` or `DELETE`. 
Under `args`, for now, we'll just put the URL of our HTTP endpoint. 
The last key will be the result, which gives the name of a new variable that will contain the response of our HTTP request.

Let's call Wikipedia with our day of the week search query:

```yaml
- readWikipedia:
    call:  http.get
    args:
        url:  https://en.wikipedia.org/w/api.php
        query:
            action:  opensearch
            search:  ${CurrentDateTime.body.dayOfTheWeek}
    result:  WikiResult
```

Same thing with `call`, and `args.url`, however, we have a query where you can define the query parameters for the Wikipedia API. 
Also note how we can pass data from the previous step function invocation: `CurrentDateTime.body.dayOfTheWeek`. 
We retrieve the body of the response of the previous call, and from there, we get the `dayOfTheWeek` key in the resulting JSON document. 
We then return `WikiResult`, which is the response of that new API endpoint call.

```yaml
- returnOutput:
    return:  ${WikiResult.body[1]}
```

Then, the last step is here to return the result of our search. We retrieve the body of the response. 
The response's body is an array, with a first term being the search query, 
and the second item is the following array of document names, which is what our workflow execution will return:

```json
[
 "Monday",
 "Monday Night Football",
 "Monday Night Wars",
 "Monday Night Countdown",
 "Monday Morning (newsletter)",
 "Monday Night Golf",
 "Monday Mornings",
 "Monday (The X-Files)",
 "Monday's Child",
 "Monday.com"
]
```

So our whole workflow was able to orchestrate two independent API endpoints, one after the other. 
Instead of having two APIs that are coupled via some messaging passing mechanism, 
or worse, via explicit calls to one or the other, Cloud Workflows is here to organize those two calls. 
It's the orchestration approach, instead of a choreography of services 
(see my previous article on [orchestration vs choreography]({{< ref "/posts/2020/11/18/orchestrating-microservices-with-cloud-workflows" >}}), 
and my colleague's article on [better service orchestration](https://cloud.google.com/blog/topics/developers-practitioners/better-service-orchestration-workflows) with Cloud Workflows).

To come back to the details of API endpoint calls, here's their structure:

```yaml
- STEP_NAME:
    call:  {http.get|http.post|http.request}
    args:
        url:  URL_VALUE
        [method:  REQUEST_METHOD]
        [headers:
            KEY:VALUE  ...]
        [body:
            KEY:VALUE  ...]
        [query:
            KEY:VALUE  ...]
        [auth:
            type:{OIDC|OAuth2}]
        [timeout:  VALUE_IN_SECONDS]
        [result:  RESPONSE_VALUE]
```

In addition to the URL, the method and query, note that you can pass headers and a body. There is also a built-in mechanism for authentication which works with GCP APIs: the authentication is done transparently. You can also specify a timeout in seconds, if you want to fail fast and not wait forever a response that never comes. But we'll come back to error handling in some of our upcoming articles.