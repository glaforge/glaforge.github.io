---
title: "Build Deploy Java 17 Apps on Cloud Run With Cloud Native Buildpacks on Temurin"
date: 2022-10-24T11:33:25+01:00
tags: 
- java
- google-cloud
- cloud-run
- cloud-native-buildpacks
- micronaut
- gradle
- containers
---

In this article, let's revisit the topic of deploying Java apps on [Cloud Run](https://cloud.run/). 
In particular, I'll deploy a [Micronaut](https://micronaut.io/) app, written with [Java 17](https://jdk.java.net/17/), and built with [Gradle](https://gradle.org/).

## With a custom Dockerfile

On Cloud Run, you deploy containerised applications, so you have to decide the way you want to build a container for your application. 
In a [previous article](https://glaforge.appspot.com/article/start-the-fun-with-java-14-and-micronaut-inside-serverless-containers-on-cloud-run), 
I showed an example of using your own Dockerfile, which would look as follows with an OpenJDK 17, and enabling preview features of the language:

```Dockerfile
FROM openjdk:17
WORKDIR /app
COPY ./ ./
RUN ./gradlew shadowJar
EXPOSE  8080
CMD ["java", "--enable-preview", "-jar", "build/libs/app-0.1-all.jar"]
```

To further improve on that Dockerfile, you could use a multistage Docker build to first build the app in one step with Gradle, and then run it in a second step. 
Also you might want to parameterize the command as the JAR file name is hard-coded.

To build the image, you can build it locally with Docker, and then push it to Container Registry, and then deploy it:

```bash
# gcloud auth configure-docker
# gcloud components install docker-credential-gcr

docker build . --tag gcr.io/YOUR_PROJECT_ID/IMAGE_NAME
docker push gcr.io/YOUR_PROJECT_ID/IMAGE_NAME

gcloud run deploy weekend-service \
    --image gcr.io/YOUR_PROJECT_ID/IMAGE_NAME
```

Instead of building locally with Docker, you could also let [Cloud Build](https://cloud.google.com/build) do it for you:

```bash
gcloud builds submit . --tag gcr.io/YOUR_PROJECT_ID/SERVICE_NAME
```

## With JIB

Instead of messing around with Dockerfiles, you can also let [JIB](https://github.com/GoogleContainerTools/jib) create the container for you, 
like I wrote in [another article](https://glaforge.appspot.com/article/running-micronaut-serverlessly-on-google-cloud-platform). 
You configure Gradle to use the JIB plugin:

```groovy
plugins {
    ...
id "com.google.cloud.tools.jib" version "2.8.0"
}
...
tasks {
    jib {
        from {
            image = "gcr.io/distroless/java17-debian11"
        }
        to {
            image = "gcr.io/YOUR_PROJECT_ID/SERVICE_NAME"
        }
    }
}
```

You specify the version of the plugin, but you also indicate that you want to use Java 17 by choosing a base image with that same version. 
Be sure to change the placeholders for your project ID and service name. 
Feel free to lookup the [documentation](https://github.com/GoogleContainerTools/jib/tree/master/jib-gradle-plugin) about the JIB Gradle plugin. 
You can then let Gradle build the container with ./gradlew jib, or with ./gradlew jibDockerBuild if you want to use your local Docker daemon.

## With Cloud Native Buildpacks

Now that we covered the other approaches, let's zoom in on using [Cloud Native Buildpacks](https://buildpacks.io/) instead, in particular, 
the [Google Cloud Native Buildpacks](https://github.com/GoogleCloudPlatform/buildpacks). 
With buildpacks, you don't have to bother with Dockerfiles or with building the container before deploying the service. 
You let Cloud Run use buildpacks to build, containerize, and deploy your application from sources.

Out of the box, the buildpack actually targets Java 8 or Java 11. 
But I'm interested in running the latest LTS version of Java, with Java 17, to take advantage of some preview features like records, sealed classes, switch expressions, etc.

In my Gradle build, I specify that I'm using Java 17, but also enable preview features:

```groovy
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

Like in Cédric Champeaus's [blog post](https://melix.github.io/blog/2020/06/java-feature-previews-gradle.html), to enable preview features, 
you should also tell Gradle you want to enable them for compilation, test, and execution tasks:

```groovy
tasks.withType(JavaCompile).configureEach {
 options.compilerArgs.add("--enable-preview")
}

tasks.withType(Test).configureEach {
    useJUnitPlatform()
    jvmArgs("--enable-preview")
}

tasks.withType(JavaExec).configureEach {
    jvmArgs("--enable-preview")
}
```


So far so good, but as I said, the default native buildpack isn't using Java 17, and I want to specify that I use preview features. 
So when I tried to deploy my Cloud Run app from sources with the buildpack, simply by running the gcloud deploy command, I would get an error.

```bash
gcloud beta run deploy SERVICE_NAME
```

To circumvent this problem, I had to add a configuration file, to instruct the buildpack to use Java 17. I created a project.toml file at the root of my project:

```toml
[[build.env]]
name = "GOOGLE_RUNTIME_VERSION"
value = "17"
[[build.env]]
name = "GOOGLE_ENTRYPOINT"
value = "java --enable-preview -jar /workspace/build/libs/app-0.1-all.jar"
```

I specify that the runtime version must use Java 17. But I also add the --enable-preview flag to enable the preview features at runtime.

## Adoptium Temuring OpenJDK 17

The icing on the cake is that the build is using [Adoptium](https://adoptium.net/)'s [Temurin](https://adoptium.net/temurin/releases/) build of OpenJDK 17, 
as we recently [announced](https://blog.adoptium.net/2022/10/adoptium-welcomes-google/)! 
If you look at the build logs in Cloud Build, you should see some output mentioning it, like:

```json
{
 "link": "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.4.1%2B1/OpenJDK17U-jdk-sources_17.0.4.1_1.tar.gz",
 "name": "OpenJDK17U-jdk-sources_17.0.4.1_1.tar.gz",
 "size": 105784017
}
```

Way to go! Java 17 Micronaut app, deployed on Temurin on Cloud Run thanks to cloud native buildpacks! I win at buzzword bingo 🙂