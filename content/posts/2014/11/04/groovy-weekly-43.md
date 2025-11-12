---
title: "Groovy Weekly #43"
date: 2014-11-04T00:00:00.000+01:00
tags: [groovy, groovy-weekly]

similar:
  - "posts/2014/11/25/groovy-weekly-46.md"
  - "posts/2014/12/02/groovy-weekly-47.md"
  - "posts/2014/09/23/groovy-weekly-37.md"
---

This week, an InfoWorld article lists [Groovy among the 9 cutting-edge programming language worth learning today](http://www.infoworld.com/article/2840235/application-development/9-cutting-edge-programming-languages-worth-learning-next.html), although it reduces Groovy to a mere Java dynamic scripting language. Are you happy with the investment you made into learning Groovy a while ago?

We also have some nice releases, like the monthly Ratpack release, or the 1.0 versions of GroovyServ (for starting up your Groovy scripts at light speed), and Gaiden for making nice documentation with Markdown.

Jorge Franco keeps on writing some cool demos with GrooScript, to write your JavaScript apps in your favorite programming language. He also unveiled the new [GrooScript](http://grooscript.org/) website!

In the news section, I’ve also listed a couple refinements coming up in Groovy 2.4, with @DelegatesTo / @ClosureParams annotations alignments and the new @SelfType annotation for traits to restrict trait application.

## Releases

*   [GroovyServ 1.0](http://kobo.github.io/groovyserv/changelog.html) released
*   [Ratpack 0.9.10](http://www.ratpack.io/versions/0.9.10) released
*   [Gradle 2.2-rc-2](http://forums.gradle.org/gradle/topics/gradle-2-2-rc-2-is-now-available-for-testing?rfm=1) released fixing a couple of regressions from the previous release candidate
*   [GrooScript 0.6.2](https://twitter.com/grooscript/status/529365793642131457) released
*   [Groovy android plugin for Gradle 0.3.4](https://twitter.com/cedricchampeau/status/528184277306183681) released with support for product flavors
*   [Spock Reports Extension 1.2.1](https://github.com/renatoathaydes/spock-reports) released
*   [Gaiden 1.0](http://groovy.329449.n5.nabble.com/ANN-Gaiden-1-0-released-td5721608.html) is out, with theme, numbering, wrapper, and others
*   An updated [optimized Grails Docker container](https://registry.hub.docker.com/u/mozart/grails/)
    
## Articles

*   InfoWorld reports about [9 cutting-edge programming language worth learning now, including Groovy](http://www.infoworld.com/article/2840235/application-development/9-cutting-edge-programming-languages-worth-learning-next.html)
*   Roberto Guerra dives into [Ratpack Guice-based modularisation and dependency injection](http://blog.stumblingoncode.com/posts/2014-10-31-ratpack-guice.html)
*   Another great demo of [Grooscript writing a Node.JS chat application with Groovy and Socket.IO](http://grooscript.org/chat_example.html)
*   Julien Viet details the [Rx extension for Vert.x and shows the RxGroovy integration](https://github.com/vert-x3/ext/blob/master/ext-rx/README.md) too
*   Patrick Double shares his [experience with publishing a Grails plugin](http://www.objectpartners.com/2014/10/29/experiences-with-publishing-a-grails-plugin/)
*   Albert van Veen on [Grails' generation of asynchronous controllers](http://blog.jdriven.com/2014/10/grails-generate-async-controller/)
*   Iván López shares his tales from the GeeCON conference
    
## Presentations

*   [Groovy introduction](https://speakerdeck.com/jlstrater/groovy-at-gr8ladies-iowa-code-camp) by the GR8 Ladies at the Iowa code camp 2014

## Screencasts

*   Bertrand Goetzmann recorded a screencast on [monitoring an Apache Camel route started from a Groovy script, with the Hawtio web console](https://www.youtube.com/watch?v=wSlCWJL0Q5I&feature=youtu.be&a)
    
## News

*   A [new look for the GrooScript website](https://twitter.com/grooscript/status/527253669264502784)
*   Jacob Aae Mikkelsen [Grails Diary](http://grydeske.net/news/show/68) week 44
*   Groovy's [@DelegatesTo and @ClosureParams will be more aligned in Groovy 2.4](https://jira.codehaus.org/browse/GROOVY-6956), the latter gaining the same parameters as the former, for more closure type checking goodness
*   Groovy 2.4 adds a [@SelfType annotation to traits](https://jira.codehaus.org/browse/GROOVY-7134) allowing you to restrict to what types a trait can be applied

## Tweets

*   [Groovy works well on the new Android runtime ART](https://twitter.com/cedricchampeau/status/529191824796430336) as well tells Cédric Champeau
*   Schalk Cronjé tweets that [Groovy isn't magical, but is an elixir to better programmer health](https://twitter.com/ysb33r/status/528184841951780864)
*   Robert Fletcher updated the [Gradle Compass plugin](https://twitter.com/rfletcherew/status/527498052752265217)
*   Dan Woods [loves the new Groovy documentation](https://twitter.com/danveloper/status/527155055917412352)
*   [Gradle 2.2-rc-2](https://twitter.com/gvmtool/status/529403342095925248) available on GVM
*   [GroovyServ 1.0](https://twitter.com/gvmtool/status/529625692028538880) is available on GVM
*   Dierk König [compares GPars dataflow variables to references in pure functional languages](https://twitter.com/mittie/status/528961665292054529)

## Jobs

*   André Steingreß is looking for a [Grails developer](http://findgrailsjobs.com/job/673-software-developer-fm-java-groovy-grails-remote) in this job posting
*   Ben McGuire is [looking for Grails developers](https://twitter.com/ben_t_mcguire/status/527812020607787008) for a major project in San Diego
    
## Events

*   GrailsConf India has opened its [Call for Paper](http://grailsconf.in/call-for-paper)
*   Cédric Champeau will be speaking about [Groovy for Android at Mobile Central Europe](https://twitter.com/cedricchampeau/status/527443577388142592), Warsaw, in February
*   Iván López is speaking about the [Grails framework at jDays 2015](https://twitter.com/ilopmar/status/527832608835923968) in Gothenburg next March
*   The [next GR8 Ladies meetup will be November 17th](https://twitter.com/gr8ladiesmsp/status/529316231459778560) if you're in the Minneapolis area