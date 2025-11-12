---
title: "A groovy web server"
date: 2004-04-23T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2017/11/20/the-jdk-builtin-web-server-with-apache-groovy.md"
  - "posts/2004/03/03/heads-up-on-file-and-stream-groovy-methods.md"
  - "posts/2004/02/05/groovy-jdk-doc-parsing-java-with-qdox.md"
---

Based on a suggestion made by Jamie McCrindle, I decided it was time to add some missing [Groovy methods](http://groovy.codehaus.org/groovy-jdk.html) related to sockets.

So far, I have added a [bunch of IO/streams methods](http://glaforge.free.fr/weblog/index.php?itemid=74) enhancing the JDK core classes, but there were no methods dealing with sockets. But now, this time is over.

I have added two methods:

*   Socket.withStreams(Closure) which takes a closure as argument, and has acces to an input stream and an output stream, and
*   ServerSocket.accept(Closure) which takes a closure argument which uses a socket as argument

What's better than a sample code to illustrate that ? Hey, we're going to implement a simplistic Hello World web server. Here it is...

```groovy
import java.net.*

def server = new ServerSocket(9991)

while(true) {
  server.accept { socket ->
    socket.withStreams { input, output ->
      try {
        input.eachLine { line ->
          println line
          if (line.length() == 0) {
            throw new GroovyRuntimeException()
          }
        }
      } catch (GroovyRuntimeException b) { }
      output.withWriter { writer ->
        writer << "HTTP/1.1 200 OK\n"
        writer << "Content-Type: text/html\n\n"
        writer << "Hello World!"
      }
    }
  }
}
```

Enjoy!

Thank you Jamie for your code ;-)

**Update 2013/02/20:** I've tweaked the above script to use the proper closure syntax that we settled with in Groovy 1.0