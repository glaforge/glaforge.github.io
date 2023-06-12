---
title: "From Bird to Elephant: Starting a New Journey on Mastodon"
date: 2023-06-09T10:53:29+02:00
type: "talk"
layout: "talk"
tags:
- mastodon
- twitter
- social-media
---

{{< speakerdeck 365d3694bd674bfa85d812d8c2fd32f9 >}}

At Devoxx France and Devoxx Greece, I had the pleasure to talk about my new social media journey on [Mastodon](https://joinmastodon.org/).
After a quick introduction about Mastodon and the [Fediverse](https://fediverse.party/), I contrasted the key differences between Twitter and Mastodon.
Then I shared some advice on how to get started, how to chose an instance, or clients you can pick from.

I moved on to important tips to get the best experience on the platform, and ensure to gather a great following:
* introduce yourself with a detailed bio and first #introduction post
* create your profile before following others
* configure your account so it can be discoveredn and recommended to others
* contrary to Twitter, you can verify yourself, showing that you own the personal links you share

Once your account is ready, if you are migrating from Twitter, you might want to find who among your friends have also migrated, so you can follow them in the fediverse.
I advise people not to delete their Twitter account, to avoid someone to pick up their old handle and to impersonate them.

Another aspect I like about the Mastodon platform is that it seems to care deeply about accessibility, and about people's possible troubles.
Putting _alt_ tags for images is highly encouraged on Mastodon.
Or putting content warnings on text and images also helps prevent unwanted content to jump at your eyse unexpectedly.

In a second part of the presentation, I spoke about the various standards and APIs underlying the Fediverse and Mastodon:
* [ActivityPub](https://www.w3.org/TR/activitypub/) and [ActivityStream](https://www.w3.org/TR/activitystreams-core/)
* [JSON-LD](https://json-ld.org/)
* [WebFinger](https://webfinger.net/)
* [MicroFormats](http://microformats.org/)
* [HTTP Sigantures](https://oauth.net/http-signatures/) and [OAuth 2](https://oauth.net/2/)
I went through an exchange between a client and a server, mimicking the actual process when you send a message to another recipient.
This is basically how to implement a basic ActivityPub server, based on Eugen Rochko's great [post](https://blog.joinmastodon.org/2018/06/how-to-implement-a-basic-activitypub-server/) on the topic.

The third and final part of the presentation was a comcrete demo on how to implement your own bots on Mastodon.
I showed how to create a service (a [Micronaut](https://micronaut.io/) application) that [calculates the potential reach]({{< ref "/posts/2023/01/06/calculating-your-potential-reach-on-mastodon-with-google-cloud-workflows-orchestrating-the-mastodon-apis" >}}) of your posts.
You can play with the service [online](https://stootistics.web.app/) and give it your account to see how popular your recent posts are.
And there's even an account ([@getmyreach@tooters.org](https://tooters.org/@getmyreach)) you can ping on Mastodon to get back the most popular of your posts.
The code is available on [Github](https://github.com/glaforge/stootistics) if you want to check it out.

You can check the recording of the talk in English from Devoxx Greece:

{{< youtube DafHAmlzWUM >}}

And in French at Devoxx France:

{{< youtube _BaK9BNlUHg >}}

