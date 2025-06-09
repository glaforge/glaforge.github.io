---
title: "Building an MCP server with Quarkus and deploying on Google Cloud Run"
date: 2025-06-09T13:01:03+02:00
tags:
  - model-context-protocol
  - java
  - quarkus
  - serverless
  - google-cloud-run
  - ai-agents
image: /img/adk/robot-moon-phase.png
---

As I’m contributing to [ADK](https://github.com/google/adk-java) (Agent Development Kit) for Java, and [LangChain4j](https://docs.langchain4j.dev/) (the LLM orchestration framework) I interact with [MCP](https://modelcontextprotocol.io/introduction) (Model Context Protocol) servers and tools to further expand the capabilities of my LLMs.

Recently, I showed how to [vibe-code an MCP server using Micronaut](https://glaforge.dev/posts/2025/05/02/vibe-coding-an-mcp-server-with-micronaut-and-gemini/). You know I usually talk about [Micronaut](https://micronaut.io/), but this time, I wanted to experiment with Quarkus, and in particular with its built-in support for [implementing MCP servers](https://docs.quarkiverse.io/quarkus-mcp-server/dev/index.html).

## Getting started with Quarkus’ MCP support

I created a brand new Quarkus project from IntelliJ IDEA, with its Quarkus template, and I added a couple key dependencies for JSON marshalling, but even more important, for the MCP support:

```xml
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-resteasy-jackson</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkiverse.mcp</groupId>
    <artifactId>quarkus-mcp-server-sse</artifactId>
    <version>1.2.0</version>
</dependency>
```

As I’m going to deploy the server in the cloud, I chose to go with an SSE server: [Server Sent Events](https://modelcontextprotocol.io/docs/concepts/transports#server-sent-events-sse). The STDIO protocol is usually used for MCP servers running locally along the MCP host (i.e. your application invoking the tool).

Instead of going with the usual _weather forecast_ use case, which is a bit like the _hello world_ of MCP servers, I decided to implement a service that calculates the phases of the moon! I got the idea from a recent post on Hackernews that pointed at a GitHub repository that offered [different implementations of the calculation of the moon phases](https://github.com/oliverkwebb/moonphase/tree/main). I used Gemini to convert the algorithm to Java, as there was no Java implementation.

I’ll spare you the details of the calculation, but you can have a look at the [code](https://github.com/glaforge/moon-phases-quarkus-mcp-sse-server) I wrote (or Gemini wrote!) to do the math. However, I’ll show you the structure of my `MoonPhasesService` class:

```java
import jakarta.inject.Singleton;

@Singleton
public class MoonPhasesService {
    public MoonPhase currentMoonPhase() {
        return moonPhaseAtUnixTimestamp(System.currentTimeMillis() / 1000L);
    }

    public MoonPhase moonPhaseAtUnixTimestamp(long timeSeconds) {
        // ...
    }
    // ...
}
```

This service is able to give you the phase of the moon at this current moment in time, or you can specify a particular date, as a UNIX epoch time in seconds.

This service returns a `MoonPhase` object. It’s an `enum` that looks like so:

```java
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum MoonPhase {
    NEW_MOON(            "🌑", "new moon"),
    WAXING_CRESCENT(     "🌒", "waxing crescent"),
    FIRST_QUARTER(       "🌓", "first quarter"),
    WAXING_GIBBOUS(      "🌔", "waxing gibbous"),
    FULL(                "🌕", "full"),
    WANING_GIBBOUS(      "🌖", "waning gibbous"),
    LAST_QUARTER(        "🌗", "last quarter"),
    WANING_CRESCENT(     "🌘", "waning crescent"),
    NEW_MOON_APPROACHING("🌑", "new moon approaching");

    // constructur
    // getter/setter for emoji and phase name...
}
```

As I didn’t want to just return the moon phase name, I customized the serialization so that Jackson returns the `enum` values as normal objects. So, for example, the full moon will be returned as:

```json
{
  "phase": "full",
  "emoji": "🌕"
}
```

Now comes the interesting part! How to expose an MCP tool that LLMs can access? The `@Tool` and `@ToolArg` annotations are your friends!

Let’s implement a new class, in which I inject the `MoonPhasesService`:

```java
public class MoonPhasesMcpServer {

    @Inject
    MoonPhasesService moonPhasesService;
    // ...
}
```

Now, let’s create two tool methods: one that gives the current phase of the moon, and the other one that gives the phase at a given date.

```java
@Tool(name = "current-moon-phase",
    description = "Provides the current moon phase")
public TextContent currentMoonPhase() {
    return new TextContent(moonPhasesService.currentMoonPhase().toString());
}
```

The first one gives the current phase, as of the date of today. The name and description of the tool are very important, as they help LLMs figure out what this tool is doing, and understand when it should call this tool. I return a `TextContent` result. But it’s also possible other kinds of content pieces, like audio or image content, or a resource.

Let’s have a look at the other method, the one that gives the moon phase for a given date:

```java
@Tool(name = "moon-phase-at-date", description =
        "Provides the moon phase at a certain date " +
        "(with a format of yyyy-MM-dd)")
public ToolResponse moonPhaseAtDate(
    @ToolArg(name = "localDate", description =
        "The date for which the user wants to know the phase " +
        "of the moon (in yyyy-MM-dd format)")
    String localDate) {
    try {
        LocalDate parsedLocalDate = LocalDate.parse(localDate);
        MoonPhase moonPhase =
            moonPhasesService.moonPhaseAtUnixTimestamp(
                parsedLocalDate.toEpochDay() * 86400);
        return ToolResponse.success(
                new TextContent(moonPhase.toString()));
    } catch (DateTimeException dte) {
        return ToolResponse.error(
                "Not a valid date (yyyy-MM-dd): " + localDate);
    }
}
```

This time, the method also takes an argument. That’s why I annotated the parameter with a `@ToolArg` annotation, again with a name and description (including how the date should be formatted). Since this method can fail at the time of parsing the date string, I decided to return a `ToolResponse` which wraps either a result (the moon phase) or an error in case the parsing fails.

As you can see, it’s fairly easy to implement tools for an MCP server! You almost just need annotations, and that’s it!

This server isn’t secured in any way, to keep things simple in this article. But if you need to dig deeper and learn more about securing an MCP server, I invite you to read this article by Sergey Beryozkin on [getting ready for secure MCP with Qurkus MCP server](https://quarkus.io/blog/secure-mcp-sse-server/).

## Running the server and checking it works

To run this MCP server, you can simply run Quarkus in dev mode with the following command (if you’re using Maven):

```shell
./mvnw quarkus:dev
```

You can quickly check that the endpoint is alive and running by simply going to your browser, and hitting this URL: http://localhost:8080/mcp/sse. You’ll see an Server Sent Event like this one:

```
event: endpoint
data: /mcp/messages/OTRiYzEyNTItNWY1Ni00NWJhLWExZTEtYzE5ZWU1YjdkNWQy
```

But we’re not really testing our two MCP tools.

An approach is to invoke the MCP server with LangChain4j, you can read more in this article about [MCP client and server with the Java MCP SDK and LangChain4j](https://glaforge.dev/posts/2025/04/04/mcp-client-and-server-with-java-mcp-sdk-and-langchain4j/) that I wrote earlier. So I won’t repeat myself today. And you can read more about [LangChain4j’s MCP support](https://docs.langchain4j.dev/tutorials/mcp) in its documentation.

But here, I wanted to highlight a very convenient tool: the [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector). It’s a tool provided by the MCP project itself. It’s a Node-based tool that you can install and run locally on your machine, with the following `npx` command:

```shell
npx @modelcontextprotocol/inspector
```

It provides a UI to interact with an MCP server. Here, my MCP server is already deployed, I connected to it (I selected SSE, gave the URL of my server), requested the list of tools (shown in the middle pane), and invoked the tool that gives the phase of the moon at a given date (panel on the right of the screenshot):

![](/img/adk/mcp-inspector-moon-phases.png)

I really encourage you to use the MCP inspector to test your MCP servers manually. This is a very handy tool in your toolbelt.

## Deploying on Cloud Run

So far so good, _it works on my machine_(™). What about deploying the server in the cloud, since we chose to go with an SSE MCP server? My go-to solution to host my apps quickly and efficiently is to containerize them and deploy them on [Google Cloud Run](https://cloud.google.com/run?utm_campaign=CDR_0x7a40493f_user-journey_b423600838&utm_medium=external&utm_source=blog). Cloud Run is a managed platform to run containers that scale up upon traffic, and down to zero instances when there’s no activity (costing you 0 cent).

[Cloud Run made the highlight at Google I/O](https://cloud.google.com/blog/products/ai-machine-learning/ai-studio-to-cloud-run-and-cloud-run-mcp-server?utm_campaign=CDR_0x7a40493f_user-journey_b423600838&utm_medium=external&utm_source=blog) this year, as it was announced that you can:

- Develop apps within [AI Studio](https://aistudio.google.com/) and deploy them in one click on Cloud Run,
- Deploy a [Gemma 3](https://blog.google/technology/developers/gemma-3/?utm_campaign=CDR_0x7a40493f_user-journey_b423600838&utm_medium=external&utm_source=blog) model on Cloud Run again with one click too from [AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemma-3-27b-it),
- And run [Cloud Run’s own MCP server](https://github.com/GoogleCloudPlatform/cloud-run-mcp) to be able to deploy apps from your MCP powered IDEs and clients.

Since Cloud Run is a container based platform, let’s containerize our application. Quarkus offers a handful of `Dockerfile`s depending on how you want to create your container. For some reason the native build ones didn’t work for me (I got a _“the --chmod option requires BuildKit”_ error message, that I haven’t investigated further) so I went with the `Dockerfile.jvm` file, that I copied into `Dockerfile` at the root of my project, so that Cloud Build could easily pick it up and build it:

```shell
gcloud builds submit \
    --tag gcr.io/YOUR_PROJECT_ID/moonphases
```

Once built, it’s available in Google Cloud [Artifact Registry](https://cloud.google.com/artifact-registry/docs?utm_campaign=CDR_0x7a40493f_user-journey_b423600838&utm_medium=external&utm_source=blog). And I can deploy the containerized moon phases service to Cloud Run with the following command:

```shell
gcloud run deploy moonphases \
    --allow-unauthenticated \
    --image gcr.io/YOUR_PROJECT_ID/moonphases
```

Of course, you’ll have to update the `YOUR_PROJECT_ID` placeholders with the real Google Cloud project ID of your own project. And along the way, you’ll be requested to enable important APIs (artifact registry, cloud run, etc.)

> **NOTE:** If you’re interested, there’s a great page about [hosting MCP servers on Cloud Run](https://cloud.google.com/run/docs/host-mcp-servers?utm_campaign=CDR_0x7a40493f_user-journey_b423600838&utm_medium=external&utm_source=blog), to learn more about the possibilities.

## Bonus: Configuring the MCP server in Agent Development Kit

Of course, you can configure and [invoke this MCP server from LangChain4j](https://glaforge.dev/posts/2025/04/04/mcp-client-and-server-with-java-mcp-sdk-and-langchain4j/), but let’s have a quick look at configuring and invoking it from ADK (Agent Development Kit):

```java
SseServerParameters sseParams = SseServerParameters.builder()
    .url("https://moonphases-2029713823481.europe-west1.run.app/mcp/sse")
    .build();

McpToolset.McpToolsAndToolsetResult toolsAndToolsetResult =
   McpToolset.fromServer(sseParams).get();
List<McpTool> moonPhasesTools = toolsAndToolsetResult.getTools();

LlmAgent scienceTeacherAgent = LlmAgent.builder()
    .name("science-app")
    .description("Science teacher agent")
    .model("gemini-2.0-flash")
    .instruction("""
        You're a friendly science teacher
        answering questions about scientific concepts.

        If the question is about about the phases of the moon,
        you MUST call the `current-moon-phase` function tool
        to know the current phase as of right now,
        or the `moon-phase-at-date` function tool
        to know the phase of the moon on a particular day
        (the date format is then yyyy-MM-dd).
        """)
    .tools(moonPhasesTools)
    .build();
```

I’m not going to detail everything here, but if you want to learn more about ADK for Java, please read my [getting started guide](https://glaforge.dev/posts/2025/05/20/writing-java-ai-agents-with-adk-for-java-getting-started/) that I published recently. What’s needed here is to configure the SSE server parameters, creating an MCP toolset, and then getting the list of tools, to pass to the agent via its `tools()` method.

For the record, here is what the ADK Dev UI shows when asking for the current phase of the moon, and the phase for a later date:

![](/img/adk/mcp-moon-phases.png)

## Summary

In the article, we walked you through building an MCP server with Quarkus and deploying it on Google [Cloud Run](https://cloud.google.com/run?utm_campaign=CDR_0x7a40493f_user-journey_b423600838&utm_medium=external&utm_source=blog).

First, we created a [Quarkus](https://quarkus.io/) project with the necessary dependencies for the [MCP support](https://docs.quarkiverse.io/quarkus-langchain4j/dev/mcp.html). Then, we implemented a service to calculate moon phases and exposed it as MCP tools using `@Tool` and `@ToolArg` annotations provided by Quarkus. We used the [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector) to test the server and we showed how to configure and invoke it from [ADK](https://google.github.io/adk-docs/), the Agent Development Kit. Finally, we containerized the application and deployed it to Google [Cloud Run](https://cloud.google.com/run?utm_campaign=CDR_0x7a40493f_user-journey_b423600838&utm_medium=external&utm_source=blog) for scalability.

If you want to have a closer look at the full source code, you can [check out this repository](https://github.com/glaforge/moon-phases-quarkus-mcp-sse-server) to learn more about creating your own MCP servers!
