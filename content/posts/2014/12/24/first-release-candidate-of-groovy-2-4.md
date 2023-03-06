---
title: "First release candidate of Groovy 2.4"
date: "2014-12-24T00:00:00.000+01:00"
tags: [groovy]
---

Hot on the heels of our 2.3.9 update, the Groovy team is happy to release the first release candidate of Groovy 2.4 as another Xmas present!  

This release candidate is our upcoming new major version of Groovy, including:

*   official support for the Android development platform: you can now develop full Android applications in Groovy, dramatically reducing boilerplate code while keeping performance and memory consumption at the same level as Java apps
*   performance optimizations: lots of improvements have been implemented in both statically compiled Groovy code and dynamic code. (example report of an illustrative [micro-benchmark](https://gist.github.com/melix/ea819c77c4b568660877))
*   optimized memory use: reworked some compiler internals to reduce memory consumption
*   traits refinements: like the ability to tell that a trait can only be applied to a specific type hierarchy
*   and as usual, lots of bugfixes

We’re planning on releasing the final Groovy 2.4 version in January, once we’re happy with the stability and feedback from the community.  

You can read the [Groovy 2.4-rc-1 release notes](https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20785) to learn more about the tickets closed, and head over to the [download](http://beta.groovy-lang.org/download.html) section of the beta Groovy website to get the latest and latest bits on your computer! The documentation for this version can be found [here](http://docs.groovy-lang.org/2.4.0-rc-1/html/documentation/).

We need your help to test drive this release candidate! We would greatly appreciate if you check this version against your projects and report back any regression or blocker that you come across.  

Thanks a lot for all your contributions and support!  

Keep on groovy-ing, and groovy holidays!