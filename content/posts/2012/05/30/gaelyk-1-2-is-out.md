---
title: "Gaelyk 1.2 is out!"
date: "2012-05-30T00:00:00.000+02:00"
tags: [gaelyk, groovy]
---

![](/img/misc/gaelyk.png)

I'm very pleased to announce the release of [Gaelyk 1.2](http://gaelyk.appspot.com)!  
  
For the impatient, you'll be able to find the new JAR and Template Project here, as well as the changelog: [http://gaelyk.appspot.com/download](http://gaelyk.appspot.com/download)  
  
You'll notice that the new template project uses Twitter Bootstrap now, to make it a bit fancier and nicer on the eye!  

![](/img/misc/gaelyk+template+bootstrap.png)  

We also upgraded to the latest and greatest of Groovy and App Engine's SDK.  
  
In terms of new features, I'd like to particularly highlight:  

*   the gradle gaelyk plugin offers [pre-compilation of groovlets and templates](https://github.com/bmuschko/gradle-gaelyk-plugin#tasks) for faster startup times
*   the [integration of the search service](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#search) with some nice syntax sugar for simplifying its usage
*   the [binary plugins](http://gaelyk.appspot.com/tutorial/plugins#binaryplugins) feature
*   the [`@Entity` transform](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#pogo-entity-coercion-annotations) to add datastore CRUD operations to your Groovy classes
*   the new [`geo` variables](http://gaelyk.appspot.com/tutorial/views-and-controllers#lazy) in the binding to know where your users are coming from
*   and a few other improvements and fixes

Thanks a lot to the Gaelyk committers, and in particular to Vladimir who helped me a lot on the finish line of this release!  
  
Have fun with Gaelyk!  

And we're looking forward to hearing about your feedback and experience with this new release.