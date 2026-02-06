---
title: "Client-side consumption of a rate-limited API in Java"
date: 2023-10-02T22:48:39+02:00
tags:
  - java
  - web-apis
  - rest
  - concurrency
  - design-patterns
---

In the literature, you'll easily find information on how to rate-limit your API. I even talked about
[Web API rate limitation](https://speakerdeck.com/glaforge/the-never-ending-rest-api-design-debate-devoxx-france-2016?slide=80)
years ago at a conference, covering the usage of
[HTTP headers like X-RateLimit-\*](https://www.ietf.org/archive/id/draft-ietf-httpapi-ratelimit-headers-07.html).

Rate limiting is important to help your service cope with too much load, or also to implement a tiered pricing scheme
(the more you pay, the more requests you're allowed to make in a certain amount of time). There are useful libraries like
[Resilience4j](https://micronaut-projects.github.io/micronaut-ratelimiter/snapshot/guide/index.html)
that you can configure for Micronaut web controllers, or [Bucket4j](https://www.baeldung.com/spring-bucket4j)
for your Spring controllers.

Oddly, what is harder to find is information about how to consume APIs that are rate-limited.
Although there are usually way more consumers of rate-limited APIs, than producers of such APIs!

Today, I'd like to talk about this topic: how to consume APIs that are rate-limited.
And since I'm a Java developer, I'll focus on Java-based solutions.

The use case which led me to talk about this topic (on Twitter / X in particular,
with a [fruitful conversation](https://twitter.com/glaforge/status/1705933799635268050) with my followers)
is actually about a Java API which is an SDK for a Web API that is rate-limited.
I'll briefly cover consuming Web APIs, but will focus more on using the Java API instead.

## Consuming Web APIs

### Rate limit headers

Let's say we are calling a Web API that is rate-limited to 60 requests per minute.
We could call it 60 times in a second without hitting the limit then wait for a minute, or call it once every second.
Usually, a sliding time window is used to check that within that minute, no more than 60 requests have been made.

If the rate-limited API is well behaved and provides X-RateLimit headers, you can check what those headers say.
Taking the explanations from the IETF [draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/):

> - **RateLimit-Limit**: containing the requests quota in the time window;
> - **RateLimit-Remaining**: containing the remaining requests quota in the current window;
> - **RateLimit-Reset**: containing the time remaining in the current window, specified in seconds.

Note that the draft mentions RateLimit-\* as headers, but often in the wild, I've seen those headers always prefixed with "X-" instead.
And sometimes, some APIs add a hyphen between Rate and Limit! So it's hard to create a general consumer class that could deal with
[all cases](https://stackoverflow.com/questions/16022624/examples-of-http-api-rate-limiting-http-response-headers).

Those headers inform you about the quota, how much is left, and when the quota should be back to its full capacity (if you don't consume more requests).
So you could certainly stage your requests accordingly --- we will talk about how to schedule your requests in Java in the second section.

Another thing to keep in mind is that the quota may be shared among API consumers.
Maybe you have several parallel threads that will call the API and consume the API quota.
So when you see the reset header, maybe the API will have been called by another thread already, leaving you with a smaller amount of requests left in the quota.

### Exponential backoff and jitter

The API that triggered my research actually doesn't provide any rate limitation headers.
So another approach is needed. A classical approach is to use an exponential backoff.
It was nicely [documented](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) on the AWS blog, a while ago.

The idea is that when you face an over quota error, you're going to retry the call after, for example, one second.
And if you're getting another error, you'll wait a little longer, by multiplying the interval by a constant, like doubling.
So at first, on the first error, you wait 1 second before retrying, next 2 seconds, then 4 seconds, etc.
You can use a fractional multiplier, of course.

But as explained in the article, if all clients fail at the same time, they will retry roughly at the same time as well, after one, two, four seconds.
So the idea is to add some randomness, the jitter, to more evenly spread out the retries, to avoid having new bursts of traffic at roughly the same moments.

There's another good article on Baeldung about
[exponential backoff and jitter using Resilience4J](https://www.baeldung.com/resilience4j-backoff-jitter) for your API consumers.

## Consuming a Java API

Back to my use case, the underlying Web API I'm using doesn't feature rate limitation headers.
And since there's a Java library that wraps that API anyway, I'd rather just use that Java API for convenience.
When a rate limit is hit, the API will throw an exception.
So I can catch that exception, and deal with it, maybe applying the same exponential backoff + jitter strategy.

However, I know the rate limit of the API.
So instead of eagerly calling the API as fast as possible, getting an exception, waiting a bit, and trying again...
I'd rather just call the API at the pace I'm allowed to use it.

Let's say I have a hypothetical API that takes a String as argument and returns a String:

```java
public  class  RateLimitedApi {
    public String call(String arg) {
        return arg.toUpperCase();
    }
}
```

### Sleeping a bit...

A first, but naive, idea would be to just add some pause after each call:

```java
for (int i = 0; i < 20; i++) {
    api.call("abc");
    Thread.sleep(100);
}
```

And instead of making the same call with the same argument, you could iterate over an array or list:

```java
for (String s : args) {
    api.call(s);
    Thread.sleep(100);
}
```

Well, it works, but the API call takes some time as well, so you may have to adjust the sleep time accordingly, so it's not really ideal.
The call could also be longer than the actual wait time really needed between two invocations.

### Scheduled execution

A better approach would be to use Java's scheduled executors, with a few threads, in case of long API execution times that overlap.

```java
try (var scheduler = Executors.newScheduledThreadPool(4)) {
    var scheduledCalls = scheduler.scheduleAtFixedRate(
        () -> api.call("abc"),
        0, 100, TimeUnit.MILLISECONDS);
}
```

Instead of calling the API with the same argument, how would you call it for a series of different values,
but then stop the scheduler once we're done with all the values?
You could take advantage of some kind of queue (here a ConcurrentLinkedDeque) to pop the arguments one at a time.
Once you've cleared all the elements of the queue, you shut down the scheduler altogether.

```java
var args = new ConcurrentLinkedDeque<>(
    List.of("a", "b", "c", "d", "e", "f", "g", "h", ..."x", "y", "z"));

try (var scheduler = Executors.newScheduledThreadPool(4)) {
    scheduler.scheduleAtFixedRate(() -> {
        if (!args.isEmpty()) {
                api.call(args.pop());
        } else {
                scheduler.shutdown();
        }
    }, 0, 100, TimeUnit.MILLISECONDS);
}
```

### One more in the Bucket4J!

In the introduction, I mentioned some great libraries like Resilience4J and Bucket4J.
Let's have a look at an approach using [Bucket4J](https://bucket4j.com/).

Scheduling is fine, to respect the rate limit, but you may perhaps want to get as many calls through as possible,
while still respecting the rate. So a different approach is necessary.

Bucket4J is based on the [token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket).
It offers a very rich and fine-grained set of rate limit definitions, if you want to allow bursts, or prefer a regular flow (like our schedule earlier).
Be sure to check out the [documentation](https://bucket4j.com/8.4.0/toc.html#quick-start-examples) for the details.

Let's see how to define my limited consumption rate of 10 per second:

```java
var args = List.of("a", "b", "c", "d", "e", ..."x", "y", "z");

var bucket = Bucket.builder()
    .addLimit(Bandwidth.simple(10, Duration.ofSeconds(1)))
    .build();

for (String arg : args) {
    bucket.asBlocking().consumeUninterruptibly(1);
    api.call(arg);
}
```

It's pretty explicit: I create a limit that corresponds to a bandwidth of 10 tokens per second.
With this simple strategy, the bucket is refilled greedily: every 100ms a new token will be available again.
But it's also possible to configure it differently, to say that you want to allow another 10 calls once every second.

Then I have a simple for loop to iterate over the list of arguments I must pass to the API,
but I introduce an instruction that blocks until a token is available --- ie. that I have the right to call the API again while respecting the rate limit.

Also beware of API calls that take a lot of time, as here we're using a blocking call that blocks the calling thread.
So if API calls take longer than the time a new token is available in the bucket, you'll end up calling the API much less frequently than the allowed rate limit.

However, with Bucket4J, the bucket can be used in a thread-safe manner, you can have several threads consuming from the same API,
using the same shared bucket, or you can make parallel calls with a single consumer as well, to use the quota to its maximum.

Let's use executors to parallelize our calls:

```java
try (ExecutorService executor = Executors.newFixedThreadPool(4)) {
    for (String arg : args) {
        bucket.asBlocking().consumeUninterruptibly(1);
        executor.submit(() -> api.call(arg));
    }
}
```

Be careful though, that doing so, your API calls are not necessarily following the exact same order as the order of the input collection.
In my case, I didn't care about the order of execution.

Last little tweak we could make since Java 21 was released recently, we could make use of virtual threads,
instead of threads! So let's push our example forward in the 21th century with this small change when creating our executor service:

```java
Executors.newVirtualThreadPerTaskExecutor()
```

So far, we have only called the API without taking care of the returned result.
We could update the examples above with an extra line to add the argument and result in a ConcurrentHashMap or to use the result immediately.
Or we could also explore one last solution, using CompletableFutures and/or ExecutorCompletionService.
But I'm not 100% satisfied with what I came up with so far.
So I might update this article if I find a convenient and elegant solution later on.

Time to wrap up!

## Summary

In this article, we explored the less covered topic of consuming a rate-limited API.
First, we discussed approaches for consuming Web APIs that are well-behaved, exposing rate limitation headers,
and those less well-behaved using an exponential backoff and jitter approach.
We then moved on to the case of Java APIs, doing a simple sleep to call the API at a cadence that respects the rate limit.
We also had a look at scheduled executions.
And we finished our journey with the help of the powerful Bucket4J library.
