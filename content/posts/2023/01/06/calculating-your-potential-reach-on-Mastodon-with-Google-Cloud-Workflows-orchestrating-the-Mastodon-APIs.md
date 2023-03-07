---
title: "Calculating your potential reach on Mastodon with Google Cloud Workflows orchestrating the Mastodon APIs"
date: 2023-01-06T18:10:20+01:00
tags:
- mastodon
- twitter
- google-cloud
- workflows
---

With the turmoil around Twitter, like many, I’ve decided to look into [Mastodon](https://joinmastodon.org/). 
My friend [Geert](https://uwyn.net/@gbevin) is running his own Mastodon server, 
and welcomed me on his instance at: [uwyn.net/@glaforge](https://uwyn.net/@glaforge). 

With Twitter, you can access your [analytics](https://analytics.twitter.com/about) to know how your tweets are doing, how many views you’re getting. 
Working in developer relations, it’s always interesting to get some insights into those numbers to figure out if what you’re sharing is interesting for your community. 
But for various (actually good) reasons, Mastodon doesn’t offer such detailed analytics. 
However, I wanted to see what the [Mastodon APIs](https://docs.joinmastodon.org/api/) offered. 

## How to calculate your potential reach

Your _“toots”_ (ie. your posts on Mastodon) can be “boosted” (equivalent of a retweet on Twitter). 
Also, each actor on Mastodon has a certain **number of followers**. 
So potentially, one of your toots can reach all your followers, as well as all the followers of the actors who reshare your toot. 

So the maximum potential reach of one of your posts would correspond to the following equation:

```
potential_reach = 
    me.followers_count + 
    ∑ ( boosters[i].followers_count )
```

Let’s play with the Mastodon APIs to compute your reach

Fortunately, the Mastodon APIs allow you to get those numbers, albeit not with a single API call. 
Let’s have a look at the interesting endpoints to get the potential reach of my most recent posts.


First of all, I’ll look up my account on the Mastodon instance that hosts me:

```
GET https://uwyn.net/api/v1/accounts/lookup?acct=glaforge
```

I pass my account name as a query parameter to the /accounts/lookup endpoint.

In return, I get a JSON document that contains various details about my account and me 
(I’ll just show some of the interesting fields, not the whole payload):

```json
{
    id: "109314675907601286",
    username: "glaforge",
    acct: "glaforge",
    display_name: "Guillaume Laforge",
    ...
    note: "...",
    url: "https://uwyn.net/@glaforge",
    ...
    followers_count: 878,
    fields: [...]
}
```

I get two important pieces of information here: the followers_count gives me, you guessed it, 
the number of followers my account has, thus the potential number of persons that can see my toots. 
Also the id of my account, which I’ll need for some further API calls further down.

To get the most recent statuses I’ve posted, I’ll indeed need that account id for crafting the new URL I’ll call:

```
GET https://uwyn.net/api/v1/accounts/109314675907601286/statuses
```

This call will return a list of statuses (again, snipped less interesting part of the payload):

```json
[
    …
    {
        id: "109620174916140649",
        created_at: "2023-01-02T14:52:06.044Z",
        …
        replies_count: 2,
        reblogs_count: 6,
        favourites_count: 6,
        …
        edited_at: null,
        content: "...",
        reblog: null,
        …
    },
    …
]
```

In each status object, you can see the number of replies, the number of times the post was reshared or favorited, 
or whether it’s a reshared toot itself. So what’s interesting here is the reblogs_count number. 

However, you don’t get more details about who reshared your toot. 
So we’ll need some extra calls to figure that out!

So for each of your posts, you’ll have to call the following endpoint to know more about those “reblogs”:

```
GET https://uwyn.net/api/v1/statuses/109620174916140649/reblogged_by
```

This time, you’ll get a list of all the persons who reshared your post:

```json
[
    {
        id: "123456789",
        username: "...",
        acct: "...",
        display_name: "...",
        ...
        followers_count: 7,
        ...
    },
    ...
]
```

And as you can see the details of those persons also have the followers_count field, 
that tells the number of people that follow them. 

So now, we have all the numbers we need to calculate the potential reach of our toots: 
your own number of followers, and the number of followers of all those who reshared! 
It doesn’t mean that your toots will actually be viewed that many times, 
as one doesn’t necessarily read each and every toots on their timelines, 
but at least, that’s an approximation of the maximum reach you can get.

## Automating the potential reach calculation with Web API orchestration

Initially I played with both cURL and a little Apache Groovy [script](https://gwc-experiment.appspot.com/?g=groovy_4_0&codez=eJx1kl9PwjAUxd_3KRqeNjUtoAlsCTHGhAfjg0F8MoaUcQczY3dp78DF-N0tLRv_xp66c-85t_216bpARWypEDcV_9aY8xvPW0DCdms2Yjls2YtZvmelKkD5gcfMZzsIkT5UZpo6K6JCR0KU2yrnOZCQRSo2PaFJUqlBi143vB_2hmE4fOiH_cEg7HZsRiGVhsXUJJkYO94qU_ghf5_PCT8mr37AyYiB14x-Q02gxphluAWljf8QxmUcY5kTT-ryzP6zx4h1m4Sx3KBKCc68iZFLq7eZJjDPcHlmUU487rcGp08bUDWyW9YRrraExWxeHcNwA56UktUlk5PANjJNagPm2e5pdJnOY9MCMbFflraTYn9cl2s_2J9IAZUqZ5_2CSQ1vOiU5Z2r1mlR2125nj206BirqxCSzJwyPgRdOZqzFEiQU7qzyXjVOtVQvxLhfXneP1NZD_M) 
to better understand the Mastodon APIs to figure out how to chain them to get to the expected result. 
Then I decided to automate that series of Web API calls using an API orchestrator: [Google Cloud Workflows](https://cloud.google.com/workflows).


To recap, we need to:
* Get the details of your account
* Get the recent posts for that account
* Get all the followers count for each person who reshared each post

Let’s have a look at this piece by piece:

```yaml
main:
    params: [input]
    steps:
    - account_server_vars:
        assign:
        - account: ${input.account}
        - server: ${input.server}
        - prefix: ${"https://" + server + "/api/v1"}
        - impact_map: {}
```

First, the workflow takes an account and server arguments, in my case that is glaforge and uwyn.net. 
And I’m defining a variable with the base path of the Mastodon API, and a dictionary to hold the data for each toot.

```yaml
- find_account_id:
    call: http.get
    args:
        url: ${prefix + "/accounts/lookup"}
        query:
            acct: ${account}
    result: account_id_lookup
- account_id_var:
    assign:
    - account_id: ${account_id_lookup.body.id}
    - followers_count: ${account_id_lookup.body.followers_count}
```

Above, I’m doing an account lookup, to get the id of the account, but also the followers count.

```yaml
- get_statuses:
    call: http.get
    args:
        url: ${prefix + "/accounts/" + account_id + "/statuses"}
        query:
            limit: 100
            exclude_reblogs: true
    result: statuses
```

We get the list of most recent toots. 


Now things get more interesting, as we need to iterate over all the statuses. We’ll do so in parallel, to save some time:

```yaml
- iterate_statuses:
    parallel:
        shared: [impact_map]
        for:
            value: status
            in: ${statuses.body}
```

To parallelize the per-status calls, we just need to state it’s parallel, 
and that the variable we’ll keep our data in is a shared variable that needs to be accessed in parallel. 
Next, we define the steps for each parallel iteration:

```yaml
steps:
- counter_var:
    assign:
    - impact: ${followers_count}
- fetch_reblogs:
    call: http.get
    args:
        url: ${prefix + "/statuses/" + status.id + "/reblogged_by"}
    result: reblogs
```

Above, we get the list of people who reshared our post. And for each of these accounts, 
we’re incrementing our impact counter with the number of their followers. 
It’s another loop, but that doesn’t need to be done in parallel, as we’re not calling any API:

```yaml
- iterate_reblogs:
    for:
        value: reblog
        in: ${reblogs.body}
        steps:
        - increment_reblog:
            assign: 
            - impact: ${impact + reblog.followers_count}
- update_impact_map:
    assign:
    - impact_map[status.url]: ${impact}
```

And we finish the workflow by returning the data:

```yaml
- returnOutput:
        return:
            id: ${account_id}
            account: ${account}
            server: ${server}
            followers: ${followers_count}
            impact: ${impact_map}
```

This will return an output similar to this:

```json
{
  "account": "glaforge",
  "followers": 878,
  "id": "109314675907601286",
  "impact": {
    "https://uwyn.net/@glaforge/109422399389341013": 945,
    "https://uwyn.net/@glaforge/109462120695384207": 1523,
    "https://uwyn.net/@glaforge/109494881278500194": 121385,
    "https://uwyn.net/@glaforge/109495686235916646": 878,
    "https://uwyn.net/@glaforge/109516968335141401": 1002,
    "https://uwyn.net/@glaforge/109523829424569844": 878,
    "https://uwyn.net/@glaforge/109528949144442301": 896,
    "https://uwyn.net/@glaforge/109620174916140649": 1662,
    "https://uwyn.net/@glaforge/109621803885287542": 1523,
    ...
  },
  "server": "uwyn.net"
}
```

With this little workflow, I can check how my toots are doing on this new social media! As next steps, 
you might want to check out how to get started with API orchestration with Google Cloud Workflows, 
[in the cloud console](https://cloud.google.com/workflows/docs/create-workflow-console), 
or [from the command-line](https://cloud.google.com/workflows/docs/create-workflow-gcloud). 
And to go further, potentially, it might be interesting to 
[schedule a workflow execution]({{< ref "/posts/2022/02/09/schedule-a-workflow-execution" >}}) 
with [Cloud Scheduler](https://cloud.google.com/scheduler). 
We could also imagine storing those stats in a database (perhaps [BigQuery](https://cloud.google.com/bigquery) for some analytics, 
or simply [Firestore](https://cloud.google.com/firestore) 
or [CloudSQL](https://cloud.google.com/sql)), to see how your impact evolves over time.

