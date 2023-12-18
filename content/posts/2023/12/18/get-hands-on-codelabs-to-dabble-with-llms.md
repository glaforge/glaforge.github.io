---
title: "Hands on Codelabs to dabble with Large Language Models in Java"
date: 2023-12-18T17:31:56+01:00
tags:
  - machine-learning
  - large-language-models
  - generative-ai
  - google-cloud
  - java
---

Hot on the heels of the [release of Gemini](https://glaforge.dev/posts/2023/12/13/get-started-with-gemini-in-java/),
I'd like to share a couple of resources I created to get your hands on large language models,
using [LangChain4J](https://github.com/langchain4j/), and the [PaLM 2](https://ai.google/discover/palm2/) model.
Later on, I'll also share with you articles and codelabs that take advantage of Gemini, of course.

The PaLM 2 model supports 2 modes:

- text generation,
- and chat.

In the 2 codelabs, you'll need to have created an account on Google Cloud, and created a project.
The codelabs will guide you through the steps to setup the environment,
and show you how to use the Google Cloud built-in shell and code editor, to develop in the cloud.

You should be a Java developer, as the examples are in Java, use the [LangChain4J](https://github.com/langchain4j/) project, and Maven for building the code.

## [Generative AI text generation in Java with PaLM and LangChain4J](https://codelabs.developers.google.com/codelabs/genai-text-gen-java-palm-langchain4j?hl=en#0)

In the first [codelab](https://codelabs.developers.google.com/codelabs/genai-text-gen-java-palm-langchain4j?hl=en#0)
you can explore:

- how to make your first call to PaLM for simple question/answer scenarios
- how to extract structured data out of unstructured text
- how to use prompts and prompt templates
- how to classify text, with an example on sentiment analysis

## [Generative AI powered chat with users and docs in Java with PaLM and LangChain4J](https://codelabs.developers.google.com/codelabs/genai-chat-java-palm-langchain4j?hl=en#0)

In the second [codelab](https://codelabs.developers.google.com/codelabs/genai-chat-java-palm-langchain4j?hl=en#0)
you'll use the chat model to learn:

- how to create your first chat with the PaLM model
- how to give your chatbot a personality, with an example with a chess player
- how to extract structured data out of unstructured text using LangChain4J's AiServices and its annotations
- how to implement Retrieval Augmented Generation (RAG) to answer questions about your own documentation
