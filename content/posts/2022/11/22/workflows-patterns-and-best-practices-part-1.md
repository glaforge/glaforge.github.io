---
title: "Workflows patterns and best practices — Part 1"
date: 2022-11-22T14:11:45+01:00
tags:
- google-cloud
- workflows
canonical: "https://cloud.google.com/blog/topics/developers-practitioners/workflows-patterns-and-best-practices-part-1"

similar:
  - "posts/2022/11/04/workflows-tips-and-tricks.md"
  - "posts/2022/11/28/workflows-patterns-and-best-practices-part-2.md"
  - "posts/2020/11/18/orchestrating-microservices-with-cloud-workflows.md"
---

For the last couple of years, we've been using [Workflows](https://cloud.google.com/workflows), Google Cloud's service orchestrator, to bring order to our serverless microservices architectures. As we used and gained more experience with Workflows and service orchestration, we shared what he had learned in conference talks, blog posts, samples, and tutorials. Along the way, some common patterns and best practices emerged. 

To help you take better advantage of Workflows and service orchestration on Google Cloud, we've summarized these proven patterns and best practices in a three-part series of blog posts.

Let's get started with Part 1!

## Make a conscious choice on the communication style upfront

Choosing a communication style is more of a task than a pattern, but it is an important one to complete before even considering service orchestration. 

When you have multiple services, you need to decide how these services will communicate. The options are:

-   **Direct** service-to-service communication
-   Indirect **event-driven** communication (also known as choreography)
-   A central **orchestrator** (e.g. Workflows) directing the communication

There's no right or wrong, only pros and cons. Direct service-to-service communication is easy to implement but creates tight coupling between services. Events enable loosely coupled services at the expense of harder monitoring and debugging when something goes wrong. An orchestrator, while less flexible, brings order to communication without the tight coupling of direct service-to-service communication and the chaos of events in choreographed architectures.

In our [Orchestrating the Pic-a-Daily serverless app with Workflows](https://cloud.google.com/blog/topics/developers-practitioners/orchestrating-pic-daily-serverless-app-workflows) post, we explained how we transformed an event-driven application into an orchestrated application and the benefits of doing so. In [Choosing the right orchestrator in Google Cloud](https://cloud.google.com/blog/topics/developers-practitioners/choosing-right-orchestrator-google-cloud), we talked about which service is best suited for different orchestration needs (scheduled, service, and data). 

As you design your architecture, make a conscious choice on the communication style with pros and cons in mind, and if you choose to use orchestration, be sure to use the right orchestrator for the task. 

## Keep these tips and tricks for Workflows in mind

Once you decide to use Workflows for service orchestration, you'll realize that Workflows has its own strengths and idiosyncrasies. Here are some general tips and tricks that we found useful as we used Workflows:

-   **Avoid hard-coding URLs** for more portable workflows across environments.
-   **Use substeps** to collect a common series of steps in one logical unit.
-   **Wrap string expressions** to avoid parsing problems.
-   **Replace logic-less services with declarative API calls** to avoid boilerplate code.
-   **Store what you need, free what you can** to keep memory consumption under control.
-   **Use subworkflows and call external workflows** to increase reuse.

Check our [post on Workflows tips and tricks](https://glaforge.appspot.com/article/workflows-tips-n-tricks) for a more detailed explanation of these points. 

### Consider event-driven orchestration

The choice on the communication style is not all or nothing. You can and should combine different styles when it makes sense. For example, there is a common pattern where services that are closely related are managed by an orchestrator like Workflows but that orchestration is triggered by an event from a service like Eventarc. Similarly, we see architectures where the end of an orchestration is a Pub/Sub message to some other orchestration or service. 

In our [Introducing Eventarc triggers for Workflows](https://cloud.google.com/blog/topics/developers-practitioners/introducing-eventarc-triggers-workflows) post, we showed how easy it is to route events to Workflows using Eventarc. In the [Build an event-driven orchestration with Eventarc and Workflows](https://youtu.be/2SI12QE-2DU) video and its associated [codelab](https://codelabs.developers.google.com/codelabs/cloud-event-driven-orchestration?hl=en#8) and [sample](https://github.com/GoogleCloudPlatform/eventarc-samples/tree/main/processing-pipelines/image-v3), we showed how to design an image processing pipeline where the services are managed by Workflows but the orchestration is triggered in a loosely coupled way by a Cloud Storage event via Eventarc:

{{< youtube "2SI12QE-2DU" >}}

Mix communication styles to get the best of both worlds: use orchestration when you need tight coupling between services but loose coupling with other orchestrations via events.

## Use connectors when you can

Workflows has a rich set of [connectors](https://cloud.google.com/workflows/docs/connectors) to call other Google Cloud services. They handle the formatting of requests for you, providing methods and arguments so that you don't need to get deep into the gory details of a Google Cloud API. More importantly, connectors enable a workflow to transparently wait for long-running Cloud API calls. This saves you from the tedious work of iterating and waiting for calls to complete; connectors take care of this for you! 

In our [Introducing new connectors for Workflows](https://cloud.google.com/workflows/docs/connectors) post, we showed you how Compute Engine connector simplified creating and stopping a virtual machine. 

Whenever you want to call a Google Cloud API from Workflows, check to see if there's a connector for it. You'll be glad that you did and you can always request a new connector [here](https://docs.google.com/forms/d/e/1FAIpQLScdDRwFHcFuy28hvjGq0XCBMyiVuhHGq2c-7Gy_no1ZuqKAOg/viewform?resourcekey=0-0BRW58uzC8wnVntuOiM7AQ), if there's no connector.

## Parallelize when you can

When we talk about Workflows, we often talk about steps executed one after another sequentially. While Workflows is fast enough to run steps sequentially with no noticeable delay, not all steps need to run sequentially. Independent steps can actually run in parallel, and in some cases this can provide a significant speed up for workflow executions.

In the [Introducing Parallel Steps for Workflows](https://cloud.google.com/blog/topics/developers-practitioners/introducing-parallel-steps-workflows-speed-up-workflow-executions-by-running-steps-concurrently) post and its associated video, we showed how running BigQuery jobs from Workflows in parallel can speed up the workflow execution by five times. The more independent steps you have, the more you can run those steps in parallel and the faster your workflow execution will be, especially with long-running tasks like BigQuery jobs.

{{< youtube "C1Reg1u1MXY" >}}

Try to keep your steps independent and make sure to take advantage of parallel steps when you can.

* * * * *

This initial list of patterns and tips will help you get started taking better advantage of Workflows. We cover more advanced patterns in [part 2]({{< ref "posts/2022/11/28/workflows-patterns-and-best-practices-part-2" >}}) of this series. For questions or feedback, feel free to reach out to us on Twitter @[meteatamel](https://twitter.com/meteatamel) and @[glaforge](https://twitter.com/glaforge).

[](https://cloud.google.com/blog/topics/developers-practitioners/orchestrating-pic-daily-serverless-app-workflows)