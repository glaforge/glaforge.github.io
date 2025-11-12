---
title: "IntelliJ : SSH2 finally finds its way..."
date: 2004-04-30T00:00:00.000+02:00
tags: [geek]

similar:
  - "posts/2004/01/13/cvs-and-ssh2-not-so-easy.md"
  - "posts/2005/01/26/groovy-code-completion-in-intellij.md"
  - "posts/2004/06/12/jetbrains-fashion-victim.md"
---

I've been waiting for that for months already. I've been whining and whining again about the lack of an internal SSH2 implementation in IntelliJ. And now, it is there!

As you perhaps already know by reading my weblog, I'm a [Groovy](http://groovy.codehaus.org/) developper. And the Groovy project is hosted at [Codehaus](http://www.codehaus.org/) which makes use of SSH2 for accessing the CVS repository.

I had tried, but without success, [different alternatives](http://glaforge.free.fr/weblog/index.php?itemid=63), such as using Putty/pling/pageant, but I didn't manage to create a connection. So I ended up using Thomas Singer's wonderful [SmartCVS](http://www.smartcvs.com/). This tools sort of [saved my life](http://glaforge.free.fr/weblog/index.php?itemid=64). I'm very grateful to you Tom...

But now, IntelliJ supports SSH2 out of the box! At first glance, I didn't even noticed, because I was used to see the different supported methods: pserver, local, ext and SSH. But Robert S. Sfeir showed me the way on the newsgroups by telling me it was there... Uh? He must be kidding ? Well, no, he wasn't, when in the CVS SSH panel, now there's a radio button to choose between SSH1 and SSH2, and you can choose your private key. The only little omission though, is that you have to type by hand the full type to your private key because there's no button for choosing the path from a dialog box. But I'm sure it'll be fixed in the next release.

Thank you JetBrains (and in particular Olesya) for your great work on such a great product!