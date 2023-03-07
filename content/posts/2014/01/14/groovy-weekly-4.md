---
title: "Groovy Weekly #4"
date: "2014-01-14T00:00:00.000+01:00"
tags: [groovy, groovy-weekly]
---

Here’s the fourth edition of the Groovy Weekly column! The holidays are gone, and tons of news are here for your consumption.

## Releases

*   Jim Northrop [released Caelyf 1.1.2](https://groups.google.com/forum/#!topic/caelyf/RAEXqBpDsSA), the lightweight Groovy web toolkit for Cloud Foundry

## Articles

*   Guillaume Laforge wrote a small tutorial on [how to deploy a Ratpack application to Cloud Foundry](https://github.com/glaforge/ratpack-demo-cloudfoundry/blob/master/README.md), with a dedicated buildpack developed by Ben Hale
*   Cédric Champeau blogs about the upcoming [closure parameter type inference](http://melix.github.io/blog/2014/01/closure_param_inference.html) for Groovy
*   Guillaume Laforge shares the [notes of the last Groovy developer meeting](http://bit.ly/gdc9notes) in London prior to the Groovy Grails eXchance conference, covering various topics about the roadmap of Groovy 2.3 and Groovy 3.0.
*   Peter Niederwieser authored a document explaining [how to contribute to the development of the Spock](https://github.com/spockframework/spock/blob/groovy-1.8/CONTRIBUTING.md) testing framework
*   Ken Kousen uses [Groovy, POGOs, GSON and the Open Weather API](https://weblogs.java.net/blog/manningpubs/archive/2014/01/07/groovy-weather-pogos-gson-and-open-weather-ken-kousen-making-java-groovy-45-savings)
*   Dustin Marx blogs about [identifying Gradle conventions](http://java.dzone.com/articles/identifying-gradle-conventions)
*   Noam Tenne explains how to [register new Spring beans in Grails at runtime](http://blog.10ne.org/2014/01/08/registering-new-spring-beans-in-grails-during-runtime/)
*   New Relic, the app performance management solution, adds [Groovy and Grails support to its Java agent](http://blog.newrelic.com/2014/01/08/new-relic-supports-grails/)
*   There's now a [TestFairy plugin for Gradle](http://blog.testfairy.com/testfairy-gradle-plugin/), to test Android application with the [TestFairy](http://www.testfairy.com/) platform
*   Amit Jain from IntelliGrape, organizers of the GrailsConf India conference, is listing [15 reasons why developers should use the Grails](http://www.indicthreads.com/10774/15-reasons-grails-web-application-framework/) web application framework
*   Amit Jain from IntelliGrape is writing about [Spock's @ConfineMetaClassChanges annotation](http://www.intelligrape.com/blog/2014/01/10/spock-confinemetaclasschanges-annotation-made-writing-grails-unit-test-easier/) to make writing grails unit test easier
*   The [social value of Groovy and Grails in Brazil](http://www.itexto.com.br/devkico/en/?p=47) by Henrique Lobo Weissmann
*   Dustin Marx explains how to [customize the Gradle Java plugin](http://www.javacodegeeks.com/2014/01/simple-gradle-java-plugin-customization.html)
*   Stergios Papadimitriou shows that [Fast Fourier Transforms can be performed in GroovyLab faster than plain C](https://code.google.com/p/jlabgroovy/wiki/JavaFFTvsNative), and as fast as optimized C routines
*   Peter Ledbrook [updated the Grails Searchable plugin installation instructions](http://grails.org/plugin/searchable) to show how to make it work with Grails 2.3
*   Ondrej Kvasnovsky blogs about [Grails integration with Vaadin](https://vaadin.com/blog/-/blogs/grails-integration-with-vaadin)
*   A [basic introduction to Groovy Closures](http://java.dzone.com/articles/closures-groovy) by Alex Staveley

## Presentations

*   [Grails and the realtime web](http://www.infoq.com/presentations/grails-real-time-web), presented by Stéphane Maldini at SpringOne2GX 2013
*   Jeff Brown presented [polyglot web development with Grails 2](http://www.infoq.com/presentations/polyglot-grails), during SpringOne 2GX 2013
*   Steve Pember discusses the [architecture, the frameworks and Responsive Design principles](http://www.infoq.com/presentations/grails-javascript-app) to be employed while building a single-page JavaScript application., and why use Grails for that. Presented at GR8Conf US 2013

## Screencasts

*   Screencast of the awesome [support of Gradle in IntelliJ IDEA 13](https://www.youtube.com/watch?v=3Euo6xzCwY4)
    
## Mailing-list discussions

*   Andrés Almiray follows up on the [status of Griffon 2.0](http://markmail.org/message/n5x6v5rkvsqy25pp?q=griffon+list:org%2Ecodehaus%2Egriffon%2Euser+order:date-backward&page=1)

## Tweets

*   A possible Spock contribution could be the development of a [new website for Spock using the Ratpack](https://twitter.com/ratpackweb/status/420625975672832000) web framework
*   Peter Ledbrook mentions that the [Lazybones templates for Ratpack are now managed in the Ratpack project](https://twitter.com/pledbrook/status/420501665788485632). Also, new versions are available for the Ratpack 0.9.0 release
*   Burt Beckwith [warns Grails users to avoid save(failOnError: true)](https://twitter.com/burtbeckwith/status/420940987754487808) as exceptions are costly, as demonstrated in this article on the [cost of using exceptions](http://shipilev.net/blog/2014/exceptional-performance/)
*   Baruch Sadogursky is a fan of the [Ratpack](http://www.ratpack.io/) framework and found its [website one of the most stylish](https://twitter.com/jbaruch/status/420486836818309120)
    
## Google+ post

*   Mark Perry shows example of ["lenses" and "state monads"](https://plus.google.com/b/101432359761228268146/103753917802203497881/posts/UH2XLq7WtMb?cfem=1) for some more advanced functional programming with Groovy
    
## Code snippet

*   Václav Pech [demonstrates use of GPars lazyTasks](https://github.com/GPars/GPars/blob/master/src/test/groovy/groovyx/gpars/samples/dataflow/DemoLazyTaskDependencies.groovy) to lazily and asynchronously load mutually dependent components into memory
*   Tim Yates [rewrites Carin Meier's](https://gist.github.com/timyates/8318143) (@gigasquid) [fun presentation on Monads](http://www.infoq.com/presentations/Why-is-a-Monad-Like-a-Writing-Desk) in Groovy
*   Mike Mitterer shows how to [show the Git tag version in your Gradle build version](https://plus.google.com/u/0/+MikeMitterer/posts/Wnjzg8cGLV6)
*   Tim Yates is also [playing with functional lenses](https://gist.github.com/timyates/8416286) in Groovy

## Jobs

*   Looking for a [Grails job in Gibraltar](http://findgrailsjobs.com/job/466-grails-developer)?
*   A [Grails engineering job at WIBAX in Milan](http://findgrailsjobs.com/job/467-grails-engineering), Italy
    
## Other news

*   As usual, the the [Grails Diary](http://grydeske.net/news/show/25) is out, week 2 of 2014, by Jacob Aae Mikkelsen

## Books

*   Dave Klein and Ben Klein's book, ["Grails 2: A Quick-Start Guide", is now in print and shipping](http://pragprog.com/book/dkgrails2/grails-2-a-quick-start-guide)
*   Packt Publishing is [looking for reviewers for the Groovy 2 Cookbook book](https://plus.google.com/u/0/111223528095963043865/posts/Vf6D9yexTuC?cfem=1)
    
## Events

*   Luke Daley is returning to his native Australia, but before leaving, he'll be giving one [last talk at the London Groovy Grails User Group on Gradle, Ratpack](http://www.meetup.com/london-ggug/events/155734632/) and more, on January 20th
*   The [Call for Papers](http://cfp.gr8conf.org/login/auth) for the GR8Conf Europe (Copenhagen, Denmark, on June 2nd-4th 2014) and GR8Conf US (Minneapolis, USA, on July 28th-29th 2014) conferences is now open
*   The Call for Papers for the [Greach](http://greach.es/) conference (Madrid, Spain, on March 28th and 29th 2014) is also open, till January 31st