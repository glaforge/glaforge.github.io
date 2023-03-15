---
title: "Introducing Java 11 on Google Cloud Functions"
date: 2020-05-27T11:47:45+01:00
tags:
- google-cloud
- cloud-functions
- java
canonical: "https://cloud.google.com/blog/products/application-development/introducing-java-11-on-google-cloud-functions"
---

The Java programming language recently turned 25 years old, and it's still one of the top-used languages powering today's enterprise application customers. On Google Cloud, you can already run serverless Java microservices in App Engine and Cloud Run. Today we're bringing Java 11 to Google Cloud Functions, an event-driven serverless compute platform that lets you run locally or in the cloud without having to provision servers. That means you can now write Cloud Functions using your favorite JVM languages ([Java](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/functions/helloworld/helloworld), [Kotlin](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/functions/helloworld/kotlin-helloworld), [Groovy](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/functions/helloworld/groovy-helloworld), [Scala](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/functions/helloworld/scala-helloworld), etc) with our [Functions Framework for Java](https://github.com/GoogleCloudPlatform/functions-framework-java), and also with [Spring Cloud Functions](https://cloud.spring.io/spring-cloud-static/spring-cloud-function/3.0.6.RELEASE/reference/html/gcp.html) and [Micronaut](https://micronaut-projects.github.io/micronaut-gcp/2.0.x/guide/#simpleFunctions)!

