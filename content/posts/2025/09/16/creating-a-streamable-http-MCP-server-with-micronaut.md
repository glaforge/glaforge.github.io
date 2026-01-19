---
title: "Creating a Streamable HTTP MCP server with Micronaut"
date: 2025-09-16T10:00:31+02:00
image: /img/mcp/mcp-micronaut-moon.png
tags:
  - java
  - micronaut
  - model-context-protocol
  - ai-agents

similar:
  - "posts/2025/05/02/vibe-coding-an-mcp-server-with-micronaut-and-gemini.md"
  - "posts/2025/06/09/building-an-mcp-server-with-quarkus-and-deploying-on-google-cloud-run.md"
  - "posts/2026/01/18/implementing-an-arxiv-mcp-server-with-quarkus-in-java.md"
---

In previous articles, I explored how to
[create an MCP server with Micronaut]({{< ref "/posts/2025/05/02/vibe-coding-an-mcp-server-with-micronaut-and-gemini/" >}})
by _vibe-coding_ one, following the
[Model Context Protocol specification](https://modelcontextprotocol.io/docs/getting-started/intro)
(which was a great way to better understand the underpinnings) and how to
[create an MCP server with Quarkus]({{< ref "/posts/2025/06/09/building-an-mcp-server-with-quarkus-and-deploying-on-google-cloud-run/" >}}).

Micronaut lacked a dedicated module for creating MCP servers, but fortunately, recently Micronaut added official support for MCP,
so I was eager to try it out!

> **Note:** For the impatient, you can [checkout the code](https://github.com/glaforge/mn-mcp-server) we'll be covering in this article on GitHub.

## What to build?

Like in my previous article with Quarkus, I decided to build another version of my :moon: moon phases MCP server.
This is interesting to be able to contrast Quarkus and Micronaut's approaches.

I reused my code for calculating the moon phases.
My `MoonPhasesService` is fairly simple (as long as you don't look at the exact math calculation)
and consists in two methods:

- `currentMoonPhase()` — to know the phase at this point in time,
- `moonPhaseAtUnixTimestamp(long timeSeconds)` — to know the phase at a specific point in time.

The contract is as follows, nothing specific to MCP for now:

```java
@Singleton
public class MoonPhasesService {
    // ...
    public MoonPhase currentMoonPhase() { /*...*/ }
    public MoonPhase moonPhaseAtUnixTimestamp(long timeSeconds) { /*...*/ }
}
```

Compared to my Quarkus version, the service returns `MoonPhase` `record`s instead of `enum` values,
as it seems Micronaut is unhappy with returning my `enum`.
So I changed `MoonPhase` to look like this:

```Java
@JsonSchema
@Introspected
public record MoonPhase(
    @NotBlank String phase,
    @NotBlank String emoji
) { }
```

What's interesting here is the `@JsonSchema` annotation which comes from the Micronaut JSON Schema module,
which provides very rich support for all the subtleties of the JSON Schema specification.
The `@Instrospected` annotation is here to help with annotation processing and Ahead-of-Time compilation.

Let's look at the `MoonPhasesMcpServer` now:

```java
@Singleton
public class MoonPhasesMcpServer {
    @Inject
    private MoonPhasesService moonPhasesService;

    @Tool(name = "current-moon-phase",
        description = "Provides the current moon phase")
    public MoonPhase currentMoonPhase() {
        return moonPhasesService.currentMoonPhase();
    }

    @Tool(name = "moon-phase-at-date",
        description = "Provides the moon phase at a certain date (with a format of yyyy-MM-dd)")
    public MoonPhase moonPhaseAtDate(
        @ToolArg(name = "localDate")
        @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}")
        String localDate
    ) {
        LocalDate parsedLocalDate = LocalDate.parse(localDate);
        return moonPhasesService.moonPhaseAtUnixTimestamp(parsedLocalDate.toEpochDay() * 86400);
    }
}
```

You'll find the same couple annotations as in Quarkus: `@Tool` and `@ToolArg`.
In Micronaut, `@ToolArg` is missing a `description` field, but it should be added soon.

What's more powerful here in Micronaut is the use of Micronaut Validation annotations:
notice the `@NotBlank` and even better, the `@Pattern` annotation!

With Micronaut, I don't have to handle the mal-formed inputs, as they are caught by validation much earlier.
If the input is incorrect, Micronaut will handle the situation on its own, and your method won't even be called.
So no need to handle the bad values.

## Testing the MCP server with the MCP Inspector

When using MCP Inspector to test my server manually, if I pass a blank value to the `moon-phase-at-date` method,
I'll see validation kicking in:

![](/img/mcp/mn-mcp-input-error.png)

```
MCP error -32603: moonPhaseAtDate.localDate: must not be blank,
moonPhaseAtDate.localDate: must match "\d{4}-\d{2}-\d{2}"
```

Extra bonus point: Micronaut MCP will create (at compile time) the JSON schemas for the various `@JsonSchema` annotated beans,
adding more fine-grained information about the manipulated input / output structures.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "http://localhost:8080/schemas/moonPhase.schema.json",
  "title": "Phase of the moon",
  "description": "The phase of the moon is composed of the name of the phase and an emoji representing it",
  "type": "object",
  "properties": {
    "emoji": {
      "type": "string",
      "minLength": 1
    },
    "phase": {
      "type": "string",
      "minLength": 1
    }
  }
}
```

For those schemas to be served as static assets, `application.properties` must configure the static resources:

```
# specify the HTTP Streamable transport
micronaut.mcp.server.transport=HTTP
micronaut.mcp.server.info.name=moon-phases
micronaut.mcp.server.info.version=1.0.0

# Specify how & where the schemas should be exposed
micronaut.router.static-resources.jsonschema.paths=classpath:META-INF/schemas
micronaut.router.static-resources.jsonschema.mapping=/schemas/**

# Potentially define a specific base URL, otherwise it's infered
# micronaut.jsonschema.validation.baseUri=https://example.com/schemas
```

## Quick look at the dependencies

You can checkout the [code](https://github.com/glaforge/mn-mcp-server)
and read the [README](https://github.com/glaforge/mn-mcp-server/blob/main/README.md),
but I'd like to mention how I scaffolded the project in the first place,
and which dependencies (and tweaks) were needed.

### Creating the Micronaut application

This project was bootstrapped with the `mn` Micronaut command-line tool,
which can be [installed via SDKman](https://sdkman.io/sdks/micronaut/).

```bash
mn create-app --build=gradle --jdk=21 --lang=java --test=junit \
  --features=jackson-databind,json-schema,validation,json-schema-validation mn.mcp.server.mn-mcp-server
```

As the MCP support is based on the official MCP SDK, which is currently tied to Jackson, you must use the Jackson data binding
(not Micronaut's built-in serialization). You need to add `json-schema`, `validation`, and `json-schema-validation` features.

But you'll have to make some tweaks to the dependencies.

### Custom dependency tweaks

The following dependencies were added to `build.gradle`, or updated, to support the MCP server and enhance JSON Schema generation:

```groovy
dependencies {
    // Existing dependencies
    // ...

    // The Micronaut MCP support
    implementation("io.micronaut.mcp:micronaut-mcp-server-java-sdk:0.0.3")

    // For rich JSON schema handling
    annotationProcessor("io.micronaut.jsonschema:micronaut-json-schema-processor:1.7.0")
    implementation("io.micronaut.jsonschema:micronaut-json-schema-annotations:1.7.0")
}
```

First of all, the MCP module is not yet part of the _features_ you can select from the `mn` command,
or from the [Micronaut launch site](https://micronaut.io/launch/),
but once the MCP support stabilizes, it'll be available.

I had to update the dependency version of the JSON Schema support (instead of using the default version from the BOM),
but this new version will be available soon in the Micronaut BOM.

So maybe when you read this, you'll just add the `mcp` feature to the list of features, and have everything configured properly.
But those tweaks are just because I'm living on the bleeding edge right now!

## Invoking the server via Gemini CLI

For the fun, I decided to add this MCP server to my [Gemini CLI](https://google-gemini.github.io/gemini-cli/) installation.

Before launching the CLI, I installed the MCP server as follows:

```bash
gemini mcp add moonPhases --transport http http://localhost:8080/mcp
```

Then when I launch `gemini` and list the MCP servers, I can see the moon phase server:

![](/img/mcp/moon-phase-gemini-cli-1.png)

I ask what was the phase of the moon when mankind first landed on the moon
(and Gemini figures out the correct date format, although I gave it in plain English).
Gemini CLI asks for my acknowledgement to execute the MCP server tool:

![](/img/mcp/moon-phase-gemini-cli-2.png)

Finally, Gemini CLI responds with a proper English response:

![](/img/mcp/moon-phase-gemini-cli-3.png)

## Going further

I hope you enjoyed the ride so far, but what are the next steps?

- Check out the [source code](https://github.com/glaforge/mn-mcp-server) of this simple HTTP Streamable MCP server.
- Read about the [MCP support in Micronaut](https://micronaut-projects.github.io/micronaut-mcp/latest/guide/#introduction).
- Have a look at Sergio Delamo's [sample MCP project](https://github.com/sdelamo/micronaut-mcp-tools-weather).

Java developers have some great options nowadays for developing their MCP servers, including Quarkus and Micronaut.
Be sure to evaluate those options for your next projects!
For enterprise deployments, nothing beats Java! :wink:
And Micronaut offers a pretty elegant handling of structured inputs and outputs thanks to its rich JSON Schema support.
