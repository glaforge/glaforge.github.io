---
title: "A bit of functional tests and concurrency for Gaelyk"
date: 2012-06-01T00:00:00.000+02:00
tags: [gaelyk, groovy, google-cloud, app-engine]
---

Along with the [release of Gaelyk 1.2]({{< ref "/posts/2012/05/30/gaelyk-1-2-is-out" >}}), I'd like to share two interesting links about running functional tests with Geb, and concurrency / parallelism with GPars on [Gaelyk](http://gaelyk.appspot.com).  
Gaelyk functional testing with Geb  

In the Groovy ecosystem, we're all aware of the [Spock](http://code.google.com/p/spock/) testing framework. On top of Spock, you can use the [Geb](http://www.gebish.org/) browser automation library, to easily create functional tests for your web applications, in a nice, readable and expressive fashion.  

Thanks to [Marcin Erdmann](http://blog.proxerd.pl/), the [Gradle GAE plugin](https://github.com/bmuschko/gradle-gae-plugin) (used by the [Gaelyk template project](http://gaelyk.appspot.com/tutorial/template-project)) has been enhanced with support for running functional tests with Spock and Geb. Marcin (who's blog is actually a fork of my [Bloogaey](https://github.com/glaforge/bloogaey) app) has written a [small tutorial on how to get started](http://blog.proxerd.pl/article/funcational-testing-of-gae-lyk-applications-with-geb).  

## Concurrency and parallelism with GPars  

Another great library of the Groovy universe is [GPars](http://gpars.codehaus.org/), which is bundled with the Groovy distribution. GPars offers a ton of features for your concurrency and parallelism needs: actors, fork/join abstractions, dataflow concurrency, agents, etc.  

On Google App Engine, until recently, it wasn't allowed to spawn threads in your applications. So it was impossible to use a library like GPars in your Gaelyk applications. Fortunately, Google introduced a [ThreadManager class](https://developers.google.com/appengine/docs/java/javadoc/com/google/appengine/api/ThreadManager) so that you can spawn up to 10 threads in your incoming requests.  

Gaelyk committer [Vladimír Oraný](https://twitter.com/musketyr) teamed up with Vacláv Pech (lead of GPars) to work on an extension library to allow GPars to use that thread manager for GPars' own thread pools. Vacláv tells us about this story on [his blog](http://www.jroller.com/vaclav/entry/gpars_actors_and_dataflow_for) and even points at the [GPars web console](http://gparsconsole.appspot.com/) where you can try some parallel / concurrent features from GPars.