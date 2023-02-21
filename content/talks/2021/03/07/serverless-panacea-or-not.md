---
title: "Serverless Panacea or Not"
date: 2021-03-07T22:36:12+01:00
type: "talk"
layout: "talk"
tags:
- serverless
---

At [DevDay Belgium](https://www.devday.be/Sessions/Details/94?slug=the-serverless-panacea-or-not), a few months ago, I had the pleasure to give a keynote on the theme of "serverless". Let me share with you this talk today!

**The Serverless Panacea... Or Not?**

> The term "serverless" has become a trendy buzzword: if you don't have the checkbox ticked, you're not cool anymore. Really?
>
> Spoiler alert: There may be servers involved in serverless solutions. It's not just about function-as-a-service. And it's actually more complicated than it may seem!
>
> But first, let's come back to the basics: what is serverless exactly, where does it come from, what are its characteristics? Then, beyond the definition, we'll discuss the challenges, and the risks associated with serverless architectures. Eventually, going further, we'll think about where serverless is heading in the near future.

You can find the slides below:

{{< speakerdeck cb3b04200d7b4b94a0b22dfd9a401d0a >}}

And you can find the video below. Further down, I'll detail each slide of my keynote:

{{< youtube id="EkE3UfzVO8o" t="4294s" >}}

Today, I'd like to tell you about Serverless.
As a Developer Advocate, for Google Cloud, that's products and the topic I'm focusing on.
Serverless is a big buzzword of the day, but is it a real panacea or not?

Like Obelix, I fell into the magic serverless potion a long time ago...
I started playing with Google App Engine Java in 2009, even before it was officially announced by Google at the Google I/O conference.
Google team reached out to me, to work together in stealth mode, to ensure that alternative JVM languages would run fine on their upcoming Java flavor for App Engine (I'm the co-founder of the Groovy language)

I couldn't imagine then that I'd be starting to work for Google 7 years later. And that I would focus on those serverless solutions!
It was still called Platform-as-a-Service, as the term "serverless" wasn't invented yet (although they are pretty similar)
And I've been a big fan and big user of App Engine ever since.

After this brief personal story with Obelix and Google, let's actually start with a little bit of background and history.
This is my version of the story, so don't take it too seriously.

At the beginning, humans created the server. 
A machine on which you could run various programs and apps.
Well, we also created the internet, of course, otherwise we couldn't connect our web apps to our users.
If you have a few users, a single server may suffice.
But you know how it goes, with the spread of the web and internet, we now have billions of users, and millions of servers.
Things kinda got complicated, and we introduced lots of hard concepts around distributed microservices, replicated databases.
We even coined theorems, like the CAP theorem, for Consistency, Availability, Partitioning. But you can only pick 2.

Humans invented the cloud, in order to avoid dealing with the physical world.
But there are still databases, servers, or virtual machines to manage.
However, you don't have to get your hands dirty with the ethernet cables, changing the failing hard-drives, upgrading to the latest CPU and RAM.
Usually, it's the cloud provider that has folks that wake up in the middle of the night to upgrade those things.
You can sleep a little bit better at night, even if your boss may still call you at 3am because your app is misbehaving.

To focus on the code, and to avoid the complexity of managing servers, provisioning clusters, configuring networking, fine-tuning databases, even in the cloud... humans came up with the concept of serverless! 
Here is a picture of the latest Google datacenter for serverless! Look, no servers!
Well, I'm kidding, of course, there are always servers around!

Even if the word serverless wasn't there yet, it all started with Platform-as-a-Service, with App Engine and Heroku.
The promise was "give us your code or your app, and we'll run it for you".
The hardware management aspect was already there. Scaling was also handled by the platform.
The pricing as well was proportional to the usage of the resources.

You also have BaaS --- Backend as a Service
It's pretty similar to PaaS actually.
It comes with batteries-included. You focus on the frontend, and all the backend is provided for you.
Parse and Firebase are two good examples. Facebook kinda abandoned Parse into open-source land.
But Firebase is still around and integrates more and more with the various Google Cloud Platform services.
So you can have hosting of static assets, a datastore to save your information, some kind of runtime environment to run your business logic.
And tons of other services, for authentication, mobile crash analysis, performance testing, analytics, and more.

PaaS, then BaaS, and also FaaS: Functions-as-a-service.
With a FaaS solution, your unit of work, of deployment, becomes a small, granular function.
This concept was popularized by Amazon Lambda.
And often, even still today, people tend to confuse FaaS with Serverless.
But FaaS is really just one facet of the Serverless ecosystem. Like PaaS or BaaS.

Another interesting facet of serverless is the Container-as-a-Service approach, with containerized workloads.
Instead deploying apps or functions, you're deploying containers.
Put anything you want inside a container. 
That's the approach that Google took with its Cloud Run container service.
You don't have the complexity of Kubernetes, but you can run your container easily in the cloud, in a fully managed environment.

Right, so I described a bit the history that lead us to serverless and its various facets, and some of the serverless products that are available today, but let's take some time to give a proper definition of what serverless is.

For me, Serverless is the easiest way to get an idea to production in a minimal amount of time.
As a developer, you work on some code, and then you deploy it. That's it! Really!

The term serverless was coined around 2010 by someone called Ken Elkabany, who created the PiCloud computing platform.
Compared to Heroku and App Engine which came earlier, and focusing on implementing web stacks in their cloud datacenters, PiCloud was more generic and supported different kinds of workloads, not just serving web requests.
The catchy term came from the fact that they were actually selling a service, rather than selling or renting servers, machines, VMs, to their customers.

There are 2 ways to think about Serverless: there's the Operational model, and the Programming model.

Operational model:
-   Fully managed, 
-   Automatic scaling, 
-   Pay as you go

Programming model
-   Service based, 
-   Event driven, 
-   Stateless

There's no provisioning of clusters, servers, instances, VMs or anything.
It's all handled by the platform, for you. Just give your code, your app, your function.
It's a fully managed environment. Security patches are applied automatically. 
You remember specter and meltdown recently? They've been mitigated transparently and rapidly for customers by Google Cloud. No wake up call in the night.
Your apps will scale automatically, from 0 to 1 instance, from 1 to n instances, and from n down to 1, as well as back to zero.
Tracking the CPU load, memory usage, number of incoming requests, with some magic formula, serverless platforms are able to scale up and down your services.
Without you having to worry about it. The cloud provider is handling that for you.

In terms of pricing, it's a Pay-as-you-go cost model.
It goes hand in hand with automatic scaling.
If there's no traffic, you pay zero.
If there's twice more traffic than usual, you pay proportionately.
And if the load goes back to zero, the instances serving your app are decommissioned, and again you pay zero.

Now onto the programming model.
More and more, we're transitioning from building big monoliths into orchestrating smaller services, or microservices.
It has its challenges though, but with smaller services, your teams can develop them more independently, scale them differently, or event deploy them with different life cycles.

Since you have some more loosely coupled services, they tend to react to incoming events from your system or from the cloud (for example a notification of a new file in cloud storage, a new line in a reactive datastore like Cloud Firestore, a message in a message bus like Pub/Sub), 
Your services usually communicate asynchronously, to stay properly decoupled.
But the more asynchronous you are, the harder things are to operate and monitor, when business logic spans several services, you have to figure out what's the current status of that workflow across those services.

Another important aspect of the fact that services can scale up and down and back to zero is that there's no guarantee that you're going to hit the same server all the time. 
So you can't be certain that some data that would be cached is still there.
You have to program defensively to ensure that any fresh instance of your app is able to cope with any incoming request.
State is pretty much an enemy of scaling. So the more stateless you can be, the better it is.

-   Compute, 
-   Data Analytics
-   ML & AI
-   Database & Storage
-   Smart assistants & chat
-   DevOps
-   Messaging

We've been speaking about serverless compute, but serverless is not just about compute.
You could consider that anything that is fully managed, that offers a pay-as-you-go cost model, that is a service in the cloud, then it's also all serverless, since you don't have to worry about the infrastructure and the scaling.
There are great examples of this in Google Cloud, for example BigQuery which is a fully-managed, serverless data warehouse and analytics platform. You pay proportionally to the amount of data your queries are going through! Not for the storage, not for the running servers, etc. 
But let's get back to serverless compute.

Serverless sounds pretty cool, right?
But there are also challenges, compared to running a good old monolith on your on-premises server.
We've already given some hints of some of the challenges.
In particular, I'd like to spend some time to tell you about four key aspects:
- The lock-in factor
- The infamous cold starts
- Cost controls
- And the mess of spaghetti microservices

PaaS or BaaS often come with batteries-included.
They have built-in APIs or databases, which are super convenient for developers.
As a developer, you are much more productive, because you don't have to wire things up, configure third-party services. The choice is already made for you.
But I'm seeing those batteries more and more being externalized, as their own standalone products. 
Google Cloud has externalized things like its NoSQL database, its Pub/Sub message hub, its scheduler, its task handling capabilities. Before those services were actually part of the Platform-as-a-Service.

However great having built-in powerful batteries is, often these are proprietary and specific to that platform.
You end up being locked to the platform you're building upon.
It can be a choice, as long as you are aware of it.
It's a trade-off between portability and time-to-market.
You might still be tied to those products, but at least, you can still move the business logic around, if those services are externalized. 
And you can create a level of indirection to be able, some day, potentially, to move away from those service dependencies if needed.

A common issue you hear about in serverless-land is the infamous "Cold Start".
Since you can scale to zero, it means there's currently no server, instance, or clone, to serve an incoming request.
So what happens? The cloud provider has to reinitialize, re-instantiate, re-hydrate some kind of server, VM, or container.
Additionally, the underlying language runtime has to startup as well, initializing its internal data structures.
Not only that, but your app also needs to get started too.
So you'd better try to minimize the time your apps need to be ready to serve their first request. Since you have control over this part.

There are workarounds, like pinging your service at regular intervals to keep it warm, but it's a bit of a hack, or even an anti-pattern.
Depending on the pricing, that might mean you're paying for nothing potentially, for something that's sitting idle.
Some platforms provide some knobs that you can play with like "min instances" or "provisioned instances", usually at a lower price.
For instance, on Google Cloud Functions or Cloud Run, you can specify that you want a certain minimum number of instances that are already warm, and ready to serve, and that are cheaper.

I mention a minimum number of instances, but what about the notion of maximum number of instances?
It's actually an important idea. 
With a platform that auto-scales transparently, that can spin up as many instances to serve increased traffic, it also means that your costs are going to increase just as much! 
So in order to bound your budget to a known quantity, rather than burning your money with all your hot instances, you can cap the number of instances that will serve your content. The service may be a bit degraded when you reach that limit, as latency will likely increase, but at least, your budget doesn't go through the roof!
That's why Google Cloud Platform introduced that notion of capping the number of instances running your functions, apps or containers in its serverless product: to have more visibility and control around costs.

The last challenge I'd like to mention is spaghetti services.
It's so easy to write many functions and services on a serverless platform.
One service does one thing and does it well, right?
But after a while, you end up with a spaghetti of microservices. A big mess.
It becomes very complicated to see what invokes what. 
Hard for monitoring and observability to really figure out what happened, when one microservice starting somehow to misbehave completely ruin your clockwork architecture.
And you know: monoliths aren't that bad, actually.
Don't start right away with writing the smallest unit of work possible. 
Pay attention to how you split the big monolith into microservices.
Otherwise, you'll end up with that big plate of spaghetti. 
There are good articles on when and how to split monolith, but it's not a simple rule of thumb answer.

So what does the future hold for serverless?
I believe that the highlights will be about:
-   Openness
-   Containers
-   Glue
-   Edge
-   Machine Learning

Let's start with open, and openness. That's open like in open source!
We want to avoid lock-in. We want portability.
For instance, the platforms rely on open source software for sure, but the platforms themselves can be open source too.
If you look at Google's Cloud Run, it's actually based on the Knative open source Kubernetes platform.
So you're not locked in Google Cloud when you're using Cloud Run. You can move your workload, your app, on a Knative compatible platform from another cloud provider, or even on-premises, on your own infrastructure.
I worked on the Java Cloud Functions runtime, and it is also available as open source. So you can deploy your functions in Google Cloud, but you can also run your functions elsewhere too, in a hybrid cloud scenario, or even just locally on your machine for greater developer experience and a tighter development feedback loop.
Also, the way you build your services from sources, this can be made more open too. 
For instance, Heroku and Google Cloud partnered together on Cloud Native Buildpacks, it helps you transform your application source code into images that can run on any cloud.
Really, it's all about portability and avoiding lock-in, by making things as open as possible.

As I'm mentioning Cloud Native Buildpacks, and the fact it builds portable containers for your app's source code, notice that we're speaking of containers.
Why containers, you may ask. 
With things like platform or function as a service, you are pushing apps on the platform runtime. But you may be limited in terms of language runtime, or library, or binary that you can run there or bundle. If you're using an esoteric language, or need some special software installed, perhaps you won't be able to run your app there.
Instead, if you could put everything you need in a box, and if the cloud could just run that box for you, then you can do pretty much anything.
That's why we're using containers more and more. And that's also why Google Cloud released Cloud Run, to run your containers, but serverlessly, with any runtime, library or language that you want, without limitations.
So I'm seeing more containers in the future.

You remember my plate of spaghettis? 
To orchestrate your services, to observe and monitor them, to track that they are communicating properly, asynchronously, you'll need more tools to ensure that it all runs fine in the cloud. That's why I'm seeing more tools like Google Cloud Tasks, Cloud Scheduler, Cloud Workflows, and in the Azure and AWS worlds, you have things like Logic App or Step Functions.
You also have various messaging busses, like Google Cloud Pub/Sub, Amazon SQS, Azure Service Bus.
And in the Kubernetes world, we've seen service meshes emerge as a key architectural pattern.
A monolith is much simpler to develop & operate, but as you move to a microservice architecture, those glue services will be needed more and more.
So I see more glue in the future!

Recently, CloudFlare released a product called CloudFlare Workers.
It's using the V8 JavaScript engine, and its isolates concept to run your functions, in a sandboxed manner.
There are two very interesting aspects to me in this new product.
First of all, that's the idea of having your serverless functions run at the edge of the network. 
Not deep in a handful of big data centers. Instead, those functions are as close to the users as possible.
So the latency is really minimal.
Secondly, to further reduce latency, there's a great innovation that almost completely eliminates cold starts!
CloudFlare actually starts warming up your function as soon as the SSL handshake is requested when you invoke the function via HTTPS, although normally the whole handshake operation has to be done first, and the call routed to your function, before really starting.
So that's a really great optimization! And we'll probably see more stuff moving to the edge of the cloud infrastructure.

Lastly, looking even further in the future, I'm curious to see how machine learning will play a role in the serverless offering of cloud providers.
In particular, you still have to specify a VM or instance size, its memory or CPU. Some would say it's not very serverless, since servers are supposed to be abstracted away.
In Google Cloud, for example, we have what we call a "clone scheduler" that is responsible for creating a new instance of your function or app, depending on various factors, like CPU usage, memory usage, number of incoming queries, etc. 
There's some magical calculation that figures out how and when to spin up a new instance.

Google recently automated its datacenter thanks to Machine Learning, reducing its power consumption by 40%! (Power Usage Efficiency)
I can imagine a future where Machine Learning is used to further upsize or downsize the underlying machines running your serverless code, and provision the right amount of resources, to reduce latency, CPU usage, etc.
So let's see what the future holds for Serverless!