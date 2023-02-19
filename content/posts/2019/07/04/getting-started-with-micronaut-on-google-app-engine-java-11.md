---
title: "Getting started with Micronaut on Google App Engine Java 11"
date: 2019-07-04T17:07:02+01:00
tags:
- google-cloud
- app-engine
- micronaut
- java
- groovy
---

A [new Java runtime was announced for Google App Engine](https://cloud.google.com/blog/products/application-development/turn-it-up-to-eleven-java-11-runtime-comes-to-app-engine) standard: with Java 11. It's currently in beta, but anybody can already try it out. Another interesting announcement was the fact that the instances running your apps now get [double the memory](https://cloud.google.com/blog/products/application-development/app-engine-second-generation-runtimes-now-get-double-the-memory-plus-go-112-and-php-73-now-generally-available)! So with this double dose of great news, I decided to craft a little tutorial to show how to deploy a Micronaut application on App Engine Java 11. And because Apache Groovy is, well, groovy, I'll go ahead and use Groovy for my programming language, but of course, the same steps apply to Java workloads as well.

## Getting started on Google Cloud Platform

In this article, I assume you've created an account on Google Cloud Platform already (follow the "getting started" blue buttons to create an account otherwise and benefit from the [free tier and free quota](https://cloud.google.com/free/)), and that you've downloaded and installed the [gcloud](https://cloud.google.com/sdk/gcloud/) command-line SDK. You'll be able to follow the first few steps in the [quickstart guide](https://cloud.google.com/appengine/docs/standard/java11/quickstart), to create your GCP project and make it ready for using App Engine, in particular those commands:

```bash
$ gcloud projects create mn113-gae-java11 --set-as-default
```

You'll have to change the project ID from `"mn113-gae-java11"` to your own name of choice.

```bash
$ gcloud app create --project=mn113-gae-java11
```

It'll ask for a cloud region to use, I've decided to go with europe-west for this one.

The above steps can as well be done from the cloud console UI as well, at [https://console.cloud.google.com](https://console.cloud.google.com/).

Although your application will run for free within the free quota, we need to enable billing for our app, as it's going to use Cloud Build to build our app, and the latter requires billing to be enabled.

To enable billing and the Cloud Build API, please follow the first step of the [quickstart guide](https://cloud.google.com/appengine/docs/standard/java11/quickstart) mentioned above.

## Building our Micronaut application

Time to fire the Micronaut goodness! On my machine, I'm using SDKman to install my SDKs, so I've installed Java 11 and Micronaut 1.1.3 as explained in [Micronaut's getting started guide](https://docs.micronaut.io/latest/guide/index.html#buildCLI).

Our first step will be to create our basic Micronaut application, thanks to the following command, with the mn command-line SDK:

```bash
$ mn create-app mn113-gae-java11 --lang=groovy
```

The structure of your Micronaut project is created, with a Gradle-based build, an Application main class, an `application.yml` file to configure your application.

As this application isn't yet doing anything useful, we're create a `"Hello World"` controller with:

```bash
$ mn create-controller hello
```

We'll modify this newly created HelloController.groovy controller as follows:

```groovy
package mn113.gae.java11

import io.micronaut.http.annotation.*
@Controller("/hello")
class HelloController {
    @Get("/")
    String index() {
        return "Hello Micronaut!"
    }
}
```

 |

On the `/hello` path, we'll simply return a plain text response showing our greeting message.

To run your application locally, to check everything is working fine, you'll simply run:

```bash
$ ./gradlew run
```

And you can check that `localhost:8080/hello` returns the `Hello Micronaut` message. So far so good.

## Configure our Micronaut application for App Engine

In order to deploy the App Engine, we'll use the App Engine Gradle plugin. So we need to amend our `build.gradle` a little.

Let's define where Gradle will find the plugin:

```groovy
buildscript {
    repositories {
        jcenter()
        mavenCentral()
    }
    dependencies {
        classpath 'com.google.cloud.tools:appengine-gradle-plugin:2.+'
    }
}
```

We'll make use of the plugin:

```groovy
apply plugin: "com.google.cloud.tools.appengine-appyaml"
```

Let's configure the App Engine section:

```groovy
appengine {
    stage.artifact =
            "${buildDir}/libs/${project.name}-${project.version}.jar"
    deploy {
        projectId = "mn113-gae-java11"
        version = "1"
    }
}
```

Note that App Engine's version string is not supporting dots or underscores (only alphanumeric characters), hence why I replaced the `version` property. Furthermore a reported [issue](https://github.com/GoogleCloudPlatform/app-gradle-plugin/issues/353) prevents me from reusing the Gradle project's own project property in the `projectId` property.

## Configure the App Engine deployment

App Engine has its own deployment configuration file, where you will define the App Engine runtime (in our case Java 11), and you can also decide what kind of instance will be used to run your code. Last but not least, you can customize the entry point which defines how your application should be started.

In `src/main/appengine` we'll add a file named app.yaml:

```yaml
runtime: java11
instance_class: F4
entrypoint: 'java -agentpath:/opt/cdbg/cdbg_java_agent.so=--log_dir=/var/log -jar mn113-gae-java11-0.1.jar'
```

## Deploying to App Engine

Now you're ready to deploy your Micronaut application on App Engine's Java 11 runtime!

```bash
$ ./gradlew appengineDeploy
```

After a minute or so, and if billing and the Cloud Build API are enabled as said in the introduction, your Micronaut app should be deployed! You can then browse <https://mn113-gae-java11.appspot.com/hello> and get your Hello Micronaut greeting.

## What's next

In upcoming articles, I'll cover some other aspects, like how to configure and optimize static asset serving, or perhaps how to integrate with databases or other services of Google Cloud Platform. So stay tuned!