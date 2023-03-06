---
title: "Gaelyk 0.4.4 out with namespace/multitenancy support"
date: "2010-09-10T00:00:00.000+02:00"
tags: [gaelyk, groovy]
---

I'm pleased to announce the release of Gaelyk 0.4.4!

What's new?

*   Updated the Google App Engine SDK to the latest 1.3.7 version
*   Jabber and incoming email groovlets now have their implicit logger (gaelyk.email and gaelyk.jabber)
*   Plugins are now impacting Jabber and incoming email groovlets as well
*   Fixed a bug the conversion of String to Datastore's Category type
*   Internal refactorings of the caching logic
*   Added namespace support for multitenancy, added in SDK 1.3.7:
    *   a namespace is added in the binding, pointing at NamespaceManager, the SDK class dealing with namespaces
    *   a new method `namespace.of("customerA") { ... }` to execute a closure in the context of a specific namespace

Although I haven't mentioned it in the notes above (on on the download page), some of the internal refactorings of the caching and routing logic have also helped solving problems with the blobstore support. Please report back to me if it's working as expected, for text content as well as binary content stored in blobstore (the latter was problematic in 0.4.3).

Make sure to download the latest and greatest version of Gaelyk here: [http://gaelyk.appspot.com/download](http://gaelyk.appspot.com/download)

Thanks a lot to all those who contributed to this release!

I'm still looking for some help for some acute eyes to see why we still have this dangling includes issue when mixing includes and cache. I still haven't found the cause, and would gladly accept help to find out what's going on! (I was hoping my internal refactorings would help, but I've not succeeded so far)