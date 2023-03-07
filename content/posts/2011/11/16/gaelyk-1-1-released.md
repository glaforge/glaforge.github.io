---
title: "Gaelyk 1.1 released"
date: "2011-11-16T00:00:00.000+01:00"
tags: [gaelyk, groovy]
---

Gaelyk 1.1 has just been released!  
[Gaelyk](http://gaelyk.appspot.com) is a lightweight toolkit for writing and deploying Groovy apps on Google App Engine.  
In this version, all the components have been updated to their latest versions:

*   [Groovy 1.8.4]({{< ref "/posts/2011/11/11/latest-groovy-releases-and-roadmap-update" >}})
*   [GAE SDK 1.6.0](http://googleappengine.blogspot.com/2011/11/app-engine-160-out-of-preview-release.html)

This blog is now running Gaelyk 1.1 pretty happily!  
You should be able to see the [announcement](http://groups.google.com/group/gaelyk/browse_thread/thread/b91556a6c2238646) on the Gaelyk Google group for the details, but here's the list of changes:

> *   Upgraded to Groovy 1.8.4 and App Engine SDK 1.6.0
> 
> *   The [new `get()` methods on the datastore service](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#datastore-get) now also work with the asynchronous datastore.
> 
> *   Added an `unindexed` property on entities to set unindexed properties: `person.unindexed.bio = "..."`
> 
> *   [Three annotations to customize the bean / entity coercion](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#pogo-entity-coercion-annotations)
>  (`@Key`, `@Unindexed` and `@Ignore`)
> 
> *   Part of the work with the async datastore `get()`, whenever you have a `Future` to deal with, for example when the async datastore returns a `Future` , you can call any property on the `Future` object, and it will proxy those property access to the underlying object returned by the `get()` call on the future.
> 
> *   In addition to `datastore.query{}` and `datastore.execute{}`, there is now a `datastore.iterate{}` method that returns an `Iterator` instead of a list, which is friendlier when your queries return a large number of results.
> 
> *   Added the prospective search service to the binding
> 
> *   You can access the [asynchronous Memcache](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#async-memcache) service with `memcache.async`
> 
> *   Additional [convenience methods for the file service](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#files-misc)
> 
> *   Added an [each and collect method on blobstore](http://gaelyk.appspot.com/tutorial/app-engine-shortcuts#blobstore-each-collect) to iterate over all the blobs from the blobstore, or to collect some values from all blob infos stored.

I'll just highlight one of the nice little additions mentioned above, which is the refinement of the POGO / Entity coercion mechanism. You can now use three annotations to further customize that conversion: @Key, @Unindexed and @Ignore, to respectively specify the key property, properties that should not be indexed by the datastore, and properties that should be ignored and not saved in the datastore.  
Here's what a class annotated with those annotations could look like:

```groovy
@Canonical  
class Person {  
    @Key String login  
    String firstName  
    String lastName  
    @Unindexed String bio  
    @Ignore String getFullName() { "$firstName $lastName" }   
}
```

And then you can use the as operator to convert between beans and entities.  
If you've read thus far, it's time to go [download Gaelyk](http://gaelyk.appspot.com/download) and have fun!