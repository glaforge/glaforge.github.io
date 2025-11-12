---
title: "Groovy's birthday and news"
date: 2004-08-26T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2005/01/05/a-bit-of-groovy-history.md"
  - "posts/2005/06/30/javaone-groovy-reactions.md"
  - "posts/2006/07/15/groovy-grails-jsr-223-books-conferences-and-so-on.md"
---

A year ago, [James Strachan](http://radio.weblogs.com/0112098/) and [Bob McWhirter](http://blogs.codehaus.org/people/bob/) gave birth to [Groovy](http://groovy.codehaus.org/): a dynamic and agile scripting language for the JVM. Nobody really knows who is the father, and who is the mother, neither do we know how the fecundation happened. Anyhow, James always used to say that it was all Bob's fault, but indeed, James had so many groovy ideas that it's hard to believe it's not his own fault. He kept saying: "Wouldn't it be groovy if we could do this and that...". Hence the name "Groovy". That's roughly how it all started.

I wasn't involved in Groovy in the early days, but I came across groovy by reading some blog posts here and there. About a month after the first commits on Codehaus' CVS repository (Aug 28th), I looked closely at the code and at the (old) Groovy wiki. I read some interesting ideas, and I really got excited by that project. I really felt like it could fill some gaps in our J2EE stack and tool chain.

By that time, I was working for a company which was building a nice offering in the MDA market: you design a data-model with a Swing data-modeling application, you deploy this "metamodel" on the database of a kernel webapp hosted in a servlet container. And here you go, you have a working data-centric application, with complex and customisable list and item views, powerful search capabilities spanning several kinds of business objects, fine-grained role and profile authorisations, etc... In the developer version of this offering, there will be means for creating your own UI widgets that you can use in the forms used to edit your items. Those UI widgets are simply Java classes. But in order to create/edit/deploy them, the process is rather long and tedious, since you have to restart your webapp to reload them. At that point of the story, I really thought it would be nice to use Groovy to develop those widgets, without having to compile them and to reload your webapp. A nice gain at development time (especially since the customers themselves can write their own widgets).

There are many places where you can benefit from scripting languages in your projects. Whether it be Groovy, or any other scripting language for the JVM. I fell in love with some of the Groovy features, such as [native syntax for lists and maps](http://wiki.codehaus.org/groovy/SyntaxForTuplesListsMaps), [closures](http://groovy.codehaus.org/closures.html), markup, etc.

In decemeber 2003, I got involved in the development of Groovy, after I had submitted a few patches to improve Groovy's cleverness with regards to charsets and file encodings. Since then, I did various things, but a big part of my work was with all those [little groovy methods](http://groovy.codehaus.org/groovy-jdk.html) that help us being more productive. Things like `String.padLeft()` to `Url.getText()`, etc...

So what's the status right now, after one year? Groovy is already quite stable. It's not yet perfect, some features are still missing, but I use it on a daily basis to write some scripts, such as flushing some JMS queues, retrieving web resources and parse them to monitor particular changes, and I'm doing many other things with it as well.

A few months ago, [JSR-241](http://www.jcp.org/en/jsr/detail?id=241) was submitted to the JCP. This process will enable us to have a more formal process to define the language and will provide a default reference implementation. It will also give wider acceptance and trust, so that developers around the world may integrate Groovy within their projects with confidence. This process is currently moving slowly but surely, development of Groovy is also evolving accordingly till we settle on some language design decisions. But already, we're approaching consensus on some of the ideas which are debated. In the meantime, some nice byte-code optimsations have been done for instance, some great features may see the light of day in the future, such as AST macros, etc. Stay tuned!

The IDE integration is moving too: [Zohar Melamed](http://roller.anthonyeden.com/page/zohar) is working on the Eclipse plugin to make it work on Eclipse 3. A lot of changes happened in Eclipse's APIs which make this porting effort tougher than expected. And on my side, I'm teaming up with Franck Rasolo (developer of the [TestDox IDEA plugin](http://plugins.intellij.net/plugins/view/?id=Testdox%20IDEA%20Plugin)) to create a brand new full-featured IDEA IntelliJ plugin. So as I said in the previous paragraph: stay tuned!

For those who would like to learn Groovy by the book, you'll be glad to learn that different books are in the works at O'Reilly, Manning and other publishers. [John Wilson](http://www.wilson.co.uk/) is writing a "Groovy in Action", while Chris Poirier and myself are working on a "Learning Groovy". In mid 2005, you should have a lot to read!

After this little "status message", I wish a happy birthday to Groovy. I hope that all the developers already playing with Groovy and embedding it within their own apps are happy with it. Thanks again to James and Bob for having given birth to such a cute and useful project, thanks to all those great developers and friends I met thanks to this project. I wish you all a Groovy Birthday!