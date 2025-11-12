---
title: "Groovy.Net, annotations, mocks, applet, and so on"
date: 2007-04-29T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2007/04/30/groovy-1-1-beta-1-with-annotation-support.md"
  - "posts/2007/03/12/groovy-and-grails-news-conferences-and-ide-support.md"
  - "posts/2005/06/30/javaone-groovy-reactions.md"
---

After [Groovy won the JAX 2007 innovation award](http://glaforge.free.fr/weblog/index.php?itemid=210), I took some time to look at what was going on in the blogosphere. There's always a lot of activity in the Groovy-sphere. It never ceases to amaze me how prolific the community is. Let's list some of the interesting posts I've come across this week-end.

*   Chanwit managed to make [Groovy run on .Net!](http://chanwit.blogspot.com/2007/04/groovy-running-fine-on-net.html) This is pretty cool IMHO. He used IKVM for that. You'll have to try it out.
*   Alex shows how to use the native Groovy mocks to [mock properties](http://themindstorms.blogspot.com/2007/04/groovy-mocks.html).
*   Andres has created a special [Groovy applet](http://www.jroller.com/page/aalmiray/?anchor=live_grapplet_test) to let you write Groovy code in your script tags in your HTML pages!
*   Glen is [having fun](http://blogs.bytecode.com.au/glen/2007/04/28/1177707183592.html) with [Scriptom](http://groovy.codehaus.org/COM+Scripting) (Groovy COM/ActiveX module) to synchronize his [Remember the Milk](http://www.rememberthemilk.com/) todo list, with Outlook.
*   Danno is [comparing the upcoming Java closure notation with Groovy's closure notation](http://shemnon.com/speling/2007/04/colosures-in-java-too-much-typ.html). I'm sure you'll easily know which one is the sexiest and how a language that supports weak typing can be more concise and expressive.
*   Warner experiments with [Higher-Order Messaging](http://www.warneronstine.com/blog/articles/2007/04/27/my-groovy-hom-take-2) with a Groovy implementation.

Next week should be pretty interesting too as we're going to release the first beta of **Groovy 1.1** in time just before [JavaOne](http://java.sun.com/javaone/sf/index.jsp) where there will be a lot of sessions dedicated to [Groovy](http://www28.cplan.com/cc158/sessions_catalog.jsp?ilc=158-1&ilg=english&isort=&isort_type=&is=yes&icriteria1=+&icriteria2=+&icriteria7=+&icriteria9=&icriteria8=groovy) and [Grails](http://www28.cplan.com/cc158/sessions_catalog.jsp?ilc=158-1&ilg=english&isort=&isort_type=&is=yes&icriteria1=+&icriteria2=+&icriteria7=+&icriteria9=&icriteria8=grails). Groovy will be the first alternative language for the JVM to support some Java 5 features. **Groovy 1.1 supports annotations and static imports**. If you plan to use another language than Java and leverage other key frameworks using annotations like [Spring](http://www.infoq.com/news/2006/12/spring-config), [EJB 3 / JPA](http://www.curious-creature.org/2007/03/25/persistence-made-easy-with-groovy-and-jpa/), [TestNG](http://groovy.codehaus.org/Using+TestNG+with+Groovy) or [Guice](http://glaforge.free.fr/weblog/index.php?itemid=208), your best option will be Groovy as it will be the sole alternative language supporting those frameworks.