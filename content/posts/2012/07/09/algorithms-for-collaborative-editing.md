---
title: "Algorithms for collaborative editing"
date: 2012-07-09T00:00:00.000+02:00
tags: [geek]
---

Over the weekend, I was brainstorming some ideas about what a second generation [Groovy Web Console](http://groovyconsole.appspot.com/) could look like. I was particularly thinking about collaborative editing Groovy snippets of code in the cloud.  

There's a trend towards IDEs in the Cloud, like for instance [Cloud-IDE](http://cloud-ide.com/), allowing you to work on your projects remotely, on the cloud, from the comfort of your browser, even letting you push new versions of your apps in your favorite PaaS.  

And just a few days ago, another interesting project in this field was open-sourced: [Collide](http://code.google.com/p/collide/). It's a collaborative IDE running on [Vert.x](http://vertx.io/), using the [Operational Transform](http://en.wikipedia.org/wiki/Operational_transformation) approach popularized by the defunct Google Wave project whose remains are [incubating at Apache](http://incubator.apache.org/wave/). Funnily, it's yet again the remains of some internal project from Google that got axed as [explained on Google+](https://plus.google.com/u/0/114130972232398734985/posts/82BktQAKzcN).  

As I was interested in the topic, I wanted to learn a bit more about the technologies and algorithms behind that. That's why I wanted to post here my findings, in case someone's interested and for future reference shall I dive deeper into that matter! I'm not covering the details of each algorithm, but instead, I'm giving links that you can harvest for further information.  

When working collaboratively on the same document, instead of sending the whole document with your changes to the other collaborators, you usually just send differences through the wire. Probably the most used [diff algorithm](http://en.wikipedia.org/wiki/Diff) is the [one from Eugene Myers](http://www.xmailserver.org/diff2.pdf).  

Using the diff approach, techniques like [differential synchronization](http://neil.fraser.name/writing/sync/) using [diff / match / patch](http://code.google.com/p/google-diff-match-patch/) are interesting (it's using the diff algorithm from Myers above). Neil Fraser (from Google again) gives some more [details on the approach](http://neil.fraser.name/writing/sync/).  

So let's continue our journey with [Operational Transformations](http://en.wikipedia.org/wiki/Operational_transformation), called OT for short. As I said earlier, it's been used in Google Wave. Basically, each client connected to a common document send units of changes like an insertion of (some) character(s), or a deletion. Because of latency between the time you receive the difference and the moment you've made some changes locally, you need to transform the change you've received so it can still be applied to your own copy of the document.  

In order to know in which order a particular change happened before the other (so that you can apply the changes as they should), there are also specific algorithms. For one, [Lamport timestamps](http://en.wikipedia.org/wiki/Lamport_timestamps) can be used to keep track of that precedence or causality property.  

But you might more likely have heard of [vector clocks](http://en.wikipedia.org/wiki/Vector_clock) to maintain that happen-before relation between events, as this algorithm is often used by the various NoSQL datastores forconsistency purpose. I found an implementation of [vector clocks in voldemort](http://code.google.com/p/project-voldemort/source/browse/trunk/src/java/voldemort/versioning/VectorClock.java?r=170), as well as in this [Google code project](https://code.google.com/p/tud-in4150-fp-ass2b/source/browse/trunk/src/in4150/mutex/VectorClock.java). There's also a brief article on the [superiority of vector clocks over Lamport timestamps](http://skipperkongen.dk/2011/07/26/vector-clocks-vs-lamport-timestamps/) as they give more information about the precedence.  

Last but not least, it seems that another approach is even more interesting: interval tree clocks (for which I've found a [small library here](http://code.google.com/p/itc4j/) implementing it). Vector clocks are great but seem to need more memory to hold the state and don't accomodate too well when the number of participants is changing, and interval tree clocks seem to address that problem.  

The journey ends here with those few links to different algorithms and code samples. Perhaps I'll explore more an approach or the other later on if time permits. Happy reading! 

Don't hesitate to share your own experience, links, corrections, etc, in the comments below.