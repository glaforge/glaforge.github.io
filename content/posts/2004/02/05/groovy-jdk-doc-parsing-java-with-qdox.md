---
title: "Groovy-JDK doc: Parsing Java with QDox"
date: "2004-02-05T00:00:00.000+01:00"
tags: [groovy, java]
---

Perhaps you noticed recently that there's a new interesting page on Groovy's website ? Well, all pages are interesting of course! But there's a new page describing the [Groovy methods](http://groovy.codehaus.org/groovy-jdk.html) enhancing the core JDK classes.

In groovy, you have additional methods that you can call on standard Java classes. For instance, you can use the [eachLine()](http://groovy.codehaus.org/groovy-jdk.html#meth33) method on java.io.File. With this method, you'll be able to easily read a text file line after line, and do whatever with this line inside a closure without having to care about things like closing streams. Let's illustrate this with an example :

```groovy
def foo = new File("myTextFile.txt")
foo.eachLine{ line -> println line }
```

But there are numerous other Groovy methods like the [Collection.map()](http://groovy.codehaus.org/groovy-jdk.html#meth146) for mapping all objects of a collection and transform them, or [List.sort()](http://groovy.codehaus.org/groovy-jdk.html#meth172) to sort a collection with a special closure, much simpler than a custom comparator. But so far, all these methods were not documented anywhere, and a new Groovy user would have had to look at the source code closely to discover all the methods available. That's why I told [James Strachan](http://radio.weblogs.com/0112098/) we could create a simple tool to generate a documentation for all these Groovy methods to help us... And obviously, James said... "Groovy!" And that's what I did, I created such a tool in Groovy, and using a nice little library called QDox.

[QDox](http://qdox.codehaus.org/) is a really neat and simple library whose founder is [Joe Walnes](http://joe.truemesh.com/blog/), a brilliant [ThoughtWorkers](http://thoughtworks.com/) and a [Hausmate](http://www.codehaus.org/). QDox's main and sole function is to parse JavaDoc comments and build a graph of objects representing the comments, and the structure of a Java class with its fields, methods, parameters, etc... And it does the job pretty well.

I created a Groovy class called [DocGenerator.groovy](http://cvs.groovy.codehaus.org/groovy/groovy-core/src/main/org/codehaus/groovy/tools/DocGenerator.groovy?rev=1.15&view=auto) which parses the [DefaultGroovyMethods](http://cvs.groovy.codehaus.org/groovy/groovy-core/src/main/org/codehaus/groovy/runtime/DefaultGroovyMethods.java?rev=1.108&view=auto) class containing all the Groovy methods. I created a JavaDocBuilder, added a source (a Reader on the class to parse), retrieved all the public static methods, then created some [HTML output](http://groovy.codehaus.org/groovy-jdk.html). Pretty straightforward and efficient. Thanks for this nice library.

In the next revision of this DocGenerator tool, I'm going to implement different outputs, especially a framed version (with a JavaDoc look'n feel), and an XML version which then could be used by the [Groovy Eclipse plugin](http://wiki.codehaus.org/groovy/HackingEclipsePlugin) as a source information for code-completion.