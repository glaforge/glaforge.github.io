---
title: "Groovy not Enterprise-ready, you're kidding?"
date: 2008-01-19T00:00:00.000+01:00
tags: [groovy]

similar:
  - "posts/2005/01/31/groovy-s-dead-long-live-groovy.md"
  - "posts/2005/01/31/re-how-groovy-can-get-her-groove-back.md"
  - "posts/2005/06/30/javaone-groovy-reactions.md"
---

Graeme pointed me at a [white-paperish article](http://www.huxili.com/reports/ID000188) claiming Groovy would not be Enterprise-ready. If the article had been acurate, I would have welcomed it, and we could have found ways to improve Groovy to make it ready, but unfortunately, the author did not do his job properly, and only spread FUD by saying Groovy doesn't hold to its promises.

As this article is pretty thin on the technical aspects, I won't explain why his conclusions are wrong -- and also because [Graeme explained this already](http://graemerocher.blogspot.com/2008/01/re-groovy-and-jruby-enterprise-ready.html). Instead, I'll just comment on a few of his claims.

> Some even claims that Java should be replaced by their preferred dynamic language.

I don't know who "some" is in this sentence, but at least, that's not me. Developers should always have the choice: the best tool for the job. [Groovy](http://groovy.codehaus.org/) has initially been conceived to complement Java, not to replace it -- which doesn't mean that you can't build a full project using Groovy only, as demonstrated by the powerful [Grails framework](http://grails.org/). Java's a great language, and a wonderful platform. Unlike other[platforms](http://davidvancouvering.blogspot.com/2008/01/say-it-aint-so-ruby-on-rails-not-thread.html), Java's threadsafe, it optimizes access to databases, it scales extraordinarily well, etc.

> SAP, one of the largest providers of enterprise software and services in the world, have released a new community driven product based on Groovy.

Yes, SAP, among other big vendors (IBM, Oracle, JBoss) who did the same, has decided to use [Groovy](http://groovy.codehaus.org/) and [Grails](http://grails.org/) for its new innovative project. Do you think a company like SAP would have chosen Groovy and Grails if these technologies would not have been Enterprise-ready? See a couple of links on this topic:

*   A [testimonial on Graeme's blog](http://graemerocher.blogspot.com/2007/12/sap-announces-composition-on-grails-10.html)
*   And the [project itself](https://www.sdn.sap.com/irj/sdn/wiki?path=/display/Community/Composition+on+Grails)

> On the JRuby side, it has solid backing from Sun Microsystems and has been integrated into NetBeans IDE

Right, Sun's been investing in JRuby by hiring the two lead developers. They've been putting a lot of marketing effort on this, to surf the hype wave of Ruby on Rails. But **Sun has also helped the Groovy project** by giving us access to a nice Sun Fire T2000 machine for our performance testing needs, they've let us create a JSR for standardizing Groovy in the Java Community Process, and they are also currently working on [Groovy and Grails support in NetBeans](http://martin.adamek.sk/). There's just less marketing money spent on Groovy and Grails.

> Before applying Groovy or JRuby to your enterprise applications, their suitability and reliability should be evaluated seriously.

Very true, and you should definitely not just trust anything you read on the web. You have to do your own homework, and evaluate the technical solution in a realistic context, rather than believing in some micro-benchmark or amateurish white-paper.

> Groovy and JRuby are still very young and has not yet been confirmed in production.

For JRuby, I can't comment, despite the fact I haven't heard of much well-known JRuby-powered systems in production, but hopefully, someone can comment on this blog to get this straight. But at least, for Groovy, I personally know quite a few mission-critical applications that already embed Groovy. I can even tell you **Groovy's handling million-dollars hedge funds daily in a Londonian financial institution**. I can also tell you that US **Fortune 500 insurance company Mutual of Omaha is running a risk calculation engine with thousands of lines of Groovy business rules**. And what about the**US National Cancer Institute which also uses Groovy to validate patients file details**? And one of the **top major American credit card company** (in the top 20 on Fortune 500) that also uses Groovy in production? And Groovy would not be Enterprise-ready?

> First, we observed that the Groovy runtime is not stable, that is, memory consumption increased linearly with repeating times. In other words, a certain amount of memory is lost - i.e. memory leakage - during each evaluation of the script. This is a serious flaw of the Groovy runtime; Groovy can not be used in long-running server environment unless alternative solutions can be found to avoid memory leakage. The simplest solution is "runtime recycling" -- throwing away the Groovy runtime after each execution and let JVM recycle Groovy runtime memory.

There is **no leakage of memory in Groovy** at all. Each time you evaluate a script at runtime, a new class is created in memory. And the classloader just remembers this class, in case it may be used further on down the road, instead of bearing the cost of recompiling / reevaluating it each time. However, if you wanted to just evaluate it once, discard the classloader or the Groovy shell used afterwards. It's as simple as that. No memory leaked at all. Just use the APIs as they are intended to be used, and don't claim that they are flawed because you didn't understand how to use them properly.

> In certain server environments the current solution by recycling Groovy runtime is not enough and you may still have memory leakage problem. This is because certain servers always keep the classes in memory even they are no longer required. One of the example is the JBoss application server. In JBoss, classes are not unloaded from the memory even they are not required by the system. Of course, this is a design problem of JBoss and may be changed in future versions.

I don't know the JBoss internals enough to comment on this one, but as the Groovy classes are loaded by the Groovy classloader itself, I suspect the JBoss infrastructure would just let the classloader to be garbage collected otherwise it would be mostly impossible to make serious applications work on JBoss AS, which I highly doubt. Hopefully, someone with more JBoss knowledge can better comment on this.

Groovy has been **very stable and mature for a long time already**. It is being **used by many high-profile companies and institutions throughout the world with great success**. It is a pity to see such FUD spread of Groovy by an amateurish white-paper written by someone who doesn't seem to have done his researches well.

**Update #1:** I've added a new Enterprise use case for Groovy, where one of the US Fortune 20 credit card / bank company leverages Groovy, as someone pointed me at in a mail.

**Update #2:** Steven made a [nice technical analysis on groovy.dzone.com](http://groovy.dzone.com/news/groovyshell-and-memory-leaks), so if you want to learn more about the technical aspects of the story, and better understand the memory and classloading behavior in Groovy, go right there.