---
title: "Groovy Weekly #74"
date: 2015-07-21T00:00:00.000+02:00
tags: [groovy, groovy-weekly]
---

Although on a more irregular schedule, Groovy Weekly continues in the summer with its 74th edition, crossing the bar of the 3000 total news items tracked since it all started!

Some interesting releases for this edition, like the [Groovy 2.4.4](http://groovy-lang.org/changelogs/changelog-2.4.4.html) release under the Apache umbrella! After a failed attempt, our second try was succesful, and it was particularly important to get it right out the door, as an [important security issue](http://groovy-lang.org/security.html) uncovered was fixed in this release, and all Groovy users (and frameworks and libraries using Groovy) should upgrade as soon as possible — especially as no older version will be released with the patch.

In the release section, last time, I had forgotten [Griffon 2.3.0](http://griffon-framework.org/releasenotes/griffon_2.3.0.html) which was released on stage at GR8Conf Europe by Andrés Almiray. And in other releases, we also have [Grails 3.0.3](https://twitter.com/grailsframework/status/619082386320572416) with important reloading improvements, [Geb 0.12.0](https://groups.google.com/forum/#!topic/geb-user/2LXtg0pP4Do) which celebrated its 5th anniversary, and also [Codenarc 0.24](https://github.com/CodeNarc/CodeNarc/blob/master/CHANGELOG.txt) that I had forgotten the previous edition as well.

It looks like Slack is really becoming very popular as both [Grails](https://twitter.com/grailsframework/status/621780975870152704) and [Ratpack](https://twitter.com/ratpackweb/status/621103100619681792) opened Slack channels!

## Releases

*   [Groovy 2.4.4](http://groovy-lang.org/changelogs/changelog-2.4.4.html) released its first version under the Apache umbrella
*   [Griffon 2.3.0](http://griffon-framework.org/releasenotes/griffon_2.3.0.html) released
*   [Grails 3.0.3](https://twitter.com/grailsframework/status/619082386320572416) released with improvements to reloading
*   [Geb 0.12.0](https://groups.google.com/forum/#!topic/geb-user/2LXtg0pP4Do) released
*   [Codenarc 0.24](https://github.com/CodeNarc/CodeNarc/blob/master/CHANGELOG.txt) released
*   [Deck2PDF 0.3](https://twitter.com/CedricChampeau/status/623453951116070912) released by Cédric Champeau allowing HTML/JavaScript presentations to be saved as PDF or images

## Articles

*   JaxEnter covers the [Groovy 2.4.4 release](https://jaxenter.com/groovy-2-4-4-has-landed-under-the-apache-foundation-119018.html) under the Apache umbrella
*   Ryan Vanderwerf on [publishing Grails 3 plugin snapshots to your local Artifactory](http://rvanderwerf.blogspot.fr/2015/07/how-to-publish-grails-3-plugin.html) server
*   [Grails 3 and JaCoCo](http://beckje01.com/blog/2015/07/12/grails-3-and-jacoco/) by Jeff Beck
*   Graeme Rocher announces the [creation of a Grails Slack channel](http://grails.io/post/124146177848/join-grails-community-on-slack)
*   First look at the new [Android Gradle build tools](http://inthecheesefactory.com/blog/new-gradle-build-tools-with-gradle-2.5/en): the new DSL structure and Gradle 2.5
*   Benjamin Muschko's Gradle in the trenches on [defining versioning strategies](https://gradle.org/tales-from-the-trenches-defining-versioning-strategies/)
*   [Gradle task ordering tip](http://trickyandroid.com/gradle-tip-3-tasks-ordering/) by Pavel Dudka
*   [Spock-Reports plugin for Grails 3](https://rdmueller.github.io/Spock-Reports-with-Grails-3.0/) by R.D. Müller

## Presentations

*   Bogdan Danilyuk presented on [modularity with Grails](https://vimeo.com/131395565) at GeekOut from real-life usage at TransferWise
*   [Advanced dependency management with Gradle](https://speakerdeck.com/bmuschko/advanced-dependency-management-with-gradle) by Benjamin Muschko

## Tweets

*   Original Groovy co-founder [James Strachan states that Groovy is the language of Continuous Integration and Continuous Delivery](https://twitter.com/jstrachan/status/622020452886663168), and enjoys using it with Jenkins Flow and Docker workflows
*   [Groovy 2.4.4](https://twitter.com/sdkmanager/status/621639983217119232) available on GVM
*   Gradle 2.6 will be featuring a [test kit for functionally testing Gradle plugins](https://twitter.com/gradle/status/621458781273128960)
*   Andrés Almiray developed two [new Griffon AST transformations targeting JavaFX](https://twitter.com/aalmiray/status/621059717557821441) with @ListChangeListener and @MapChangeListener
*   [5th anniversary of Geb](https://twitter.com/GebFramework/status/619234577849028608)
*   Jennifer Strater has a [visualization of gender ratios in the Groovy community](https://twitter.com/JennStrater/status/620692583182790656)
*   Vladimír Oraný is doing heavy [refactorings with confidence thanks to the Spock framework test coverage](https://twitter.com/musketyr/status/621969659982647296)
*   A [Groovy Grape tour bus](https://twitter.com/alvaro_sanchez/status/623477231050862592) in Australia spotted by Álvaro Sánchez!
*   Ryan Vanderwerf forked [grooid-templates to create a ready-made Glass or Android Wear app](https://twitter.com/RyanVanderwerf/status/622978045490507780) template
*   Mario García made a new version of [Grooid-templates with Spock framework support](https://twitter.com/marioggar/status/621943669550149632) for testing
*   A [Gradle plugin for Dockerized tests](https://plugins.gradle.org/plugin/com.github.pedjak.dockerized-test/0.3.3)
*   [GVM adds JBoss Forge](https://twitter.com/sdkmanager/status/623355138699317248) as new candidate
*   [Grails 3.0.3](https://twitter.com/sdkmanager/status/619076452978442240) available on GVM
*   [Vert.x 3.0](https://twitter.com/sdkmanager/status/619053543048278016) available on GVM
*   [Gradle 2.5](https://twitter.com/sdkmanager/status/619050062354771968) available on GVM
*   The [Gradle dexinfo plugin](https://twitter.com/djensen47/status/622090181861113856) adds a new task to print out the dex method count of your Android projects without having to install separate tools
*   Danny Hyun reminds us about the [Ratpack Slack channel](https://twitter.com/Lspacewalker/status/621120598446575616)
*   You can [sign-up for the Ratpack Slack channel](https://twitter.com/ratpackweb/status/621103100619681792)
*   300 persons have joined the [Grails Slack channel](https://twitter.com/grailsframework/status/621780975870152704)
*   Graeme Rocher announces that [dynamic scaffolding will make a come back in the next Grails 3 release](https://twitter.com/graemerocher/status/620944698140704768)
*   Claus Ibsen [upgraded Apache Camel to Groovy 2.4.4](https://twitter.com/davsclaus/status/621668001050415104) right after its release under the Apache flag

## News

*   Groovy 2.4.3 and below was affected by a [security issue](http://groovy-lang.org/security.html) that has been fixed in Groovy 2.4.4. Projects should upgrade to 2.4.4 as soon as possible to avoid this security issue to be leveraged by malicious attackers.
*   Jacob Aae Mikkelsen [Grails Diary](http://grydeske.net/news/show/101) week 25 to 28
*   Jacob Aae Mikkelsen's [Grails Diary](http://grydeske.net/news/show/101) week 29
*   Mockito is bringing some [better support for Groovy classes](https://github.com/mockito/mockito/pull/266)

## Screencasts

*   Bertrand Goetzmann recorded a video of a [lunar lander game he developed with GroovyFX](https://twitter.com/bgoetzmann/status/623237871865040901), JavaFX and a bit of reactive programming

## Podcasts

*   Audio of [Groovy podcast](https://twitter.com/groovypodcast/status/620708302142459904) episode 15
*   [Groovy Podcast](https://plus.google.com/events/cs8io51q6nqdd0iafel0s0p0pjs) episode 16

## Mailing-list posts

*   [Groovy 2.4.4 release announcement](http://mail-archives.apache.org/mod_mbox/incubator-groovy-users/201507.mbox/%3CCADQzvmk=3TwWzeGMN-HXwv4CUkbPBENusioviPf29_uJ=zLi0w@mail.gmail.com%3E) on the Groovy mailing-list by Cédric Champeau