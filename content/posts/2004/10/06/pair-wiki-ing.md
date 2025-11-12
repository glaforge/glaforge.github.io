---
title: "Pair Wiki-ing"
date: 2004-10-06T00:00:00.000+02:00
tags: [geek]

similar:
  - "posts/2012/07/09/algorithms-for-collaborative-editing.md"
---

Ever had to work collaboratively, concurrently on the same document in real-time? So far, the offering for dealing with collaborative documents authoring is rather oriented towards an asynchronous mode.

You have Microsoft Word which allows you to make revisions, changes, highlights. You can use the good old email system by sending mails in a ping-pong way (no concurrent modifications allowed). You may also use a versioning system such as CVS or Subversion to edit documents in parallel and merge both work copies.

The lucky Mac owners also have SubEthaEdit which makes real-time modifications possible on the same document. But if you're under Windows, as far as I know, there's no application available which really provides such a level of collaborative features. I'll have to hear from persons using SubEthaEdit over the net, rather than over Wifi hotspots... Is it possible by the way?

[Jeremy Rayner](http://www.javanicus.com/blog2/) has created a little Java application called [NetPad](http://javanicus.com/blog2/items/113-index.html) that offers some real-time capabilities. But as we tried it over the net, it's not yet ideal, due to some network issues (time-outs and such, problem of content syncing when buffers differ).

By the way, today's Jeremy's Birthday! He's 0x20 years old! So, Mr Rayner, I wish you a very happy birthday, full of joy and geek gifts!

Jeremy and I had to work together on a document yesterday night. We are preparing a London meeting for the Groovy's JSR Expert Group and Groovy developers which will take place there in mid-november. We tried NetPad but weren't very successful, so we decided to have a mixed approach: chatting on IRC and at the same time using this little marvel called [Biscuit Barrel](http://javanicus.com/blog2/items/113-index.html). Biscuit is an incredible simple and light Wiki application, leveraging [Groovy](http://groovy.codehaus.org/) scripting and [Radeox](http://radeox.org/space/start) wiki-markup rendering from [SnipSnap](http://snipsnap.org/space/start) and Confluence fame. With it, you can even write dynamic macros, create dynamic pages and templates, integrate SiteMesh, etc... (there are obviously some professional wikis with such features as well, like [XWiki](http://www.xwiki.org/xwiki/bin/view/Main/WebHome): a very powerful GPL wiki). Though not a prime-time or scalable Wiki, Biscuit is pretty neat and snappy to use on your localhost, or within an intranet.

So Jeremy and I chatted on #groovy yesterday. We were editing a Biscuit page in a close to real-time manner. And IRC was used to pass each other the editing token. Once one of the two was "editing", the other should not edit it. Once the editor is "done", you can take the "editing" token. Simple solution for a complex system! With this brainstorming taking place, and a wiki to take notes, we really managed to have a very productive and entertaining session. Thus for near real-time collaboration on a document, it can be as simple as using IRC+Wiki.

How are you guys doing real-time collaborative authoring? Any tips, any software to try for that kind of constraints? I'm all ears and wish that a better solution exists. Otherwise I'll have to create my own some day!