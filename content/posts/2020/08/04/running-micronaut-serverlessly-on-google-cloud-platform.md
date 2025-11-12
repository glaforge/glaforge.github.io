---
title: "Running Micronaut serverlessly on Google Cloud Platform"
date: 2020-08-04T18:49:49+01:00
tags:
- google-cloud
- cloud-run
- app-engine
- cloud-functions
- serverless
- micronaut

similar:
  - "posts/2022/10/24/build-deploy-java-17-apps-on-cloud-run-with-cloud-native-buildpacks-on-temurin.md"
  - "posts/2020/03/24/start-the-fun-with-java-14-and-micronaut-inside-serverless-containers-on-cloud-run.md"
  - "posts/2019/07/04/getting-started-with-micronaut-on-google-app-engine-java-11.md"
---

Last week, I had the pleasure of presenting [Micronaut](https://micronaut.io/) in action on Google Cloud Platform, via a [webinar](https://objectcomputing.com/products/micronaut/resources/serverless-micronaut-on-google-cloud) organized by OCI. Particularly, I focused on the serverless compute options available: [Cloud Functions](https://cloud.google.com/functions), [App Engine](http://cloud.google.com/appengine), and [Cloud Run](https://cloud.google.com/run).

Here are the slides I presented. However, the real meat is in the demos which are not displayed on this deck! So let's have a closer look at them, until the video is published online.

{{< speakerdeck 9da7fe86bd4047508effb1ae34af5ed0 >}}

On Google Cloud Platform, you have three solutions when you want to deploy your code in a serverless fashion (ie. hassle-free infrastructure, automatic scaling, pays-as-you-go): 

-   For event-oriented logic that reacts to cloud events (a new file in cloud storage, a change in a database document, a Pub/Sub message) you can go with a function. 
-   For a web frontend, a REST API, a mobile API backend, also for serving static assets for single-page apps, App Engine is going to do wonders. 
-   But you can also decide to containerize your applications and run them as containers on Cloud Run, for all kinds of needs.

Both Cloud Functions and App Engine provide a Java 11 runtime (the latest LTS version of Java at the time of writing), but with Cloud Run, in a container, you can of course package whichever Java runtime environment that you want.

And the good news is that you can run Micronaut easily on all those three environments!

## Micronaut on Cloud Functions

### HTTP functions

Of those three solutions, Cloud Functions is the one that received a special treatment, as the Micronaut team worked on a [dedicated integration](https://micronaut-projects.github.io/micronaut-gcp/2.0.x/guide/#cloudFunction) with the [Functions Framework API](https://github.com/GoogleCloudPlatform/functions-framework-java) for Java. Micronaut supports both types of functions: HTTP and background functions.

For HTTP functions, you can use a plain Micronaut controller. Your usual controllers can be turned into an HTTP function.

```java
package com.example;

import io.micronaut.http.annotation.*;

@Controller("/hello")
public class HelloController {
    @Get(uri="/", produces="text/plain")
    public String index() {
        return "Micronaut on Cloud Functions";
    }
}
```

Micronaut Launch tool even allows you to create a dedicated scaffolded project with the right configuration (ie. the right Micronaut integration JAR, the Gradle configuration, including for running functions locally on your machine.) Pick the application type in the Launch configuration, and add the `google-cloud-function` module.

In build.gradle, Launch will add the Functions Frameworks' invoker dependency, which allows you to run your functions locally on your machine (it's also the framework that is used in the cloud to invoke your functions, ie. the same portable and open source code):

```groovy
invoker("com.google.cloud.functions.invoker:java-function-invoker:1.0.0-beta1")
```

It adds the Java API of the Functions Framework, as `compileOnly` as it's provided by the platform when running in the cloud:

```groovy
compileOnly("com.google.cloud.functions:functions-framework-api")
```

And Micronaut's own GCP Functions integration dependency:

```groovy
implementation("io.micronaut.gcp:micronaut-gcp-function-http")
```

And there's also a new task called `runFunction`, which allows you to run your function locally:

```bash
./gradlew runFunction
```

If you decide to use Maven, the same dependencies are applied to your project, but there's a dedicated Maven plugin that is provided to run functions locally.

```
./mvnw function:run
```

Then to deploy your HTTP function, you can learn more about the topic in the [documentation](https://cloud.google.com/functions/docs/deploying). If you deploy with the gcloud command-line SDK, you will deploy with a command similar to the following one (depending on the region, or size of the instance you want to use):

```bash
gcloud functions deploy hello \
    --region europe-west1 \
    --trigger-http --allow-unauthenticated \
    --runtime java11 --memory 512MB \
    --entry-point io.micronaut.gcp.function.http.HttpFunction
```

Note that Cloud Functions can build your functions from sources when you deploy, or it can deploy a pre-build shadowed JAR (as configured by Launch.)

### Background functions

For background functions, in Launch, select the Micronaut serverless function type. Launch will create a class implementing the BackgroundFunction interface from the Function Frameworks APIs. But it will extend the `GoogleFunctionInitializer` class from Micronaut's function integration, which takes care of all the usual wiring (like dependency injection). This function by default receives a Pub/Sub message, but there are other types of events that you can receive, like when a new file is uploaded in cloud storage, a new or changed document in the Firestore nosql document database, etc.

```java
package com.example;

import com.google.cloud.functions.*;
import io.micronaut.gcp.function.GoogleFunctionInitializer;
import javax.inject.*;
import java.util.*;

public class PubSubFunction extends GoogleFunctionInitializer
        implements BackgroundFunction {
    @Inject LoggingService loggingService;
    @Override
    public void accept(PubSubMessage pubsubMsg, Context context) {
        String textMessage = new String(Base64.getDecoder().decode(pubsubMsg.data));
        loggingService.logMessage(textMessage);
    }
}

class PubSubMessage {
    String data;
    Map attributes;
    String messageId;
    String publishTime;
}

@Singleton
class LoggingService {
    void logMessage(String txtMessage) {
        System.out.println(txtMessage);
    }
}
```

When deploying, you'll define a different trigger, for example here, it's a Pub/Sub message, so you'll use a `--trigger-topic TOPIC_NAME` flag to tell the platform you want to receive messages on that topic.

For deployment, the gcloud command would look as follows:

```bash
gcloud functions deploy pubsubFn \
    --region europe-west1 \
    --trigger-topic TOPIC_NAME \
    --runtime java11 --memory 512MB \
    --entry-point com.example.PubSubFunction
```

## Micronaut on App Engine

Micronaut deploys fine as well on App Engine. I [wrote about it]({{< ref "/posts/2019/07/04/getting-started-with-micronaut-on-google-app-engine-java-11" >}}) in the past already. If you're using Micronaut Launch, just select the Application type. App Engine allows you to deploy the standalone runnable JARs generated by the configured shadow JAR plugin. But if you want to easily stage your application deliverable, to run the application locally, to deploy, you can also use the Gradle App Engine plugin.

For that purpose, you should add the following build script section in `build.gradle`:

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.google.cloud.tools:appengine-gradle-plugin:2.3.0'
    }
}
```

And then apply the plugin with:

```groovy
apply plugin: 'com.google.cloud.tools.appengine'
```

Before packaging the application, there's one extra step you need to go through, which is to add the special App Engine configuration file: app.yaml. You only need to add one line, unless you want to further configure the instance types, specify some JVM flags, point at static assets, etc. But otherwise, you only need this line in `src/main/appengine/app.yaml`:

```yaml
runtime: java11
```

Then, stage your application deliverable with:

```bash
./gradlew appengineStage
```

Cd in the directory, and you can deploy with the plugin or with the gcloud SDK:

```bash
cd build/staged-app/
gcloud app deploy
```

During the demonstration, I showed a controller that was accessing some data from the [Cloud Firestore](https://cloud.google.com/firestore/) nosql database, listing some pet names:

```java
package com.example;

