---
title: "Analyzing half a million Gradle build files"
date: 2016-12-03T15:52:46+01:00
tags:
- google-cloud
- bigquery
- gradle
- build

similar:
  - "posts/2017/11/27/gradle-vs-maven-and-gradle-in-kotlin-or-groovy.md"
  - "posts/2016/07/06/what-can-we-learn-from-million-lines-of-groovy-code-on-github.md"
  - "posts/2013/10/15/interview-about-groovy-s-popularity-boost.md"
---

Gradle is becoming the build automation solution of choice among developers, in particular in the Java ecosystem. With the Github archive published as a Google BigQuery dataset, it's possible to analyze those build files, and see if we can learn something interesting about them!

This week, I was at the G3 Summit conference, and [presented]({{< ref "/talks/2018/03/23/what-do-we-learn-from-millions-of-source-files-in-github" >}}) about this topic: I covered the Apache Groovy language, as per my previous [article]({{< ref "/posts/2016/07/06/what-can-we-learn-from-million-lines-of-groovy-code-on-github" >}}), but I expanded my queries to also look at [Grails](https://grails.org/) applications, and [Gradle](https://gradle.org/) build files. So let's see what the dataset tells us about Gradle!

## Number of Gradle build files and repositories

Instead of going through the whole Github dataset, I'm going to restrict the dataset by saving only the Gradle build files in my own, smaller, dataset:

```sql
SELECT * FROM [bigquery-public-data:github_repos.files] 
WHERE RIGHT(path, 7) = '.gradle'
```

This query returns only the files whose extension is .gradle. I'm saving the results in my [github.gradle_build_files] table.

But I also need the content of those files:

```sql
SELECT *
FROM [bigquery-public-data:github_repos.contents]
WHERE id IN (SELECT id FROM [github.gradle_build_files])
```

And I will save the content in the table [github.gradle_build_contents].

Let's start with a simple query to count the Gradle build files on Github:

```sql
SELECT COUNT(*) as count
FROM [github-groovy-files:github.gradle_build_files]
```

There are 488,311 Gradle build files! Roughly half a million.

This is the number of Gradle files: note that a project can contain several build files, that a repository can contain several projects, but also that the Github dataset only provides data on repositories for which it could detect an Open Source license. So it gives an idea of the reach of Gradle, but doesn't necessarily give you the exact number of Gradle-based projects in the wild! (and obviously can't even account for the projects hosted internally and elsewhere)

Since a repository can contain several build files, let's have a look at the number of repositories containing Gradle build files:

```sql
SELECT COUNT(repo_name) as repos
FROM (
  SELECT repo_name
  FROM [github-groovy-files:github.gradle_build_files]
  GROUP BY repo_name
)
```

There are 102,803 repositories with Gradle build files.

I was curious to see the distribution of the number of build files across projects. So I used the quantiles function:

```sql
SELECT QUANTILES(buildFilesCount, 101) 
FROM (
  SELECT repo_name, COUNT(repo_name) as buildFilesCount
  FROM [github-groovy-files:github.gradle_build_files]
  GROUP BY repo_name
  ORDER BY buildFilesCount DESC
)
```

I used a small increment (one percent), as the data was skewed towards some repositories with a huge amount of Gradle build files: essentially repositories like the Udemy course on Gradle for Android, or an online book about Android development, as they had tons of small build files or variations of build files with incremental changes for explanation purpose.

* 22% of the repositories had only 1 build file
* 85% of the repositories had up to 5 build files
* 95% of the repositories had less than 10 build files

The repository with the biggest amount of build files had 1333 of them!

## Gradle vs Maven

You might also be interested in comparing Gradle and Maven, as they are often put against each other in holy build wars. If you look at the number of pom.xml files on Github:

```sql
SELECT count(*) 
FROM [bigquery-public-data:github_repos.files]
WHERE path LIKE '%pom.xml'
```

There are about 1,007,705 pom.xml files vs the 488,311 we counted for Gradle. So roughly twice as many for Maven.

But if you look at the number of repositories with Maven build files:

```sql
SELECT COUNT(repo_name) as repos
FROM (
  SELECT repo_name
  FROM [bigquery-public-data:github_repos.files]
  WHERE path LIKE '%pom.xml'
  GROUP BY repo_name
)
```

There are 131,037 repositories with Maven pom.xml files, compared to the 102,803 repositories with Gradle build files we counted earlier (about only 27% more). It seems Gradle is catching up with Maven!

## Gradle build file names

Bigger projects tend to split their build tasks under different build files. I was curious to see which kind of split developers did by looking at the most frequent build file names:

