---
title: "Groovy / Grails support in NetBeans and GlassFish"
date: "2008-03-23T02:00:00.000+01:00"
tags: [groovy]
---

Sun engineer Matthias Schmidt has just published an article on the progress of the [Groovy and Grails support in NetBeans](http://blogs.sun.com/schmidtm/entry/news_from_grailsland). The [Aquarium](http://blogs.sun.com/theaquarium/) also features the ongoing work on support of [Grails in Glassfish](http://blogs.sun.com/theaquarium/entry/netbeans_support_for_groovy).

On NetBeans front, Matthias Schmidt and Martin Adamek started working on a plugin back in November. You'll need to use a [NetBeans nightly build](http://deadlock.netbeans.org/hudson/job/trunk/lastSuccessfulBuild/artifact/nbbuild/dist/zip/), and download the Groovy/Grails plugin from the updace center. The plugin already provides:

*   Method-completion including JavaDoc display for Groovy and Java
*   Code Folding of Groovy source files
*   Starting, stopping of the Grails server
*   Importing existing Grails projects with a week arranged display of project structure
*   Groovy/Grails module settings integrated into NetBeans options dialog
*   Marking of source code errors
*   Easy navigation of Groovy source code by using a navigator view
*   Customizing of Grails environment and server port
*   Auto-deploy to the Glassfish application server
*   Starting common Grails tasks from context menu
*   Status of running Grails server displayed in status-line
*   Syntax highlighting

This is a promising beginning, but there's definitely more to come:

*   Debugging support
*   MultiView for easy navigation between corresponding Model-View-Controller files
*   Refactoring support

On GlassFish's side, Eduardo Pelegri [reports](http://blogs.sun.com/theaquarium/entry/netbeans_support_for_groovy) improvements and bug fixes for [running Grails applications in GlassFish](http://blogs.sun.com/theaquarium/entry/kicking_the_tires_of_grails) and shares a link to the [roadmap of the Groovy/Grails support in GlassFish](http://wiki.glassfish.java.net/Wiki.jsp?page=GroovyGrailsPlanning).