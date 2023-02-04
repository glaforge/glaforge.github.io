---
title: "APIs, we have a Problem JSON"
date: 2022-11-14T13:37:09+01:00
---

When designing a web API, not only do you have to think about the happy path when everything is alright, 
but you also have to handle all the error cases: Is the payload received correct? Is there a typo in a field? 
Do you need more context about the problem that occured? 

There’s only a limited set of status codes that can convey the kind of error you’re getting, 
but sometimes you need to explain more clearly what the error is about.

In the past, the APIs I was designing used to follow a common JSON structure for my error messages: a simple JSON object, 
usually with a `message` field, and sometimes with extra info like a custom error `code`, or a `details` field that contained a longer explanation in plain English. 
However, it was my own convention, and it’s not necessarily one that is used by others, or understood by tools that interact with my API. 

So that’s why today, for reporting problems with my web APIs, I tend to use **Problem JSON**. This is actually an RFC ([RFC-7807](https://datatracker.ietf.org/doc/html/rfc7807)) 
whose title is “Problem Details for HTTP APIs”. Exactly what I needed, a specification for my error messages!

First of all, it’s a JSON content-type. Your API should specify the content-type with:

```http
Content-Type: application/problem+json
```

Content-types that end with `+json` are basically treated as application/json.

Now, an example payload from the specification looks like:

```http
HTTP/1.1 403 Forbidden
Content-Type: application/problem+json
Content-Language: en

{
   "type": "https://example.com/probs/out-of-credit",
   "title": "You do not have enough credit.",
   "detail": "Your current balance is 30, but that costs 50.",
   "instance": "/account/12345/msgs/abc",
   "balance": 30,
   "accounts": ["/account/12345", "/account/67890"]
}
```

There are some standard fields like:
* **type**: a URI reference that uniquely identifies the problem type
* **title**: a short readable error statement
* **status**: the original HTTP status code from the origin server
* **detail**: a longer text explanation of the issue
* **instance**: a URI that points to the resource that has issues

Then, in the example above, you also have custom fields: `balance` and `accounts`, which are specific to your application, 
and not part of the specification. Which means you can expand the Problem JSON payload to include details that are specific to your application.

Note: Although I’m only covering JSON APIs, the RFC also suggests an `application/problem+xml` alternative for the XML APIs.

## Icing on the cake: built-in support in Micronaut

My framework of choice these days for all my apps is [Micronaut](https://micronaut.io/), as it’s super fast and memory efficient. 
And it’s only recently that I realized there was actually a [Micronaut extension for Problem JSON](https://micronaut-projects.github.io/micronaut-problem-json/2.5.2/guide/index.html)!
So instead of returning a custom JSON payload manually, I can use the built-in integration.

Here’s an example from the Problem JSON Micronaut extension:

```java
@Controller("/product")
public class ProductController {
  @Get
  @Status(HttpStatus.OK)
  public void index() {
    throw Problem.builder()
            .withType(URI.create("https://example.org/out-of-stock"))
            .withTitle("Out of Stock")
            .withStatus(new HttpStatusType(HttpStatus.BAD_REQUEST))
            .withDetail("Item B00027Y5QG is no longer available")
            .with("product", "B00027Y5QG")
            .build();
  }
}
```

Which will return a JSON error as follows:

```json
{
    "status": 400,
    "title": "Out of Stock",
    "detail": "Item B00027Y5QG is no longer available",
    "type": "https://example.org/out-of-stock",
    "parameters": {"product": "B00027Y5QG"}
}
```

Now, I’m happy that I can use some official standard for giving more details about the errors returned by my APIs!


