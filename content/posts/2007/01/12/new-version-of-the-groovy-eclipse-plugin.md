---
title: "New version of the Groovy Eclipse Plugin"
date: 2007-01-12T00:00:00.000+01:00
tags: [groovy]
---

Scott Hickey, the project lead of the [Groovy Eclipse plugin](http://groovy.codehaus.org/Eclipse+Plugin) has just announced the availability of the plugin which now uses the offcial [Groovy 1.0 release](http://glaforge.free.fr/weblog/index.php?itemid=200). The details of the announcement are reproduced below. There's even some **basic code completion **available!

Recently, EclipseZone proposed a [Getting Started article](http://www.eclipsezone.com/eclipse/forums/t88129.rhtml) explaining the basic usage of the Groovy plugin.

> There is a new version of the Groovy Eclipse Plugin available on the update site. For installation instructions, please see the wiki page [http://groovy.codehaus.org/Eclipse+Plugin](http://groovy.codehaus.org/Eclipse+Plugin).
> 
> This version of the plugin supports Groovy 1.0. Thanks to everybody who made Groovy 1.0 possible.
> 
> Please make sure to update the Eclipse project build path for any existing projects to use Groovy 1.0. For the plugin to function correctly, it is important the version of Groovy used by the plugin and the version included in the build path are the same.
> 
> This version of the plugin features:
> 
> *   Run as Groovy now only shows up on Groovy files that are executable instead of all Groovy files
> *   Run as Junit is now available for Groovy unit tests, which will display the standard Eclipse Junit view. Run as Groovy for Junit tests will still display inthe console view.
> *   Run as Groovy and Run as JUnit now create Groovy Launch configurations, which will also show up in the Launch history. This enables the run last launched toolbar button to work.
> *   Alt-Shift-X-G runs a Groovy file, also creating a Launch Configuration
> *   Alt-Shift-X-D starts the debugger, also creating a Launch Configuration
> *   Popup menu on Projects now has options to launch the Groovy Console in a separate window or the Groovy console in the standard Eclipse console. Both are launched with the project classpath.
> *   Limited **code assist**, for methods and variables defined in the same file and Default Groovy Methods
> *   Going forward, plugin updates should be picked up automatically with "Search for updates..." instead of "Search for new features"
> 
> The plugin has come a long ways over the last nine months. It wouldn't have been possible without the tremendous effort put forth by Edward Povazan, James Ervin, and David Kerber. Thanks you guys!
> 
> Scott