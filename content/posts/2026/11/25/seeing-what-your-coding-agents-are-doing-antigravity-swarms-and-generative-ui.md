---
title: "Seeing What Your Coding Agents Are Doing: Antigravity Swarms and Generative UI"
description: "How Antigravity's Swarm UI and /generative_ui slash command let you track parallel agent teams, monitor long-running tests and cloud backfills, analyze multi-model LLM costs, and explore hardware and code architectures visually."
date: 2026-11-25T10:00:00+01:00
image: /img/antigravity-visualizations/banner.jpg
tags:
  - antigravity
  - ai-agents
  - generative-ui
  - swarm
  - visualization
  - developer-tools
similar:
  - "posts/2026/11/23/reviving-my-sci-fi-story-agent-with-consistent-characters-and-narrative.md"
  - "posts/2026/11/02/automating-monday-morning-sdk-updates-with-antigravity.md"
  - "posts/2026/06/11/antigravity-brain-visualizer.md"
---

Yesterday at the Google office, my colleague [Maud Nalpas](https://www.linkedin.com/in/maudnalpas/) and I co-organized an AI-focused meetup bringing together the [Duchess France](https://www.duchess-france.fr/) community (led by [Mathilde Rigabert](https://www.linkedin.com/in/mathildelemee/)) and the [Dev With AI](https://devw.ai/) community (led by [Greg Lhotellier](https://www.linkedin.com/in/greg-lhotellier/), with an active [Slack community](https://join.slack.com/t/devwithai/shared_invite/zt-4bel62evm-TZDaovKdjOBIZDTR~w46xA) you can join).
After the talks, I had a great conversation with [Clara Wiatrowski](https://x.com/clarabaila), who had just presented her [Recreo](https://github.com/clawia/recreo) project on how AI can help educate our kids, and with [Emmanuel Sciara](https://www.linkedin.com/in/emmanuelsciara/), an active member of Dev With AI.

Emmanuel mentioned something I keep hearing from developers using coding agents: with the harness he uses, he often misses seeing how the agent is actually progressing once a task gets beyond a couple of edits.
Scrolling through a terminal stream of tool calls and diffs works fine for a quick fix, not so much when five things happen in parallel or a migration runs for half an hour.

I agreed with him and told him about two features in [Google Antigravity](https://antigravity.google/) that have made a big difference for me: the **Swarm UI** for watching multi-agent teams work together, and the **`/generative_ui`** slash command for generating custom interactive visualizations whenever plain text falls short.

> [!NOTE]
> Both features are documented on the Antigravity site:
> - [Swarm (`/swarm`) documentation](https://antigravity.google/docs/swarm) (available in both the Antigravity App and CLI)
> - [Generative UI (`/generative_ui`) documentation](https://antigravity.google/docs/commands/generative-ui/) (available in the Antigravity App)

## Watching a Multi-Agent Team in the Swarm UI

When a task splits cleanly across independent files, packages, or investigation tracks, running `/swarm` turns your current Antigravity conversation into a **coordinator**.
The coordinator divides the work, spawns named worker agents (plus a `@verifier` to audit diffs and run tests), and lets everyone coordinate on a single shared message board using `@mentions`.
Idle workers go to sleep without consuming tokens and wake up automatically when mentioned.

What makes this easy to follow in practice is the Swarm pane itself, which organizes the team's activity across four tabs: **Overview**, **Board**, **Members**, and **Graph**.

The screenshots below come from a real swarm I ran (`Sketchnote Omni Animation Prompt Lab`) to research, test, and verify prompts that animate static hand-drawn sketchnotes as if drawn live by a human hand.

### Overview: Goal, Threads, and Visual Progress

The **Overview** tab gives you the high-level picture without having to read raw agent transcripts.
At the top, you see the swarm's goal, the tasks currently running, and how many tasks are done (along with any bottlenecks, such as `2 waiting on @verifier`).
Below that, tasks are grouped into outcome-oriented **Threads** (`Prompt Optimization Tracks`, `Video Analysis & Validation`, `Seed Prompt Research`), and the team roster sits at the bottom so you can jump into any member's conversation.

![Antigravity Swarm Overview tab showing goal, running tasks, threads, and team roster](/img/antigravity-visualizations/swarm-overview-threads.png)

When a swarm works on visual output, the coordinator can also instruct workers to attach step-by-step screenshots.
The Overview tab collects those into a **Progress** timeline at the bottom with a **Compare with now** view, which made it trivial to watch the hand-drawn animation evolve frame by frame.

![Antigravity Swarm Overview Progress timeline comparing animation frames](/img/antigravity-visualizations/swarm-overview-progress.png)

### Board and Members: Who Owns What

Switch to **Board** when you want to read the exact chronological conversation between agents.
Every worker's brief (what files it owns, what it must not touch, and what "done" looks like) is posted publicly here, followed by hand-offs, questions, and verification reports.

![Antigravity Swarm Board tab showing coordinator briefs with @mentions](/img/antigravity-visualizations/swarm-board.png)

The **Members** tab shows every agent's current state, which model it runs on, and its latest message: **Active** (currently thinking or calling tools), **Standing By** (asleep at zero token cost), and **Retired** once its piece of work has landed.

![Antigravity Swarm Members tab showing coordinator, active, standing by, and retired workers](/img/antigravity-visualizations/swarm-members.png)

### Graph: The Hive View and Time-Travel Replay

My favorite view for checking progress at a glance is the **Graph** tab in **Hive** mode.
The coordinator sits in the center hexagon surrounded by task-group hexagons holding the worker bees.
Blue arcs light up when messages fly between the coordinator and workers, dashed yellow arrows show waiting dependencies, and hexagon borders turn green as groups finish (`7 of 8 done`, with retired workers dimmed out).

![Antigravity Swarm Graph Hive view showing 7 of 8 tasks done](/img/antigravity-visualizations/swarm-graph-live.png)

Even better, the timeline scrubber at the top (`59 of 75`, `74 of 75`) lets you replay the swarm step by step.
Clicking back to an earlier event shows both the graph state at that exact timestamp and the corresponding board post right underneath it, which is handy when you walk away for an hour and want to reconstruct how the team reached a decision.

![Antigravity Swarm Graph Hive view scrubbed back to step 59 of 75 with the matching board post](/img/antigravity-visualizations/swarm-graph-replay.png)

## Custom Visualizations with /generative_ui

Swarm gives you built-in visibility into multi-agent runs, while **`/generative_ui`** lets you ask the agent to build a custom interactive UI for whatever problem you are looking at right now.

When you invoke `/generative_ui` in the Antigravity App, the agent runs a built-in skill and writes a self-contained HTML artifact styled with Tailwind CSS and Antigravity's theme variables (matching your light or dark mode).
Compact widgets (up to ~500 pixels tall) embed inline right inside the chat conversation, while larger dashboards open as standalone artifacts in the side panel.
Because it is backed by a skill, the agent can also trigger it on its own when you ask for a chart or an interactive diagram without typing the slash command explicitly.

There are a few clear boundaries to keep in mind:

- Widgets run in a sandboxed iframe with no external scripts allowed besides Tailwind CSS, so charts and diagrams are drawn with HTML, SVG, or `<canvas>`.
- `/generative_ui` is only supported in the Antigravity App (the Antigravity CLI cannot render HTML widgets).
- By default, a widget captures a point-in-time snapshot from when the agent built it, unless you wire it to poll a local state file or an API.

Here are six concrete visualizations I built across my recent projects, from live progress monitors to cost charts and hardware tools.

### 1. Live Progress of Long-Running Integration Tests

While updating the `langchain4j-google-genai` module to `gemini-3.8-flash` back in the day, I needed to run the full Maven Failsafe suite: 211 integration tests across 14 test classes hitting the live Gemini API.
Instead of staring at scrolling Maven output in a terminal, I asked for a live tracker:

```text
/generative_ui show me a live progress bar of the ongoing run of
integration tests
```

Antigravity built `it-progress.html` inline in the chat and launched a tiny background Python log watcher (`watch_it.py`) that tailed the Failsafe log every 1.5 seconds, updating the overall progress bar and each test class row (`ChatModelIT`, `StreamingChatModelIT`, `AiServiceWithToolsIT`, and the rest) with test counts and elapsed durations.

![Live progress tracker widget for 211 Maven Failsafe integration tests in langchain4j-google-genai](/img/antigravity-visualizations/it-progress.png)

### 2. Batch Testing 28 Apache Groovy 6 Scripts Live

When [Apache Groovy 6.0](https://groovy-lang.org/releasenotes/groovy-6.0.html) came out, I put together a [deck](https://glaforge.dev/groovy6showcase/) and a set of 28 code examples (21 slide snippets and 7 full scripts, including 9 that fetch extra modules with `@Grab`) and wanted to re-verify every single one against a live [Groovy Web Console](https://groovyconsole.dev/#ohd6eexr8A) (`GWC`) Cloud Function endpoint.
I combined `/goal` and `/generative_ui` in one prompt:

```text
/goal Batch test again all the snippets, and check that there's no
compilation error or execution error and /generative_ui display a
live UI showing the ongoing script execution and their outcomes
(whether they compile and run without errors)
```

The resulting inline runner tracked compile count, run count, error count, and cumulative API latency (`GWC: 13,915 ms`), with filter tabs (`All Suite`, `Slide Snippets`, `Full Scripts`, `With @Grab`), per-script timings, a live console output inspector, and `Replay` / `Run All Live` controls.

![Interactive Apache Groovy 6.0 live batch test runner widget executing 28 scripts](/img/antigravity-visualizations/groovy6-batch-runner.png)

### 3. Monitoring a 4.5-Hour Firestore Backfill of 710+ Stories

In [reviving my AI sci-fi story agent]({{< ref "/posts/2026/11/23/reviving-my-sci-fi-story-agent-with-consistent-characters-and-narrative.md" >}}), I upgraded the pipeline with a Story Bible, style-chained character sheets, and `gemini-decision-1` as a multimodal judge.
After that, I wanted to backfill the entire existing archive of 710 stories in Firestore to the new 5-act noir graphic-novel format.

We ran the first 100 stories with concurrency 8 and image concurrency 16, then launched the remaining 598 stories at 16 and 16 concurrency.
That main wave took `16,081.7` seconds (nearly 4 hours and 28 minutes, averaging 27 seconds per story).
For a run that long, I wanted a dashboard I could glance at throughout the afternoon:

```text
/generative_ui create a live visualization so that I can see the
ongoing status of the story conversion
```

Instead of tailing a local log file, `story-overhaul-monitor.html` polled the public Firestore REST API directly every 5 seconds.
It displayed four KPI cards (`Catalog Noir`, `Batch`, `Throughput`, `Batch ETA`), a progress bar, a `10x10` hoverable grid of the 100-story batch queue, and a live feed of newly converted stories (reaching `713 / 713` once subsequent daily stories ran).

![Live Firestore-polled conversion monitor for the 710+ short-genai-stories overhaul](/img/antigravity-visualizations/story-overhaul-monitor.png)

### 4. Breaking Down Multi-Model LLM Costs Over Time

My [short-genai-stories](https://github.com/glaforge/short-genai-stories) agent mixes several models per story: text generation, image generation, and a judge model selecting the best panels.
In a follow-up session, I asked Antigravity to estimate the per-story API cost across the project's git history from January 2025 to November 2026.
After generating a static sketchnote first, I realized an interactive chart would answer my real question much faster (notice I didn't even type `/generative_ui` here; the skill triggered automatically):

```text
Generate a stacked area chart showing cost over time, 
but splitting the cost in bands: 
1) judge cost, 
2) text generation cost, 
3) image generation cost.
```

That produced `cost-stacked-area.html`, plotting the four milestones:

| Milestone | Models | Judge | Text | Image | Total / Story |
| :--- | :--- | ---: | ---: | ---: | ---: |
| **Jan 2025** (Initial) | `gemini-2.0-flash-exp` + `imagen-3` | \$0.0027 | \$0.0015 | \$0.6000 | **\$0.60** |
| **Sep 2025** (Pro + Ultra) | `gemini-2.5-pro` + `imagen-4-ultra` | \$0.0563 | \$0.1079 | \$1.2000 | **\$1.36** |
| **Jul 2026** (Gemini API) | `gemini-flash-latest` + `3.1-flash-image` | \$0.0100 | \$0.0270 | \$1.3420 | **\$1.38** |
| **Nov 2026** (Revival) | `gemini-4-hydrogen` + `nano-banana-2.1` + `gemini-decision-1` | \$0.0024 | \$0.1757 | \$0.9606 | **\$1.14** |

Because image generation dominates the total bill, the judge and text bands look like thin slivers at the bottom when everything is visible.
Clicking the `3. Image generation` pill hides that series and dynamically rescales the Y-axis so you can inspect the judge and text costs clearly, and the `Calendar time` / `Even steps` toggle lets you switch between real dates and evenly spaced milestones.

![Interactive stacked area chart breaking down per-story LLM costs across judge, text, and image generation](/img/antigravity-visualizations/story-cost-stacked-area.png)

### 5. Building Throwaway Mini-Tools: Pixoo 64 Pixel Fonts

Generative UI is also great for building tiny single-purpose developer tools you would never bother maintaining as a separate web app.
While working on [jixoo](https://github.com/glaforge/jixoo), my CLI and library for the Divoom Pixoo 64 LED matrix display, I wanted to see what all of the device's built-in pixel fonts actually looked like before picking one.

```text
/generative_ui download all the fonts and show me specimens of all
the existing fonts, so that I can type my own text and see the
result.
```

Antigravity fetched the full catalog of 256 fonts and built `pixoo64_font_specimens.html`.
At the top, I can type any text (such as `Antigravity`), pick an LED color, toggle LED grid baffles and shadow masks, and filter by character support or font size.

![Pixoo 64 Font Specimen Explorer controls, color picker, and category filters](/img/antigravity-visualizations/pixoo-font-controls.png)

Below the controls, every matching font renders live on a simulated LED matrix grid, showing right away which fonts support full strings, which ones only cover digits, and how `5x5` vs. `7x9` matrices crop longer words.

![Pixoo 64 Font Specimen Explorer rendering Antigravity across pixel font matrices](/img/antigravity-visualizations/pixoo-font-specimens.png)

### 6. Mapping Hardware Storage and Agent Log Pipelines

Finally, `/generative_ui` is a quick way to verify your mental model of an unfamiliar codebase, API, or file format.

When reverse-engineering how Divoom's cloud gallery interacts with the Pixoo 64's local memory, I asked Antigravity (:fr: in French, sorry) for a storage diagram:

```text
/generative_ui fais moi un diagramme pour mieux comprendre tout cela,
où est stocké quoi, etc
```

Seeing the three-column diagram (`Cloud Divoom`, `Contrôleurs`, `Pixoo 64 Physique`) alongside the `Cycle de vie (GIF -> Pixoo)` and `Comparatif Stockage` tabs immediately surfaced a misunderstanding in the first draft: it originally said `3 animations max` on the device, whereas the Pixoo actually has 3 playlist slots holding up to 32 animations total in flash.
Spotting that visually took two seconds, and the agent corrected both the diagram and the note at the bottom.

![Interactive architecture diagram mapping Divoom Cloud storage, controllers, and Pixoo 64 flash slots](/img/antigravity-visualizations/pixoo-storage-architecture.png)

I used the same approach when studying Antigravity's own `transcript.jsonl` event log while building the [Antigravity Brain Visualizer]({{< ref "/posts/2026/06/11/antigravity-brain-visualizer.md" >}}):

```text
/generative_ui create a visualization of the flow of elements in
transcript.jsonl
```

Clicking any of the five stages (`User Input`, `System Injection`, `Model Planner`, `Tool Result`, `Final Delivery`) or switching to `Schema & Fields` and `Step Inspector` made the JSONL schema much faster to grasp than reading raw log lines.

![Interactive 5-stage lifecycle diagram of Antigravity transcript.jsonl events](/img/antigravity-visualizations/transcript-flow.png)

## Wrap-up

Coming back to Emmanuel's comment at the meetup: once coding agents run longer tasks or split work across multiple threads, **staring at a wall of scrolling text stops scaling**.
Having the **Swarm UI to track a team of workers** (and replay their Hive graph afterward), paired with **`/generative_ui`** to spin up live test runners, Firestore monitors, cost breakdowns, or font explorers in 30 seconds, **turns agent observability into something visual and tailored to the task at hand**.

> [!TIP]
> You can read more in the [Antigravity Swarm docs](https://antigravity.google/docs/swarm) and the [Generative UI docs](https://antigravity.google/docs/commands/generative-ui/).
> If you have built custom visualizations to monitor your own coding agents, I would love to hear what worked best for you.
