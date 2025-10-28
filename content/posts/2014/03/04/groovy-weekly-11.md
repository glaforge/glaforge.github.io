---
title: "Groovy Weekly #11"
date: 2014-03-04T00:00:00.000+01:00
tags: [groovy, groovy-weekly]
---

This is a bit of a special day for me today, as it’s my first daughter’s birthday, who just reached 6, a much younger age than my 10 years involvement in Groovy! And after eating a home-made vanilla French yogurt birthday cake, I’m happy to share with you the following news bits, in particular the nice releases of Groovy 2.2.2, of the first milestone of Grails 2.4, as well as of Ratpack 0.9.2.

## Releases

*   Cédric Champeau announces the [release of Groovy 2.2.2](http://groovy.markmail.org/thread/kssk4ti7kpf5qxcf), done through our new build and delivery infrastructure, built with JetBrains' TeamCity on the server they are sponsoring for us, delivered through JFrog's Artifactory and Bintray pipeline, towards JCenter and Maven Central for the hosting
*   Graeme Rocher announces the [first milestone release of Grails 2.4](http://grails.org/2.4.0.M1+Release+Notes), with Groovy 2.2, Spring Framework 4, the asset pipeline, and static compilation
*   [Ratpack 0.9.2 released](http://www.ratpack.io/versions/0.9.2)
*   Carlos Garcia released a [Gradle Groovy Console plugin](https://github.com/carlosgsouza/gradle-console) which allows you to run a Groovy Console and lets you play with your code and dependencies
*   Al Baker publishes version [0.7.2 of his Groovy Sparql](https://twitter.com/AlBaker_Dev/status/440555501106249728) library

## Articles

*   An article on the [Netflix Dynamic Scripting Platform](http://techblog.netflix.com/2014/03/the-netflix-dynamic-scripting-platform.html), which is using Groovy as its scripting language
*   David Turanski on [Groovy bean configuration in Spring Framework 4](https://spring.io/blog/2014/03/03/groovy-bean-configuration-in-spring-framework-4)
*   Tomás Lin shows how to [deploy Spring Boot Groovy scripts as a Jar file in Cloud Foundry](http://fbflex.wordpress.com/2014/02/28/spring-boot-jar-cloud-foundry/)
*   Jean-Baptiste Nizet writes about [generating REST API documentation with Asciidoctor and Gradle](http://blog.ninja-squad.com/2014/02/25/rest-api-doc-with-asciidoctor-and-gradle/). Also note that he could have used the [Gradle Asciidoctor plugin.](https://github.com/asciidoctor/asciidoctor-gradle-plugin)
*   David Estes writes about [faster asset compilation with Grails asset-pipeline](http://www.davydotcom.com/blog/2014-02-25-faster-asset-compilation-with-grails-asset-pipeline) plugin
*   [Groovy Integration with Adobe CQ5](http://www.intelligrape.com/blog/2014/02/27/groovy-integration-with-cq5-in-maven/) and Maven

## Presentations

*   Venkat Subramaniam speaks about the [DRY principle in Grails](https://www.agilelearner.com/presentation/124)
*   Dan Woods presented about [practical REST in Grails 2.3](http://fr.slideshare.net/danveloper/practical-rest-in-grails-23)
*   Brian Kotek advises on creating [RIA applications in Grails](http://www.infoq.com/presentations/grails-ria) using an array of technologies, including JavaScript, CoffeeScript, TypeScript, ExtJS, Dojo, REST, JSON, GSON, GORM, etc.

## Screencasts

*   Bobby Warner demonstrates the [Grails asset pipeline through a screencast](http://www.bobbywarner.com/2014/02/26/grails-asset-pipeline-plugin/)

## Code snippets

*   Tim Yates provides some examples of [usage of his Groovy Stream library](https://gist.github.com/renatoathaydes/5078535#comment-1184256) in this Haskell vs Groovy comparison Gist
*   A script showing how easy it is to use [GStorm and Groovy to crunch and consume data from REST APIs](https://gist.github.com/kdabir/9332408)
*   Cédric Champeau provides a sample [integration of the upcoming new markup template engine of Groovy 2.3 with Spring Boot](https://github.com/melix/spring-groovymarkup)

## Tweets

*   [Groovy 2.2.2 is available through GVM](https://twitter.com/gvmtool/status/438809878812172288)
*   André Steingreß points at the [Groovy support in Github's Atom text editor](https://twitter.com/asteingr/status/439652445116182528)
*   Dierk König says [Groovy experience makes for a perfect training in Java 8 lambdas](https://twitter.com/mittie/status/439740263427506176)
*   Russell Hart shows a sample of a [realtime metrics dashboard built with Ratpack](https://twitter.com/rus_hart/status/439765546796462081) and Websockets
*   A conversation triggered by Collin Harrington on [Grails @Transactional](https://twitter.com/ColinHarrington/status/438046837241806848)
*   Ludovic Champenois tweeted about the [new Gradle plugin for Google App Engine](https://twitter.com/ludoch/status/438870147017633793) which also works great in Android Studio
*   Chanwit Kaewkasi reports the creation of a [20-node Spark Hadoop cluster and is scripts it with the Groovy Console](https://twitter.com/chanwit/status/440909970448449536)
*   [Spring Boot 1.0-rc4 is available through GVM](https://twitter.com/gvmtool/status/440766140122673152)
*   Benoit Hediard releases the [CDN asset pipeline Grails plugin](https://twitter.com/benorama/status/440851116436488192) to publish assets into CDNs
*   Marco Vermeulen [updates his Gradle Heroku plugin](https://twitter.com/marcoVermeulen/status/440854403059159040)

## Google+ posts

*   Kunal Dabir shares a script to see [how Groovy developer friendly is your machine](https://plus.google.com/u/0/+KunalDabir/posts/VFwUAve5DNM?cfem=1)

## Mailing-list discussions

*   An ongoing discussion on [Gradle's upgrade path towards Groovy 2](http://gradle.1045684.n5.nabble.com/upgrade-gradle-to-groovy-2-td5712332.html) instead of the old 1.8.6

## Other news

*   Andrés Almiray is launching a [Gradle plugin portal](http://aalmiray.github.io/gradle-plugins/)
*   Maciek Opała wrote me to tell us about a [mobile build automation solution for iOS, Android and Windows phone](https://github.com/apphance/Apphance-MobilE-Build-Automation), in the form of a Gradle plugin
*   The excellent [Grails Diary](http://grydeske.net/news/show/32), like every Sunday, from Jacob Aae Mikkelsen

## Books

*   Till March 11th, you get [50% off of Gradle in Action](http://campaign.r20.constantcontact.com/render?llr=gimslwbab&v=001QGVxMVttOOarDTh0jflYxJN1lCcc6sQJTBmK4WKxc8Bf8ucTp1ky44eTr6BtW7_IyYa8R-ZU-huk-pSyoVSuKqXXHLwUdZj_Cd8_eddHh7a_gmMEsP9BrnXnSEKpzLTYYC3fWFCEbw4%3D) and other selected books
*   The [Gradle in Action print book is 43% off till March 20th](https://twitter.com/bmuschko/status/439099709940957185) with a special promo code
*   A short Amazon [review of the Grails 2: Quick Start Guide](http://www.amazon.com/review/R1NHVXJREXYDIT) book from Dave Klein

## Jobs

*   Netflix is [hiring Gradle build and plugin developers](https://twitter.com/robspieldenner/status/438513787058921472)

## Events

*   Gradleware reminds that \*you\* could be a [presenter at the Gradle Summit 2014](https://twitter.com/Gradleware/status/440380894059044864)!
*   Hubert Klein Ikkink (alias MrHaki) will be presenting a [getting started Grails university session for the NLJUG](https://twitter.com/jdriven_nl/status/440521630737911809) on March 25th
*   The [GR8Ladies will be at Women Techmakers](https://twitter.com/Gr8Ladies/status/440298407874158593), in Minneapolis, on March 22nd