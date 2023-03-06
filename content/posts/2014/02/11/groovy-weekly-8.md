---
title: "Groovy Weekly #8"
date: "2014-02-11T00:00:00.000+01:00"
tags: [groovy, groovy-weekly]
---

In Stockholm for the JFokus conference, I was happy to meet some of the members of the Groovy community, and had the chance to speak about the [Groovy usage patterns and how companies integrate Groovy](https://speakerdeck.com/glaforge/benefit-from-groovy-now-why-when-how-jfokus-2014). But while I’m having fun in Sweden (with heaps of fever though), we are laying out the new infrastructure for the Groovy project with the help of JetBrains and JFrog, or work is underway to make Groovy’s JSON support the fastest around (more infor to come soon)! So it’s been a busy week!

Releases

*   [Gradle 1.11 release](http://www.gradle.org/docs/1.11/release-notes) announced by Luke Daley
    
*   A Groovy library offering a [functional Option](https://github.com/johnnywey/flipside) implementation and a matcher
    

Articles

*   MrHaki is looking into [customizing root rlement name collections for Grails XML marshalling](http://mrhaki.blogspot.fr/2014/02/grails-goodness-customize-root-element.html)
    
*   André Steingreß talks about the ability to [use the Grails Environment class anywhere in BuildConfig.groovy](http://blog.andresteingress.com/2014/02/07/grails-environment-in-build-config/) since Grails 2.3
    
*   Tamsin Slinn explains how she created her first Groovy DSL, to [automate the management of her Jenkins jobs](http://blog.anorakgirl.co.uk/2014/02/my-first-groovy-dsl/)
    
*   Craig Atkinson on [Groovy convenience in JavaScript](http://www.objectpartners.com/2014/02/07/groovy-convenience-in-javascript-with-lo-dash/)
    
*   Andrew Taylor shows how to [set request attributes on URL requests](http://www.redtoad.ca/ataylor/2014/02/setting-headers-url-requests-with-groovy/) in Groovy
    
*   Options for [Grails debugging in Grails 2.3](http://www.intelligrape.com/blog/2014/02/06/grails-debugging-in-version-2-3-x-and-above/) and beyond
    
*   MrHaki shows how to run [Grails forked tests in IntelliJ IDEA](http://mrhaki.blogspot.fr/2014/02/grails-goodness-run-forked-tests-in.html)
    
*   Using Groovy [AST transformations for DSL manipulation](http://expertalks.wordpress.com/2014/02/10/using-groovy-ast-transformations-for-dsl-manipulation/)
    

  
Presentations

*   Guillaume Laforge presented a talk at JFokus 2014 about the [usage patterns of Groovy](https://speakerdeck.com/glaforge/benefit-from-groovy-now-why-when-how-jfokus-2014), for scripting, testing, extension points, business rules, DSLs, and full-blown apps
    
*   In this presentation recorded at SpringOne2GX 2013, Joe Rinehart explains how to integrate [Twitter Bootstrap into a Grails](http://www.infoq.com/presentations/grails-twitter-bootstrap) application.
    
*   [Marcin Grzejszczak shares a presentation about an introduction to metaprogramming and AST transforms](http://java.dzone.com/articles/introduction-groovy-runtime)
    
*   [Continuous Delivery with Docker, Gradle and Jenkins](https://twitter.com/franckdepierre/status/433011063693783040)
    

Mailing-list discussions

*   Guillaume Laforge wrote an update on the Groovy mailing-list about some [infrastructure news regarding the Groovy project](http://groovy.329449.n5.nabble.com/ANN-Groovy-infrastructure-update-td5718414.html) (CI server, URL, new documentation, snapshot & release publishing, etc)
    
*   Guillaume Laforge announces that [Groovy 2.3 will raise the JDK requirement to JDK 6](http://groovy.329449.n5.nabble.com/Groovy-JSON-Parser-update-23x-speed-improvement-for-JsonSlurper-td5718189i40.html#a5718336), compared to all other versions which had still be compatible with JDK 5 so far.
    

Code snippets

*   Cédric Champeau has a prototype of a [potential new template engine](https://github.com/melix/groovy-core/blob/69aeea4606b272d4bcce47602cac6c04b8c72498/subprojects/groovy-templates/src/test/groovy/groovy/text/MarkupTemplateEngineTest.groovy) addition for Groovy, which is a markup builder based template engine, which also understands includes
    

Tweets

*   Guillaume Laforge receives his second "[JavaOne Rock Star](https://twitter.com/glaforge/status/433158041643810816)" award, for his participation to the JavaOne 2013 conference, where he spoke about Groovy, and also represented Groovy and won the "Script Bowl" competition
    
*   The [Groovy project is overhauling its infrastructure](https://twitter.com/jbaruch/status/432903532669190144) and is going through OSS JFrog.org and JFrog Bintray for uploading its snapshots built with JetBrains TeamCity and soon for the releases too
    
*   With the new CI server sponsored by JetBrains, the Groovy project also has a build plan for [building Groovy against the future JDK 9](https://twitter.com/cedricchampeau/status/433258782177906688) releases
    
*   Johannes Link shares a download of his [ongoing @TailRecursive transform](https://twitter.com/johanneslink/status/431432766404976640) to be included in Groovy 2.3
    
*   Magnus Rundberget is experimenting with a [Groovy plugin for the LightTable IDE](https://twitter.com/mrundberget/status/432542766476713984)
    
*   Dan Woods published a [new plugin for Grails](https://twitter.com/danveloper/status/430692110560272384) for simplifying & streamlining the implementation of RESTful renderers
    
*   Burt Beckwith was noticing that [older editions of the GR8Conf conference series are available online](https://twitter.com/burtbeckwith/status/432638090373369857), if you're interested in watching past presentations and look at slide decks
    
*   Groovy comes with its own [permutation generator](https://twitter.com/dailygrailstip/status/432761726283440128) used by the permutations() method on collections
    

  
Other news

*   Latest [Grails Diary](http://grydeske.net/news/show/29) by Jacob Aae Mikkelsen
    
*   Tim Yates is [documenting his Groovy stream library](http://timyates.github.io/groovy-stream/main.html) with Asciidoctor and JBake
    

Books

*   The authors of the "Groovy 2 Cookbook" book are launching a little [contest for a giveaway of the book](http://groovy.aestasit.com/contest.html)
    

Events

*   The Greach conference in Madrid [refreshed its website](http://greach.es/) look and published the full agenda