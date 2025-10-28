---
title: "We've just released Groovy RC-1!"
date: 2006-12-04T00:00:00.000+01:00
tags: [groovy]
---

This is with great pleasure that I'm announcing the release of the first release candidate of Groovy. Groovy RC-1 is a very important milestone in the life of the project. It also means 1.0 will be released very shortly thereafter. The plan is to release the final version before the end of the month.

This release contains a re-implemented and reworked Meta-Object Protocol, which is the core of Groovy's runtime system which decides how the dispatch of method calls, property and attribute access works. This new MOP brings more flexibility and a finer-grained control of those mechanisms. But unless you need tweaking that advanced dispatching logic, those changes won't affect you.

Groovy RC-1 contains a lot of bug fixes and improvements -- about a hundred have been worked out in this release. Among the interesting improvements, you'll note that coercion mechanisms are improved and now customizable for your own POGOs through the asType(Class) method. You can even coerce Maps to interfaces, as well as Closures to single-method interfaces. The 'in' keyword now becomes a fully supported boolean operator, not only in the for loop. Last but not least in the dynamicity of the language, you can decide which method to call with GStrings, like in: foo."$methdName"(\*args).

So far, the old closure notation with the vertical pipe was still allowed, and the @Property syntax was silently ignored in the latest release. Now that the transition period is over, in RC-1 both are definitely illegal. I hope you will all have already updated your codebase.

For a mode detailed list of the bug fixes and improvements, please refer to [JIRA](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&styleName=Html&version=12104). You can download Groovy RC-1 at the [usual place](http://dist.groovy.codehaus.org/distributions/?C=M;O=D).

Thanks goes to all the team for its efforts, and particularly Jochen Theodorou for his hard work. Big bravos to John Wilson for the XML support and the MOP, Guillaume Alléon for patches and Groovy SOAP, Dierk Koenig and it co-authors for the great Groovy in Action book, and the Eclipse plugin team as well. And also thanks to the brand new commiters who are bringing some fresh blood to the team, for instance Paul King who helped us improve some important error messages! The list is too long to name everybody!

Happy Groovying!