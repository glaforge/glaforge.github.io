---
title: "Let LLM suggest Instagram hashtags for your pictures"
date: 2024-08-12T21:15:19+02:00
image: /img/gemini/heraklion-harbor.jpg
tags:
  - generative-ai
  - langchain4j
  - java
  - google-cloud
  - large-language-model

similar:
  - "posts/2024/11/18/data-extraction-the-many-ways-to-get-llms-to-spit-json-content.md"
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
  - "posts/2025/07/22/the-sci-fi-naming-problem-are-llms-less-creative-than-we-think.md"
---

In this article, we'll explore another great task where Large Language Models shine: **entity and data extraction**.
LLMs are really useful beyond just mere chatbots (even smart ones using Retrieval Augmented Generation).

Let me tell you a little story of a handy application we could build, for wannabe Instagram influencers!

## Great Instagram hashtags, thanks to LLMs

When posting Instagram pictures, I often struggle with finding the right hashtags to engage with the community.
Large Language Models are pretty creative, and they've certainly seen a bunch of Instagram pictures with their descriptions.

So it's natural to try asking an AI like [Gemini](https://gemini.google.com/app) what it could suggest in terms of hashtags:

![Gemini Instagram Hashtag suggestion](/img/gemini/gemini-instagram-hashtags.png)

This is a picture taken in the port of Heraklion in Crete, a Greek island.
Here's the [conversation](https://g.co/gemini/share/476eb5dd974a) I had with Gemini, if you want to see all the tags it suggested.
I think you'll agree with me that those hashtags look pretty good.
Gemini was able to recognise where the picture was taken, as it had tags like `#heraklion`, `#crete`, `#greece`, `#greekisland`, etc.
In another attempt, it even told me the name of the fortress of the Venetian port, and suggested other tags along those lines.
We also have several tags typically found on Instagram, like `#travelgram`, `#instatravel`, and more specific tags like `#cretephotography`.

