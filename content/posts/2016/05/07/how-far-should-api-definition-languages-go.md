---
title: "How far should API definition languages go?"
date: 2016-05-07T00:00:00.000+02:00
tags: [web-apis]
---

I had the pleasure of writing an [article](http://nordicapis.com/how-far-should-api-definition-languages-go/) for Nordic APIs on Web API definition languages.  

If you're into the world of Web APIs, you've probably heard of formats like [Swagger](http://swagger.io/), [RAML](http://raml.org/) or [API Blueprint](https://apiblueprint.org/). They allow developers to define the contract of the API, with its endpoints, its resources, its representations, allowed methods, the kind of payloads it understands, the status codes returned, and more.  

With the contract of your Web API, you can generate code for your backend implementation or client kits, documentation for publishing the details of your API for your API consumers. This contract becomes a key element of your API strategy: a contract between the frontend team and backend team to be sure to work on the same ground, between your tech team implementing the public API of your company and all the API consumers that will interact with it.  

But API definition languages don't necessarily denote all the fineness of your API, in particular its business rules, or how to check that an implementation conforms to a contract or if the implementation follows the style guides of your company, what tests could exhibit the behavior of the API, and more. So the questions I asked myself was [how far should API definition languages go](http://nordicapis.com/how-far-should-api-definition-languages-go/)!