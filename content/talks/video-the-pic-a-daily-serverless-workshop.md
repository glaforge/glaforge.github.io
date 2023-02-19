---
title: "Video: the Pic-a-Daily serverless workshop"
date: 2020-05-18T14:44:33+01:00
type: "talk"
layout: "talk"
tags:
- google-cloud
- cloud-functions
- cloud-run
- app-engine
- functions-as-a-service
- serverless
---

With my partner in crime, [Mete Atamel](https://twitter.com/meteatamel/status/1262316915642576896), 
we ran two editions of our "Pic-a-Daily" serverless workshop. It's an online, hands-on, workshop, 
where developers get their hands on the the [serverless products](https://cloud.google.com/serverless) 
provided by [Google Cloud Platform](https://cloud.google.com/):

-   [Cloud Functions](https://cloud.google.com/functions) --- to develop and run functions, small units of logic glue, to react to events of your cloud projects and services
-   [App Engine](https://cloud.google.com/appengine) --- to deploy web apps, for web frontends, or API backends
-   [Cloud Run](https://cloud.google.com/run) --- to deploy and scale containerised services

[![](/img/pic-a-daily-workshop/picadaily.png)](https://codelabs.developers.google.com/serverless-workshop/)

The theme of the workshop is to build a simple photosharing application (hence the play on words, with a picture a day) with those serverless products, but along the way, developers also get to use other services like:

-   [Pub/Sub](https://cloud.google.com/pubsub/) --- as a messaging fabric to let events flow between your services
-   [Firestore](https://cloud.google.com/firestore) --- for storing picture metadata in the scalable document database
-   [Cloud Storage](https://cloud.google.com/storage) --- to store the image blobs
-   [Cloud Scheduler](https://cloud.google.com/scheduler) --- to run a services on a schedule (ie. cron as a service)
-   [Cloud Vision API](https://cloud.google.com/vision/) --- a machine learning API to make sense of what's in your pictures

[![](/img/pic-a-daily-workshop/diagram.png)](https://codelabs.developers.google.com/serverless-workshop/)

The workshop is freely accessible on our codelabs platform: ["Pic-a-Daily" serverless workshop](https://codelabs.developers.google.com/serverless-workshop/). So you can follow this hands-on workshop on your own, at your own pace. There are 4 codelabs:

-   The [first one](https://codelabs.developers.google.com/codelabs/cloud-picadaily-lab1/index.html?index=..%2F..serverless-workshop#13) lets you build a function that responds to events as new pictures are uploaded into Cloud Storage, invoking the Vision API to understand what is in the picture, and storing some picture metadata information in Firestore.
-   The [second lab](https://codelabs.developers.google.com/codelabs/cloud-picadaily-lab2/index.html?index=..%2F..serverless-workshop#0) will use a Cloud Run service which reacts to new files stored in Cloud Storage too, but will create thumbnails of the pictures.

-   A [third lab](https://codelabs.developers.google.com/codelabs/cloud-picadaily-lab3/index.html?index=..%2F..serverless-workshop#0) is also taking advantage of Cloud Run to run on a schedule, thanks to Cloud Scheduler. It creates a collage of the most recent pictures.

-   Last but not least, the [fourth lab](https://codelabs.developers.google.com/codelabs/cloud-picadaily-lab4/index.html?index=..%2F..serverless-workshop#0) will let you build a web frontend and backend API on Google App Engine.

[![](/img/pic-a-daily-workshop/codelabs.png)](https://codelabs.developers.google.com/serverless-workshop/)

We have a dedicated [Github repository](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop) where you can check-out the code of the various functions, apps and containers, and you can have a look at the [slide deck](https://speakerdeck.com/meteatamel/pic-a-daily-serverless-workshop) introducing the workshop and the technologies used.

And now, the videos of the first edition are also available on YouTube!

The first part covers Cloud Functions and Cloud Run with the first two labs:

{{< youtube wEENQouNsGk >}}

The second part covers Cloud Run and App Engine:

{{< youtube Y9E1fQcPXP0 >}}