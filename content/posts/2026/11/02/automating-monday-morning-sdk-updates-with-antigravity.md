---
title: "Monday Morning SDK Maintenance with Antigravity Scheduled Automations"
description: "How I use Antigravity scheduled automations and repository-level AGENTS.md runbooks to check upstream API changes every Monday at 9:00 AM and keep my two Java SDKs up to date."
date: 2026-11-02T08:30:00+01:00
image: /img/antigravity/monday-morning-sdk-automations-banner.jpg
tags:
  - antigravity
  - java
  - ai-agents
  - generative-ai
  - gemini-interactions-api
  - agent-skills
  - automation
similar:
  - "posts/2026/05/21/managed-agents-with-the-gemini-interactions-java-sdk.md"
  - "posts/2026/07/31/the-unofficial-antigravity-sdk-for-java.md"
  - "posts/2026/09/23/running-local-gemma-models-with-litert-and-antigravity-java-sdk.md"
---

Maintaining an unofficial SDK (or two) means playing a constant game of catch-up with upstream APIs.
Over the past few months, I have been maintaining two Java libraries: the [Gemini Interactions API Java SDK]({{< ref "/posts/2026/06/24/gemini-interactions-api-now-ga-exploring-the-release-candidate-of-my-java-sdk.md" >}}) and the [unofficial Antigravity SDK for Java]({{< ref "/posts/2026/07/31/the-unofficial-antigravity-sdk-for-java.md" >}}).

Both upstream targets move fast.
The Gemini Interactions API updates its public OpenAPI specification (`interactions.openapi.json`) whenever new agent capabilities, voice synthesis options, or webhook parameters land.
Meanwhile, the official Antigravity Python SDK publishes new wheels to PyPI containing updated native Go `localharness` binaries, compiled Protobuf descriptors, and new Python classes.

