---
title: "Playing with the Google+ APIs in Groovy"
date: 2011-09-15T00:00:00.000+02:00
tags: [geek, groovy]

similar:
  - "posts/2011/11/09/a-groovy-page-on-google.md"
  - "posts/2016/07/11/getting-started-with-glide-and-gaelyk-on-google-app-engine.md"
  - "posts/2016/07/27/web-scraping-and-rest-api-calls-on-app-engine-with-jsoup-and-groovy-wslite.md"
---

As soon as I heard about the [opening of the Google+ APIs](http://googleplusplatform.blogspot.com/2011/09/getting-started-on-google-api.html), letting us access public posts in our Google+ streams, I wanted to play with them, and integrate my posts in my social stream on my blog.  

First of all, a little screenshot, where you'll see the Google+ item at the bottom:  

![](/img/misc/gplus-social.png)  

Now, a bit of code? Yeah, of course. First of all, you'll need to follow the explanations of the Google+ API portal to get your own API key (I'll hide mine in this example so you don't use mine). Then, it's really just a handful lines of Groovy code to get the integration goin, thanks to [Groovy's Json support](http://docs.codehaus.org/display/GROOVY/Groovy+1.8+release+notes#Groovy1.8releasenotes-NativeJSONsupport).  

```groovy
import groovy.json.\*  
import java.text.SimpleDateFormat  
// date format: 2011-09-09T08:34:07.000Z  
def sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")  
// my top secret API key  
def myKey = "..."  
// that's the ID you'll find in your Google+ profile URL  
def myProfileId = "114130972232398734985"  
// and this is the URL of my activities  
def myActivities = "https://www.googleapis.com/plus/v1/people/${myProfileId}/activities/public?key=${myKey}".toURL().text  
// I simply parse the JSON payload  
def root = new JsonSlurper().parseText(myActivities)  
// I iterate over all the items, and print the date, the URL of the post, and the title  
root.items.each {   
    println "${sdf.parse(it.published)} - ${it.url} - ${it.title.replaceAll(/\\s+/, ' ')}"   
}
```