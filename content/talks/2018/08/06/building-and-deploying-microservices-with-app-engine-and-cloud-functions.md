---
title: "Building and deploying microservices with App Engine and Cloud Functions"
date: 2018-08-06T22:46:46+01:00
type: "talk"
layout: "talk"
tags:
- google-cloud
- microservices
- serverless
- app-engine
- cloud-functions
---

A coupe weeks ago, I had the chance to talk at [Cloud Next](https://cloud.withgoogle.com/next18/sf/) 2018, in San Francisco, with my colleague and friend [Alexis](https://twitter.com/alexismp). We talked about building and deploying microservices with Google App Engine and Cloud Functions. I've been a big fan of App Engine since 2009 when Google released the Java flavor, and have been enjoying doing a bit of Node / JavaScript on Cloud Functions since it came in beta. So I was very happy to be able to talk about those two serverless solutions.

Without further ado, let's start by sharing the video (and slides) of the talk!

{{< youtube oALEthV9z_U >}}

Now that I've shared the video, let me tell you a bit more about this session and the demo we built.

![](/img/microservices-with-ae-cf/gae-gcf-01.png)

First, a few words about the buzzword du jour: serverless. What I particularly like about this approach (which I also liked in the good old times of another old buzzword: PaaS) is how it lets me focus on the idea I want to implement, instead of being bothered from the get go with server or cluster provisioning, OS choice, monitoring/logging/alerting, etc. I can directly start coding something, and quickly deploy my app or function in the cloud and see how well it's working (compared to my dreamed up idea). Additionally, besides the ops-less aspect, I also don't have to think about scaling, as it scales pretty much auto-magically for me. Last but not least, I don't have to pay upfront big costs for renting machines or vms, as it's really pay as you go, and not paying for an idle server (after all, my idea might be just a quick idea not geared towards prime-time success!)

![](/img/microservices-with-ae-cf/gae-gcf-02.png)

Google Cloud Platform offers various solutions which follow those characteristics, not only for compute with App Engine and Cloud Functions, but also for data storage (like Datastore which I'm using in my demo as my database), or the machine learning APIs (like the Vision API that I also integrated in my app). Database-as-a-Service, Platform-as-a-Service, Function-as-a-Service, Software-as-a-Service often fall into that category for me, if you don't pay for infrastructure, when it takes care of scaling, and if it's price proportionally to your usage.

## Cloud Functions

Cloud Functions (or GCF for short) is a great fit for event driven problems: a new picture is stored on Google Cloud Storage? A function is triggered. I get a message on Pub/Sub? Another function is invoked. It's also possible to invoke a function directly via an HTTP call, without requiring any kind of gateway to expose it.

At Next, the general availability of Cloud Functions was announced, with an SLA of 99.5%, additional regions (2 in the US, 1 in Europe, 1 in APAC), and also new runtimes with Node.js 8 and Python 3.7. Further improvements are the ability to get a function hooked to a VPN in order to connect your functions with your VMs, new scaling controls to limit the number of instances serving your function, a direction connection to Cloud SQL to take advantage of GCP's great network instead of going through the wider public Internet, and the availability of environment variables to customize your deployments for example to tackle different environments like dev vs staging vs prod.

## App Engine

As I said, I've always been a big fan of App Engine, long before I actually joined Google. This blog you're reading has been running on App Engine Java for many years! GAE (for short) is really a great fit for hosting web frontends or backend APIs, which are generally more long-lived that functions.

With Java 8 in GA last year, Node.js 8 in beta, new runtimes are also coming up: Python 3.7 and PHP 7.2. With the recently released new [instance scheduler](https://cloudplatform.googleblog.com/2018/05/Increase-performance-while-reducing-costs-with-the-new-App-Engine-scheduler.html), you have more control on your scaling which allows you to scale faster and have lower costs too. Deployments of new versions should also be faster with better caching and diff'ing between versions.

During the hallway session, I had a nice conversation with an attendee who was pretty happy with the fact he'd be able to have Python 3.7 for both Cloud Functions and App Engine, which will allow them to have a chance to share some code between projects.

The new runtimes are running on the [gVisor sandbox container runtime](https://cloudplatform.googleblog.com/2018/05/Open-sourcing-gVisor-a-sandboxed-container-runtime.html) technology, a lightweight solution to isolate containers securely to run your payloads. A big advantage of gVisor is that App Engine runtimes are not limited anymore with things like the class whitelist which prevented usage of some particular classes.

![](/img/microservices-with-ae-cf/gae-gcf-03.png)

Back to the topic of microservices, App Engine has this concept of services. In your GCP project, your GAE application can run several services at the same time, potentially with different runtimes (for example a Java service and a Go service), and those services can be deployed with different versions.

![](/img/microservices-with-ae-cf/gae-gcf-04.png)

Last thing I'll mention here for App Engine, that's the traffic splitting capability. You can easily split traffic (on the command-line or in the web UI) between different versions of a particular service. So for example if you want to do some A/B testing to see if users prefer the new feature or layout of your app, you can say that only 5% of incoming requests will be showing it, whereas the 95% of your users will continue to see the old version. This is also useful for canary deployments or blue / green deployments.

![](/img/microservices-with-ae-cf/gae-gcf-05.png)

For my demo, I developed a simple picture sharing app. My web frontend is a Vue.js + App Engine Java backend using the SparkJava light framework. When a user takes a picture, it's uploaded to Google Cloud Storage, which triggers a Cloud Function which will store picture metadata in Datastore, and calls the Vision API to get the labels of things found in the picture, as well as check if the picture can be safely published (no racy, adult, spoof, violent content in it), and gives the dominant color in the image. Another function is triggered on at regular intervals to compute the most frequent tags (stored in Datastore), so a snapshot of them can be displayed in the dedicate page of the app.

![](/img/microservices-with-ae-cf/gae-gcf-06.png)

## Scaling down...

Getting to scale down towards our talk conclusion, we also shared a few words about the upcoming serverless containers for Cloud Functions, which we unveiled at the conference and on the GCP [blog post](https://cloudplatform.googleblog.com/2018/07/bringing-the-best-of-serverless-to-you.html). For serverless compute, you can deploy functions and apps, but we're seeing units of compute in the form of containers as well, and sometimes your project might need specific native libraries or particular compute abilities (like GPUs), or you simply want more control over your business logic's environments. So it makes sense to let you serve containers as well, in addition to functions and apps. If you're interested in trying out serverless containers, feel free to request access to the EAP program via [g.co/serverlesscontainers](http://g.co/serverlesscontainers).