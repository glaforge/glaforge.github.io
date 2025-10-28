---
title: "Scripting ActiveX/COM components with Groovy"
date: 2004-12-30T00:00:00.000+01:00
tags: [groovy]
---

During my three weeks break before my next job, I decided I'd work on two things: first, I'll play with Groovy a little more (playing != fixing bugs like mad like those last two months to get beta-8 out in the wild), and I'll work on my "Learning Groovy" book for O'Reilly.

In this blog post, I'll talk about my last two days playing with Groovy and... [Jacob](http://danadler.com/jacob/), a Java COM Bridge library developed by [Dan Adler](http://danadler.com/), to interact with Windows components. So, of course, it's Windows-only.

I created [Scriptom](http://groovy.codehaus.org/COM+Scripting): a new module (optional Groovy component) that allows you to script any COM or ActiveX component with Groovy. That is you can control applications like Internet Explorer or Excel with groovy scripts.

Groovy's metaprogramming facilities make it a language of choice for doing some funny stuff like writing transparent proxies, mock objects, or other wacky stuff, like our builders (Ant builder, Swing builder, or Markup builder). You can intercept calls to non-existant methods and make them do something for you, like creating a new tag, or an Ant task, etc.

Being able to write some meta-object was the key to this problem of interoperability between Groovy and COM components. I wrote a pair of classes implementing [GroovyObjectSupport](http://cvs.codehaus.org/viewrep/~raw,r=1.3/groovy/groovy/groovy-core/src/main/groovy/lang/GroovyObjectSupport.java), to make a kind of proxy around some of the Jacob internals. So any call to a method or property of my proxy would delegate the call to the foreign component. But let's stop chatting about the inner workings, and let's see some examples of what we can do!

First of all, if you wanna play with Scriptom, the best thing is to go [read the documentation](http://groovy.codehaus.org/COM+Scripting)! Everything is explained: how to get it, how to install it, and some samples are there as well for good measure. Scriptom's been tested on groovy-1.0-beta-8 and Windows XP Home Edition.

As everything is explained in the documentation, I won't show you all the examples, but let's just look at the one for scripting Internet Explorer:

```groovy
import org.codehaus.groovy.scriptom.ActiveXProxy

// instanciate Internet Explorer
def explorer = new ActiveXProxy("InternetExplorer.Application")
// set its properties
explorer.Visible = true
explorer.AddressBar = true

// navigate to a site by calling the Navigate() method
explorer.Navigate("http://glaforge.free.fr/weblog")
```

You're using Internet Explorer as if it were a standard Java or Groovy object! Pretty neat, uh?

There are several other examples in the documentation and in the sources. If ever an application provides some ActiveX or COM components, you can script it with Groovy. For instance, you could suck up some data from a database with Groovy SQL, and write an Excel spreadsheet with formulas to manipulate the data. Or you can script Media Player to make it play all the sounds in a given directory that you'd have chosen with a native Windows folder chooser, etc. Many possibilities that all the VBScript gurus and Windows Scripting Host admins will like. Moreover, you can interact with Java and Groovy. So you have the best of both worlds: the JVM world and its wealth of libraries, and the native Windows world.

I've chosen Jacob over JCom because it seems to be able to allow us to wire our own event handlers, which is not possible with JCom, as far as I know. So my next step will be to provide some funky way of writing our own event handlers in Groovy, probably with some closures... Stay tuned!

That's fun, and I hope you'll enjoy playing with Scriptom! That's my late Christmas gift to you!