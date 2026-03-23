---
title: "Workflows patterns and best practices — Part 2"
date: 2022-11-28T14:12:05+01:00
tags:
- google-cloud
- workflows
- design-patterns
canonical: "https://cloud.google.com/blog/topics/developers-practitioners/workflows-patterns-and-best-practices-part-2"

similar:
  - "posts/2022/11/04/workflows-tips-and-tricks.md"
  - "posts/2022/12/06/workflows-patterns-and-best-practices-part-3.md"
  - "posts/2022/11/22/workflows-patterns-and-best-practices-part-1.md"
---

This is part 2 of a three-part series of posts, in which we summarize Workflows and service orchestration patterns. You can apply these patterns to better take advantage of Workflows and service orchestration on Google Cloud.

In the [first post]({{< ref "posts/2022/11/22/workflows-patterns-and-best-practices-part-1" >}}), we introduced some general tips and tricks, as well as patterns for event-driven orchestrations, parallel steps, and connectors. This second post covers more advanced patterns.  

Let's dive in!

## Design for resiliency with retries and the saga pattern

It's easy to put together a workflow that chains a series of services,  especially if you assume that those services will never fail. This is a common distributed systems fallacy, however, because of course a service will fail at some point. The workflow step calling that service will fail, and then the whole workflow will fail. This is not what you want to see in a resilient architecture. Thankfully, Workflows has building blocks to handle both transient and permanent service failures. 

