---
title: "Groovy Weekly #20"
date: 2014-05-06T00:00:00.000+02:00
tags: [groovy, groovy-weekly]
---

Tthe big news of the week is the [release of Groovy 2.3.0]({{< ref "/posts/2014/05/05/groovy-2-3-0-is-out" >}})! With traits, support for running on JDK 8, new AST transformations, lightning fast JSON support, and more!

Be sure to read the Groovy 2.3.0 [release notes](http://bitly.com/g230notes) to get all the juicy details!

And vote up the DZone link to make a bit of buzz on the small [interview of Guillaume Laforge](http://www.dzone.com/links/interview_about_the_release_of_groovy_23.html) about the release.

Also, Hubert Klein Ikking was on a blogging spree, as he wrote many new items in the Groovy Goodness series with snippets showing the new features in action. So don’t miss those examples linked below!

## Releases

*   Guillaume Laforge announces the [final release of Groovy 2.3.0]({{< ref "/posts/2014/05/05/groovy-2-3-0-is-out" >}})
*   [Ratpack 0.9.4](http://www.ratpack.io/versions/0.9.4) relased
*   Schalk Cronjé shares a pre-release of his [Groovy VFS command-line project](http://groovy.329449.n5.nabble.com/ANN-VFS-Command-line-pre-release-version-on-Bintray-td5719457.html), for copying, moving files around from multiple sources from the command-line
*   Florian Freudenberg created a [Windows Powershell port of GVM command-line](https://github.com/flofreud/posh-gvm) interface for Groovy developers using Windows, thanks to the GVM APIs
*   Latitude 1.0 has been released. [Latitude is an API to ease property reference in Groovy](https://github.com/will-lp/latitude), allowing it to be type checked and customized for use within queries, ignoring fields, etc. An IDE can auto-complete, refactor and find usages, and @TypeChecked can point typos in it.

## Interviews

*   InfoQ publishes a little [interview of Guillaume Laforge about the release of Groovy 2.3.0](http://www.dzone.com/links/interview_about_the_release_of_groovy_23.html). You can vote up the associated DZone link!

## Presentations

*   Vladimír Orany spoke about [Gaelyk and Glide](http://greach.es/speakers/vladimir-orany-gliding-gaelyk/) at Greach 2014
    
## Articles

*   Learn about all the latest [features of Groovy 2.3.0 in the detailed release notes](http://bitly.com/g230notes)
*   InfoQ features an article by Matt Raible on the [JSON performance improvements](http://www.infoq.com/news/2014/04/groovy-2.3-json) coming up in Groovy 2.3
*   [C# is getting Groovy](http://blogs.msdn.com/b/jerrynixon/archive/2014/02/26/at-last-c-is-getting-sometimes-called-the-safe-navigation-operator.aspx), borrowing Groovy's ?. null safe navigation operator (already copied by CoffeeScript)
*   David Norton writes about how to [reuse your Gradle logic across the enterprise](http://www.objectpartners.com/2014/04/24/reuse-your-gradle-logic-across-the-enterprise/)
*   MrHaki's Groovy Goodness celebrates Groovy 2.3.0!
*   [use @Sortable annotation to make classes Comparable](http://mrhaki.blogspot.dk/2014/05/groovy-goodness-use-sortable-annotation.html)
*   [extra methods for NIO path](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-extra-methods-for-nio.html)
*   [more efficient tail recursion with @TailRecursive annotation](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-more-efficient-tail.html)
*   [@BaseScript with abstract run script method](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-basescript-with.html)
*   [use @Builder AST transformation for fluent API](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-use-builder-ast.html)
*   [@Builder definition with extra type checks](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-builder-definition-with.html)
*   [using @Builder to create fluent API for other classes](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-using-builder-to-create.html)
*   [check configuration property is set in ConfigObject](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-check-configuration.html)
*   [extend ConfigSlurper with custom environments](http://mrhaki.blogspot.fr/2014/05/groovy-goodness-extend-configslurper.html) sections
*   Grails Goodness by MrHaki: [Using Aliases as Command Shortcuts](http://mrhaki.blogspot.fr/2014/05/grails-goodness-using-aliases-as.html)
*   [Multi-factor authentication](http://www.gobloomhealth.com/multi-factor-authentication-part-1/) with Grails, part 1, by Kyle Boon
*   [GORM: bulk delete already](http://deveki.com/softdev/gorm-bulk-delete-already/)
*   [Getting SVN info using Groovy](http://octodecillion.com/blog/getting-svn-info-using-groovy/)
*   Implementing [many to many relation between domains in Grails with MongoDB](http://www.oodlestechnologies.com/blogs/Implementing-many-to-many-relation-between-domains-in-Grails-with-MongoDB)
*   [Tracking Hibernate statistics across Grails actions](http://www.objectpartners.com/2014/04/22/tracking-hibernate-statistics-across-grails-actions/) by Igor Shults
*   [Groovy implementation of the INI](http://octodecillion.com/blog/groovy-implementation-of-inix-file-format-part-2/) file format
*   [Implementing social auth with Grails](http://www.oodlestechnologies.com/blogs/Implement-SocialAuth-using-Grails) by Sumit Rathi
*   [Spring Security Permission Based framework](http://www.intelligrape.com/blog/2014/04/28/spring-security-permission-based-framework/)
*   [Debugging your Grails application in IntelliJ IDEA](http://www.intelligrape.com/blog/2014/04/22/simple-debugging-in-intellij-idea-part-1/)
*   [Facebook Oauth](http://www.intelligrape.com/blog/2014/04/28/facebook-oauth-for-fetching-page-token/) for fetching page token with Grails
*   [Groovy database resource handling](http://groovy.dzone.com/articles/groovy-database-resource) by Robert Greathouse

## Tweets

*   The link to [Guillaume Laforge's interview on DZone is promoted as a "big link"](https://twitter.com/DZoneLinks/status/463679195147538432)!
*   [Groovy 2.3.0](https://twitter.com/gvmtool/status/463356426354954240) is available through GVM
*   Ken Kousen reports the [change in the groovysh commands now starting with colons](https://twitter.com/kenkousen/status/463656597068058624)
*   Peter Ledbrook announces the [next Groovy podcast](https://twitter.com/pledbrook/status/463251293394710529) for Thursday
*   Jörn Huxhorn noticed the [reworked generics handling of Groovy 2.3 found bugs that slipped through the old type checker](https://twitter.com/huxi/status/463372504518909952)! But if you find regressions in this area, please report them!
*   Sébastien Blanc visited the [Fort Griffon in Besançon, France](https://twitter.com/sebi2706/status/461064801951952896). In honor of Andrés Almiray's work on the Griffon framework?
*   Bertrand Goetzmann shares some [Groovy examples for scripting his TiddlyWikiFx](https://twitter.com/bgoetzmann/status/461468578387349504) project
*   Peter Ledbrook reminds us with his funny tweet that it's better to [use the #groovylang hashtag on Twitter](https://twitter.com/pledbrook/status/461838863900893184) rather than #groovy as there's less noise about non-Groovy language related topics

## Google+ Posts

*   Xavier Ducrohet announces a [new version of the Gradle Android plugin](https://plus.google.com/u/0/+AndroidDevelopers/posts/QCpXF1BxKPm)

## Code Snippets

*   Tim Yates pushes a gist with variants of a [gaussian distribution with Java 8, Groovy, and GPars](https://gist.github.com/glaforge/397fc259320ffd0f7c25)
*   Tim Yates plays with a [metaprogramming addition to Java 8's LocalDate](https://gist.github.com/timyates/527e116c225b23c89e16) to support Groovy's + days addition.
*   The new [@Builder transformation](https://gist.github.com/dmahapatro/5e35e59cad2736a6723f) of Groovy 2.3 covered with its different implementation strategies

## News

*   Jacob Aae Mikkelsen posted [Grails Diary](http://grydeske.net/news/show/42) week 17
*   Jacob Aae Mikkelsen published week 18 of the [Grails Diary](http://grydeske.net/news/show/43)

## Books

*   [Grails in Action, Second Edition](https://twitter.com/manningmeap/status/461907899540074496), by Peter Ledbrook and Glen Smith, has updated all chapters & appendices

## Events

*   With all the [videos published from the Greach](https://twitter.com/greach_es/status/461414161940226048) 2014 conference, viewers accumulated 73000 minutes of viewing!
*   GR8Conf US 2014 [registration](https://twitter.com/ddelponte/status/461225051527069697) is open
*   GR8Conf Europe announces [Cygnet Infotech as sponsor](https://twitter.com/gr8conf/status/463524508176220160)