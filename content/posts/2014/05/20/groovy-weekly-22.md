---
title: "Groovy Weekly #22"
date: "2014-05-20T00:00:00.000+02:00"
tags: [groovy, groovy-weekly]
---

Releases keep coming, with a second RC for Grails 2.4, with Gaelyk and Griffon upgrading to Groovy 2.3, and already a bug-fix release of Groovy with version 2.3.1!

Don’t forget it’s the last week to [register to the GR8Conf Europe](http://gr8conf.eu) conference!

## Releases

*   [Second release candidate for Grails 2.4](https://twitter.com/grailsframework/status/466962419953446912)
*   Guillaume Laforge announces a [Groovy 2.3.1 bug-fix release](http://glaforge.appspot.com/article/groovy-2-3-1-is-out)
*   [Gaelyk 2.1.2](http://gaelyk.appspot.com/download) released, built atop Groovy 2.3.0
*   Kunal Dabir released [version 2.1.2 of the Gaelyk template](https://twitter.com/kdabir/status/466281435892944896)
*   Andrés Almiray is upgrading [Griffon 2.0.0 beta](https://twitter.com/aalmiray/status/466297367361515520) with Groovy 2.3
*   The [Spud CMS engine for Grails](http://spudengine.com/news/2014-05-15-spud-grails-0-4-x-released-with-tons-of-new-features) released with new features
*   The [Groovy Light Table client released version 0.0.4](https://github.com/rundis/LightTable-Groovy/releases/tag/0.0.4) with further Gradle integration
*   [GMavenPlus 1.2 released](http://gmavenplus.56682.x6.nabble.com/gmavenplus-announce-GMavenPlus-1-2-Released-td137.html) for building your Groovy and Java projects with Maven

## Interviews

*   [Guillaume Laforge interviewed at the JAX conference about what makes Groovy groovy](http://jaxenter.de/videos/What-makes-Groovy-groovy-Interview-mit-Guillaume-Laforge-173539), the latest 2.3 release, and roadmap

## Presentations

*   At the JAX conference, Guillaume Laforge presented on "[what makes Groovy groovy](https://twitter.com/glaforge/status/466889089628012544)"
*   Guillaume Laforge presented the [functional aspects of Groovy](https://twitter.com/glaforge/status/466891844958572544) at the JAX conference
*   A screencast showing the [Gradle integration in the Light Table Groovy](https://twitter.com/mrundberget/status/468193954123755520) plugin

## Articles

*   Mixing [Spring Boot, Groovy, Spring Batch, Grails' GORM](http://vasya10.wordpress.com/2014/05/03/the-groovyspringbootbatchgormgroovydslbeanfactory/) together
*   An article [summarizing the latest release of Groovy 2.3](http://www.i-programmer.info/news/98-languages/7304-new-groovy.html)
*   [Grails: The Tomcat kill switch](http://www.mscharhag.com/2014/05/grails-tomcat-kill-switch.html), by Michael Scharhag
*   Michael Scharhag is blogging about [Grails Controller namespaces](http://www.mscharhag.com/2014/05/grails-controller-namespaces.html)
*   [OAuth 2.0 using Grails](http://www.intelligrape.com/blog/2014/05/13/grails-way-of-oauth-2-0-to-access-google-apis-part-1/)
*   Brandon Fish explains the [Grails R14 memory error on Heroku](http://www.objectpartners.com/2014/05/13/grails-r14-error-memory-quota-exceeded-on-heroku/)
*   Alex Staveley speaks about [Groovy’s “with”](http://dublintech.blogspot.ie/2014/05/the-magic-of-groovys-with.html)
*   [Automatically test your dirty Grails classes](http://www.objectpartners.com/2014/05/15/automatically-test-your-dirty-grails-classes/) by Igor Shults
*   [Receiving emails in a Grails](http://www.intelligrape.com/blog/2014/05/14/receive-email-using-subethasmtp-the-local-smtp-server/) app by Akash Sethi

## Code snippets

*   Kenneth Endfinger shows a [Node.js hello world written in Groovy](https://gist.github.com/kaendfinger/fdab7ab0627baaa67884) and compiled to JavaScript with GrooScript

## Tweets

*   Robert Fletcher is [ecstatic about Groovy’s closure coercion to “SAM” types and type inference](https://twitter.com/rfletcherew/status/467255461126086656), as this makes for very low ceremony code
*   Robert Fletcher remarks that you can’t use [@CompileStatic on Spock specifications](https://twitter.com/rfletcherew/status/467307293408002048), but you can on their helper methods
*   Vladimir Orany updated his "[Gliding Gaelyk](https://twitter.com/musketyr/status/466545743168540674)" presentation and demo app
*   Magnus Rundberget is [integrating Gradle in the Groovy support for the Light Table IDE](https://twitter.com/mrundberget/status/467078036438134784), showing an example of the Groovy Stream library
*   Cédric Champeau wished that [Groovy were taught more at school](https://twitter.com/cedricchampeau/status/466858251221749760)
*   Schalk Cronjé is looking into adding [Amazon S3 support to Groovy VFS](https://twitter.com/ysb33r/status/464335761161326592)
*   Peter Ledbrook is wondering [why the Spock testing framework doesn’t have a logo](https://twitter.com/pledbrook/status/468390877736763392)
*   Guillaume Laforge shows some [Spock logo ideas](https://twitter.com/glaforge/status/468455234688544768/photo/1) he proposed to Peter Niederwieser
*   Dierk König notices that Java 8 features are a notable improvement when working with JavaFX, but it's only with [Groovy and GroovyFX that it is as slick](https://twitter.com/mittie/status/468423252633980928)
*   Robert Fletcher reports a [gotcha when using Spock with fields and JUnit rules](https://twitter.com/rfletcherew/status/468422318062985216)
*   More fun from Rob Fletcher showing how he cleverly used [Groovy's alias imports to change void into "should" in his Spock](https://twitter.com/rfletcherew/status/468425797011660800) specifications
*   Baruch Sadogursky [happily converted a painful 300 lines of Java code using the Maven Aether library into 20 lines of Groovy](https://twitter.com/jbaruch/status/468356911042027520) code
*   Cédric Champeau added [“layouts” to the markup template engine](https://twitter.com/cedricchampeau/status/468438346474471424) in Groovy 2.3.1
*   [Groovy 2.3.1](https://twitter.com/gvmtool/status/468485257654976512) is available through GVM
    
## Code contributions

*   Cédric Champeau suggests possible [improvements that can be contributed](https://twitter.com/cedricchampeau/status/466243598254878720) by the community around the Groovy 2.3 markup template engine

## News

*   [Grails Diary](http://grydeske.net/news/show/44) #19 by Jacob Aae Mikkelsen
*   Luke Daley announces [Marcin Erdmann is becoming the new project lead of the Geb](https://twitter.com/ldaley/status/466884136754376704) project
*   The [Grails Diary](http://grydeske.net/news/show/45) week 20 by Jacob Aae Mikkelsen
*   Geb now offers [cloud browser testing](http://www.gebish.org/manual/snapshot/cloud-browsers.html#cloud_browser_testing) with SauceLabs and BrowserStack
*   Beaker, a [data science laboratory with Groovy integration](http://beakernotebook.com/)

## Events

*   Only a [few days left to register to attend GR8Conf](https://twitter.com/gr8conf/status/468277209677844481) Europe!
*   If you’re a student, you can get [discounts for GR8Conf Europe](https://twitter.com/gr8conf/status/468634470661500928)
*   There are currently [19 countries represented by the GR8Conf attendees](https://twitter.com/gr8conf/status/468745724696752128)