My developer mind started quickly spinning with ideas of an online tool to help users be more creative with their instagram tags.
Armed with my usual tools of trade: Java, and [LangChain4j](https://docs.langchain4j.dev/),
I tried to see how I could implement such a tool.

When you want to integrate an LLM into an application, it's important to be able to use more structured outputs than plain text.
And what's great with the Gemini 1.5 Flash model is that it can generate a JSON response,
and Gemini 1.5 Pro can even follow a specific JSON schema
(also called [controlled generation](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output)).

## Let's implement an Instagram hashtag generator

First, let's see what the Gemini API responds with a plain prompt, without trying to return some JSON payload:

```java
var modelCreative = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .build();

List<ChatMessage> messages = new ArrayList<>();
messages.add(SystemMessage.from("""
    You are an Instagram influencer and expert.
    You master the fine art of choosing the best creative hashtags
    to share users' best pictures, and to ensure engagement with
    the Instagram community is the highest possible.
    """));
messages.add(UserMessage.from(
    ImageContent.from(
      Paths.get("src/main/resources/travel-picture.jpg").toUri()),
    TextContent.from(
      "What are the best Instagram hashtags to describe that picture?")
));

Response<AiMessage> response = modelCreative.generate(messages);
String responseText = response.content().text();

System.out.println(responseText);
```

- First, we instantiate a Vertex AI Gemini chat model
- We prepare a list of messages: one system message to describe the task the LLM must achieve, and one compound message made of the picture and the request to generate hashtags for it. Gemini is a **multimodal** model that accepts text, but also images, audios, videos, and PDF files.
- Then we ask Gemini to generate a response, which we then print.

The Gemini LLM API will reply with a nice and creative response suggesting lots of great hashtags, along with some interesting explanations:

```
Here are some relevant hashtags for your picture:

**General Hashtags:**
#greece #greekislands #crete #creteisland #cretelife #holiday #travel
#vacay #instatravel #travelgram #beautifuldestinations
#travelphotography #photooftheday #instagood #igdaily #instapic

**Specific Hashtags:**
#heraklion #heraklioncrete #venetianharbour #harbourlife #boatlife
#boatday #greekboats #greekharbour #beautifulcrete #creteharbour
#cretevibes #greece_gram #crete_gram #greece_travel

**Trending Hashtags:**
#wanderlust #traveltuesday #instagood #travelgram
#beautifuldestinations #adventuretime

**Hashtags for Engagement:**
#explorecrete #cretelove #lovegreece #greecevibes #cretephoto
#creteexperience #discovercrete

Make sure to also use a mix of hashtags with different lengths and
popularity. You can also use location hashtags to target people in
your area.

For example, you could use hashtags like #heraklioncrete or
#creteharbour to target people who are interested in visiting that
specific location.

You should also consider using a mix of popular and less popular
hashtags. Popular hashtags will help your post reach a wider audience,
while less popular hashtags can help your post stand out from the
crowd.

**Tips for Choosing Hashtags:**

* Research relevant hashtags. Look at what other users are using and
see what's trending.
* Use a mix of general and specific hashtags.
* Don't use too many hashtags.
* Keep your hashtags relevant to your image.

By using a mix of relevant and engaging hashtags, you can increase
your chances of getting your post seen by a wider audience and improve
your engagement on Instagram.
```

Now, let's tweak this code to output the Instagram hashtags as a JSON array of hashtag strings.
With LangChain4j's Gemini integration, it's pretty trivial, we can specify that we want to return JSON payloads,
thanks to the `responseMimeType()` method:

```java
var modelCreative = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .responseMimeType("application/json")
    .build();
```

Let's update the system instruction to be explicit about what the JSON should look like:

````java
List<ChatMessage> messages = new ArrayList<>();
messages.add(SystemMessage.from("""
    You are an Instagram influencer and expert.
    You master the fine art of choosing the best creative hashtags
    to share users' best pictures, and to ensure engagement with
    the Instagram community is the highest possible.

    Return a JSON array containing the hashtags as strings, for example:
    ```json
    ["#beach", "#island", "#traveltahiti"]
    ```
    """));
````

Now let's see the LLM's response:

```json
[
  "#greece",
  "#crete",
  "#heraklion",
  "#cretelife",
  "#mediterraneansea",
  "#creteisland",
  "#greecevacations",
  "#greekislands",
  "#cretetravel",
  "#heraklionport"
]
```

On one hand, it's nice that Gemini obeyed us and generated the request JSON array of hashtags.
However, notice that there are fewer hashtags, which are also a bit less creative.

## LLMs are less creative when constrained

It's not the first time I noticed that behavior with an LLM.
I tried this with other LLMs like ChatGPT.
It seems that LLMs are less creative when they are constrained to follow a stricter output.

And indeed, what actually trigged this article idea and example was this paper that I came across:
[Let Me Speak Freely? A Study on the Impact of
Format Restrictions on Performance of Large Language Models](https://arxiv.org/abs/2408.02442#)
which has been published on arXiv a few days ago,
which confirms my intuition that LLMs are less creative when using controlled generation:

> Structured generation, the process of producing content in standardized formats like JSON and XML,
> is widely utilized in real-world applications to extract key output information from large language models (LLMs).
> This study investigates whether such constraints on generation space impact LLMs' abilities,
> including reasoning and domain knowledge comprehension.
> Specifically, we evaluate LLMs' performance when restricted to adhere to structured formats
> versus generating free-form responses across various common tasks.
> Surprisingly, **we observe a significant decline in LLMs' reasoning abilities under format restrictions**.
> Furthermore, we find that stricter format constraints generally lead to greater performance degradation in reasoning tasks.

## A better solution with a two-step approach with entity extraction

Since LLMs are not as good when we control their generation, we can try a slighly smarter approach:

- Firstly, we can ask the LLM to give its usual plain-text creative answer,
- Secondly, we ask the LLM to actually extract all the hashtags from the previous response, using controlled gneration.

LLMs are great at various classical Natural Language Processing tasks like **entity extraction**.
And here, indeed, what we want is to just extract the hashtags from the plain-text response.

For such a task, controlled generation won't hinder the creativity, and will be acurate and extract correctly all the tags.
The aforementioned paper seemed to also hint at the fact that controlled generation can actually help with some tasks like classification.

Let's have a look at our improved approach.
We keep the first attempt from the beginning of this article, without using controlled generation,
but we'll use a different configuration for the second step:

```java
var modelExtraction = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-pro")
    .responseSchema(SchemaHelper.fromClass(String[].class))
    .build();

List<ChatMessage> messagesForExtraction = new ArrayList<>();
messagesForExtraction.add(SystemMessage.from("""
    Your job is to extract Instagram hashtags from a given text, and
    return them as a JSON array of strings representing those hashtags.
    """));
messagesForExtraction.add(UserMessage.from("""
    Here is the text to extract Instagram hashtags from:

    """ + responseText));

Response<AiMessage> responseFromExtraction =
    modelExtraction.generate(messagesForExtraction);

String extractedTagsJson = responseFromExtraction.content().text();
System.out.println(extractedTagsJson);
```

- In this example, I used Gemini 1.5 Pro instead of Gemini 1.5 Flash to show you the use of the
  `responseSchema()` method which allows you to specify the exact shape of the JSON we want to retrieve.
  I could have used Gemini 1.5 Flash like before, but I have to give a bit more prompting help to specify the JSON schema.
- This time, we use a different system message to explain the task of hashtag extraction.
- And the user message reuses the creative response from the previous LLM call to extract hashtags from it.

So what's the output like?

```json
[
  "#greece",
  "#greekislands",
  "#crete",
  "#creteisland",
  "#cretelife",
  "#holiday",
  "#travel",
  "#vacay",
  "#instatravel",
  "#travelgram",
  "#beautifuldestinations",
  "#travelphotography",
  "#photooftheday",
  "#instagood",
  "#igdaily",
  "#instapic",
  "#heraklion",
  "#heraklioncrete",
  "#venetianharbour",
  "#harbourlife",
  "#boatlife",
  "#boatday",
  "#greekboats",
  "#greekharbour",
  "#beautifulcrete",
  "#creteharbour",
  "#cretevibes",
  "#greece_gram",
  "#crete_gram",
  "#greece_travel",
  "#wanderlust",
  "#traveltuesday",
  "#instagood",
  "#travelgram",
  "#beautifuldestinations",
  "#adventuretime",
  "#explorecrete",
  "#cretelove",
  "#lovegreece",
  "#greecevibes",
  "#cretephoto",
  "#creteexperience",
  "#discovercrete"
]
```

Excellent! It managed to extract all the tags of the creative response!

## Conclusion & discussion

Even if researchers found that LLMs may be less creative when constrained with controlled generation,
we can find workarounds to prevent suffering from this limitation, like we did with this two-step approach
by making two calls.
The first call is a creative one, while the second is the data extraction one.

One drawback of this approach, however, is that we had to make two calls to the LLM.
So this can be a bit more costly in terms of tokens generated.
And it also adds latency, because we have two calls instead of just one.
So you might have to balance cost & lantency with quality, depending on your use case.

But it's always great to have the choice!
