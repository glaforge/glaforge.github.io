---
title: "Reviving My AI Sci-Fi Story Agent: Consistent Characters and Decision-Model-as-a-Judge"
description: "How I modernized short-genai-stories to Java 25, the official google-genai SDK, Gemini 4, Nano Banana 2.1, and Gemini Decision 1, and redesigned the agentic workflow with a Story Bible, style-chained character sheets, and a reference-aware multimodal LLM-as-a-Judge."
date: 2026-11-23T09:00:00+01:00
image: /img/short-ai-stories-v2/short-genai-stories-v2-banner.jpg
tags:
  - java
  - ai-agents
  - generative-ai
  - gemini
  - nano-banana
  - gemini-decision-1
  - llm-as-a-judge
  - cloud-run
similar:
  - "posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories.md"
  - "posts/2025/01/31/a-genai-agent-with-a-real-workflow.md"
  - "posts/2026/11/10/restoring-lecture-slides-with-prompt-benchmarking-and-llm-as-judge.md"
---

In January 2025, I built **[Short GenAI Stories](https://short-ai-story.web.app/)**, an automated AI agent that generates and illustrates a 5-chapter sci-fi story every night at midnight UTC (see [the original Java + LangChain4j post]({{< ref "/posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories.md" >}}) and [the Cloud Workflows variant]({{< ref "/posts/2025/01/31/a-genai-agent-with-a-real-workflow.md" >}})).

Nearly two years later, its dependencies and Imagen 3 were outdated, the stories drifted into repetitive AI tropes, and independent `"A cartoon of..."` prompts meant zero visual continuity between chapters.
With [Google Antigravity](https://antigravity.google/), I modernized the Java 25 stack and redesigned the agent around a **Story Bible**, **in-memory style-chained character sheets**, and **Gemini Decision 1** as a multimodal LLM-as-a-Judge (or should I say a Decision-Model-as-a-Judge?).

> [!NOTE]
> **Tech stack at a glance:**
> - **Live web app**: [short-ai-story.web.app](https://short-ai-story.web.app/) · **Code**: [github.com/glaforge/short-genai-stories](https://github.com/glaforge/short-genai-stories)
> - **Runtime & SDK**: **Java 25** (Virtual Threads) + `com.google.genai:google-genai:2.4.0`
> - **Models**: **Gemini 4 Hydrogen** (`gemini-4-hydrogen`), **Nano Banana 2.1** (`gemini-nano-banana-2.1`), **Gemini Decision 1** (`gemini-decision-1`)
> - **Infra**: **Jib** + **Cloud Run Jobs** (`2Gi` RAM, `2` vCPU) + Cloud Scheduler + Firestore + Cloud Storage + Firebase Hosting (JS SDK 13.4)

## Stack & Cloud Architecture

I upgraded [the story generator agent class](https://github.com/glaforge/short-genai-stories/blob/main/fictionStoryAgent/src/main/java/storygen/ExplicitStoryGeneratorAgent.java) from LangChain4j + Vertex AI to **Java 25** and the official `google-genai` SDK (`2.4.0`), using `Schema` for structured JSON outputs and Virtual Threads (bounded by `Semaphore(2)` for chapters and `Semaphore(4)` for images) on a `2Gi` Cloud Run Job.
I also replaced `Dockerfile` + Cloud Build with dockerless **Jib** builds (`just deploy-job`), and kept all candidate images in RAM so only the 5 winning `.jpg` panels are uploaded to Cloud Storage once all chapters succeed.

> [!NOTE]
> **Why move away from LangChain4j for this overhaul?**
> Its image generation API currently lacks a signature for passing more than one reference image, which I need when grounding a chapter panel on multiple character sheets at once. I may well move back to LangChain4j once it evolves to support this kind of multi-image conditioning.

![Cloud and Firebase architecture diagram](/img/short-ai-stories-v2/cloud-architecture.svg)

## The 5-Stage Agentic Workflow

I kept the **explicit workflow** (code-driven orchestration) for predictability and parallelism, expanding it into five stages:

![Story generator agent 5-stage agentic workflow](/img/short-ai-stories-v2/story-agent-v2-workflow.svg)

1. **Plan (`StoryBible`)**: `loadRecentStoryHistory()` reads the last 15 Firestore stories to avoid repeating genres or titles, pairs random tone and POV seeds, and calls `gemini-4-hydrogen` to output a 5-act `StoryBible` (cliché names banned, `2–4` cast profiles with turnaround `visualDescription`s, `worldVisualMotifs`, and per-chapter `characterIdsInScene`).
2. **Cast in RAM**: `generateCharacterSheetsInMemory()` generates `2` candidate `1:1` sheets per character with `gemini-nano-banana-2.1` and picks the best via `gemini-decision-1`. Character #1's winning sheet becomes `styleAnchorSheet` and is passed as a style-only reference to Characters #2..#4 so the whole cast shares one artist's hand.
3. **Sequential Prose + Editor**: `draftAndEditChapters()` writes Chapters 1–5 sequentially with the `StoryBible` and all prior chapters in context, then runs `polishStoryManuscript()` to vary chapter openings and tighten dialogue.
4. **Parallel Panels + Multimodal Judge**: Virtual Threads generate a `16:9` scene prompt per chapter, attach only the active characters' `1:1` sheets + the shared `GRITTY_NOIR_INK_STYLE` constant, and render `4` candidate `16:9` panels in memory.
5. **Deferred Store**: Uploads the 5 winning `.jpg`s to Cloud Storage and writes the `Story` document to Firestore.

## Visual Consistency & Gemini Decision 1

![How visual consistency and the multimodal LLM-as-Judge work together](/img/short-ai-stories-v2/character-consistency-and-judge.svg)

Instead of asking a chat model for a `{"bestImageIndex": k}` JSON guess, `evaluateBestCandidateWithDecisions()` calls **[Gemini Decision 1]({{< ref "/posts/2026/11/13/multimodal-decisions-with-gemini-decision-1-and-the-interactions-java-sdk.md" >}})** (`client.decisions.create(...)`) with the chapter prose, scene prompt, canonical `1:1` character sheets, and all candidate panels:

- A **`ChoiceQuestion`** (`best_candidate`) scores character likeness, gritty noir ink/halftone fidelity, and storytelling (`P(best)`).
- Per-candidate **`NoulQuestion`s** (`has_text_i`) estimate the probability `P(text)` of unwanted speech bubbles, captions, or borders.

The agent picks the highest-`P(best)` candidate below `MAX_ALLOWED_TEXT_ARTIFACT_PROB`, or falls back to maximizing `P(best) * (1 - P(text))`.

## Live Example: *Behind the Painted Noon* (`DYSTOPIA`)

Read the full story on [short-ai-story.web.app](https://short-ai-story.web.app/). Since character sheets live only in RAM during a Cloud Run run, I re-generated the three `1:1` sheets below with the exact same prompt and style-chaining logic:

| Maren Solis | Tomasz Kowalski | Ines Varga |
| :---: | :---: | :---: |
| ![Maren Solis character sheet](/img/short-ai-stories-v2/maren-sheet.jpg) | ![Tomasz Kowalski character sheet](/img/short-ai-stories-v2/tomasz-sheet.jpg) | ![Ines Varga character sheet](/img/short-ai-stories-v2/ines-sheet.jpg) |

Expand any section below to inspect the exact prompts and instructions used across the pipeline:

<details>
<summary>View Shared House Style (GRITTY_NOIR_INK_STYLE)</summary>

```text
Gritty sci-fi noir graphic novel illustration. Bold expressive
sumi-brush ink linework, heavy dramatic black spot-shadows, stark
chiaroscuro contrast, subtle vintage halftone dot screening, moody
palette of deep prussian blue and charcoal black accented by glowing
electric cyan and warm amber rim-lighting. Edge-to-edge full-bleed
comic panel, no speech bubbles, no text, no captions, no borders.
```

</details>

<details>
<summary>View Story Bible — System Instruction & User Prompt</summary>

```text
System Instruction:
You are an award-winning speculative fiction showrunner and graphic
novel creative director.
Design a cohesive, original 5-chapter short story bible before any
prose is written.

Creative guardrails:
- Structure the 5 chapters as a tight 5-act dramatic arc:
  1. Hook & Inciting Rupture (plant a concrete detail or mystery that
     pays off in Chapter 5)
  2. Rising Complication (initial plan fails or deepens the mystery;
     raise personal stakes)
  3. Midpoint Reversal / Revelation (new truth shifts the conflict's
     direction)
  4. Crisis & Costly Choice (the darkest hour; no easy way out)
  5. Climax & Resonant Payoff (earned resolution that pays off Chapter
     1 without preachy summary monologue)
- Cast size MUST be between 2 and 4 primary characters (adult
  characters, or distinct non-human/robotic entities).
- Give every character a hyper-specific `visualDescription` suitable
  for a comic artist's character turnaround sheet:
  exact age/build, facial structure, hair, scars/glasses/cybernetics,
  and specific clothing/uniform/suit silhouette and signature gear.
  Even if a character is an AI or alien, give it a concrete physical
  chassis, avatar, or form so it can be drawn consistently.
- AVOID overused AI-fiction cliché names and tropes: DO NOT use names
  like Lyra, Elara, Kael, Vance, Voss, Aria, Thorne,
  Aethelgard, Neo-Geneva, Nexus, or "Unit AR-7 / 734". Invent
  grounded,
  culturally varied, memorable names and fresh premises.
- `synopsis` must be an intriguing 1-2 sentence hook (no spoilers for
  Chapter 5).
- In each chapter's `characterIdsInScene`, list ONLY the `id`s of cast
  characters visibly present in that chapter's `keyVisualMoment`.

User Prompt:
Subgenre: <StoryType.explanation>
Target tone: <random NARRATIVE_TONE>
Target POV: <random NARRATIVE_POV>
Visual art style for illustrations: <GRITTY_NOIR_INK_STYLE>
Recent story titles to avoid echoing in title, theme, or premise:
<last 15 titles from Firestore>
```

</details>

<details>
<summary>View Character Sheet Prompt & Gemini Decision 1 Judge</summary>

```text
Generation Prompt (Character #1's sheet attached as style ref for
#2..#N):
Art style: <GRITTY_NOIR_INK_STYLE>

Create a clean character concept reference sheet for <name>:
<visualDescription>.
Composition: Show both a full-body standing pose on the left and a
closer chest-up expressive portrait on the right, against a plain,
uncluttered muted slate-grey backdrop so silhouette, face, and outfit
details read clearly.
Keep lighting dramatic with crisp black ink shadows and subtle
cyan/amber rim light, strictly no text, no labels, no nameplates, no
borders.

ChoiceQuestion ("best_candidate"):
Select which character concept sheet (Candidate 0 through Candidate
N-1) is the clearest, most faithful reference sheet for <name>.
Prefer the candidate showing full-body and portrait views against a
plain uncluttered slate-grey backdrop, matching the character's exact
physical traits and outfit in gritty noir ink-and-halftone comic art,
with zero visible text, labels, nameplates, or borders.

NoulQuestion ("has_text_i"):
Does Candidate i contain any visible speech bubbles, dialogue
captions, written words, nameplates, or outer comic page borders?
```

</details>

<details>
<summary>View Chapter Drafter & Literary Editor System Instructions</summary>

```text
Chapter Drafter:
You are an acclaimed speculative fiction author writing "<title>".
Narrative voice & POV: <narrativeVoice>
Central arc & payoff: <centralConflictAndPayoff>

Writing craft rules:
- Show, don't tell: dramatize scenes through concrete physical action,
  crisp subtext-laden dialogue, and tactile sensory details.
- Avoid bloated "purple prose", repetitive metaphors, or starting
  every chapter with weather/machinery humming.
- Keep character voices, clothing, and physical details strictly
  faithful to the Story Bible.
- Write roughly 350–550 words (at least 18 sentences), formatted into
  natural, readable paragraphs separated by blank lines (\n\n).

Literary Editor:
You are a sharp literary fiction editor polishing a completed
5-chapter sci-fi story.
Your goals:
1. Preserve the plot, character details, key visual moments, and exact
   5-chapter count.
2. Vary chapter openings so consecutive chapters never open with the
   same sentence structure.
3. Replace any generic AI clichés or repetitive phrasing with crisp,
   concrete prose and natural dialogue.
4. Ensure smooth transitions across acts and a resonant final
   image/line in Chapter 5.
5. Keep each chapter formatted into clear paragraphs separated by
   blank lines (\n\n).
```

</details>

<details>
<summary>View Scene Prompt Writer & Multimodal Chapter Judge (Gemini Decision 1)</summary>

```text
Scene Prompt Writer:
You are a master sci-fi graphic novel art director writing a single
widescreen (16:9) panel prompt for the Gemini Nano Banana 2.1 image
model.

Instructions:
- Describe ONE dramatic, cinematic moment from the chapter (camera
  angle, framing, character action/pose, environment, and lighting).
- Explicitly name and describe the physical traits and outfit of each
  active character in the scene so the image model binds them to their
  attached character reference sheets.
- Incorporate the story's recurring world visual motifs for
  cross-chapter environmental continuity.
- Specify a purely visual scene with NO speech bubbles, NO text, NO
  captions, and NO comic page borders.
- Do NOT include Midjourney flags. Return a JSON object with a single
  property "imagePrompt".

ChoiceQuestion ("best_candidate"):
You are a graphic novel art director evaluating Candidate 0 through
Candidate N-1. Select the single best widescreen illustration based
on:
(1) Character consistency: faces, hair, silhouettes, and outfits
    strictly match the canonical character reference sheets;
(2) Art style fidelity: gritty noir sumi-ink brush linework, stark
    black spot-shadows, subtle halftone dots, and cyan/amber rim
    lighting with zero speech bubbles, text, or comic borders;
(3) Narrative storytelling: composition accurately dramatizes the
    chapter content and target scene prompt.

NoulQuestion ("has_text_i"):
Does Candidate i contain any visible speech bubbles, dialogue
captions, written words, nameplates, or outer comic page borders?
```

</details>

### The 5 Winning Panels

Notice how Maren's temple scar, loupe, and pocket barometer; Tomasz's tunic, amber glasses, and prosthetic fingers; and Ines's braid, cyan neck scars, twin canisters, and crowbar carry cleanly across all five chapters:

#### Chapter 1: *Static in the Clover*
![Chapter 1: Static in the Clover](/img/short-ai-stories-v2/ch1.jpg)


#### Chapter 2: *Pipework and Perfume*
![Chapter 2: Pipework and Perfume](/img/short-ai-stories-v2/ch2.jpg)


#### Chapter 3: *The Unpainted Hull*
![Chapter 3: The Unpainted Hull](/img/short-ai-stories-v2/ch3.jpg)


#### Chapter 4: *Blackout Quota*
![Chapter 4: Blackout Quota](/img/short-ai-stories-v2/ch4.jpg)


#### Chapter 5: *Raw Daylight*
![Chapter 5: Raw Daylight](/img/short-ai-stories-v2/ch5.jpg)


## Wrap-up

Having consistent imagery across chapters was a common ask since the first version, and style-chained character reference sheets finally make it work cleanly in this revival.
Moving from a classic LLM-as-a-Judge to a **Decision-Model-as-Judge** with `gemini-decision-1` is another key change, giving calibrated probabilities for both visual quality and text-artifact filtering.
On top of that, **Gemini 4 Hydrogen** and **Nano Banana 2.1** are real steps up compared to the previous generation of models, both for narrative cohesion and graphic-novel art.

I also refreshed the web frontend (`public/`) into a dark-mode graphic-novel reader with act navigation, an archive drawer, a random-issue picker, and reading progress to match the noir ink aesthetic.
Read tonight's story at [short-ai-story.web.app](https://short-ai-story.web.app/) or browse the code on [GitHub](https://github.com/glaforge/short-genai-stories).
