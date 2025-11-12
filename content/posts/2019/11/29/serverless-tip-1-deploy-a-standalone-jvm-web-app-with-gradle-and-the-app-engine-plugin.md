---
title: "Serverless tip #1 — Deploy a standalone JVM web app with Gradle and the App Engine plugin"
date: 2019-11-29T16:49:31+01:00
tags:
- google-cloud
- app-engine
- serverless
- gradle
- java
- tips

similar:
  - "posts/2019/12/03/serverless-tip-2-deploy-an-executable-jvm-application-with-gcloud-without-app-yaml-or-build-tool-plugin.md"
  - "posts/2019/07/04/getting-started-with-micronaut-on-google-app-engine-java-11.md"
  - "posts/2017/01/15/deploy-a-ratpack-app-on-google-app-engine-flex.md"
---

Requirements:

-   an existing Google Cloud Platform account and project
-   a Java or alternative language web application
-   a Gradle build that creates a standalone executable JAR file

In youd `build.gradle` file, add the App Engine gradle plugin to your `buildscript` dependencies:

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

Apply the plugin, to make use of it:

```groovy
apply plugin: "com.google.cloud.tools.appengine-appyaml"
```

Then you can configure the `appengine` task to point at the standalone executable JAR:

```groovy
appengine {
    stage.artifact = 
            "${buildDir}/libs/${project.name}-${project.version}.jar"
    deploy {
        projectId = "YOUR-PROJECT-ID"
        version = "1"
    }
}
```

You can customize the path of the artifact, specify the project ID outside, or define an App Engine version that's dependent on your project version, a git commit, etc.

Note that the App Engine gradle plugin expects to find the `app.yaml` configuration file in `src/main/appengine`.

You can then deploy your application with:

```bash
$ ./gradlew appengineDeploy
```

More information:

-   [app.yaml](https://cloud.google.com/appengine/docs/standard/java11/config/appref)
-   [App Engine gradle plugin](https://github.com/GoogleCloudPlatform/app-gradle-plugin)