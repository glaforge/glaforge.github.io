---
title: "Update on the recent serverless developments on GCP at DataXDay 2019"
date: 2019-07-02T17:19:51+01:00
type: "talk"
layout: "talk"
tags:
- serverless
- google-cloud
- app-engine
- cloud-run
- cloud-functions
---

At [DataXDay 2019](https://dataxday.fr/), last week, I had the chance to present an updated version of my introductory talk on the [serverless compute options](https://cloud.google.com/serverless/) on Google Cloud Platform. There's always something new to cover!

For instance, if I put my Java Champion hat on, I'd like to mention that there are new runtimes for App Engine standard, like the beta for Java 11, and there's twice the amount of memory as before. On Cloud Functions, we have an alpha for Java as well (currently Java 8, but it'll be soon moved to Java 11 instead, as customers are more interested in the latest LTS version)

In this talk, I also covered [Cloud Run](http://cloud.run/), and Cloud Run on GKE (Google Kubernetes Engine), as well as telling a few words about the [Knative](https://knative.dev/) open source building blocks for Kubernetes, which allows to create serverless portable containers.

Here's the slide deck I presented at the conference:

{{< speakerdeck 620a008ef3694e93b3a43d15583ff980 >}}