With Cloud Functions for Java 11, now in beta, you can use Java to build business-critical applications and integration layers, and deploy the function in a fully managed environment, complete with access to resources in a private VPC network. Java functions will scale automatically based on your load. You can write [HTTP functions](https://cloud.google.com/functions/docs/writing/http) to respond to HTTP events, and [background functions](https://cloud.google.com/functions/docs/writing/background) to process events sourced from various cloud and GCP services, such as Pub/Sub, Cloud Storage, Firestore, and more.

![/img/j11gcf/Cloud_Functions__Product_Strategy-01.jpg](/img/j11gcf/Cloud_Functions__Product_Strategy-01.jpg)

Functions are a great fit for serverless application backends for integrating with third-party services and APIs, or for mobile or IoT backends. You can also use functions for real-time data processing systems, like processing files as they are uploaded to Cloud Storage, or to handle real-time streams of events from Pub/Sub. Last but not least, functions can serve intelligent applications like virtual assistants and chat bots, or video, image and sentiment analysis.

## Cloud Functions for Java 11 example

{{< youtube UsYRKkibLPI >}}

You can develop functions using the [Functions Framework for Java](https://github.com/GoogleCloudPlatform/functions-framework-java/), an open source functions-as-a-service framework for writing portable Java functions. You can develop and run your functions locally, deploy them to Cloud Functions, or to another Java environment.

An HTTP function simply implements the [`HttpFunction`](https://javadoc.io/static/com.google.cloud.functions/functions-framework-api/1.0.1/com/google/cloud/functions/HttpFunction.html) interface:

```java
public class HelloWorld implements HttpFunction {
    @Override
    public void service(HttpRequest request, HttpResponse response)
        throws IOException {
        var writer = response.getWriter();
        writer.write("Hello world!");
    }
}
```

Add the Functions Framework API dependency to the Maven pom.xml:


```xml
<dependency>
    <groupId>com.google.cloud.functions</groupId>
    <artifactId>functions-framework-api</artifactId>
    <version>1.0.1</version>
    <scope>provided</scope>
</dependency>
```

Then add the the [Function Maven plugin](https://github.com/GoogleCloudPlatform/functions-framework-java#running-a-function-with-the-maven-plugin) so you can run the function locally:

```xml
<plugin>
 <groupId>com.google.cloud.functions</groupId>
 <artifactId>function-maven-plugin</artifactId>
 <version>0.9.2</version>
 <configuration>
 <functionTarget>function.HelloWorld</functionTarget>
 </configuration>
</plugin>
```

Run the function locally:

```bash
mvn function:run
```

You can also use your IDE to launch this Maven target in Debugger mode to debug the function locally.

![/img/j11gcf/2_Cloud_Functions_for_Java_11.max-900x900.png](/img/j11gcf/2_Cloud_Functions_for_Java_11.max-900x900.png)

To deploy the function, you can use the gcloud command line:

```bash
gcloud beta functions deploy helloworld-function \
 --entry-point function.HelloWorld --runtime java11 --trigger-http
```

Alternatively, you can also deploy with the Function Maven plugin:

```bash
mvn function:deploy -Dfunction.deploy.name=helloworld-function
```


You can find the [full example on GitHub](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/functions/helloworld/helloworld). In addition to running this function in the fully managed Cloud Functions environment, you can also [bring the Functions Framework runtime](https://github.com/GoogleCloudPlatform/functions-framework-java#running-the-functions-framework-directly) with you to other environments, such as Cloud Run, Google Kubernetes Engine, or a virtual machine. In addition, Java 8 users can now take advantage of Java 11 features. The majority of the use cases of the Java 8 programming model are supported in Java 11.

## Third-party framework support

In addition to our Functions Framework for Java, both the [Micronaut ](https://micronaut-projects.github.io/micronaut-gcp/2.0.x/guide/#simpleFunctions)framework and the [Spring Cloud Function](https://spring.io/projects/spring-cloud-function) project now have out-of-the-box support for Google Cloud Functions. You can create both an HTTP function and background function using the respective framework's programming model, including capabilities like dependency injection.

### Micronaut

The Micronaut team implemented dedicated support for the Cloud Functions Java 11 runtime. Instead of implementing Functions Framework's HttpFunction interface directly, you can use Micronaut's programming model, such that a Helloworld HTTP Function can simply be a [Micronaut controller](https://docs.micronaut.io/2.0.0.M2/guide/index.html#creatingServer):

```java
@Controller("/hello")
public class HelloController {
    @Get("/{name}")
    String greet(String name) {
        return "Hello " + name;
    }
}
```

You can find a [full example of Micronaut with Cloud Functions](https://github.com/micronaut-projects/micronaut-gcp/tree/master/examples/hello-world-cloud-function) and its [documentation](https://micronaut-projects.github.io/micronaut-gcp/snapshot/guide/#httpFunctions) on GitHub.

### Spring Cloud Functions

The Google Cloud Java Frameworks team worked with the Spring team to bring [Spring Cloud GCP](https://spring.io/projects/spring-cloud-gcp) project to help Spring Boot users easily leverage Google Cloud services. More recently, the team worked with the Spring Cloud Function team to bring you [Spring Cloud Function GCP Adapter](https://cloud.spring.io/spring-cloud-static/spring-cloud-function/3.0.7.RELEASE/reference/html/gcp.html). A function can just be a vanilla Java function, so you can run a Spring Cloud Function application on Cloud Functions without having to modify your code to run on Google Cloud.

```java
@Bean
public Function<String, String> uppercase() {
    return value -> value.toUpperCase();
}
```

You can find a full example of a [Spring Cloud Function with Cloud Functions](https://github.com/spring-cloud/spring-cloud-function/tree/master/spring-cloud-function-samples/function-sample-gcp-http) on GitHub.

## JVM Languages

In addition to using the [latest Java 11 language features](https://advancedweb.hu/new-language-features-since-java-8-to-14/) with Cloud Functions, you can also use your favorite JVM languages, such as Kotlin, Groovy, and Scala, and more. For example, here's a function written with Kotlin:

```kotlin
class HelloWorld : HttpFunction {
    fun helloWorld(req: HttpRequest, res: HttpResponse) {
        with(res.writer) {
            write("Hello Kotlin World!")
        }
    }
}
```

Here's the same function with Groovy:

```groovy
class HelloWorld implements HttpFunction {
    void service(HttpRequest req, HttpResponse res) {
        res.writer.write("Hello Groovy World!")
    }
}
```

You can take a [deeper dive into a Groovy example](http://glaforge.appspot.com/article/deploying-serverless-functions-in-groovy-on-the-new-java-11-runtime-for-google-cloud-functions), and otherwise, find all the examples on GitHub ([Kotlin](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/functions/helloworld/kotlin-helloworld), [Groovy](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/functions/helloworld/groovy-helloworld), [Scala](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/functions/helloworld/scala-helloworld)).

## Try Cloud Functions for Java 11 today

Cloud Functions for Java 11 is now in beta, so you can try it today with your favorite JVM language and frameworks. Read the [Quick Start guide](https://cloud.google.com/functions/docs/quickstart-java), learn how to [write your first functions](https://cloud.google.com/functions/docs/first-java), and try it out with a Google Cloud Platform [free trial](https://cloud.google.com/free). If you want to dive a little bit deeper into the technical aspects, you can also read this [article on Google Developers blog](https://developers.googleblog.com/2020/05/java-11-for-cloud-functions.html). If you're interested in the [open-source Functions Framework](https://github.com/GoogleCloudPlatform/functions-framework-java) for Java, please don't hesitate to have a look at the project and potentially even contribute to it. We're looking forward to seeing all the Java the functions you write! 

* * * * *

*Special thanks to Googlers Éamonn McManus, Magda Zakrzewska‎, Sławek Walkowski, Ludovic Champenois, Katie McCormick, Grant Timmerman, Ace Nassri, Averi Kitsch, Les Vogel, Kurtis Van Gent, Ronald Laeremans, Mike Eltsufin, Dmitry Solomakha, Daniel Zou, Jason Polites, Stewart Reichling, Michael Skura, Karol Farbiś, and Vinod Ramachandran. We also want to thank [Micronaut](https://micronaut.io/) and [Spring Cloud Function](https://spring.io/projects/spring-cloud-function) teams for working on the Cloud Functions support!*
