---
title: "Orchestrating microservices with Google Cloud Workflows"
date: 2020-11-18T18:56:08+01:00
tags:
- google-cloud
- workflows
- microservices
- orchestration

similar:
  - "posts/2021/02/13/orchestrating-the-pic-a-daily-serverless-app-with-workflows.md"
  - "posts/2020/12/15/day-8-with-workflows-calling-an-HTTP-endpoint.md"
  - "posts/2022/11/22/workflows-patterns-and-best-practices-part-1.md"
---

The trend toward splitting a monolith into fine-grained loosely-coupled microservices has its merits. 
It allows us to scale parts of an application more easily. Teams become more effective on their focused perimeter. 
However, in a chain or graph of services interacting with each other via message buses or other eventing mechanisms, 
it becomes difficult to understand when things start to break. 
Your business processes spanning those services are in limbo. 
Here starts detective work to find out how to get back on track.

**Choreography**: like a bunch of dancers on the floor composing a ballet. 
Loosely-coupled microservices compose business processes without really being aware of each other, 
casually interacting by receiving and sending messages or events.

**Orchestration**: more like a conductor of an orchestra who directs musicians and their instruments to play each part. 
The approach of using a higher level solution that purposefully invokes and tracks each individual service, 
enables developers to know what the current state of a business process is.

Both approaches have their pros and cons. The loosely-coupled aspects of choreography certainly enables agility. 
But business processes are harder to follow. 
Although orchestration adds a single-point-of-failure with its orchestrator tying all the pieces together, 
it brings clarity in the spaghetti of myriads of microservices.

In addition to GCP's existing messaging ([Cloud Pub/Sub](https://cloud.google.com/pubsub/)) 
and eventing solutions ([Eventarc](https://cloud.google.com/blog/products/serverless/build-event-driven-applications-in-cloud-run)) 
for your service choreography, the newly launched product [Cloud Workflows](https://cloud.google.com/workflows) 
is tackling the orchestration approach.

Cloud Workflows is a scalable fully-managed serverless system that automates and coordinates services, 
takes care of error handling and retries on failure, and tells you if the overall process has finished.

In this short video, during the "demo derby" at Google Cloud Next OnAir, 
I had the chance to present a demo of Cloud Workflows, with some concrete examples:

{{< youtube id="_4fo_u5rY_8" t="7164s" >}}

In this video, I started with the proverbial Hello World, using the Yaml syntax for defining workflows:

```yaml
- hello:
    return: "Hello from Cloud Workflows!"
```

I defined a `hello` step, whose sole purpose is to return a string, as the result of its execution.

Next, I showed that workflow definitions can take arguments, and also return values thanks to more complex expressions:

```yaml
main:
    params: [args]
    steps:
        - returnGreeting:
            return: ${"Hello " + args.first + " " + args.last}
```

Cloud Workflows is able to invoke any HTTP-based service (and supports OAuth2 and OIDC), 
whether in Google Cloud or outside (on premises, or other servers). 
Here, I invoke 2 Cloud Functions:

```yaml
- getRandomNumber:
    call: http.get
    args:
        url: https://us-central1-myprj.cloudfunctions.net/randomNumber
    result: randomNumber
- getNthPoemVerse:
    call: http.get
    args:
        url: https://us-central1-myprj.cloudfunctions.net/theCatPoem
        query:
            nth: ${randomNumber.body.number}
    result: randomVerse
- returnOutput:
    return: ${randomVerse.body}
```

The `getRandomNumber` step calls a function that returns a random number with an HTTP GET, 
and stores the result of that invocation in the `randomNumber` variable.

The `getNthPoemVerse` calls another function that takes a query parameter, 
which is found in the `randomNumber` variable which holds the result of the previous function invocation.

The `returnOutput` step then returns the resulting value.

My fourth example shows variable assignment and conditional switches in action:

```yaml
- getRandomNumber:
    call: http.get
    args:
        url: https://us-central1-myprj.cloudfunctions.net/randomNumber
    result: randomNumber
- assign_vars:
    assign:
        - number: ${int(randomNumber.body.number)}
- conditionalSwitch:
    switch:
        - condition: ${number < 33}
          next: low
        - condition: ${number < 66}
          next: medium
    next: high
- low:
    return: ${"That's pretty small! " + string(number)}
- medium:
    return: ${"Hmm, okay, an average number. " + string(number)}
- high:
    return: ${"It's a big number! " + string(number)}
```

Reusing the random function from the previous example, notice how variables are assigned, 
and how to create a switch with multiple conditions, 
as well as showing how to redirect the execution of the workflow to different steps, depending on the outcome of the switch.

But there's really more to this! You can double check the [syntax reference](https://cloud.google.com/workflows/docs/reference/syntax), 
to see all the constructs you can use in your workflow definitions.

### Summary

Cloud Workflows:

-   Orchestrate Google Cloud and HTTP-based API services into serverless workflows
-   Automate complex processes
-   Fully managed service requires no infrastructure or capacity planning
-   Fast scalability supports scaling down to zero and pay-per-use pricing model

In terms of features:

-   Reliable workflow execution
-   Built-in error handling
-   Passing variable values between workflow steps
-   Built-in authentication for Google Cloud products
-   Low latency of execution
-   Support for external API calls
-   Built-in decisions and conditional step executions
-   Cloud Logging

If you want to get started with [Cloud Workflows](https://cloud.google.com/workflows), you can head over to this [hands-on codelabs](https://codelabs.developers.google.com/codelabs/cloud-workflows-intro#0) from my colleague [Mete Atamel](https://twitter.com/meteatamel). Learn more by watching this [longer video](https://www.youtube.com/watch?v=Uz8G8fTwwXs) by Product Manager Filip Knapik who dives into Cloud Workflows. In upcoming articles, we'll come back to Workflows into more details, diving into some more advanced features, or how to migrate a choreographed example, into an orchestrated one. So, stay tuned!