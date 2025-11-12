---
title: "Groovy Weekly #64"
date: 2015-03-31T00:00:00.000+02:00
tags: [groovy, groovy-weekly]

similar:
  - "posts/2015/04/14/groovy-weekly-66.md"
  - "posts/2015/03/17/groovy-weekly-62.md"
  - "posts/2015/04/07/groovy-weekly-65.md"
---

Today marks the [end of the sponsorship of the Groovy and Grails projects by Pivotal]({{< ref "/posts/2015/01/19/the-groovy-project-is-looking-for-a-new-home" >}}). The projects are now turning a new page in their lives. For Groovy, the project is going to wear some feathers, with [joining the Apache Software Foundation](http://www.programmableweb.com/news/groovy-project-joins-apache-software-foundation/2015/03/27). And Grails is [releasing its major 3.0 version](http://grails.io/post/115110650393/grails-3-0-released-and-the-road-ahead).

With Groovy’s move to Apache, it’s important to notice that the Groovy mailing-lists are moving. You [must subscribe to the new mailing-lists at Apache](http://groovy.329449.n5.nabble.com/IMPORTANT-New-mailing-lists-and-JIRA-migration-td5723329.html), as we won’t force-subscribe people, so you’ll have to opt-in to these new lists.

Last but not least, Groovy has been submitted for nomination for the JAX 2015 innovation award, so we encourage you to [vote for Groovy for the JAX innovation award](http://jaxenter.com/jax-awards-2015/submit-your-vote)!

## Releases

*   [Grails 3.0](https://github.com/grails/grails-core/releases/tag/v3.0.0) released
*   [Grails 2.4.5 and 2.5.0](https://twitter.com/grailsframework/status/580610565808197632) are released
*   [Grails 3.0 RC-3](https://twitter.com/grailsframework/status/581094391521132546) released, the last RC before the final release
*   Al Baker releases [Stardog Groovy 3.0](https://twitter.com/AlBaker_Dev/status/581168099614937088)
*   [Gradle Nebula-test plugin releases v2.2.1](https://twitter.com/NebulaPlugins/status/581203594021584897) with an updated Spock 1.0
*   [Document Builder 0.3.0](https://twitter.com/craigburke1/status/582575048764055552) released by Craig Burke with header / footer support

## Articles

*   [Grails 3.0 released and the road ahead](http://grails.io/post/115110650393/grails-3-0-released-and-the-road-ahead) by Graeme Rocher
*   ProgrammableWeb covers [Groovy project joining the Apache Software Foundation](http://www.programmableweb.com/news/groovy-project-joins-apache-software-foundation/2015/03/27)
*   Cédric Champeau dives into the details of an [improved sandboxing approach for Groovy scripts](http://melix.github.io/blog/2015/03/sandboxing.html)
*   Write your [games in Groovy with libGDX](https://impetus-games.com/blog/libGDX-the-Groovy-Way)
*   Marco Vermeulen details the [GVM vendor API](http://www.wiredforcode.com/blog/2015/03/26/the-gvm-vendor-api/)
*   Pavel Dudka's first Gradle [tip on Gradle tasks](http://trickyandroid.com/gradle-tip-1-tasks/)
*   [Gradle 2.4, the fastest yet](https://gradle.org/gradle-2-4-the-fastest-yet/), says Luke Daley
*   Hans Dockter gives the [Gradle team's perspective on Google's Bazel](https://gradle.org/gradle-team-perspective-on-bazel) build solution
*   [How to pitch Gradle to your boss](https://gradle.org/why/return-on-investment/)? Here's a recipe on Gradle's website
*   MrHaki's Groovy Goodness: [New methods to sort and remove duplicates from collection](http://mrhaki.blogspot.fr/2015/03/groovy-goodness-new-methods-to-sort-and.html)
*   Peter Ledbrook covers the infamous [Gradle halting problem](http://blog.cacoethes.co.uk/gradle/comments-on-recent-gradle-criticisms)
*   Ratpack 0.9.15 will feature [non blocking health checks](https://twitter.com/ratpackweb/status/582642475388444672)
*   Integration vs functional testing: how to [test REST APIs in Grails using Spock](http://aruizca.com/integrated-vs-functional-testing-how-to-test-rest-apis-in-grails-using-spock/), by Angel Ruiz
*   [Writing AngularJS applications in Groovy](http://devsoap.com/#!/Writing-AngularJS-applications-in-Groovy) by John Ahlroos

## News

*   [Grails is moving away from JIRA to Github issues](https://twitter.com/grailsframework/status/582466373894438912)
*   The [Groovy Podcast now has a Twitter feed](https://twitter.com/kenkousen/status/580745262148280320), announces Ken Kousen
*   Jacob Aae Mikkelsen [Grails Diary](http://grydeske.net/news/show/89) week 13
    
## Presentations

*   SpringOne2GX 2014
    *   [Advanced GORM, beyond relational](http://www.infoq.com/presentations/advanced-gorm), by Graeme Rocher
    *   [Performance tuning Grails applications](http://www.infoq.com/presentations/grails-perf-tuning) by Lari Hotari
    *   [Runtime meta-programming with Groovy](http://www.infoq.com/presentations/groovy-metaprogramming) by Jeff Brown
    *   [Groovy mobile automation](http://www.infoq.com/presentations/groovy-spock-gradle) by Bobby Warner

## Tweets

*   Cédric Champeau tweets about the [new mailing-lists for the Groovy project at Apache](https://twitter.com/CedricChampeau/status/582656729600622592), encouraging all users to move to the new lists
*   The [new Groovy documentation is already 630 pages long in PDF](https://twitter.com/cedricchampeau/status/582908247692181504) form, with all code snippets automatically tested, notes Cédric Champeau
*   Rob Winch and Sam Brannen are experiencing important [decreased build times thanks to Gradle 2.4](https://twitter.com/sam_brannen/status/581884182156197888) build time improvements
*   Eugene Kamenev announces the use of Gitter for [chatting about SwissKnife and Groovy Android](https://twitter.com/eugenekamenev/status/582548963661729792) support
*   Cédric Champeau's [Bytecode AST transformation supports debugging](https://twitter.com/CedricChampeau/status/581129087126609920)
*   Dan Woods notices the [NIO support from Groovy 2.3](https://twitter.com/danveloper/status/581553702525214720)
*   Dan Woods is sad to learn that the [Groovy Grails Tool Suite is discontinued](https://twitter.com/danveloper/status/581765073258987520), following up Pivotal's end of funding of the Groovy and Grails projects
*   Dierk König notes that [Groovy's safe navigation operator is like the Maybe monad](https://twitter.com/mittie/status/581768305771450368), and GPath is like a list monad
*   [Grails 2.4.5](https://twitter.com/gvmtool/status/580608623719686144) is available on GVM
*   [Grails 2.5.0](https://twitter.com/gvmtool/status/580608731085447168) is available on GVM
*   [Grails 3.0 RC-3](https://twitter.com/gvmtool/status/581097862899113986) available on GVM
*   [Grails 3.0](https://twitter.com/gvmtool/status/582850247929532416) is available on GVM
*   Craig Burke is moving his [document builder to OOXML](https://twitter.com/craigburke1/status/580732939371171840)
*   Craig Burke managed to get [headers working for his document builder](https://twitter.com/craigburke1/status/580788527341924352)
*   Al Baker says [Stardog Groovy 3.0 includes simplified reasoning configuration](https://twitter.com/AlBaker_Dev/status/581169267619602433)

## Mailing-list posts

*   With its move to the Apache foundation, Groovy is moving its mailing-lists, and [subscribers of the old lists should subscribe to the new ones](http://groovy.329449.n5.nabble.com/IMPORTANT-New-mailing-lists-and-JIRA-migration-td5723329.html)

## Podcasts

*   [Groovy podcast episode 9](https://twitter.com/groovypodcast/status/581107353459658752) is available

## Code snippets

*   Tim Yates has fun with some [ASCII based image generation](https://gist.github.com/timyates/7234c83d9e7df39e5a09) script

## Events

*   The latest [newsletter about GR8Conf Europe](https://twitter.com/gr8conf/status/580603331707559936) 2015
*   If you're wondering about [GR8Conf Europe, check its YouTube channel](https://twitter.com/gr8conf/status/580769221023399936) to figure out!