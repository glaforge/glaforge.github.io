---
title: "Groovy 1.5.5 released: compiler 3-5x faster"
date: 2008-04-14T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2008/05/03/groovy-1-6-beta-1-release-with-great-performance-improvements.md"
  - "posts/2007/12/07/groovy-1-5-released.md"
  - "posts/2008/10/09/both-groovy-1-5-7-and-1-6-beta-2-are-out.md"
---

[G2One, Inc.](http://www.g2one.com/) and the Groovy development team are pleased to announce the release of **Groovy 1.5.5**, a bug fix release of the 1.5.x stable branch.

Beyond all the [bug fixes and consistency improvements](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&styleName=Html&version=14028), the major aspect of this release is certainly the improvements in compilation speed. As part of our **ongoing efforts to improve the performance of Groovy**, we have worked hard on compilation speed, and we backported those improvements from the upcoming Groovy 1.6, to ensure that all users using stable versions of Groovy can benefit from these performance increases. The **Groovyc compiler should now be from 3 to 5 times faster**, which will make big Groovy / Java and Grails projects much snappier to compile.

A first beta of the upcoming Groovy 1.6 will follow in the coming weeks, and the team focus is still on performance improvements. Groovy 1.6 contains this enhanced compiler, but also brings runtime improvements in many areas, including on number arithmetics where Groovy was known to be slow.

Go [download Groovy 1.5.5](http://groovy.codehaus.org/Download) and read the [changelog](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&styleName=Html&version=14028) for more details on the release.