---
title: "Vibe coding an MCP server with Micronaut, LangChain4j, and Gemini"
date: 2025-05-02T19:35:05+02:00
image: /img/gemini/gemini-vibe-coding.png
tags:
  - java
  - micronaut
  - langchain4j
  - large-language-models
  - model-context-protocol
---

Unlike Quarkus and Spring Boot, Micronaut doesn't (yet?) provide a module to facilitate the implementation of [MCP](https://modelcontextprotocol.io/) servers (Model Context Protocol).
But being my favorite framework, I decided to see what it takes to build a quick implementation, by _vibe coding_ it, with the help of Gemini!

In a recent article, I explored [how to use the MCP reference implementation for Java to implement an MCP server](https://glaforge.dev/posts/2025/05/02/vibe-coding-an-mcp-server-with-micronaut-and-gemini/),
served as a servlet via Jetty, and to call that server from [LangChain4j's great MCP support](https://docs.langchain4j.dev/tutorials/mcp/).
One approach with Micronaut may have been to somehow integrate the servlet I had built via Micronaut's servlet support, but that didn't really feel like a genuine and native way to implement a server, so I decided to do it from scratch.

## Vibe coding with Gemini

The concept of _vibe coding_ came from a [tweet from Andrej Karpathy](https://x.com/karpathy/status/1886192184808149383)
who defined the concept as interacting with an LLM to build a new prototype or weekend project, and iterating with the LLM till it works, but without looking at or touching the code yourself.
It's quite a bit different than using AI assistance to build a production-ready code base.
And Simon Willison's just written a good piece on [what is and what is not _vibe coding_](https://simonwillison.net/2025/May/1/not-vibe-coding/).

I started throwing **Gemini 2.5 Pro** some simple prompts for creating an MCP server with Micronaut, with Java 21, but it would not generate something really usable, at least not in one-shot!
For example, it would not use Server-Sent Events, or it hadn't figured out how that the protocol is using JSON-RPC, etc.
So instead of steering the LLM in the right direction via multiple prompts, I reused my tacticts of feeding as much information as needed into the prompt.
This is the approach I took to [grok one's own content with LLMs.txt]({{<ref "posts/2025/03/03/llms-txt-to-help-llms-grok-your-content/">}}), or when I wrote about
[the power of large context windows for your documentation efforts]({{<ref "posts/2025/02/15/the-power-of-large-context-windows-for-your-documentation-efforts/">}}).

So what was the successful prompt?

> Let's implement a Model Context Protocol (MCP) using the Micronaut framework.
>
> We will use Micronaut 4.8 and Java 21.
> You can find Micronaut's documentation here: https://docs.micronaut.io/4.8.11/guide/
>
> The details of the Model Context Protocol (MCP) can be found here:
> https://modelcontextprotocol.io/llms-full.txt
>
> For the client, we will use LangChain4j as shown in this article:
> https://glaforge.dev/posts/2025/04/04/mcp-client-and-server-with-java-mcp-sdk-and-langchain4j/
>
> You can find all the code of the LangChain4j MCP client support in the attached file.
>
> :paperclip: _\[gitingest of the LangChain4j MCP client code\]_
>
> You can reuse the Java classes of the LangChain4j MCP client to implement the MCP server support with Micronaut.
>
> Implement a simple MCP server to let MCP clients request the weather forecast. Return fake data like `{"forecast": "sunny"}`

The trick here was to feed the whole MCP specification thanks to the `llms-full.txt` file,
the whole Micronaut single-page documentation, and also the LangChain4j MCP client source code in attachment (via [gitingest](https://gitingest.com/)).

Did it work in one shot? Actually, no.
Because my client wouldn't connect to it somehow, I figured that it wasn't actually using Server-Sent Events.
So I sent a follow-up prompt:

> The Micronaut controller must use HTTP Server Sent Events, as this is what the MCP protocol mandates for MCP remote servers. Please update the controller to use SSE.

Then I had a running server.

Gemini created an [`SseBroadcaster`](https://github.com/glaforge/langchain4j-micronaut-mcp/blob/main/src/main/java/mcp/server/SseBroadcaster.java) class which handles the Server-Sent Event handling,
thanks to Reactor's `Publisher`, `Flux`, and `Sinks`, and Micronaut's `JsonMapper` and SSE support.

It handles the various JSON-RPC operations (`initialize`, `notifications/initialized`, `tools/list`, `tools/call`, and `ping`)
in the [`PostController`](https://github.com/glaforge/langchain4j-micronaut-mcp/blob/main/src/main/java/mcp/server/PostController.java):

```java
private McpResponse processRequest(McpRequest request) {
    // --- Same logic as before to generate the McpResponse object ---
    switch (request.method()) {
        case "initialize":
            log.info("Handling initialize request");
            InitializeResult initResult = new InitializeResult(new ServerCapabilities());
            return new McpResponse(request.id(), initResult);

        case "notifications/initialized":
            log.info("Received initialized notification");
            // This is a notification FROM the client. MCP spec says notifications
            // don't have responses. So we return null here, and the POST handler
            // will just return HTTP OK.
            return null;

        case "tools/list":
            log.info("Handling tools/list request");
            ToolSpecificationData weatherTool = new ToolSpecificationData(
                WEATHER_TOOL_NAME,
                "Gets the current weather forecast.",
                new InputSchema(
                    "object",
                    Map.of("location", Map.of(
                        "type", "string",
                        "description", "Location to get the weather for")
                    ),
                    List.of("location"),
                    false)
            );
            ListToolsResult listResult = new ListToolsResult(List.of(weatherTool));
            return new McpResponse(request.id(), listResult);

        case "tools/call":
            log.info("Handling tools/call request");
            if (request.params() != null && request.params().has("name")) {
                String toolName = request.params().get("name").asText();
                if (WEATHER_TOOL_NAME.equals(toolName)) {
                    log.info("Executing tool: {}", toolName);
                    TextContentData textContent = new TextContentData(FAKE_WEATHER_JSON);
                    CallToolResult callResult = new CallToolResult(List.of(textContent));
                    return new McpResponse(request.id(), callResult);
                } else {
                    log.warn("Unknown tool requested: {}", toolName);
                    return new McpResponse(request.id(), new McpError(-32601, "Method not found: " + toolName));
                }
            } else {
                log.error("Invalid tools/call request: Missing 'name' in params");
                return new McpResponse(request.id(), new McpError(-32602, "Invalid params for tools/call"));
            }

        case "ping":
            log.info("Handling ping request");
            return new McpResponse(request.id(), Collections.emptyMap());

        default:
            log.warn("Unsupported MCP method: {}", request.method());
            return new McpResponse(request.id(), new McpError(-32601, "Method not found: " + request.method()));
    }
}
```

## From vibe coding, to a more classical AI-assisted approach

The vibe coding part ended somewhere here, as I then went on to make a few tweaks here and there to the code base.
When you're a developer, you can't resist tweaking a few things here and there, right?

But I continued the journey also with the help of Gemini, but via [Gemini Code Assist](https://codeassist.google/) within IntelliJ IDEA.

I reused my MCP client from my recent [MCP article]({{<ref "posts/2025/04/04/mcp-client-and-server-with-java-mcp-sdk-and-langchain4j/">}}),
but I asked Gemini Code Assist to transform the Java class into a proper JUnit test.
Since the Micronaut documentation is still part of the context of the conversation, thanks to Gemini's huge context window, it did again a great job at converting my code into a proper Micronaut running unit test, launching an embedded server.

I like that Gemini created three test methods: to test that the server can reply to some simple greeting message, then can list and the available MCP tools at the disposal of the clients:

```java
@Test
void testListTools() {
    log.info("Testing listTools...");
    assertDoesNotThrow(() -> {
        List<dev.langchain4j.agent.tool.ToolSpecification> tools = mcpClient.listTools();
        assertNotNull(tools, "Tool list should not be null");
        assertFalse(tools.isEmpty(), "Tool list should not be empty");
        // Add more specific assertions if needed, e.g., check tool names
        assertTrue(tools.stream().anyMatch(t -> "getWeatherForecast".equals(t.name())),
            "Should find the 'getWeatherForecast' tool");
        log.info("listTools returned: {}", tools);
    }, "Listing tools should not throw an exception");
}
```

And finally is able to reply to a weather request by returning some dummy weather data:

```java
@Test
void testWeatherRequest() {
    log.info("Testing weather request...");
    String question = "What's the weather like in Paris today?";
    String response = assertDoesNotThrow(() -> weatherAssistant.request(question),
        "Weather request should not throw an exception");

    log.info("Question: {}", question);
    log.info("Response: {}", response);

    assertNotNull(response, "Response should not be null");
    assertFalse(response.isBlank(), "Response should not be blank");
    // Check if the response likely contains the mocked forecast
    assertTrue(response.toLowerCase().contains("sunny"),
        "Response should contain the weather information (sunny)");
}
```

## Now, the code!

As you made it till the end, you'll get a reward: I pushed the code in this [Github repository](https://github.com/glaforge/langchain4j-micronaut-mcp)!
The project doesn't implement all the bells and whistles of the MCP specification (like prompts, resources, sampling, etc.)
but it's certainly a starting point if you want to write your own MCP server with Micronaut.
Since LangChain4j released some [new versions today](https://github.com/langchain4j/langchain4j/releases/tag/1.0.0-rc1), I updated the dependencies to use the latest and greatest LangChain4j.

Going further, I'd love to see Micronaut offer a dedicated MCP server module, to make it easier to implement MCP servers, with some clever annotations, to streamline the whole process.
Fingers crossed :crossed_fingers:

And of course, once you're happy with your MCP server implementation, the extra step is to deploy the MCP server to Google's [Cloud Run](http://cloud.run/), like I explained in this article about the
[various ways to deploy Micronaut apps to Cloud Run]({{<ref "posts/2022/10/24/build-deploy-java-17-apps-on-cloud-run-with-cloud-native-buildpacks-on-temurin/">}}).
