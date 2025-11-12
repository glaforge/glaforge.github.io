---
title: "Builders in dynamic languages"
date: 2006-04-18T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2005/12/03/antbuilder-imitation-is-the-best-form-of-flattery.md"
  - "posts/2013/10/15/interview-about-groovy-s-popularity-boost.md"
  - "posts/2007/03/12/groovy-and-grails-news-conferences-and-ide-support.md"
---

[Groovy](http://groovy.codehaus.org/) introduced the concept of [builders ](http://www-128.ibm.com/developerworks/java/library/j-pg04125/)a few years ago, and it's great to see other dynamic languages borrow this concept. Functional languages have even already done things like that for decades! In the past, Groovy borrowed a lot of brilliant ideas to languages like Ruby or Smalltalk, and some times, that's the reversed situation where others seem to borrow ideas from Groovy.

*   [JRuby](http://jruby.sourceforge.net/) created a [clone of our AntBuilder](http://glaforge.free.fr/weblog/index.php?itemid=154&catid=2)
*   Ruby/Rails've got their own [Ruby builders](http://www.xml.com/lpt/a/2006/01/04/creating-xml-with-ruby-and-builder.html)
*   And I just came across an article today showing some builders in JavaScript as well with the [JavaScript DOM builder](http://www.vivabit.com/bollocks/2006/04/06/introducing-dom-builder)

[Grails](http://grails.codehaus.org/) also makes heavy use of the [builder concept](http://grails.org/Builders) by letting users easily create Hibernate criteria queries, define domain classes constraints, or specify AJAX XML fragments. The builder concept is really a creative way to create [fluent API](http://www.martinfowler.com/bliki/FluentInterface.html)s and [DSL](http://en.wikipedia.org/wiki/Domain-specific_language)s. I'm sure we'll find other great usage scenarios for it.