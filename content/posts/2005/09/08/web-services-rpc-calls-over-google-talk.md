---
title: "Web services RPC calls over Google Talk"
date: "2005-09-08T00:00:00.000+02:00"
tags: [groovy]
---

With the recent release of [Google Talk](http://www.google.com/talk/), the fine chaps at Google entered the Instant Messenging market. The most clever step in that direction was their choice of protocol for their IM solution: [XMPP](http://www.xmpp.org/). XMPP was popularized and standardized through the IETF by the [Jabber](http://www.jabber.org/) software foundation with its famous _open, secure, ad-free alternative to consumer IM services like AIM, ICQ, MSN, and Yahoo_ (quoted from their site).

A particular benefit of choosing an open platform is that it takes advantage of available client GUIs for instance, and moreover, it can leverage specific and standardized extensions of the XMPP protocol -- called JEPs. The Jabber foundation developed an interesting set of complementary protocol extensions by allowing custom XML payloads to be developed. And there's one JEP of interest for us today: [JEP-0009](http://www.jabber.org/jeps/jep-0009.html). This JEP defines a method for transporting XML-RPC encoded requests and responses over Jabber/XMPP.

[JiveSoftware](http://www.jivesoftware.org/) developed a Jabber library called [Smack](http://www.jivesoftware.org/smack/) that you can use to "speak XMPP"! They recently [improved this library](http://www.jivesoftware.org/smack/smack_gtalk.jsp) to support Google Talk pecularities (TLS/SSL connection). With this library, we can also build our own payloads to support JEP-0009 and to programmatically make RPC calls.

Final point to glue everything together: my brilliant friend [John Wilson](http://www.wilson.co.uk/), who wrote the [Groovy XML-RPC](http://groovy.codehaus.org/Groovy+XML-RPC) module, built upon the Smack library and its XML-RPC code to add XML-RPC support through Google talk! Groovy's XML-RPC is particularly easy to use to expose XML-RPC services through some clever use of closures in Groovy. That means it's now possible to do [remote procedure calls through Jabber](http://groovy.codehaus.org/Groovy+Jabber-RPC).

After all these presentations, it's high time to hack some code, isn't it? Let's create a simple echo service, which will simply echoes whatever we send to it.

Let's write the server:

```groovy
import groovy.net.xmlrpc.*
import org.jivesoftware.smack.GoogleTalkConnection

def srv = new JabberRPCServer()

// here is our echo service, that's a simple closure method!
srv.echo = { return it }

// let's start the server
def serverConnection = new GoogleTalkConnection()
serverConnection.login("serverId", "serverPassword")
srv.startServer(serverConnection)

// let the server run for 60 seconds
while(true) { sleep 60*1000 }
```

Now that we've written the server, it's time to create our client:

```groovy
import groovy.net.xmlrpc.*
import org.jivesoftware.smack.GoogleTalkConnection

// let's connect to Google Talk
def clientConnection = new GoogleTalkConnection()
clientConnection.login("clientId", "clientPassword")

// create a transparent proxy around the remote service 
def serverProxy = new JabberRPCServerProxy(clientConnection, "serverId@gmail.com")

// it's time to call our service as if we were manipulating a local object
println serverProxy.echo("Hello World!")
println serverProxy.echo(345)
```

Currently, the improved Groovy XML-RPC library is in CVS Head only, so if you're impatient and can't wait for a new Groovy release, you'll have to build it yourself from sources! You propably also noticed you need two GTalk buddies who've authorized each other to make this sample work.

A good question to ask yourself is _"uh, well, cool, but what can I do with that?"_ Here's a potential use case John told me about where you could want to use Groovy's XML-RPC support over Google Talk :

> Some people want to use VNC to manage their home server, however you do not want to open a port on your firewall to allow VNC access from the internet (VNC is not very secure). The VNC server will "reverse connect" to an external client. So you could run a jabber RPC server which launched the VNC server telling it to reverse connect to your external machine

I can also imagine some other use cases, like:

*   triggering Continuous Integration servers which would support Jabber's XML-RPC support
*   doing some home automation to make you house warm when you come back from work in a cold winter
*   etc.

There are many possibilities, and I'm sure others will find some clever use cases for that. I can imagine Google Talk providing some cool services as well in the future, and I'm pretty sure they will.

You may also wonder why not using raw XML-RPC or standard SOAP for these kind of services? That's another possibility, of course. It's up to you to use whatever protocol you want after all, but I thought it'd be interesting to show you how we can leverage Google's own Jabber infrastructure. Moreover, you don't have to open a port on your firewall to allow access to a given port (safe against port scanning), nor you have to have a DNS entry for the machine hosting the service: all goes through the Google Talk server.

I hope you enjoyed this little funny toy. It may have brought to you a glimpse of what services Google could provide through its open and extensible platform.