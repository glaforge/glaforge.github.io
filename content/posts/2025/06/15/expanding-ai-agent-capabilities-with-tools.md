---
title: "Expanding ADK AI agent capabilities with tools"
date: 2025-06-15T19:12:27+02:00
tags:
  - java
  - agent-development-kit
  - ai-agents
  - model-context-protocol
  - large-language-models
image: /img/adk/adk-tools.png

similar:
  - "posts/2025/05/20/writing-java-ai-agents-with-adk-for-java-getting-started.md"
  - "posts/2025/07/29/mastering-agentic-workflows-with-ADK-the-recap.md"
  - "posts/2025/05/27/adk-java-github-template.md"
---

In a nutshell, the **AI agent equation** is the following:

> _**AI Agent = LLM + Memory + Planning + Tool Use**_

AI agents are nothing without tools!
And they are actually more than mere Large Language Model calls.
They require some memory management to handle the context of the interactions (short term, long term, or contextual information like in the
[Retrieval Augmented Generation approach]({{< ref "/tags/retrieval-augmented-generation/" >}}).
Planning is important (with variations around the Chain-of-Thought prompting approach, and LLM with reasoning or thinking capabilities) for an agent to realize its tasks.

But for agents to be useful and to be able to sense or act upon their environment, the need access to tools.
Generally speaking, _tool use_ is about leveraging LLM's _function calling_ ability, to understand when it needs to request some kind of function to be called to proceed further in its next actions or next steps.

In my previous articles about [ADK](https://google.github.io/adk-docs/), I guided you through the
[creation of your first AI agent with ADK for Java]({{<ref "/posts/2025/05/20/writing-java-ai-agents-with-adk-for-java-getting-started.md" >}}),
and I even shared a [Github project template]({{<ref "/posts/2025/05/27/adk-java-github-template.md" >}}) to help you get started faster.
But today, I want to explore with you the concept of tools, and what tools are at your disposal when **creating AI agents in Java with ADK**.

## Built-in tools

ADK comes with a handful of very useful built-in tools:

- a Google Search tool,
- a Python code executor,
- an artifact service to store and load files.

### Circumventing LLM's cut-off date with Google Search

LLMs' knowledge is as recent as the last information of the corpus of training data they were trained on.
For example, if you asked an LLM who won the Roland Garros tennis tournament, since the finals ended just a week ago,
it wouldn't be able to tell you who won the 2025 edition.
However, if you give an LLM access to a search engine, it can answer that question with _grounded_ facts.

To do that with ADK, you need to add the `GoogleSearchTool` tool:

```java
// Given
LlmAgent agent = LlmAgent.builder()
    .name("helpful-assistant")
    .description("a helpful assistant who can search in Google")
    .instruction("""
        You're a helpful assistant
        who knows how to search in Google Search.
        Today is 2025-06-15.
        """)
    .model("gemini-2.0-flash")
    .tools(new GoogleSearchTool())
    .build();

// When
List<Event> events = askAgent(agent,
        "Who's the man won Roland Garos 2025?");

// Then
assertThat(events.get(0).content().get().text())
        .containsIgnoringCase("Alcaraz");
```

The Google Search tool is also very useful if you want to build some kind of _deep research_ agent that is able to search the web to collect key information to create complex reports.

### Executing code when advanced calculations or algorithms are needed

LLMs are notoriously bad at math or letter games, and at unrolling complex algorithms needed for reasoning purposes (like logic puzzles).
However, they are pretty good at generating code.
For math or algorithms, they are totally capable of generating the right piece of code that could solve the task at hand.
So if you give an LLM the ability to execute some code it generates, and examine the output of that execution, it's going to be able to understand the problem and give a correct answer.

ADK gives you access to the `BuiltInCodeExecutionTool` tool:

```java
// Given
LlmAgent agent = LlmAgent.builder()
    .name("helpful-assistant")
    .description("a helpful assistant that knows how to code")
    .instruction("""
        You're a helpful assistant.
        Today is 2025-06-10.
        """)
    .model("gemini-2.0-flash")
    .tools(new BuiltInCodeExecutionTool())
    .build();

// When
List<Event> events = askAgent(agent,
        "How much is Fibonacci(12) + Hackermann(3,3)?");

// Then
Content content = events.get(0).content().get();
assertThat(content.text()).contains("205");
```

In the example above, Gemini will write some Python code, and execute it inside a sandboxed Python interpreter, to give you the final answer.

### Tool to save and load artifacts

Last built-in tool I'd like to mention briefly: the `LoadArtifactsTool` tool, to deal with [artifacts](https://google.github.io/adk-docs/artifacts/)
(although they'd deserve their own article too).

Artifacts are named, versioned text or binary data associated with a user session or associated with a user across sessions.
Such _files_ can be persisted via the artifact service (there's even a Google Cloud Storage artifact service for long term storage).

Artifacts are accessible via methods like `saveArtifact()`, `loadArtifact()`, or `listArtifacts()` on objects like `CallbackContext` (when adding callbacks to your agents), or `ToolContext` (when adding tools to your agents in methods taking a `ToolContext` parameter).
Artifacts can also be accessed via the system instructions used to declare your agent.

I won't dive into details today, but for the sake of completeness, here's how you can configure the tool and mention artifacts in the agent system instructions:

```java
LlmAgent agent = LlmAgent.builder()
    .name("helpful-movie-assistant")
    .description("""
        a helpful assistant who knows
        about some rather unknown or obscure movies
        """)
    .instruction("""
        You're a helpful movie assistant.

        When asked questions about actors in a movie,
        forget about all intrinsic knowledge, and
        lookup the details in the artifact {artifact.movies.txt}.
        """)
    .model("gemini-2.0-flash")
    .tools(new LoadArtifactsTool())
    .build();
```

## Custom tools

When you need your own piece of logic to help your AI agent, you can create custom tools, via the `FunctionTool` class.
Custom tools are just regular methods, but with a twist: with some carefully crafted annotations to describe the tool to help LLMs understand what this tool can do.

Let's give the agent access to a `moonPhase` method inside the `ToolsTest` class to compute the phase of the moon for a given date:

```java
// Given
LlmAgent agent = LlmAgent.builder()
    .name("helpful-assistant")
    .description("a helpful assistant")
    .instruction("""
        You're a helpful assistant who knows about the moon.
        Today is 2025-06-15.
        """)
    .model("gemini-2.0-flash")
    .tools(FunctionTool.create(ToolsTest.class, "moonPhase"))
    .build();

// When
List<Event> events = askAgent(agent,
        "What's the moon phase today?");

// Then
String text = events.get(2).parts().get().get(0).text().get();
assertThat(text).containsIgnoringCase("full moon");
```

And now let's see what the `moonPhase` method does (with a hard-coded answer):

```java
@Schema(description = "get the moon phase for a given date")
public static Map<String, String> moonPhase(
    @Schema(name = "date",
        description = "the date for which to get the moon phase")
    String date) {
    return Map.of("moon-phase", "full moon");
}
```

I annotated the `moonPhase()` method with a `@Schema` with a description,
as well as the `date` parameter with both a description and a name.

> :warning: **Important:** This is very important to properly document your custom tool
> as LLMs will understand this information and that will help them
> figure out how to find the right method to invoke, and which parameters to pass it.

As of the time of this writing, the `0.1.0` release of ADK for Java supports `static` methods,
but in an upcoming version, it'll be possible to use instance methods as well.

Also note that it is mandatory to return a `Map`.
The reason is that you either return some kind of complex JSON object (that can be transparently un/marshalled),
or you return a map with some `status` field in addition to the normal return object,
to help the LLM understand if the execution was successful or not.
For example: `{"status": "success", "moon-phase": "full moon"}`.

### What about multimodal tools?

Since tool support is done via LLM's function calling capability, it's also limited by it!
Currently, I'm not aware of LLMs that are able to generate function calls that contain non-textual information, such as images, videos, etc.
Fortunately, there's a way to circumvent this limitation, thanks to ADK's `ToolContext`.

Let's say you want to leverage LLM's multimodal ability, by looking at a picture of the moon, and guess the phase of the moon depicted in that image.
Function calling can't pass the image directly, so let's see how you can access the user's full multimodal message via the `ToolContext`:

```java
// Given
LlmAgent agent = LlmAgent.builder()
    .name("helpful-assistant")
    .description(
        "a helpful assistant who can analyze pictures of the moon")
    .instruction("""
        You're a helpful assistant who knows about the moon.
        When asked a question about the moon, or pictures of the moon,
        you MUST call the `moonPhaseFromImage` function.
        """)
    .model("gemini-2.0-flash")
    .tools(FunctionTool.create(ToolsTest.class, "moonPhaseFromImage"))
    .build();
```

We're still creating a custom tool with `FunctionTool.create()` as before.
However, our method definition will have an additional parameter: an instance of `ToolContext`.
Note that it should be named `toolContext`, otherwise ADK won't be happy.

```java
@Schema(description = "get the moon phase by analyzing pictures")
public static Map<String, String> moonPhaseFromImage(
    @Schema(name = "toolContext")
    ToolContext toolContext) {

    Optional<List<Part>> optionalParts =
            toolContext.userContent().flatMap(Content::parts);
    if (optionalParts.isPresent()) {
        List<Part> imageParts = optionalParts.get().stream()
                .filter(part -> part.inlineData().isPresent()).toList();
        if (imageParts.size() == 1) {
            Part imagePart = imageParts.get(0);
            byte[] imageBytes =
                imagePart.inlineData().get().data().get();
            // do something with the image bytes...
            // make a normal multimodal LLM call
            // and return the result
            return Map.of("moon-phase", "half moon");
        }
    }
    return Map.of("moon-phase", "unknown");
}
```

The key line to look at (in addition to the `toolContext` parameter in the signature of the method) is the `toolContext.userContent()` call.
It gives you access to the `Part`s of the `Content` object which represents the user request.

In this code snippet above, we just retrieve the bytes of the uploaded image, and we're faking doing something with them.
But that's the place where you could make an LLM invocation to ask to analyze the image, and guess the phase of the moon depicted in the image.

## Long running custom tools

So far, I've talked about tools that are pretty much synchronous in nature, as they usually answer quite rapidly.
But what about situations where you have **long-running workflows** that take several hours or even days to run?

Or what about scenarios where there's the need for a **human in the loop** to validate some action, like a manager who needs to accept or reject an expense report from an employee? That's where **long-running custom tools** come in handy.

ADK offers `LongRunningFunctionTool`s.
In terms of API, they are exactly like `FunctionTool`s.
It's just that the framework knows the function will acknowledge the reception of the request, but the full completion of the request may happen at a later time.

Something that confused me initially was that working with LLMs is very _request / response_ oriented,
in the sense that there's always an input from a user, that leads to an output from the LLM.
And the conversation goes on and so forth.

What bothered me was the fact that I didn't know what would happen when we actually receive the final completion answer from the LLM.
Or even how will we receive that completion status?
Well, the thing is that we need to shift our mindset from the request / response turns approach,
and instead think of the fact that ADK is more like an _event loop_, which doesn't need a response to always follow a request,
but events can flow in and out, from the user, or from the system itself, in any order.

Let's configure a long running function:

```java
// Given
LlmAgent agent = LlmAgent.builder()
    .name("helpful-assistant")
    .description("a helpful assistant who can execute workflows")
    .instruction("You're a helpful assistant.")
    .model("gemini-2.0-flash")
    .tools(LongRunningFunctionTool.create(ToolsTest.class,
                                          "executeWorkflow"))
    .build();
```

This looks just like a normal `FunctionTool` declaration.

Now let's send a... _recipe_ workflows!

```java
// When
List<Event> events = askAgent(agent, """
    Execute the following workflow:
    - peel the potatoes
    - cut the potatoes in dice
    - put olive oil in the pan
    - heat pan
    - put the potato dices
    - stir regularly
    - cook for 10 minutes
    """);
```

Baking some potatoes can take some time, so you're not going to eat your cooked potatoes immediately!

Let's have a look at what our `executeWorkflow` method does:

```java
@Schema(description = """
    execute a long running workflow made of
    several steps explained in natural language
    """)
public static Map<String, Object> executeWorkflow(
    @Schema(name = "workflowDescription",
        description = "description of the workflow to execute")
    String workflowDescription,
    @Schema(name = "workflowSteps",
        description = "a list of workflow steps")
    List<String> workflowSteps) {
    return Map.of(
        "status", LongRunningOperation.Status.STARTED,
        "longRunningOperation", new LongRunningOperation(
            LongRunningOperation.Status.STARTED,
            workflowDescription, workflowSteps));
}
```

My `executeWorkflow` method actually returns immediately, to acknowledge the reception of the request.
We can imagine here that we're sending the steps (here a list of strings) to some workflow execution engine.
As return type of the method, I've decided to return a `status` indicating that the long running operation has started.
And I also return (in the same map) some `LongRunningOperation` object with the status, the workflow description, and the steps.

I've defined this `LongRunningOperation` as a record, and the status itself as a `Status` `enum`.

```java
record LongRunningOperation(
    LongRunningOperation.Status status,
    String description, List<String> steps) {
    enum Status {
        STARTED, FINISHED, ERROR
    }
}
```

But you can, of course, return some more complex object that contains an ID to be able to identify the workflow execution.
So that we know which execution completed.

At this point, the LLM used by ADK will reply to the user to acknowledge the reception of the request, and the start of the workflow.
Later on, an event should be sent back via ADK somehow, to notify your application of the completion of the workflow,
in a more event-oriented approach compared to the usual request/response approach of LLM conversations.

The example above is a dummy one, as we're not really executing a long running operation, and we're not going to receive an event upon completion.
So my idea is that I'll come back with an article later on that will dive deeper into long running operations and human in the loop scenarios,
as I believe we need a full article and complete demonstration to illustrate this concept more thoroughly.

## An agent as a tool

So far, we talked about built-in tools, and custom tools, but there's another kind of tool which is quite powerful, and which turn another agent into a tool itself!

Let's come back to our moon phase example.
First, let's define the agent that has access to the `moonPhase()` function.
It'll be the agent that will serve as a tool:

```java
LlmAgent moonAgent = LlmAgent.builder()
    .name("moon-agent")
    .description("Agent that knows about the moon")
    .instruction("""
        You know everything about the moon!

        Today is 2025-06-15.

        When asked about the phase of the moon,
        call the `moonPhase` tool with the current date as parameter.
        """)
    .model("gemini-2.0-flash")
    .tools(
        FunctionTool.create(ToolsTest.class, "moonPhase")
    )
    .build();
```

Now let's see how we can turn this sidekick agent into a tool, via the `AgentTool.create()` method:

```java
LlmAgent mainAgent = LlmAgent.builder()
    .name("helpful-assistant")
    .description("a helpful assistant who knows about the moon")
    .instruction("""
        You're a helpful assistant.

        When a question about the moon is asked,
        ask the question to the `moon-agent` tool.
        """)
    .model("gemini-2.0-flash")
    .tools(AgentTool.create(moonAgent))
    .build();

// When
List<Event> events = askAgent(mainAgent, "What's the moon phase today?");
```

I'm not showing all the `assert` statements, but there will be 3 events:
a function execution request addressed to the `moon-agent`, a function response from the `moon-agent`, and the final answer by the LLM who will reformulate the function response into a nice human readable answer.

I haven't talked about the various [agent flows supported by ADK](https://google.github.io/adk-docs/agents/workflow-agents/),
like _sub-agents_, _sequential_ agents, _loop_ agents, and _parallel_ agents, but **agent as tool** is a very powerful pattern for creating more complex agents composed or more specific agents.

Generally, a multi-agent system will be more powerful and more reliable than a big monolithic agent, when tasks can be split and shared among more specialized agents.
I'll come back to this later, in a subsequent article.

> :warning: **Important:** Today, a limitation of Gemini is that you can't use a function call and a built-in tool at the same time.
> ADK, when using Gemini as the underlying LLM, takes advantage of Gemini's built-in ability to do Google searches, and uses function calling to invoke your custom ADK tools.
> So agent tools can come in handy, as you can have a main agent, that delegates live searches to a search agent that has the `GoogleSearchTool` configured,
> and another tool agent that makes use of a custom tool function.
>
> Usually, this happens when you get a mysterious error like this [one](https://github.com/google/adk-python/issues/134) (reported against ADK for Python):
> `{'error': {'code': 400, 'message': 'Tool use with function calling is unsupported', 'status': 'INVALID_ARGUMENT'}}`.
> This means that you can't use a built-in tool and function calling at the same time in the same agent.
> The workaround, then, is to decompose the problem into multiple agents, and taking advantage of agent tools.

## Calling MCP tools

Last but not least, let's finish the round of tools with the most trendy one: **MCP** tools ([Model Context Protocol]({{< ref "/tags/model-context-protocol/" >}}))!

Last week, I wrote about how to
[create an MCP SSE server with Quarkus]({{< ref "/posts/2025/06/09/building-an-mcp-server-with-quarkus-and-deploying-on-google-cloud-run/" >}}),
where I exposed a couple of MCP tools that allow you to know the phase of the moon today or at a custom date — hence the theme again today with the moon.
Let's see how we can configure an agent to use this tool.

It is possible to use Server-Sent Event (SSE for short), or STDIO (standard-in / standard-out) protocols.
The moon phases MCP tool I created the other day was an SSE one.

The first thing to do is to configure it by giving the endpoint of the MCP server:

```java
SseServerParameters sseParams = SseServerParameters.builder()
    .url("https://moonphases-1234567890.europe-west1.run.app/mcp/sse")
    .build();
```

Then you can list (and potentially filter manually) the tools available:

```java
McpToolset.McpToolsAndToolsetResult toolsAndToolsetResult =
    McpToolset.fromServer(sseParams).get();
List<McpTool> moonPhasesTools = toolsAndToolsetResult.getTools();
```

And now you can configure the agent with the list of MCP tools you want to give it access:

```java
LlmAgent agent = LlmAgent.builder()
    .name("helpful-assistant")
    .description("a helpful assistant who knows about the moon")
    .instruction("""
        You're a helpful assistant.
        """)
    .model("gemini-2.0-flash")
    .tools(moonPhasesTools)
    .build();
```

And that's it! Pretty easy, right?

## Summary

In this article, we explored the concept of tools in AI agents, specifically in the context of ADK for Java.
First, we looked at the **built-in tools**, like Google Search, Python code execution, or the artifacts service.
Next, we explored **custom tools**, including **long-running tools**, or also how to **handle multimodal requests** thanks to the tool context.
We discovered the **agent as tool** concept, as a smart agent can be a tool itself for another agent.
Lastly, we also learned about remote **MCP server tools**.

In upcoming articles in this series, we'll dive deeper into some of those tools, and we'll build more complex use cases.
So stay tuned for the next episode!
