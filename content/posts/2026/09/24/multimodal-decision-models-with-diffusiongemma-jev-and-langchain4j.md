---
title: "Multimodal Decision Models: From DiffusionGemma and Jev to LangChain4j"
description: "How I adapted Matt Mastracci's djev and Daniel Lee's Cloud Run deployment to run multimodal visual classification on Blackwell GPUs, and proposed multimodal extensions to LangChain4j's StructuredDecisionModel."
date: 2026-09-24T17:45:00+02:00
tags:
- generative-ai
- gemma
- langchain4j
- java
- cloud-run
- machine-learning
image: /img/gemma/djev-multimodal-langchain4j.jpg

similar:
  - "posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories.md"
  - "posts/2026/07/25/running-gemma-4-locally-on-mac-benchmarking-qxotic-jinfer-llama-cpp-mlx-and-connecting-java-25-with-langchain4j.md"
  - "posts/2024/07/11/text-classification-with-gemini-and-langchain4j.md"
---

Most of our conversations around Large Language Models focus on generative chat: you give the model a prompt, and it outputs a sequence of tokens autoregressively.

Recently, [Typesafe AI](https://typesafe.ai/) introduced a different paradigm called **System 1 models**, embodied by **[Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)**. Rather than generating free-form prose token by token, a Jev-style model acts as a high-speed, deterministic decision maker. Given an input state and a series of discrete questions, it runs in a single forward pass and outputs calibrated probability distributions for each question:

- **Choice:** Multi-class classification picking the most likely category with softmax confidence scores.
- **Noul:** A binary true/false check producing a calibrated certainty score between 0.0 and 1.0.
- **Score:** Regression or ordinal rating along a continuous scale.

![System 1 Decision Questions: Choice, Noul, and Score evaluated in parallel](/img/gemma/jev-question-types.svg)

Over the past few days, I went down a fascinating rabbit hole with Antigravity: running Jev-style models on Google Cloud Run, discovering that I could turn them into zero-shot visual classifiers, and bringing that multimodal capability to Java via LangChain4j.

Here is the story and the thought process behind what I explored and built.

---

## The Open-Source Foundation: DiffusionGemma and djev

Standard LLMs are autoregressive, generating output token by token. Diffusion language models, by contrast, decode in parallel or across fixed diffusion steps.

[Matt Mastracci](https://github.com/mmastrac) created **[djev](https://github.com/mmastrac/djev)**, an implementation of the Jev decision architecture built on top of Google's **DiffusionGemma** model. Because DiffusionGemma uses diffusion-based generation rather than typical autoregressive decoding, Matt adapted it to evaluate choice and decision heads directly. Matt also submitted a pull request to vLLM ([vllm#57250](https://github.com/vllm-project/vllm/pull/57250)) to enable native support for DiffusionGemma and djev inference inside the vLLM engine.

If you want a clear technical breakdown of how DiffusionGemma and Jev operate under the hood, my Google Cloud colleague Karl Weinmeister published an excellent guide and video walkthrough:
- Article: [How to build a Jev-style classifier with DiffusionGemma and vLLM](https://medium.com/google-cloud/how-to-build-a-jev-style-classifier-with-diffusiongemma-and-vllm-ef2e0bfa9ad7)
- Video: [YouTube walkthrough by Karl Weinmeister](https://www.youtube.com/watch?v=G2KtN654HXo)

---

## Deploying on Cloud Run with Blackwell GPUs

Running vLLM with diffusion architectures requires solid GPU hardware. [Daniel Lee](https://github.com/taeold) put together a great recipe in his **[djev-run](https://github.com/taeold/djev-run)** repository, showing how to deploy `djev` on **Google Cloud Run** using NVIDIA RTX PRO 6000 Blackwell GPUs (`nvidia-rtx-pro-6000`).

The beauty of Cloud Run here is economics: with `--min-instances=0`, the container scales to zero when idle. You only pay for GPU compute when actively evaluating decisions.

I followed Daniel's blueprint. I mounted model weights via Cloud Storage and launched `vllm serve` alongside a lightweight FastAPI/ASGI `SystemOneMiddleware` reverse proxy listening on port 8080.

A typical classification request looked like this:

```bash
curl -s -X POST https://<SERVICE_URL>/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Classify: My account was charged twice, I want a refund\nlabel:",
    "steps": 1,
    "questions": [
      {
        "id": "department",
        "type": "choice",
        "choices": [
          ["Billing", "Payments and billing"],
          ["Technical", "Technical support"],
          ["Other", "General inquiries"]
        ],
        "labels": ["Billing", "Technical", "Other"]
      }
    ]
  }'
```

The response came back in ~144 ms with 99.99% probability on `Billing`.

---

## What About Images?

While testing text decisions, a thought occurred: **DiffusionGemma is fundamentally a multimodal model.**

The original Jev design was framed strictly around text states. But DiffusionGemma inherits the SigLIP vision tower (`Gemma4ImageProcessor`), accepting images alongside text tokens. Could I send an image into a Jev-style decision pipeline and perform zero-shot visual classification in a single step?

Daniel's original deployment script had `DISABLE_MM=1` and `language_model_only=True` to minimize cold starts. I wanted to see what would happen if I turned vision back on.

To compare without breaking my text service, I deployed a second Cloud Run service:
1. With the help of Antigravity, I authored a custom startup script (`vision_entrypoint.sh`) that stages `processor_config.json` alongside the safetensors weights.
2. I launched vLLM with multimodal image support enabled: `--limit-mm-per-prompt '{"image": 1}'`.
3. I allocated 1 × NVIDIA RTX PRO 6000 GPU (20 vCPUs, 80 GiB RAM) on Cloud Run, keeping `--min-instances=0`.

I sent a test payload containing a photo of my cat encoded in base64:

```json
{
  "model": "dgemma",
  "images": ["data:image/jpeg;base64,..."],
  "state": "Classify the image:",
  "questions": [
    {
      "id": "animal",
      "type": "choice",
      "choices": [["cat", "Feline"], ["dog", "Canine"]],
      "labels": ["cat", "dog"]
    }
  ]
}
```

The model responded in **129 ms**:
- `animal`: `"cat"` with **99.98%** probability.
- Prompt token count grew from ~104 tokens to ~384 tokens, precisely accounting for the 280 image soft tokens produced by the SigLIP vision encoder.

I tested multiple questions simultaneously on the same picture: species (`cat` vs `dog`), eye color (`blue` vs `green` vs `yellow`), and coat pattern. It evaluated all of them in a single forward pass without generating descriptive text or needing prompt gymnastics.

---

## Bringing Decision Models to LangChain4j

While I was experimenting with Cloud Run, the LangChain4j community was working on adding formal support for decision models.

A pull request was open: [LangChain4j PR #6469](https://github.com/langchain4j/langchain4j/pull/6469). Following discussions in [issue #6468](https://github.com/langchain4j/langchain4j/issues/6468), the community settled on the abstraction name **`StructuredDecisionModel`** (initially called `JudgeModel`).

However, the initial PR design was limited to text:

```java
// Initial text-only shape
StructuredDecisionRequest request = StructuredDecisionRequest.builder()
    .state("Some input text or key-value state")
    .question(...)
    .build();
```

Because of my experiments with the multimodal diffusion model approach, I knew that limiting decision models to text was leaving a nice use case on the table. Vision-language models like DiffusionGemma make visual classification just as straightforward as text classification.

I joined the discussion on PR #6469 and proposed that `StructuredDecisionRequest` should natively support multimodal inputs using LangChain4j's existing `Content` and `ImageContent` primitives:
- A request should accept structured text state, multimodal contents, or both.
- If classifying an image alone, users should not have to supply a dummy text state.
- The interface should provide clean builder shortcuts like `.image(ImageContent)` or `.image(Image)`.

---

## Implementing and Verifying the Multimodal Abstraction

I then branched off LangChain4j (`feature/multimodal-judge-model`) to test this proposal in code.

### The API Design

The resulting `StructuredDecisionRequest` supports text state and multimodal contents interchangeably:

```java
public class StructuredDecisionRequest {
    private final Map<String, Object> state;
    private final List<Content> contents;
    private final Map<String, Question> questions;
    private final StructuredDecisionRequestParameters parameters;
    ...
}
```

I implemented three typed question models conforming to a sealed `Question` hierarchy:
1. `ChoiceQuestion`: takes a list of options with descriptive criteria and returns the winning option with confidence probabilities.
2. `NoulQuestion`: binary question verifying whether a criteria holds true, returning a floating-point score between 0.0 and 1.0.
3. `ScoreQuestion`: ordinal or continuous scale rating against defined levels.

### Live Verification with the Cat Photo

To verify that the implementation worked end-to-end, I wrote an automated integration test calling both of my live Cloud Run instances.

Here is the canonical Java code to evaluate an image using this multimodal `StructuredDecisionModel`:

```java
StructuredDecisionModel visionModel = 
  DjevStructuredDecisionModel.forVision();

Path catImagePath = Paths.get("src/test/resources/cat.jpg");

StructuredDecisionRequest request = StructuredDecisionRequest.builder()
  .image(ImageContent.from(catImagePath, "image/jpeg"))

  // 1. Noul: Is it a cat?

  .question("is_cat", NoulQuestion.builder()
    .instructions("Is the subject in the picture a domestic cat?")
    .criteria(NoulCriteria.from("The image clearly features a domestic cat or kitten."))
    .build())

  // 2. Choice: What eye color?

  .question("eye_color", ChoiceQuestion.builder()
    .instructions("What is the eye color of the cat in the image?")
    .option("blue", OptionCriteria.from("Bright blue, cyan, or azure eyes"))
    .option("green", OptionCriteria.from("Green or hazel eyes"))
    .option("yellow", OptionCriteria.from("Yellow, golden, or amber eyes"))
    .build())

  // 3. Score: How fluffy is the coat?

  .question("fluffiness", ScoreQuestion.builder()
    .instructions("How fluffy is the fur of this cat?")
    .level("short", OptionCriteria.from("Sleek short hair"))
    .level("medium", OptionCriteria.from("Moderately fluffy with ear tufts"))
    .level("extra_fluffy", OptionCriteria.from("Extremely long and voluminous fluffy fur"))
    .build())
  .build();

StructuredDecisionResponse response = visionModel.decide(request);
```

When run against my live service on Cloud Run, the response returned:
- `is_cat` (Noul): **0.9999** (99.99% certainty)
- `eye_color` (Choice): `"blue"` (99.99% confidence)
- `fluffiness` (Score): **1.9987 / 2.0** (categorized as extra fluffy)

All three assessments were computed concurrently in one HTTP request in under 150 milliseconds.

---

## Looking Ahead

Decision models like Jev and djev represent a compelling alternative to autoregressive LLMs when you need fast, deterministic, and probabilistic classifications instead of text generation:
- **Routing & Triage:** Categorizing customer support tickets or routing requests to specific tools.
- **Moderation & Guardrails:** Checking safety policies, toxicity, or PII with explicit probability thresholds.
- **Visual Inspection:** Quality control, object classification, or document triage without prompting an LLM to generate JSON.

With Matt Mastracci's work on djev, vLLM's diffusion support, Daniel Lee's Cloud Run setup on Blackwell GPUs, and my proposed multimodal enhancements to LangChain4j, Java developers will be able to run both text and visual decision workflows with minimal latency and clean, type-safe APIs.
