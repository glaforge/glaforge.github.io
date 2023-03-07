---
title: "Groovy Weekly #1"
date: "2013-12-24T00:00:00.000+01:00"
tags: [groovy, groovy-weekly]
---

Welcome to the Groovy Weekly news brief!

As the name implies, I’m going to try to make regular (in theory on a weekly basis) column of all the interesting news, presentations, code snippets, events, conferences related to the Groovy ecosystem.

And as a Christmas present, here’s the first issue!

Your feedback is important, and we’d be happy to hear about your thoughts on a regular column about Groovy related news: what are your expectations, what you’d like to hear about, what news bits are of higher interest to you, how you would like this information to be delivered, etc.

As a first step, we’ll cover links to articles, blog posts, tweets, presentations, releases, events, books, code snippets. But you can contribute too! I’ve setup a Google Form where you can fill in a few fields with a link, a description, the kind of information you’re sharing, etc. So feel free to submit interesting information through this form here:

[http://bit.ly/groovyweekly](http://bit.ly/groovyweekly)

The first Groovy Weekly edition will be posted on my personal blog, and the link will be spread on various channels (mailing-list, twitter, Google+, etc) but I’m wondering how to best deliver this information. I’m thinking particularly of setting up a newsletter format, for instance with a service like Mailchimp, so that people could opt in and subscribe to receive this weekly column directly in their inbox.

In the meantime, and on behalf of the Groovy development team, we wish you the best for the holidays! A Groovy Christmas and a Groovy New Year!

## Releases

*   a bug fix release with [Grails 2.3.4](http://grails.org/2.3.4%20Release%20Notes)
*   [Gradle 1.10](http://forums.gradle.org/gradle/topics/gradle_1_10_released) was released with improved progress reporting, executing specific tests from the command-line, shouldRunAfter task ordering, further C and C++ support
*   a new version of the [CodeNarc 0.20](http://groovy.329449.n5.nabble.com/ANN-Announcing-CodeNarc-0-20-td5717822.html) static analysis tool for Groovy with new rules, as well as updated and enhanced rules

## Articles

*   The [Groovy roadmap](http://groovy.codehaus.org/Roadmap) page has recently been udpated, giving a better view of the coming releases of Groovy 2.3 and 3.0, and their respective content
*   Burt Beckwith explains how to automatically [convert password hashes in Grails spring-security-core](http://burtbeckwith.com/blog/?p=2017)
*   Roy Clarkson shows how you can easily [serve static web content with Spring Boot](https://spring.io/blog/2013/12/19/serving-static-web-content-with-spring-boot), thanks to a little Groovy Spring controller
*   Dusting Marx covers how to [search Subversion logs with Groovy](http://java.dzone.com/articles/searching-subversion-logs)
*   MrHaki demonstrates [how to use the @PackageScope transformation with methods, fields and classes](http://mrhaki.blogspot.dk/2013/12/groovy-goodness-using-package-scoped.html)
*   Dustin Marx writes about the [sublime simplicity of scripting with Groovy](http://www.javacodegeeks.com/2013/12/sublime-simplicity-of-scripting-with-groovy.html)
*   Simon Temple talks about [sandboxing Groovy code](http://simontemple.blogspot.co.uk/2013/12/groovy-in-cloud-sandboxing-and-more.html) through an AST transformation that examines all method invocations to check if they are allowed or not
*   Lieven Doclo demonstrates [rapid REST prototyping with Groovy](http://groovy.dzone.com/articles/rest-prototyping-spark-and) and the [Spark](http://www.sparkjava.com/) micro web framework for the Java platform
*   Interview about how "[VMware surmounts learning curve by developing Project NEE platform](http://searchvmware.techtarget.com/feature/VMware-surmounts-learning-curve-by-developing-Project-NEE-platform)" with Groovy and Grails

A particular highlight for Jacob Aae Mikkelsen who continues Burt Beckwith original “this week in Grails” column, in the form of the [Grails diary](http://grydeske.net/news/show/22). This “Groovy Weekly” column obviously overlaps a bit with the Grails diary, but the Grails diary has a particular focus on Grails which you might be interested in, especially with regards to the latest news regarding the Grails plugins ecosystem. Be sure to check it out if you’re developing with Grails.

Last but not least, Trisha Gee published three interesting articles on the Spock testing framework:

*   [mocking with Spock](http://mechanitis.blogspot.co.uk/2013/07/spock-is-awesome-seriously-simplified.html)
*   [stubbing with Spock](http://mechanitis.blogspot.co.uk/2013/07/spock-passes-next-test-painless-stubbing.html)
*   [data-driven testing with Spock](http://mechanitis.blogspot.com.es/2013/12/spock-data-driven-testing.html)

## Groovy / Grails eXchange 2013 special

On the 12th and 13th of December, took place the [Groovy / Grails eXchance conference](http://skillsmatter.com/event-details/home/groovy-grails-exchange-2013), in London, UK, organized by the fine folks of [SkillsMatter](http://skillsmatter.com/), gathering the Groovy ecosystem crowd, to speak about Groovy, Grails, Gradle, Ratpack, and more.

What’s special about this conference is that it’s been SkillsMatter which organized the first ever conference on the Groovy ecosystem back in 2007! Also, what’s double nice is that they record everything and that the presentations are available in matter of hours at no cost. So let me guide you through all the presentations that took place at the conference:
  
### First day

*   [The Groovy update](http://skillsmatter.com/podcast/home/keynote-guillaume-laforge) by Guillaume Laforge
*   [Making Java APIs Groovy](http://skillsmatter.com/podcast/home/making-java-apis-groovy) by Cédric Champeau
*   [DevQA, make your testers happier with Groovy, Spock, and Geb](http://skillsmatter.com/podcast/home/devqa-make-your-testers-happy-with-groovy-spock-and-geb) by Alvaro Sanchez Mariscal
*   [Modern Groovy enterprise stack](http://skillsmatter.com/podcast/home/modern-groovy-enterprise-stack) by Marcin Edmann
*   [Creating architectural flexibility with Groovy](http://skillsmatter.com/podcast/home/creating-architectural-flexibility-using-groovy) by David Dawson
*   [Ratpack, a toolkit for JVM web applications](http://skillsmatter.com/podcast/home/ratpack-a-toolkit-for-jvm-web-applications) by Luke Daley
*   [NoSQL with Grails](http://skillsmatter.com/podcast/home/nosql-with-grails) by Joseph Nusairat
*   [Developing single-page applications with Grails and AngularJS](http://skillsmatter.com/podcast/home/developing-spi-applications-using-grails-and-angularjs) by Alvaro Sanchez Mariscal
*   [Polyglot programming in Grails](http://skillsmatter.com/podcast/home/polyglot-programming-in-grails-2) by Jeff Brown
*   [Is Groovy static or dynamic](http://skillsmatter.com/podcast/home/is-groovy-static-or-dynamic) by Russel Winder
*   [Message driven architecture in Grails](http://skillsmatter.com/podcast/home/message-driven-architecture-in-grails) by Dan Woods
    
## Second day

*   [The road to Grails 3.0](http://skillsmatter.com/podcast/home/road-to-grails-3-0) by Graeme Rocher
*   [Build Grails applications with Gradle](http://skillsmatter.com/podcast/home/build-grails-applications-with-gradle) by Luke Daley
*   [Metaprogramming with the Groovy runtime](http://skillsmatter.com/podcast/home/metaprogramming-with-groovy-compiler) by Jeff Brown
*   [Restful async with Grails 2.3](http://skillsmatter.com/podcast/home/restfully-async-with-grails-2-3) by Graeme Rocher
*   [Open Source and you](http://skillsmatter.com/podcast/home/open-source-and-you) by Peter Ledbrook
*   [Reactor, a foundation for asynchronous applications on the JVM](http://skillsmatter.com/podcast/home/reactor) by Stéphane Maldini
*   [Groovy for system administrators](http://skillsmatter.com/podcast/home/groovy-for-system-administrators) by Dan Woods
*   [Building lightning fast REST services with Dropwizard and Groovy](http://skillsmatter.com/podcast/home/building-lightning-fast-rest-services-with-dropwizard-and-groovy) by Tomas Lin
*   [How Gradle saved the day at a major company](http://skillsmatter.com/podcast/home/how-gradle-saved-the-day-at-a-major-company) by Joseph Nusairat
*   [Application architecture in Groovy](http://skillsmatter.com/podcast/home/application-architecture-in-groovy-4945) by Dan Woods
*   [Groovy micro services with Spring Boot](http://skillsmatter.com/podcast/home/groovy-micro-services-with-spring-boot) by David Dawson

## Other presentations

Other presentations are also available from other conferences, in particular, InfoQ has been publishing SpringOne2GX 2013 and GR8Conf US talks on a regular basis. Here’s a recent selection of talks they released:

### SpringOne2GX

*   Core Groovy committers Paul King & Guillaume Laforge gave a presentation on [creating Domain-Specific Languages in Groovy that developers can actually use](http://www.infoq.com/presentations/groovy-dsl-mars)
*   Burt Beckwith discusses the security risks web applications may face (XSS, CRSF, SQL injection) and the libraries and plugins that developers can use to [secure their Grails applications](http://www.infoq.com/presentations/security-grails-apps)
*   Baruch Sadogursky [overviews and compares search and testing tools available to Grails developers](http://www.infoq.com/presentations/grails-search-test-tools)

### GR8Conf US

*   [Advanced Groovy tips & tricks](http://www.infoq.com/presentations/groovy-tips) by Ken Kousen, author of [Making Java Groovy](http://www.manning.com/kousen/)
*   [Programming in the Cloud - Groovy as an Extension Language for Oracle ADFm](http://www.infoq.com/presentations/groovy-adfm) by Jim Driscoll
*   Luke Daley presents the [Ratpack micro web framework](http://www.infoq.com/presentations/ratpack)
*   Peter Ledbrook speaks about [application architectures with Grails](http://www.infoq.com/presentations/grails-app-architecture)
    
### Øredev

Andrés Almiray shows the [functional aspects of the Groovy](http://vimeo.com/79868215) programming language in this presentation from Øredev.

On that functional theme, you can also have a look at:

*   Paul King’s [Functional Groovy](http://fr.slideshare.net/paulk_asert/functional-groovy) at SpringOne2GX
*   Guillaume Laforge’s [Functional Groovy](https://speakerdeck.com/glaforge/functional-groovy) at Scala.IO (slides available, but video not yet published)

### JAX London

Guillaume Laforge talks about [what makes Groovy groovy](http://jaxenter.com/guillaume-laforge-what-makes-groovy-groovy-49157.html). He also gave an updated presentation at Devoxx which is [published on Parleys](http://www.parleys.com/play/52a10c8be4b039ad2298ca76/chapter1/about), but it’s viewable for a fee (unless you attended the Devoxx conference) until it’s released publicly, but the [slides](https://speakerdeck.com/glaforge/what-makes-groovy-groovy-devoxx-2013) are available on speakerdec.

## Code snippets

*   [Reactive Rock Paper Scisors](https://gist.github.com/timyates/7823738) by Tim Yates, using Groovy and RxJava
*   Marcin Erdmann [developed](https://github.com/geb/geb/tree/master/doc/site) the new version of the [Geb website](http://www.gebish.org/) with Ratpack, deployed on Heroku
*   Luke Daley published a snippet of a [self contained Groovy script to bootstrap a Ratpack server](https://gist.github.com/alkemist/7943781)
    

## Tweets

*   Guillaume Laforge tweeted about Graeme Rocher’s [4 R's of Grails controllers: return, render, redirect and now respond for Rest](https://twitter.com/glaforge/status/411426080407711744)

## Mailing-list discussions

Cédric Champeau shows the current work in progress around [providing further type inference for methods taking closure arguments](http://groovy.329449.n5.nabble.com/Closure-parameter-type-inference-td5717804.html), as closures don't really offer a signature (a return type thanks to generics, yes, but no way to specify the type of the arguments).

Example of methods that we'll be able to type checked:
  
```groovy
@TypeChecked
void foo(List list) {
    println list.collect { it.toUpperCase() }
}
```

Before, the type checker would complain that it didn’t know the type of the implicit ‘it’, but by decorating the collect() method implementation with new dedicated annotations, it’s possible to instruct the type checker about the type of the closure parameters.

## Books

The [Groovy Goodness notebook](https://leanpub.com/groovy-goodness-notebook/) from MrHaki has been [udpated with the Groovy 2.2 features](http://mrhaki.blogspot.fr/2013/12/groovy-goodness-notebook-updated-with.html).

## Events

*   The [Call for Papers](http://cfp.gr8conf.org/login/auth) for the GR8Conf Europe (Copenhagen, Denmark, on June 2nd-4th 2014) and GR8Conf US (Minneapolis, USA, on July 28th-29th 2014) conferences is now open
*   The Call for Papers for the [Greach](http://greach.es/) conference (Madrid, Spain, on March 28th and 29th 2014) is also open, till January 31st
    
## Closing thoughts

Again, best wishes from the Groovy team for the holidays, and we’re looking forward to your feedback on this “Groovy Weekly” column, and to your contribution through the form: [http://bit.ly/groovyweekly](http://bit.ly/groovyweekly)