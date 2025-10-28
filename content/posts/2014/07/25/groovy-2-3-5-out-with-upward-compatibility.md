---
title: "Groovy 2.3.5 out with upward compatibility"
date: 2014-07-25T00:00:00.000+02:00
tags: [groovy]
---

The Groovy team is pleased to announce the release of Groovy 2.3.5.

Groovy 2.3.5 is a bug fix release of our Groovy 2.3 branch.

You’ll find fixes for static compilation and type-checking, JSON serialization issues, markup template engine errors, and performance improvements.

We care a lot about backward and binary compatibility, but in this release, we also thought about upward compatibility, so that code compiled with a newer version can even run on an older runtime.

So we leveraged this version to add a new artifact, named groovy-backports-compat23. This artifact shouldn’t be necessary for most of you, but if you face an error like:

```
Caused by: java.lang.ClassNotFoundException: org.codehaus.groovy.runtime.typehandling.ShortTypeHandling
  at java.net.URLClassLoader$1.run(URLClassLoader.java:372)
```

in your project, then it means that a class has been compiled with Groovy 2.3+ but that you are trying to use it with an older version of Groovy. By adding this jar on classpath, you give a chance to your program to run. This may be particularily interesting for Gradle users that want to use a plugin built on Gradle 2+ on older versions of Gradle and face this error. Adding the following line to their build files should help:

```groovy
buildscript {  
    // ...  
    dependencies {  
        classpath 'some plugin build on gradle 2'  
        classpath 'org.codehaus.groovy:groovy-backports-compat23:2.3.5'  
    } 
}
```


Note that for now, this jar only contains the ShortTypeHandlingClass. Future versions may include more.


You can download Groovy 2.3.5 here:
[http://beta.groovy-lang.org/download.html](http://beta.groovy-lang.org/download.html)


The detailed JIRA release notes can be found here:
[https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20491](https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20491)