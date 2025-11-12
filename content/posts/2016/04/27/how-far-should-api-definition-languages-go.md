---
title: "How far should API definition languages go"
date: 2016-04-27T14:46:34+01:00
tags:
- web
- apis
- rest
- openapi
canonical: "https://nordicapis.com/how-far-should-api-definition-languages-go/"

similar:
  - "posts/2016/05/07/how-far-should-api-definition-languages-go.md"
  - "posts/2016/03/13/one-api-many-facades.md"
  - "posts/2016/05/07/a-web-api-for-each-api-consumer.md"
---

![How-far-should-api-definition-languages-go](https://nordicapis.com/wp-content/uploads/How-far-should-api-definition-languages-go-1.png)

The most common API definition languages we spot in the wild are [Swagger](https://swagger.io/) / [OpenAPI Spec](https://openapis.org/), [RAML](https://raml.org/) and [API Blueprint](https://apiblueprint.org/). All three let you define your endpoints, your resources, your query or path parameters, your headers, status codes, security schemes, and more.

In a nutshell, these definition languages define the **structure** of your API, and allow you to describe many **elements**. As standards in the API industry evolve, however, their purpose and design are under continuous scrutiny. Specifically, the extensibility of API specifications with additional elements and feature sets comes into question.

Recently, a discussion sparked on the [Open API Specification](https://nordicapis.com/open-api-initiative-means-api-space/) issue tracker about the [Open World vs Closed World principles](https://nordicapis.com/evolution-openapi-specification-openapi-mean-open-world/). In a nutshell, the question is whether an API definition is supposed to describe an API fully (including, for example, the paths that you're not allowed to access, all the possible status codes, etc.) or whether it is just a best effort to describe what's usable and needed by most API consumers --- not necessarily covering the whole scope of the API.

All the recent conversation has us thinking --- **how detailed should API definitions be**?. One can dream up many other uses for an API definition language:

-   API definitions could bring additional information or documentation, with a narrative and more metadata describing the flow of API calls, how the callers will be able to interact with the API.
-   API providers can bring such extra metadata for the purpose of API discovery, to give credits (about IP or copyright information), perhaps residing in external descriptors like [APIs.json](https://apisjson.org/) (a format to help discover metadata about an API).
-   JSON payloads comply with JSON schemas, but data models could be defined regardless of the media types being chosen by the consumer, so that the consumer could actually request any output format, but still understand the intrinsic nature of the resources which are dealt with.
-   There are often common traits spreading across an API, for example how to do pagination, and some API definitions are able to factor this common aspect in a reusable and referenceable fashion.
-   Hypermedia APIs are not necessarily well covered in terms of modeling throughout the most common API specifications, there's certainly something to be improved here.
-   Another interesting topic is also about how to ensure that an API implementation conforms with its API definition, or follows some some good conventions or company guidelines. Tooling could be provided to help with this task.

[RAML is approaching 1.0](https://raml.org/blogs/update-raml-10-current-status), [OpenAPI Spec is being worked on](https://github.com/OAI/OpenAPI-Specification/issues?q=is%3Aissue+is%3Aopen+label%3A%22OpenAPI.Next+Proposal%22) with a list of issues detailing what to expect, and [API Blueprint published its roadmap](https://github.com/apiaryio/api-blueprint/wiki/Roadmap). As our favorite specifications will soon see interesting evolutions, it's a great time to revisit the dialectic on API definition language design.

Let's look a little bit closer at some of the propositions above to see if API definitions provide solutions, and discuss if it's even the purpose of an API definition language to do these sort of things. What could we build into the next generation of API specifications to make them truly remarkable?

## API Storytelling: Modeling Multi-Step Transactions within Documentation

API providers need to be storytellers. When you design an API for a user base, you want to tell them a story --- how they access the API with an API key, how they interact with the API, and what the common traits for various resources are (pagination).

Often, to conduct a certain business use case you must issue several calls in a row: first you get the details of an order, then you ask for the details of the customer, and lastly perhaps their delivery address. So you **chain calls**, using elements of the response of the previous call to craft the subsequent request. Sometimes, you have different payloads, with or without embedded entities; an order call may contain all the details of the customer and its address, or it may not.

How can a provider explain the logical scenario of calls? A page published within the API documentation should describe such scenarios, and regroup logical series of calls together in a coherent story --- the use cases of the API. Though you can provide descriptions of API parameters using current definition languages, there is no way to tie elements together in a cohesive **workflow**. An API definition with the power to tell **API stories** that describe common instances of multi-step transactions could be very powerful.

## Test Scenarios

Related to these use cases, having **tests** corresponding to those scenarios would be handy. For instance, [DHC by Restlet](https://nordicapis.com/10-continuous-integration-tools-spur-api-development/#dhc) has its own test scenario definition format that you can use to run tests from a Maven plugin, or within your [Continuous Integration pipeline](https://nordicapis.com/reach-devops-zen-with-these-continuous-integration-tools/) with the Jenkins server. Could such scenario tests be derived from the API definition, or embedded within the API definition itself? Interestingly, the [API Blueprint roadmap lists scenarios and testing](https://github.com/apiaryio/api-blueprint/issues/21), so this might be coming sooner than later.

## Documentation vs Specification

It's easy to mix up the difference between the **API definition format** with the published **API documentation**. Though they *are* different entities, you can generate the documentation from the definition --- there's no denying the two are intimately linked. If they were completely separate, API definition formats wouldn't even have any description tags at all, as the format would probably only be used for [machine-consumption](https://nordicapis.com/designing-apis-machines/), and not for [human-consumption](https://nordicapis.com/designing-apis-humans/).

Using API definitions, you can derive implementation for skeletons for your [API or client SDKs](https://restlet.com/blog/2015/04/28/easy-client-sdk-and-server-skeleton-generation-for-your-apis/). But you can also generate beautiful and comprehensive documentation: perhaps just static HTML documentation, or spiced up with sprinkles of JavaScript to provide an interactive playground to try out the API directly, or go full steam with hosting that definition in a full-blown [API developer portal](https://nordicapis.com/beautiful-ui-design-for-api-developer-portals/) where you could add collaboration capabilities, versioning information, and more. As the end user documentation as well as [SDKs and libraries](https://nordicapis.com/description-agnostic-api-development-with-api-transformer/) can be derived form the core API definition, the two are inherently linked.

## Style Guide, Conformance and Tooling

In designing an API, your company probably has already created a set of guidelines, or **best practices** to follow. For instance, look at [Paypal's API style guide](https://github.com/paypal/api-standards/blob/master/api-style-guide.md). The document describes the general structures of URIs, a mandatory namespace element, a paging method that should remain consistent, and more. Your own guidelines might specify naming conventions, like the use of camel-case.

**It would be handy to automatically assess if the API actually conforms to those guidelines**. Maintaining this type of conformance could be part of the API definition itself, or exist as an external document that is referenced from the API definition. This could require a new format that describes these conventions rules, leading one to consider if such guidelines should be declaratively-defined, or if a scripting language could be used for more advanced validation needs.

Along with having a special guideline description file, tools would be needed to check that the implementation of the API really conforms to those guidelines! This tooling would likely not be part of an API definition format, but could accompany it, and be offered in various languages and technology stacks that anyone can feel at home with.

## Hypermedia

One of the key tenets of the **REST** architectural style coined by Roy Fielding is hypermedia, with hypermedia as the engine of application state (HATEOAS). More APIs are conforming to this constraint, and several approaches exist to define those hypermedia links --- [we've defined HAL, JSON-LD, and Siren hypermedia types in a past blog post](https://nordicapis.com/designing-evolvable-apis-for-the-web-formats/#hypermediatypesforwebapis).

Even though the concept is popular, API languages often don't let you easily describe such hypermedia-driven APIs. Shouldn't they help users describe such metadata and hyperlinks? Zdenek Nemec of Apiary gave an example [implementation of HAL for an API](https://gist.github.com/zdne/988a54c03609655f47b7#file-rendered-md), using the new MSON modeling capabilities of API Blueprint. Perhaps in the near future, API languages will support a particular flag to denote what hypermedia approach the API is using.

## Data and Payload Modeling

Speaking of [MSON](https://github.com/apiaryio/mson) (Markdown Syntax for Object Notation), it's also an interesting take on modeling your API payloads. With a convenient and readable format, which is neither JSON schema nor XML schema, you can describe what your data will look like, regardless of the underlying media type being used.

This beckons the question whether any possible payload can be supported that way. After all, esoteric APIs will probably not conform with JSON schema, XML schema, or MSON. There are likely going to be expressivity differences between them all. Should API definition languages be prescriptive, and limit to the 80/20 sane use cases of data modeling?

Another example is Apigee's recent [Rapier API specification](https://apigee.com/about/blog/developer/rapier-cut-through-tedium-api-specification), whose goal is to describe data-oriented APIs with entities and their relationships. Rapier might possibly be contributed to the OpenAPI Specification at some point, but there are clear limits in terms of expressivity.

## API Definition Extensions

Although API definition languages don't necessarily provide all those bells and whistles, an important aspect is **extension**. For example, [Swagger / OpenAPI Spec provides the notion of extensions](https://swagger.io/specification/#vendorExtensions). API designers have the ability to define custom fields (following a convention) within which they can stuff any data or metadata they want! So if you want to add guideline documentation pointers, or associated tests, you could very well add them as custom extensions. Then, your own tools can grok those specific extensions and deal with them however you like.

For instance, [tools translating from one API language to another](https://restlet.com/blog/2015/10/26/importing-and-translating-raml-api-definition/) can store custom extensions that describe how to best do the translation, in particular in the case that one specification doesn't support certain metadata that the other supports. Let's keep in mind one downside of custom extensions though: They are not understood by all the tools and vendors, and are somewhat proprietary and non portable. So use at your own risk!

## Final Thoughts

Right, so shoud API definition languages provide everything and the kitchen sink? If so, what's the threshold? Where do we put the cursor? Or --- should an API definition simply stick to describing the various API elements, and then leverage a complementary format like [APIs.json](https://apisjson.org/) to add and link to additional resources?

It is apparent that there are benefits to pushing API definition languages a bit further and providing more information than they do. Extensions are the way to go, as long as we define, publish and share such extensions in a somewhat standardized fashion. But some definitely feel the need for going further than what is offered today. What's your take on that? Where would you put the cursor?