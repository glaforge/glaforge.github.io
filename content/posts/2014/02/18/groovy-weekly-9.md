---
title: "Groovy Weekly #9"
date: 2014-02-18T00:00:00.000+01:00
tags: [groovy, groovy-weekly]

similar:
  - "posts/2014/05/20/groovy-weekly-22.md"
  - "posts/2014/02/11/groovy-weekly-8.md"
  - "posts/2014/04/29/groovy-weekly-19.md"
---

An interesting column this week thanks to the major release of Griffon 1.5, but also a minor release of Grails 2.3.6 which brings the often requested standalone GORM support!

## Releases

*   [Grails 2.3.6](http://grails.org/2.3.6+Release+Notes) released, including GORM standalone support
*   [Griffon 1.5](http://docs.codehaus.org/pages/viewpage.action?pageId=237371944) is released
    
## Articles

*   Cédric Champeau details in a two parts article his work on a [new template engine for Groovy](http://melix.github.io/blog/2014/02/markuptemplateengine.html), that is fast, can be type checked and statically compiled
*   Second part of the article from Cédric Champeau about his new markup template engine for Groovy with [advanced explanations about static type checking extensions and static compilation](http://melix.github.io/blog/2014/02/markuptemplateengine_part2.html)
*   More on the [Groovy client for the Light-Table](http://codewader.blogspot.no/2014/02/a-groovy-light-table-client-step-1.html) IDE
*   André Steingreß covers [Java-based configuration with Grails](http://blog.andresteingress.com/2014/02/14/grails-java-based-spring-config/)
*   Marco Vermeulen explains how to [deploy apps like Ratpack, Spring Boot or Dropwizard on Heroku](http://www.wiredforcode.com/blog/2014/02/11/deploy-to-heroku-with-gradle) thanks to Gradle
*   VoltDB integrates [Groovy for its datastore inline procedure language](http://voltdb.com/voltdbgroovy)
*   An article on RelProxy, a project for a [hot class reloader and scripting](http://java.dzone.com/articles/presenting-relproxy-hot-class) for Java and Groovy
*   [Enum to Switch on Class types](http://octodecillion.com/blog/use-java-enum-to-switch-on-class-types/) in Java and Groovy
    
## Presentations

*   Ken Kousen presents [advanced Groovy features](http://www.infoq.com/presentations/advanced-groovy-tips), such as closure coercion, mixins, simple runtime metaprogramming, operator overloading, drop and take, overlooked methods in the Groovy JDK, and more (recorded at SpringOne2GX 2013)
*   Greg Turnquist demoes using [Spring Mail, Security, REST, GridFS, Bootstrap and jQuery in a production grade Grails application](http://www.infoq.com/presentations/grails-case-study)
*   John Engelman presents a talk on [enterprise Grails with Spring Batch](https://speakerdeck.com/johnrengelman/enterprise-grails-spring-batch) for batch processing
    
## Mailing-list discussions

*   Rick Hightower's been working on the new JSON parser for Groovy 2.3 to [give Groovy the fastest JSON parser available on the JVM](http://groovy.329449.n5.nabble.com/Improve-serialization-speeds-of-JsonOutput-td5718316.html#a5718394), and along with Andrey Blochestov they are also looking at making the creation of JSON payloads also super fast
    
## Code snippets

*   Andrés Almiray on the [simplicity of functional testing for Griffon applications](https://twitter.com/aalmiray/status/434438930436730880)
*   Miguel de la Cruz shows his experiment with a [minimal web server implemented with Ratpack](https://github.com/mgdelacroix/ccServer/blob/master/ccServer.groovy)
    
## Tweets

*   [Griffon 1.5](https://twitter.com/gvmtool/status/433731764134363136) available through GVM
*   GVM now offers [Gradle 1.11](https://twitter.com/gvmtool/status/433280770166509568) too
*   Johannes Link, contributor of the @TailRecursive transformation for Groovy 2.3, compared the performance of @TailRecursive on methods vs trampoline() on closures, and indicate that the [performance advantage is for @TailRecursive](https://twitter.com/johanneslink/status/434057275146522625)
*   Dave Syer shows an example of a [Spring Boot controller written in Groovy that outputs JSON](https://twitter.com/david_syer/status/365367862170353667)
*   Bobby Warner notes that the [Asset pipeline plugin replaces the resources plugin](https://twitter.com/bobbywarner/status/433277222476980224) by default from Grails 2.4 onward
  
## Other news

*   The [@TailRecursive transformation](https://github.com/groovy/groovy-core/pull/315) has been contributed by Johannes Link and Cédric Champeau merged the pull request into the Groovy 2.3 branch
*   Jacob Aae Mikkelsen's Week #7 of the [Grails diary](http://grydeske.net/news/show/30)

## Books

*   The final version of the [Gradle in Action](http://www.manning.com/muschko/) eBook is available

## Events

*   [Registration for GR8Conf Europe 2014 is open](http://gr8conf.eu/)
*   You can find the [Greach conference on Lanyard](http://lanyrd.com/2014/greach/)
*   A new [Groovy user group in Warsaw](http://www.meetup.com/Warszawa-Java-User-Group-Warszawa-JUG/events/166258012/?utm_content=buffer5ada7&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer), Poland
*   Peter Ledbrook is speaking about why your build matters, and the [importance of Gradle](https://skillsmatter.com/meetups/6202-why-does-your-build-matter)