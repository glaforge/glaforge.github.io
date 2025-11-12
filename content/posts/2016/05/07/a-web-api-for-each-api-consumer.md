---
title: "A web API for each API consumer?"
date: 2016-05-07T00:01:00.000+02:00
tags: [web-apis]

similar:
  - "posts/2016/03/13/one-api-many-facades.md"
  - "posts/2016/04/27/how-far-should-api-definition-languages-go.md"
---

At our disposal, we have so many ways to interact with an API: from a mobile on iOS or Android, from a web application, or from other services or microservices. And all of them have different needs: one wants only a shallow overview of the data, while the other desires a detailed view of a certain resource and all its sub-resources. It's becoming difficult to design an API that caters to the needs of those varied consumers.  

So what can we do? There's a trend around providing different API facades for each consumer, as Netflix does with its [experience and ephemeral APIs](http://www.infoq.com/articles/api-facades), or how Sam Newman described it in its [Backends for Frontends](http://samnewman.io/patterns/architectural/bff/) pattern. But such an approach increases the maintenance burden and complexity, and might only really make sense for big enough teams.  

Other approaches exist for customizing payloads for different consumers, without really providing as many derived API facades as you have API consumers. You can take advantage of the Prefer header, fields filtering, custom Mime media types, hypermedia, or Facebook's GraphQL approach.  

I've written an article for InfoQ that dives into this topic, and covers all those subjects: "[One API, many facades](http://www.infoq.com/articles/api-facades)".