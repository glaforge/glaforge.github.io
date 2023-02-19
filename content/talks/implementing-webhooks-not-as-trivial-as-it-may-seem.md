---
title: "Implementing Webhooks, not as trivial as it may seem"
date: 2019-11-25T16:58:28+01:00
type: "talk"
layout: "talk"
tags:
- web
- apis
- webhooks
- rest
---

You've certainly interacted with **webhooks** at some point: with a Github commit webhook, for Slack or Dialogflow chatbots, for being notified of Stripe payments, or when you receive an SMS via Twilio. The concept is fairly well known, but there are some roadblocks along the way, whether you implement a webhook handler (the URL being called) or a webhook backend (the service notifying URLs). It's not necessarily as trivial as it may first seem. As I've been interested in Web APIs for a long time, I decided to look into this topic a bit more, by working on a new talk.

## Videos

I've had the chance of giving this talk at GeeCON Prague:

{{< youtube hRz38zGPSAU >}}

As well as (in French) at BDX.IO:

{{< youtube DRf7-dmhNHA >}}

You can also watch the slide deck here:

{{< speakerdeck b89328ff810c4955a8c2427d05f18bed >}}

## Summary

Initially, I was focusing on the backend webhook implementation aspects, but both the sending and receiving ends of webhooks have their own challenges.

Let me name the ones I encountered.

On the handler / client / receiving side, your webhook handlers should:

-   Reply with a 200 HTTP status code, to let the service provider know that you successfully received the event notification.
-   Reply fast, so that the service provider doesn't have to keep as many open connections to the handlers, to let it scale more gracefully to more customers. So a good approach is to acknowledge the reception of the event, but treat that event asynchronously afterwards.
-   Ack reception and defer event handling, as mentioned above when replying fast, it's important to "ack" quickly the reception, and then you're free to do long event handling afterwards, potentially with some worker queue, with workers that can treat those events at their own pace. You can then scale your workers pool when you need to deal with more notifications.
-   Calls should be idempotent. Sometimes, for various reasons, it's possible you get event notifications twice for the same event.
-   Use IP whitelisting, when possible, to ensure that only some IP addresses can ping your handler. Since you're opening an URL to the public, better be sure that it's only the service provider that calls you. But it's not always possible to define such a whitelist, as IP addresses are not necessarily fixed for the service provider.
-   Check request signature, this time not to avoid a DDoS, but more to ensure the integrity of the event payload that you receive. More on signatures in the server part below.
-   Take advantage of serverless solutions, as sometimes, you don't get a frequent or regular flow of event notifications, why have a server running all the time? Instead, you can take advantage of serverless solutions, like [App Engine](https://cloud.google.com/appengine/) or [Cloud Run](https://cloud.google.com/run/), as you're only billed for the time used.

On the service provider / server / notifier side, your webhook backend should:

-   Send small data payloads, instead of the whole resource that triggered the event. For instance, your service might notified handlers that there's a new video available. But you don't want to send tons of gigabytes of videos to each and every handler subscribed to that event. So just send a reference to that resource, and keep the event payload small.
-   Timeout if client is too slow, as you can't wait forever for a faulty handler to reply. Cut the connection if the client handler doesn't reply under a set time interval, and treat this as if the message hasn't been successfully delivered. Which means you'll have to retry sending that event later on.
-   Retry sending events with exponential backoff, to not overload a handler which is struggling to keep pace, in order to avoid DDoS-ing it with your retries. Instead, use exponential backoff to try to redeliver, for example, after 1s, 2s, 4s, 8s, 16s, etc. 
-   Keep track of non-responding handlers, after too many failed delivery attempts, mark those handlers as non-responding, and perhaps somehow notify the creator of the handler that it's not responding correctly.
-   Deliver messages from a work queue, as you have potentially tons of subscribers interested in your events, you don't want your event loop to be taking longer and longer to operate as the number of handlers grow, and instead, offload the work to some worker queue that you can scale independently from the work of keeping pace with ongoing events flow.
-   Batch events when too frequent, when there are too many event notifications to send. It might be more costly to send each and every event as they come, in real-time. If there are too many events, you can group them in one batch, so as to deliver them at an increased interval of time to your handlers.
-   Use a dead letter queue, for auditing purpose in particular. For non-responding handlers, or in case of handlers sometimes miss some events, you can push those never-received events in a dead letter queue, so that later on handler developers can check it to see if they actually missed something at some point in the flow.
-   Use HTTPS for secured connections, well, everyone should use HTTPS all the time these days anyone, but it's better for avoiding man-in-the-middle attacks, to avoid events replay, etc.
-   Sign requests with a secret, when handlers and service providers share a common secret, the provider can signe the request it sends to handlers, so that handlers can check the message is really coming from the service provider. For example, the Github API is using an HMAC signature, with a SHA-1 digest.
-   Use proper authentication/authorization mechanisms. This one is a bit vague, but the usual authentication/authorization best practices still apply to webhooks!

Going further, I'd like to expand this presentation with more hands-on concrete demos, that put all those best practices into action, and perhaps create some animations to show what happens when handlers are flooded with notifications, when handlers don't respond rapidly enough, etc, as that would probably help visualise more concretely each of those problems or practices. Let's see how I can continue iterating and improving this presentation and topic!

Resources

Last but not least, there are some great resources available on the topic, that I've added at the end of my slide deck. Be sure to check them out as well:

-   [Crafting a great webhooks experience](https://speakerdeck.com/apistrat/crafting-a-great-webhooks-experience-by-john-sheehan) (John Sheehan)
-   [WebHooks: the definitive guide](https://requestbin.com/blog/working-with-webhooks/)
-   [WebHooks: The API Strikes Back](https://www.infoq.com/presentations/webhooks-api/) (InfoQ)
-   [Webhooks vs APIs](https://hackernoon.com/webhook-vs-api-whats-the-difference-8d41e6661652)
-   [What is a Webhooks push-style API & how does it work](https://www.programmableweb.com/news/what-webhooks-push-styled-api-and-how-does-it-work/analysis/The2017/03/28) (ProgrammableWeb)
-   [Webhooks do's & dont's: what we learned after integration 100+ APIs](https://restful.io/webhooks-dos-and-dont-s-what-we-learned-after-integrating-100-apis-d567405a3671)
-   [How & why Pusher adopted Webhooks](https://www.programmableweb.com/news/what-are-webhooks-and-how-do-they-enable-real-time-web/2012/01/30)
-   [Webhooks vs WebSub: Which Is Better For Real-Time Event Streaming?](https://nordicapis.com/webhooks-vs-websub-which-one-is-better-to-stream-your-events-in-real-time/)
-   [Webhooks, the devil is in the details](https://techblog.commercetools.com/webhooks-the-devil-in-the-details-ca7f7982c24f)
-   [How to design a webhook for my API](https://phalt.github.io/webhooks-in-apis/)
-   [Serverless webhooks to revolutionize the SaaS](https://tomasz.janczuk.org/2018/03/serverless-webhooks-to-revolutionize-the-saas.html)