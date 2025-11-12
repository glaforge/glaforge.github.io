---
title: "Second beta for Groovy 2.3"
date: 2014-04-10T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2014/04/04/a-beta-release-for-groovy-2-3.md"
  - "posts/2014/07/08/groovy-2-3-4-is-out.md"
  - "posts/2014/09/02/beta-3-for-groovy-2-4.md"
---

Hot on the heels of our first beta for Groovy 2.3, here's already a second one!  

We've received a lot of feedback, which is really awesome! Thanks a lot to all those who put the first beta to its pace and reported their findings.  

The most important change in this release is that the groovy.jar no longer depends on ASM and Antlr.  
  
It's the first release ever of Groovy where the `groovy.jar` itself is _jajar-ed_ like the `groovy-all` JAR, which means that the ASM and Antlr libraries are embeded (and translated to a different package) so that you don't need to depend on those libraries in your projects, and run the risk of a version clash with other frameworks or libraries depending on differing versions.  

It's an important step for those who wish to have smaller JARs, and who don't want the whole libraries offered by Groovy, but who want to pick up just the components they are interested in.  

Please report any problem you might find, in case you're using groovy.jar instead of groovy-all.jar.  

Apart from that, several issues have been fixed, regarding traits, generics handling, a problem when running Groovy on Google App Engine.  

There is a minor breaking change with regards to whitespace handling in our XML support.  

You can check the JIRA release notes to see the issues fixed:  
[http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20226](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20226)  

And head to our download area to get the latest and hottest beta: [http://groovy.codehaus.org/Download?nc](http://groovy.codehaus.org/Download?nc)  

If you're using Gradle or Maven, we noticed some issues with our deployment process which made the groovy-all.jar lacking a pom.xml file on Central and JCenter. We're working on solving that issue with the JFrog team and we will let you know when it's fixed.  

Keep up the feedback coming!