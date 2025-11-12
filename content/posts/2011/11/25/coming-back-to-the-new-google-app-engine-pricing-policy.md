---
title: "Coming back to the new Google App Engine pricing policy"
date: 2011-11-25T00:00:00.000+01:00
tags: [gaelyk, groovy, google-cloud, app-engine]

similar:
  - "posts/2011/09/01/google-app-engine-s-new-pricing-model.md"
  - "posts/2018/04/16/ten-years-of-app-engine-with-a-groovy-twist.md"
  - "posts/2011/11/16/gaelyk-1-1-released.md"
---

In a recent article, I was [complaining about the new Google App Engine pricing policy]({{< ref "/posts/2011/09/01/google-app-engine-s-new-pricing-model" >}}). Obviously, as I have a few applications deployed on App Engine, and as I'm developing [Gaelyk](http://gaelyk.appspot.com), a lightweight toolkit for this platform, I was worried about being heavily affected by those changes.  

In this article, I'd like to do a short summary of my experience so far.  

I have close to 10 applications deployed on Google App Engine. Most are just demos that nobody ever accesses. But three of them are quite important to me:

*   [the Gaelyk website](http://gaelyk.appspot.com)
*   [my blog]({{< ref "/" >}})
*   [the Groovy Web Console](http://groovyconsole.appspot.com)

The two key aspects that are bothersome are: the instance hours and the datastore reads. That's usually those two limits that we tend to hit — at least, that was the case for me.  

Despite the policy changes, the Gaelyk website wasn't affected, and was staying under the quotas. It's essentially a pretty static website, although the pages are templates (hence dynamic), but since the pages are cached, through the [routes.groovy configuration](http://gaelyk.appspot.com/tutorial/url-routing#caching), and that there's no datastore access, everything is fine here — just a few datastore reads for the memcache access.  

For my blog, I was a bit below the datastore reads level, but the frontend instance hours were more problematic. The fact of moving the max idle instance knobs and latency knobs to their opposite, helped me a lot. And although the website is up and running 24h/24, App Engine doesn't spin up too many instances anymore with those knob settings, and I'm now under the 28 hours limit. So all is fine for my blog too.  

And the biggest problem was the Groovy Web Console...  

For the frontend instance hours, I'm always at the limit, but with the knobs to the opposite, it's okay, but really short... Also, the pricing policy moving to instance hours rather than CPU consumption was a good thing for the application, as users can execute long-running scripts (< 60 seconds). 
 
For the datastore reads, that was the most painful aspect, as the Google Search bots and friends are doing a ton of reads when harvesting all the Groovy scripts that are published.  

I must confess the application wasn't very well written, so for example, I was doing three queries (basically the same one) to list the latest scripts published, the scripts by authors, the scripts by tags. Three queries which were essentially the same, more or less, that were totalling 5 read operations each (on op for the query + 2 \* two ops because of the indexed columns I was sorting / filtering on). So I had like 15 operations or so just to build up the pages that you see when you click on the link "recent scripts".  

Despite the fact my pages were cached (using just one read operation from memcache), it happened often that pages were not in the cache, and that my app needed those 15 operations. So I had to optimize my application. Instead of doing three different queries, I ended up doing just one, and then I apply some sorting / filtering / grouping in memory with the results I got from the query. I ended up with just 5 operations instead of 15.  

Then, I also went a step further by putting the results of the queries in memcache, so instead of 5 ops, most of the time I ended up getting only one read operation. In the end, I reduced my datastore reads by a factor of 15 or so. And with those changes, I only consume about 40% of the datastore read operations quota!  

You can see what my quotas look like when I'm at the end of the day, thanks to those optimizations:  

![](/img/misc/gae-console-billing.png)  

I almost reach the frontend instance hours limit, but I'm still below 28 hours, and I only used 38% of my datastore read quota.  

So all in all, I'm quite happy that all my apps stayed free, thanks to the few updates that Google made to the pricing policy to accomodate all the complaints they received!  

What has been your experience with the new pricing policy? Did you have to optimize your apps, if yes, what solutions did you find?  

I'm looking forward to your feedback!