---
title: "Groovy Weekly #19"
date: 2014-04-29T00:00:00.000+02:00
tags: [groovy, groovy-weekly]

similar:
  - "posts/2014/04/15/groovy-weekly-17.md"
  - "posts/2014/05/20/groovy-weekly-22.md"
  - "posts/2014/09/23/groovy-weekly-37.md"
---

Another busy week for the Groovy ecosystem, with key releases of Groovy, Grails, Gradle, GPars, and CodeNarc! This can be labeled as a “release week”!

## Releases

*   Guillaume Laforge announces the [release candidate of Groovy 2.3]({{< ref "/posts/2014/04/24/release-candidate-for-groovy-2-3" >}})
*   Guillaume Laforge announces the [second release candidate of Groovy 2.3]({{< ref "/posts/2014/04/28/second-release-candidate-of-groovy-2-3" >}})
*   Graeme Rocher announces a Grails joint release with [Grails 2.3.8 and Grails 2.4-milestone-2](http://grails.1312388.n4.nabble.com/ANN-Grails-2-3-8-amp-2-4-0-M1-out-td4656282.html)
*   [Gradle 1.12 released](http://forums.gradle.org/gradle/topics/gradle_1_12_released) with some nice universal performance improvements, more control of the dependency resolution process, an improved API for IDE integration, Clang and CUnit support for native code and a slew of bug and compatibility fixes
*   [Release of GORM for MongoDB v3.0](https://twitter.com/grailsframework/status/459597120581144576) with MongoDB 2.6 support (new GeoJSON types, text search)
*   The CodeNarc static code analysis tool for Groovy releases [CodeNarc version 0.21, with 15 new rules](http://groovy.329449.n5.nabble.com/ANN-Announcing-CodeNarc-0-21-td5719330.html)
*   [GPars 1.2](http://gpars-user-mailing-list.19372.n3.nabble.com/GPars-1-2-0-released-td4024974.html) has been released

## Presentations

*   Jorge Franco presents [GrooScript, the Groovy to JavaScript compiler](http://greach.es/speakers/jorge-franco-grooscript/), at Greach 2014
*   Cédric Champeau gave an excellent workshop at Greach 2014 entitled "[unleashing the power of AST transformations](http://greach.es/speakers/cedric-champeau-unleashing-the-power-of-ast-transformations/)"
*   Cédric Champeau and Fabrice Matrat present about "Groovy, head in the cloud", at Greach 2014, where they show [how to secure Groovy code in a cloud and shared environment](http://greach.es/speakers/fabrice-matrat-cedric-champeau-groovy-head-in-the-cloud/)
*   Rick Hightower created a presentation on [Java JSON parser benchmarking](http://fr.slideshare.net/richardhightower/java-json-benchmakr), upon his work on the Groovy and Boon parsers performance work
*   [Grails workshop](http://greach.es/speakers/fernando-redondo-can-you-tell-me-how-to-get-to-sesame-street-i-wanna-be-a-grails-rookie-star-there/) given at Greach 2014 by Fernando Redondon

## Articles

*   MrHaki writes about [restricting script syntax with SecureASTCustomizer](http://mrhaki.blogspot.fr/2014/04/groovy-goodness-restricting-script.html)
*   MrHaki defines [compilation customizers with the builder syntax](http://mrhaki.blogspot.fr/2014/04/groovy-goodness-define-compilation.html)
*   MrHaki explains how to [customize the @ToString transform](http://mrhaki.blogspot.fr/2014/04/groovy-goodness-customize-tostring.html)
*   Using [Spock configuration with Grails](http://wordpress.transentia.com.au/wordpress/2014/04/23/using-spock-configuration-in-grails/)
*   Julien Ponge comes back on Andrey Bloschetsov and Rick Hightower [JSON benchmarks](http://julien.ponge.org/blog/revisiting-a-json-benchmark/), with a few updates to improve the reliability of the benchmarks. Boon is underlying the new JSON capabilities of Groovy 2.3 while the Groovy represented in this article refers to the pre-Groovy 2.3 parser and serializer.
    
## Tweets

*   Cédric Champeau is teasing about his work on [Groovy support for Android](https://twitter.com/CedricChampeau/status/459260216841097216)
*   Graeme Rocher shows the compelling [conciseness and readability of GORM vs raw Hibernate](https://twitter.com/graemerocher/status/461065311819554817)
*   The GR8Conf Europe team is [looking for a name for its last special conference beer brew](https://twitter.com/gr8conf/status/460508009522003968), if you’ve got suggestions
*   [Groovy 2.3-rc-1](https://twitter.com/gvmtool/status/459428432557129728) available through GVM
*   [Gradle 1.12-rc-2](https://twitter.com/gvmtool/status/459376588539576320) is available through GVM
*   [Grails 2.3.8 and 2.4.0-milestone-2](https://twitter.com/gvmtool/status/459366821783928833) now available for download on GVM
*   Dan Allen mentions that a Google Summer of Code student will be working on a [Groovy scripting frontend for Arquillian](https://twitter.com/mojavelinux/status/459500064604712961)
*   Peter Ledbrook, scratching his head, points at the [first Grails podcast episode in video](https://twitter.com/pledbrook/status/459440167263408128) form
*   Peter Ledbrook published an [MP3 version of the Grails podcast](https://twitter.com/pledbrook/status/461034693279121408) in addition to the video stream
*   Alex Sanchez remarks that lots of [Java developers are getting acquainted with Groovy thanks to Gradle and Spock](https://twitter.com/AlexSanchezSTH/status/459353715506708480)
*   Bertrand Goetzmann notes that [Grails also has a "wrapper" like Gradle](https://twitter.com/bgoetzmann/status/459062310691430400) to ease having everybody on the team run the very same version of Grails
*   Looking at the [Groovy meta-programming documentation reminds us how awesome Groovy is](https://twitter.com/gregopet/status/459617010239143936)!

## Code Snippets

*   How to [use Grails' GSP view technology in Spring Boot](https://github.com/grails/grails-boot/tree/master/sample-apps/gsp)

## News

*   Netflix is well known for its heavy use of Groovy, Grails and Gradle for their infrastructure, and they are sharing project Nebula, a [platform for handling and sharing Gradle plugins](http://nebula-plugins.github.io/)

## Events

*   [Object Partners become a sponsor of GR8Conf Europe](https://twitter.com/gr8conf/status/459445157017174016) 2014
*   The GR8Conf Europe crew is [brewing the official conference beverage](https://twitter.com/brianjohnsendk/status/460047137490075648)
*   The [agenda of GR8Conf Europe 2014](http://gr8conf.eu/#/agenda) has been posted