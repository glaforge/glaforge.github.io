---
title: "Evaluating ADK Java and Kotlin Agents with Dokimos"
description: "I contributed Google ADK for Java and Kotlin integrations to Dokimos 0.31.0 so you can evaluate agent tool calls, multi-agent trajectories, token costs, and task completion right inside JUnit."
date: 2026-11-12T15:30:00+01:00
image: /img/dokimos/dokimos-adk-evaluation-banner.jpg
tags:
  - java
  - kotlin
  - ai-agents
  - agent-development-kit
  - generative-ai
  - gemini
  - junit
similar:
  - "posts/2026/11/10/restoring-lecture-slides-with-prompt-benchmarking-and-llm-as-judge.md"
  - "posts/2026/03/30/building-my-comic-trip-agent-with-adk-java-1-0.md"
  - "posts/2026/05/21/wiring-adk-kotlin-agents-in-an-android-application.md"
---

On Tuesday, I shared how I built FixSlidePic by [combining offline prompt benchmarking with an LLM-as-a-Judge loop]({{< ref "/posts/2026/11/10/restoring-lecture-slides-with-prompt-benchmarking-and-llm-as-judge.md" >}}) in [ADK for Java](https://github.com/google/adk-java).
For that project, I hacked together a standalone Python script to score prompt variants before writing the Java application.

Custom scripts get the job done once, yet as soon as you maintain several Java or Kotlin agents, you want those evaluations living in `src/test` and running with `mvn test` on every pull request.

That is what drew me to **[Dokimos](https://github.com/dokimos-dev/dokimos)**, an open-source (MIT) evaluation toolkit for LLM applications and AI agents in Java and Kotlin.
Dokimos already integrated with JUnit, LangChain4j, Spring AI, Koog, and Embabel, so I opened [PR #199](https://github.com/dokimos-dev/dokimos/pull/199) to contribute dedicated support for both **[ADK for Java](https://github.com/google/adk-java)** (`dokimos-adk-java`) and **[ADK for Kotlin](https://github.com/google/adk-kotlin)** (`dokimos-adk-kotlin`).
The pull request was merged earlier today and is already live on Maven Central in **[Dokimos 0.31.0](https://github.com/dokimos-dev/dokimos/releases/tag/v0.31.0)**.

> [!NOTE]
> **Links & coordinates at a glance:**
> - [Dokimos on GitHub](https://github.com/dokimos-dev/dokimos) and [PR #199](https://github.com/dokimos-dev/dokimos/pull/199)
> - [Google ADK integration documentation](https://dokimos.dev/integrations/adk)
> - Maven Central (`0.31.0`): `dev.dokimos:dokimos-adk-java:0.31.0` and `dev.dokimos:dokimos-adk-kotlin:0.31.0`
> - Runnable repository examples: [`AdkAgentEvaluationExample.java`](https://github.com/dokimos-dev/dokimos/blob/master/dokimos-examples/src/main/java/dev/dokimos/examples/adk/AdkAgentEvaluationExample.java) and [`AdkKotlinAgentEvaluationExample.kt`](https://github.com/dokimos-dev/dokimos/blob/master/dokimos-examples/src/main/kotlin/dev/dokimos/examples/adk/AdkKotlinAgentEvaluationExample.kt)

## Why Evaluating Agents Goes Beyond Final Text Answers

Traditional LLM tests compare a prompt against a final string answer.
With tool-calling and multi-agent workflows, a polite final reply can hide broken execution underneath:

1. An agent might call the wrong tool, pass an ungrounded parameter value that never appeared in the user's request, or violate the tool's JSON schema.
2. A tool might return a structured error payload (such as `{"error": "Impossible to look up..."}`) that the model glosses over.
3. A confused loop might call the same function three times with identical arguments, multiplying latency and token bills.
4. Sub-agents inside a sequential or parallel pipeline might skip a required step or pass incomplete coordinates downstream.

To catch these failure modes, Dokimos captures the full execution trace of an ADK run and feeds it to two families of evaluators:

```text
ADK Agent (LlmAgent / SequentialAgent / ParallelAgent)
  │
  ├──► AdkSupport.toAgentTrace(...) or passive AdkTraceCollector plugin
  │       ├── AgentTrace (finalResponse, toolCalls, reasoningSteps)
  │       ├── List<ToolDefinition> (names, descriptions, JSON schemas)
  │       └── CallMetrics (tokensIn, tokensOut, latencyMs, costUsd)
  │
  └──► Dokimos Evaluators (dev.dokimos.core.evaluators.agents)
          ├── Deterministic checks (0 LLM calls, fast CI assertions)
          └── JudgeLM checks (Gemini or any ADK BaseLlm / Model)
```

Five of Dokimos's nine agent evaluators are purely deterministic (no extra LLM calls or API costs), while the remaining four use a `JudgeLM` (or combine deterministic rule checks with optional LLM review):

| Evaluator | Type | What it checks |
| :--- | :--- | :--- |
| `ToolCallValidityEvaluator` | Deterministic | Validates every `ToolCall` against the JSON schemas in `metadata["tools"]` (tool exists, required arguments present, valid types/enums). |
| `ToolCorrectnessEvaluator` | Deterministic | Compares actual vs. expected tool calls (`NAMES_ONLY`, `NAMES_AND_ORDER`, or `NAMES_AND_ARGS`). |
| `ToolTrajectoryEvaluator` | Deterministic | Evaluates call sequences across `STRICT`, `IN_ORDER`, `ANY_ORDER`, `SUPERSET`, `SUBSET`, `PRECISION`, or `RECALL` modes. |
| `ToolErrorEvaluator` | Deterministic | Flags blank tool outputs, top-level JSON `"error"` fields, or custom error predicates. |
| `ToolEfficiencyEvaluator` | Deterministic | Computes the ratio of distinct `(name, args)` calls to total calls (`1.0` means zero duplicate calls). |
| `TaskCompletionEvaluator` | `JudgeLM` | Scores whether the agent fulfilled each user task listed in `metadata["tasks"]` (and optional `constraints`). |
| `ToolArgumentHallucinationEvaluator` | `JudgeLM` | Checks that every argument passed to a tool is grounded in the user's input. |
| `ToolNameReliabilityEvaluator` | Rules + optional `JudgeLM` | Audits tool names for `snake_case`, conciseness, and intent clarity. |
| `ToolDescriptionReliabilityEvaluator` | Rules + optional `JudgeLM` | Audits tool descriptions and parameter schemas for missing types or ambiguous wording. |

## Adding `dokimos-adk-java` to a Maven Project

Both ADK integrations declare the ADK SDKs as `provided` dependencies, so you keep whatever ADK version your project already uses (Java 17+ minimum).
Here is the Maven setup with Dokimos `0.31.0` and `dokimos-junit`:

```xml
<dependency>
    <groupId>com.google.adk</groupId>
    <artifactId>google-adk</artifactId>
    <version>1.12.0</version>
</dependency>

<dependency>
    <groupId>dev.dokimos</groupId>
    <artifactId>dokimos-adk-java</artifactId>
    <version>0.31.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>dev.dokimos</groupId>
    <artifactId>dokimos-junit</artifactId>
    <version>0.31.0</version>
    <scope>test</scope>
</dependency>
```

Because `dokimos-adk-java` hooks into ADK's `BaseLlm`, `Runner`, `Event`, and `BasePlugin` abstractions, it works with Gemini models as well as third-party models wrapped through `google-adk-langchain4j`, `google-adk-spring-ai`, or `Claude`.

## Testing a Single-Agent Tool Caller: Stock Ticker

To try `dokimos-adk-java` on real agent code, I started with the `_20_StockTicker` agent from my [`glaforge/ai-agent-protocols`](https://github.com/glaforge/ai-agent-protocols) repository.
It exposes a `lookup_stock_ticker` function via ADK's `@Schema` annotation and `FunctionTool.create(...)`, returning USD quotes for known tickers and a JSON `"error"` map whenever someone asks for an unknown ticker such as `"DEVOXX"`:

```java
import com.google.adk.agents.LlmAgent;
import com.google.adk.models.BaseLlm;
import com.google.adk.tools.Annotations.Schema;
import com.google.adk.tools.FunctionTool;
import java.util.Locale;
import java.util.Map;

public final class StockTickerAgent {

    private static final Map<String, String> QUOTES = Map.of(
            "GOOG", "290.63", "GOOGL", "293.45", "ALPHABET", "290.63",
            "NVDA", "173.73", "NVIDIA", "173.73",
            "MSFT", "521.12", "MICROSOFT", "521.12");

    public static LlmAgent create(BaseLlm model) {
        return LlmAgent.builder()
                .name("20-stock-ticker")
                .description("Stock exchange ticker expert")
                .model(model)
                .instruction("""
                        You are a stock exchange ticker expert.
                        When asked about the stock price of a company,
                        use the `lookup_stock_ticker` tool to find the information
                        and report the stock price clearly in USD.
                        """)
                .tools(FunctionTool.create(StockTickerAgent.class, "lookupStockTicker"))
                .build();
    }

    @Schema(
            name = "lookup_stock_ticker",
            description = "Lookup stock price for a given company or ticker")
    public static Map<String, String> lookupStockTicker(
            @Schema(
                    name = "company_name_or_stock_ticker",
                    description = "The company name or stock ticker to lookup")
            String ticker) {
        if (ticker == null || ticker.isBlank()) {
            return Map.of("error", "Impossible to look up the stock price for " + ticker);
        }
        String normalized = ticker.trim().toUpperCase(Locale.ROOT);
        String price = QUOTES.get(normalized);
        if (price == null) {
            return Map.of("error", "Impossible to look up the stock price for " + ticker);
        }
        return Map.of("ticker", normalized, "stock_price", price, "currency", "USD");
    }
}
```

### Passive Trace, Schema, and Cost Capture with `AdkTraceCollector`

You can run an agent directly with `AdkSupport.toAgentTrace(agent, query)`, or attach `AdkTraceCollector` (an ADK `BasePlugin`) to your `Runner.Builder`.
Attaching the plugin has a nice perk: ADK passes the live `BaseTool` instance into tool callbacks, so `AdkSupport.toToolDefinitions(collector)` preserves every tool's description and JSON parameter schema automatically.

Here is an end-to-end JUnit test running against **Gemini 3.8 Flash** (`gemini-3.8-flash`), combining deterministic tool checks, `JudgeLM` checks (`AdkSupport.asJudge(gemini)`), and USD cost tracking through a `PriceTable`:

```java
Gemini gemini = Gemini.builder()
        .modelName("gemini-3.8-flash")
        .apiKey(System.getenv("GEMINI_API_KEY"))
        .build();

LlmAgent agent = StockTickerAgent.create(gemini);
JudgeLM judge = AdkSupport.asJudge(gemini);

Runner.Builder runnerBuilder = Runner.builder().agent(agent).appName("stock-ticker-live");
AdkTraceCollector collector = AdkSupport.attach(runnerBuilder);
Runner runner = runnerBuilder.build();

String query = "What is Alphabet's current stock price? Please look up ticker GOOG.";
AgentTrace trace = AdkSupport.toAgentTrace(runner, query);
List<ToolDefinition> tools = AdkSupport.toToolDefinitions(collector);

PriceTable flashPrices = (model, in, out) -> (in * 0.15 + out * 0.60) / 1_000_000.0;
CallMetrics metrics = collector.callMetrics("gemini-3.8-flash", flashPrices);

EvalTestCase testCase = EvalTestCase.builder()
        .input(query)
        .actualOutputs(trace.toOutputMap())
        .expectedOutput(
                "toolCalls",
                List.of(ToolCall.of(
                        "lookup_stock_ticker",
                        Map.of("company_name_or_stock_ticker", "GOOG"))))
        .metadata("tools", tools)
        .metadata("tasks", List.of(
                "Look up the stock price for GOOG",
                "Report the stock price in USD"))
        .build();

Assertions.assertEval(
        testCase,
        ToolCallValidityEvaluator.builder().build(),
        ToolCorrectnessEvaluator.builder()
                .matchMode(ToolCorrectnessEvaluator.MatchMode.NAMES_AND_ARGS)
                .build(),
        ToolErrorEvaluator.builder().build(),
        ToolArgumentHallucinationEvaluator.builder().judge(judge).build(),
        TaskCompletionEvaluator.builder().judge(judge).threshold(0.8).build());
```

Running this test against Gemini 3.8 Flash prints every evaluator score along with token counts (summing `promptTokenCount`, `candidatesTokenCount`, and `thoughtsTokenCount` across non-partial events), wall-clock latency, and computed cost:

```text
=== Live Gemini 3.8 Flash StockTickerAgent Evaluation ===
Query:               What is Alphabet's current stock price? Please look up ticker GOOG.
Observed tools:      [lookup_stock_ticker]
Final response:      The current stock price for Alphabet (GOOG) is **$290.63 USD**.
Tool Call Validity:  1.00 (1/1 tool calls are valid.)
Tool Correctness:    1.00 (1 of 1 actual and 1 of 1 expected tool calls matched (with arguments).)
Tool Error Free:     1.00 (1/1 tool calls succeeded.)
Arg Grounding:       1.00 (1/1 tool calls have grounded arguments.)
Task Completion:     1.00 (2/2 tasks completed.)
Call Metrics:        tokensIn=465, tokensOut=125, latencyMs=5767, costUsd=$0.000145
```

### Catching Structured Tool Errors (`"DEVOXX"`)

Look at what happens when we ask `"What is the stock price for DEVOXX?"`.
Passing `"DEVOXX"` as `company_name_or_stock_ticker` is completely valid according to the tool's JSON schema, so `ToolCallValidityEvaluator` scores `1.0`.
`ToolErrorEvaluator`, on the other hand, inspects the `FunctionResponse` returned by `lookupStockTicker`, spots the top-level `"error"` key, and flags the failure right away:

```java
@Test
void catchesStructuredDevoxxToolErrorWhileSchemaRemainsValid() {
    String query = "What is the stock price for DEVOXX?";

    AgentTrace trace = AdkSupport.toAgentTrace(agent, query);
    List<ToolDefinition> tools = AdkSupport.toToolDefinitions(agent);
    EvalTestCase testCase = trace.toTestCase(query, tools);

    EvalResult validity = ToolCallValidityEvaluator.builder().build().evaluate(testCase);
    EvalResult toolError = ToolErrorEvaluator.builder().build().evaluate(testCase);

    assertThat(validity.success()).isTrue();
    assertThat(validity.score()).isEqualTo(1.0);
    assertThat(toolError.success()).isFalse();
    assertThat(toolError.score()).isEqualTo(0.0); // "0/1 tool calls succeeded"
}
```

## Parameterized Golden Datasets in JUnit with `@DatasetSource`

Checking one query in isolation is useful when writing an agent, while regression suites work better with a versioned dataset.
With `dokimos-junit`, you can keep golden test cases in `src/test/resources/datasets/stock-queries.json`:

```json
{
  "name": "stock-ticker-golden-dataset",
  "examples": [
    {
      "input": "What is Alphabet's current stock price? Use ticker GOOG.",
      "expectedOutputs": {
        "toolCalls": [
          {
            "name": "lookup_stock_ticker",
            "arguments": { "company_name_or_stock_ticker": "GOOG" }
          }
        ]
      },
      "metadata": {
        "tasks": [
          "Look up the stock price for GOOG",
          "Report the stock price in USD"
        ]
      }
    }
  ]
}
```

Then annotate a JUnit `@ParameterizedTest` with `@DatasetSource`:

```java
@ParameterizedTest
@DatasetSource("classpath:datasets/stock-queries.json")
void evaluatesGoldenDatasetWithDeterministicAndJudgeEvaluators(Example example) {
    AgentTrace trace = AdkSupport.toAgentTrace(agent, example.input());

    EvalTestCase testCase = EvalTestCase.builder()
            .inputs(example.inputs())
            .actualOutputs(trace.toOutputMap())
            .expectedOutputs(example.expectedOutputs())
            .metadata(example.metadata())
            .metadata("tools", AdkSupport.toToolDefinitions(agent))
            .build();

    Assertions.assertEval(
            testCase,
            ToolCallValidityEvaluator.builder().build(),
            ToolCorrectnessEvaluator.builder()
                    .matchMode(ToolCorrectnessEvaluator.MatchMode.NAMES_AND_ARGS)
                    .build(),
            ToolErrorEvaluator.builder().build(),
            TaskCompletionEvaluator.builder().judge(judge).threshold(1.0).build());
}
```

Each entry in `stock-queries.json` shows up as an individual parameterized run in your IDE and CI test report.
For fast, deterministic unit tests that do not require an API key on every commit, you can also subclass ADK's `BaseLlm` with canned `FunctionCall` responses and reserve live Gemini runs for `@Tag("integration")` or `@EnabledIfEnvironmentVariable(named = "GEMINI_API_KEY", matches = ".+")`.

## Multi-Agent Trajectories: `SequentialAgent` and `ParallelAgent`

Single-agent tool calls are straightforward to assert in strict order.
Multi-agent pipelines (like [my Comic Trip agent]({{< ref "/posts/2026/03/30/building-my-comic-trip-agent-with-adk-java-1-0.md" >}}) or the geospatial emergency response workflow in [`glaforge/ign-agentic`](https://github.com/glaforge/ign-agentic)) introduce concurrency.

In `ign-agentic`, a `SequentialAgent` (`cellule-crise-ign`) coordinates three stages:
1. `agent-localisation` calls `geocode_address` to turn a French street alert into WGS84 coordinates.
2. A `ParallelAgent` (`collecte-territoriale-parallele`) runs `agent-topographe` (`get_elevation_and_slope`) and `agent-logistique` (`compute_isochrone`) concurrently on those coordinates.
3. `coordinateur-secours` synthesizes the terrain slope and 5-minute vehicle envelope into an intervention plan.

When I ran this pipeline twice in a row against Gemini 3.8 Flash, the two parallel branches finished in opposite orders:
- Run 1: `[geocode_address, get_elevation_and_slope, compute_isochrone]`
- Run 2: `[geocode_address, compute_isochrone, get_elevation_and_slope]`

A strict sequence assertion would fail roughly half the time!
This is where `AdkSupport.toToolDefinitions(pipeline)` (which recursively walks `subAgents()` across `SequentialAgent` and `ParallelAgent`), `Experiment`, and `ToolTrajectoryEvaluator` with `MatchMode.ANY_ORDER` fit together:

```java
// Recursively collects tools from SequentialAgent -> ParallelAgent -> LlmAgent sub-agents
List<ToolDefinition> tools = AdkSupport.toToolDefinitions(pipeline);
// -> [geocode_address, get_elevation_and_slope, compute_isochrone]

ExperimentResult result = Experiment.builder()
        .name("IGN Crisis Multi-Agent Evaluation")
        .dataset(dataset)
        .measuredTask(AdkSupport.measuredAgentTask(pipeline, "gemini-3.8-flash", flashPrices))
        .evaluators(List.of(
                ToolCallValidityEvaluator.builder().build(),
                ToolErrorEvaluator.builder().treatBlankAsError(false).build(),
                ToolTrajectoryEvaluator.builder()
                        .name("Parallel Crisis Trajectory")
                        .matchMode(ToolTrajectoryEvaluator.MatchMode.ANY_ORDER)
                        .argumentMatcher(ArgumentMatcher.of(ArgMatchMode.SUBSET))
                        .build()))
        .build()
        .run();

assertThat(result.passRate()).isEqualTo(1.0);
```

> [!TIP]
> **Two practical details to keep in mind:**
> 1. Unlike `ToolCorrectnessEvaluator` (which defaults to `NAMES_ONLY`), `ToolTrajectoryEvaluator` defaults to `ArgumentMatcher.tolerant()` (`ArgMatchMode.EXACT`). If your expected `ToolCall`s only specify a subset of arguments (or omit arguments with `Map.of()`), pass `ArgumentMatcher.of(ArgMatchMode.SUBSET)` or `ArgMatchMode.IGNORE` explicitly.
> 2. When two `ParallelAgent` branches emit concurrent `FunctionCall` events before either `FunctionResponse` arrives, event-window pairing in `measuredAgentTask` can leave one intermediate `ToolCall.result()` blank unless you attach `AdkTraceCollector` directly on the `Runner` or set `.treatBlankAsError(false)` on `ToolErrorEvaluator`.

## Idiomatic Kotlin Support with `dokimos-adk-kotlin`

Back in May, I wrote about [wiring ADK Kotlin agents into an Android app]({{< ref "/posts/2026/05/21/wiring-adk-kotlin-agents-in-an-android-application.md" >}}).
Even though Java is my home turf, I wanted Kotlin developers using [ADK for Kotlin](https://github.com/google/adk-kotlin) (`com.google.adk:google-adk-kotlin-core-jvm`) to get an integration tailored to coroutines rather than a Java wrapper.

ADK for Kotlin is a standalone, coroutine-native SDK built around `Flow<Event>`, `suspend` functions, `com.google.adk.kt.models.Model`, and `com.google.adk.kt.plugins.Plugin`.
Adding `dokimos-adk-kotlin` transitively pulls in `dokimos-kotlin` and its `experiment { ... }` DSL:

```kotlin
// build.gradle.kts
dependencies {
    implementation("com.google.adk:google-adk-kotlin-core-jvm:1.4.0")
    testImplementation("dev.dokimos:dokimos-adk-kotlin:0.31.0")
}
```

In package `dev.dokimos.adk.kt`, you get top-level extensions (`suspend fun BaseAgent.runTrace(input)`, `agent.toToolDefinitions()`, `gemini.asJudge()`, `agent.asConversationalApp()`) alongside automatic `modelId` resolution (since `LlmAgent.model.name` is public in ADK Kotlin):

```kotlin
import com.google.adk.kt.models.Gemini
import dev.dokimos.adk.kt.AdkSupport
import dev.dokimos.adk.kt.asJudge
import dev.dokimos.adk.kt.runTrace
import dev.dokimos.adk.kt.toToolDefinitions
import dev.dokimos.core.PriceTable
import dev.dokimos.core.agents.ToolCall
import dev.dokimos.core.evaluators.agents.ToolCorrectnessEvaluator
import dev.dokimos.kotlin.dsl.experiment

val gemini = Gemini(name = "gemini-3.8-flash", apiKey = System.getenv("GEMINI_API_KEY"))
val agent = createKotlinStockAgent(gemini)
val judge = gemini.asJudge()

// Inside a coroutine, you can also capture a single trace directly:
// val trace = agent.runTrace("What is NVIDIA's share price (NVDA)?")

val flashPrices = PriceTable { _, tokensIn, tokensOut ->
    (tokensIn * 0.15 + tokensOut * 0.60) / 1_000_000.0
}

val result = experiment {
    name = "Live ADK Kotlin Stock Evaluation"
    dataset {
        name = "live-kotlin-stock"
        example {
            input = "What is Microsoft's current stock price? Use ticker MSFT."
            expected("toolCalls", listOf(ToolCall.of("lookup_stock_ticker", mapOf("ticker" to "MSFT"))))
            metadata("tools", agent.toToolDefinitions())
            metadata("tasks", listOf("Look up MSFT stock price", "State the price in USD"))
        }
    }
    // modelId is inferred automatically from agent.model.name
    asyncTask(AdkSupport.asyncAgentTask(agent, priceTable = flashPrices))
    evaluators {
        toolCallValidity()
        toolCorrectness {
            matchMode = ToolCorrectnessEvaluator.MatchMode.NAMES_AND_ARGS
        }
        toolError()
        taskCompletion(judge) {
            threshold = 0.8
        }
    }
}.run()
```

Running that Kotlin experiment against Gemini 3.8 Flash executes the coroutine `Flow<Event>` asynchronously, returns the `$521.12 USD` quote for Microsoft, scores all four evaluators at `100%`, and records `tokensIn=343, tokensOut=126, latencyMs=4110, costUsd=$0.000127`.

## Beyond Tool Calls: RAG and Multi-Turn Simulations

Tool trajectories are only half the story when testing conversational or knowledge-grounded agents.
Both `dokimos-adk-java` and `dokimos-adk-kotlin` also wire into Dokimos's RAG and multi-turn simulation APIs:

1. Calling `AdkSupport.ragTask(agent)` (or `measuredRagTask` / `asyncRagTask`) extracts retrieved chunks from both Gemini's built-in `GroundingMetadata` (`retrievedContext`, `ragChunk`, `web`) and retrieval tool `FunctionResponse` maps (`VertexAiRagRetrieval` or your own search tools), populating `"context"` for `FaithfulnessEvaluator` and `ContextualRelevancyEvaluator`.
2. Calling `AdkSupport.asConversationalApp(agent)` (or `agent.asConversationalApp()` in Kotlin) adapts any ADK agent for `ConversationSimulator`, letting an `LLMSimulatedUser` drive multi-turn persona scenarios across an ADK `Session` and produce a `ConversationTrajectory`.

## Wrap-up

Having deterministic tool assertions, `JudgeLM` rubrics, golden datasets, and per-run token cost tracking directly inside JUnit makes iterating on ADK prompts and sub-agent graphs much less guesswork.
You can assert tool schemas and trajectories for free on every commit, and run live Gemini judge evaluations before shipping prompt or model updates.

To try it on your own agents, grab `dev.dokimos:dokimos-adk-java:0.31.0` or `dev.dokimos:dokimos-adk-kotlin:0.31.0` from Maven Central, browse the [ADK integration documentation](https://dokimos.dev/integrations/adk), and check out the runnable Java and Kotlin samples in [`dokimos-examples`](https://github.com/dokimos-dev/dokimos/tree/master/dokimos-examples/src/main).
If you give it a spin on your ADK workflows, let me know what evaluators or patterns you find most useful!
