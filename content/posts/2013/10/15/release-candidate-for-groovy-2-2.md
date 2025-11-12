---
title: "Release candidate for Groovy 2.2"
date: 2013-10-15T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2013/09/06/second-beta-for-groovy-2-2.md"
  - "posts/2013/11/18/groovy-2-2-released.md"
  - "posts/2012/09/10/groovy-2-0-2-and-1-8-8.md"
---

Yesterday, the Groovy programming language team released the release candidate for Groovy 2.2, as well as a bug-fix release of Groovy 2.1.8.  

Here's the announcement I sent on the various communication channels:  

> The Groovy team is happy to announce the release of the release candidate of Groovy 2.2, as well as a bug-fix release for Groovy 2.1.8.   
>
> As you can guess with this release candidate, the final version of Groovy 2.2 is fast approaching, and we'd be happy to get as much feedback on this release as possible, to squash potential bugs before the general availability of 2.2. So please be sure to test your applications with this release candidate.   
> 
> For both releases, we've made a small update to the default Grab configuration which is to use Bintray's JCenter repository as the first in the chain of resolvers, as Bintray's JCenter repository is noticeably faster and more responsive than Maven Central, offers dependencies always with their checksums, and stores and caches dependencies it wouldn't have for faster delivery the next time a dependency is required. This should make your scripts relying on @Grab faster when downloading dependencies for the first time.   
> 
> An interesting feature in the release candidate only is the ability for scripts to define their base script class. All scripts usually extend the groovy.lang.Script abstract class, but it's possible to set up our own base script class extending Script through CompilerConfiguration. A new AST transformation is introduced in Groovy 2.2 which allows you to define the base script class as follows:   

```groovy
import groovy.transform.BaseScript  

abstract class DeclaredBaseScript extends Script { 
    int meaningOfLife = 42 

}  
@BaseScript DeclaredBaseScript baseScript  

assert meaningOfLife == 42
```

Again for 2.2, a new @Log variant has been added to support Log4j2, with the @Log4j2 AST transformation:  

```groovy
import groovy.util.logging.Log4j2  

@Log4j2 class MyClass { 
    void doSomething() { 
        log.info "did something groovy today!"
    } 
}
```

For more details on those two releases, please have a look at the release notes on JIRA:

*   [Groovy 2.1.8 JIRA release notes](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=19570)
*   [Groovy 2.2.0-rc-1 JIRA release notes](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=19569)

Go download Groovy 2.1.8 and test drive 2.2.0-rc-1 while they're hot, in the [download area](http://groovy.codehaus.org/Download?nc)!   

Thanks a lot for your contributions to those releases, in terms of bug reports, discussions on the mailing-lists, code contributions and pull requests!