---
title: "Start the fun with Java 14 and Micronaut inside serverless containers on Cloud Run"
date: 2020-03-24T15:59:29+01:00
tags:
- micronaut
- java
- containers
- serverless
- google-cloud
- cloud-run

similar:
  - "posts/2022/10/24/build-deploy-java-17-apps-on-cloud-run-with-cloud-native-buildpacks-on-temurin.md"
  - "posts/2020/08/04/running-micronaut-serverlessly-on-google-cloud-platform.md"
  - "posts/2020/05/27/introducing-java-11-on-google-cloud-functions.md"
---

Hot on the heels of the [announcement](https://mail.openjdk.java.net/pipermail/jdk-dev/2020-March/004089.html) of the general availability of JDK 14, I couldn't resist taking it for a spin. Without messing up my environment --- I'll confess I'm running 11 on my machine, but I'm still not even using everything that came past Java 8! --- I decided to test this new edition within the comfy setting of a Docker container.

## Minimal OpenJDK 14 image running JShell

Super easy to get started (assuming you have Docker installed on your machine), create a Dockerfile with the following content:

```dockerfile
FROM openjdk:14
CMD ["jshell"]
```

Only two lines: one to declare an [OpenJDK base image](https://hub.docker.com/_/openjdk) with the 14 tag, and one to launch the [JShell](https://docs.oracle.com/en/java/javase/14/jshell/introduction-jshell.html) REPL (introduced in Java 9).

Build and tag the image with:

```bash
$ docker build -t 14fun .
```

I called it 14fun, because you could almost pronounce it "one for the fun"! And then you can run this container image interactively with:

```bash
$ docker run -it 14fun
```

Then you will land directly in JShell, and can try a hello world of sorts:

```
Mar 20, 2020 9:17:28 AM java.util.prefs.FileSystemPreferences$1 run
INFO: Created user preferences directory.
| Welcome to JShell -- Version 14
| For an introduction type: /help intro
jshell> System.out.println("Stay at home!")
Stay at home!
```

You can enter /exit to quit the REPL.

And you certainly noticed that we're indeed on version 14, congrats!

## New and preview features

If you read the [announcement](https://mail.openjdk.java.net/pipermail/jdk-dev/2020-March/004089.html), you will have remarked that some of the new features are not necessarily generally available, but are still only in preview mode. 

Here's what's new:

-   [improved switch expressions](https://openjdk.java.net/jeps/361) (standard),
-   [pattern matching on instanceof](https://openjdk.java.net/jeps/305) (preview), 
-   [records](https://openjdk.java.net/jeps/359) (preview), and 
-   [text blocks](https://openjdk.java.net/jeps/368) (second preview).

If you want to play with those upcoming features, you have to let the Java tooling know that you want to enable them. You can do that with the --enable-preview flag. So let's update our Dockerfile accordingly:

```dockerfile
FROM openjdk:14
CMD ["jshell", "--enable-preview"]
```

Rebuild and rerun the docker commands.

### Text blocks

What about trying the [text blocks](https://openjdk.java.net/jeps/368)? With text blocks, don't bother with appending strings with + operations, not forgetting the \n at the end of each line. It's now sweeter to write long strings spanning several lines, for example:

```
$ docker run -it 14fun 
Mar 20, 2020 1:12:28 PM java.util.prefs.FileSystemPreferences$1 run
INFO: Created user preferences directory.
| Welcome to JShell -- Version 14
| For an introduction type: /help intro
jshell> var s = """
   ...> Hello everyone!
   ...> How are you doing?
   ...> """
s ==> "Hello everyone!\nHow are you doing?\n"
```

### Records

Java is often criticized for its verbosity --- think for instance how writing good POJOs can be tiresome, with proper equals() / hashCode() / toString() methods, constructors, getters and setters. Fortunately, IDEs help a lot here, but sometimes you really want some simple data holder classes without all the boilerplate. That's where [records](https://openjdk.java.net/jeps/359) come into the picture. 

Note however that these are not immutable (for example, like in Apache Groovy with its [@Immutable](http://docs.groovy-lang.org/latest/html/gapi/groovy/transform/Immutable.html) transformation), if the fields in the record are mutable objects.

Let's imagine a 3D point Record, what would it look like?

```
jshell> record Point3D(double x, double y, double z) { }
| created record Point3D

jshell> var p1 = new Point3D(0, 1, 2)
p1 ==> Point3D[x=0.0, y=1.0, z=2.0]

jshell> var p2 = new Point3D(0, 1, 2)
p2 ==> Point3D[x=0.0, y=1.0, z=2.0]

jshell> p1.equals(p2)
$5 ==> true
```

Notice the toString() representation, and that equals() is implemented comparing the values of each field.

### Improved switch expressions

Switch statements are... indeed statements, not expressions. It means they didn't so far return any value, or couldn't be passed as parameter values to methods. 

Times they are [a-changin](https://en.wikipedia.org/wiki/The_Times_They_Are_a-Changin%27_(Bob_Dylan_album))! Switch borrows the arrow syntax from lambdas to get a... break from break! And they can be used as values too!

```
jshell> var day = "Saturday"
day ==> "Saturday"

jshell> var isWeekend = switch (day) {
   ...> case "Monday", "Tuesday", "Wednesday", 
   ...> "Thursday", "Friday" -> false;
   ...> case "Saturday", "Sunday" -> true;
   ...> default -> false;
   ...> }
isWeekend ==> true
```

### Pattern matching on instanceof

Working with Apache Groovy for years, whether with its static type checking or dynamic nature, I'm quite used to skipping the redundant cast inside if (someObj instanceof SomeObject) {} blocks, thanks to [smart type inference](http://docs.groovy-lang.org/latest/html/documentation/core-semantics.html#_instanceof_inference) and flow typing. Java 14 takes a slightly different approach to this problem by with its [pattern matching on instanceof](https://openjdk.java.net/jeps/305), introducing a new local variable of the right type, rather than assuming the variable itself is of the right type. Well, it's better explained with an example:

```
jshell> String name = " Guillaume "
name ==> " Guillaume "

jshell> if (name instanceof String nameString) {
   ...> System.out.println(nameString.trim());
   ...> } else {
   ...> System.out.println("Not a string!");
   ...> }
Guillaume
```

JDK 14 in a serverless container, with Cloud Run
------------------------------------------------

Together we discovered the cool new syntax enhancements and constructs, and how we can play with them inside a Docker container image. But what about deploying some Java 14 powered containerized app in the cloud, in a serverless fashion? (ie. transparent scaling from 0 to 1, 1 to n, and back, paying only for what you use). For that purpose, you can easily deploy and scale containers in the cloud thanks to [Cloud Run](https://cloud.run/).

With the launch of Java / JDK 14, also came the first [2.0 milestone of the lovely and powerful Micronaut framework](https://objectcomputing.com/news/2020/03/20/micronaut-20-milestone-1-released)! Micronaut is probably the best framework for serverless microservices on the market, thanks to its awesome performance, lightness, in particular regarding super fast startup times. So it's the right occasion to have fun with [Micronaut](https://micronaut.io/) again. So let's build a Java 14 application, with Micronaut, running on Cloud Run.

### Create a Micronaut app

To get started, have a look at the [installation guide](https://docs.micronaut.io/latest/guide/index.html#buildCLI) for Micronaut. In a nutshell, it's using the [Sdkman](https://sdkman.io/) tool to manage versions of various SDKs. You can install Sdkman easily:

```bash
$ curl -s "https://get.sdkman.io" | bash
```

Once installed, you can also install the Micronaut command-line:

```bash
$ sdk install micronaut 2.0.0.M1
```

Next, we'll create an empty app named "app" with:

```bash
$ mn create-app app
```

The project will be created in the app/ subdirectory, cd into it, to also create a controller, and call it hello:

```bash
$ mn create-controller hello
```

You'll need to implement the controller, and tweak the app/build.gradle file to enable Java 14's preview features.

Update this section at the bottom of the build file to add the --enable-preview flag:

```groovy
tasks.withType(JavaCompile) {
    options.encoding = "UTF-8"
    options.compilerArgs.add('-parameters')
    options.compilerArgs.add('--enable-preview')
}
```

Now, open the src/main/java/app/HelloController.java class:

```java
package app;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Produces;

@Controller("/")
public class HelloController {

    @Produces(MediaType.TEXT_HTML)
    @Get("/{day}")
    public String index(String day) {
        var isWeekend = switch(day.toLowerCase()) {
            case "saturday", "sunday" -> true;
            case "monday", "tuesday", "wednesday",
                 "thursday", "friday" -> false;
            default -> false;
        };

        return String.format(
            """

                        It's %s, it is %s the weekend!

           """,
           day, (isWeekend ? "" : "not"));
    }
}
```

Notice how you take advantage of the improved switch expression and the text block!

### Create a Docker image

Micronaut's project template comes with a default Dockerfile, but update it to look like this:

```dockerfile
FROM openjdk:14
WORKDIR /app
COPY ./ ./
RUN ./gradlew shadowJar
EXPOSE 8080
CMD ["java", "--enable-preview", "-jar", "build/libs/app-0.1-all.jar"]
```

Then build this container image (with your name of choice) with:

```bash
docker build -t IMAGE_NAME .
```

And check that it runs fine with this docker run command:

```bash
docker run -p 8080:8080 -it IMAGE_NAME
```

Then head over to <http://127.0.0.1/Monday> or <http://127.0.0.1/Sunday> to see if it works fine.

So you now have a working Micronaut 2.0 application, running on JDK 14, using some of the new and preview features of Java 14! Congrats!

### Scaling your container image in the cloud

Time to deploy your Java 14-powered Micronaut web application into the cloud, on Cloud Run. Why [Cloud Run](https://cloud.google.com/run/)? Because with Cloud Run, you can easily push a container in production in matters of seconds. It abstracts away all the infrastructure, so you don't have to worry about it. Google Cloud Platform handles it for you, so you can focus on your code instead. You pay proportionally to your usage: it's serveless, so if nobody pings your app, you won't pay anything as no container will be running. But as traffic ramps up, one or more containers will be lined up to serve your requests.

If you haven't already, you can get started on Google Cloud Platform with its [free trial](https://cloud.google.com/free) (and free quota). For this tutorial however, you need to create a billing account. Once you have an account ready, create a new GCP project in the Google Cloud [console](https://console.cloud.google.com/). Head over to the Cloud Run section, from the hamburger menu, and click on the "Enable API" button.

Last thing before heading to the command-line, install the [gcloud SDK](https://cloud.google.com/sdk/docs/quickstarts) command-line to work from your terminal. Once gcloud is installed, you can login with:

```bash
gcloud auth login
```

Set the project name to the one you created in the console:

```bash
gcloud config set project YOUR_PROJECT_ID
```

You'll be using the fully-managed version of Cloud Run:

```bash
gcloud config set run/platform managed
```

Define a default region, for me, that's gonna be europe-west1

```bash
gcloud config set run/region REGION
```

It's possible to also build container images in [Cloud Build](https://cloud.google.com/cloud-build) (see some [instructions](https://cloud.google.com/run/docs/quickstarts/build-and-deploy) that show this), but here you are using Docker locally to build your images. So let's configure the Docker integration and Container Registry access with the following commands:

```bash
gcloud auth configure-docker
gcloud components install docker-credential-gcr
```

Tag your image with the following naming convention:

```bash
docker build . --tag gcr.io/YOUR_PROJECT_ID/IMAGE_NAME
```

Let's push our image to Container Registry (and change the image and project names accordingly):

```bash
docker push gcr.io/YOUR_PROJECT_ID/IMAGE_NAME
gcloud run deploy weekend-service\
 --image gcr.io/YOUR_PROJECT_ID/IMAGE_NAME
 --allow-unauthenticated
```

You should see output similar to this, showing the URL where you can access your app:

```
Deploying container to Cloud Run service [weekend-service] in project [YOUR_PROJECT_ID] region [europe-west1]
✓ Deploying new service... Done.
 ✓ Creating Revision...
 ✓ Routing traffic...
 ✓ Setting IAM Policy...
Done.
Service [weekend-service] revision [weekend-service-00001-xig] has been deployed and is serving 100 percent of traffic at https://weekend-service-brxby8yoda-ew.a.run.app
```

Navigate to that URL, append the name of the day, and check whether it's weekend time!

## And voilà! 

Less than a minute later, your Java 14 + Micronaut container app has been deployed to Cloud Run. Automatically, you got a secured HTTPS endpoint for your app (you can also provide your own domain name), without bothering with the infrastructure and scaling aspects.