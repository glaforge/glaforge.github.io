---
title: "Gradle vs Maven and Gradle in Kotlin or Groovy"
date: 2017-11-27T16:29:35+01:00
tags:
- groovy
- gradle
- kotlin
- maven
- bigquery
- google-cloud
---

Once in a while, when talking about Gradle with developers, at conferences or within the Groovy community (but with the wider Java community as well), I hear questions about Gradle. In particular Gradle vs Maven, or whether developers adopt the Kotlin DSL for Gradle builds.

In the past, I blogged several times about using BigQuery and the Github dataset to analyze open source projects hosted on Github, by running some SQL queries against that dataset. You might want to have a look at this past article on some [Gradle analysis with BigQuery](http://glaforge.appspot.com/article/analyzing-half-a-million-gradle-build-files). Considering those questions popped up recently, I decided to do a quick run through those questions with some simple queries.

## Gradle vs Maven?

First, let's look at Maven builds. We can run the following query:

```sql
SELECT count(*) 
FROM [bigquery-public-data:github_repos.files] 
WHERE path LIKE '%pom.xml'
```

There are 1,125,150 pom files.

![](https://glaforge.appspot.com/media/gradle-builds-vs-maven-builds.png)

Then, for Gradle, I ran this query (even if projects could have different build file names):

```sql
SELECT count(*) 
FROM [bigquery-public-data:github_repos.files] 
WHERE path LIKE '%build.gradle'
```

There are 414,329 build.gradle files.

![](https://glaforge.appspot.com/media/gradle-builds-in-groovy.png)

So that's 1 Gradle build file for 2.7 Maven build file.

## Gradle builds in Kotlin or in Groovy?

Now for Kotlin, the convention seems to be about naming your build files with build.gradle.kts. So let's run the following query:

```sql
SELECT count(*) 
FROM [bigquery-public-data:github_repos.files] 
WHERE path LIKE '%build.gradle.kts'
```

There are only 207 Gradle builds files written in Kotlin.

![](https://glaforge.appspot.com/media/gradle-builds-in-kotlin.png)

Basically, Groovy-based Gradle builds are 2000 times more popular than Kotlin-based builds.

## A grain of salt

Now, all that said, remember that developers can name their build files differently, that it's only a snapshot of the projects available on Github, and furthermore, just open source projects (at least projects that explicitly have a LICENSE file). Note for example as well that there are Gradle based projects that also have a pom.xml file available, although they're not using Maven for their build.

Also, perhaps it'd be more interesting to run the queries by counting repositories, rather than build files: Perhaps Gradle users tend to split their build files in smaller build files, in a less monolithic way than with Gradle? Practices and habits may vary greatly.

For the Gradle vs Maven question, at Devoxx Belgium, I ran the following (more complex) query where I look at repositories containing Gradle or Maven build files:

```sql
#standardSQL
select file, count(file) FROM (
  (SELECT 'gradle' as file, count(repo_name)
  FROM `bigquery-public-data.github_repos.files`
  WHERE path LIKE '%build.gradle'
  GROUP BY repo_name)

  UNION ALL

  (SELECT "maven" as file, count(repo_name)
  FROM `bigquery-public-data.github_repos.files`
  WHERE path LIKE '%pom.xml'
  GROUP BY repo_name)
)
group by file
```

Gradle and Maven are already much closer to each other by looking at repository counts than just by pure number of build files, perhaps indeed showing a trend with Gradle users to modularize their builds more.

We get 118,386 repositories using Gradle versus 143,290 repositories using Maven. So Gradle is almost at the same level as Maven from that repository perspective, Still catching up with Maven!

## Famous last words

Don't necessarily draw too big conclusions out of those figures, there are many ways to make stats, and those figures are only a small fraction of all the projects in existence in the world... but at least, they certainly exhibit a certain trend, which is still interesting to know and think about!