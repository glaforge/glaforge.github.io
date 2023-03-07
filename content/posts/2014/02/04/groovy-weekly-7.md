---
title: "Groovy Weekly #7"
date: "2014-02-04T00:00:00.000+01:00"
tags: [groovy, groovy-weekly]
---

## Releases

*   [Ratpack 0.9.1 is released](http://www.ratpack.io/versions/0.9.1), with performance and memory consumption improvements, as well as an RxJava module
*   John Engelman releases [version 2.0.0 of the Grails-Gradle plugin](http://imperceptiblethoughts.com/post/74739966407/grails-gradle-plugin-2-0-0-released)
*   Cédric Champeau created a [Gradle plugin for JBake](https://github.com/melix/jbake-gradle-plugin), to be able to render static web sites as part of your Gradle build
*   Release of an [update to the Grails Api Toolkit plugin](http://grails.org/plugin/api-toolkit) helping build API with REST, RPC and HATEOAS support

## Articles

*   The [Groovy style guide](http://groovy.codehaus.org/Groovy+style+and+language+feature+guidelines+for+Java+developers) shared by Guillaume Laforge echoing a [conversation](https://twitter.com/pcarey/status/428676607109111808) on Twitter about the bad practice of putting def everywhere
*   Cédric Champeau details how to [create your own static blog with JBake, Gradle and Github](http://melix.github.io/blog//2014/02/hosting-jbake-github.html)
*   An article on [Groovy Memoization](http://www.objectpartners.com/2014/01/28/memoization-in-groovy) by Brendon Anderson
*   [Why is Groovy groovy](http://dmahapatro.blogspot.fr/2014/01/how-is-groovy-groovy.html)?
*   Burt Beckwith offers [one more approach for diagnosing spring-security-core login errors](http://burtbeckwith.com/blog/?p=2029)
*   André Steingreß [covers the Grails Audit plugin](http://blog.andresteingress.com/2014/01/31/grails-audit-logging/)
*   André Steingreß is covering [Grails testing with Cucumber](http://blog.andresteingress.com/2014/01/28/functional-testing-with-cucumber/)
*   Following up on his previous post, André Steingreß [continues his Grails testing with Cucumber](http://blog.andresteingress.com/2014/01/29/functional-testing-with-cucumber-followup/)
*   Jochen Theodorou explains [what class duplication is](http://blackdragsview.blogspot.fr/2014/01/what-class-duplication-is-and-how-it.html) and how it happens
*   Testing [Grails with Cucumber, HTTPBuilder, and RemoteControl](http://softnoise.wordpress.com/2014/01/27/grails-cucumber-with-httpbuilder-remotecontrol/)
*   Ken Kousen plays with [Groovy's date support](http://kousenit.wordpress.com/2014/02/02/groovy-groundhogs-revisited/)
*   Hubert Klein Ikkink shares some tips about [cleaning up your Grails projects](http://mrhaki.blogspot.fr/2014/02/grails-goodness-cleaning-up.html)
*   Following up on MrHaki's Grails clean-up tip, André Steingreß offers his own [Grails tip for cleaning up everything](http://blog.andresteingress.com/2014/02/03/grails-clean/) in a single rm command
*   Michael Scharhag blogs about [using database views in Grails](http://www.mscharhag.com/2014/01/using-database-views-in-grails.html)
*   A tutorial on developing a [Grails application with Facebook Connect](http://developer.cloudbees.com/bin/view/DEV/GrailsAppFacebookConnect)
*   A [broad stroke overview of Grails](http://sigma-infosolutions.blogspot.in/2014/01/a-broad-stroke-overview-of-grails-web.html) web app development framework

## Presentations

*   Hubert Klein Ikkink, alias MrHaki, [presented Getting Groovy](http://mrhaki.blogspot.fr/2014/02/getting-groovy-g8conf-2013-europe-on.html), at GR8Conf Europe 2013.
*   Ken Kousen advises Java developers [how to do similar tasks in Groovy](http://www.infoq.com/presentations/java-groovy-2gx): building and testing applications, accessing both relational and NoSQL databases, accessing web services, and more.
*   At GR8Conf US 2013, Craig Atkinson presents the advantages of using the [Geb functional testing](http://www.infoq.com/presentations/grails-geb-functional-test) library for creating robust and readable tests with both JUnit and Spock, and configuring Geb for testing across multiple browsers.
*   Recorded at GR8Conf US 2013, Kyle Boon reviews [3 frameworks for building RESTful WS](http://www.infoq.com/presentations/rest-groovy-framework) (Grails, Dropwizard and Ratpack), comparing their code readability, maintainability, deployment, metrics collection, scalability and testability.
*   At SpringOne2GX 2013, Joe Rinehart discusses some of the [essential security topics for Grails](http://www.infoq.com/presentations/grails-security) (and Java) Web applications, showing how Grails can make life easier and the pitfalls of attempting to secure highly dynamic code.
*   Ryan Vanderwerf explains setting up Terracotta and [clustering a Grails application](http://www.infoq.com/presentations/grails-terracotta-quartz) using Ehcache, HTTP Session in Tomcat, and Quartz. Recorded at GR8Conf US 2013.

## Mailing-list discussions

*   Dinko Srkoč announces the birth of his [stream extension to Groovy's Sql](http://groovy.329449.n5.nabble.com/ann-groovy-sql-Sql-and-streaming-ResultSet-td5718265.html) facility (potentially to be included in Groovy)

## Code snippets

*   Tim Yates is trying to [implement Groovy's collate() method with Java 8 streams](https://twitter.com/tim_yates/status/428488170682863616) and lambdas.
*   Tim Yates offers a little sample showing how to [display a little spinner icon in text mode](https://gist.github.com/timyates/8648011) for long running tasks

## Tweets

*   Cédric Champeau lobbies for having the [normal "groovy" JAR to also "jarjar" the mandatory basic dependencies](https://twitter.com/CedricChampeau/status/430744126955745280) of ASM, Antlr and Commons-CLI, like with the Groovy all JAR. You can vote for that JIRA issue.
*   Andrés Almiray tweets his [desire to see a Gradle portal plugin](https://twitter.com/aalmiray/status/429222410425212928) soon
*   Dierk König tweets about [Groovy being for getting things done](https://twitter.com/mittie/status/430271085486288896) rather than for showing off!
*   groovy.io are [looking for sponsors](https://twitter.com/groovyio/status/430498283547406336) for their upcoming hackathon
*   The Grain static site generator introduces [dynamic rendering anywhere](https://twitter.com/grainframework/status/428881821502144514)
*   Grails provides a command to [generate a zip file to attach to a JIRA issue](https://twitter.com/dailygrailstip/status/429848791668097024) if you need to file a bug report with a reproducible problem
*   [Gradle 1.11-rc1 is available through GVM](https://twitter.com/gvmtool/status/430464483589623809)
*   The Grails force-ssl plugin adds an [@SSLRequired](https://twitter.com/davydotcom/status/430692627323686913) annotation
*   Dan Woods published a [new plugin for Grails for simplifying & streamlining the implementation of RESTful renderers](https://twitter.com/danveloper/status/430692110560272384)

## Other news

*   Week 5 of the [Grails diary](http://grydeske.net/news/show/28) by Jacob Aae Mikkelsen

## Books

*   The [Groovy 2 Cookbook has its dedicated website](http://groovy.aestasit.com/)
*   A short [review of the "Groovy 2 cookbook"](http://shitmores.blogspot.fr/2014/02/book-review-groovy-2-cookbook.html) book
    
## Events

*   SkillsMatter, the organizer of the Groovy / Grails eXchange conference since 2007, have overhauled their website, and you can already see the page for the [upcoming GGeX 2014 edition](https://skillsmatter.com/conferences/1957-groovy-grails-exchange-2014)
*   Dan Woods is [speaking about Grails 2.3's Rest capabilities](http://www.meetup.com/San-Francisco-Grails-Centro/events/162510932/) on February 27th at the San Francisco Grails meetup