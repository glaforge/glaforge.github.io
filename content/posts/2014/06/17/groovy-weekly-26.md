---
title: "Groovy Weekly #26"
date: 2014-06-17T00:00:00.000+02:00
tags: [groovy, groovy-weekly]
---

So what’s new this week?

We can highlight the first beta of Groovy 2.4 with the Android support, so users can start having a go at writing Android applications in Groovy! As well as bug fixes releases for Grails 2.3.x and 2.4.x.

Let’s also mention the launch of the Gradle plugin portal, announced last week at the Gradle Summit. And you’ll find also lots of presentations from the conference.

## Releases

*   Groovy 2.3.3 released and [Groovy 2.4.0-beta-1 with Android support]({{< ref "/posts/2014/06/11/groovy-2-3-3-and-groovy-2-4-beta-1-with-android-support" >}}) is out too
*   [Grails 2.4.1 and 2.3.10](https://twitter.com/grailsframework/status/478908515130830848) released with loads of bug fixes
*   [Spring Boot 1.1](https://spring.io/blog/2014/06/10/spring-boot-1-1-ga-released) released
*   [Spring Boot 1.1.1](https://twitter.com/springboot/status/476821967018799104) is out, fixing a little issue with the 1.1.0 release
*   Marcin Erdmann announces the [release of Geb 0.9.3](http://grails.1312388.n4.nabble.com/ANN-Geb-0-9-3-released-td4657113.html)
*   [Gretty 0.0.24](https://twitter.com/andreyhihlovski/status/476615698262007808) is out, with full support of Spring Boot 1.1.0
*   [Redis GORM 1.0.0](https://twitter.com/grailsplugins/status/477022016994672642) released
*   Cédric Champeau released a [JMH Gradle Plugin](https://github.com/melix/jmh-gradle-plugin) that integrates the JMH micro-benchmarking framework with your Gradle build

## Articles

*   Marc Palmer on the [journey from Objective-C to Groovy](http://transition.io/the-journey-from-objective-c-to-groovy/)
*   MrHaki’s [Getting Groovy extensive tutorial](http://gr8labs.org/getting-groovy/)
*   MrHaki's Spock-light: on [using an extra data variable for unroll description](http://mrhaki.blogspot.fr/2014/06/spocklight-extra-data-variables-for.html), based on Rob Fletcher's GR8Conf Europe Spock talk
*   Graeme Rocher blogs about a Gradle to [get the nice GroovyDoc style](http://grails.io/post/88656787208/generating-pretty-groovy-2-3-groovydocs-with-gradle) from Groovy 2.3+ even if your project is using Groovy 2.2 or below
*   [Docker containers with Gradle in 4 easy steps](http://thediscoblog.com/blog/2014/06/13/docker-containers-with-gradle-in-4-steps/), by Andy Glover
*   Andrés Almiray wrote about the [Griffon 2.0.0 beta](http://www.jroller.com/aalmiray/entry/griffon_2_0_0_beta)
*   [Pooling web service connections in Grails](http://www.objectpartners.com/2014/06/11/pooling-web-service-connections-in-grails/) by Jeff Sheets
*   Building enterprise Mule applications with Gradle: [part 1](http://blogs.mulesoft.org/building-mule-apps-gradle/), [part 2](http://blogs.mulesoft.org/building-mule-apps-gradle-studio/), [part 3](http://blogs.mulesoft.org/building-enterprise-apps-gradle/)

## Presentations from the Gradle Summit

*   Justin Ryan from Netflix on the [Nebula Gradle plugin, a useful test harness for Gradle plugins](http://fr.slideshare.net/quidryan/gradle-summit-2014-nebula)
*   David Carr on [cloud browser testing with Gradle and Geb](http://www.slideshare.net/davidmc24/cloud-browser-testing-with-gradle-and-geb)
*   Benjamin Muschko on [web application deployments with Gradle](https://speakerdeck.com/bmuschko/web-application-deployments-with-gradle-from-the-developers-machine-to-continuous-deployment)
*   Benjamin Muschko on [provisioning virtualized infrastructure with Gradle](https://speakerdeck.com/bmuschko/provisioning-virtualized-infrastructure-with-gradle)
*   Tobias Gesellchen shares his slides and code snippets on [moving from Maven to Gradle](http://gesellix.github.io/gradle-summit-2014/)
*   Rene Gröschke on [releasing with Gradle](http://www.slideshare.net/breskeby/releasing-with-gradle-gradle-exchange-2014)
*   Dan Woods spoke about his [Gradle provisioning plugin](https://twitter.com/varzof/status/477519220150767616)
*   Andrés Almiray was [spreading the word about Groovy, Gradle, Spock](http://grails.org.mx/2014/06/11/resumen-24ta-reunion/) and more in Mexico (Spanish content)

## News

*   Gradleware just announced the [launch of the Gradle plugin portal](http://plugins.gradle.org/)
*   Guillaume Laforge shares the [future look of the new Groovy documentation](http://beta.groovy-lang.org/docs/groovy-2.3.4-SNAPSHOT/html/documentation/)
*   Jacobe Aae Mikkelsen on the [Grails Diary week 24](http://grydeske.net/news/show/49)
*   Learn about the [GrooScript roadmap](http://grooscript.org/roadmap.html)
    
## Mailing-list posts

*   An interesting thread on [selling Groovy to your management](http://groovy.329449.n5.nabble.com/Need-help-with-quot-Groovy-sales-pitch-quot-td5720060.html)
*   A [“provided scope”](http://gradle.1045684.n5.nabble.com/Regression-list-for-1-12-td5712639.html#a5712650) might come to Gradle

## Code snippets

*   An [intentionally vulnerable Grails application](http://blog.nvisium.com/2014/06/introducing-grailsnv-vulnerable-groovy.html) for education purpose
*   A demo project show-casing the [Gradle tooling API](https://github.com/radimk/gradle-toolingApi-demo)

## Contributions

*   Grant McConnaughey contributed [documentation on Groovy “statements”](https://twitter.com/glaforge/status/478085555407040512). Thank you, Grant. To all, please don’t hesitate to help us and contribute to the documentation effort!

## Tweets

*   A good way to get started with Groovy, with the [GroovyKoans](https://twitter.com/geeky_android/status/478164163349721088)
*   The [Estonian emergency system is powered by Grails](https://twitter.com/jfarcand/status/477453724299042816) and Atmosphere
*   [Gradle 2.0 is 20% to 70% more performant](https://twitter.com/danveloper/status/477113115515953153) than Gradle 1.0
*   The [Gradle plugin portal is built with Ratpack](https://twitter.com/ratpackweb/status/477128712622579713) and RxJava
*   You can start [submitting your Gradle plugin to the Gradle plugin portal](https://twitter.com/danveloper/status/477119125966188546)
*   Cédric Champeau announces his [JMH Gradle plugin](https://twitter.com/cedricchampeau/status/478514436358275072) and showing a sample project using it
*   Andrés Almiray things the [Gradle plugin portal has been rushed a bit](https://twitter.com/aalmiray/status/477734872946319361), in time for Gradle Summit, as it's still a bit complicated to submit plugins for inclusion
*   Cédric Champeau notices only minor changes are needed to be able to [build Groovy with Gradle 2.0-rc-1](https://twitter.com/cedricchampeau/status/476638077323341824)
*   Initial work from Russell Hart bringing [Ratpack into the "Reactive Streams"](https://twitter.com/ratpackweb/status/476210105319309314) family
*   Cédric Champeau would like to see the ["new" keyword totally optional](https://twitter.com/cedricchampeau/status/476752756376891392) in Groovy, without using @Newify
*   Guillaume Laforge suggests creating an ["Enterprise" version of Groovy's "spaceshift" operator](https://twitter.com/glaforge/status/477359185253134336)
*   Magnus Rundberget [explores the Ratpack Gradle dependencies](https://twitter.com/mrundberget/status/476645367808008192) with the LightTable Groovy plugin 0.0.6
*   The Grails [GORM groovydoc](https://twitter.com/grailsframework/status/477124659574738945) is available standalone
*   Cédric Champeau is surprised when people say using [“def” makes a dynamic type (but “def” == “Object”)](https://twitter.com/cedricchampeau/status/477079037098340353)
*   Cédric Champeau remarks that [Groovy is a strongly typed language](https://twitter.com/cedricchampeau/status/477079421569212416)
*   [CRaSH 1.3.0](https://twitter.com/gvmtool/status/477425205716217856) is available in GVM
*   CrudZilla’s [HiveMind web app generator](https://twitter.com/crudzillasoft/status/477560344542334977) is written largely in Groovy through JSR-223
*   The [Gradle Node plugin](https://twitter.com/dailygrailstip/status/477860347601092610) gives you an easy way to install and run Node.JS on Continuous Integration environments
*   Burt Beckwith is going to each [Groovy and Grails again at Harvard](https://twitter.com/burtbeckwith/status/477253832120881152)

## Jobs

*   A [Groovy / Grails developer for Plano in Texas](https://twitter.com/findgrailsjobs/status/476758016680013824), USA

## Events

*   Cédric Champeau will speak about [Groovy Traits at JavaOne](https://twitter.com/CedricChampeau/status/477010580260528130)
*   JavaOne session acceptance emails are starting to flow, and the first Groovy sessions are appearing, for instance Guillaume Laforge's on the [latest & greatest Groovy, or Groovy in the light of Java 8](https://twitter.com/glaforge/status/476657140128817152)
*   MrHaki's [report on GR8Conf](http://blog.jdriven.com/2014/06/gr8conf-2014-europe-conference-report/) Europe 2014
*   Quick summary from Andrés Almiray about the [GR8Conf Europe 2014 Hackergarten](http://www.jroller.com/aalmiray/entry/hackergarten_gr8conf)