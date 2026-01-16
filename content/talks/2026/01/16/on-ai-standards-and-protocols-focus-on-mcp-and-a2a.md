---
title: "On AI Standards and Protocols: Focus on MCP and A2A"
date: 2026-01-16T11:04:42+01:00
type: "talk"
layout: "talk"
tags:
- java
- ai-agents
- generative-ai
- large-language-models
---

At [SnowCamp 2026](https://snowcamp.io/),
with my [Cast Codeurs](https://lescastcodeurs.com/)
buddy [Emmanuel Bernard](https://x.com/emmanuelbernard)
of [Hexactgon](https://hexactgon.com/),
I had the chance to deliver a talk on AI standards and protocols,
with a big focus on [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) (Model Context Protocol),
and [A2A](https://a2a-protocol.org/latest/) (Agent 2 Agent Protocol).

Without further ado, here's the slide deck we presented:

{{< speakerdeck c93dff0ec41f47a693a02b9c2402d189 >}}

This talk is based on the Devoxx 2025
[deep dive session](https://m.devoxx.com/events/dvbe25/talks/24587/on-standards-and-ai-agents-a-walkthrough-of-mcp-a2a-adk-and-more)
that Emmanuel, my colleague [Mete Atamel](https://atamel.dev/) delivered.
As the talk wasn't recorded during SnowCamp, I'll share with you the 3h-long video from Devoxx below:

{{< youtube "DiZs--ODXVM" >}}

## Abstract

> AI agent foundations are built over a handful of common protocols that you need to master,
> to make the best out of your LLM and agent framework. That’s why it’s important to understand them.
> But some are catching up, others are not.
>
> In this deep dive, we will explore the ecosystem showing you these standards and focusing on the important ones.
> Knowing some of the frameworks is useful too to get started faster.
> Welcome MCP, A2A, ACP protocols, and ADK, Arc, Quarkus, LangChain4j frameworks!
>
> After giving you an overview of the main standards and protocols, their merit and their popularity,
> we will start by building an agent using Agent Development Kit (ADK) and walk through making a tool call.
> From there, zooming on MCP, we’ll see how to standardize that tool via a local MCP server
> and then deploy it as a remote MCP server to share it with others.
>
> Next, we’ll dive into the A2A protocol and enable our agent to participate in multi-agent conversations.
> And to do that, we will use another framework, Quarkus and LangChain4j, showing how different stacks interact seamlessly through A2A.
>
> You’ll learn not just what these protocols do and how they work, but why they matter, with detailed walkthroughs and live demos throughout.
>
> If you’re struggling to understand all the protocol details around AI agents, this session is for you!

## Important links

Throughout the presentation, we showed various demos, implemented in Java:

### MCP

* [Micronaut moon phases MCP server](https://github.com/glaforge/mn-mcp-server)
* [Quarkus moon phases MCP server](https://github.com/glaforge/moon-phases-quarkus-mcp-sse-server)
* [arXiv papers MCP server](https://github.com/glaforge/arxiv-mcp-server)
* [Python samples from Mete Atamel](https://github.com/meteatamel/genai-beyond-basics) showed at Devoxx

### A2A

* [My repository with the product marketing MCP+A2A demo and other ADK samples](https://github.com/glaforge/ai-agent-protocols) (showed at Devoxx)
* [Emmanuel's Quarkus A2A demo](https://github.com/emmanuelbernard/quarkus-a2a-deepdive/tree/snowcamp-2026)

