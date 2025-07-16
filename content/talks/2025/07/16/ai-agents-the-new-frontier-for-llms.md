---
title: "AI Agents, the New Frontier for LLMs"
date: 2025-07-16T12:14:22+02:00
type: "talk"
layout: "talk"
tags:
  - generative-ai
  - large-language-models
  - machine-learning
  - retrieval-augmented-generation
  - ai-agents
  - langchain4j
  - agent-development-kit
---

I recently gave a talk titled **"AI Agents, the New Frontier for LLMs"**. The session explored how we can move beyond simple request-response interactions with Large Language Models to build more sophisticated and autonomous systems.

If you're already familiar with LLMs and Retrieval Augmented Generation (RAG), the next logical step is to understand and build AI agents.

## What makes a system "agentic"?

An agent is more than just a clever prompt. It’s a system that uses an LLM as its core reasoning engine to operate autonomously. The key characteristics that make a system "agentic" include:

* **Planning and decomposition**: The ability to break down a complex goal into a sequence of smaller, manageable steps.
* **Tool use**: The capacity to interact with external systems, APIs, or data sources to gather information or perform actions (via _"function calling"_). This could be anything from searching the web to querying a database or calling a specific function.
* **Reflection**: The capability to analyze its own actions and their outcomes, learn from mistakes, and refine its plan to achieve the final objective.

This matters because it's a fundamental shift from simply *asking* an LLM for information to *tasking* a system with achieving a goal. An agent can handle ambiguity and orchestrate a series of operations to deliver a result that a single LLM call cannot.

## **Common Design Patterns**

To build these agents, we rely on established design patterns that provide structure to their autonomous behavior. In the talk, I cover several of these with concrete code examples, including:

* **ReAct (Reason and Act)**: This is a foundational pattern where the agent iterates through a loop of reasoning about the next best action, taking that action (often with a tool), and then observing the outcome to inform its next step.
* **Function calling**: This allows the model to declare that it needs to invoke an external tool or function and to provide the necessary arguments. The system then executes the function and feeds the result back to the model so it can proceed.
* **Human-in-the-Loop**: For tasks that require validation, approval, or handling ambiguity, this pattern ensures that the agent can pause its execution and request input from a human user before continuing.

---

The presentation demonstrates these concepts with practical examples, including a RAG agent and a story-generation application, using frameworks like [LangChain4j](https://docs.langchain4j.dev/) and the new [Agent Development Kit](https://github.com/google/adk-java) (ADK, in particular ADK for Java). I also touch on emerging standards for agent-to-agent communication (via the [A2A](https://a2aproject.github.io/A2A/latest/) protocol), and how to interact with external tools via [MCP](http://modelcontextprotocol.io/) (the Model Context Protocol).

If you are interested in learning how to build systems that can reason, plan, and act, you can find the full recording (for now only in French) and the accompanying slides below.

## The abstract

> Know Large Language Models at your fingertips? Mastering Retrieval Augmented Generation to help an LLM search your documents? It's time to dive into the wonderful world of intelligent agents, the next frontier for LLMs!
>
> In this session, we will first define what agents are, or at least what makes a system "agentic". We will explain the limitations of LLMs. Then, through concrete examples, we will implement different agents in Java, using the LangChain4j framework and ADK (the Agent Development Kit), to illustrate some typical agent patterns and to understand how to go beyond a simple LLM call to obtain responses that meet the needs of your users, or even to trigger actions with the surrounding system.
>
>But it’s not all we’ll learn about! An agent doesn’t live alone on a desert tropical island. Indeed it can communicate with other agents via tools that can be invoked thanks to the Model Context Protocol (MCP). They can also interact with other remote agents from other platforms and ecosystems, thanks to the Agent To Agent protocol (A2A).
>
>Are you ready for the next hype on agents? Come and discover it in this session!


## The slide deck

{{< speakerdeck ff7e2bd87c264008bc8ca8cb8112f936 >}}

## The video of the talk

I had the chance to give this talk at [Devoxx France](https://www.devoxx.fr/agenda-2025/speaker/guillaume-laforge/).
The only recording I have right now in French :fr:, but hopefully, once this talk is available in English, I'll update this post to also share an English version of it.

{{< youtube Yv7NX4cDxuI >}}
