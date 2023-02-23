---
title: "Testing Java 8 Snippets on the new App Engine Java 8 runtime"
date: 2017-03-24T11:57:41+01:00
tags:
- java
- groovy
- google-cloud
- app-engine
---

A new Java 8 runtime for [Google App Engine standard](https://cloud.google.com/appengine/docs/standard/) is coming soon, and is currently in alpha testing. You can [request to join](https://docs.google.com/a/google.com/forms/d/1MDzykTWp77YzRgFs5R6ONOuKWYnKEhfy5VhSJYbDvmo/viewform?edit_requested=true) the alpha program, if you want to try it out for yourself. But I wanted to let anyone play with it, easily, to see how well the Java 8 APIs work, but also to try some Java 8 syntax too. So here's a [web console](https://cafe-huitre.appspot.com/) where you can do just that!

[![](/img/j8snip/groovy-web-console-java8.png)](https://cafe-huitre.appspot.com/)

But to be precise, it's actually my good old [Groovy Web Console](http://groovyconsole.appspot.com/), where people can write, execute and save [Apache Groovy](http://www.groovy-lang.org/) snippets. It is a special version, in fact, as it's built on Java 8, uses the invoke dynamic flavor, and... drum roll... it's using the upcoming "Parrot" parser which adds the Java 8 syntax constructs to the Groovy grammar. So not only can you try Java snippets, but it's a great opportunity to try the future Groovy parser that's gonna be released in Apache Groovy 2.5 or 3.0 (still to be decided).

A meetup about Java 8 on Google App Engine standard

Also, for those who live in Paris and the area, we have the chance of having [Ludovic Champenois](https://twitter.com/ludoch), an engineer working on App Engine, that will be in France, and will be speaking at this [GDG Cloud meetup hosted by Xebia](https://www.meetup.com/fr-FR/GDG-Cloud-Paris/events/238519360/?rv=ea1&_af=event&_af_eid=238519360&https=on), which takes places on Tuesday, April 4th, just on the even of Devoxx France!

So if you want to learn more about Java 8 on App Engine, please [sign up](https://www.meetup.com/fr-FR/GDG-Cloud-Paris/events/238519360/?rv=ea1&_af=event&_af_eid=238519360&https=on)!

I will also be presenting about [Google Home](https://madeby.google.com/home/), the [Google Assistant](https://assistant.google.com/), [API.AI](https://api.ai/), and Google [Cloud Functions](https://cloud.google.com/functions/) to host the logic of your very own bots and agents. It's based on the [presentation I gave at Cloud Next](http://glaforge.appspot.com/article/extending-the-google-assistant-with-actions-on-google) 2017 in San Francisco. If you want to learn more about

[![](/img/j8snip/gae-home-cf-xebia.png)](https://www.meetup.com/fr-FR/GDG-Cloud-Paris/events/238519360/?rv=ea1&_af=event&_af_eid=238519360&https=on)