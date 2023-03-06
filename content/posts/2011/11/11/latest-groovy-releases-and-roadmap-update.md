---
title: "Latest Groovy releases and roadmap updates"
date: "2011-11-11T00:00:00.000+01:00"
tags: [groovy]
---

On [this post on the Groovy website](http://docs.codehaus.org/pages/viewpage.action?pageId=227053189), we've announced the releases of Groovy 1.8.4 and the first beta of 2.0, as well as cover some updates on the roadmap.  
In a nutshell, the big highlights are the static type checking support and invoke dynamic support. We're also going to investigate whether it makes sense to also cover static compilation. And we've also announced a new version numbering scheme, to move Groovy forward.  
Here's what the announcement said:

> It is with great pleasure that we are announcing another joint release today!  
>   
> We have **released Groovy 1.8.4**, that includes fixes and minor improvements to correct problems the Grails web framework and the Gradle build automation tool were having with 1.8.3.  
>   
> In addition, we are also pleased to announce the **release of Groovy 2.0-beta-1!** **Groovy's updated version numbering scheme**  Yes, you heard it, a Groovy 2.0 beta! But what's going on, weren't we working on the 1.9 line? Yes, we were, but with the substantial number of new features coming up in the 1.9 release, we thought it was time to start using an updated numbering scheme.   
> Historically, Groovy's "major" versions have always been "dot" versions, which is a bit uncommon in our industry, in the sense that major versions are expected to have a new major digit each time. So the Groovy version numbering scheme has always been a bit odd for strangers and newcomers -- furthermore, from a marketing perspective, if we ever decide to release a 1.10 version, it would be lexicographically backward (1.10 < 1.9 in math)! This isn't the first time a major change in version numbers has happened: Groovy went from 1.1 to 1.5 and recently Grails changed from 1.4 to 2.0 for its next major release.  
>   
> So instead of speaking of the mythical "2.0" version of Groovy that never seems to arrive, this next major release will be 2.0. For further versions, we'll probably release some 2.x versions as well, but we will also adopt the same strategy regarding major version numbers, releasing a major version more or less every year. Thus, given **2.0 final should be out in early 2012**, the following major version will be released afterwards in 2013 and will become 3.0. But don't worry, we won't adopt the lightning fast numbering schemes of Google Chrome or Mozilla Firefox!  
>   
> **So what will be inside 2.0 that makes it so special?** **Static type checking** We have been working on the **static type checking support for Groovy**.  
>   
> On several occasions, we have noticed that Groovy was used in Java projects as a simple yet powerful scripting language for Java APIs, in ways that don't particularly leverage the dynamic aspects of the language but instead as a better syntax for Java somehow. With this approach, developers often prefer a stricter approach to type checking, in the sense it should complain when you have typos in your method names, parameters or variables or when you make invalid assignments, etc. The compiler should complain at compile time, rather than having Groovy complain at execution time later on, thus giving you earlier feedback about those errors — particularly useful when you are using APIs that may change.  
>   
> Static type checking has already been discussed on a few threads on the Groovy mailing-lists, and we appreciate your feedback on how it's being implemented, how it should behave, and so on. Please don't hesitate to come back to us with your thoughts and ideas on this topic.  
>   
> We have also created a GEP (Groovy Extension Proposal) covering this new aspect:  
> [http://docs.codehaus.org/display/GroovyJSR/GEP+8+-+Static+type+checking](http://docs.codehaus.org/display/GroovyJSR/GEP+8+-+Static+type+checking) And Cédric, who joined Jochen and myself at SpringSource/VMware and who's been working on this feature, wrote a very nice and detailed blog post about the current work-in-progress here:[http://www.jroller.com/melix/entry/groovy\_static\_type\_checker\_status](http://www.jroller.com/melix/entry/groovy_static_type_checker_status)   
> Be sure to read those two documents, as they will guide you through some interesting samples showing how you can get started using static type checking with Groovy 2.0.0-beta-1! Please also note that this is still in beta, and that APIs are subject to change and evolve depending on your feedback.  
>   
> **Static compilation** With static type checking, type inference capabilities, sensitive flow typing, and so on, the Groovy compiler is now way smarter in figuring out what your code is actually doing. In the case of scripting Java APIs that we mentioned above, we could let the compiler generate direct method calls à la Java, instead of going through Groovy's Meta-Object Protocol, allowing **the same performance as Java**!  
> We're going to investigate **static compilation** in 2.0, leveraging the new smarts of the compiler and its infrastructure, by creating a new git branch with initial support that you'll be able to monitor to watch our progress on that front.  
>   
> **But what about Groovy++?** Thanks to the great work of Alex Tkachman and Roshan Dawrani, the Groovy++ extension project definitely inspired us and ended up convincing us that it was important to support static type checking and compilation in Groovy.  
>   
> We couldn't simply integrate Groovy++ directly in Groovy 2.0, as it differed in spirit from our ideas for Groovy core, for example by covering more ground than we wanted and needed (persistent collections, new operators, traits, new map-style classes, etc.). We also wanted to evolve the Groovy compiler infrastructure so that it fits nicely with the primitive optimizations work, static type checking and compilation, as well as invoke dynamic support, and we would have needed to refactor Groovy++ heavily for our needs. That said, we of course would welcome collaboration with the Groovy++ team to learn from their experiences building Groovy++.  
>   
> We engaged the community to discuss various aspects of static type checking and inference so as to make it closer to the usual Groovy semantics as much as possible, without introducing new data structures or restricting existing features (like closures with non-final variables), so that Groovy developers feel at ease with static type checking and compilation, and are the least impacted by differences in semantics between this additional mode and the classical dynamic mode.  
>   
> **Invoke dynamic support** Lastly, we've started working on **"invoke dynamic" support**, the new JVM bytecode instruction and APIs of JDK 7 developed for dynamic languages, with the goal of **improving the performance of all the dynamic aspects of Groovy in significant ways**. This is still early days, and this first beta of 2.0 doesn't yet contain particular changes that you'd notice. We are working on the "indy" branch of Git (and mirrored on GitHub) for that support.  
>   
> **And beyond 2.0?** With static type checking and compilation, as well as invoke dynamic support, we thought that it was really worth a Groovy 2.0 moniker! But what's next?  
>   
> Among the things we want to tackle for 2.x / 3.0 and beyond, we're interested in **moving the Groovy grammar from Antlr 2.x to a newer version**. Antlr 3 has been available for a while, but our summer attempt at migrating to it haven't been fruitful so far. But we will investigate this move once 2.0 is out, and decide if we go with Antlr 3 or Antlr 4 which should be available when we want to release 3.0.  
>   
> In the past, we've mentioned several times a redesigned Meta-Object Protocol (MOP 2). With the lessons learned in the invoke dynamic support of Groovy 2.0 and with the ironing out of the invoke dynamic performance of the JIT, we should be able to have a better vision of how to rearchitect the MOP so that it fully takes advantage of invoke dynamic, for **faster dynamic features**.  
>   
> There are many other things we'd like to have a look at, but it's still a bit too early to tell what's going to be in Groovy 3 and beyond, as of today. We have time to see what's interesting to add to Groovy to **continue helping you being more productive developers**, and we will continue to **welcome and appreciate your feedback** and what you'd like to have in Groovy in the future to **simplify your life**.  
> **Groovy is what it is today thanks to your ideas and contributions!** **Important links** You can view the changelog on JIRA for the details:
> 
> *   Groovy 1.8.4:
> [http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=17852](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=17852)
> 
> *   Groovy 2.0 beta 1:
> [http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=17925](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=17925)
> 
> And you can download the new releases from the usual download area on the Groovy website:  
> [http://groovy.codehaus.org/Download?nc](http://groovy.codehaus.org/Download?nc) Thanks a lot to everybody involved, and we're looking forward to your feedback!  
>   
> The Groovy development team