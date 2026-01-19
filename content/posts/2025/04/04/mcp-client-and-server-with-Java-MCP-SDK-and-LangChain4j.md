---
title: "MCP Client and Server with the Java MCP SDK and LangChain4j"
date: 2025-04-04T19:39:58+02:00
image: /img/gemini/sell-me-this-pen.png
tags:
  - model-context-protocol
  - langchain4j
  - java
  - gemini
  - large-language-models

similar:
  - "posts/2025/06/09/building-an-mcp-server-with-quarkus-and-deploying-on-google-cloud-run.md"
  - "posts/2025/05/02/vibe-coding-an-mcp-server-with-micronaut-and-gemini.md"
  - "posts/2026/01/18/implementing-an-arxiv-mcp-server-with-quarkus-in-java.md"
---

[MCP](https://modelcontextprotocol.io/introduction) (Model Context Protocol) is making a buzz these days!
MCP is a protocol invented [last November](https://www.anthropic.com/news/model-context-protocol) by Anthropic,
integrated in Claude Desktop and in more and more tools and frameworks,
to **expand LLMs capabilities** by **giving them access to various external tools** and functions.

> My colleague [Philipp Schmid](https://x.com/_philschmid) gave a great
> [introduction to MCP](https://www.philschmid.de/mcp-introduction) recently,
> so if you want to learn more about MCP, this is the place for you.

In this article, I'd like to guide you through the implementation of an MCP server, and an MCP client, in Java.
As I'm contributing to [LangChain4j](https://docs.langchain4j.dev/), I'll be using LangChain4j's `mcp` module for the client.

For the server, it's possible to use [Quarkus](https://quarkus.io/blog/mcp-server/) or
[Spring Boot](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html).
But Christian Tsolov, who built the MCP library used by Spring Boot (which is also the official [Java SDK](https://github.com/modelcontextprotocol/java-sdk) promoted by the Model Context Protocol project), recently [tweeted](https://x.com/christzolov/status/1906341689142243792) that **the MCP reference implementation can also be used standalone** without a mandatory framework:

{{< x user="christzolov" id="1906341689142243792" >}}

## Developing the MCP server

For the server, I need the reference implementation dependency, as well as some Jetty JARs (or the servlet container of your choice)
to expose an HTTP Server-Sent Event endpoint (you can also create `stdio` servers too):

```xml
<dependency>
	<groupId>io.modelcontextprotocol.sdk</groupId>
	<artifactId>mcp</artifactId>
	<version>0.8.1</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty</groupId>
	<artifactId>jetty-server</artifactId>
	<version>12.0.18</version>
</dependency>
<dependency>
	<groupId>org.eclipse.jetty.ee10</groupId>
	<artifactId>jetty-ee10-servlet</artifactId>
	<version>12.0.18</version>
</dependency>
```

I'm using Jetty here, as I want to expose the HTTP SSE endpoint as a servlet.

The first thing needed is to create an HTTP servlet SSE transport provider.
I'll expose the `/sse` endpoint that the client will be able to access:

```java
HttpServletSseServerTransportProvider transportProvider =
    new HttpServletSseServerTransportProvider(
        new ObjectMapper(), "/", "/sse");
```

The MCP reference implementation allows you to implement async or sync servers.
I'm going with a synchronous one, as it's easier to implement:

```java
McpSyncServer syncServer = McpServer.sync(transportProvider)
    .serverInfo("custom-server", "0.0.1")
    .capabilities(McpSchema.ServerCapabilities.builder()
        .tools(true)
        .resources(false, false)
        .prompts(false)
        .build())
    .build();
```

MCP servers can expose:

- tools
- resources
- prompts

In my case, I'm just interested in exposing a tool.
I'll go with a classical weather tool, which is a bit like the _Hello World_ of LLM function calling!

Let's define our `weather-forecast` tool:

```java
McpServerFeatures.SyncToolSpecification syncToolSpecification =
    new McpServerFeatures.SyncToolSpecification(
        new McpSchema.Tool("weather-forecast",
            "gives today's weather forecast for a given location",
            """
            {
              "type": "object",
              "properties": {
                "location": {
                  "type": "string"
                }
              },
              "required": ["location"]
            }
            """
        ),
        (mcpSyncServerExchange, stringObjectMap) -> {
            return new McpSchema.CallToolResult(
                List.of(new McpSchema.TextContent("""
                    {
                        "location": "Paris",
                        "forecast": "Nice and sunny weather, with clear blue sky, and temperature of 17°C."
                    }
                    """
                )), false);
        }
    );

syncServer.addTool(syncToolSpecification);
```

I defined the tool, with a description (which helps LLMs know which tools to invoke for which use case).
The schema of the input is described as a JSON string (as I struggled a bit to find the correct way to create the schema programmatically).

Then I defined the lambda function that is called when the tool is invoked.
I'm returning a JSON object that contains the `location` and the `forecast`.

And I'm done with the MCP server implementation!

But now, I need to expose this server thanks to the Jetty Servlet container.

Let's define a new Jetty server, connector, servlet context handler, export the servlet, and start the server:

```java
QueuedThreadPool threadPool = new QueuedThreadPool();
threadPool.setName("server");

Server server = new Server(threadPool);

ServerConnector connector = new ServerConnector(server);
connector.setPort(45450);
server.addConnector(connector);

ServletContextHandler context = new ServletContextHandler();
context.setContextPath("/");
context.addServlet(new ServletHolder(transportProvider), "/*");

server.setHandler(context);
server.start();
```

Now if you run this code, your MCP server function will be waiting for its first invocations.

## Developing the MCP client with LangChain4j

For the MCP client, I use the [LangChain4j MCP module](https://docs.langchain4j.dev/tutorials/mcp/):

```xml
<dependency>
	<groupId>dev.langchain4j</groupId>
	<artifactId>langchain4j-mcp</artifactId>
	<version>${langchain4j.version}</version>
</dependency>
```

Since I'm using Gemini, I need some dependencies for the Vertex AI Gemini model:

```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j</artifactId>
    <version>${langchain4j.version}</version>
</dependency>
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-vertex-ai-gemini</artifactId>
    <version>${langchain4j.version}</version>
</dependency>
```

Let's get started with instantiating our Gemini 2.0 Flash lite model:

```java
try (
    VertexAiGeminiChatModel model = VertexAiGeminiChatModel.builder()
        .project("genai-playground24")
        .location("us-central1")
        .modelName("gemini-2.0-flash-lite")
        .build();
```

I'm defining an `McpTransport` pointing at my local Jetty SSE server:

```java
McpTransport transport = new HttpMcpTransport.Builder()
    .sseUrl("http://0.0.0.0:45450/sse")
    .build()) {
```

Let's create an MCP client using that transport:

```java
McpClient mcpClient = new DefaultMcpClient.Builder()
    .transport(transport)
    .build();
```

And a tool provider that will expose just the `weather-forecast` tool:

```java
ToolProvider toolProvider = McpToolProvider.builder()
    .mcpClients(List.of(mcpClient))
    .build();
```

You can list the available tools as follows:

```java
mcpClient.listTools().forEach(System.out::println);
```

As I'm going to create a LangChain4j AI service, I need a contract.
This will be the following simple interface:

```java
interface WeatherAssistant {
    String request(String message);
}
```

Now, it's time to instantiate that service:

```java
WeatherAssistant meteo = AiServices.builder(WeatherAssistant.class)
    .chatLanguageModel(model)
    .toolProvider(toolProvider)
    .build();
```

And we can now chat with that service, asking mundane questions, as well as weather related questions that will be invoking the `weather-forecast` tool:

```java
List.of(
    "Hello!",
    "What's the weather like in Paris today?"
).forEach((String q) -> {
    System.out.println(blue(q));
    System.out.println(green(meteo.request(q)));
});
}
```

It will print something like:

```
Hello!
The weather in Paris is sunny today, with a clear blue sky,
and a temperature of 17°C.
```

## Conclusion

In this article, we've seen:

- how to **create an MCP server**, using the official **Java MCP SDK**,
- and how to **create an MCP client** with **LangChain4j**.

We've seen how to define a tool, and how to expose it via an HTTP SSE endpoint.
We've also seen how to use the MCP client to invoke that tool, and how to integrate it in a LangChain4j AI service.

This is a great way to expand the capabilities of LLMs, by giving them access to external tools and functions.
And it shows that you can interact with any MCP server with LangChain4j.
