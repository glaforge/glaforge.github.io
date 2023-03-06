---
title: "The Groovy 1.6 release candidate is out!"
date: "2008-12-22T00:00:00.000+01:00"
tags: [groovy]
---

The Groovy development team and SpringSource are happy to announce the release of the first release candidate of Groovy 1.6.  
  
The JIRA report for this new version lists 74 bug tickets, 26 improvements and 8 new features:  
[http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&styleName=Html&version=14009](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&styleName=Html&version=14009)  
  
Among the bugs being fixed, we tackled issues about:  

*   the compiler
*   bytecode errors
*   varargs handling
*   covariant returns
*   Windows startup scripts

As well as a few regressions:  

*   the `args` variable not bound in Groovy scripts
*   a performance regression in `MarkupBuilder`
*   a problem with `DOMCategory` which was particularly problematic for Grails

Fixes in line error reporting should be handy for IDE vendors, as well as for Cobertura code coverage.  
Compatibility with Java has also been improved slightly, for instance the empty for(;;) {} loop wasn't behaving the same as in Java (no loop, instead of an infinite loop).  
  
The XML support continues to be enhanced, for instance with:  

*   better handling of namespaces with `XmlNodePrinter` and `NamespaceBuilderSupport`
*   new GDK methods in `DOMCategory`
*   you can customize the nodes in `XmlParser`
*   a new builder for StAX, thanks to an external contribution

In other improvements:  

*   Groovysh can be extended, giving you access to certain key internal structures
*   the stacktrace sanitization can be customized should you want to print out nicer stacktraces.
*   new GDK methods have been added for File handling and Date formatting
*   a new `@PackageScope` AST transformation was added to support the package-scope visibility Groovy didn't support
*   improvements to our OSGi manifest for better OSGi support
*   the default resolve strategy used for `.with{}` method has been changed to `DELEGATE_FIRST`
*   GroovyDoc now supports multiple locations in sourcepath
*   an @since tag should be used in documenting the GDK methods so users know when a given GDK method has been added to Groovy

Beyond continuous improvements in Groovy's Swing support thanks to our [Griffon](http://griffon.codehaus.org/) Swing team, the Swing console has seen some interesting improvements as well:  

*   when you have a stacktrace showing up because of an exception being thrown in your scripts, or when you have a compiler error, you'll get clickable messages in the output window, making it easier to navigate to the offending line of code causing the problem
*   you can also now opt to hide the script recopy in the output window
*   and you can also have a visual representation of output results, for instance with Swing components not attached to any parent being displayed on the output, and the nice thing to consider is also the fact anybody is able to customize the output visualizations.

Last but not least, Vladimir Vivien's [JmxBuilder](http://www.infoq.com/news/2008/12/jmx_builder) originally hosted at [Google Code](http://code.google.com/p/groovy-jmx-builder/) was contributed back to Groovy, further improving our existing support of JMX.  
  
Beyond all these bug fixes and other improvements, you still have all the novelties and improvements listed in the betas:  

*   [release notes for 1.6-beta-1](http://glaforge.free.fr/weblog/index.php?itemid=241)
*   [release notes for 1.6-beta-2](http://glaforge.free.fr/weblog/index.php?itemid=256)

Please make sure you try this release candidate within your projects without waiting for the final release, so that we can ensure the final version works well for you.  
  
As usual, you can download Groovy here: [http://groovy.codehaus.org/Download](http://groovy.codehaus.org/Download)   
Noteworthy as well is that we have "retrotranslated" Groovy 1.6-RC-1 to JDK 1.4, should you have to stay with a JDK 1.4 for running Groovy:[http://repository.codehaus.org/org/codehaus/groovy/](http://repository.codehaus.org/org/codehaus/groovy/)  
  
Thanks a lot to all the contributors and committers who made this release possible!