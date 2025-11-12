---
title: "Orchestrating the Pic-a-Daily serverless app with workflows"
date: 2021-02-13T19:15:05+01:00
tags:
- google-cloud
- workflows
- serverless
canonical: "https://cloud.google.com/blog/topics/developers-practitioners/orchestrating-pic-daily-serverless-app-workflows"

similar:
  - "posts/2020/11/18/orchestrating-microservices-with-cloud-workflows.md"
  - "posts/2022/11/22/workflows-patterns-and-best-practices-part-1.md"
  - "posts/2025/01/31/a-genai-agent-with-a-real-workflow.md"
---

Over the past year, we ([Mete](https://twitter.com/meteatamel) and [Guillaume](https://twitter.com/glaforge)) have developed a picture sharing application, named Pic-a-Daily, to showcase Google Cloud serverless technologies such as Cloud Functions, App Engine, and Cloud Run. Into the mix, we've thrown a pinch of Pub/Sub for interservice communication, a zest of Firestore for storing picture metadata, and a touch of machine learning for a little bit of magic.

![/img/picadailly-workflows/1_Shqfx7L.max-1400x1400.png](https://storage.googleapis.com/gweb-cloudblog-publish/images/1_Shqfx7L.max-1400x1400.png)

We also created a [hands-on workshop](https://codelabs.developers.google.com/serverless-workshop/) to build the application, and [slides](https://speakerdeck.com/meteatamel/pic-a-daily-serverless-workshop) with explanations of the technologies used. The workshop consists of codelabs that you can complete at your own pace. All the code is open source and available in a [GitHub repository](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop). 

## Initial event-driven architecture

The Pic-a-Daily application evolved progressively. As new services were added over time, a loosely-coupled, event-driven architecture naturally emerged, as shown in this architecture diagram:

![/img/picadailly-workflows/2_XMbrwvr.max-1100x1100.png](https://storage.googleapis.com/gweb-cloudblog-publish/images/2_XMbrwvr.max-1100x1100.png)

To recap the event-driven flow:

1.  Users upload pictures on an App Engine web frontend. Those pictures are stored in a Google Cloud Storage bucket, which triggers file creation and deletion events, propagated through mechanisms such as Pub/Sub and Eventarc. 
2.  A Cloud Function (Image analysis) reacts to file creation events. It calls the Vision API to assign labels to the picture, identify the dominant colors, and check if it's a picture safe to show publicly. All this picture metadata is stored in Cloud Firestore. 
3.  A Cloud Run service (Thumbnail service) also responds to file creation events. It generates thumbnails of the high-resolution images and stores them in another bucket. 
4.  On a regular schedule triggered by Cloud Scheduler, another Cloud Run service (Collage services) creates a collage from thumbnails of the four most recent pictures. 
5.  Last but not least, a third Cloud Run service (Image garbage collector) responds to file deletion events received through [(recently generally available) Eventarc](https://cloud.google.com/blog/products/serverless/eventarc-is-ga). When a high-resolution image is deleted from the pictures bucket, this service deletes the thumbnail and the Firestore metadata of the image.

These services are loosely coupled and take care of their own logic, in a smooth choreography of events. They can be scaled independently. There's no single point of failure, since services can continue to operate even if others have failed. Event-based systems can be extended beyond the current domain at play by plugging in other events and services to respond to them.

However, monitoring such a system in its entirety usually becomes complicated, as there's no centralized place to see where we're at in the current business process that spans all the services. Speaking of business processes, it's harder to capture and make sense of the flow of events and the interplay between services. Since there's no global vision of the processes, how do we know if a particular process or transaction is successful or not? And when failures occur, how do we deal properly and explicitly with errors, retries, or timeouts?

As we kept adding more services, we started losing sight of the underlying "business flow". It became harder to isolate and debug problems when something failed in the system. That's why we decided to investigate an orchestrated approach.

## Orchestration with Workflows

[Workflows](https://cloud.google.com/workflows) recently became generally available. It offered us a great opportunity to re-architect our application and use an orchestration approach, instead of a completely event-driven one. In orchestration, instead of microservices responding to events, there is an external service, such as Workflows, calling microservices in a predefined order. 

After some restructuring, the following architecture emerged with Workflows:

![/img/picadailly-workflows/3_temY387.max-1000x1000.png](https://storage.googleapis.com/gweb-cloudblog-publish/images/3_temY387.max-1000x1000.png)

Let's recap the orchestrated approach:

-   App Engine is still the same web frontend that accepts pictures from our users and stores them in the Cloud Storage bucket. 
-   The file storage events trigger two functions, one for the creation of new pictures and one for the deletion of existing pictures. Both functions create a workflow execution. For file creation, the workflow directly makes the call to the Vision API (declaratively instead of via Cloud Function code) and stores picture metadata in Firestore via its REST API. 
-   In between, there's a function to transform the useful information of the Vision API into a document to be stored in Firestore. Our initial image analysis function has been simplified: The workflow makes the REST API calls and only the data transformation part remains. 
-   If the picture is safe to display, the workflow saves the information in Firestore, otherwise, that's the end of the workflow. 
-   This branch of the workflow ends with calls to Thumbnail and Collage Cloud Run services. This is similar to before, but with no Pub/Sub or Cloud Scheduler to set up. 
-   The other branch of the workflow is for the picture garbage collection. The service itself was completely removed, as it mainly contained API calls without any business logic. Instead, the workflow makes these calls. 

There is now a central [workflows.yaml](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop/blob/master/workflows/workflows.yaml) file capturing the business flow. You can also see a visualization of the flow in Cloud Console:

![/img/picadailly-workflows/4_zpsaVq7.max-1500x1500.png](https://storage.googleapis.com/gweb-cloudblog-publish/images/4_zpsaVq7.max-1500x1500.png)

The Workflows UI shows which executions failed, at which step, so we can see which one had an issue without having to dive through heaps of logs to correlate each service invocation. Workflows also ensures that each service call completes properly, and it can apply global error and retry policies.

With orchestration, the business flows are captured more centrally and explicitly, and can even be version controlled. Each step of a workflow can be monitored, and errors, retries, and timeouts can be laid out clearly in the workflow definition. When using Cloud Workflows in particular, services can be called directly via REST, instead of relying on events on Pub/Sub topics. Furthermore, all the services involved in those processes can remain independent, without knowledge of what other services are doing.

Of course, there are downsides as well. If you add an orchestrator into the picture, you have one more component to worry about, and it could become the single point of failure of your architecture (fortunately, Google Cloud products come with SLAs!). Last, we should mention that relying on REST endpoints might potentially increase coupling, with a heavier reliance on strong payload schemas vs lighter events formats.

## Lessons learned

Working with Workflows was refreshing in a number of ways and offered us some lessons that are worth sharing. 

### Better visibility

It is great to have a high-level overview of the underlying business logic, clearly laid out in the form of a [YAML declaration](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop/blob/master/workflows/workflows.yaml). Having visibility into each workflow execution was useful, as it enabled us to clearly understand what worked in each execution, without having to dive into the logs to correlate the various individual service executions.

### Simpler code

In the original event-driven architecture, we had to deal with three types of events:

1.  Cloud Functions' direct integration with Cloud Storage events
2.  HTTP wrapped Pub/Sub messages with Cloud Storage events for Cloud Run
3.  Eventarc's CloudEvents based Cloud Storage events for Cloud Run

As a result, the code had to cater to each flavor of events:

```javascript
// Cloud Functions provides the event directly
exports.vision_analysis = async (event, context) => {
 const filename = event.name;
 const filebucket = event.bucket;
 ...

// Cloud Run encodes the GCS event in Base64 in a Pub/Sub message
// and wraps the message in an HTTP request
app.post('/', async (req, res) => {
 const pubSubMessage = req.body;
 const eventType = pubSubMessage.message.attributes.eventType;
 const fileEvent = JSON.parse(
 Buffer.from(pubSubMessage.message.data, 'base64')
 .toString().trim());
 ...
​
// Eventarc encodes events with CloudEvents
// and Cloud Run wraps it in an HTTP request
app.post('/', async (req, res) => {
 const cloudEvent = HTTP.toEvent({
 headers: req.headers, body: req.body });
 const tokens = logEntryData.protoPayload.resourceName.split('/');
 const bucket = tokens[3];
 const objectName = tokens[5];
 ...
```

In the orchestrated version, there's only a simple REST call and HTTP POST body to parse:

```javascript
// Workflows calls services directly,
// No events to unwrap
app.post('/', async (req, res) => {
 // gs://picture-bucket/image.jpg
 const gcsImageUri = req.body.gcsImageUri;
 const tokens = gcsImageUri.substr(5).split('/');
 const fileEvent = { bucket: tokens[0], name: tokens[1] };
```

### Less code

Moving REST calls into the workflow definition as a declaration (with straightforward authentication) enabled us to eliminate quite a bit of code in our services; one service was trimmed down into a simple data transformation function, and another service completely disappeared! Two functions for triggering two paths in the workflow were needed though, but with a future integration with Eventarc, they may not be required anymore. 

### Less setup

In the original event-driven architecture, we had to create Pub/Sub topics, and set up Cloud Scheduler and Eventarc to wire-up services. With Workflows, all of this setup is gone. [Workflows.yaml](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop/blob/master/workflows/workflows.yaml) is the single source of setup needed for the business flow. 

### Error handling

Error handling was also simplified in a couple of ways. First, the whole flow stops when an error occurs, so we were no longer in the dark about exactly which services succeeded and which failed in our chain of calls. Second, we now have the option of applying global error and retry policies. 

### Learning curve

Now, everything is not always perfect! We had to learn a new service, with its quirks and limited documentation --- it's still early, of course, and the documentation will improve over time with feedback from our customers.

### Code vs. YAML 

As we were redesigning the architecture, an interesting question came up over and over: "Should we do this in code in a service or should we let Workflows make this call from the YAML definition?"

In Workflows, more of the logic lands in the workflow definition file in YAML, rather than code in a service. Code is usually easier to write, test, and debug than YAML, but it also requires more setup and maintenance than a step definition in Workflows.

If it's boilerplate code that simply makes a call to some API, that should be turned into YAML declarations. However, if the code also has extra logic, then it's probably better to leave it in code, as YAML is less testable. Although there is some level of error reporting in the Workflows UI, it's not a full-fledged IDE that helps you along the way. Even when working in your IDE on your development machine, you'll have limited help from the IDE, as it only checks for valid YAML syntax.

### Loss of flexibility

The last aspect we'd like to mention is perhaps a loss of flexibility. Working with a loosely-coupled set of microservices that communicate via events is fairly extensible, compared to a more rigid solution that mandates a strict definition of the business process descriptions.

### Choreography or orchestration?

Both approaches are totally valid, and each has its pros and cons. We mentioned this topic when [introducing Workflows](https://cloud.google.com/blog/topics/developers-practitioners/better-service-orchestration-workflows). When should you choose one approach over the other? Choreography can be a better fit if services are not closely related, or if they can exist in different bounded contexts. Whereas orchestration might be best if you can describe the business logic of your application as a clear flow chart, which can then directly be described in a workflow definition. 

## Next steps

To go further, we invite you to have a closer look at [Workflows](http://cloud.google.com/workflows), and its supported [features](https://cloud.google.com/workflows#all-features), by looking at the [documentation](https://cloud.google.com/workflows/docs/overview), particularly the [reference documentation](https://cloud.google.com/workflows/docs/reference/syntax) and the [examples](https://cloud.google.com/workflows/docs/sample-workflows?hl=en). We also have a series of short articles that cover Workflows, with various [tips and tricks](https://glaforge.appspot.com/category/Google%20Cloud%20Platform), as well as introductions to Workflows, with a [first look at Workflows](https://atamel.dev/posts/2020/09-08_first_look_at_workflows/) and some thoughts on [choreography vs orchestration](https://glaforge.appspot.com/article/orchestrating-microservices-with-cloud-workflows).

If you want to study a concrete use case, with an event-based architecture and an equivalent orchestrated approach, feel free to look into our [Serverless Workshop](https://g.co/codelabs/serverless-workshop). It offers codelabs spanning Cloud Functions, Cloud Run, App Engine, Eventarc, and Workflows. In particular, lab 6 is the one in which we converted the event-based model into an orchestration with Workflows. All the code is also available as [open source on GitHub](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop).\
We look forward to hearing from you about your workflow experiments and needs. Feel free to reach out to us on Twitter at [@glaforge](https://twitter.com/glaforge) and [@meteatamel](https://twitter.com/meteatamel).

[](https://cloud.google.com/blog/products/application-development/get-to-know-google-cloud-workflows)