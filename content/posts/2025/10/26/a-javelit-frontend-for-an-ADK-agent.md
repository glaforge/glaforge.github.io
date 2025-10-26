---
title: "A Javelit frontend for an ADK agent"
date: 2025-10-26T18:06:13+01:00
tags:
  - java
  - langchain4j
  - generative-ai
  - agent-development-kit
  - javelit
  - ai-agents
---

Continuing my journey with [Javelit](https://javelit.io),
after creating a [frontend for _"Nano Banana"_ to generate images]({{< ref "/posts/2025/10/24/javelit-to-create-quick-interactive-app-frontends-in-java.md" >}})
and a [chat interface for a LangChain4j-based Gemini chat model]({{< ref "/posts/2025/10/25/creating-a-javelit-chat-interface-for-langchain4j.md" >}}),
I decided to see how I could integrate an [ADK](https://github.com/google/adk-java) agent with a Javelit frontend.

## The Javelit interface for an ADK search agent

![A Javelit interface for an ADK search agent](/img/adk/adk-javelit.png)

The key ingredients of this interface:

- a title _(with some emojis :smiley:)_
- a container that displays the agent's answer
- a text input field to enter the search query

## The ADK agent

For the purpose of this article, I built a simple search agent, with a couple of search tools:

- a **Google Search** tool
- a **Google Maps** tool

So you can search for up-to-date information on Google Search,
as well as details about landmarks, points of interest, restaurants, etc., via Google Maps.

> **Note:** I recently [contributed](https://github.com/google/adk-java/pull/534)
> the `GoogleMapsTool` to ADK for Java, so it's not yet available in a public version,
> you'll have to wait for the next release (or even build it from sources!)
> to be able to use it.

Let's have a closer look at the agent code:

```java
LlmAgent agent = LlmAgent.builder()
    .name("gemini-search-agent")
    .instruction("""
        You are a helpful search assistant,
        able to search the web and Google Maps.
        When a user asks for research,
        be sure to use the appropriate tools detailed below.

        Use the `google_search` tool
        to search for up-to-date information.

        Use the `google_maps` tool
        to search for geographical information.
        """)
    .model("gemini-2.5-flash")
    .tools(
        new GoogleSearchTool(),
        new GoogleMapsTool()
    )
    .build();
```

This is a simple agent, with instructions detailing the tools at its disposal and wiring the two tools.

Next, to interact with the agent, we need some setup: we'll need a `Runner` and prepare a `Session`:

```java
InMemorySessionService sessionService = new InMemorySessionService();
InMemoryArtifactService artifactService = new InMemoryArtifactService();

Runner runner = new Runner(agent, agent.name(), artifactService, sessionService, null, null);

final String appName = runner.appName();
final String userId = UUID.randomUUID().toString();

Session session = runner
    .sessionService()
    .createSession(appName, userId)
    .blockingGet();
```

To interact with this agent via the `Runner`'s `runAsync()` method,
we need to keep the agent, the session, and the user ID around, so I created a `record` to hold them,
and created a method to wrap it all:

```java
record AgentRunnerSession(Runner runner, String userId, Session session) { }

private static AgentRunnerSession getAgentSession() {
    //... agent definition above...
    return new AgentRunnerSession(runner, userId, session);
}
```

## Building the UI and saving the agent in the Javelit session

Like in the previous articles, the UI code layout is prepared in the class' `main` method:

```java
public static void main(String[] args) {
  // Javelit UI layout
}
```

With Javelit, the UI component and layout code is re-run each time there's an interaction from the user.
In order to keep the conversation going with the agent, we need to store it in Javelit's session state.
It's created the first time thanks to the `computeIfAbsent()` method and retrieved upon subsequent calls:

```java
AgentRunnerSession holder = (AgentRunnerSession) Jt.sessionState()
    .computeIfAbsent("agentRunnerSession", key -> getAgentSession());
```

We add the title component, a container to hold the agent's response, and a text input field for the user's search query:

```java
Jt.title("\uD83D\uDD0D ADK Search Agent \uD83E\uDD16\uD83E\uDDE0").use();

JtContainer eventContainer = Jt.container().border(true).use();

String searchQuery = Jt.textInput("Search query").use();
```

When the user interacts with this text input field by hitting Enter, the input value is saved in the `searchQuery` variable.
Once we have that user query, we can pass it to the agent via the `Runner`'s `runAsync()` method.
For each event, we add a Markdown element with the content of that event:

```java
if (searchQuery != null && !searchQuery.isEmpty()) {
    holder.runner().runAsync(
        holder.userId(),
        holder.session().id(),
        Content.fromParts(Part.fromText(searchQuery)))
        .blockingForEach(event -> {
            Jt.markdown(event.stringifyContent()).use(eventContainer);
        });
}
```

With this approach, we maintain the conversational state.
Although the UI isn't displaying the past requests and responses,
each time the user enters a query, both the query and response are kept in the agent's memory.
That way, if you ask for information about a restaurant, then you ask about opening times,
it remembers it's about this particular restaurant.

## The whole example

{{<details summary="Click to view the whole source code">}}

```java
/// usr/bin/env jbang "$0" "$@" ; exit $?
//DEPS com.google.adk:google-adk:0.3.1-SNAPSHOT
package adk;

import com.google.adk.agents.LlmAgent;
import com.google.adk.artifacts.InMemoryArtifactService;
import com.google.adk.runner.Runner;
import com.google.adk.sessions.InMemorySessionService;
import com.google.adk.sessions.Session;
import com.google.adk.tools.GoogleMapsTool;
import com.google.adk.tools.GoogleSearchTool;
import com.google.genai.types.Content;
import com.google.genai.types.Part;
import io.javelit.core.Jt;
import io.javelit.core.JtContainer;

import java.util.UUID;

public class App {

  public static void main(String[] args) {
    AgentRunnerSession holder = (AgentRunnerSession) Jt.sessionState()
        .computeIfAbsent("holder", key -> getAgentSession());

    Jt.title("\uD83D\uDD0D ADK Search Agent \uD83E\uDD16\uD83E\uDDE0").use();

    JtContainer eventContainer = Jt.container().border(true).use();

    String searchQuery = Jt.textInput("Search query").use();

    if (searchQuery != null && !searchQuery.isEmpty()) {
      holder.runner().runAsync(
          holder.userId(),
          holder.session().id(),
          Content.fromParts(Part.fromText(searchQuery))).blockingForEach(event -> {
        Jt.markdown(event.stringifyContent()).use(eventContainer);
      });
    }
  }

  private record AgentRunnerSession(Runner runner, String userId, Session session) { }

  private static AgentRunnerSession getAgentSession() {
    LlmAgent agent = LlmAgent.builder()
        .name("gemini-search-agent")
        .instruction("""
            You are a helpful search assistant, able to search the web and Google Maps.
            When a user asks for research, be sure to use the appropriate tools detailed below.

            Use the `google_search` tool to search for up-to-date information.
            Use the `google_maps` tool to search for geographical information.
            """)
        .model("gemini-2.5-flash")
        .tools(
            new GoogleSearchTool(),
            new GoogleMapsTool()
        )
        .build();

    InMemorySessionService sessionService = new InMemorySessionService();
    InMemoryArtifactService artifactService = new InMemoryArtifactService();

    Runner runner = new Runner(agent, agent.name(), artifactService, sessionService, null, null);

    final String appName = runner.appName();
    final String userId = UUID.randomUUID().toString();

    Session session = runner
        .sessionService()
        .createSession(appName, userId)
        .blockingGet();

    return new AgentRunnerSession(runner, userId, session);
  }
}
```

{{</details>}}

## Summary

Another [Javelit](https://javelit.io/) integration on the books, this time with [ADK for Java](https://github.com/google/adk-java).

At first, I was a bit surprised by the library's unusual approach,
compared to more event-driven or reactive web frameworks.
However, I'm liking the simplicity of Javelit for quickly building a web frontend to let me experiment with ideas.

There are still many more features or components I'd like to explore (like charts, multi-page components, etc.)
So you might see me write a few more articles, or use it more in my own presentations and workshops!
