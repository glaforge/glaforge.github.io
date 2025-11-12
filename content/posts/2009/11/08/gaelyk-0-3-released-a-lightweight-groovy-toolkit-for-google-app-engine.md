---
title: "Gaelyk 0.3 released -- a lightweight Groovy toolkit for Google App Engine"
date: 2009-11-08T00:00:00.000+01:00
tags: [gaelyk]

similar:
  - "posts/2009/09/15/gaelyk-0-2-released-a-lightweight-toolkit-for-google-app-engine.md"
  - "posts/2011/01/08/new-important-milestone-for-gaelyk-with-version-0-6-released.md"
  - "posts/2013/05/16/gaelyk-2-0-is-released.md"
---

Following the _conference-driven development_ principle, right in time for the [Devoxx](http://www.devoxx.com/) conference and my [session](http://www.devoxx.com/display/DV09/Google+Appengine+Java+-+Groovy+baby) with my friend [Patrick Chanezon](http://www.devoxx.com/display/DV09/Patrick+Chanezon) on Google App Engine Java and Gaelyk/Groovy, I've just released a new version (0.3) of the [Gaelyk](http://gaelyk.appspot.com/) lightweight Groovy toolkit for Google App Engine.

This new version fixes a bug, adds some new capabilities, and bring a small change:

*   The Google services bound to the Groovlets and templates through the binding have been renamed (except userService) to remove the service suffix
*   There are some new methods for working with the memcache service, so you can use the map notation (subscript) to access elements of the cache, as well as using the 'in' keyword to check whether a key is present in the cache.
*   Since GAE SDK 1.2.6, incoming email support has been added, so Gaelyk 0.3 also adds support for incoming emails.
*   There was an issue since the birth of Gaelyk with sending emails, it has now been fixed.

Please make sure to check the [tutorial](http://gaelyk.appspot.com/tutorial/), as it's been updated with new sections on these changes and new features.

You can download the latest [JAR](http://gaelyk.appspot.com/download/) and the latest [template project](http://gaelyk.appspot.com/download/) directly from GitHub.

The [Gaelyk website](http://gaelyk.appspot.com/) uses that new version of Gaelyk, as well as the latest 1.2.6 SDK for Google App Engine -- The [Groovy Web Console](http://groovyconsole.appspot.com/) has not yet to been updated.

Please let me also thank some of the contributors to this release, such as Sean Gilligan, Kazuchika Sekiya, Jinto, for their help with improving the tutorial, and to all those who contributed on the mailing-list or elsewhere. For instance, well done to the Averone company for migrating its [website](http://www.averone.com.br/en/empresa.html) to Gaelyk, or the the[Phone4Water](http://phone4water.appspot.com/) website also on Gaelyk!