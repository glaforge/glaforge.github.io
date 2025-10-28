---
title: "Gaelyk 1.0 is out"
date: 2011-08-08T00:00:00.000+02:00
tags: [gaelyk, groovy]
---

I'm very happy to announce the final release of Gaelyk 1.0, the lightweight [Groovy](http://groovy.codehaus.org) toolkit for [Google App Engine](http://code.google.com/appengine/)!  
It took some time to get to 1.0, but it's now here, with the key feature I've been missing since the beginning of the project, in particular the [Query DSL](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#query) which allows you to write queries like this one:

```groovy
def latestArticles = datastore.execute {  
    select all from articles  
    sort desc by dateCreated  
    where author == params.author  
    limit 10  
}
```

If you want to learn more about this lightweight framework, head over to: [http://gaelyk.appspot.com/](http://gaelyk.appspot.com/)  
You can learn everything through the [tutorial](http://gaelyk.appspot.com/tutorial).  

And [download the JAR or the template project](http://gaelyk.appspot.com/download).  

Should you want to ask questions on the [Google Groups](http://groups.google.com/group/gaelyk), get involved in the community, participate in the [development of this Open Source project](https://github.com/glaforge/gaelyk), have a look at our [community page](http://gaelyk.appspot.com/community).  

This release wouldn't have been possible with all the great contributions of you all, your pull requests on [GitHub](https://github.com/glaforge/gaelyk), your Gradle plugins, your bug reports, your questions on the Google Group, etc. So I'd like to tell you all a big thank you for all your work and contributions. They were very much appreciated, and keep them coming!  
The change log:  

*   GAE SDK updated to 1.5.2 and Groovy to 1.8.1
*   Introduction of a [Query DSL for creating SQL-like queries](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#query) against the datastore
*   Updated [template project](http://gaelyk.appspot.com/tutorial/template-project) with a Gradle build, the usage of Gradle GAE / Gaelyk plugins, and the support of Spock for testing Groovlets
*   Introduction of the [plugins page](http://gaelyk.appspot.com/plugins) in the Gaelyk website, for referencing known plugins
*   By annotating classes with GaelykBindings, the same [services and variables are injected in your classes as properties](http://gaelyk.appspot.com/tutorial/views-and-controllers#gaelykBindings), as the ones which are injected in Groovlets and templates
*   The [validation closures](http://gaelyk.appspot.com/tutorial/url-routing#path-variable-validation) of the routes in your URL mapping have access to the request, so you can validate a URL depending on what's in your request (attribute, session, etc.)
*   Added a DSLD file (DSL descriptor) for Eclipse for easing code-completion and navigation
*   Added a [get() method on Key](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#delete-get-on-key), as well as on lists of keys
*   Ability to convert [lists to Keys](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#list-to-key-coercion)
*   Added two encoded [string and key conversion](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#key-string-conversion) utilities
*   [Additional datastore.get() methods](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#datastore-get) to retrieve entities by their keys more concisely
*   Problems with the recent XMPP support fixed
*   Fixed inability to access the various services and variables from within binding/before/after blocks in plugin descriptors

Additionally, this very blog post you are now reading is actually powered by a new sample app, the bloogaey blog engine, developed with Gaelyk 1.0.  

If you're interested in this blog engine, head over to the [bloogaey project on GitHub](https://github.com/glaforge/bloogaey). You're welcome to fork it to suit your needs, and to help improving it with pull requests!