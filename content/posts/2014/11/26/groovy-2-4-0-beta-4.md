---
title: "Groovy 2.4.0-beta-4"
date: "2014-11-26T00:00:00.000+01:00"
tags: [groovy]
---

This is with great pleasure that we are announcing the release of Groovy 2.4.0-beta-4.

The highlights for this release are:

*   a rewritten JsonBuilder for improved performance in JSON generation
*   a [`@SelfType`](http://docs.groovy-lang.org/2.4.0-beta-4/html/documentation/core-traits.html#_self_types) annotation for traits
*   a new [variant of `GStringTemplateEngine`](http://docs.groovy-lang.org/2.4.0-beta-4/html/gapi/groovy/text/StreamingTemplateEngine.html) capable of handling strings larger than 64k
*   improved support for overloaded setters
*   lots of bugfixes (some of which are backported in the upcoming 2.3.8 release)
*   a new naming convention for closures

The last point is important if your project somehow relies on the name of the closure classes as it is a potential breaking change. The reason for the new scheme is detailed [here](https://jira.codehaus.org/browse/GROOVY-5351).

You can download Groovy in our download area:
[http://beta.groovy-lang.org/download.html](http://beta.groovy-lang.org/download.html)


You can consult the JIRA change log:
[http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20612](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20612)

Thanks for your feedback and contributions!

Note that we are likely to change the scope of the 2.4 to exclude macros. There’s still a lot of work and discussion to be done on that topic, making it incompatible with our target for a 2.4 release. This feature is likely to be delayed to Groovy 2.5.