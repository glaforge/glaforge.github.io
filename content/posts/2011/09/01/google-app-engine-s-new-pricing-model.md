---
title: "Google App Engine's new pricing model"
date: 2011-09-01T00:00:00.000+02:00
tags: [gaelyk, groovy, google-cloud, app-engine]

similar:
  - "posts/2011/11/25/coming-back-to-the-new-google-app-engine-pricing-policy.md"
  - "posts/2018/04/16/ten-years-of-app-engine-with-a-groovy-twist.md"
---

I'm quite disappointed by [Google App Engine](http://code.google.com/appengine/)'s new [pricing model](http://www.google.com/enterprise/cloud/appengine/pricing.html).  

I was aware of the changes, the upcoming prices and quotas, but I wasn't expecting my small low-trafic apps to go beyond the free quotas, and force me to have to pay for those small [Gaelyk](http://gaelyk.appspot.com) apps!  

The big problem is the cost of the "frontend instance hours". An app running all the time, with low trafic, but enough to keep a frontend instance running all day will cost you 30 bucks a month with this new pricing policy.  

Let me show you an example, of a small Gaelyk application: the [Groovy Web Console](http://groovyconsole.appspot.com). It's a simple application that features an editor to author some Groovy scripts, that you can then share publicly with others.  

So far, the billing / quota details would show me the following results:  

![](/img/gae-pricing/before-gae-pricing-change.png)  

This application has always been below the free quotas, and even if the CPU time was a bit high, it was only half away from the free quota of CPU usage. So all was fine. Now, with the new pricing model, here's what you get:  

![](/img/gae-pricing/after-gae-pricing-change.png)  

I'd be paying $1.43 for that specific day, because of the always-on frontend instance, as well as the datastore reads, which have become also quite expensive as well. So if I'd have to pay one or two dollars a day, resulting in 30 or 60 bucks a month.  

And the worst thing is that it's just a transitional step, as the screenshot shows, the frontend instance hours are currently at 50% their end price till November, so the cost will almost double.  

As soon as your app will be up all the time, even with low trafic, you'll easily get to $30 a month. I think that's on purpose, to force users to go with the first paid tier of the [new pricing model](http://www.google.com/enterprise/cloud/appengine/pricing.html). To avoid those outrageous cost, you'll have to go with the $9 / month plan, and you will be far from reaching the quotas included in that plan, so you'll pay really $9 even if you only use a dollar or two. Nine bucks is better than 30 or 60, but it still sounds expensive for me for a small blog, and a small utility app that are free content or services.  

Really disappointed. And I'm now wondering what I shall be doing with my brand new blog, and the Groovy web console... Even putting ads all over the place won't pay for the fees...  

Now I hope that the [Cloud Foundry](http://cloudfoundry.org/) model will be more friendly for small personal apps!  

You can read more on the outraged comments here:

*   a guy saying he'll [leave the plaform](http://groups.google.com/group/google-appengine/browse_thread/thread/76908543757c0507#)
*   the thread on the [GAE google group](http://groups.google.com/group/google-appengine/browse_thread/thread/a1b7c68db2243932#)
*   a [Google+ post from Russel Beattie](https://plus.google.com/104961845171318028721/posts/DamjzZBVxd7)
*   another post about the [backlash over the pricing](http://srirangan.net/2011-09-google-faces-backlash-for-new-app-engine-pricing)