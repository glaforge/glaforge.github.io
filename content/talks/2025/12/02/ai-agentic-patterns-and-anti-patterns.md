---
title: "AI Agentic Patterns and Anti-Patterns"
date: 2025-12-02T12:24:40+01:00
type: "talk"
layout: "talk"
tags:
- ai-agents
- generative-ai
- design-patterns
---

This week, I was on stage at the
[Tech Rocks Summit 2025](https://events.tech.rocks/e/tech-rocks-summit-2025/fr/session/9b0ac306-ac56-f011-8f7c-6045bd96bdd0/agents-ia-la-nouvelle-frontiere-des-llms)
in the beautiful Théâtre de Paris.
This is the first I'm attending this event, gathering a nice crowd of CTOs, tech leads, architects, and decision makers.

My talk focused on what everyone is talking about right now: **AI Agents**.
And in particular, I was interested in sharing with the audience things I've seen work or not work in companies, startups,
and via tons of discussions with AI practitioners I met at conferences, meetups, or customer meetings.

Without further ado, here's the deck in French :fr: I showed on stage:

{{< speakerdeck ef0430dc8f2e418b8e0e2e8297cf452a >}}

And in English as well for my international readers:

{{< speakerdeck eebc232e3cc34b4b891ba483f5953c3d >}}

## A Quick Historical Recap

We saw the [Transformer](https://en.wikipedia.org/wiki/Transformer_(deep_learning)) wave in 2017, the ChatGPT tsunami in 2023,
and the [RAG]({{< ref "tags/retrieval-augmented-generation" >}}) (Retrieval Augmented Generation) trend in 2024.
In 2025, here we are: Agents are the new frontier for LLMs.

But concretely, what does this change for us, devs and tech leaders?
What works, what doesn't work?
Here are the key points of my presentation.

## What is an Agent, Really?

Forget the magic for two minutes. An agent is a fairly simple equation:

> Agent = LLM + Memory + Planning + Tools

It is no longer just a model predicting the next word.
It is a system that observes, plans, acts, and thinks (the famous Reflection loop to correct its own errors).

## Architecture Patterns that Work

I presented 4 patterns to avoid reinventing the wheel:

* **The Orchestrator**: A supervisor agent that delegates to specialized _sub-agents_.
  This is crucial for breaking down a complex task into digestible chunks.
* **Rethinking Tools**: Don't just throw your raw REST API at the LLM.
  Create _"business task"_ oriented tools (e.g., "Schedule Meeting" vs `POST /calendar/v1/events`).
  Fewer tools = less confusion = more determinism.
* **MCP (Model Context Protocol)**: This is the future standard, essentially the _USB for AI tools_.
  It standardizes how an agent connects to its tools, launched by Anthropic and now widely adopted (but still rapidly evolving).
* **A2A (Agent to Agent)**: Google and its partners are pushing this extensible protocol
  so that agents can discover and collaborate with each other, regardless of their language or framework.

## Traps to Avoid (Anti-Patterns)

I insisted on this because I see teams falling into these traps:

* **The "Chatbot Mandate"**: Does your leadership want _"a chatbot"_? Resist.
  AI should often be invisible (like a Head-Up Display), not necessarily an endless conversation.
* **Insufficient Vibe-Checking**: _"It looks like it works"_ is not a testing strategy.
  You need _Golden Responses_, LLM-as-a-Judge, and a **real evaluation phase**.
* **Silent Confabulation**: RAG is great, but if the AI invents things, it's dangerous.
  Force source citation and aim for IVO
  (_Immediately Validatable Output_, coined by my colleague [Zack Akil](https://www.zackakil.com/)):
  the user must be able to verify the result at a glance.
* **The Coding "Rabbit Hole"**: Coding agents are stunning but can lead you down the wrong path with incredible confidence.
  (_"You're absolutely right!"_)
  Keep a cool head and focus on value (MVP), not feature creep.

## Back at the Office: What Do We Do?

I concluded with a _"Todo List"_ for when attendes are back at the office:

* Don't ask yourself _"Where can I squeeze in a chatbot?"_.
  Instead, identify the most painful business process (the Critical User Journey).
* Experiment small. The goal is to learn.
* Measure & Evaluate. It's your users who will tell you if you're right, not the hype.

The agent might not buy happiness, but implemented well, it can seriously contribute to it! :smile:



