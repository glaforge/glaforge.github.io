---
title: "One API, many facades?"
date: 2016-03-13T14:36:34+01:00
tags:
- web
- apis
- rest
- graphql
canonical: "https://www.infoq.com/articles/api-facades"
---

An interesting trend is emerging in the world of Web APIs, with various engineers and companies advocating for dedicated APIs for each consumer with particular needs. Imagine a world where your system needs to expose not only one API for iOS, one API for Android, one for the website, and one for the AngularJS app front end, but also APIs for various set-top boxes and exotic mobile platforms or for third-party companies that call your API. Beyond any ideal design of your API, reality strikes back with the concrete and differing concerns of varied API consumers. You might need to optimize your API accordingly.

## Experience APIs

On InfoQ, Jérôme Louvel (chief geek and co-founder of [Restlet](http://restlet.com/)) interviewed Daniel Jacobson (vice president of edge engineering at [Netflix](http://www.netflix.com/)) about Netflix's e[xperience APIs and ephemeral APIs](http://www.infoq.com/news/2015/11/daniel-jacobson-ephemeral-apis). Daniel's team is responsible for handling all traffic for signup, discovery, and playback of videos on devices around the world. With the concept of experience APIs, Netflix creates special APIs to handle optimized responses for a given requesting agent. With ephemeral APIs, Netflix engineers iteratively transition and evolve those experience APIs.

The goal of experience APIs is to solve problems Netflix has encountered while scaling its platform to more than 60 million consumers on dozens of devices with different characteristics. Offering such dedicated APIs allowed Netflix to provide the best user experiences possible across all devices and to optimize bandwidth according to a device's screen size for less latency and data consumption. It let Netflix engineers progress rapidly and independently from the core back-end teams, in isolation, with their own versioning scheme and orchestrating their own deployments.

At Netflix, dedicated teams take care of those experience APIs. It's not the central or core API team that is responsible for all the APIs derived for each and every possible client. There aren't many companies with the same scale as Netflix, and just because Netflix builds dedicated APIs for all API consumers doesn't mean it makes sense for your own context. For small shops, maintaining and evolving too many API front ends could be ineffective or even an anti-pattern, as the cost would be pretty high. Netflix had to build a special API platform to support this approach.

## Microservices architectures

With the trend towards microservices-based architectures, the [API gateway](http://microservices.io/patterns/apigateway.html) or API facade is making a resurgence. Your architecture is scattered among several small services and you need to have front-facing services responsible for exposing an API to consumers. So it's not all that surprising that by having many microservices you can also have multiple facades for your consumers.

A gateway or facade will let a consumer make just one call instead of forcing the consumer to make multiple calls to several underlying microservices. This alone is easier for the API consumer and the benefit increases with a smarter gateway or façade that takes advantage of caching (because multiple calls still need to be made), applies security concerns (authentication, authorization), or implements rules (rate limitation, IP filtering). The API provider can control how the consumers use its API.

Gateways, from vendors or built in-house like Netflix's, also add complementary value like edge services (an API infrastructure in the DMZ of the company can be used in novel and interesting ways, like how Netflix uses Zuul for multiregion resiliency) or pipelining or filter chaining (which help extract crosscutting concerns and implement enterprise-wide patterns).

Back ends for front ends
------------------------

In a [recent article](http://www.infoq.com/news/2015/12/bff-backend-frontend-pattern), Sam Newman looks at this approach of dedicated consumer APIs as a pattern named "[Backends for Frontends](http://samnewman.io/patterns/architectural/bff/)" (BfFs). Instead of a general-purpose API for all clients, you can have several BfFs: one for a Web front end, one for mobile clients (or even one for iOS and one for Android), and more.

[SoundCloud adopted the BfF pattern](https://www.thoughtworks.com/insights/blog/bff-soundcloud), with API front ends for the iOS platform, the Android platform, the website, and for web-embedding. As is the case at Netflix, it seems that this technique works best when there are dedicated teams responsible for those front ends. If you have only one team taking care of the back end and its API, you'd better not overload them with a large number of variations for different consumers.

Getting back to microservices, BfF can also make sense for migration: when migrating a monolith to microservices, one BfF can call into the monolith while other BfFs could call the new microservices instead, following the [Strangler pattern](http://www.martinfowler.com/bliki/StranglerApplication.html) where you progressively move away from the legacy code to adopt newer evolutions.

A monolith is complex, easily accumulates technical debt, and mixes too many concerns at the same time, while microservices help you focus on one particular concern at a time. But microservices architectures also have drawbacks. You have to operate and orchestrate them, and they may have to evolve at a different pace from one big monolith. Maintaining consistency between all services in such distributed systems is not easy, either. Communication among many microservices might introduce additional latency because of communication delay. The consensus around the duplication and denormalization of data for each microservice can also complicate data management and consistency. [Microservices are not a free lunch](http://highscalability.com/blog/2014/4/8/microservices-not-a-free-lunch.html), and you can read more on some microservices anti-patterns with Vijay Alagarasan's [anti-patterns article](http://www.infoq.com/articles/seven-uservices-antipatterns), or on Tareq Abedrabbo's "[The 7 Deadly Sins of Microservices](https://www.opencredo.com/2014/11/19/7-deadly-sins-of-microservices/)".

The deciding factor for choosing to use experience APIs or BfF could very well be having dedicated teams for them or not. If you're small and have only one team to take care of the back end and the front-facing or edge Web APIs, it might be more complicated for you to take care of the many variants (think maintenance costs) but if you're large enough, teams can more easily take ownership of these front-end APIs and evolve them at their own pace.

## APIs as a team-communication pattern

While companies are organized as teams, I see more and more instances where developers are separated into front-end developers (whether Web or mobile) and back-end developers who implement the APIs needed for the Web or mobile devices. Web APIs have become central to the way projects are delivered: APIs are the contract that binds the different teams together and allows them to collaborate efficiently.

When developing an API that is going to be used by others, it's important not to break that contract. Often, frameworks and tools allow you to generate an API definition from the codebase --- for example, with an annotation-driven approach where you label your endpoints, query parameters, etc. with annotations. But sometimes, even if your own test cases still pass, the smallest code refactoring could very well break the contract. Your codebase might be fine, but the refactoring might have broken the code of your API consumers. To collaborate more effectively, consider going with an API-contract-first approach and make sure your implementation still conforms with the shared agreement: the API definition. There are different API definition languages available and popular these days, like [Swagger](http://swagger.io/) ([Open API specification](https://github.com/OAI/OpenAPI-Specification)), [RAML](http://raml.org/), or [API Blueprint](https://apiblueprint.org/). Pick one you're comfortable with.

Working with an API definition has a few advantages. First of all, it should make it more difficult to break compatibility as your implementation has to conform to the API definition. Secondly, API definitions are pretty well equipped in terms of tooling. From API definitions, you can generate client SDKs that your API consumers can integrate in their projects to call your API or even server skeletons to generate the initial implementation of your service. You can also create mocks of your APIs, which developers can easily call while the underlying API is being built, without juggling the different development cycles of the producers and consumers of APIs. Each team can work at its own pace! However, it's not just about code or compatibility but also about documentation. API-definition languages also help when documenting your API, with nicely generated documentation that shows the various endpoints, query parameters, etc., as well as (sometimes) offering an interactive console, which allows you to easily craft calls to the API.

## Different payloads for different consumers

Adopting an API-contract-first approach is certainly helpful and provides benefits, but what can you do when different clients have different API needs? Particularly, if you don't have the luxury of dedicated teams taking ownership of different API facades, how can you make your API meet the needs of all your API consumers?

In a recent article on InfoQ, Jean-Jacques Dubray explained why he [stopped using MVC frameworks](http://www.infoq.com/articles/no-more-mvc-frameworks). In the introduction, he explained how mobile or front-end developers frequently asked for APIs tailored for their UI needs, regardless of a sound data model for the underlying business concepts. The state-action-model (SAM) pattern that Dubray described nicely supports the BfF approach. SAM is a new, reactive functional pattern which simplifies fronted architectures by clearly separating the business logic from the effects, in particular decoupling back-end APIs from the view. As the state and model are separate from actions and views, the actions can be specific for a given front end or not appear at all: it's up to you to decide where to put the cursor. You may also generate the state representation or view from the central back end or by those intermediary facades.

A website or single-page application might need to display a detailed view of a product and all its reviews, but perhaps a mobile device will only show the product details and its rating, letting the mobile user tap to load the reviews afterwards. Depending on the UI, the flow, the actions available, the level of detail, and the entities retrieved might be different. Typically, you'd like to diminish the number of API calls to retrieve data on a mobile device because of connectivity and bandwidth constraints, and you want the payload returned to contain only what's required and nothing more. But this doesn't matter that much for the Web front end, and with asynchronous calls, you're totally fine with loading more content or resources lazily. In either case, APIs should obviously respond rapidly, and have a good service-level agreement. But what are the options for delivering multiple customized APIs to different consumers?

## Specific endpoints, query parameters, and fields filtering

A basic approach could be to provide different endpoints (`/api/mobile/movie` versus `/api/web/movie`) or even simply query parameters (`/api/movie?format=full` or `/api/movie?format=mobile`), but there are perhaps more elegant solutions.

Similar to query parameters, your API might be able to customize returned payloads by letting the consumer decide which fields he or she wants, like: `/api/movie?fields=title,kind,rating`, or `/api/movie?exclude=actors`.

With fields filtering, you may decide also if you want to get related resources in response: `/api/movie?includes=actors.name`.

## Custom MIME media types

As the implementor of the API, you have options. You might decide not to offer any customization at all! Consumers will either have to go with what you offer or wrap your API inside their own facade into which they've built the customization they want. But since you're a great person, you could offer them profiles: you can be creative with media types and offer a leaner or richer payload depending on the media type a consumer requests. For instance, if you look at the [GitHub API](https://developer.github.com/v3/media/), you'll notice types like: `application/vnd.github.v3.full+json`

Along with a "full" profile that offers the whole payload and related entities, you can provide a "mobile" variant, and perhaps a "minimal" one too.

The API consumer makes a call that requests the media type that fits his/her use case the most.

## Prefer header

Irakli Nadareishvili wrote about [client-optimized resource representations in APIs](http://www.freshblurbs.com/blog/2015/06/25/api-representations-prefer.html), mentioning a lesser-known header field: the Prefer header ([RFC 7240](https://tools.ietf.org/html/rfc7240)).

As with custom media types, a client would request a certain profile using the Prefer header: using `Prefer: return=mobile` would have the API reply with a customized payload and the header `Preference-Applied: return=mobile`. Note that the Vary header should also mention that the Prefer header is available.

Depending on whether you, the API developer, want to be in charge of deciding what kind of payloads you support, you might like the custom media type, the Prefer header, or dedicated endpoints. If you want to let clients decide more explicitly what kind of fields and relationships to retrieve, you could opt for field filtering or query parameters.

## GraphQL

With its [React](https://facebook.github.io/react/) view framework, Facebook [introduced](https://facebook.github.io/react/blog/2015/05/01/graphql-introduction.html) developers to [GraphQL](https://facebook.github.io/graphql/). Here, consumers are in total control of what they'll receive: the fields and relationships. The consumer issues a call that specifies what the return payload should look like:

```graphql
{
  user(id: 3500401) {
    id,
    name,
    isViewerFriend,
    profilePicture(size: 50)  {
      uri,
      width,
      height
    }
  }
}
```

And the API should reply with the following payload:

```json
{
  "user" : {
    "id": 3500401,
    "name": "Jing Chen",
    "isViewerFriend": true,
    "profilePicture": {
      "uri": "http://someurl.cdn/pic.jpg",
      "width": 50,
      "height": 50
    }
  }
}
```

GraphQL is at the same time a query and a description of what you'd like the answer to this query to be. GraphQL lets API consumers totally control what they'll get in return, offering the highest level of flexibility.

A similar approach exists in specifications like OData, which lets you customize the payloads with [$select, $expand, and $value parameters](http://www.asp.net/web-api/overview/odata-support-in-aspnet-web-api/using-select-expand-and-value). But OData has not really caught on and might be on the verge of abandonment; [Netflix and eBay stopped supporting OData](http://www.ben-morris.com/netflix-has-abandoned-odata-does-the-standard-have-a-future-without-an-ecosystem/) a while ago. That said, other actors like Microsoft and SalesForce do still support it.

## Hypermedia APIs

One last option to explore is hypermedia APIs. When thinking of hypermedia APIs, you often think of all the additional hyperlinks that clutter responses and that could easily double the payload size. Payload size and number of calls really matter to a mobile device. Despite that, it's important to think of hypermedia through HATEOAS (Hypermedia as the engine of application state), a core tenet of REST APIs that is often overlooked. It's about the capabilities offered by the API. A consumer will have access to related resources, but links offered through those hypermedia relations can also be about giving different profiles to choose from, like:

```json
{
    "_links": {
        "self": { "href": "/movie/123" },
        "mobile": { "href": "/m/movie/123" },
    }
}
```

Additionally, certain hypermedia approaches fully embrace the notion of embedding related entities. Hydra, HAL, and SIREN provide the ability to embed sub-entities, so that you could retrieve a particular movie and the embedded list of all the actors in that movie.

From an article on [how to choose a hypermedia format](http://sookocheff.com/post/api/on-choosing-a-hypermedia-format/), Kevin Sookocheff gives an example showing how accessing a "player's list of friends" resource also embeds the actual representations of those friends and not just links to those individual resources, thus eliminating calls to each friend resource:

```json
{
  "_links": {
    "self": { "href":
        "https://api.example.com/player/1234567890/friends"
    },
    "size": "2",
    "_embedded": {
      "player": [
        {
          "_links": {
            "self": { "href":
                "https://api.example.com/player/1895638109" },
            "friends": { "href":
                "https://api.example.com/player/1895638109/friends" }
          },
          "playerId": "1895638109",
          "name": "Sheldon Dong"
        },
        {
          "_links": {
            "self": { "href":
              "https://api.example.com/player/8371023509" },
            "friends": { "href":
                "https://api.example.com/player/8371023509/friends" }
            },
            "playerId": "8371023509",
            "name": "Martin Liu"
      }
    ]
  }
}

```

## Summary

Web APIs increasingly have several kinds of consumers with different needs. Microservice architectures can encourage us to deploy fine-grained API facades for those needs (the so-called experience APIs or BfF patterns), but this can become an anti-pattern if you have too many distinct consumers to please, especially if you've got only a small team to take care of all those front ends.

Be sure to do the math! Before going one way or another, you have to study the cost of your options and whether or not you can support them. [Creating different variants of an API has a cost](http://www.ebpml.org/blog15/2013/11/understanding-the-costs-of-versioning-an-api-or-a-service/), for the implementor as well as for the consumer, that depends on the adopted strategy. Also, once you've unleashed your API and given it to its consumers, perhaps it's also time to rethink  and refactor this API, as maybe you didn't take those special device or consumer requirements well enough into account during the design phase.

If you have dedicated teams for these API facades, then it's an option to consider. When you don't have that luxury, there are other ways to customize payloads for your consumers without the induced complexity, with simple tricks like field filtering or the Prefer header up to full-blown solutions like custom media types or specifications like GraphQL.

But you don't necessarily need to fire the big guns, and could opt for a middle path: one main, full API plus one or two variants for mobile devices, and you are likely going to meet the requirements of all your consumers. Consider including a pinch of field filtering, and everybody will be happy with your APIs!