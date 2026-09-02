---
title: "Comparing the official Google GenAI Java SDK and my Gemini Interactions SDK"
description: "Comparing the  official Google GenAI Java SDK's support of Gemini Interactions with my unofficial Java SDK."
date: 2026-09-02T10:30:00+02:00
tags:
- generative-ai
- gemini-interactions-api
- ai-agents
- java
- google-cloud
image: /img/gemini/interactions/gemini-interactions-comparison.jpg

similar:
  - "posts/2026/06/24/gemini-interactions-api-now-ga-exploring-the-release-candidate-of-my-java-sdk.md"
  - "posts/2026/05/21/managed-agents-with-the-gemini-interactions-java-sdk.md"
  - "posts/2025/12/15/implementing-the-interactions-api-with-antigravity.md"
---

The official [Google GenAI Java SDK](https://github.com/googleapis/java-genai) recently released [version 1.67.0](https://github.com/googleapis/java-genai/releases/tag/v1.67.0), adding support for the Gemini Interactions API.

When Google initially introduced the Interactions API, there was no Java support in the official SDK. Because I wanted Java developers to be able to build with interactions, [managed agents](https://aistudio.google.com/managed-agents), and remote sandboxes right away, I created an unofficial, purpose-built library: the [Gemini Interactions API Java SDK](https://github.com/glaforge/gemini-interactions-api-sdk).

Now that official support is available under `com.google.genai`, developers have two ways to interact with this API from Java. In this post, I want to take a technical look at how both SDKs approach the same API, compare their ergonomics, and discuss when you might choose one over the other.

## How the two SDKs are built

The primary difference between the two libraries comes down to how they were designed and generated.

The official SDK (`com.google.genai`) uses automated code generation via [Speakeasy](https://www.speakeasy.com/docs/sdks/create-client-sdks/) from OpenAPI definitions. 
Its new interactions surface lives primarily in the internal `com.google.genai.gaos` package (standing for _Google Agent Operating System_?), wired into the top-level `Client` through `client.interactions`. 
To maintain compatibility across older enterprise deployments, it targets a **Java 8** baseline.

My SDK (`gemini-interactions-api-sdk`) was written by [Antigravity](https://antigravity.google) under my direction and review (as I detailed in [a previous article]({{< ref "/posts/2025/12/15/implementing-the-interactions-api-with-antigravity.md" >}})), specifically tailored for the Interactions API. It targets **Java 17** and above, relying on immutable records, sealed interfaces, and pattern matching.

This difference in design philosophy shapes the developer experience across common tasks.

## Initializing the client

Both SDKs support authentication through [Google AI Studio API keys](https://aistudio.google.com/apikey) as well as Vertex AI credentials 
(or should I say [Google Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform) nowadays).

In the official SDK, you configure the unified `Client`:

```java
// Google AI Studio
Client client = Client.builder()
    .apiKey(System.getenv("GEMINI_API_KEY"))
    .build();

// Vertex AI
Client vertexClient = Client.builder()
    .project("my-gcp-project")
    .location("us-central1")
    .credentials(GoogleCredentials.getApplicationDefault())
    .vertexAI(true)
    .build();
```

In my SDK, you use `GeminiInteractionsClient`:

```java
// Google AI Studio
GeminiInteractionsClient client = GeminiInteractionsClient.builder()
    .apiKey(System.getenv("GEMINI_API_KEY"))
    .build();

// Vertex AI (discovers Application Default Credentials automatically)
GeminiInteractionsClient vertexClient = GeminiInteractionsClient.builder()
    .project("my-gcp-project")
    .location("global")
    .build();
```

Both clients handle credentials and base URLs transparently.

## A basic text interaction

Here is what a standard text generation request looks like in both libraries.

### Official SDK

Because the official library models OpenAPI union types (`oneOf`) through wrapper objects, you wrap the input text in `InteractionsInput.of(...)`, wrap the interaction body in `CreateInteractionRequestBody.of(...)`, and unwrap `Optional` return values:

```java
import com.google.genai.Client;
import com.google.genai.gaos.models.interactions.CreateModelInteraction;
import com.google.genai.gaos.models.interactions.InteractionsInput;
import com.google.genai.gaos.models.operations.CreateInteractionRequestBody;
import com.google.genai.gaos.models.operations.CreateInteractionResponse;
import com.google.genai.gaos.models.interactions.Interaction;

Client client = Client.builder()
    .apiKey(System.getenv("GEMINI_API_KEY"))
    .build();

CreateModelInteraction body = CreateModelInteraction.builder()
    .model("gemini-3.7-flash")
    .input(InteractionsInput.of("Why is the sky blue?"))
    .build();

CreateInteractionResponse response = client.interactions.create(
    CreateInteractionRequestBody.of(body)
);

Interaction interaction = response.interaction().orElseThrow();
System.out.println(interaction.outputText().orElse(""));
```

### Gemini Interactions SDK

My SDK uses fluent parameter builders and returns direct values:

```java
import io.github.glaforge.gemini.interactions.GeminiInteractionsClient;
import io.github.glaforge.gemini.interactions.model.InteractionParams.ModelInteractionParams;
import io.github.glaforge.gemini.interactions.model.Interaction;

GeminiInteractionsClient client = GeminiInteractionsClient.builder()
    .apiKey(System.getenv("GEMINI_API_KEY"))
    .build();

ModelInteractionParams request = ModelInteractionParams.builder()
    .model("gemini-3.7-flash")
    .input("Why is the sky blue?")
    .build();

Interaction response = client.create(request);
System.out.println(response.outputText());
```

## Streaming responses

The Interactions API emits Server-Sent Events (SSE) when `stream=true`.

### Official SDK

The official SDK exposes an `EventStream<InteractionSSEStreamEvent>`. Processing each chunk requires navigating several layers of `Optional`:

```java
CreateModelInteraction body = CreateModelInteraction.builder()
    .model("gemini-3.7-flash")
    .input(InteractionsInput.of("Tell me a story"))
    .stream(true)
    .build();

CreateInteractionResponse response = client.interactions.create(
    CreateInteractionRequestBody.of(body)
);

for (InteractionSSEStreamEvent event : response.events()) {
    event.data().ifPresent(sseEvent -> {
        if (sseEvent instanceof StepDelta stepDelta) {
            stepDelta.delta().ifPresent(data -> {
                if (data instanceof TextDelta textDelta) {
                    System.out.print(textDelta.text().orElse(""));
                }
            });
        }
    });
}
```

### Gemini Interactions SDK

My SDK returns a standard Java `Stream<SSEEvent>`, allowing pattern matching on the sealed event types:

```java
ModelInteractionParams request = ModelInteractionParams.builder()
    .model("gemini-3.7-flash")
    .input("Tell me a story")
    .stream(true)
    .build();

client.stream(request).forEach(event -> {
    if (event instanceof StepDelta delta && delta.delta() instanceof TextDelta text) {
        System.out.print(text.text());
    }
});
```

## Function calling and steps

Interactions are structured around sequences of steps, such as `UserInputStep`, `ModelOutputStep`, and `FunctionCallStep`.

In the official SDK, getters across polymorphic steps return `Optional`, requiring null guards or `.get()` calls when retrieving items like step lists and arguments:

```java
Step lastStep = interaction.steps().get().get(interaction.steps().get().size() - 1);
if (lastStep instanceof FunctionCallStep callStep) {
    String location = (String) ((Map<?, ?>) callStep.arguments().get()).get("location");

    FunctionResultStep resultStep = FunctionResultStep.builder()
        .id("call-result-1")
        .name(callStep.name().get())
        .result(FunctionResultStepResult.of(Map.of("weather", "Sunny, 22C")))
        .build();

    CreateModelInteraction continuation = CreateModelInteraction.builder()
        .model("gemini-3.7-flash")
        .previousInteractionId(interaction.id().get())
        .input(InteractionsInput.ofStep(List.of(resultStep)))
        .build();

    client.interactions.create(CreateInteractionRequestBody.of(continuation));
}
```

In my SDK, steps are Java records. You can access the steps list directly, and pattern match or use switch statements over sealed types:

```java
if (interaction.steps().getLast() instanceof FunctionCallStep callStep) {
    String location = (String) callStep.arguments().get("location");

    ModelInteractionParams continuation = ModelInteractionParams.builder()
        .model("gemini-3.7-flash")
        .previousInteractionId(interaction.id())
        .input(new FunctionResultStep("result-1", callStep.name(), false, Map.of("weather", "Sunny, 22C")))
        .build();

    Interaction finalResponse = client.create(continuation);
    System.out.println(finalResponse.outputText());
}
```

## Structured JSON output

When asking Gemini to return JSON adhering to a specific schema, the approaches diverge.

The official SDK accepts a schema as a raw `Map<String, Object>` wrapped inside `ResponseFormat`:

```java
Map<String, Object> schema = Map.of(
    "type", "object",
    "properties", Map.of("recipeName", Map.of("type", "string")),
    "required", List.of("recipeName")
);

CreateModelInteraction body = CreateModelInteraction.builder()
    .model("gemini-3.7-flash")
    .input(InteractionsInput.of("Give me a cookie recipe"))
    .responseMimeType("application/json")
    .responseFormat(CreateModelInteractionResponseFormat.of(ResponseFormat.of(schema)))
    .build();

client.interactions.create(CreateInteractionRequestBody.of(body));
```

My SDK supports raw maps as well, but also offers a type-safe schema DSL and reflection-based schema generation directly from Java records:

```java
public record Recipe(String recipeName, List<String> ingredients) {}

ModelInteractionParams request = ModelInteractionParams.builder()
    .model("gemini-3.7-flash")
    .input("Give me a cookie recipe")
    .responseMimeType("application/json")
    .responseFormat(GSchema.fromClass(Recipe.class))
    .build();

Interaction response = client.create(request);
```

## Remote agent sandboxes and files

The Interactions API allows [managed agents](https://aistudio.google.com/managed-agents) to run inside secure remote environments, execute shell commands, and generate files (such as reports or charts).

The official SDK exposes the REST metadata endpoint for environments:

```java
GetEnvironmentFilesResponse filesResponse = client.environments.files().list(
    GetEnvironmentFilesRequest.builder()
        .id(environmentId)
        .path("workspace")
        .build()
);
```

This lets you inspect file names and file metadata on the remote environment. However, there are no built-in helpers to download and unpack the environment workspace archive locally.

In my SDK, you have two options. You can call the REST metadata API, or you can use `EnvironmentWorkspace`, an `AutoCloseable` helper that downloads the remote TAR archive, caches it, and lets you read or extract files directly:

```java
try (EnvironmentWorkspace ws = client.getWorkspace(environmentId).refresh()) {
    if (ws.fileExists("report.pdf")) {
        ws.downloadFile("report.pdf", Path.of("./report.pdf"));
    }
}
```

## Which SDK should you use?

Both SDKs provide full connectivity to the Interactions API, and the right choice depends on your project setup.

### When the official Google GenAI SDK makes sense

If your application already uses `com.google.genai.Client` for other Gemini features (such as standard `generateContent`, model tuning, embeddings, or the Live bidirectional audio WebSocket), 
keeping everything within the official SDK avoids adding another dependency.

It is also the natural choice if your codebase is bound to Java 8 or Java 11, where Java 17 records and sealed classes cannot be used.

### When my Gemini Interactions SDK makes sense

If your project runs on Java 17 or higher and you want a more idiomatic developer experience, my SDK was tailored specifically for that. It removes the code-generation union wrappers, relies on native Java records, and provides extra utilities like class-based schema generation (`GSchema.fromClass`), local sandbox workspace extraction (`EnvironmentWorkspace`), and server-side webhook dispatching (`InteractionsHandler`).

You can explore both options on GitHub:
- [Google GenAI Java SDK (official)](https://github.com/googleapis/java-genai)
- [Gemini Interactions API Java SDK](https://github.com/glaforge/gemini-interactions-api-sdk)
