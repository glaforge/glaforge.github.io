---
title: "Expanding ADK Java LLM coverage with LangChain4j"
date: 2025-06-05T16:41:26+02:00
tags:
  - java
  - agent-development-kit
  - large-language-models
  - ai-agents
  - langchain4j
image: /img/adk/adk-langchain4j.png

similar:
  - "posts/2025/05/20/writing-java-ai-agents-with-adk-for-java-getting-started.md"
  - "posts/2025/06/15/expanding-ai-agent-capabilities-with-tools.md"
  - "posts/2025/10/26/a-javelit-frontend-for-an-ADK-agent.md"
---

Recently on these pages, I've covered [ADK](https://github.com/google/adk-java) (Agent Development Kit) for Java, launched at Google I/O 2025.
I showed how to get started [writing your first Java agent]({{<ref "/posts/2025/05/20/writing-java-ai-agents-with-adk-for-java-getting-started.md" >}}),
and I shared a [Github template]({{<ref "/posts/2025/05/27/adk-java-github-template.md" >}}) that you can use to kick start your development.

But you also know that I'm a big fan of, and a contributor to the [LangChain4j project](https://docs.langchain4j.dev/),
where I've worked on the Gemini support, embedding models, GCS document loaders, Imagen generation, etc.

How can I reconcile both?
By **integrating ADK and LangChain4j together**!
But why?
Because currently, ADK for Java only supports two models: Gemini and Claude,
compared to the Python version that supports other models via its [LiteLLM](https://www.litellm.ai/) integration.
So if I could integrate ADK with LangChain4j, I could make ADK Java access any model that LangChain4j supports!
Then developers could use models from OpenAI, Anthropic, Mistral, and also all the models that can run via Ollama,
like Gemma, Qwen, Phi, and others!

> [!WARNING] Warning
> This is a work-in-progress glimpse into the ADK / LangChain4j integration
> I've been working on with Dmytro (LangChain4j's founder).
> It's not yet been integrated in either ADK or LangChain4j.
> Currently, it lives as a [Pull Request](https://github.com/google/adk-java/pull/102) against the ADK Github project.
> Stay tuned! I'll blog back when it's available!

## Using local Ollama models in ADK

Let's say you want to build a Java agent with ADK, using the [Qwen 3](https://qwenlm.github.io/blog/qwen3/) model,
that you installed locally via Ollama. You have Ollama running on your computer and serving the model.
Then all you have to do is to configure the [Ollama LangChain4j](https://docs.langchain4j.dev/integrations/language-models/ollama) model,
and wrap it in a `LangChain4j` ADK model adapter:

```java
OllamaChatModel ollamaChatModel = OllamaChatModel.builder()
    .modelName("qwen3:1.7b")
    .baseUrl("http://127.0.0.1:11434")
    .build();

LlmAgent scienceTeacherAgent = LlmAgent.builder()
    .name("science-app")
    .description("Science teacher agent")
    .model(new LangChain4j(ollamaChatModel))
    .instruction("""
        You are a helpful science teacher
        who explains science concepts to kids and teenagers.
        """)
    .build();
```

In the following screenshot of the ADK Dev UI, I configured Ollama to serve a [Gemma 3](https://blog.google/technology/developers/gemma-3/) model,
as you can see at the bottom left hand corner, where it shows the events, and LLM requests & responses:

![](/img/adk/adk-lc4j-ollama-gemma.png)

## Using big provider models in ADK

But you can use the _big guns_ as well, including Anthropic models:

```java
AnthropicChatModel claudeModel = AnthropicChatModel.builder()
    .apiKey(System.getenv("ANTHROPIC_API_KEY"))
    .modelName(CLAUDE_3_7_SONNET_20250219)
    .build();

LlmAgent agent = LlmAgent.builder()
    .name("science-app")
    .description("Science teacher agent")
    .model(new LangChain4j(claudeModel, CLAUDE_3_7_SONNET_20250219))
    .instruction("""
        You are a helpful science teacher
        who explains science concepts to kids and teenagers.
        """)
    .build();
```

Or OpenAI, this time using a **streaming model**:

```java
StreamingChatModel openaiStreamingModel = OpenAiStreamingChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4o-mini")
    .build();

LlmAgent agent = LlmAgent.builder()
    .name("science-app")
    .description("Science teacher agent")
    .model(new LangChain4j(openaiStreamingModel))
    .instruction("""
        You are a helpful science teacher
        who explains science concepts to kids and teenagers.
        """)
    .build();
```

In the ADK Dev UI, you can flip the switch to enable or disable streaming.
In that case, if you want to support both modes in the UI, **configure two LangChain4j models:
the streaming and the non-streaming one**.

```java
LlmAgent agent = LlmAgent.builder()
    .name("science-app")
    .description("Science teacher agent")
    .model(new LangChain4j(openaiModel, openaiStreamingModel))
    .instruction("""
        You are a helpful science teacher
        who explains science concepts to kids and teenagers.
        """)
    .build();
```

## What about tools?

With ADK, your agents can make use of tools, so if the underlying LangChain4j model supports function calling, tools will work too.
And there's one particular tool that I'd like to mention: agent tools.
An agent can be a tool.
So you can mix and match different LLMs as sub-agents, or use a tool backed by a LangChain4j LLM.

For example, here's a main agent using Claude, and a tool agent using OpenAI to give weather information:

```java
StreamingChatModel openaiStreamingModel = OpenAiStreamingChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4o-mini")
    .build();

LlmAgent weatherAgent = LlmAgent.builder()
    .name("weather-agent")
    .description("Weather agent")
    .model(new LangChain4j(openaiStreamingModel))
    .instruction("""
        Your role is to always answer that the weather is sunny and 20°C.
        """)
    .build();

AnthropicChatModel claudeModel = AnthropicChatModel.builder()
    .apiKey(System.getenv("ANTHROPIC_API_KEY"))
    .modelName(CLAUDE_3_7_SONNET_20250219)
    .build();

LlmAgent agent = LlmAgent.builder()
    .name("friendly-weather-app")
    .description("Friend agent that knows about the weather")
    .model(new LangChain4j(claudeModel, CLAUDE_3_7_SONNET_20250219))
    .instruction("""
        You are a friendly assistant.

        If asked about the weather forecast for a city,
        you MUST call the `weather-agent` function.
        """)
    .tools(AgentTool.create(weatherAgent))
    .build();
```

Mixing different models in a multi-agent scenario is quite interesting, as you can use the best model for the job.
Maybe you'll need to use a super fast model to do a simple classification task to route requests depending on the ask,
while you'll use a beefier model for the main task that requires more advanced thinking (like a Gemini 2.5 thinking model).

## Summary

This is still early days, as I mentioned in the beginning, it is just a _work-in-progress_ right now,
but I believe it is a great way to **extend ADK Java to supports a lot more models, including local ones**,
and it opens up some **interesting perspectives in multi-agent scenarios when mixing models together**.

Stay tuned, I'll keep you posted on this development!
