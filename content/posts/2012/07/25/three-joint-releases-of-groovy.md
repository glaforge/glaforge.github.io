---
title: "Three joint releases of Groovy!"
date: 2012-07-25T00:00:00.000+02:00
tags: [groovy]
---

The Groovy development team is happy to announce the **releases of Groovy 2.0.1, 1.8.7 and 1.7.11**! That's the first time we release three versions at the same time.  

Those three versions are essentially just bug fix releases. The 1.8.7 release contains a lot of the bugfixes that were already integrated in Groovy 2.0.0, so it's just an alignment with the Groovy 2 branch. In the future, Groovy 1.8.x and Groovy 2.x will be maintained in parallel. But the Groovy 1.7 branch is now in end-of-life and won't be maintained further.  

In terms of improvements, you might notice some performance gains with the "invoke dynamic" version, or you'll notice that you can use the Groovy Console in full-screen mode on Mac OS X.  

A lot of attention has particularly been put into the bug fixes of the new features of Groovy 2.0. In particular, the static type checking and static compilation features got the lion share of fixes.  

We also restored the OSGi manifest information. So if you're using OSGi, please report back to us if you see any remaining quirk when using Groovy in an OSGi container. However, there's still a known issue for the "invoke dynamic" JARs of Groovy, as neither the OSGi Gradle plugin nor the underlying bnd library have been updated to cope with the "invoke dynamic" bytecode instruction, so we'll have to wait for the releases of both before being able to get proper OSGi support in our "indy" deliverables.  

You can download those latest Groovy versions from here: [http://groovy.codehaus.org/Download](http://groovy.codehaus.org/Download)  

And here are the JIRA release notes for 2.0.1 in particular (but you'll find the notes for 1.8.7 and 1.7.11 on the download page too): [https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18599](https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18599)  

Thanks a lot for your attention, and big thanks to all those who contributed to those releases!  

Keep on groovying!