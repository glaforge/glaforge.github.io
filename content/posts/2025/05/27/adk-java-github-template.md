---
title: "An ADK Java GitHub template for your first Java AI agent"
date: 2025-05-27T13:01:52+02:00
tags:
  - java
  - agent-development-kit
  - large-language-models
  - ai-agents
image: /img/adk/adk-java-template-project.png
---

With the unveiling of the [Java version](https://github.com/google/adk-java/) of [Agent Development Kit](https://google.github.io/adk-docs/)
(ADK) which lets you **build AI agents in Java**, I recently covered how to
[get started developing your first agent]({{< ref "/posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories" >}}).

The installation and quickstart [documentation](https://google.github.io/adk-docs/get-started/) also helps for the first steps,
but I realized that it would be handy to provide a **template project**, to further accelarate your _time-to-first-conversation_ with your Java agents!
This led me to play with GitHub's _template project_ feature, which allows you to create a copy of the template project on your own account or organization.
It comes with a ready-made project structure, a configured `pom.xml` file, and a first Java agent you can customize at will, and run from both the command-line or the ADK Dev UI.

> :arrow_right: **Clone the [`adk-java-maven-template`](adk-java-maven-template) project!** :arrow_left:

The project follows a standard Java project structure:

```
project_folder/
├── pom.xml
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── agent/
                        └── HelloWeatherAgent.java
```

The `pom.xml` build file declares the two ADK dependencies:

```xml
<!-- The ADK core dependency -->
<dependency>
    <groupId>com.google.adk</groupId>
    <artifactId>google-adk</artifactId>
    <version>0.1.0</version>
</dependency>
<!-- The ADK dev web UI to debug your agent -->
<dependency>
    <groupId>com.google.adk</groupId>
    <artifactId>google-adk-dev</artifactId>
    <version>0.1.0</version>
</dependency>
```

And the `HelloWeatherAgent.java` class shows how to create a simple agent:

```java
//...
LlmAgent.builder()
    .name("hello-weather-agent")
    .description("Hello World")
    .instruction("""
        You are a friendly assistant,
        answering questions in a concise manner.

        When asked about weather information,
        you MUST use the `getWeather` function.
        """)
    .model("gemini-2.0-flash")
    .tools(FunctionTool.create(HelloWeatherAgent.class, "getWeather"))
    .build();
//...
```

An agent that makes use of a tool to request weather forecasts:

```java
//...
@Schema(description = "Get the weather forecast for a given city")
public static Map<String, String> getWeather(
        @Schema(name = "city",
        description = "Name of the city to get the weather forecast for")
        String city) {
    return Map.of(
        "city", city,
        "forecast", "Sunny day, clear blue sky, temperature up to 24°C"
    );
}
//...
```

There are two ways to run the agent, via the command-line:

```shell
mvn compile exec:java \
    -Dexec.mainClass="com.example.agent.HelloWeatherAgent"
```

Or the ADK Dev UI:

```shell
mvn compile exec:java \
    -Dexec.mainClass="com.google.adk.web.AdkWebServer" \
    -Dexec.classpathScope="compile"
```

Which will show the nice and handy development UI, to help you prototype and debug your agent:

![](https://github.com/glaforge/adk-java-maven-template/raw/main/adk-dev-ui.png)

:smiley: **Happy Java AI agent building!** :hammer_and_wrench:
