---
title: "First beta of Groovy 2.1 released"
date: 2012-12-21T00:00:00.000+01:00
tags: [groovy]
---

Since the world didn't seem to end today, it is with great pleasure that we bring under your Christmas tree the following presents: the **release of Groovy 2.1.0-beta-1 and Groovy 2.0.6**.  
Groovy 2.0.6 is a bug fix release for our Groovy 2.0.X line, whereas Groovy 2.1.0-beta-1 contains new features.  
You can download Groovy at the usual location: [http://groovy.codehaus.org/Download](http://groovy.codehaus.org/Download)  
  
The JIRA release notes can be found here:

*   Groovy 2.1.0-beta-1: [http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18598](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18598)  
    
*   Groovy 2.0.6: [http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18852](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=18852)

More extensive release notes will be available for the final Groovy 2.1.0 release, but please let me highlight the following key new features:

*   **complete invoke dynamic support** when running with the "indy" JAR on JDK 7
*   **upgrade to GPars 1.0**: the Groovy distribution now bundles the GPars 1.0 final release
*   **`@DelegatesTo` annotation**: to help IDEs and the static type checker and compiler to know that method calls in a method parameter closure are delegated to another parameter of the method -- nice for DSLs like in Gradle build files
*   **custom type checking extensions**: so you can type check your DSLs at compile-time with your own logic
*   a **meta-annotation** system: which allows you to define a new annotation actually combining several others -- which also means being able to apply several AST transformations with a single custom annotation
*   **custom base script class flag** for the groovyc compiler: to set a base script class when compiling Groovy scripts
*   **compiler configuration script**: to let you define various configuration options for the Groovy compiler, like specifying custom file extensions, various compilation customizers to apply, etc.
*   **compilation customizer builder**: a special builder for specifying compilation customizers
*   `jar://`, `file://`, `http://` prefix support for launching Groovy scripts from the command line

Although more details will be provided later on for the final release, please don't hesitate to ask questions about those new features and improvements till then.  

A little reminder on the roadmap, we intend on releasing a release candidate of Groovy 2.1 the second week of January, and if all goes well (if we don't need another RC for some last minute issues), we'll go straight to the final release at the end of January.  
  
Thanks a lot for your feedback, your bug reports, your contributions, your pull requests! It's with such a great community of users that we make Groovy a joy to use in our every day projects.  

The whole development team joins me to wish you the best for the holidays and for next year! A Groovy Christmas and a Happy New Year to all!