In our post on [Implementing the saga pattern in Workflows](https://cloud.google.com/blog/topics/developers-practitioners/implementing-saga-pattern-workflows) (and its associated e-commerce [sample](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/retries-and-saga)), we talked about how you can apply the saga pattern and take compensation steps to undo one or more previous steps with the `try/except` block for permanent service failures. 

![https://storage.googleapis.com/gweb-cloudblog-publish/images/image3_2_1Fl6i9t.max-1400x1400.png](https://storage.googleapis.com/gweb-cloudblog-publish/images/image3_2_1Fl6i9t.max-1400x1400.png)

_Saga pattern implementation_

We also showed how to handle transient service failures by adding the default HTTP retry policy with the `try/retry` block of Workflows. If you have non-idempotent steps, you need to adjust the retry policy to `default_retry_non_idempotent`. In most cases, you need a custom retry policy with a longer backoff, because the default one waits at most ~8 seconds.  When eventual consistency over a longer time period is more important than fast failure, consider a longer retry policy over several minutes or even hours with a large multiplier is much more likely to succeed during temporary outages. 

Don't take network calls for granted. Make sure you design your orchestration with resiliency in mind using retries and the saga pattern.

## Wait for HTTP and event callbacks instead of polling

Sometimes, your orchestration might need to wait for a long-running job or an asynchronous event in another system before it can continue with the rest of the steps. The workflow can ask for that input by polling an endpoint or a queue, but this requires complicated polling logic, wasted polling cycles and most likely higher latency. A better approach is to use Workflows [callbacks](https://cloud.google.com/workflows/docs/creating-callback-endpoints) to wait for HTTP calls or events.  

In our [Introducing Workflows callbacks](https://cloud.google.com/blog/topics/developers-practitioners/introducing-workflows-callbacks) post, we showed a workflow that waits for human input for automated machine learning translations. Similarly, the [Smarter applications with Document AI, Workflows and Cloud Functions](https://cloud.google.com/blog/topics/developers-practitioners/smarter-applications-document-ai-workflows-and-cloud-functions) post shows a document processing workflow that waits for human approval of expense reports with a callback. 

![/img/workflows-patterns/architecture-diagram_6rwVYEP.max-1500x1500.png](/img/workflows-patterns/architecture-diagram_6rwVYEP.max-1500x1500.png)

_Smarter applications with Document AI, Workflows and Cloud Functions_

While both of these posts are focused on waiting for *HTTP callbacks*, in [Creating Workflows that pause and wait for events](https://medium.com/google-cloud/creating-workflows-that-pause-and-wait-for-events-4da201741f2a) post, we showed how a workflow can also wait for Pub/Sub and Cloud Storage events. You can even use Google Sheets as a quick and simple frontend for human approvals as we showed in the [Workflows that pause and wait for human approvals from Google Sheets](https://medium.com/google-cloud/workflows-that-pause-and-wait-for-human-approvals-from-google-sheets-53673ced2a81) post. 

When designing a workflow, consider waiting for HTTP calls and events, rather than polling.  

## Orchestrate long-running batch jobs

If you need to execute long-running jobs, Google Cloud has services such as [Batch](https://cloud.google.com/batch) and [Cloud Run jobs](https://cloud.google.com/run/docs/create-jobs) that can help. While these services are great for completing  long-running jobs on Compute Engine instances and containers, you still need to create and manage the Batch and Cloud Run job service. One pattern that works really well is to use Workflows to manage these services running batch jobs. 

In the [Taking screenshots of web pages with Cloud Run jobs, Workflows, and Eventarc](https://cloud.google.com/blog/topics/developers-practitioners/taking-screenshots-web-pages-cloud-run-jobs-workflows-and-eventarc) post, we showed how Cloud Run jobs take screenshots of web pages and Workflows creates and manages parallel Cloud Run jobs tasks. Similarly, in the [Batch - prime number generator](https://github.com/GoogleCloudPlatform/batch-samples/tree/main/primegen) sample, we showed how to run prime number generator containers in parallel on Compute Engine instances using Google Batch. The lifecycle of the Batch job is managed by Workflows.

![/img/workflows-patterns/image1_2.max-2200x2200.png](/img/workflows-patterns/image1_2.max-2200x2200.png)

_Take screenshots of webpages with Cloud Run jobs, Workflows and Eventarc_

Use the right services for long-running batch jobs and use Workflows to manage their life cycles.

## Treat serverful workloads as serverless with Workflows

Sometimes, you really need a server due to some serverless limitation. For example, you might need to run on GPUs or execute a long-running process that lasts weeks or months. In those cases, Compute Engine can provide you with customized virtual machines (VM), but you're stuck with managing those VMs yourself. 

In this kind of IT automation scenario, you can use Workflows to create VMs with the customizations you need, run the workloads for however long you need (Workflows executions can last up to one year), and return the result in the end.  This pattern enables you to use servers but manage them as if they were serverless services using Workflows.

In our [Long-running containers with Workflows and Compute Engine](https://cloud.google.com/blog/topics/developers-practitioners/long-running-containers-workflows-and-compute-engine) post, we showed how to use Workflows to spin up a VM, start a prime number generator on the VM, run it for however long you want, and return the result.

Next time you need to spin up a VM, treat it like a serverless service with Workflows. 

## Run command-line tools with Workflows and Cloud Build

We often use command-line tools such as `gcloud` to manage Google Cloud resources or `kubectl` to manage Kubernetes clusters. Wouldn't it be nice if we could call these tools from Workflows and orchestrate management of resources?

In the [Executing commands (gcloud, kubectl) from Workflows](https://medium.com/google-cloud/executing-commands-gcloud-kubectl-from-workflows-ad6b85eaf39c) post, we showed how to use Cloud Build to run these tools and how to create and call that Cloud Build step from Workflows using the Cloud Build connector. 

Keep in mind that this pattern is not limited to `gcloud` and `kubectl`. Any tool you can run in a container can potentially be a target for Workflows with the help of Cloud Build.

Integrate command-line tools into your workflows when needed by calling a Cloud Build step from Workflows.

* * * * *

This second part series covered a lot of ground, but there's still more to cover! We'll wrap up the series in our [third and final post]({{< ref "posts/2022/12/06/workflows-patterns-and-best-practices-part-3" >}}), which describes how to manage the lifecycle of workflow definitions and the benefits of using Firestore. Stay tuned! For questions or feedback, feel free to reach out to us on Twitter @[meteatamel](https://twitter.com/meteatamel) and @[glaforge](https://twitter.com/glaforge).

[](https://cloud.google.com/blog/topics/developers-practitioners/workflows-patterns-and-best-practices-part-1)