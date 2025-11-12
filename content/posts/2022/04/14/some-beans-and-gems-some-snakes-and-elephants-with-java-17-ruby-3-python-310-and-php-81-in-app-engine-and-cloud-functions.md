---
title: "Some beans and gems, some snakes and elephants, with Java 17, Ruby 3, Python 3.10, and PHP 8.1 in App Engine and Cloud Functions"
date: 2022-04-14T14:03:46+01:00
tags:
- google-cloud
- app-engine
- cloud-functions
- java
- ruby
- php
- python
canonical: "https://cloud.google.com/blog/topics/developers-practitioners/new-java-ruby-python-php-runtimes"

similar:
  - "posts/2019/06/21/turn-it-up-to-eleven-java-11-runtime-comes-to-app-engine.md"
  - "posts/2020/05/27/introducing-java-11-on-google-cloud-functions.md"
  - "posts/2022/01/26/open-sourcing-the-app-engine-standard-java-runtime.md"
---

Time to spill the beans and show the gems, to our friendly snakes and elephants: we've got some great news for Java, Ruby, Python and PHP serverless developers today. Google App Engine and Cloud Functions are adding new modern runtimes, allowing you to update to the major version release trains of those programming languages.

In short, here's what's new:

-   Access to App Engine legacy bundled services for Java 11/17, Python 3 and Go 1.12+ runtimes, is **Generally Available**

-   The Java 17, Ruby 3.0, Python 3.10, and PHP 8.1 runtimes come into preview in App Engine and Cloud Functions

Let's have a closer look. First of all, the access to App Engine legacy bundled services for second generation runtimes for [Java](https://cloud.google.com/appengine/docs/standard/java-gen2/services/access), [Python](https://cloud.google.com/appengine/docs/standard/python3/services/access) and [Go](https://cloud.google.com/appengine/docs/standard/go/services/access) is now Generally Available. In the past, for example for the Java platform, only Java 8 (a first generation runtime) could access the [built-in APIs](https://cloud.google.com/appengine/docs/standard/java-gen2/reference/services/bundled) like Memcache, Images, Mail, or Task Queues. Now, if you use the Java 11 runtime (a second generation runtime), you can access those services as well as all the [Google Cloud APIs](https://cloud.google.com/java/docs/reference). For example, you can now store transient cached data in Memcache, or send an email to users of your application in a second generation runtime. Same thing for Python and Go developers, you can take advantage of the bundled services as well. If you're still using an old runtime version, this will further ease the transition to newer versions. Be sure to check it out and upgrade.

Next, let's continue with a fresh bean and a shiny gem, mixed in with some friendly animals, with the **preview of the Java 17, Ruby 3.0, Python 3.10 and PHP 8.1 runtimes for both App Engine and Cloud Functions**. What about having a look at what's new in those language versions?

## Java

Between the two Long-Term-Support versions of Java 11 and 17, a lot of new features have landed. Java developers can now write text blocks for strings spanning several lines, without having to concatenate multiple strings manually. The switch construct has evolved to become an expression, which lets you break away from the `break` keyword, and paves the way for more advanced pattern matching capabilities. Speaking of which, the `instanceof` keyword is indeed offering some pattern matching evolution, to avoid obvious but useless casts. Records allow you to create more streamlined immutable data classes, rather than writing your own Java beans for that purpose with proper `hashCode()`, `equals()` or `toString()` methods. For more control over your class hierarchy, sealed class gives you more control over the extension of your classes.

## Ruby

With Ruby 3.0, the big highlights were on performance, static type checking, and concurrency. The goal to make Ruby 3.0, three times faster on some benchmarks than Ruby 2.0 was reached, making your code run more swiftly. Also, Ruby programs can be annotated with some typing information, which allow type checkers to take advantage of those types to provide static type checking, to improve the quality of your code. For concurrency and parallelism, a new actor-inspired concurrency primitive called Ractor helps taming multiple cores in parallel, for your demanding workloads. And a fiber scheduler is introduced for intercepting blocking operations. And beyond those headlines, many improvements to various Ruby APIs have also landed.

## Python

In Python 3.10, the parser gives better and clearer error messages for syntax errors (with more accurate error location), also for indentation, attribute, and name errors, which greatly help developers to find the problems in their code. Structural pattern matching lands with a new `match` and `case` statement construct. Further PEP improvements are tackling more robust type hints for static type checkers. Parenthesized context managers have been added to make the code prettier when spanning a long collection of context managers across several lines. 

## PHP

With version 8.1, PHP gets a pretty major update. First, let's start with a new `enum` syntax construct instead of creating constants in classes, and you get validation out of the box. Classes now have the ability to define final class constants. The new `readonly` properties can't be changed after initialization, which is great for value objects and DTOs. A first class callable syntax is introduced, allowing you to get a reference to any function, with a short syntax. Developers will also find further improvements to initializers, that make it possible to even have nested attributes, using objects as default parameter values, static variables, and global constants. One last nice addition we can mention is the introduction of fibers to implement lightweight cooperative concurrency.

## Your turn

Gems, beans, elephants, snakes: there's something great in those new language versions for every developer. Thus, with these new runtimes in Preview, Java, Ruby, Python and PHP developers can update or develop new App Engine apps and Cloud Functions using the latest and greatest versions of their favorite languages. Be sure to check out the documentation for App Engine ([Java](https://cloud.google.com/appengine/docs/standard/java-gen2/runtime), [Ruby](https://cloud.google.com/appengine/docs/standard/ruby/runtime), [Python](https://cloud.google.com/appengine/docs/standard/python3/runtime), [PHP](https://cloud.google.com/appengine/docs/standard/php7/runtime)) and Cloud Functions ([Java](https://cloud.google.com/functions/docs/concepts/java-runtime), [Ruby](https://cloud.google.com/functions/docs/concepts/ruby-runtime), [Python](https://cloud.google.com/functions/docs/concepts/python-runtime), [PHP](https://cloud.google.com/functions/docs/concepts/php-runtime)). We're looking forward to hearing from you about how you'll take advantage of those new language runtimes.

[](https://cloud.google.com/blog/products/serverless/introducing-the-next-generation-of-cloud-functions)