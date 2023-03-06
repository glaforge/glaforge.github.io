---
title: "Groovy Weekly #5"
date: "2014-01-21T00:00:00.000+01:00"
tags: [groovy, groovy-weekly]
---

We all know the Groovy community is super active, buzzing with useful projects in the ecosystem, but it’s always interesting to see how our projects evolve in terms of usage. Guillaume Laforge, project lead of Groovy, computed some download statistics for Groovy, and showed [Groovy almost doubled its downloads, from 1.7 million downloads in 2012 up to 3 million downloads in 2013](http://glaforge.appspot.com/article/groovy-crosses-the-3-million-downloads-a-year-mark)! All that, thanks to the hard work of the Groovy core team and the friendly and supportive community.

Releases

*   Grails 2.3.5 has been [released](http://grails.org/2.3.5%20Release%20Notes)
    
*   Keegan Witt announces the [GMavenPlus 1.0 release](https://github.com/groovy/GMavenPlus/wiki/News), which offers the best support for building Groovy projects when using Maven
    

Articles

*   Guillaume Laforge [analyses the ongoing growth of Groovy](http://glaforge.appspot.com/article/groovy-crosses-the-3-million-downloads-a-year-mark) in terms of downloads (3 million downloads in 2013) and illustrates the adoption of the various Groovy version over the past two years, with a couple pretty graphs.
    
*   Andrés Almiray explains all the [details about Griffon 2.0 and beyond](http://www.jroller.com/aalmiray/entry/griffon_2_0_0_and)
    
*   Russell Hart on [deploying Ratpack applications to Cloud Foundry](http://blog.anacoders.com/deploying-ratpack-applications-to-cloudfoundry/)
    
*   Mark Perry continues exploring the functional field with Groovy, with [folds and unfolds](http://mperry.github.io/2014/01/21/folds-and-unfolds.html)
    
*   Kunal Dabir shows how to use a [Lazybones template for your Gaelyk applications](https://github.com/kdabir/lazybone-templates#creating-a-gaelyk-project-using-the-template)
    
*   [Smooth integration with Github Pages is introduced in Grain](http://sysgears.com/grain/news/deployment-to-github-pages-is-introduced/), the static website generator for Groovy
    
*   Julian Exenberger tries to [replicate Groovy's builders using Java 8 and lambdas](http://java.dzone.com/articles/builder-pattern-using-java-8-0)
    
*   David Estes explains the [differences and similarities of moving from Rails to Grails](http://www.redwindsw.com/blog/2014-01-15-moving-from-rails-to-grails-differences-and-similarities)
    
*   Corinne Krych [reports on the recent Groovy hackergarten](http://corinnekrych.blogspot.fr/2014/01/secure-your-runtime-groovy-hackengarten.html) that took place in the south of France with Cédric Champeau, on the topic of a secure runtime AST customizer
    

Presentations

*   Graeme Rocher talks through the latest [Async features offered by Grails](http://www.infoq.com/presentations/grails-rest-async) and how they can be used to create non-blocking REST APIs
    
*   Marco Vermeulen showcases using [BDD and Cucumber to develop GVM](http://www.infoq.com/presentations/gvm-bdd-cucumber), an open source tool for managing parallel SDK versions, during GR8Conf US 2013
    
*   Jeff Beck shows how to use Codenarc, Cobertura, JSLint, and other tools to perform [static analysis on Grails application](http://www.infoq.com/presentations/grails-static-analysis-tools), recorded at GR8Conf US 2013
    
*   Rob Fletcher explains how to [use Vert.x, WebSockets, continuous unit testing and headless end-to-end testing](http://www.infoq.com/presentations/grails-vertx-websockets) to create one-page applications in Grails, during GR8Conf US 2013
    

Mailing-list discussions

*   Jochen Theodorou gives some [high-level explanations of what the future Meta-Object Protocol v2](http://groovy.329449.n5.nabble.com/Installing-a-property-through-metaclass-sometimes-does-not-work-td5718106.html#a5718134) will look like in Groovy 3.0
    

Tweets

*   [Groovy crossed the 3 million downloads mark for 2013](https://twitter.com/glaforge/status/425299880991801344), to compare with the 1.7M downloads for 2012, that's quite a growth!
    
*   Cédric Champeau merged the [Groovy closure parameter type inference into master](https://twitter.com/cedricchampeau/status/423506229923962880)
    
*   Cédric Champeau is [setting up the new TeamCity Continuous Integration server](https://twitter.com/cedricchampeau/status/423853949821939712) for building Groovy, sponsored by JetBrains
    
*   Grails 2.3.5 is also [available in GVM](https://twitter.com/gvmtool/status/423896818423189504)
    
*   Some details on the upcoming [RxJava support in Ratpack 0.9.1](https://twitter.com/ratpackweb/status/423597717420769280)
    
*   Andrés Almiray crafts various [Lazybones templates for Griffon](https://twitter.com/aalmiray/status/424981529878478848)
    
*   The Grain static website generator is [adding Asciidoctor support](https://twitter.com/grainframework/status/425260426851409920) in the next version
    
*   David Dawson shares a picture of [Groovy post-it notes](https://twitter.com/davidthecoder/status/423855749165776896/photo/1)!
    
*   Looks like Minneapolis is always super active in the Groovy ecosystem, and a "[GR8 Ladies](https://twitter.com/gr8ladies)" initiative is seeing the light of day. You might want to follow their twitter account as the story unfolds.
    
*   Rob Fletcher is a fan of [Groovy 2.2's implicit closure coercion](https://twitter.com/rfletcherew/status/425340799820496896)
    
*   Dan Woods is [joining the Cloud Infrastructure Tools team at Netflix](https://twitter.com/danveloper/status/425343533721989120)
    

Podcast

*   For those speaking French, Stéphane Maldini answers Guillaume Laforge's questions on [Grails and Reactor on this interview](https://twitter.com/lescastcodeurs/status/425366618525663232) of the French podcast "Les Cast Codeurs"
    

Google+ post

*   Colling Harrington [mentions](https://plus.google.com/u/0/+ColinHarrington/posts/K29FVW56AzJ?cfem=1) Aaron Hanson's work on a [SimpleHTTPServer script](https://github.com/simplenotions/simple-http-server) in Groovy, in the same vein as Ratpack
    

Code snippet

*   A Groovy script that takes a [CSV file and turns it into a List of Maps](https://gist.github.com/crazy4groovy/8438827#file-csv2list-groovy) using the GroovyCSV library
    

Contributions

*   Cédric Champeau joined the Riviera GUG which was organizing a Groovy hackathon last week-end, and they worked and contributed to [GROOVY-6527](http://jira.codehaus.org/browse/GROOVY-6527), a secure runtime AST customizer, and made [several commits that will be contributed to the Groovy project](https://github.com/rivieragug/groovy-core/commits/secureruntime)
    

Jobs

*   Dan Woods tells us about startup [Exactuals](http://www.exactuals.com/) which is [hiring a Senior Grails Developer](https://twitter.com/danveloper/status/425524216201347073) for $100k-$120k per year to work with cloud, and messaging technologies
    

Other news

*   As usual, the the [Grails Diary](http://grydeske.net/news/show/26) is out, week 4 of 2014, by Jacob Aae Mikkelsen
    

Books

*   A [review of Ken Kousen's Making Java Groovy book](http://www.amazon.com/review/R395UVGPILFN68/ref=cm_cr_pr_perm?ie=UTF8&ASIN=1935182943&linkCode=&nodeID=&tag=) on Amazon
    

Events

*   A [report on the first Grails Conf India conference](http://www.pcquest.com/pcquest/news/206418/intelligrape-software-launches-indian-chapter-world-s-largest-grail-conference) organized by IntelliGrape
    
*   The [Call for Papers](http://cfp.gr8conf.org/login/auth) for the GR8Conf Europe (Copenhagen, Denmark, on June 2nd-4th 2014) and GR8Conf US (Minneapolis, USA, on July 28th-29th 2014) conferences is now open
    
*   The Call for Papers for the [Greach](http://greach.es/) conference (Madrid, Spain, on March 28th and 29th 2014) is also open, till January 31st
    

  
Don't forget you can [contribute to this weekly column](http://bit.ly/groovyweekly) of Groovy news, and that you can [subscribe through a newsletter](http://bit.ly/groovy-weekly-subscribe).