---
title: "Visualize PaLM-based LLM tokens"
date: 2024-02-05T09:44:22+01:00
image: /img/gemini/token-viz.jpg
tags:
  - google-cloud
  - generative-ai
  - large-language-models
  - micronaut
  - java
  - cloud-run
---

As I was working on tweaking the Vertex AI text embedding model in [LangChain4j](https://github.com/langchain4j),
I wanted to better understand how the `textembedding-gecko`
[model](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-embeddings)
tokenizes the text, in particular when we implement the
[Retrieval Augmented Generation](https://arxiv.org/abs/2005.11401) approach.

The various PaLM-based models offer a `computeTokens` endpoint, which returns a list of tokens (encoded in Base 64)
and their respective IDs.

> **Note:** At the time of this writing, there's no equivalent endpoint for Gemini models.

So I decided to create a [small application](https://tokens-lpj6s2duga-ew.a.run.app/) that lets users:

- input some text,
- select a model,
- calculate the number of tokens,
- and visualize them with some nice pastel colors.

The available PaLM-based models are:

- `textembedding-gecko`
- `textembedding-gecko-multilingual`
- `text-bison`
- `text-unicorn`
- `chat-bison`
- `code-gecko`
- `code-bison`
- `codechat-bison`

You can [try the application](https://tokens-lpj6s2duga-ew.a.run.app/) online.

And also have a look at the [source code](https://github.com/glaforge/llm-text-tokenization) on Github.
It's a [Micronaut](https://micronaut.io/) application.
I serve the static assets as explained in my recent
[article](https://glaforge.dev/posts/2024/01/21/serving-static-assets-with-micronaut/).
I deployed the application on [Google Cloud Run](https://cloud.run/),
the easiest way to deploy a container, and let it auto-scale for you.
I did a source based deployment, as explained at the bottom
[here]({{< ref "posts/2022/10/24/build-deploy-java-17-apps-on-cloud-run-with-cloud-native-buildpacks-on-temurin.md" >}}).

And _voilà_ I can visualize my LLM tokens!
