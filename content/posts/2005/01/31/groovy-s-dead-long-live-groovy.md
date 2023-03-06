---
title: "Groovy's dead, long live Groovy!"
date: "2005-01-31T00:00:00.000+01:00"
tags: [groovy]
---

Incredible, I've just learnt that [Groovy was dead](http://www.pyrasun.com/mike/mt/archives/2005/01/28/19.10.21/index.html), according to Mike! So I understand that's why Cédric would like to know the [final date for the burial](http://beust.com/weblog/archives/000235.html).

It's interesting to see how much pressure the [Groovy](http://groovy.codehaus.org/) project has on its little shoulders. So far, to my knowledge, I don't really see any other OSS project for which the users and the blogosphere had so many expectations. Well, back in time, 6 months ago, yeah, we could've said Groovy was somewhat a zombie, but I don't think that's true anymore, with the latest months activity. We're certainly not good at public relations these days, we've got some efforts to make on that front.

With the team, we've discussed a roadmap for the next few months, but really, it's hard to give a definitive date. We're going to release beta-10 within two weeks, then, a month later, we'll be able to play with jsr-1 (formerly known as beta-11) which will use the new parser if you activate the right flag. Then the next jsr-x versions will use only that new parser by default. I think June could be a plausible target date for Groovy 1.0 final. We'll see if that's possible with our limited resources. I think we should publish a Roadmap page on our website, so that our users know what to expect from us.

John Rose wrote an initial grammar with Antlr as a diff with a Java 1.3 grammar, and [Jeremy Rayner](http://javanicus.com/blog2/) ported it to a Java 1.5 grammar. Last week, [James Strachan](http://radio.weblogs.com/0112098/) worked on wiring this new grammar and parser into the Groovy runtime, and the progress was pretty fast. And with confidence, I can already tell you that within a month and a half, you'll be able to play with the "New Groovy". Currently, there are still a few rough edges of course, and there's still heaps of work to do, especially on the builders, on fixing the semantics of the method invocation and the scoping rules, on implementing the closures' logic coherently, but that's doable.

So really, is Groovy dead? I don't think so.