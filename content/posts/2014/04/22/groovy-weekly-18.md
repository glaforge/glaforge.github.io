---
title: "Groovy Weekly #18"
date: "2014-04-22T00:00:00.000+02:00"
tags: [groovy, groovy-weekly]
---

The Easter bunny is delivering the latest Groovy Weekly column!

With your chocolate eggs, you’ll get some bits of functional programming, a tutorial on Groovy traits, details of the JSON serialization performance improvements, and also get the chance of voicing your feedback on things like Groovy’s support of Java 8 lambda syntax, on the Ratpack async support, and more.

## Releases

*   groovy-comprehension is a groovy extension module / AST transformation which provides simple [list comprehension functionality](https://github.com/uehaj/groovy-comprehension) similar to that of Haskell, Scala or Python. Under the hood it’s a 'monad' comprehension but you don't care about it for use.

## Presentations

*   Guillaume Laforge gave a brand new presentation on Groovy, at Devoxx France 2014, covering the [novelties in the upcoming Groovy 2.3 release](https://speakerdeck.com/glaforge/groovy-in-2014-and-beyond-at-devoxx-france)
*   Cédric Champeau spoke about [Gradle vs Maven](https://twitter.com/CedricChampeau/status/457176735717785601) at the Devoxx France 2014 conference last week. The slides are in French, but even if you're not speaking it, you should get some interesting tidbits from the code samples and links
    
## Articles

*   Andrey Bloschetsov published follow up benchmarks after Rick's on the [JSON performance improvements](https://github.com/bura/json-benchmarks), this time for the serialization of JSON payloads
*   A [tutorial on Groovy traits](http://www.mscharhag.com/2014/04/groovy-23-introduces-traits.html) by Michael Scharhag
*   Kyle Boon on the [state of code coverage for Groovy](http://kyleboon.org/blog/2014/04/17/code-coverage-with-groovy/)
*   Marcin Gryszko's [quest for persistable Groovy immutability](http://grysz.com/2014/04/22/quest-for-persistable-groovy-immutability/)
*   Ken Kousen on the "[closure of no return](http://kousenit.wordpress.com/2014/04/16/the-closure-of-no-return/)", on the fact you can "return" from the outer scope of the closure you pass to an each or findAll method
*   Ken Kousen received some [excellent feedback on his article "the closure of no return"](http://kousenit.wordpress.com/2014/04/18/responses-to-the-closure-of-no-return/) showing the way towards the solution and best approaches
*   [Grails design best practices](http://www.javacodegeeks.com/2013/04/grails-design-best-practices.html) by Nitin Kumar
*   MrHaki on [extending the Grails IntegrateWith Command](http://mrhaki.blogspot.fr/2014/04/grails-goodness-extending-integratewith.html)

## Tweets

*   [Should Groovy support the Java 8 lambda syntax](https://twitter.com/ldaley/status/456705374775566337)? Your opinion is interesting.
*   The Ratpack team is looking for [feedback on their async support](https://twitter.com/ratpackweb/status/457122433128873984)
*   Cédric Champeau advises developers to [always use the Gradle wrapper](https://twitter.com/CedricChampeau/status/458548956025614336), in particular within OSS projects, as it makes it easier to have a consistent build experience among developers and new contributors
*   Schalk Cronjé is playing around with Greyton, [a Groovy DSL (on top of JClouds)](https://twitter.com/ysb33r/status/456189345075318785) to simplify cloud devops and is looking for feedback
*   Schalk Cronjé is looking for [volunteers to try the SMB / CIFS provider for his Groovy VFS](https://twitter.com/ysb33r/status/458558435869855744) library
*   Dierk König shares a handy [Groovy one-liner to print your local IP address](https://twitter.com/mittie/status/456189301202911232) from the command-line
*   Dan Woods fell into the trap of [using GStrings as keys for maps](https://twitter.com/danveloper/status/456708683527778305), and the follow up discussion on Twitter on the topic is worth a read
*   Russ Miles finds [Groovy elegant and simple for using nested data structures](https://twitter.com/russmiles/status/456767251572858880), adding to Spring Boot's productivity too

## Google+ posts

*   [Monadic combinators](https://plus.google.com/103753917802203497881/posts/i2JE4WZa3A6) in Groovy by Mark Perry
    
## News

*   Jacob Aae Mikkelsen on the [Grails Diary #16](http://grydeske.net/news/show/41)
*   Glu is now [hosting its binary release thanks to Bintray](https://twitter.com/glutweets/status/457587070886637568)

## Books

*   The [Grails Goodness book](http://mrhaki.blogspot.fr/2014/04/grails-goodness-notebook-is-published.html) has been published by MrHaki

## Jobs

*   James Foley is currently looking to network with an experienced (3 years plus) [Groovy/Grails Application Developer](http://sni-technology.jobs.net/job/Grails-Application-Developer/J3G74X69K69XRTS6QCQ/) for an excellent on going contract OR contract to hire scenario. 100% Remote opportunity!

## Events

*   The [SpringOne2GX 2014 conference in Dallas is now open for registration](https://twitter.com/mewzherder/status/456510357482131456), with a super early bird price
*   And of course, [GR8Conf Europe](http://gr8conf.eu/) and [US 2014](http://gr8conf.us/) are still open for registration too!