---
title: "Re: How Groovy can get her groove back"
date: "2005-01-31T02:00:00.000+01:00"
tags: [groovy]
---

I think [Angsuman](http://blog.taragana.com/index.php?p=146) diserve an answer.

> It looks like Groovy is in dire needs of a project manager.

We've got one already. Of course, he's been pretty busy with his [Active\*](http://protique.com/) projects lately, but I think now he's really back on the project. It's often hard to cope with both a demanding job, and a demanding Open Source project. It's tough to find time for both. Fortunately, he's not alone on the Groovy project. While he was too busy, I took the interim and maintained Groovy and managed to deliver a few successful betas with a lot of bug fixes. But that's just the tip of the iceberg. In November, with Jeremy, we organized a JSR meeting, and I've recruited a few new commiters to help us solidify our groovy-core base, so that it is able to receive the upcoming new parser. And the JSR work and discussions never stopped.

> One of the basic things we all learned along the way is that software is not about perfection. It is about delivering a good enough rock solid product on time. There is always version 2 to add more features. Nobody expects version 1 to be the ultimate solution.

Often people mix OSS projects and IT projects. I don't think they are the same. The constraints aren't the same. For IT projects, you pay for something, so you oughta get back something you paid for in a reasonable timeframe, but in OSS-land, when the developers are just working in their spare time, besides their day job, how can you be so demanding? So far, I've spent both time and money in Groovy, and I don't have anything back! Except, of course, the pleasure to have a few delighted users thank me for our awesome project.

What we want in Groovy 1.0 is to solidify the basic core features of Groovy, which have been there early in the project life. And contrary to what most persons think, we haven't added any significant new feature in the language for more than 6 months! We're finally standardizing the meaning of language constructs we never really took the time to implement correctly and propertly in a coherent manner (like the semantics of continue/break/return inside a closure).

The scope of the project is the same as it was several months ago. In our implementation there's just room for extensibility. Like supporting Java 5 annotations with the help of the Java 5 grammar we've based the new parser upon, or adding a new operator (.@) to help us diminsh the level of ambiguity in the scoping rules.

> In today world people have come to expect stable beta (remember JDOM betas?), unlike what James comments in Spille blog. If the build is to be highly unstable then it should probably be in alpha stages. Beta stages are all about refinement and limiting feature set to get a release.

We made mistakes in our numbering scheme, that's granted. We should have started with 0.1, 0.2, 0.x, then get to a 1.0-beta-x, and finally perhaps some 1.0-RC-x, before delivering groovy-final-1.0. We're trying to fix that by changing slightly our tags: there will be a new beta soon (beta-10 within two weeks), and the few next milestones will be tagged jsr-x and will include the new parser. And after that, we should probably release Groovy 1.0 before the end of Q2. I won't give you a firm and definitive target date, it's simply impossible, because we're not an IT project, and we can't know what could happen to any of us (a new demanding job, a baby, whatever...)

In IT-land, there are four variable you can play with: scope, cost, time and quality:

*   The scope hasn't changed for months, and we want to keep the features which had already been there since day one, otherwise, why use Groovy if Groovy has just got the same features as BeanShell or Jython?
*   The cost is just our spare time and limited number of developers, and we can't really tweak that variable, since it depends a lot on our day jobs, family, and personal constraints, (even though we recruited a few new commiters who help us solidify the base)
*   The quality mustn't be compromised,
*   The time variable is the only one we can play with to improve the quality.

> Even Open Source projects are not immune to this paradigm, specially for a project which have garnered so much interest.

We've garnered a lot of interest. An incredible amount. And I'm glad about that. I hope we won't dissapoint anyone, or at least that just a few will be upset by our decisions. I wonder whether other OSS projects have had that much pressure on developers' shoulders. Could you name even one? Expectations are very high regarding Groovy.

> I think the theme which comes out of these discussions is that Groovy project leads needs to fix a reasonable date of release 1 and stick to it making compromises along the way. And it needs help.

We're going to deliver Groovy with the original scope James envisionned. Not much more, not much less. We're focusing on the core functionnalities. We've already wired the new parser in CVS Head within just a few days of work, and the progress was amazingly quick to show up. We're going to ship it perhaps in the next beta (beta-10) if we delay the beta for one or two weeks, or we'll ship it at the end of February. We need to settle on the best date for a first warm-up of the parser.

We've also started sketching our [roadmap](http://groovy.codehaus.org/Roadmap) more accurately to offer more visibility to our beloved users and community.

> Guillaume commented on the pressure on the Groovy’s developers. That is true. However for an Open Source project which has garnered so much interest, press and enthusiasm all around it is to be expected. That the price for fame :)

Oh really, am I becoming famous? :-) Ah, no... only the project! Well, I've never worked on Groovy to become famous anyway. I wanted the right tool for the job. I got involved into Groovy because I needed a scripting language for the JVM, to allow us to write some dynamic logic, business rules, modifyable at runtime, without the hassle of re-deploying software everytime, just because some business logic changed in the course of time. Groovy's going to bring agility in your projects, and will be a real time saver for your shell scripting needs, wiring platform specific capabilities (like with [Scriptom](http://groovy.codehaus.org/COM+Scripting)) and the vast wealth of available java components and libraries.

Groovy is the right tool for agility business.