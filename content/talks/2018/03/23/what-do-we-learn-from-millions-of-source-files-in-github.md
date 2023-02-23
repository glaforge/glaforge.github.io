---
title: "What can we learn from millions of (groovy) source files in Github"
date: 2018-03-23T15:32:04+01:00
type: "talk"
layout: "talk"
tags:
- groovy
- github
- gradle
- grails
- bigquery
- google-cloud
---

What can you learn from millions of (Groovy) source files stored on Github?
In this presentation, I analized source files in the Github archives stored on BigQuery,
and in particular Groovy source file, but also Gradle build files, or Grails controllers and services.

{{< speakerdeck c9876f9890d84d378b5b18c9b57ad7aa >}}

What kind of questions can we answer

-   How many Groovy files are there on Github?
-   What are the most popular Groovy file names?
-   How many lines of Groovy source code are there?
-   What's the distribution of size of source files?
-   What are the most frequent imported packages?
-   What are the most popular Groovy APIs used?
-   What are the most used AST transformations?
-   Do people use import aliases much?
-   Did developers adopt traits?

For [Gradle](https://gradle.org/), here are the questions that I answered:

-   How many Gradle build files are there?
-   How many Maven build files are there?
-   Which versions of Gradle are being used?
-   How many of those Gradle files are settings files?
-   What are the most frequent build file names?
-   What are the most frequent Gradle plugins?
-   What are the most frequent "compile" and "test" dependencies?

And for [Grails](https://grails.org/), here's what I covered:

-   What are the most used SQL database used?
-   What are the most frequent controller names?
-   What are the repositories with the biggest number of controllers?
-   What is the distribution of number of controllers?

You can see a version of this talk in French in the following YouTube video, recorded at the BreizhCamp conference:

{{< youtube wk2CRBRrki8 >}}

And in English at Devoxx US:

{{< youtube Aw4sgZ8kIeg >}}
