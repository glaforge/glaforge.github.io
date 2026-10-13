---
title: "Getting Started with Google Antigravity"
date: 2026-10-12T09:30:00+02:00
type: "talk"
layout: "talk"
image: /img/antigravity/getting-started-with-google-antigravity.jpg
caption: "Getting Started with Google Antigravity presentation at Dev With AI 2026"
tags:
- antigravity
- ai-agents
- gemini
description: "An overview of Google DeepMind's Antigravity agentic development environment presented at the Dev With AI conference in Paris."
---

Earlier this week, I spoke at the first edition of the [Dev With AI](https://devw.ai/conference) conference in Paris, held at the Forum des Images. 
The event brought together around 500 developers to exchange notes on practical AI tooling, real-world development workflows, and coding agents.

My presentation, **"Antigravity, le dev agentique façon Google DeepMind"**, was a fast-paced 20-minute tour of Google's agentic development environment. 
I walked through how the platform is structured, from developer surfaces down to autonomous execution and safety guardrails.

Here is a breakdown of the core building blocks I presented.

## 1. Developer Surfaces

Antigravity gives you multiple entry points depending on how you want to work:

- **Antigravity 2.0 (Agent Manager)**: A desktop application acting as an agent mission control. You assign high-level goals, watch autonomous agents execute tasks in parallel, review diffs, inspect artifacts, and collaborate directly with them.
- **Antigravity IDE**: An agent-centric editor built on a VS Code base, combining full editing capabilities with native agent orchestration panes and interactive sidecars.
- **Antigravity CLI (`agy`)**: A command-line tool for developers who prefer running tasks and autonomous workflows directly from the terminal or shell scripts.
- **Antigravity SDKs**: Programmatic libraries (available for Python, with an [unofficial SDK for Java]({{< ref "/posts/2026/07/31/the-unofficial-antigravity-sdk-for-java" >}}) that I wrote) that wrap the native Go execution harness so you can build custom agent automations in your own code.

## 2. Autonomy and Extensibility

To tackle non-trivial tasks without constant hand-holding, Antigravity combines several autonomy primitives:

- **Subagents**: Specialized workers that the main agent can spin up concurrently to explore code, research documentation, or run tests in isolation without cluttering the primary context window.
- **Custom Agents**: Pre-configured specialist personas defined with their own roles, system prompts, and toolsets.
- **Agent Skills**: Folders containing a `SKILL.md` instruction file and domain resources. Skills follow a progressive disclosure model: the agent only loads detailed documentation into context when relevant to the task at hand.
- **MCP Servers**: Native support for the Model Context Protocol, enabling agents to tap into external tools and datasources seamlessly.
- **Slash Commands**: Quick shortcuts in chat to trigger repeatable workflows or specialized capabilities like `/plan`, `/browser`, `/goal`, or `/generative-ui` (maybe my favorite!)

## 3. Orchestration, Control, and Safety

Autonomy needs guardrails. Antigravity provides structured control mechanisms to keep agents safe and accountable:

- **Artifacts**: Structured markdown deliverables (like implementation plans, diffs, or reports) that give you clear checkpoints to inspect and approve before execution continues.
- **Remote Control & Steering**: The ability to send messages, pause, redirect, or course-correct running agents in real time (even from your phone, when you're away from your keyboard).
- **Rules and System Directives**: Persistent guidelines (like coding style guides or safety rules) that the agent must strictly follow across sessions.
- **Sidecars and UI Extensions**: Interactive visual panes embedded directly into the workspace (such as browser viewers or visual canvases).
- **Execution Policies & Sandboxing**: Intercepting commands and tool calls with configurable allow/deny policies to prevent unintended actions.

---

## Slides

The presentation slides are embedded below and available on [Speaker Deck](https://speakerdeck.com/glaforge/getting-started-with-google-antigravity):

{{< speakerdeck 2fd899ae1d334c6abdbe4e5a93a2b683 >}}

---

## Resources

- **Slides**: [Getting Started with Google Antigravity on Speaker Deck](https://speakerdeck.com/glaforge/getting-started-with-google-antigravity)
- **Conference**: [Dev With AI 2026](https://devw.ai/conference) in Paris
- **Antigravity**: [antigravity.google](https://antigravity.google/)
