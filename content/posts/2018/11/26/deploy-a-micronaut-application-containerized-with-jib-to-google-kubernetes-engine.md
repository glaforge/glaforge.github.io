---
title: "Deploy a Micronaut application containerized with JIB to Google Kubernetes Engine"
date: 2018-11-26T22:31:16+01:00
tags:
- micronaut
- java
- google-cloud
- containers
- kubernetes
- gke

similar:
  - "posts/2020/08/04/running-micronaut-serverlessly-on-google-cloud-platform.md"
  - "posts/2020/03/24/start-the-fun-with-java-14-and-micronaut-inside-serverless-containers-on-cloud-run.md"
  - "posts/2022/10/24/build-deploy-java-17-apps-on-cloud-run-with-cloud-native-buildpacks-on-temurin.md"
---

A few weeks ago, I had the chance to be at [Devoxx Belgium](https://devoxx.be/) once again, to meet developers and learn about new things from awesome speakers. Google Cloud Platform had its own booth on the exhibition floor, and the team was running codelabs: 10 laptops were at the disposal of attendees to go through various hands-on tutorials on several GCP products. I took a chance at crafting my own codelab: deploying a Micronaut application, containerized with Jib, to Google Kubernetes Engine.

For the impatient, follow this link: [g.co/codelabs/micronaut](https://g.co/codelabs/micronaut)

Note: If you haven't got a GCP account already, know that there's a [free trial with $300 of cloud credits](https://console.cloud.google.com/freetrial) to get started.

More information on the tools used:

-   [Micronaut](http://micronaut.io/) is a modern, JVM-based, full-stack framework for building modular, easily testable microservice and serverless applications. Micronaut aims to deliver great startup time, fast throughput, with a minimal memory footprint. Developers can develop with Micronaut in Java, Groovy or Kotlin.

-   Jib is an open source tool that lets you build Docker and OCI images for your Java applications. It is available as plugins for Maven and Gradle, and as a Java library.

-   [Kubernetes](https://kubernetes.io/) is an open source project which can run in many different environments, from laptops to high-availability multi-node clusters, from public clouds to on-premise deployments, from virtual machines to bare metal.

-   [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) is Google Cloud Platform's hosted Kubernetes platform.

In this codelab, you deploy a simple Groovy-based Micronaut microservice to Kubernetes running on Kubernetes Engine.

The goal of this codelab is for you to run your microservice as a replicated service running on Kubernetes. You take code that you have developed on your machine, turn it into a Docker container image built with Jib, and then run and scale that image on Kubernetes Engine.