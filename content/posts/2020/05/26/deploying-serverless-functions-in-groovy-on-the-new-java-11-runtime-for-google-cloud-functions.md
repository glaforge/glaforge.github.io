---
title: "Deploying serverless functions in Groovy on the new Java 11 runtime for Google Cloud Functions"
date: 2020-05-26T13:05:07+01:00
tags:
- groovy
- google-cloud
- cloud-functions
- java
- serverless

similar:
  - "posts/2020/05/26/sip-a-cup-of-java-11-for-your-cloud-functions.md"
  - "posts/2020/05/27/introducing-java-11-on-google-cloud-functions.md"
  - "posts/2019/07/04/getting-started-with-micronaut-on-google-app-engine-java-11.md"
---

Java celebrates its 25th anniversary!  
Earlier this year, the Apache Groovy team released the big 
[3.0 version](https://groovy-lang.org/releasenotes/groovy-3.0.html) of the programming language. 
[GMavenPlus](https://github.com/groovy/GMavenPlus/releases/tag/1.9.0) was published in version 1.9 
(the Maven plugin for compiling Groovy code) which works with Java 14.
And today, Google Cloud opens up the beta of the 
[Java 11 runtime for Cloud Functions](https://cloud.google.com/blog/products/application-development/introducing-java-11-on-google-cloud-functions). 
What about combining them all?

I've been working for a bit on the Java 11 runtime for Google Cloud Functions 
(that's the Function-as-a-Service platform of Google Cloud, pay-as-you-go, hassle-free / transparent scaling), 
and in this article, I'd like to highlight that you can also write and deploy functions with alternative JVM languages 
like [Apache Groovy](http://groovy-lang.org/).

So today, you're going to:

-   Write a simple Groovy 3.0 function,
-   Compile it with Maven 3.6 and the GMavenPlus 1.9 plugin, 
-   Deploy and run the function on the Cloud Functions Java 11 runtime!

Note: If you want to try this at (work from?) home, you will need an account on Google Cloud, 
you can easily create a [free account](https://cloud.google.com/free) 
and benefit from $300 of cloud credits to get started (including also free quotas for many products). 
You will also need to create a billing account, but for the purpose of this tutorial, 
you should be within the free quota (so your credit card shouldn't be billed). 
Then, head over to the [console.cloud.google.com](https://console.cloud.google.com/) cloud console to create a new project. 
And then navigate to the Cloud Functions section to enable the service for your project.

Let's get started! So what do we need? A pom.xml file, and a Groovy class!

Let's start with the `pom.xml` file, and what you should add to your build file. 
First of all, since I'm using Groovy as my function implementation language, I'm going to use GMavenPlus for compilation. 
So in the build/plugins section, I configure the plugin as follows:

```xml
      <plugin>
        <groupId>org.codehaus.gmavenplus</groupId>
        <artifactId>gmavenplus-plugin</artifactId>
        <version>1.9.0</version>
        <executions>
          <execution>
            <id>groovy-compile</id>
            <phase>process-resources</phase>
            <goals>
              <goal>addSources</goal>
              <goal>compile</goal>
            </goals>
          </execution>
        </executions>
        <dependencies>
          <dependency>
            <groupId>org.codehaus.groovy</groupId>
            <artifactId>groovy-all</artifactId>
            <version>3.0.4</version>
            <scope>runtime</scope>
            <type>pom</type>
          </dependency>
        </dependencies>
      </plugin>

```

That way, when I do an `mvn compile`, my Groovy sources are compiled as part of the compilation lifecycle of Maven.

But I'm adding a second plugin, the Functions Framework plugin! 
That's a Maven plugin to run functions locally on your machine, 
before deploying into the cloud, so that you can have a local developer experience that's easy and fast. 
The [Functions Framework](https://github.com/GoogleCloudPlatform/functions-framework-java) is actually an open source project on Github. 
It's a lightweight API to write your functions with, and it's also a function runner / invoker. 
What's interesting is that it also means that you are not locked in the Cloud Functions platform, 
but you can run your function locally or anywhere else where you can run a JAR file on a JVM! Great portability!

So let's configure the Functions Framework Maven plugin:

```xml
      <plugin>
        <groupId>com.google.cloud.functions</groupId>
        <artifactId>function-maven-plugin</artifactId>
        <version>0.9.2</version>
        <configuration>
          <functionTarget>mypackage.HelloWorldFunction</functionTarget>
        </configuration>
      </plugin>
```

I specify a configuration flag to point at the function I want to run. 
But we'll come back in a moment on how to run this function locally. We need to write it first!

We need two more things in our `pom.xml`, a dependency on Groovy, but also on the Functions Framework Java API.

```xml
    <dependency>
      <groupId>com.google.cloud.functions</groupId>
      <artifactId>functions-framework-api</artifactId>
      <version>1.0.1</version>
      <scope>provided</scope>
    </dependency>

    <dependency>
      <groupId>org.codehaus.groovy</groupId>
      <artifactId>groovy-all</artifactId>
      <version>3.0.4</version>
      <type>pom</type>
    </dependency>
```

So you're all set for the build, let's now create our function in `src/main/groovy/mypackage/HelloWorldFunction.groovy`.

There are two flavors of functions: [HTTP functions](https://cloud.google.com/functions/docs/writing/http) and 
[background functions](https://cloud.google.com/functions/docs/writing/background). 
The latter react to cloud events like a new file stored in Cloud Storage, a new data update in the Firestore database, etc. 
Whereas the former directly exposes a URL that can be invoked via an HTTP call. 
That's the one I want to create to write a symbolic `"Hello Groovy World"` message in your browser window.

```groovy
package mypackage

import com.google.cloud.functions.*

class HelloWorldFunction implements HttpFunction {
    void service(HttpRequest request, HttpResponse response) {
        response.writer.write "Hello Groovy World!"
    }
}
```

Yes, that's all there is to it! 
You implement a Functions Framework interface, and its `service()` method. 
You have a `request` / `response` mode (a `request` and a `response` parameters are passed to your method). 
You can access the writer to write back to the browser or client that invoked the function.

Now it's time to run the function locally to see if it's working. Just type the following command in your terminal:

```bash
mvn function:run
```

After a moment, and some build logs further, you should see something like:

```
INFO: Serving function...
INFO: Function: mypackage.HelloWorldFunction
INFO: URL: http://localhost:8080/
```

With your browser (or curl), you can browse this local URL, and you will see the hello world message appearing. Yay!

With the Maven plugin, you can also deploy, but you can use the [gcloud](https://cloud.google.com/sdk) 
command-line tool to deploy the function:

```bash
gcloud functions deploy helloFunction\
    --region europe-west1\
    --trigger-http --allow-unauthenticated\
    --runtime java11\
    --entry-point mypackage.HelloWorldFunction\
    --memory 512MB
```

After a little moment, the function is deployed, and you'll notice you'll have a URL created for your function looking something like this:

```
https://europe-west1-myprojectname.cloudfunctions.net/helloFunction
```

The very same function now runs in the cloud! 
A pretty Groovy function! This function is portable: 
you can invoke it with the Functions Framework invoker, anywhere you can run a JVM.

Going further, I encourage you to have a look at the [Functions Framework documentation on 
Github](https://github.com/GoogleCloudPlatform/functions-framework-java) to learn more about it. 
Here you deployed the function source and the pom.xml file, as the function will be built directly in the cloud. 
But it's also possible to compile and create a JAR locally and deploy that instead. 
That's interesting for example if you want to use another build tool, like Gradle. And this will be the purpose of another upcoming article!