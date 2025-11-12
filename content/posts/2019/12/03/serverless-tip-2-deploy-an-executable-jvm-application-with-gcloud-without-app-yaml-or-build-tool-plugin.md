---
title: "Serverless tip #2 — Deploy an executable JVM application with gcloud without app.yaml or build tool plugin"
date: 2019-12-03T16:46:44+01:00
tags:
- google-cloud
- app-engine
- java
- tips

similar:
  - "posts/2019/06/21/turn-it-up-to-eleven-java-11-runtime-comes-to-app-engine.md"
  - "posts/2019/11/29/serverless-tip-1-deploy-a-standalone-jvm-web-app-with-gradle-and-the-app-engine-plugin.md"
  - "posts/2019/07/04/getting-started-with-micronaut-on-google-app-engine-java-11.md"
---

Requirements:

-   an existing Google Cloud Platform account and project
-   a Java or alternative language web application
-   a build that creates a standalone executable JAR file

Usually App Engine applications in Java are deployed with the gcloud command-line interface, or via a Maven or Gradle build plugin. 
Either way, an `app.yaml` file to describe your application is required to let the cloud SDK know that the project at hand is an App Engine project.

With the Java 11 runtime, however, it's possible to deploy a standalone executable JAR without `app.yaml`. 
The `gcloud app deploy` command now takes also a path to a standalone JAR file:

```bash
gcloud app deploy path/to/app.jar
```

App Engine will automatically assume that you are deploying to the Java 11 runtime, using an F1 instance (256MB of RAM and 600MHz of CPU). 
So this deployment would be equivalent to having a simple app.yaml file as follows:

```yaml
runtime: java11
instance_class: F1

```

More information:

-   [gcloud app deploy](https://cloud.google.com/sdk/gcloud/reference/app/deploy) command details
-   [app.yaml](https://cloud.google.com/appengine/docs/standard/java11/config/appref)
-   [Announcement and example with Maven and Spring](https://cloud.google.com/blog/products/application-development/app-engine-java-11-is-ga-deploy-a-jar-scale-it-all-fully-managed)