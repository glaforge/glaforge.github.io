---
title: "Groovy code-completion in IntelliJ"
date: 2005-01-26T02:00:00.000+01:00
tags: [groovy]

similar:
  - "posts/2004/04/30/intellij-ssh2-finally-finds-its-way.md"
  - "posts/2005/07/01/initial-release-of-the-groovyj-intellij-plugin.md"
  - "posts/2005/06/19/groovy-development-aiming-for-quality.md"
---

JetBrains improved the custom file type support in IntelliJ, in the Irida EAPs. If you have defined your Groovy syntax file correctly, you can have syntax highlighting, brace highlighting, and even... code-completion!

In my [Groovy syntax file](http://glaforge.free.fr/groovy/Groovy.xml) (which works in [Irida #3185](http://www.intellij.net/eap/products/idea/download.jsp)), I defined two sets of keywords: one for the keywords of the language, and the other one for the [Groovy methods](http://groovy.codehaus.org/groovy-jdk.html), like each(), findAll(), etc. And guess what? Simply hit CTRL-Space as usual, and presto, you can complete your code.

Here is a little picture of what it looks like:

![](/img/misc/groovyIntelliJ.jpg)

The completion works only for keywords and the [Groovy methods](http://groovy.codehaus.org/groovy-jdk.html), but until someone develops a Groovy plugin for IntelliJ IDEA, this basic completion rocks!