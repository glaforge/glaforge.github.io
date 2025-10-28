---
title: "Groovy 1.5 released"
date: 2007-12-07T00:00:00.000+01:00
tags: [groovy]
---

[G2One, Inc.](http://www.g2one.com/), the Groovy & Grails professional services company, and the Groovy development team are proud to announce the release of Groovy 1.5.  
  
Groovy is a **dynamic language for the JVM that integrates seamlessly with the Java platform**. It offers a **Java-like syntax**, with language features inspired by Smalltalk, Python or Ruby, and lets your reuse all your Java libraries and **protect the investment you made in Java skills, tools or application servers**. Groovy can be used for various purposes, from adhoc shell scripting leveraging Java APIs, to full-blown web applications built on Spring and Hibernate through the [Grails](http://grails.org/) web framework. It can also be integrated very easily in your applications to externalize business logic, create **Domain-Specific Languages**, or to provide templating, XML parsing capabilities, and much more.  
  
This major release integrates features offered by Java 5: **annotations, generics, static imports** and **enums**, making Groovy the sole alternative dynamic language for the JVM that lets you leverage frameworks that use annotations like **Spring**'s @Transactional or **JBoss SEAM** which both provide extended Groovy support, or generics to help **JPA** or **Hibernate** properly handle typed collections.  
  
In this release, **new meta-programming capabilities** have been contributed thanks to the work of the Grails project developers, pursueing our symbiotic relationship. A few syntax enhancements have also found their way into it to help **ease the development of Domain-Specific Languages**. A great attention to **performance improvements** made this new version much snappier than before, as witnessed by a reports we had by teams working on mission-critical applications using Groovy as a business language.  
  
Since Groovy 1.0, the team also worked on improving the tool chain by creating a **joint Java / Groovy compiler** to let you mix and match Groovy and Java classes in the same compilation step. A**GroovyDoc** equivalent to JavaDoc lets you document your Groovy classes. The **interactive shell** is now really interactive and provides useful command completions for making you more productive, and the**Groovy Swing console** has also been improved thanks to our talented Swing team and the help of Swing expert Romain Guy.  
  
Apart from improvements or the creation of these new tools, you should have a look at JetBrains' JetGroovy, a fantastic **Groovy and Grails plugin** which provides advanced coding capabilities to IntelliJ IDEA:  

*   **syntax highlighting**,
*   **code completion**,
*   **scripts and unit tests running ability**,
*   **debugging capabilities**,
*   and even **refactorings**!

Of course, if you're an Eclipse user, you can still use the Groovy Eclipse plugin, or Sun's work in progress NetBeans plugin for Groovy and Grails.  
  
An upcoming article on InfoQ that will be published in the following days will detail the novelties of this new version in more depth. So, please stay tuned!  
In the meantime, you can listen to the [interview of Groovy Project Manager](http://www.infoq.com/news/2007/12/interview-laforge-groovy) and G2One VP Technology Guillaume Laforge that was recorded at QCon 2007, in March, in London or read [G2One's team interview](http://www.javalobby.org/java/forums/t103434.html) on JavaLobby.  
  
I would like to thank everybody who was involved in this release in a way or another: the Groovy developers for their hard work, patch and documentation contributors, users reporting bugs or requesting new features or improvements, book authors.  
  
Several well-known companies have put great efforts in helping us making Groovy what it is today:  

*   **IBM**: Eclipse plugin improvements and upgrade to support this latest version of the language,  
    
*   **Oracle**: JMX support improvements to call remote beans as if they were local,  
    
*   **Sun**: Rooms for our developer meetings, and a wonderful 8-core 8-CPU machine for our high-load concurrency testing,  
    
*   **JetBrains**: for the joint java/groovy compiler & their awesome plugin,  
    
*   **JBoss**: for their help on ironing out our support for annotations and generics.

It would be impossible to list everybody, but you're all part of this effort, and you made the success of Groovy, and the quality of this new milestone. Thanks and well done to you all!  
  
You can read the detailed [JIRA release notes](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&styleName=Html&version=13904) of the changes since the last release candidate:  
  
And now, just download Groovy 1.5 and give it a try:  
[http://groovy.codehaus.org/Download](http://groovy.codehaus.org/Download)  
  
\--  
Guillaume Laforge  
Groovy Project Manager  
Vice-President Technology at G2One, Inc.  
[http://www.g2one.com](http://www.g2one.com/)