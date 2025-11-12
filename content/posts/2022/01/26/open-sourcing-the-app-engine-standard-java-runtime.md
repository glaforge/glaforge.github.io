---
title: "Open sourcing the App Engine Standard Java Runtime"
date: 2022-01-26T19:07:57+01:00
tags:
- google-cloud
- app-engine
- java
- serverless
canonical: "https://cloud.google.com/blog/topics/developers-practitioners/open-sourcing-app-engine-standard-java-runtime"

similar:
  - "posts/2019/06/21/turn-it-up-to-eleven-java-11-runtime-comes-to-app-engine.md"
  - "posts/2020/05/26/sip-a-cup-of-java-11-for-your-cloud-functions.md"
  - "posts/2020/05/27/introducing-java-11-on-google-cloud-functions.md"
---

One year after Google App Engine was [released](http://googleappengine.blogspot.com/2008/04/introducing-google-app-engine-our-new.html) in 2008, Java became the [second language runtime](http://googleappengine.blogspot.com/2009/04/seriously-this-time-new-language-on-app.html) available on the platform. Java developers were able to deploy and scale their servlet-based web applications easily, without worrying about infrastructure management. Not only Java was able to run then, but alternative JVM languages, like [Apache Groovy](https://spring.io/blog/2009/04/08/write-your-google-app-engine-applications-in-groovy), and [Kotlin](https://kotlinlang.org/) are also part of the game. Fast forward to today, we're pleased to announce that the Java Runtime for App Engine is now available as open source, in the [GoogleCloudPlatform/appengine-java-standard](https://github.com/GoogleCloudPlatform/appengine-java-standard) repository on Github.

## What's available?

The `appengine-java-standard` repository contains the Java source code for the Java standard environment, the production runtime, the APIs, and the local SDK. 

Zooming on the various directories of the project, you'll find the [APIs](https://github.com/GoogleCloudPlatform/appengine-java-standard/tree/main/api/src/main/java/com/google/appengine/api) from the `com.google.appengine.api` package for using and accessing App Engine services like Datastore to store your data, Blobstore to save your binary blobs, Taskqueue to enqueue computing tasks, Memcache to cache expensive results you don't want to recompute, or Urlfetch to call external services. 

The great developer experience of Google App Engine comes in part from the fact you can run your application locally on your development machine, thanks to the local development environment. The aforementioned services all have a local [implementation](https://github.com/GoogleCloudPlatform/appengine-java-standard/tree/main/api_dev/src/main/java/com/google/appengine/api) enabling you to start your app on your machine, rather than having to deploy in the cloud each time you make a change.

To use the services in the cloud, however, you can use Google's built-in [remote APIs](https://cloud.google.com/appengine/docs/standard/java/tools/remoteapi) ([code](https://github.com/GoogleCloudPlatform/appengine-java-standard/tree/main/remoteapi/src/main/java/com/google/appengine/tools/remoteapi)) that let you transparently access App Engine services from any Java application. For example, you can use the Remote API to access a production Datastore from an app running on your local machine. You can also use Remote API to access the Datastore of one App Engine application from a different App Engine application.

In the [runtime folder](https://github.com/GoogleCloudPlatform/appengine-java-standard/tree/main/runtime/impl/src/main/java/com/google/apphosting), you'll be able to see how your App Engine app is started, with the underlying [Jetty](https://www.eclipse.org/jetty/) servlet container, and understand how the various components or services are configured on startup.

What's not open source today are the specific layers that tie App Engine to the underlying [Borg](https://research.google.com/pubs/pub43438.html?hl=es) cluster management system, internal to the Google infrastructure, as developers can't replicate the whole Google backend easily in their own environment.

## Why make it open source?

It's important for our customers to not be locked in a particular tool, environment, or vendor, and give them the liberty to run their workloads elsewhere, and understand how we actually run their code. That's why Google Cloud follows an [Open Cloud](https://cloud.google.com/open-cloud) approach, and participates actively in the open source ecosystem. Our open cloud approach enables you to develop software faster, innovate more easily, and scale more efficiently---while also reducing technology risk. Through the years, we've open sourced various technologies, like [Kubernetes](https://kubernetes.io/), based on our experience of running containers at scale, or the [gVisor](https://gvisor.dev/) sandbox, an application kernel for containers that provides efficient defense-in-depth anywhere, and which was pioneered by the App Engine environment, as gVisor was its sandbox environment.

By open sourcing the App Engine Java runtime, we're making the first step towards letting you run the whole App Engine environment wherever you want: on your local development environment, on-premise in your own data center, or potentially on our other computing platforms like [Cloud Run](https://cloud.google.com/run/). We're also making a key step towards easier transitions for future runtimes based on newer Long-Term Support versions of the Java programming language. 

Finally, being able to compile, test and release the Java runtime environment for Java 8, Java 11 and soon Java 17 from an open source platform is much easier than relying on the huge internal Google mono repository system which is intended to support only one single version of everything, including a single JDK toolchain. We are releasing the binary artifacts in the [Maven central repository](https://repo1.maven.org/maven2/com/google/appengine/), including Javadocs and sources to find the relevant code regarding exceptions raised during runtime execution.

## Going further

If you're not familiar with App Engine yet, be sure to check out our [online resources](https://cloud.google.com/appengine) about this powerful and scalable serverless application platform on our website. And get started with the tutorials on the [Java 8](https://cloud.google.com/appengine/docs/standard/java/runtime) or [Java 11 standard environment](https://cloud.google.com/appengine/docs/standard/java11/services/access). To learn more about this open source App Engine Java runtime, please visit our [repository](https://github.com/GoogleCloudPlatform/appengine-java-standard) on Github, to discover how the serverless secret sauce is made. And if you're feeling like helping and [contributing](https://github.com/GoogleCloudPlatform/appengine-java-standard/blob/main/CONTRIBUTING.md), we're looking forward to hearing from you, by filing new [tickets](https://github.com/GoogleCloudPlatform/appengine-java-standard/issues) or by preparing some [pull requests](https://github.com/GoogleCloudPlatform/appengine-java-standard/pulls).

[](https://cloud.google.com/blog/products/application-development/turn-it-up-to-eleven-java-11-runtime-comes-to-app-engine)