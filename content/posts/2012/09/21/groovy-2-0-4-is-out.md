---
title: "Groovy 2.0.4 is out"
date: "2012-09-21T00:00:00.000+02:00"
tags: [groovy]
---

The Groovy development team's just **released Groovy 2.0.4**, a bug fix for our Groovy 2.0 branch.  

It fixes some important issues we've had with generics with the stub generator, as well as several fixes related to the static type checking and static compilation features. We also worked on the recompilation issues with the GroovyScriptEngine.  

You can download Groovy 2.0.4 here: [http://groovy.codehaus.org/Download](http://groovy.codehaus.org/Download)  

The artifacts are not yet on Maven Central, but will shortly.  

Also, the online JavaDoc and GroovyDoc are still being uploaded as I write this, but will hopefully be online in a few hours.  

You can have a look at the issues fixed in this release on JIRA: [https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18777](https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18777)  

If you're curious why we've jumped from 2.0.2 to 2.0.4, skipping 2.0.3, it's because of some issues with the release of 2.0.3 which I had mistakenly built with JDK 6 instead of JDK 7, which ruled out all our invoke dynamic support. So we quickly moved to 2.0.4.  

We'll certainly also release a 1.8.9 soon, especially for the stub generator fixes which might be useful for those affected with the issues we've fixed.