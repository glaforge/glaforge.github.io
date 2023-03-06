---
title: "RIFE rocks the pants off of Rails"
date: "2005-03-18T00:00:00.000+01:00"
tags: [geek]
---

Rails is kinda cool. Any framework that ease the development of CRUD-oriented webapps is a real time saver. There's been a lot of well-deserved hype around Ruby on Rails lately. But I'm not sure that's really that revolutionary. I've always thought that a good Java Web framework can do the same. Perhaps with a few more lines of code, since we all know that Java tends to be more verbose than some scripting languages. But overall, does it really matter? Especially since you tend to be much more productive in Java with a top-notch IDE like [IntelliJ](http://www.jetbrains.com/)!

One of the nice little apps written with Rails is [Tada list](http://www.tadalist.com/): well, basically, that's, er... a ToDo list. That's hard to find a more verbose definition! To show that one can do the same things in Java, with a nice framework, [Geert Bevin](http://rifers.org/blogs/gbevin/) created a better clone of Tada: [Blabla List](http://blablalist.com/)!

Geert found some severe security issues with Tada, and with just 50% lines of code more than the Rail's equivalent, he nonetheless implemented the same features, but he also fixed the security problems of Tada, and even added a [REST API](http://rifers.org/wiki/display/BLA/REST+API), reorderable lists and drag'n drop support!

How did he do that in Java? He used [Laszlo](http://openlaszlo.org/) for the cute flash user interface, and the wonderful [RIFE](https://rife.dev.java.net/) framework which really rocks the pants off of Rails. Conclusion: A good Java MVC framework can do at least as good as Rails, if not better.

So now, you know what you have to do? Just [sign up for free](http://blablalist.com/) and start keeping track of your todos online!