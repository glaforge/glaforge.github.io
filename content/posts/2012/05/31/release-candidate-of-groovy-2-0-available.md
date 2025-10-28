---
title: "Release candidate of Groovy 2.0 available"
date: 2012-05-31T00:00:00.000+02:00
tags: [groovy]
---

This is with great pleasure that the development team announces the release candidate of Groovy 2.0.  

For the impatient among you, you can download Groovy 2.0 RC-1 in the [download area](http://groovy.codehaus.org/Download?nc) of the Groovy website. 
And read the [JIRA changelog](https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18472).  

The big change in this release candidate is the modularity aspect. We've now fully switched to Gradle, as our build tool, to build a more modular Groovy. You still have a big "all" JAR, but if you're interested in just picking the core JAR and the needed modules for your project, you can now do so.  

The following modules, also available as Maven artifacts, have been created and extracted: `ant`, `bsf`, `console`, `docgenerator`, `groovydoc`, `groovysh`, `jms`, `json`, `jsr-223`, `servlet`, `sql`, `swing`, `templates`, `test`, `testng`, `xml`.  

Also, it's possible for you to create your own extension modules, which will provide additional methods to JDK or third-party classes, just like Groovy does with the Groovy Development Kit.  

For more information on this extension module system, please have a look at this [page](http://docs.codehaus.org/display/GROOVY/Creating+an+extension+module) explaining the details.  

We're looking forward to your feedback on this release! This is very important that you test this release within your projects to report anything, any bug or issue that you may encounter, so that we can make a great 2.0 release.  

We're particularly interested in feedback on the invoke dynamic support, the static type checking, the static compilation, as well as the new modularity of Groovy.  

Thanks a lot for your attention and precious time helping us releasing a great new milestone of the project!  

And big thanks to all those who contributed to this release!  

On behalf of the Groovy development team, we hope you'll all keep on groovy'ing :-)