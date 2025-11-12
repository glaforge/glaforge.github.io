---
title: "Groovy development: aiming for quality"
date: 2005-06-19T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2012/06/28/groovy-2-0-released.md"
  - "posts/2012/06/28/whats-new-in-groovy-20.md"
  - "posts/2011/11/11/latest-groovy-releases-and-roadmap-update.md"
---

A new [milestone of Groovy was released](http://docs.codehaus.org/display/GROOVY/2005/06/15) a few days ago. The general goal of this release was quality. 80-90% of our work was targeted at improving the user experience, as much as we could. One of the main complaints so far has always been regarding the ugly error reporting that Groovy was generating. Whether that be in the shell, or embededed, or when compiling your Groovy source code. It was pretty hard to figure out what the error was by looking at a meaningless message and hundreds of lines of exceptions.

So how did we improve that situation? Apart from cleaning the stacktraces both for compile-time or runtime errors, we've worked hard on two fronts:

*   Compile-time error reporting: a snippet of the offending code is shown, as well as a line and column number,
*   Compile-time checks: different checks are made to check variable definitions, or scoping rules.

Rather than an ugly stacktrace, the following output is an improvement, judge for yourself:

```
D:\groovy\samples>groovy errors.groovy
errors.groovy: 2: expecting anything but ''\n''; got it anyway @ line 2, column 13.
   println "foo
               ^

1 Error
```

Regarding the compile-time checks, we finally spent some time on implementing the checks we're used to have in the standard java toolchain:

Checks for classes and scripts:

*   check no variable is defined more than once

Checks for classes only:

*   check every variable is defined before usage
*   check that abstract methods are implemented when the class is not abstract
*   check that no final methods are overwritten
*   check that no final class is used as direct parent
*   check that no access from a static context to a dynamic declared variable is possible, example:
    
    ```
    class A { def var; def static m() { println var } }
    ```
    

That's a real pleasure to see the progresses made these last months in the maturation of Groovy. With just a bunch of passionate developers, we can really do great things. And the recent improvements should pave the way of a successful alternative language for the JVM.