```sql
SELECT f, COUNT(f) as count
FROM (
  SELECT LAST(SPLIT(path, '/')) AS f
  FROM [github-groovy-files:github.gradle_build_files]
)
GROUP BY f
ORDER BY count DESC
```

![](/img/bigquery-gradle/gh22-1.png)
![](/img/bigquery-gradle/gh22-2.png)

Of course, build.gradle comes first. Followed by settings.gradle. Notice the number of build files which are related to making releases, publishing / deploying the artifacts to a repository. There are also a few checking the quality of the code base, using checkstyle for style violations, JaCoCo for code coverage.

## Gradle versions

Gradle projects often use the Gradle wrapper to help developers use a particular and consistent version of Gradle, without necessiting Gradle to be installed locally. For those developers who decided to commit their Gradle wrapper in Github, we can have a look at the breakdown of Gradle versions currently in the wild:

```sql
SELECT version, COUNT(version) AS count
FROM (
  SELECT REGEXP_EXTRACT(line, r'gradle-(.*)-(?:all|bin).zip') AS version
  FROM (
    SELECT SPLIT(content, '\n') AS line
    FROM [github-groovy-files:github.gradle_wrapper_properties_files]
  )
  WHERE line LIKE 'distributionUrl%'
)
GROUP BY version
ORDER BY count DESC
```

![](/img/bigquery-gradle/gh20a-1.png)
![](/img/bigquery-gradle/gh20a-2.png)

It looks like Gradle 2.4 was a big hit!

## Gradle plugins

Gradle projects often take advantage of third-party plugins. You'll see plugins declared with the "id" syntax or applied with "apply plugin". Let's looked at both:

```sql
SELECT plugin, COUNT(plugin) AS count
FROM (
  SELECT REGEXP_EXTRACT(line, r'apply plugin: (?:\'|\")(.*)(?:\'|\")') AS plugin
  FROM (
    SELECT SPLIT(content, '\n') AS line
    FROM [github-groovy-files:github.gradle_build_contents]
  )
)
GROUP BY plugin
ORDER BY count DESC
```

![](/img/bigquery-gradle/gh23-1.png)
![](/img/bigquery-gradle/gh23-2.png)

Look at the big number of Android related plugins! Clearly, Android adopting Gradle as build solution gave a big boost to Gradle's adoption!

The plugins declared with "id" show another story though:

```sql
SELECT newplugin, COUNT(newplugin) AS count
FROM (
  SELECT REGEXP_EXTRACT(line, r'id (?:\'|\")(.*)(?:\'|\") version') AS newplugin
  FROM (
    SELECT SPLIT(content, '\n') AS line
    FROM [github-groovy-files:github.gradle_build_contents]
  )
)
GROUP BY newplugin
ORDER BY count DESC
```

![](/img/bigquery-gradle/gh24-1.png)
![](/img/bigquery-gradle/gh24-2.png)

Here, we see a big usage of the Bintray plugin and the shadow plugin.

## Build dependencies

Now it's time to look at dependencies. First, the "compile" dependencies:

```sql
SELECT dep, COUNT(dep) AS count
FROM (
  SELECT REGEXP_EXTRACT(line, r'compile(?: |\()(?:\'|\")(.*):') AS dep
  FROM (
    SELECT SPLIT(content, '\n') AS line
    FROM [github-groovy-files:github.gradle_build_contents]
  )
)
GROUP BY dep
ORDER BY count DESC
```

![](/img/bigquery-gradle/gh25-1.png)
![](/img/bigquery-gradle/gh25-2.png)

Again, there's a big usage of Android related dependencies. We also notice Spring Boot, GSON, Guava, SLF4J, Retrofit, Jackson.

For the test dependencies:

```sql
SELECT dep, COUNT(dep) AS count
FROM (
  SELECT REGEXP_EXTRACT(line, r'testCompile(?: |\()(?:\'|\")(.*):') AS dep
  FROM (
    SELECT SPLIT(content, '\n') AS line
    FROM [github-groovy-files:github.gradle_build_contents]
  )
)
GROUP BY dep
ORDER BY count DESC
```

![](/img/bigquery-gradle/gh26-1.png)
![](/img/bigquery-gradle/gh26-2.png)

No big surprise with JUnit coming first. But we have Spock, Mockito's mocking library, AssertJ assertions, Hamcrest matchers.

## Summary

And this wraps up our analysis of Gradle build files, thanks to [Google BigQuery](https://cloud.google.com/bigquery/) and the Github dataset. It's interesting to see that Gradle has gained a very significant market share, coming pretty close to the Maven incumbent, and to see lots of Android projects are on Github with Gradle builds.