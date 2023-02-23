---
title: "Scaling a Swagger-based web API on Google Cloud Endpoints"
date: 2016-10-27T17:00:56+01:00
type: "talk"
layout: "talk"
tags:
- google-cloud
- cloud-endpoints
- openapi
- swagger
- apis
- container
- ratpack
- groovy
- gce
---

I had the pleasure of presenting at the [Nordic APIs Platform Summit 2016](http://nordicapis.com/events/2016-platform-summit/) in Stockholm this week. I enjoyed the conference a lot, with great speakers and content, flawless organization, and nice interactions with the audience.

For the last keynote of the conference, I had the chance to present about [Google Cloud Endpoints](https://cloud.google.com/endpoints/), Google's take on API management. I worked on a little "pancake"-powered demo, deploying a [Ratpack](https://ratpack.io/) application, in a Docker container, on [Google Container Engine](https://cloud.google.com/container-engine/). I created an [OpenAPI Specification](https://openapis.org/) describing my Web API that served pancakes. And used the Extensible Service Proxy to receive the API calls for securing (with an API key), monitoring (through the Cloud Console) and scaling my Web API (thanks to the scaling capabilities of Container Engine). This demo will be the topic of some upcoming blog posts.

In the meantime, here is the abstract of my talk:

## Scale a Swagger-based Web API with Google Cloud Endpoints

> Web APIs are and more often specified with API definition languages like Swagger (now named Open API Spec), as it can help you generate nice interactive documentation, server skeletons, and client SDKs, mocks, and more, making it simpler to get started both producing and consuming an API.
>
> In this session, Guillaume will demonstrate how to define a Web API with Swagger / Open API Spec, and scale it using Cloud Endpoints, on the Google Cloud Platform.

And here are the slides I presented:

{{< speakerdeck a06c96a7c36a44cba63031f4146b8fae >}}