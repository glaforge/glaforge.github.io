---
title: "Gemini, Google's Large Language Model, for Java Developers"
date: 2024-05-03T09:35:08+02:00
type: "talk"
layout: "talk"
tags:
  - google-cloud
  - generative-ai
  - large-language-models
  - java
  - langchain4j
---

As a follow-up to my talk on [generative AI for Java developers]({{< ref "/talks/2023/11/13/gen-ai-with-palm-2-and-java" >}}), I've developed a new presentation that focuses more on
the [Gemini](https://deepmind.google/technologies/gemini/#introduction) large multimodal model by Google.

In this talk, we cover the multimodality capabilities of the model, as it's able to ingest code, PDF, audio, video, and is able to reason about them.
Another specificity of Gemini is its huge context window of up to 1 million tokens!
This opens interesting perspectives, especially in multimodal scenarios.

We also talk about the [Gemma](https://blog.google/technology/developers/gemma-open-models/) model, a small open-weights model in the Gemini family, which I covered recently about how to [run it locally thanks to Ollama and Testcontainers]({{< ref "/posts/2024/04/04/calling-gemma-with-ollama-and-testcontainers.md" >}}).

In that presentation, I'm showing some of my past Gemini-powered demos, as well as the code examples in my [Gemini workshop for Java developers]({{< ref "/posts/2024/03/27/gemini-codelab-for-java-developers.md" >}}), using [LangChain4j](https://docs.langchain4j.dev/).

{{< speakerdeck 202b1956e3b747afa85cbf5d1b40bf20 >}}
