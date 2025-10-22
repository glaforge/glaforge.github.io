---
title: "Building AI Agents with ADK for Java"
date: 2025-10-22T12:18:14+02:00
type: "talk"
layout: "talk"
---

At Devoxx Belgium, I recently had the chance to present this new talk dedicated to
[ADK for Java](https://google.github.io/adk-docs/),
the open source Agent Development Kit framework developed by Google.

The presentation covered:
* an introduction to the notion of AI agents
* how to **get started in a Java and Maven project**
* how to create your first agent
* how to debug an agent via the **Dev UI**
* the coverage of the various **tools** (custom function tools, built-in tools like Google Search or code execution, an agent as tool, MCP tools)
* an overview of the different ways to combine agents into a **multi-agent system**: sub-agents, sequential agents, parallel agents, loop agents
* some details on the **event loop** and services (session and state management, artifacts, runner...)
* **structured** input / output schemas
* the various **callbacks** in the agent lifecycle
* the integration with LangChain4j (to give access to the plethora of LLMs supported by LangChain4j)
* the definition of agents via **configuration in YAML**
* the new **long-term memory** support
* the **plugin** system
* the new external **code executors** (via Docker containers or backed by Google Cloud Vertex AI)
* how to launch an agent with the Dev UI from **JBang**

## Slides of the presentation

The slide deck of this session is embedded below:

{{< speakerdeck 1cd42280a265486396c0822b0e0ec716 >}}

## Video recording of the talk

And you can also watch the recoding of this presentation here:

{{< youtube L6V6aQixOZU >}}

## Samples demonstrated during the conference

During the presentation, I demonstrated a lot of samples showing ADK in action.
You can find all the [examples](https://github.com/glaforge/ai-agent-protocols/tree/main/adk/src/main/java/agents/adk)
in this [GitHub repository](https://github.com/glaforge/ai-agent-protocols/).
There are also a couple of servers implementing an MCP server and an A2A server agent.

Among those examples, you'll find:
* a simple [science teacher](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_10_ScienceTeacher.java) agent
* the same [science teacher](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_12_ScienceTeacher_Live.java) agent but using voice (with a Gemini Live model)
* a [stock ticker](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_20_StockTicker.java) agent that uses a local Java method to look up (fake) stock prices
* a [news search agent](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_22_LatestNews_Search.java) configured to use the Google Search built-in tool
* an agent that uses the [built-in Python code executor tool](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_24_PythonCoder.java)
* an agent taking advantage of [Google Maps grounding](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_26_LocalGuide_Maps.java) to find local landmarks or restaurants
* a [moon expert](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_28_MoonExpert_MCP.java)! which calls a remote MCP server
* a [multi-agent](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_30_SearchAndTweet_SubAgents.java) using the sub-agents approach to search about some topic, and the potentially craft social post messages
* a [trip planner](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_32_TripPlanner_Sequential.java) agent using a sequential agent
* a [company detective](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_34_CompanyDetective_Parallel.java) agent using the parallel agent approach to launch different searches in parallel
* a [code refiner](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_36_CodeRefiner_Loop_Exit.java) agent using the ADK loop agent to loop over different tasks (writing code & critiquing code)
* a [weather forecast](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_40_WeatherForecast_Callback.java) agent just to show the various callbacks you can configure on an agent
* an agent using a [local agent running in Ollama](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_50_Coffee_LangChain4j.java), thanks to [my ADK / LangChain4j bridge](https://developers.googleblog.com/en/adk-for-java-opening-up-to-third-party-language-models-via-langchain4j-integration/)
* an example showing how to [load a YAML-defined agent](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_60_CapitalCity_YAML.java)
* and the bonus for the end: an [agent using the Nano Banana](https://github.com/glaforge/ai-agent-protocols/blob/main/adk/src/main/java/agents/adk/_70_ImageEditor_NanoBanana.java) image generation and edition model

## Updated ADK template project

With the recent (somewhat silent) release of [version 0.3.0](https://github.com/google/adk-java/releases/tag/v0.3.0),
I seized the opportunity to also update my [ADK template project](https://github.com/glaforge/adk-java-maven-template) on GitHub.
In a [recent article](https://glaforge.dev/posts/2025/05/27/adk-java-github-template/), I wrote about this template project,
how you can clone it or reuse it, to get started with ADK for Java easily, with a sample agent, and a Maven build.

