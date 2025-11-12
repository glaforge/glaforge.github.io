---
title: "Groovy Weekly #23"
date: 2014-05-27T00:00:00.000+02:00
tags: [groovy, groovy-weekly]

similar:
  - "posts/2014/05/20/groovy-weekly-22.md"
  - "posts/2014/05/13/groovy-weekly-21.md"
  - "posts/2015/01/13/groovy-weekly-53.md"
---

The big news of this edition is the release of Grails 2.4, with standalone GORM and GSP, with more static compilation that even understands dynamic aspects of Grails, with a new asset pipeline, with GORM sub-queries, and with a new Maven plugin.

The other big news is that next week is the GR8Conf Europe week! So you’ll certainly see lots of nice and interesting presentations being put online next week. And I hope I’ll also be able to publish this weekly news brief in time too!

## Releases

*   Graeme Rocher announces the final [release of Grails 2.4](https://spring.io/blog/2014/05/21/grails-2-4-released)
*   [Grails 2.3.9](https://grails.org/2.3.9+Release+Notes) released
*   [LightTable Groovy 0.0.5](https://github.com/rundis/LightTable-Groovy/releases/tag/0.0.5) with Gradle task execution
*   [Gretty v0.0.20](https://twitter.com/andreyhihlovski/status/469781264048746496), the Grable plugin for Jetty, by Andrey Hihlovskiy
*   Paolo Di Tommaso releases [Nextflow 0.0.8](http://nextflow.io), a workflow engine based on GPars dataflow, now including more splitting operators, updated to Groovy 2.3
*   Thibault Kruse released the [Groovysh Gradle plugin](https://github.com/tkruse/gradle-groovysh-plugin), to be able to launch Groovysh from your Gradle builds
*   [Spring Boot 1.1.0.M2](https://spring.io/blog/2014/05/27/spring-boot-1-1-0-m2-available-now) released by Dave Syer
*   Stergios Papadimitriou is adding [SciLab integration to JLabGroovy](https://code.google.com/p/jlabgroovy/wiki/SciLabInGroovyLab)

## Articles

*   Graeme Rocher explains how to [publish a POM with Gradle](http://grails.io/post/86513009278/publishing-a-pom-with-gradle)
*   Lots of MrHaki’s Goodness!
*   MrHaki's Groovy Goodness: [Implementing Traits at Runtime](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-implementing-traits-at.html)
*   MrHaki's Groovy Goodness: [Chaining Traits](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-chaining-traits.html)
*   MrHaki's Grails Goodness: [Exception Methods in Controllers](http://mrhaki.blogspot.fr/2014/05/grails-goodness-exception-methods-in.html)
*   MrHaki's Grails Goodness: [Run Groovy Scripts in Grails Context](http://mrhaki.blogspot.fr/2014/05/grails-goodness-run-groovy-scripts-in.html)
*   Broadleaf with [Groovy and Gradle](http://www.broadleafcommerce.com/blog/broadleaf-with-groovy-and-gradle-part-1) — Part 1
*   Broadleaf with [Groovy and Gradle](http://www.broadleafcommerce.com/blog/broadleaf-with-groovy-and-gradle-part-2) — Part 2
*   [Rapid application development with Spark, Groovy and JRebel](http://spinscale.github.io/2013-02-rapid-web-application-development-with-spark-groovy-jrebel.html) by Alexander Reelsen
*   A [Groovy DSL for Apache Wicket](http://wicketinaction.com/2014/05/groovy-dsl-for-wicket/)
*   An infographic on [6 reasons why Grails is an awesome framework](http://www.cygnet-infotech.com/infographic-6-reasons-why-grails-is-an-awesome-java-web-framework)
*   Magnus Rundberget blogs about exploring [new Gradle avenues with the Groovy Light Table](http://codewader.blogspot.no/2014/05/a-groovy-light-table-client-step-4.html) client
*   [Installing Groovy-Eclipse Compiler 2.3](http://www.javacodegeeks.com/2014/05/grails-2-4-released-installing-groovy-eclipse-compiler-2-3-in-eclipseggts.html) in Eclipse / GGTS
*   [Run Grails Commands on Heroku](http://www.objectpartners.com/2014/05/22/run-grails-commands-on-heroku/) by Brandon Fish
*   Tomás Lin writes about how to [add an optional internal Artifactory repository to Gradle](http://fbflex.wordpress.com/2014/05/24/adding-an-optional-internal-artifactory-repository-to-gradle-to-speed-up-builds/) to speed up builds
*   [Integrate Markdown plugin in Grails](http://www.oodlestechnologies.com/blogs/Integrate-Markdown-plugin-in-Grail) by Deepak Gupta
*   Iyobo Eki on [Grails: Shiro not redirecting to login page](http://deveki.com/softdev/grails-shiro-not-redirecting-to-login-page/)
*   Iyobo Eki about [Grails: 3 Simple steps to convert HTML templates into asset-pipeline layouts](http://deveki.com/softdev/grails-how-to-convert-html-templates-to-asset-pipeline-layouts/)

## Presentations

*   [Guillaume Laforge p](http://www.oodlestechnologies.com/blogs/Integrate-Markdown-plugin-in-Grail)resents [Gr](http://www.parleys.com/play/536c9780e4b0898c64d2e43e/chapter1/about)[oovy in 2014](http://www.oodlestechnologies.com/blog/filterByAuthor?author=deepakgupta) [and beyond](http://www.parleys.com/play/536c9780e4b0898c64d2e43e/chapter1/about), covering Groovy 2.3, in French, recorded at Devoxx France 2014
*   Cédric Champeau explains how [Gradle doesn’t just replace Maven](http://www.parleys.com/play/53676fb0e4b0593229b8583e/chapter1/about), but goes much beyond, in French, recorded at Devoxx France 2014

## Screencasts

*   Magnus Rundberget shows a [preview of the Gradle task integration in the Light Table Groovy plugin](https://twitter.com/mrundberget/status/469619079926808577)
    
## News

*   GradleWare features [online Gradle training](http://www.gradleware.com/services/training/gradle-virtual-training/)
*   Siemens releases a [Grails plugin for documenting RESTful APIs](https://github.com/siemens/restapidoc/)
*   [Grails Diary week 21](http://grydeske.net/news/show/46), by Jacob Aae Mikkelsen
    
## Code snippets

*   Guillaume Laforge implemented an example of [Huffman code](http://rosettacode.org/wiki/Huffman_coding#Groovy) in Groovy on Rosetta Code. You can create your own entries for the various puzzles in your favorite language!
*   Cédric Champeau implemented a [Hodor DSL](https://gist.github.com/melix/8580bdc709cdddd05277) based on Game of Thrones’ Hodor character
*   Grant McConnaughey shares a [Bash script](https://gist.github.com/grantmcconnaughey/d37b733dfd70439e17f1) that informs you when a Grails version is available on GVM
*   Peter Ledbrooks shares an example of a [multi-project Maven build for Grails](https://twitter.com/pledbrook/status/469382343112003584) applications
*   A demo of [Groovy compiled to JavaScript running in the clouds](https://twitter.com/grooscript/status/469948334862790659)

## Tweets

*   [CERN is using Grails](https://twitter.com/aalmiray/status/469141716738777089) for internal applications
*   Cédric Champeau shows that [Android development can be made much groovier](https://twitter.com/cedricchampeau/status/471338828876509184)!
*   [Grails 2.4](https://twitter.com/gvmtool/status/469139587647176704) is available in GVM
*   [Gradle support](https://twitter.com/java_hipster/status/470885227121111041) is underway for the JHipster project generator for AngularJS / Spring Boot apps
*   Ken Kousen notes a needed [dependency change if you use Groovy’s AntBuilder in Gradle](https://twitter.com/kenkousen/status/469914000156016641) when using Groovy 2.3
*   Cédric Champeau is working on an [Antlr v4 Gradle plugin](https://twitter.com/CedricChampeau/status/469404646516482048)
*   The [vscengis GIS (Geographic Information System) is using Groovy](https://twitter.com/vscenegis/status/471150776380051456) for its scripting layer
*   Rob Fletcher remarks that IntelliJ IDEA has an [intention to sort map entries alphabetically](https://twitter.com/rfletcherew/status/471310326537793536)
*   [Spring Boot 1.1.0.M2](https://twitter.com/gvmtool/status/471361060772249600) available for download on GVM

## Books

*   A [book on Reactor](https://twitter.com/j_brisbin/status/469925169398829057) is in the works at O’Reilly, by Jon Brisbin and Stéphane Maldini
    
## Events

*   If you're going to GR8Conf Europe, you can [download the GR8Conf Android app](https://twitter.com/cedricchampeau/status/471270003678117888) to prepare your program
*   The [GR8Conf Europe official beers](https://twitter.com/gr8conf/status/471255330111127552) are being bottled up!
*   The [second beer of GR8Conf Europe](https://twitter.com/sbglasius/status/471269691621916672) is called “Malt Liquor”