---
title: "Continuous Integration with DamageControl"
date: "2004-07-06T00:00:00.000+02:00"
tags: [geek, groovy]
---

[DamageControl](http://damagecontrol.codehaus.org/), I believe, is one of the great tools an Open Source project must have. For those who don't know this great project hosted at [Codehaus](http://www.codehaus.org/), it is one incarnation of a continuous integration system, like CruiseControl or others...

Basically, this is a tool which allow developers to make their project build automatically upon each commit to ease integration. Each time a modification is done on your Source Control Management system, it triggers a build. It's particularly handy when associated with a full build including test suites.

In real-time, you're advertized if the build succeeds or not, through different means, be it through mail, IRC or Instant Messenging.

Thanks to DamageControl, I can see that my last commit on [Groovy](http://groovy.codehaus.org/) was successful. And even better, you can put on your web site a link to a picture indicating that the build succeeded or failed. If it's green, that's cool!