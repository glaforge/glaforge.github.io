---
title: "Ten years of App Engine with a Groovy twist"
date: 2018-04-16T17:29:24+01:00
tags:
- google-cloud
- app-engine
- groovy
---

The venerable Google [App Engine](https://cloud.google.com/appengine/) platform celebrated its [10th anniversary](https://cloudplatform.googleblog.com/2018/04/reflecting-on-our-ten-year-App-Engine-journey.html)!

Back in 2008, it started with Python, as its first runtime, but I got way more interested in App Engine when the Java runtime would launch the following year. It's a bit of a special story for me, as I've always been a fan of App Engine, since the beginning.

Over the years, I've built several apps running on App Engine. For instance, this blog you're reading now is running on App Engine, as well as my personal picture / video sharing app, some Github post-commit webhook for the [Apache Groovy](http://www.groovy-lang.org/) project, or the [Groovy Web Console](http://groovyconsole.appspot.com/) to share / edit / run Groovy scripts in the cloud.

App Engine is my go-to platform for deploying and running my ideas in the cloud!

I like to focus on the idea I want to implement, rather than thinking upfront about infrastructure, provisioning, ops, etc. App Engine was the pioneer in PaaS (Platform-as-a-Service) and the new trendy [Serverless](https://cloud.google.com/serverless/) approach.

Although I've ranted back in the day about the pricing changes ([once]({{< ref "/posts/2011/09/01/google-app-engine-s-new-pricing-model" >}}) and [twice]({{< ref "/posts/2011/11/25/coming-back-to-the-new-google-app-engine-pricing-policy" >}})), it lead me to optimize my own apps and code. But ultimately, most of my apps run within the [free tier](https://cloud.google.com/free/) of App Engine. The "pay-as-you-go" approach is appealing: for my apps, it's been pretty much free for my use, except on those few occasions where I had big peaks of traffic and users, and then, i only had to spend a few dollars to cope with the load, but I didn't even have to think about dealing with infrastructure, as App Engine was transparently scaling my apps itself, without any intervention on my part.

![](/img/misc/google-app-engine-groovy.png)

But let's step back a little and let me tell you more about my story with App Engine. In 2009, thanks to my friend Dick Wall, I was contacted by Google, signed an NDA, and worked with the engineering team who was responsible for the upcoming Java runtime. As the engineering team was working on its launch, they wanted to ensure that alternative languages like [Apache Groovy](http://www.groovy-lang.org/) would run well on the platform. So we worked hand in hand, patching Groovy to be more compliant with App Engine's sandboxing mechanism (which is now lifted, as past limitations are now gone in the newer runtimes.)

Thanks to this work on the Groovy and App Engine integration, I got the chance to present at Google I/O 2009 about running Groovy and Grails on App Engine!

{{< youtube NEnniZTdOYk >}}

And as I worked on the integration, I quickly found nice handy shortcuts thanks to the flexible nature of Groovy, and I arranged those shortcuts into a reusable library: the [Gaelyk](http://gaelyk.appspot.com/) framework.

Max Ross, Toby Reyelts, Don Scwhartz, Dick Wall, Patrick Chanezon, Christian Schalk, and later on, Ludovic Champenois, Éamonn McManus, Roberto Chinnici, and many others, I'd like to say thank you, congratulations, and happy anniversary for this lovely platform!

It's an honor for me today to [work for Google Cloud Platform]({{< ref "/posts/2016/06/02/joining-google-as-a-developer-advocate-for-the-google-cloud-platform" >}}) (almost 2 years already!), and to use the awesome serverless products available, and I'm looking forward to covering the [serverless](https://cloud.google.com/serverless/) area even more!