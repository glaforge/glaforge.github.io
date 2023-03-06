---
title: "Groovy 1.1-beta-3 released, RC-1 and 1.1-final around the corner"
date: "2007-09-20T00:00:00.000+02:00"
tags: [groovy]
---

Dear Groovy community,

**Groovy 1.1-beta-3 is there**, paving the way for an RC-1 in the following weeks, and if all goes well, for 1.1-final in October, right in time for the [Grails eXchange conference](http://www.grails-exchange.com/) that takes place in London. This conference will also be the opportunity for the Groovy developer team to meet for the **fourth Groovy Developer Conference**! With Groovy 1.1 released by then, it'll be time to think about what's going to happen for the next major version of Groovy.

Before going through the new release, let me recap some of the nice things that have been happening lately around Groovy:

*   [JetBrains](http://www.jetbrains.com/) released a second milestone to the wonderful [Groovy & Grails IntelliJ IDEA plugin](http://www.jetbrains.net/confluence/display/GRVY/Groovy+Home), so be sure to check it out, as you'll feel at ease developing Groovy with all the bells and whistles of your beloved IDE. You've never programmed Groovy and Grails with so much pleasure.
*   IBM's [ProjectZero](http://www.projectzero.org/wiki/bin/view/) team is also helping us improving the [Eclipse plugin](http://groovy.codehaus.org/Eclipse+Plugin).
*   [Sun](http://www.sun.com/) gave us access to a nice server beast so we can conduct some high-concurrency load testing on Groovy.

So what's in this release you may wonder? Well, there are a few nice novelties, but they should be the last ones before 1.1.

First of all, Alex Tkachman, along with Jochen, worked very hard on **improving the performance** of Groovy. On some micro-benchmark seen on the blogosphere, we even got a 100% improvement. Of course, depending on your usage of Groovy, your mileage may vary, but let me congratulate Alex for this great achievement.

Now regarding new features:

*   The last mile of Java 5 related feature is included: you can **use and define enums in Groovy**.
*   The closure and map coercion to interfaces mechanism has been extended to work on concrete classes too.
*   The ternary operator can be shortcut to simplify `a != null ? a : "default value"` into `a ?: "default value"`. We call it the **Elvis operator** -- a beer for those who guess why we've chosen that name.
*   In the dynamic space, Graeme Rocher has been continuing enhancing and **improving the ExpandoMetaClass** and has added some new methods like methodMissing(), respondsTo() or hasProperty(). Don't forget to check the [documentation](http://groovy.codehaus.org/Dynamic+Groovy) and the child pages.
*   It is now possible to customize the [variable resolving strategy in closures](http://fisheye.codehaus.org/browse/~author=graeme/groovy/trunk/groovy/groovy-core/src/test/groovy/lang/ClosureResolvingTest.groovy?r=6945) (not yet documented), so that you can decide whether you want to the resolution to go to the delegate first or only, to the closure itself, or to the owner.
*   Jason Dillon has been working on **improving the good old Groovy Shell** (groovysh). It is still a work-in-progress, so by default, it is not activated, but you may try it by setting a NEWSHELL environment variable to a dummy value. Some completion is there thanks to JLine, **ANSI color** makes things more friendly on most platforms (Windows being the exception as always), and the driving idea behind those evolutions was **getting rid of the infamous "go" command**.
*   [Romain Guy](http://www.curious-creature.org/), on his side, along with the help of [Danno Ferrin](http://shemnon.com/speling/) and [Andres Almiray](http://www.jroller.com/aalmiray/). have **polished the Groovy Swing Console look'n feel**.
*   One last nugget, some improvements have been worked on to allow a better integration between the groovyc and javac Ant task letting you use the javac Ant task as a sub-element of the groovyc Ant task -- however, for big projects with a lot of classes, it may be pretty hungry for memory.

With all that, it's time to give the usual links. Apart from those new features or improvements, we've closed a fair amount of bugs too, if you want to have a closer look at what we've worked on, you can have a look at the [JIRA issues closed for beta-3](http://jira.codehaus.org/secure/IssueNavigator.jspa?reset=true&pid=10242&fixfor=13590).

You can [download Groovy](http://groovy.codehaus.org/Download) at the usual place: Joachim Bauman is updating the [Windows native installer](http://groovy.codehaus.org/Windows+NSIS-Installer) (which also contains Antti Karanta's [native launcher](http://glaforge.free.fr/weblog/index.php?itemid=222) for Windows) and he should make it available in the following days.

One last closing word: the documentation of the website is available too, and over those past months, the **documentation climbed to about 900 pages** worth of PDF export! Even bigger than the fine [GinA](http://www.manning.com/koenig/)lady!

Keep Groovying, thanks to all the developers and contributors for their help, and stay tuned for RC-1 and 1.1 pretty soon!