import java.util.*;
import com.google.api.core.*;
import com.google.cloud.firestore.*;
import com.google.cloud.firestore.*;
import io.micronaut.http.annotation.*;

@Controller("/")
public class WelcomeController {
    @Get(uri="/", produces="text/html")
    public String index() {
        return "Hello Google Cloud!";
    }

    @Get(uri="/pets", produces="application/json")
    public String pets() throws Exception {
        StringBuilder petNames = new StringBuilder().append("[");
        FirestoreOptions opts = FirestoreOptions.getDefaultInstance();
        Firestore db = opts.getService();
        ApiFuture query = db.collection("pets").get();
        QuerySnapshot querySnapshot = query.get();
        List documents = querySnapshot.getDocuments();
        for (QueryDocumentSnapshot document : documents) {
            petNames.append("\"")
                .append(document.getString("name"))
                .append("\", ");
        }
        return petNames.append("]").toString();
    }
}
```

## Micronaut on Cloud Run

### Building a Micronaut container image with Jib

In a previous article, I talked about how to try [Micronaut with Java 14 on Google Cloud]({{< ref "/posts/2020/03/24/start-the-fun-with-java-14-and-micronaut-inside-serverless-containers-on-cloud-run" >}}). I was explaining how to craft your own `Dockerfile`, instead of the one generated then by default by Micronaut Launch (now, it is using `openjdk:14-alpine`). But instead of fiddling with Docker, in my demos, I thought it was cleaner to use Jib. [Jib](https://github.com/GoogleContainerTools/jib) is a tool to create cleanly layered container images for your Java applications, without requiring a Docker daemon. There are plugins available for Gradle and Maven, I used the Gradle one by configuring my `build.gradle` with:

```groovy
plugins {
    ...
    id "com.google.cloud.tools.jib" version "2.4.0"
}
```

And by configuring the `jib` task with:

```groovy
jib {
    to {
        image = "gcr.io/serverless-micronaut/micronaut-news"
    }
    from {
        image = "openjdk:14-alpine"
    }
}
```

The from/image line defines the base image to use, and the `to`/`image` points at the location in Google Cloud Container Registry where the image will be built, and we can then point Cloud Run at this image for deployment:

```bash
gcloud config set run/region europe-west1
gcloud config set run/platform managed

