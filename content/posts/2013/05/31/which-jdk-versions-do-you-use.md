---
title: "Which JDK versions do you use?"
date: 2013-05-31T00:00:00.000+02:00
tags: [geek, groovy]

similar:
  - "posts/2014/01/21/groovy-crosses-the-3-million-downloads-a-year-mark.md"
  - "posts/2014/02/11/groovy-weekly-8.md"
  - "posts/2011/11/11/latest-groovy-releases-and-roadmap-update.md"
---

On the [Groovy](http://groovy.codehaus.org) project team, we were wondering about which base JDK to support.  

So far, even the latest and greatest Groovy (version 2.1.4 just released today), we still support JDK 5 — despite being an End-of-Life'd product for a long while already.  

At conferences, I often ask the question on which versions of the JDK attendees are using, locally and in production, and it seems that JDK 5 has almost totally vanished off the face of the planet, but despite JDK 7 being quite mature now, it's still JDK 6 that's more widely deployed.  

To know more about the situation, my Groovy colleague [Cédric](http://www.jroller.com/melix/) crafted a little Google form to run a [survey](https://docs.google.com/forms/d/1KYMG09CFBwn4m4xN2VfGuhWw2VPs39S87IRbIfPwRWw/viewform?pli=1&edit_requested=true) among our users, with three key questions:

> 1.  What version of Java do you use in production?
> 2.  What version of Java do you use for development?
> 3.  What version of Java do you plan to use in the next 12 months?

You can view the [detailed results](https://docs.google.com/forms/d/1KYMG09CFBwn4m4xN2VfGuhWw2VPs39S87IRbIfPwRWw/viewanalytics) (and you can actually still vote), but to sum it up, luckily, there's nobody still using Java 1.4, which is good news, and only a handful of people still stuck with JDK 5 (4% in production). Thus Java 6 and 7 are safe bets as a base for your projects, with roughly 57% of Java 6 and and 39% of Java 7 in production, this Java 6 still winning by almost 50% over 7! And in development, developers are more eager to using the latest JDK, with twice as much Java 7 than Java 6.  

[![](/img/misc/jdk-versions-adoption.png)](https://docs.google.com/forms/d/1KYMG09CFBwn4m4xN2VfGuhWw2VPs39S87IRbIfPwRWw/viewanalytics) 

As for the Groovy project, we're thinking of mandating Java 7 (essentially because of "invoke dynamic") as the base Java version for Groovy 3, and as this release is slated for late Q1 next year, the adoption of Java 7 should have increased significantly in production — and anyway, we'll still support Groovy 2.X in parallel for "older" JDKs. But the question was more for the upcoming Groovy 2.2, which should be released in a couple of months or so, if we should go with Java 6 as the base requirement. We haven't yet made our decision, but considering 96% of respondents are using Java 6 or newer, that's not a risky bet to make that decision!