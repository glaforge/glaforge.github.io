---
title: "Viewing my Groovy source files in Stackdriver's debug view"
date: 2016-10-17T17:22:55+01:00
tags:
- google-cloud
- cloud-logging
- cloud-debugger
- stackdriver
- groovy

similar:
  - "posts/2016/09/28/gcloud-informative-update-message.md"
  - "posts/2016/07/11/getting-started-with-glide-and-gaelyk-on-google-app-engine.md"
  - "posts/2018/04/16/ten-years-of-app-engine-with-a-groovy-twist.md"
---

As I was working on a demo for one of my talks at [Devoxx](https://devoxx.be/), I was encountering a bug in my [Groovy](http://www.groovy-lang.org/) code (a [Gaelyk](http://gaelyk.appspot.com/) app using [Glide](http://glide-gae.appspot.com/)). I had deployed a new version of my [App Engine](https://cloud.google.com/appengine/) app, changing some code to persist some data in the [Datastore](https://cloud.google.com/datastore/). After those changes, I saw a trace in the logs:

![](/img/sd-debug-groovy/stackdriver-stacktrace.png)

Looks like there's an error in receiveTweet.groovy on line 11. And there's a link! Although I hadn't linked the source code to the application, I was surprised to see this link. But I knew that Stackdriver is able to [pick up sources](https://cloud.google.com/debugger/docs/source-options) in different ways (from uploaded local files, from a Google code source repository, from Github or BitBucket, or with a "source capture").

And actually, clicking that link brought me to the debug view, offering me the different ways to link to or upload the source code. Conveniently, the source capture approach provided a command, using the [gcloud](https://cloud.google.com/sdk/gcloud/) CLI, to link the sources with traces:

![](/img/sd-debug-groovy/stackdriver-gcloud-capture.png)

I then launched that command in my terminal, and I was able to see the trace along with my source code afterwards in the Web console:

![](/img/sd-debug-groovy/stackdriver-code-small.png)

On the left side, I can see my Groovy source files, highlighting the offending script with the bug. In the middle column: at the bottom, the stacktrace, and at the top, the source code, with the line where the exception occurred highlighted in blue.

On the right, there's also the live debugger view! But I haven't played with it yet, but it's pretty powerful, as you can live debug a production app! Let's keep it for another post!

However, now with your Groovy hat on, you'll notice two things:

![](/img/sd-debug-groovy/stackdriver-zoom-code.png)

The Groovy source code is not nicely colored! Syntax coloring is available for languages like Java, Go, Python, JavaScript, but alas, not (yet?) for Groovy!

The other funny thing was the red message on the right as well:

![](/img/sd-debug-groovy/stackdriver-red-message.png)

Although it says only files with .java extension are supported, it was nice to see that it was still showing my Groovy source code!

## Summary

It's pretty neat to be able to associate the code and the logs directly in the web interface, to quickly spot where problems are coming from. Of course, you can go back to your IDE or text editor to find out (and ultimately that's what you'll be doing) but it's pretty handy to quickly visualize the origin of the problem and start figuring out what the problem may be.

Also, as I said, I haven't tried the live production debugger, but it's quite a killer feature in my book to be able to introspect a running app. It's not always easy to figure out some problems locally, as your emulator is not the actually running infrastructure, your tests are mocking things out but are "not like the real thing", so having the ability to dive deeper in the running system is pretty compelling!