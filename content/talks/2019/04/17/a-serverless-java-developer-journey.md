---
title: "A serverless Java developer's journey"
date: 2019-04-17T17:22:02+01:00
type: "talk"
layout: "talk"
tags:
- google-cloud
- serverless
- app-engine
- cloud-functions
- cloud-run
- java
---

Last week at the Google [Cloud Next](https://cloud.withgoogle.com/next/sf/) conference, I had the chance to speak about the Java developer's journey through the "serverless" offering of [Google Cloud Platform](https://cloud.google.com/), with my colleague Vinod Ramachandran (Product Manager on some of our serverless products):

Serverless Java in 2019 is going to be ubiquitous in your favorite cloud. Well, it's actually been 10 years since you could take advantage of Java on Google App Engine. But now you can run your apps on the brand-new Java 11 runtime. Not only servlet-based apps but also executable JARs. And what about authoring functions? Until now, you could only use Node or Python, but today, Java is the third runtime available for Google Cloud Functions. We will review the various ways you can develop your Java functions. Last but not least, thanks to serverless containers, containerized Java workloads run serverlessly, without you caring for infrastructure, scaling, or paying for idle machines. Through various demos, we will look at the many ways Java developers will be able to write, build, test, and deploy code in Java on the rich serverless offering of Google Cloud Platform.

Until fairly recently, our compute serverless products consisted only of [Google App Engine](https://cloud.google.com/appengine/) for deploying apps and services, and [Cloud Functions](https://cloud.google.com/functions/) for deploying functions. Furthermore, for the Java developer, the situation wasn't that great as Cloud Functions wasn't offering any Java support (only Node, Python and Go runtimes), and only App Engine provided a Java 8 runtime.

Fortunately, some very important announcements were made at Cloud Next:

-   First of all, in addition to the Java 8 runtime, we have launched an alpha for a brand [new App Engine Java 11 runtime](https://docs.google.com/forms/d/e/1FAIpQLSf5uE5eknJjFEmcVBI6sMitBU0QQ1LX_J7VrA_OTQabo6EEEw/viewform).
-   We introduced a [Java 8 flavor for Cloud Functions](https://docs.google.com/forms/d/e/1FAIpQLScC98jGi7CfG0n3UYlj7Xad8XScvZC8-BBOg7Pk3uSZx_2cdQ/viewform).

-   Last but not least, we launched a new product, [Cloud Run](https://cloud.google.com/run/), which allows you to run containers serverlessly, and thus any Java workload that can be containerized.

So you can develop Java functions, Java apps and Java-powered containers in a serverless fashion:

-   Scaling on demand as needed to serve incoming requests as well as down to zero when no traffic comes.
-   Paying proportionally to the usage.
-   And all of that, without having to worry with server or cluster provisioning and management.

Without further ado, let me share with you the video and the slides of this presentation:

Video recording:

{{< youtube WnhAYX1Phxw >}}

Now it's your turn! If you want to try out functions, apps, and containers in Java, here are a few pointers to get you started:

-   [Sign-up form](https://docs.google.com/forms/d/e/1FAIpQLSf5uE5eknJjFEmcVBI6sMitBU0QQ1LX_J7VrA_OTQabo6EEEw/viewform) for App Engine Java 11
-   [Sign-up form](https://docs.google.com/forms/d/e/1FAIpQLScC98jGi7CfG0n3UYlj7Xad8XScvZC8-BBOg7Pk3uSZx_2cdQ/viewform) for Cloud Functions Java 8
-   Cloud Run [documentation](https://cloud.google.com/run/)
