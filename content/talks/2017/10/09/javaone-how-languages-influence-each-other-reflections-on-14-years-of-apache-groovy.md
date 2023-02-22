---
title: "JavaOne — How languages influence each other: Reflections on 14 years of Apache Groovy"
date: 2017-10-09T16:42:54+01:00
type: "talk"
layout: "talk"
tags:
- groovy
- java
---

Last week, I was in San Francisco for my tenth JavaOne! I had two sessions: one on the past / present / future of Java Platform-as-a-Service offerings, and one on programming language influences, and particularly how was Apache Groovy influenced, and how it also inspired other languages.

Here's the abstract:

> Languages have been influencing one another since the dawn of computer programming. There are families of languages: from Algol descendants with begin/end code blocks to those with curly braces such as C. Languages are not invented in a vacuum but are inspired by their predecessors. This session's speaker, who has been working on Apache Groovy for the past 14 years, reflects on the influences that have driven the design of programming languages. In particular, Groovy's base syntax was directly derived from Java's but quickly developed its own flavor, adding closures, type inference, and operators from Ruby. Groovy also inspired other languages: C#, Swift, and JavaScript adopted Groovy's null-safe navigation operator and the famous Elvis operator.

And you can have a look at the slides below:

{{< speakerdeck 2159d9f06d0b4b388a849823f43e82fc >}}

[Apache Groovy](http://www.groovy-lang.org/) is a multi-faceted language for the Java platform, allowing developers to code in a Java-friendly syntax, with great integration with the Java ecosystem, and powerful scripting and Domain-Specific Language capabilities, while at the same time being able to offer you type safety and static compilation.

In this presentation, I revisited some of the influences from other languages, from the C-family and its Java older brother, going through its Python-inspired strings, its Smalltalk and Ruby heritage for named parameters and closures, its type system à-la-Java. But I'm also showing some of the innovations Groovy came up with that were later borrowed by others (Swift, C#, Kotlin, Ceylon, PHP, Ruby, Coffeescript...). Things like Groovy's trailing closure, Groovy builders, null-safe navigation, the Elvis operator, ranges, the spaceship operator, and more.

Ultimately, inspiration is really a two-way street, as languages don't come from nowhere and inherit from their older brothers and sisters. No language is perfect, but each one of them somehow help the next ones to get better, by borrowing here and there some nice features that make developers more productive and write more readable and maintainable code.