./gradlew jib

gcloud run deploy news --image gcr.io/serverless-micronaut/micronaut-news --allow-unauthenticated
```

## Bonus points: Server-Sent Events

In the demo, I showed the usage of [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events). Neither Cloud Functions nor App Engine support any kind of streaming, as there's a global frontend server in the Google Cloud infrastructure that buffers requests and responses. But Cloud Run supports streaming (HTTP/2 streaming, gRPC streaming, server-sent events, and WebSocket streaming).

So that was a great excuse to play with Micronaut's SSE support. I went with a slightly modified example from the documentation, to emit a few string messages a second apart:

```java
package com.example;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import io.micronaut.http.sse.Event;
import io.micronaut.scheduling.TaskExecutors;
import io.micronaut.scheduling.annotation.ExecuteOn;
import io.reactivex.Flowable;
import org.reactivestreams.Publisher;

@Controller("/news")
public class NewsController {
    @ExecuteOn(TaskExecutors.IO)
    @Get(produces = MediaType.TEXT_EVENT_STREAM)
    public Publisher> index() { 
        String[] ids = new String[] { "1", "2", "3", "4", "5" };
        return Flowable.generate(() -> 0, (i, emitter) -> { 
            if (i < ids.length) {
                emitter.onNext( 
                    Event.of("Event #" + i)
                );
                try { Thread.sleep(1000); } catch (Throwable t) {}
            } else {
                emitter.onComplete(); 
            }
            return ++i;
        });
    }
}
```

Then I accessed the /news controller and was happy to see that the response was not buffered and that the events were showing up every second.

Apart from getting on board of this alpha feature of Cloud Run (via the form mentioned to get my GCP project whitelisted), I didn't have to do anything special to my Micronaut setup from the previous section. No further configuration required, it just worked out of the box.

## Summary

The great benefit to using Micronaut on Google Cloud Platform's serverless solutions is that thanks to Micronaut's ahead-of-time compilation techniques, it starts and runs super fast, and consumes much less memory than other Java frameworks. Further down the road, you can also take advantage of GraalVM for even faster startup and lower memory usage. Although my examples were in Java, you can also use Kotlin or Groovy if you prefer.