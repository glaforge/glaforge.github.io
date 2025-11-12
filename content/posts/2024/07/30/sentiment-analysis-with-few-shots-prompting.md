---
title: "Sentiment analysis with few-shot prompting"
date: 2024-07-30T13:06:16+02:00
image: /img/gemini/few-shot-arrows-target.jpg
tags:
  - generative-ai
  - langchain4j
  - java
  - google-cloud
  - large-language-model

similar:
  - "posts/2024/07/11/text-classification-with-gemini-and-langchain4j.md"
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
  - "posts/2024/07/05/latest-gemini-features-support-in-langchain4j.md"
---

In a rencent article, we talked about
[text classification]({{<ref "posts/2024/07/11/text-classification-with-gemini-and-langchain4j/">}})
using [Gemini](https://deepmind.google/technologies/gemini/) and [LangChain4j](https://docs.langchain4j.dev/).

A typical example of text classification is the case of **sentiment analysis**.

In my LangChain4j-powered Gemini [workshop](https://github.com/glaforge/gemini-workshop-for-java-developers/),
I used this use case to illustrate the classification problem:

```java
ChatLanguageModel model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("PROJECT_ID"))
    .location(System.getenv("LOCATION"))
    .modelName("gemini-1.5-flash-001")
    .maxOutputTokens(10)
    .maxRetries(3)
    .build();

PromptTemplate promptTemplate = PromptTemplate.from("""
    Analyze the sentiment of the text below.
    Respond only with one word to describe the sentiment.

    INPUT: This is fantastic news!
    OUTPUT: POSITIVE

    INPUT: Pi is roughly equal to 3.14
    OUTPUT: NEUTRAL

    INPUT: I really disliked the pizza. Who would use pineapples as a pizza topping?
    OUTPUT: NEGATIVE

    INPUT: {{text}}
    OUTPUT:
    """);

Prompt prompt = promptTemplate.apply(
    Map.of("text", "I love strawberries!"));

Response<AiMessage> response = model.generate(prompt.toUserMessage());

System.out.println(response.content().text());
```

I used a `PromptTemplate` to craft the prompt, with a `{{text}}` placeholder value to analyze the sentiment of that particular text.

Notice that I used the [few-shot prompting](https://learnprompting.org/docs/basics/few_shot) technique, with example inputs and outputs.

## Few-shot prompting with a list of messages

Somehow, I had the impression that this `INPUT/OUTPUT` notation was a bit of a _hack_
to encourage the LLM to believe this is an actual exchange between the user and the AI.

I believed it would be cleaner to use a real list of messages that alternate user and AI messages.
So I implemented this alternative approach, but haven't yet committed it to my workshop repository.

Meanwhile, as I was chatting with my colleague [Dan Dobrin](https://x.com/ddobrin),
he pointed me at this very recent blog [post](https://blog.langchain.dev/few-shot-prompting-to-improve-tool-calling-performance/)
from the LangChain people, who were investigating _few-shot prompting to improve tool-calling performance_.

What's interesting in their analysis was that overall, on this anecdata example,
it seems **LLMs do better with real user/AI messages than with a big string of inputs/outputs**.

Let's see how to implement the same approach, with a real exchange of messages:

```java
List<ChatMessage> fewShotPrompts = List.of(
    SystemMessage.from("""
        Analyze the sentiment of the text below.
        Respond only with one word to describe the sentiment.
        """),

    UserMessage.from("This is fantastic news!"),
    AiMessage.from("POSITIVE"),

    UserMessage.from("Pi is roughly equal to 3.14"),
    AiMessage.from("NEUTRAL"),

    UserMessage.from("I really disliked the pizza. " +
                     "Who would use pineapples as a pizza topping?"),
    AiMessage.from("NEGATIVE"),

    UserMessage.from("I love strawberries!")
);

response = model.generate(fewShotPrompts);

System.out.println(response.content().text());
```

This is not much more verbose than the previous approach, as it's still very readable.
And when pulling the few-shot data from an external database, it feels cleaner than concatenating a big string.

## More type-safe few-shot prompting with messages and AiServices

To further improve on the list of messages tactic, we can use LangChain4j's `AiServices` concept,
which is a higher-level abstraction than using the model and prompt templates directly.

```java
enum Sentiment { POSITIVE, NEUTRAL, NEGATIVE }

interface SentimentAnalysis {
    @SystemMessage("""
        Analyze the sentiment of the text below.
        Respond only with one word to describe the sentiment.
        """)
    Sentiment analyze(String text);
}

MessageWindowChatMemory memory =
    MessageWindowChatMemory.withMaxMessages(10);

memory.add(UserMessage.from("This is fantastic news!"));
memory.add(AiMessage.from(Sentiment.POSITIVE.name()));

memory.add(UserMessage.from("Pi is roughly equal to 3.14"));
memory.add(AiMessage.from(Sentiment.NEUTRAL.name()));

memory.add(UserMessage.from("I really disliked the pizza. " +
        "Who would use pineapples as a pizza topping?"));
memory.add(AiMessage.from(Sentiment.NEGATIVE.name()));

SentimentAnalysis analyzer =
    AiServices.builder(SentimentAnalysis.class)
        .chatLanguageModel(model)
        .chatMemory(memory)
        .build();

System.out.println(analyzer.analyze("I love strawberries!"));
```

This third and final approach may be a bit more verbose, and introduces a few more LangChain4j concepts
like system messages, chat memory, and the AI service itself, but it has the advantages of being:

- **more type-safe**, as we're using a `Sentiment` enum, which is easier to manipulate from code,
- cleaner, because we're **using system instructions** to instruct the model about what its job is.

We created:

- a Java `enum` to represent the possible values of the sentiment,
- a `SentimentAnalysis` interface with a clear signature: a text in input, a `Sentiment` enum value in output,
- a `@SystemMessage` instruction to describe the analysis task,
- a `ChatMemory` (here a `MessageWindowChatMemory`) to hold the few-shot examples.

Then we bind everything together, thanks to `AiServices`:
the analysis interface that LangChain4j will implement for us, the language model, and the chat memory.

Finally, users just have to call the `analyze()` method, passing the text to analyze.

I also like the fact that we are **coding against an interface**, and potentially later on,
developers **could swap the implementation** of the sentiment analyzer, and use a different approach.

## Conclusion

All three approaches are valid: a big string, a low-level list of messages, or an `AiServices` abstraction.
But I have a slight preference for the approach that is more type-safe and less _stringy_.

Just like LangChain4j provides a `TextClassification` class that leverages vector embeddings for text similarity,
we could investigate whether it would make sense to also add a few-shot prompting classificaction solution directly in the LangChain4j project.
