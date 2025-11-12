---
title: "Groovy 1.8.2 and 1.9-beta-3 are in the wild"
date: 2011-09-05T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2012/09/10/groovy-2-0-2-and-1-8-8.md"
  - "posts/2013/09/06/second-beta-for-groovy-2-2.md"
  - "posts/2011/10/12/groovy-1-8-3-and-1-9-beta-4-released.md"
---

This is with great pleasure that the Groovy development team announces the joint releases of Groovy 1.8.2 and 1.9-beta-3. The big highlight of this release is the completion of the primitive type arithmetics performance optimizations. Microbenchmarks affictionados should be happy, and those wanting to do some number crunching should see better results with these improvements. Other than that, those two releases are essentially about bug fixes.  

You can have a look at the release notes here: [http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=17494](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=17494)  

And you can download Groovy 1.8.2 and 1.9-beta-3 on the download page: [http://groovy.codehaus.org/Download](http://groovy.codehaus.org/Download)  

In other news, thanks to Git expert [Matthew McCullough](http://ambientideas.com/), we completed our complex migration to Git. You can learn about the details to access and clone the Git repo here: [http://xircles.codehaus.org/projects/groovy/repo/git/repo](http://xircles.codehaus.org/projects/groovy/repo/git/repo) Later on, we'll also provide a mirror on GitHub.  

Small remark on the new beta of the 1.9 branch: due to a glitch a beta-2 was accidentally released in sync'ed with Maven Central, so we bumped the beta number to 3, rather than sticking with 2, as Central won't allow us to override an existing version.  

Thank you everybody for your feedback and contributions to those two releases.