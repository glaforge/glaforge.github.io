---
title: "The JDK built-in web server with Apache Groovy"
date: 2017-11-20T16:38:29+01:00
tags:
- groovy
- java

similar:
  - "posts/2004/04/23/a-groovy-web-server.md"
  - "posts/2013/06/18/groovy-on-instantserver-io-thanks-to-gvm.md"
  - "posts/2026/02/11/zero-boilerplate-java-stdio-mcp-servers-with-langchain4j-and-jbang.md"
---

In my timeline, I saw a tweet from Joe Walnes about the built-in HTTP server available in the JDK since Java 6. It's super convenient, starts super fast, easy to use, but I often forget about it. I'd probably not use it for serving planet-wide load, but it's very useful when you need to create a quick service, a little mock for testing some web or micro-service.

Here's a little hello world for the fun.

I'm taking advantage of Apache Groovy's closure-to-functional-interface coercion support, as well as the `with{}` method to reuse the `HttpServer` instance for two method calls on the same instance (I could've used it for the `http` variable as well, actually).

```groovy
import com.sun.net.httpserver.HttpServer

HttpServer.create(new InetSocketAddress(8080), 0).with {
    createContext("/hello") { http ->
        http.responseHeaders.add("Content-type", "text/plain")
        http.sendResponseHeaders(200, 0)
        http.responseBody.withWriter { out ->
            out << "Hello ${http.remoteAddress.hostName}!"
        }
    }
    start()
}
```