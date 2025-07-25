---
title: "Mastering agentic workflows with ADK for Java: Sub-agents"
date: 2025-07-23T18:42:56+02:00
tags:
  - java
  - agent-development-kit
  - ai-agents
  - large-language-models
image: /img/adk/adk-subagents.jpg
---

Let me come back to the [Agent Development Kit](https://github.com/google/adk-java) (ADK) for Java!
We recently discussed the many [ways to expand ADK agents with tools]({{<ref "/posts/2025/06/15/expanding-ai-agent-capabilities-with-tools.md" >}}).
But today, I want to explore the multi-agentic capabilities of ADK, by talking about **sub-agent workflows**.

In upcoming articles in this series, we'll also talk about sequential, parallel, and loop flows.

## The "divide and conquer" strategy

Think of building a complex application. You wouldn't put all your logic in a single, monolithic class, would you? You'd break it down into smaller, specialized components. The sub-agent workflow applies this same "divide and conquer" principle to AI agents.

Instead of one "do-it-all" agent, you create a hierarchy:

- An **orchestrator agent** that acts as a project manager.
- Several **specialized sub-agents** that act as team members, each with a specific skill.

This approach has some important advantages:

- **Clarity and focus:** Each agent gets a clear, concise set of instructions (its system prompt). A focused agent is a more reliable and predictable agent. It's less prone to hallucinations, or being lost at the complexity of the task at hand.
- **Modularity and reusability:** An agent designed for a specific task, like summarizing text, can be reused across many different applications. So you can play Lego bricks to build your next agents!
- **Maintainability:** Debugging or enhancing a small, focused agent is infinitely easier than untangling the logic of a massive, overburdened one, with potentially conflicting system instructions to tackle all the corner cases of each situation.

## A practical example: a _content companion_

Let's make this concrete by looking at an example I've been playing with:
a "content companion," an AI assistant designed to help bloggers and influencers research topics and draft social media posts.

This system is a perfect illustration of a sub-agent hierarchy, composed of a few distinct agents working in concert.

{{< details summary="Click to see the full source code, before diving in" >}}

```java
LlmAgent searchAgent = LlmAgent.builder()
    .name("google-search-agent")
    .description("""
        An agent that searches on Google Search
        """)
    .instruction("""
        Your role is to search on Google Search.
        Use the Google Search Tool to search up-to-date
        and relevant information about the topic.
        """)
    .model("gemini-2.0-flash")
    .tools(new GoogleSearchTool())
    .build();

LlmAgent topicSearchAgent = LlmAgent.builder()
    .name("topic-search-agent")
    .description("""
        An agent that searches and dives in particular topics
        """)
    .instruction("""
        Your role is to help explore a particular topic.
        Use the `google-search-agent` tool to search up-to-date
        and relevant information about the topic.
        Be sure to display the result of the search
        to inform the user.
        """)
    .model("gemini-2.0-flash")
    .tools(AgentTool.create(searchAgent))
    .afterAgentCallback(callbackContext -> {
        callbackContext.eventActions()
            .setTransferToAgent("content-companion");
        return Maybe.empty();
    })
    .build();

LlmAgent socialMediaAgent = LlmAgent.builder()
    .name("social-media-agent")
    .description("""
        An agent that crafts social media posts about a topic
        """)
    .instruction("""
        Given content about a topic, your role is to craft
        an attractive social media post about it.
        Don't hesitate to use meaningful emojis
        when it helps convey the message.
        """)
    .model("gemini-2.0-flash")
    .afterAgentCallback(callbackContext -> {
        callbackContext.eventActions()
            .setTransferToAgent("content-companion");
        return Maybe.empty();
    })
    .build();

return LlmAgent.builder()
    .name("content-companion")
    .description("""
        A content companion that searches topics
        and crafts compelling social media stories
        """)
    .instruction("""
        Your role is to help bloggers and influencers
        come up with interesting topic ideas,
        to search information about the topic to write about,
        and potentially to craft a compelling social media post.

        Don't search yourself:
        Use the `topic-search-agent`
        to find information about a topic.

        Don't write social media posts yourself:
        Use the `social-media-agent`
        to craft a social media post about the topic.
        """)
    .model("gemini-2.0-flash")
    .subAgents(socialMediaAgent, topicSearchAgent)
    .build();
```

{{</ details >}}

Let's zoom in on the various components.

### 1. The orchestrator: `content-companion`

At the top of our hierarchy is the `content-companion`. This is the agent we, the user, will interact with. Its main job is to understand our high-level goal and delegate the actual work to the right specialist.

Notice its instructions: it's explicitly told _what not to do_.

```java
return LlmAgent.builder()
    .name("content-companion")
    .description("""
        A content companion that searches topics
        and crafts compelling social media stories
        """)
    .instruction("""
        Your role is to help bloggers and influencers
        come up with interesting topic ideas,
        to search information about the topic to write about,
        and potentially to craft a compelling social media post.

        Don't search yourself: Use the `topic-search-agent`
        to find information about a topic.

        Don't write social media posts yourself:
        Use the `social-media-agent` to craft
        a social media post about the topic.
        """)
    .model("gemini-2.0-flash")
    .subAgents(socialMediaAgent, topicSearchAgent) // Sub-agents!
    .build();
```

The `.subAgents()` method is where the magic happens. It registers the `socialMediaAgent` and `topicSearchAgent` (detailed further down below)
and makes them available as callable agents for the `content-companion`. The orchestrator doesn't need to know _how_ they work, just _what_ they do.

Now lets turn our attention to the sub-agents.

### 2. The specialists: The sub-agents

The `content-companion` manages two direct reports:

- **`topic-search-agent`**: the research assistant.
- **`social-media-agent`**: the creative copywriter.

Each of these is an independent `LlmAgent` with its own focused prompt. For example, the `social-media-agent` is single-mindedly focused on its creative task:

```java
LlmAgent socialMediaAgent = LlmAgent.builder()
    .name("social-media-agent")
    .description("""
        An agent that crafts social media posts about a topic
        """)
    .instruction("""
        Given content about a topic, your role is to craft
        an attractive social media post about it.
        Don't hesitate to use meaningful emojis
        when it helps convey the message.
        """)
    .model("gemini-2.0-flash")
    .build();
```

### 3. Deeper delegation: Agents as tools

Here's where it gets interesting.
The delegation doesn't have to stop at one level.
As I covered in my previous post on [expanding agent capabilities with tools](https://glaforge.dev/posts/2025/06/15/expanding-ai-agent-capabilities-with-tools/),
one agent can be used as a tool by another.

Our `topic-search-agent` needs to search the web, but we want to abstract that capability. So, it delegates the raw search functionality to an even more specialized agent.

```java
// The lowest-level worker,
// whose only job is to use the GoogleSearchTool
LlmAgent searchAgent = LlmAgent.builder()
    .name("google-search-agent")
    .tools(new GoogleSearchTool())
    // ...
    .build();

// The mid-level manager,
// which uses the searcher as a tool
LlmAgent topicSearchAgent = LlmAgent.builder()
    .name("topic-search-agent")
    .instruction("""
        Your role is to help explore a particular topic.
        Use the `google-search-agent` tool...
        """)
    .tools(AgentTool.create(searchAgent)) // An agent becomes a tool!
    .build();
```

By wrapping `searchAgent` with `AgentTool.create()`, we turn a fully-fledged agent into a simple, callable tool. This is a powerful abstraction that keeps our agent responsibilities cleanly separated.

> **Note:** In our use case, this is also necause of a technical limitation:
> in ADK, with Gemini, you can't have multiple tools configured when a built-in tool like the `GoogleSearchTool` is declared.
> So using _agents-as-tools_ also helps circumventing this limitation.

## Tracing the flow of delegation

Let's trace a simple request to see how this all fits together:

1.  **Me:** _"Find me some information about the latest planet discoveries in 2025."_
2.  **`content-companion`:** It receives the request. Its instructions forbid it from searching. It sees that the `topic-search-agent` is the right tool for the job and invokes it.
3.  **`topic-search-agent`:** It's now active. Its instructions tell it to use the `google-search-agent` tool. It calls this tool to perform the search.
4.  **`google-search-agent`:** This agent's only job is to execute its tool, `GoogleSearchTool`. It runs the search and returns the raw results.
5.  **The results flow back up the chain:** The raw data goes from `google-search-agent` to `topic-search-agent`. The `topic-search-agent` might then process or summarize these results before passing them up to the `content-companion`, which finally presents the answer to me.

Then via a new interaction, you can ask for a tweet about the discoveries:

1.  **Me:** _"Craft a short tweet about those discoveries."_
2.  **`social-media-agent`:** It receives the request, and remembers the ongoing conversation about exoplanets, and will prepare a tweet as requested.
3.  **The result is shared with the `content-companion`**, which will deliver the final tweet suggestion back to me.

## Choreographing the cadk onversation with `afterAgentCallback`

If you look closely at the entire Java code posted at the beginning of the article,
you'll spot a curious addition to our specialist agents: an `afterAgentCallback`.
This isn't just boilerplate; it's a crucial piece of conversational choreography.

```java
.afterAgentCallback(callbackContext -> {
    callbackContext.eventActions()
        .setTransferToAgent("content-companion");
    return Maybe.empty();
})
```

So, what does this do? It explicitly manages the flow of control.

Without this callback, after the `topic-search-agent` finishes its research, the conversational focus would remain with it.
If I then said, _"Okay, now write a tweet about that,"_ the `topic-search-agent` would be confused. That's not its job.
I'd be _"stuck"_ talking to the specialist, and I'd have to manually re-engage the main `content-companion`.
That's a clunky user experience.

The `afterAgentCallback` solves this elegantly.
It acts as a _"return to sender"_ instruction. The `setTransferToAgent("content-companion")` command tells the ADK:
_"As soon as this agent's turn is over, immediately transfer the conversational control back to the `content-companion`."_

This ensures the user always has a smooth, continuous dialogue with the main orchestrator, which is always ready for the next command. It's a vital mechanism for designing complex yet intuitive agentic systems.

## Why bother with agent hierarchies?

Creating a sub-agent workflow makes the difference when:

- Your problem is multi-faceted, like _"research a topic, write a summary, and then draft a tweet."_
- You want to build a system that is robust and easily extensible. Need a new capability? Just build a new specialist agent and register it with your orchestrator.
- You want your prompts to be simple and effective. Less ambiguity in the prompt leads to more reliable behavior from the LLM.

By composing agents this way, we move from simple _command-and-response_ bots to building truly scalable and capable AI systems.

Stay tuned for our next post! We'll explore **sequential workflows** to orchestrate tasks that must happen in a specific, predictable order.
