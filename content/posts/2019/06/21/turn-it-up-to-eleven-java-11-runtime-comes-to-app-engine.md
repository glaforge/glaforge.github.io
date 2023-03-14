---
title: "Turn it up to eleven: Java 11 runtime comes to App Engine"
date: 2019-06-21T19:00:26+01:00
tags:
- google-cloud
- app-engine
- java
canonical: "https://cloud.google.com/blog/products/application-development/turn-it-up-to-eleven-java-11-runtime-comes-to-app-engine"
---

Yesterday, we [announced](https://cloud.google.com/blog/products/application-development/app-engine-second-generation-runtimes-now-get-double-the-memory-plus-go-112-and-php-73-now-generally-available) new second-generation runtimes for Go 1.12 and PHP 7.3. In addition, App Engine standard instances now run with double the memory. Today, we're happy to announce the availability of the new Java 11 second-generation runtime for App Engine standard in beta. Now, you can take advantage of the latest [Long-Term-Support version](https://www.oracle.com/technetwork/java/java-se-support-roadmap.html) of the Java programming language to develop and deploy your applications on our fully-managed serverless application platform.

Based on technology from the [gVisor container sandbox](https://github.com/google/gvisor), second-generation runtimes let you write portable web apps and microservices that take advantage of App Engine's unique auto-scaling, built-in security and pay-per-use billing model---without some of App Engine's earlier runtime restrictions. Second generation-runtimes also let you build applications more idiomatically. You're free to use whichever framework or library you need for your project---there are no limitations in terms of what classes you can use, for instance. You can even use native dependencies if needed. Beyond Java, you can also use alternative JVM (Java Virtual Machine) languages like [Apache Groovy](http://groovy-lang.org/), [Kotlin](https://kotlinlang.org/) or [Scala](https://www.scala-lang.org/) if you wish.

In addition to more developer freedom, you also get all the benefits of a serverless approach. App Engine can transparently scale your app up to n and back down to 0, so your application can handle the load when it's featured on primetime TV or goes viral on social networks. Likewise, it scales to zero if no traffic comes. Your bill will also be proportional to your usage, so if nobody uses your app, you won't pay a dime (there is also a free tier available).

App Engine second-generation runtimes also mean you don't need to worry about security tasks like applying OS security patches and updates. Your code runs securely in a [gVisor](https://gvisor.dev/)-based sandbox, and we update the underlying layers for you. No need to provision or manage servers yourself---just focus on your code and your ideas!

## What's new?

When you migrate to Java 11, you gain access to all the goodies of the most recent Java versions: you can now use advanced type inference with the new var keyword, create lists or maps easily and concisely with the new immutable collections, and simplify calling remote hosts thanks to the graduated HttpClient support. Last but not least, you can also use the JPMS module system introduced in Java 9.

You'll also find some changes in the Java 11 runtime. For example, the Java 11 runtime does not provide a Servlet-based runtime anymore. Instead, you need to bundle a server with your application in the form of an executable JAR. This means that you are free to choose whichever library or framework you want, be it based on the Servlet API or other networking stacks like the Netty library. In other words, feel free to use [Spring Boot](https://spring.io/projects/spring-boot), [Vert.x](https://vertx.io/), [SparkJava](http://sparkjava.com/), [Ktor](https://ktor.io/), [Helidon](https://helidon.io/#/) or [Micronaut](https://micronaut.io/) if you wish!

Last but not least, second-generation runtimes don't come with the built-in APIs like Datastore or memcache from the App Engine SDK. Instead, you can use the standalone services with their Google Cloud client libraries, or use other similar services of your choice. Be sure to look into our [migration guide](https://cloud.google.com/appengine/docs/standard/java11/java-differences) for more help on these moves.

## Getting started

To deploy to App Engine Java 11, all you need is an app.yaml file where you specify `runtime: java11`, signifying that your application should use Java 11. That's enough to tell App Engine to use the Java 11 runtime, regardless of whether you're using an executable JAR, or a WAR file with a provided servlet-container. However, the new runtime also gives you more control on how your application starts: by specifying an extra `entrypoint` parameter in `app.yaml`, you can then customize the java command flags, like the -X memory settings.

With Java 11, the `java` command now includes the ability to run single independent `*.java` files without compiling them with `javac`! For this short getting started section, we are going to use it to run the simplest hello world example with the JDK's built-in HTTP server:

```java
import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        var server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", t -> {
            var response = "Hello World from Java 11.".getBytes();
            t.sendResponseHeaders(200, response.length);
            try (var os = t.getResponseBody()) {
                os.write(response);
            }
        });
        server.start();
    }
}
```

Notice how our Main class uses the var keyword introduced in Java 10, and how we re-used the keyword again in the `try-`with-resources block, as `Java 11` makes possible.

Now it's time to prepare our `app.yaml` file. First, specify the `java11` runtime. In addition, `entrypoint` define the actual `java` command with which to we'll be running to launch the server. The `java` command points at our single Java source file:

```yaml
runtime: java11

entrypoint: java Main.java
```

Finally, don't forget to deploy your application with the `gcloud app deploy app.yaml` command. Of course, you can also take advantage of dedicated Maven and Gradle plugins for your deployments.

## Try Java 11 on App Engine standard today

You can write your App Engine applications with Java 11 today, thanks to the newly released runtime in beta. Please read the documentation to get started and learn more about it, have a look at the [many samples](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/master/appengine-java11) that are available, and check out the [migration guide](https://cloud.google.com/appengine/docs/standard/java11/java-differences) on moving from Java 8 to 11. And don't forget you can take advantage of the [App Engine free tier](https://cloud.google.com/free/docs/always-free-usage-limits) while you experiment with our platform.

*From the App Engine Java 11 team Ludovic Champenois, Eamonn McManus, Ray Tsang, Alexis Moussine-Pouchkine, Averi Kitsch, Lawrence Latif, Angela Funk.*