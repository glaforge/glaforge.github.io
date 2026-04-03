---
title: "An ADK Java agent powered by Gemma 4"
date: 2026-04-02T16:45:10+02:00
tags:
- generative-ai
- ai-agents
- agent-development-kit
- java
---

Today, DeepMind announced the
[release of Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/),
a very impressive and powerful new version of the
[Gemma family of models](https://deepmind.google/models/gemma/).
As I've been contributing to [ADK Java](https://adk.dev/) a fair bit recently,
I was curious to see how I would configure ADK Java agents to work with Gemma 4.

In this article, we'll explore 3 paths:
* Calling the AI Studio API surface directly,
* Calling Gemma 4 hosted via a vLLM instance thanks to the
[LangChain4j bridge](https://developers.googleblog.com/en/adk-for-java-opening-up-to-third-party-language-models-via-langchain4j-integration/).
* Calling Gemma 4 locally via Ollama

With the appropriate model weights format, we'll also be able to run Gemma 4 locally via Ollama.
But that's for another day.

## 1 — The Easy Case: Gemma 4 on AI Studio

If you're using Gemma 4 via the Google AI Studio API surface,
you have to use the `Gemini` model builder and reference the model name:

```java
Gemini gemma4 = Gemini.builder()
    .modelName("gemma-4-31b-it")
    .apiKey(System.getenv("GEMINI_API_KEY"))
    .build();

LlmAgent agent = LlmAgent.builder()
    .model(gemma4)
    // ... instructions and tools
    .build();
```

Here, Gemma 4 is exposed the same way as the Gemini models, via the same API surface.
That's why the model is an instance of `Gemini`.

> [!TIP]
> In an upcoming release of ADK, we'll also be able to simplify the above by just setting the model string like we do for Gemini models:
> ```java
> LlmAgent agent = LlmAgent.builder()
>     .model("gemma-4-31b-it")
>     // ... instructions and tools
>     .build();
> ```

## 2 — Calling a vLLM hosted Gemma 4 via LangChain4j

During the beta testing period, internally at Google,
my colleague [Vlad](https://x.com/vladkol) was exposing the Gemma 4 model weights
via [vLLM](https://docs.vllm.ai/), running inside a Google
[Cloud Run instance with GPU](https://docs.cloud.google.com/run/docs/configuring/services/gpu).
And I was using his endpoint to test Gemma 4 :wink:

However, vLLM features an OpenAI-compatible API.
So Gemma 4 on vLLM needs to be called with that API surface, not with the Gemini one.

Fortunately, with the LangChain4j bridge I developed last year, you can configure OpenAI-compatible models,
thanks to the `OpenAiChatModel` (or the streaming variant) chat model
from [LangChain4j](https://docs.langchain4j.dev/) to connect to the vLLM server.

### Creating a Simple Agent

First, we need to configure the `OpenAiChatModel` (or `OpenAiStreamingChatModel`):

```java
ChatModel model = OpenAiChatModel.builder()
    .modelName("gg-hf-gg/gemma-4-31b-it")
    .apiKey("YOUR_API_KEY") // A dummy key if not required by your vLLM setup
    .baseUrl("https://your-vllm-instance/v1")
    .timeout(Duration.ofMinutes(5))
    .customParameters(
        Map.of("chat_template_kwargs", Map.of("enable_thinking", true))
    )
    .build();
```

> [!IMPORTANT]
> For function calling (tool use) to work correctly with Gemma 4 on vLLM, as we shall see in further examples,
> you **must** enable the _thinking capability_ in the _chat template_.
> This is done via the `chat_template_kwargs` / `enable_thinking` parameter,
> which enables thinking but also function calling at the same time.

> [!NOTE]
> I've defined a long timeout, as the cold start to load the weights in memory can take up to 4 minutes!
> But once the Cloud Run instance is _hot_, Gemma 4 replies instantly.

Let's have a look at a simple science teacher agent:

```java
LlmAgent teacherAgent = LlmAgent.builder()
    .name("science-teacher")
    .model(LangChain4j.builder()
        .chatModel(model)
        .modelName("gg-hf-gg/gemma-4-31b-it")
        .build())
    .instruction("""
        You're a friendly science teacher
        who explains concepts simply.
        """)
    .build();
```

We use the `LangChain4j.builder()` to wrap the OpenAI compatible chat model
as a Java class extending ADK's `BaseLlm` class, which is the parent class of all LLMs supported by ADK.

### Adding Tools (Local Java Functions)

Gemma 4's reasoning capabilities shine when you add tools.
You can expose any Java method as a tool using ADK's `FunctionTool`.

```java
LlmAgent orderAgent = LlmAgent.builder()
    .name("order-agent")
    .model(LangChain4j.builder()
        .chatModel(model)
        .modelName("gg-hf-gg/gemma-4-31b-it")
        .build())
    .instruction(
        "Use the `lookup_order` tool to retrieve order details.")
    .tools(FunctionTool.create(this, "retrieveOrder"))
    .build();

@Annotations.Schema(name = "lookup_order",
        description = "Retrieve order details by ID")
public Map<String, Object> retrieveOrder(String orderId) {
    // Your database logic here...
    return Map.of("status", "out_for_delivery");
}
```

In this example, we reference a local Java function to lookup order details,
so Gemma 4 can call it should the user ask for the status of their order.

## 3 — Calling Gemma 4 locally via Ollama

It's also possible to take on a third path, with [Ollama's Gemma 4 support](https://ollama.com/library/gemma4).
Thanks to the LangChain4j bridge again, you can configure Gemma 4 with the following LangChain4j chat model definition:
```java
OllamaChatModel ollamaChatModel = OllamaChatModel.builder()
   .modelName("gemma4:e4b")
   .baseUrl("http://127.0.0.1:11434")
   .build();
```

## Wrapping up

That's about it for today!
With ADK Java and Gemma 4, you have a powerful, flexible, and open-weight foundation for your next AI agent project! :robot:
Thanks to the LangChain4j / ADK bridge, it's even possible to invoke Gemma via different API surfaces than Gemini's.

> [!REMINDER]
> As a reminder, we've just
> [announced ADK Java 1.0](https://developers.googleblog.com/announcing-adk-for-java-100-building-the-future-of-ai-agents-in-java/),
> if you want to have a refresher about the latest features and enhancements to the project.
>
> And you can watch this YouTube video I recorded that goes through the new features,
> as well as a concrete ADK agent called "Comic Trip" that transforms travel photography into vintage pop-art comic illustrations.
> Go check out the
> [behind-the-scene article](content/posts/2026/03/30/building-my-comic-trip-agent-with-adk-java-1-0.md) on how I built it.
>
> {{<youtube YqABMjSho_M >}}