Instead of manually checking both upstream sources every week, I configured two scheduled automations in [Google Antigravity](https://antigravity.google/).
Every Monday morning at 9:00 AM, Antigravity wakes up, spins up two fresh agent sessions in the background, audits the upstream changes against my local repositories, and prepares a complete implementation plan waiting for my review when I sit down with my coffee.

This morning (Monday, November 2), both automations found upstream changes, drafted their plans, implemented the code and unit tests after my review, and allowed me to release new versions of both SDKs to Maven Central before 10:00 AM.

> [!NOTE]
> Both releases are live on GitHub and Maven Central:
> - [Gemini Interactions API Java SDK `v2.1.1`](https://github.com/glaforge/gemini-interactions-api-sdk) (`io.github.glaforge:gemini-interactions-api-sdk:2.1.1`)
> - [Antigravity SDK for Java `v0.3.3`](https://github.com/glaforge/antigravity-java-sdk) (`io.github.glaforge.antigravity:antigravity-sdk-wrapper:0.3.3`)

## How Antigravity Scheduled Automations Work

Antigravity includes a customization system built around rules (`GEMINI.md`, `AGENTS.md`), on-demand skills (`SKILL.md`), MCP servers, plugins, and background sidecars.
A scheduled automation is a built-in `schedule` sidecar that runs on a standard 5-field cron expression and invokes `agentapi new-conversation` to start a new agent turn on each trigger.

Because each scheduled run starts a brand-new conversation with no memory of previous weeks, my setup splits the responsibility into two layers:

1. A lightweight `sidecar.json` automation file in `~/.gemini/config/sidecars/<id>/sidecar.json` that defines the cron schedule (`0 9 * * 1` for Monday at 9:00 AM) and a short trigger prompt.
2. Detailed, repository-specific instructions checked into git (`AGENTS.md`, `UPDATING_SDK.md`, and helper scripts like `sync-harness.sh`) that tell the agent how the project is structured and how to audit upstream changes.

Keeping the detailed synchronization steps inside `AGENTS.md` in each git repository keeps the cron prompt short and ensures that any manual conversation in that workspace benefits from the exact same instructions.

## Setting Up the Two Monday Morning Automations

You can create a scheduled automation interactively by typing `/automation` in Antigravity, or visually from Antigravity 2.0's **Automations** panel in the left sidebar (clicking **Create with Prompt** or **+ New**).
The built-in `automation` skill walks you through choosing a cadence (hourly, daily, weekly, or custom cron), picking the day and time, writing the prompt, and running a test turn to record the required file and URL permissions.

![Antigravity Automations panel](/img/antigravity/antigravity-automations-panel.png)

Under the hood, Antigravity writes a `sidecar.json` file for each automation.
Here are the two configurations I use.

### 1. Checking the Gemini Interactions OpenAPI Spec

The first automation lives in `~/.gemini/config/sidecars/check-remote-api/sidecar.json`:

```json
{
  "builtin": "schedule",
  "restart_policy": "always",
  "args": [
    "0 9 * * 1",
    "agentapi",
    "new-conversation",
    "--",
    "Check if there's an update on the remote OpenAPI JSON file, and prepare an implementation plan with the needed changes"
  ],
  "display_name": "Interactions API > Check remote API"
}
```

When this automation runs in the `gemini-interactions-api-sdk` workspace, the agent automatically reads the repository's `AGENTS.md` file, which points it to `UPDATING_SDK.md`.
That document gives the agent its step-by-step runbook:

1. Fetch the official OpenAPI specification from `https://ai.google.dev/static/api/interactions.openapi.json`.
2. Diff it against the local `openapi.json` copy stored at the root of the repository:
   ```bash
   curl -s https://ai.google.dev/static/api/interactions.openapi.json > remote_openapi.json
   diff -u openapi.json remote_openapi.json
   ```
3. Analyze any added, modified, or removed schemas, endpoints, query parameters, and Server-Sent Events (SSE) delta types.
4. Keep backward compatibility in mind: when the upstream OpenAPI spec removes an experimental field or enum constant, mark the corresponding Java record or enum value as `@Deprecated` rather than deleting it and breaking existing callers.
5. Plan the updates across the Java 21 model records, builders, `GeminiInteractionsClient`, unit tests, `README.md`, and the bundled Agent Skill (`skills/gemini-interactions-java-api/SKILL.md`).

### 2. Checking the Antigravity Python SDK and Native Go Harness

The second automation is defined in `~/.gemini/config/sidecars/check-new-version/sidecar.json`:

```json
{
  "builtin": "schedule",
  "restart_policy": "always",
  "args": [
    "0 9 * * 1",
    "agentapi",
    "new-conversation",
    "--",
    "Check if there's a new version of the Antigravity Python SDK wheel, and embedded Go localharness. \nYou can also check the official website changelog to see if they mention new versions with detailed release notes here: https://antigravity.google/docs/changelog?tab=sdk\nIf there's an update, prepare an implementation plan detailing the needed changes."
  ],
  "display_name": "AGY Java SDK > Check new version"
}
```

Synchronizing the Antigravity Java SDK is more involved because there is no single OpenAPI file to diff.
As I explained when [introducing the Antigravity SDK for Java]({{< ref "/posts/2026/07/31/the-unofficial-antigravity-sdk-for-java.md" >}}), the official Python SDK wraps a native Go binary called `localharness` and communicates with it over standard input/output and WebSockets using Protobuf messages.

To make this repeatable for the agent, I documented a 6-step upstream synchronization workflow in the repository's `AGENTS.md`:

| Step | What the Agent Does |
| :--- | :--- |
| **1. Check PyPI & Sync Binaries** | Queries `https://pypi.org/pypi/google-antigravity/json` via `./sync-harness.sh`, compares the upstream version against `antigravity-sdk-harness/.../.version`, downloads the 6 platform wheels (`linux-x86_64`, `linux-aarch64`, `osx-aarch64`, `osx-x86_64`, `windows-x86_64`, `windows-aarch64`), and unpacks the Python source into `/tmp/antigravity_upstream/`. |
| **2. Extract Compiled Protobuf Descriptors** | Decompiles the binary `FileDescriptorProto` directly from `localharness_pb2.py` and `content_pb2.py` in Python so it never has to guess wire field names (Go's `localharness` rejects unknown JSON fields immediately). |
| **3. Audit Python Source & Tests** | Diffs the unpacked Python package (`types.py`, `connection_config.py`, `hooks/policy.py`, `workflows.py`, and `*_test.py`) against the previous version, cross-referencing the public changelog at `antigravity.google/docs/changelog?tab=sdk`. |
| **4. Update Code & Parity Tests** | Updates `localharness.proto`, Java builders, and records, and creates a dedicated `FeatureParity<version>Test.java` unit test class covering every new capability. |
| **5. Verify Wire Compatibility** | Runs fast unit tests (`./mvnw test`), formats code (`./mvnw spotless:apply`), and runs a live smoke test against the new `localharness` binary. |
| **6. Sync Docs & Agent Skill** | Updates `README.md` and `skills/antigravity-sdk-java/SKILL.md` so coding agents using the Java SDK know about the new APIs. |

For step 2, having this tiny Python snippet right inside `AGENTS.md` saves the agent from ever guessing a Protobuf field name:

```python
import google.protobuf.descriptor_pb2 as d_pb2
from google.antigravity.proto import localharness_pb2

proto = d_pb2.FileDescriptorProto()
localharness_pb2.DESCRIPTOR.CopyToProto(proto)
print(proto)
```

### Enabling the Automations and Project Permissions

Once the `sidecar.json` files are created, you enable them in the Antigravity Automations dashboard (`sidecar://dashboard`) and bind each automation to its target project workspace.

Because scheduled automations run unattended at 9:00 AM, they only have access to the permissions granted to their project (plus global permissions in `~/.gemini/config/config.json`).
Any unapproved shell command or external domain fetch is automatically denied during a background run.
Running a test turn when setting up the automation lets you approve `read_url(ai.google.dev)`, `read_url(antigravity.google)`, `curl -s https://pypi.org/pypi/google-antigravity/json`, and `./mvnw` once, so the Monday morning check can complete its analysis without getting stuck on a permission prompt.

Notice also what the automation prompt asks the agent to do: *"prepare an implementation plan detailing the needed changes"*.
I intentionally stop the unattended run at the planning stage.
I want the agent to do all the research, diffing, and design work on its own, and then pause with an implementation plan artifact so I can review the proposed changes before it touches the code or triggers a release.

## What Happened This Morning: Two Automated Audits, Two Releases

When I opened Antigravity this morning shortly after 9:10 AM, both Monday automations had just finished running and had produced detailed implementation plans.

### 1. Gemini Interactions API Java SDK `v2.1.1`

In the Gemini Interactions SDK workspace, the agent spotted that the remote `interactions.openapi.json` specification had changed across 22 schemas (with 4 newly added schemas and 29 legacy schemas removed) and prepared the implementation plan.
I reviewed the plan, clicked **Proceed**, and let the agent update 21 files, add a 314-line unit test suite (`OpenApiUpdateNov02Test.java`), verify that `./mvnw test` and `./mvnw javadoc:javadoc` passed without warnings, and update both `README.md` and `SKILL.md`.

{{< details summary="Click to see what changed in Gemini Interactions API Java SDK v2.1.1" >}}

- Interaction continuation and metadata: A new `REQUIRES_CONTINUATION` status value on `Interaction.Status` (used alongside `continuationToken` when resuming paused interactions), plus per-interaction `webhookConfig`, custom `labels` (`Map<String, String>`), `maxTotalTokens`, and `initialInputTokens` in `Usage`.
- Model environments: `ModelInteractionParams` now supports attaching a `BaseEnvironment` or `environmentId` directly, matching `CreateModelInteractionParams` in the spec.
- Speech configuration and voice remixing: `GenerationConfig` renamed `speech_config` to `structured_speech_config` (which we mapped with `@JsonProperty("structured_speech_config")` and `@JsonAlias("speech_config")` so existing JSON payloads and builder methods keep working), and `PromptedVoice` added a `base_voice` property to remix an existing voice from a natural-language prompt:
  ```java
  Voice remixedVoice = client.createVoice(Voice.builder()
      .model(ModelOption.GEMINI_3_8_FLASH_TTS)
      .displayName("Faster Astronomer")
      .prompted("Speak at a brisk, energetic pace", astronomer.id())
      .build());
  ```
- Client query parameter overloads: New overloads on `GeminiInteractionsClient` for `createAgent(agent, parent)`, `listTriggerExecutions(triggerId, pageSize, pageToken, filter)`, and `createWebhook(webhook, webhookId)`.
- Non-breaking deprecations: Rather than deleting the 29 removed schemas (such as legacy RAG/Retrieval steps and `CodeMenderAgentConfig`), the agent marked them with `@Deprecated` so existing users upgrading to `v2.1.1` will not hit compilation errors.

{{< /details >}}

### 2. Antigravity SDK for Java `v0.3.3` (Upstream `v0.1.23` Parity)

In parallel, the second automation detected that the upstream `google-antigravity` package on PyPI had moved from `0.1.22` to `0.1.23`.
Once I approved its 6-phase upgrade plan, the agent synchronized the native Go binaries, updated 21 files, wrote 369 lines of parity tests in `FeatureParity0123Test.java`, ran Spotless and the test suite, and updated the documentation and skill files.

{{< details summary="Click to see what changed in Antigravity SDK for Java v0.3.3" >}}

- Native Go `localharness` `v0.1.23`: Updated the binaries across all 6 OS/architecture slices and added the new Protobuf fields in `localharness.proto` (`SectionHeaderFormat`, `CustomSystemInstructions.Part.title`, `ToolOutputTruncation`, `SkillsConfig` options, and `BASH` in `CodeExecutionCallArguments.Language`).
- Workflow `callTool`, multi-turn `WorkflowAgent`, and runtime `args`: You can now invoke parent agent tools directly inside workflows (`callTool` / `callToolExpr`), define persistent multi-turn subagents inside a workflow (`defineAgent` and `callAgent`), and pass a `Map<String, Object>` of runtime arguments to `agent.beta().runWorkflow(...)`:
  ```java
  AgentConfig config = AgentConfig.builder()
      .customInstructions("Enforce strict null-safety and immutable records.", "CodingStandards")
      .capabilities(CapabilitiesConfig.builder()
          .enableSubagents(true)
          .enableRunWorkflow(true)
          .build())
      .build();

  WorkflowDefinition workflow = Workflows.builder("pr_review_workflow")
      .description("Read target file and run multi-turn review")
      .phase("Read")
      .callToolExpr("file_content", "view_file", Map.of("Path", "args.get('target', 'README.md')"))
      .phase("Review")
      .defineAgent("reviewer", "You are a principal Java reviewer.", "Reviewer", "self", "inherit")
      .callAgent("initial_pass", "reviewer", "Summarize key risks in the file", String.class)
      .callAgent("final_verdict", "reviewer", "Provide final pass/fail verdict", String.class)
      .logExpr("initial_pass", "final_verdict")
      .build();

  try (Agent agent = new Agent(config)) {
      WorkflowResult result = agent.beta()
          .runWorkflow(
              workflow,
              Map.of("target", "pom.xml"),
              progress -> System.out.println("Progress: " + progress.output()))
          .get(120, TimeUnit.SECONDS);
      System.out.println("Workflow result:\n" + result.output());
  }
  ```
- Titled custom system instructions: `CustomSystemInstructions.of(text, title)` and `.customInstructions(text, title)` wrap custom instructions in a named section header tag instead of a generic `<System>` block.
- JSON Schema `readOnly` / `writeOnly` and utilities: Added `readOnly` and `writeOnly` support to `@Param` and `SchemaGenerator`, canonical path normalization on `ToolCall.canonicalPath()`, `~` home directory expansion on `AgentInput.Media.fromFile(...)`, and `DiffFormatter.formatDiffBlocks(...)` for formatting `edit_file` diff blocks into unified diffs.

{{< /details >}}

### 3. Human Review and Manual Release

By 9:50 AM, both workspaces had clean git diffs, passing test suites, and updated documentation.
I did a final review of the commits, pushed them to `main`, and manually triggered the GitHub Actions release workflows (which use [JReleaser](https://jreleaser.org/) to sign and publish the artifacts to Maven Central and create the GitHub releases).

Keeping a human gate at two points in the loop (approving the implementation plan before code generation, and manually triggering the Maven Central release after inspecting the diff) gives me the best balance between speed and control.
What used to take several hours of tedious spec diffing and Protobuf reverse-engineering now takes about twenty minutes of reviewing plans and diffs on Monday morning.

## Wrap-up

If you maintain an SDK, an API client, or an integration that tracks an external specification or upstream repository, pairing a cron-triggered Antigravity automation (`sidecar.json`) with a well-structured `AGENTS.md` runbook is a very practical workflow to set up.
You can start small by typing `/automation` in Antigravity, pointing an agent at your upstream changelog or OpenAPI spec every Monday morning, and letting it hand you an implementation plan before you even finish your first cup of coffee.
