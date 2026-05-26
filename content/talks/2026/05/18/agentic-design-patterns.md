---
title: "Agentic Design Patterns"
date: 2026-05-18T16:54:59+02:00
type: "talk"
layout: "talk"
tags:
- design-patterns
- ai-agents
- generative-ai
- langchain4j
- agent-development-kit
---

At Devoxx France 2026, I had the pleasure of presenting a session on **Agentic Design Patterns**. 
In this talk, I explore how to move beyond basic LLM wrappers to build reliable, scalable, and sophisticated AI agent systems.

In the coming weeks, I'll be blogging about some of these patterns, that I implemented using 
[LangChain4j](https://docs.langchain4j.dev) and [ADK for Java](https://adk.dev).

## Abstract

> It's time to dive into the deep end, far from "hello world" demos. To build your multi-agent systems, you often start by assembling classic bricks: sequential or parallel flows, or loops. The basics!
> 
> But it's by combining these components that we create truly powerful patterns, such as reflection loops or critic/reviewer duos. However, to reach true "AI-llumination," you'll have to make choices: which routing pattern to adopt? How to drive a swarm of agents so they collaborate without going in all directions?
> 
> And what if we pushed even further? We can now imagine an entire ecosystem of remote agents communicating with each other. In short, all this and more, but with code snippets inside!
> 
> As a committer on **LangChain4j** and **ADK for Java** (Agent Development Kit), I invite you to join me in this "agentic" adventure. My goal: to give you the keys to choosing the right abstractions and avoiding technical dead ends on your journey.

## Recording

The video is available in French only for now, as it was only recorded at [Devoxx France 2026](https://www.devoxx.fr/),
but I'll update this post whenever an English version becomes available.

{{< youtube c092bWijLhU >}}

## Slides 

{{< speakerdeck e7fbe97ee4f74ca0a11109299481fb1f >}}

## Summary

As we transition from simple RAG pipelines to autonomous agents, the complexity of managing non-determinism, "context rot," and execution reliability increases. This talk introduces a "Pattern Language" for agents, categorizing them into key domains.

### Deep Dive into the Patterns

- **Programmatic Planning:** 
  While LLMs can plan dynamically, some business processes require strict adherence to specific steps. This pattern uses hardcoded sequences or state machines to guide the agent. It provides high determinism, simplifies debugging, and ensures that the agent follows "golden paths" for critical tasks.

- **Progressive Disclosure (Agent Skills):** 
  To prevent "context rot" and reduce hallucinations, you shouldn't overwhelm an agent with every possible tool or instruction at once. Instead, this pattern dynamically injects specific "skills" or detailed tool documentation into the prompt only when the agent identifies a need for them. This keeps the context window lean and the reasoning focused.

- **Hierarchical Agent Decomposition:** 
  Complex problems are best solved by a team of experts rather than a single generalist. This pattern involves a "Manager" agent that orchestrates specialized sub-agents (e.g., a "Coder," a "Researcher," and a "Reviewer"). This allows for model-specific optimization—using smaller, faster models for simple sub-tasks and larger ones for coordination.

- **Goal-Oriented Action Planning (GOAP):** 
  Borrowed from game AI, GOAP reverses the planning process. Instead of defining a path, you define a *Goal* and the *Preconditions* and *Effects* of each available tool. A planner then autonomously selects the sequence of actions that transition the current state to the goal state, providing immense flexibility in dynamic environments.

- **Feedback Loops (Reflection):** 
  Reliability is achieved through iteration. In this pattern, an agent's initial output is passed to a "Critic" or "Verifier" (which could be the same agent or a different one). The agent then reflects on the feedback and regenerates the response. This "think-correct-execute" loop is essential for complex tasks like code generation or mathematical reasoning.

- **LLM-as-Judge:** 
  Evaluating agentic systems at scale is a major challenge. This pattern uses high-capacity LLMs to evaluate the outputs of other models based on predefined rubrics and scoring criteria. By quantifying qualitative aspects like "helpfulness" or "safety," it enables automated benchmarking and faster development cycles.

The core takeaway is that while agents provide the "reasoning engine," it is the **Orchestration** and **Harness Engineering**—guided by these patterns—that ensures they reach their goals consistently.
