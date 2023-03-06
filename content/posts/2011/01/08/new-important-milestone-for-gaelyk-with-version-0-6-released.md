---
title: "New important milestone for Gaelyk, with version 0.6 released"
date: "2011-01-08T00:00:00.000+01:00"
tags: [gaelyk, groovy]
---

I'm very pleased to announce the release of Gaelyk 0.6.

This new version is a pretty significant milestone, both in terms of features and quality. We're really approaching a final 1.0 version!

Here's a list of the novelties, updates, and bug fixes.

*   Updated to GAE SDK 1.4.0 and Groovy 1.7.6
*   Channel service added in the binding and added a convenient method for sending messages
*   Ability to specify the "warmup request" handler through a route definition
*   Added app.gaelyk.version in the binding
*   Use a servlet context listener for initializing the plugin system
*   Initial support for the asynchronous datastore
*   Updated the task queue enhancements to use the new package (as task queues migrated from labs)
*   Introduced a Gradle build script for building Gaelyk itself
*   Increased the code coverage of the project to over 82%
*   Added before{} request and after{} request lifecycle hooks to plugins
*   Added initial Eclipse project files in the template project
*   Fixed a bug with ignore URL routes which triggered NPEs after the capabilities routing was added
*   Corrected typos in the tutorials

Be careful, however, as there are two breaking changes compared to previous versions:

*   Compared to the previous version of the toolkit, the handling of incoming emails and incoming jabber messages has changed. The GaelykIncomingEmailServlet and GaelykXmppServlet are gone. It is no longer required to have dedicated servlets for those two purposes, instead you must use the URL routing system to indicate the handlers that will take care of the incoming messages. If you were relying on those two servlets, please make sure to upgrade, and read the updated tutorial on URL routing and incoming email and jabber messages.
*   The initialization of the plugin system is not done anymore by the Groovlet and template servlet, but is done by a servlet context listener. So you'll have to update your web.xml file to specify that listener. Please have a look at the template project or the documentation on how to setup the new context listener.

You will also notice that the Gaelyk website has been updated:

*   You will find some "quick links" to go more directly to the information that matters.
*   On the front page, a list of a few live Gaelyk websites in the wild is displayed
*   A ["search" section](http://gaelyk.appspot.com/search) has been implemented, using Google's custom search engine, which will let you search through the Gaelyk website, the GitHub content, as well as the Gaelyk Google Group messages
*   You now have a [single-page documentation](http://gaelyk.appspot.com/tutorial/print) option for those who wish to print the documentation (please think about the trees before printing)
*   And a [PDF of the whole documentation](http://gaelyk.appspot.com/gaelyk.pdf) is available, which is handy for offline browsing.

Please download Gaelyk 0.6 here: [http://gaelyk.appspot.com/download](http://gaelyk.appspot.com/download)

Contribute to Gaelyk:

*   [Discussions](http://gaelyk.appspot.com/community#discuss)
*   [Code repository](http://gaelyk.appspot.com/community#repository)
*   [Bug tracker](http://gaelyk.appspot.com/community#bugtracker)

Thanks a lot for your attention and enjoy!