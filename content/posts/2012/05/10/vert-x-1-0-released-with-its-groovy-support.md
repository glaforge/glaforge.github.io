---
title: "Vert.x 1.0 released with its Groovy support"
date: "2012-05-10T00:00:00.000+02:00"
tags: [groovy]
---

[Tim Fox](https://twitter.com/#!/timfox) yesterday announced [the release of Vert.x 1.0](http://vertxproject.wordpress.com/2012/05/09/vert-x-1-0-final-is-released/).  

[Vert.x](http://vertx.io/) is a kind ofasynchronous application development environment and server. It works on the JVM, with JDK 7, and supports several languages like Java, [Groovy](http://vertx.io/groovy_web_tutorial.html), Ruby or JavaScript.  

As the website puts it, vert.x can be defined along the following axis:

*   **polyglot**: supporting Java, Groovy, Ruby and JavaScript or a mix and match of any of these even in a single application
*   **simplicity**: just a few lines of code to create your servers and components, without any XML configuration or anything like that, without being too simplistic
*   **scalability**: with Netty under the hood, with a message passing approach, it's taking full advantage of the cores of your CPU(s)
*   **concurrency**: vert.x provides a simple concurrency-model so you don't mess with traditional multithreaded programming

Vert.x competes directly with Node.js here, and Tim also positions it against the Play! 2 / Akka combo.  

What's also worth looking at is the [benchmark](http://vertxproject.wordpress.com/2012/05/09/vert-x-vs-node-js-simple-http-benchmarks/) that he ran against Node.js, showing that vert.x clearly outperforms Node.js. Also interesting is the fact that when using Groovy, there's just a very small overhead over using Java, although the simple benchmark didn't even use the upcoming static compilation feature of Groovy 2.0.  

Congratulations to the vert.x team for the release!  

I'm impatient to play with it on [Cloud Foundry](http://cloudfoundry.com/), once it supports JDK 7.