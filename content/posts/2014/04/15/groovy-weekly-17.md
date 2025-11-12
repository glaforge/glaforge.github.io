---
title: "Groovy Weekly #17"
date: 2014-04-15T00:00:00.000+02:00
tags: [groovy, groovy-weekly]

similar:
  - "posts/2014/04/08/groovy-weekly-16.md"
  - "posts/2014/04/29/groovy-weekly-19.md"
  - "posts/2014/05/06/groovy-weekly-20.md"
---

Busy conference times:

Greach is over, but we’re lucky to get the next batch of presentations and videos online on the [Greach Youtube channel](https://www.youtube.com/user/TheGreachChannel).

The [GR8Conf Europe](http://gr8conf.eu/) early bird price has been extended for another week.

And Cédric and myself (Guillaume) are heading to the Devoxx France conference to speak about Groovy and Gradle.

While at the same time, the Groovy team is delivering [a new beta for the lovely Groovy 2.3]({{< ref "/posts/2014/04/10/second-beta-for-groovy-2-3" >}}) release.

Busy times, I tell you!

## Releases

*   Guillaume Laforge announces a [second beta for Groovy 2.3.0]({{< ref "/posts/2014/04/10/second-beta-for-groovy-2-3" >}})
*   [Groovy 2.3.0-beta-2](https://twitter.com/gvmtool/status/454366295476416512) is available through GVM
*   A [Spring Boot Lazybones template](https://twitter.com/pledbrook/status/454523372756795392) available

## Interviews

*   [Interviews recorded at Greach](http://autentia.com/2014/04/15/las-entrevistas-de-greach-ya-disponibles): Alberto Vilches, Russel Winder, Cédric Champeau, Graeme Rocher, Guillaume Laforge, Sébastien Blanc, Corrine Krych and others

## Presentations

*   You can watch all the [videos and read the slides of all the presentations given at the Greach 2014 conference](https://storify.com/glaforge/greach-2014-videos-and-slides), in Madrid (Spain)
*   Cédric Champeau presents "[Making Java APIs Groovy](http://greach.es/speakers/cedric-champeau-making-java-apis-groovy/)" at Greach 2014
*   The [functional side of Groovy](http://greach.es/speakers/mario-garcia-the-functional-side-of-groovy/), by Mario Garcia, recorded at Greach 2014
*   [Architectural flexibility with Groovy](http://greach.es/speakers/david-dawson-architectural-flexibility-using-groovy/), by David Dawson, at Greach 2014
*   [Metaprogramming with Groovy](http://greach.es/speakers/ivan-lopez-metaprogramming-with-groovy/), by Ivan Lopez, at Greach 2014
*   [Micro Service Architecture with Spring Boot, Groovy](http://greach.es/speakers/marco-vermeulen-building-micro-services-using-spring-boot-and-friends/) and Friends, by Marco Vermeulen, at Greach 2014
*   Marco Vermeulen speaks about [behavior-driven-development with Cucumber and Groovy](http://greach.es/speakers/marco-vermeulen-bdd-using-cucumber-jvm-and-groovy/), at Greach 2014
*   Schalk Cronjé talks about [Groovy VFS](http://greach.es/speakers/schalk-w-cronje-groovy-vfs/), a humble DSL over the Apache VFS library
*   Russel Winder on [Groovy, GPars, @CompileStatic, invoke dynamic and Java 8](http://greach.es/speakers/russel-winder-groovy-gpars-compilestatic-and-invokedynamic-and-java-8/), recorded at Greach 2014
*   [GPars workshop](http://greach.es/speakers/mario-garcia-workshop-gpars/) presented at Greach 2014 by Mario Garcia

## Articles

*   Rick Hightower, who worked on the improved Groovy 2.3 JSON support, writes about the [high performance of Boon and Groovy JSON](http://www.dzone.com/links/r/groovy_and_boon_provide_the_fastest_json_parser_f.html) compared to Jackson
*   Michael Scharhag on the [Grails dependency injection inheritance pitfall](http://www.mscharhag.com/2014/04/the-grails-depedency-injection.html)
*   [Iterate through dates](http://www.intelligrape.com/blog/2014/04/13/iterate-through-two-distinct-dates-groovy-2-2/) the Groovy way
*   [Customizing URL formats in Grails](http://www.intelligrape.com/blog/2014/04/09/customizing-url-formats-in-grails/), making your URLs case insensitive
*   Making [Grails and Artifactory](http://wordpress.transentia.com.au/wordpress/2014/04/09/artifactory-and-grails/) work together
*   [Customizing fusion chart](http://www.intelligrape.com/blog/2014/04/09/customizing-fusion-chart-for-various-type-via-grails/) for various type via Grails

## Code snippets

*   Tim Yates plays with [Groovy traits, combining them together](https://gist.github.com/timyates/10257468) to create infinite iterators.
*   Tim Yates shows a [ping-pong hot-swapped untyped Akka actor in Groovy](https://gist.github.com/timyates/3722681)
*   Tim Yates crafted a [Pi approximation algorithm in Groovy on top of Akka](https://gist.github.com/timyates/10470012) actors
*   Tim Yates uses [GPars for calculating an approximation of Pi](https://gist.github.com/timyates/10474027)
*   Craig Burke created a [sample Ratpack application](https://twitter.com/craigburke1/status/456062168547753984) whose code you can look at on Github

## Tweets

*   Cédric Champeau points at the [documentation and the blog posts he wrote about the new markup-based template engine](https://twitter.com/cedricchampeau/status/454541228106084353)
*   Guillaume Laforge is [happy with the feedback the Groovy team is receiving](https://twitter.com/glaforge/status/454565615341408256) with the recent betas of Groovy 2.3. Feedback is really important to get the final release rock solid and ready for prime time!
*   The [Greach conference Youtube channel](https://twitter.com/greach_es/status/455664662110289920) has more followers than on Twitter, thanks to all the conference presentations it published online
*   With our hight performant JSON stack, tail recursion, the NIO support, and more, coming in Groovy 2.3, or using GPars for concurrency needs, Dierk König notes that [adding Groovy to your projects might well make it faster](https://twitter.com/mittie/status/454704508430737408)!
*   Robert Fletcher adds the ["trait" keyword to the Prism JavaScript syntax highlighting](https://twitter.com/rfletcherew/status/454529278273912832) library

## News

*   Luke Daley announces the upcoming [arrival of Gradle 2.0](http://forums.gradle.org/gradle/topics/after_1_12_comes_2_0) after Gradle 1.12, upgrading to Groovy 2.
*   Successful test anr run of [Caelyf on IBM's BlueMix Cloud Foundry platform](http://caelyf.ng.bluemix.net)
*   [Grails Diary week 15](http://grydeske.net/news/show/40) by Jacob Aae Mikkelsen
    
## Jobs

*   A [Grails / DevOps developer](http://findgrailsjobs.com/job/526-grails-devops-developer) at Retale, in Chicago, USA

## Events

*   The [Early Bird price](http://gr8conf.eu/) (35% discount) for the GR8Conf Europe conference, in Denmark, has been extended till the 21st, it’s your last chance!
*   GR8Conf Europe announces [NineConsult as gold sponsor](https://twitter.com/gr8conf/status/454347531280211970)