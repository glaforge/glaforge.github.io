---
title: "IntelliJ, as a team communication tool"
date: 2004-11-25T00:00:00.000+01:00
tags: [geek]
---

Everyday, when you work with your team mates, you exchange information through different communication channels. If you work in the same offices, you can simply speak and make stand-up meetings. If you work with different teams spread across different places, different buildings, or even different countries--especially true for Open Source projects--you can pick up your ([Skype](http://www.skype.com/)) phone, and write emails, or chat through instant messenging or IRC.

But sometimes, it feels a bit frustrating to use those archaic mediums. When you wish to share some code snippets, to study a stacktrace another developer got, to know on which files other developers are working on, the usual communication means feel less handy, less intuitive to use. So what could we do to improve that?

I've been thinking about that topic for a few years already, but so far, I've never found anything to my taste, and I somehow thought nobody had the same vision as I have. I believe we can do something to enhance our development tools to leverage the communication means we use everyday, but in a suboptimal way. Here comes [Kirill Maximov](http://www.maxkir.com/kirblog/), a [JetBrains](http://www.jetbrains.com/idea) developer, working in the [Fabrique ](http://www.jetbrains.com/fabrique)team. Kirill is starting the development of a cross-IDE plugin: a communication tool integrated within your IDE. He blogged about it on his weblog: he discusses the [ideas](http://www.maxkir.com/kirblog/2004/11/developers-communications-tool.html) we brainstormed together, and provides us with a[roadmap](http://www.maxkir.com/kirblog/2004/11/features-outline.html).

For the begining, the plugin should work on IntelliJ IDEA only, but it may be ported to other IDEs in the long term. And it will provide some basic features, such as:

*   IDEA as a primary platform
*   using P2P transports (IP-multicast as a first channel)
*   finding your online team mates
*   showing the presence status
*   managing user rosters
*   exchanging text messages (standard IM feature)
*   exchanging Java stacktraces
*   viewing files currently edited by other colleagues

In the following releases, some more high-level functionalities could be implemented:

*   porting to other IDEs (Eclipse, JBuilder or NetBeans)
*   using other transport layers (Jabber, P2P)
*   viewing idle time
*   broadcasting messages to all team members or sub-teams
*   chating with multiple colleagues
*   exchanging code snippets
*   code navigation (click on the stacktrace and jump in your code!)
*   sending unit tests
*   pair programming (the extremos will like that!)
*   diffing local and remote files
*   subscribing to events (when a colleague starts editing the file you're working on)
*   etc.

I'm looking forward to play with your plugin, Kiril! I wish you good luck, and I hope I'll be able to help you spread the word, and potentially give a coding hand.