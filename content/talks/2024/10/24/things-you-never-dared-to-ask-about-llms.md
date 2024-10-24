---
title: "Things you never dared to ask about LLMs"
date: 2024-10-24T16:53:04+02:00
type: "talk"
layout: "talk"
tags:
  - generative-ai
  - large-language-models
---

Along my learning journey about generative AI, lots of questions poppep up in my mind.
I was very curious to learn how things worked under the hood in Large Language Models (at least having an intuition rather than knowing the maths in and out).
Sometimes, I would wonder about how tokens are created, or how hyperparameters influence text generation.

Before the [dotAI](https://www.dotai.io/) conference last week, I was invited to talk at the meetup organised by [DataStax](https://www.datastax.com/).
I presented about all those things you never dared to ask about LLMs, sharing both the questions I came up with while learning about generative AI, and the answers I found and discovered along the way.

Without further ado, here's the deck:

{{< speakerdeck 476be803290048d6935e585bf87d1e5f >}}

## Abstract

> ## Things you never dared to ask about LLMs
>
> Large Language Models (LLMs) have taken the world by storm, powering applications from chatbots to content generation.
> Yet, beneath the surface, these models remain enigmatic.
>
> This presentation will “delve” into the hidden corners of LLM technology that often leave developers scratching their heads.
> It’s time to ask those questions you’ve never dared ask about the mysteries underpinning LLMs.
>
> Here are some questions we’ll to answer:
>
> Do you wonder why LLMs spit tokens instead of words? Where do those tokens come from?
> * What’s the difference between a “foundation” / “pre-trained” model, and an “instruction-tuned” one?
> * We’re often tweaking (hyper)parameters like temperature, top-p, top-k, but do you know how they really affect how tokens are picked up?
> * Quantization makes models smaller, but what are all those number encodings like fp32, bfloat16, int8, etc?
> * LLMs are good at translation, right? Do you speak the Base64 language too?
>
> We’ll realize together that LLMs are far from perfect:
> * We’ve all heard about hallucinations, or should we say confabulations?
> * What is this reversal curse that makes LLMs ignore some facts from a different viewpoint?
> * You’d think that LLMs are deterministic at low temperature, but you’d be surprised by how the context influences LLMs’ answers…
>
> Buckle up, it’s time to dispel the magic of LLMs, and ask those questions we never dared to ask!

This talk wasn't recorded, but I hope to give this presentation again sometime soon, and hopefully, it'll be recorded then.
If that happens, I'll share the video recording once it's available.

## Illustrations: Imagen 3 to the rescure

For those who are curious about the cute little robots that appear in this presentation,
I've generated them with DeepMind's [Imagen 3](https://deepmind.google/technologies/imagen-3/) image generation model.

The quality of the output was really lovely, and I might have been a bit overboard with the number of generated robots in this deck.

I would start pretty much all my prompts with _"cartoon of a cute little robot..."_

For my Java developer friends, you can [generate images with Imagen via LangChain4j](https://glaforge.dev/posts/2024/10/01/ai-nktober-generating-ink-drawings-with-imagen/)
(as explained in that article where I generated black'n white ink drawings).