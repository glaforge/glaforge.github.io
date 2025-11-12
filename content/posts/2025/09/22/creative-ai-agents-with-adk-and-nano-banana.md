---
title: "Creative Java AI agents with ADK and Nano Banana 🍌"
date: 2025-09-22T16:51:37+02:00
image: /img/adk/energy-drink.png
tags:
  - java
  - agent-development-kit
  - generative-ai
  - ai-agents
  - large-language-models

similar:
  - "posts/2025/09/09/calling-nano-banana-from-java.md"
  - "posts/2025/05/20/writing-java-ai-agents-with-adk-for-java-getting-started.md"
  - "posts/2023/12/13/get-started-with-gemini-in-java.md"
---

Large Language Models (LLMs) are all becoming _"multimodal"_.
They can process text, but also other _"modalities"_ in input, like pictures, videos, or audio files.
But models that output more than just text are less common...

Recently, I wrote about my [experiments with **Nano Banana**]({{< ref "/posts/2025/09/09/calling-nano-banana-from-java.md" >}}) :banana: (in Java),
a **Gemini chat model flavor that can create and edit images**.
This is pretty handy in particular for interactive creative tasks, like for example a marketing assistant that would help you design a new product,
by describing it, by futher tweaking its look, by exposing it in different settings for marketing ads, etc.

The _"Nano Banana"_ :banana: model we'll use today is the nickname for the popular `gemini-2.5-flash-image-preview` model.
It's not just a _conversational_ AI; it's a creative partner that can generate and edit images right within a chat session.
Not only it generates text, but also images.

And today, we're going to explore how to configure and use this model inside an AI agent developed with
[ADK](https://google.github.io/adk-docs/) (**Agent Development Kit**, and especially [its Java version](https://github.com/google/adk-java)).
We'll focus on a key piece of the puzzle: processing the image output from the model and saving it for later use.

## Meet the `NanoBananaCreativeAgent`

Let's look at some code. Our example is the following `NanoBananaCreativeAgent` class.
Its goal is to act as a creative assistant, using the :banana: _"Nano Banana"_ model to handle image-related tasks based on user prompts.

> **Remark:** Maybe in a later post, we'll see how to create a more complete agent like the marketing scenario I suggested in introduction,
> but for now, I want to highlight **how to configure the model and save its output** for later use.

Here’s how we define the agent using ADK's `LlmAgent.builder()`:

```java
import com.google.adk.agents.BaseAgent;
import com.google.adk.agents.LlmAgent;
import com.google.genai.types.Content;
import com.google.genai.types.Part;
import io.reactivex.rxjava3.core.Maybe;
import java.util.List;

public class NanoBananaCreativeAgent {
    public BaseAgent getAgent() {
        return LlmAgent.builder()
            .name("nano-banana-creative-agent")
            .model("gemini-2.5-flash-image-preview") // 🍌
            .instruction("""
                You are a creative assistant, and you help users
                create new images or edit existing ones, using the
                Nano Banana model (aka Gemini 2.5 Flash Image)
                """)
            .afterModelCallback((callbackContext, llmResponse) -> {
                // We'll zoom in on this part next!
            })
            .build();
    }
    // ... main method to run the agent and other helpers
}
```

There are two important lines here for enabling image generation:

1.  `.model("gemini-2.5-flash-image-preview")`:
    This tells the ADK to route requests to the specific model endpoint capable of generating and editing images.
2.  `.instruction(...)`:
    The instruction primes the model, letting it know its role is to be a creative assistant focused on image tasks.

## Handling the image response with a callback

When you ask the model to _"create an image of a cat wearing a party hat,"_ it doesn't return a URL or a file path.
It returns the image data directly in its response, typically as a `Part` containing binary data, in a big byte array.

> **Note:** The model usually replies with some text to introduce the image, along with the image.
> But sometimes, it can also return text-only, in particular when it asks for clarifications for generating the requested image.
> So it's important to check that an image is indeed present in the output of the model.
> Also, when the output contains an image, there's only a single one.
> It never generates more than one — which means I could use a `findFirst()` instead of a `forEach()` in the implementation below.

How do we capture and use this binary data?
This is where ADK's `afterModelCallback` becomes handy.
It's a **hook** that lets you execute custom Java code **immediately after the LLM sends its response**, but before the agent's turn is finished.

Let's look at our callback code:

```java
.afterModelCallback((callbackContext, llmResponse) -> {
    llmResponse.content() // 1. Let's find the image part!
        .flatMap(Content::parts)
        .stream()
        .flatMap(List::stream)
        // Filter parts containing image content
        .filter(part -> part.inlineData().isPresent())
        .forEach(part -> {
            // 2. Save the image as an artifact for the pipeline
            callbackContext.saveArtifact("rendered-image", part);

            // 3. Potentially save the image as a file elsewhere
            Blob blob = part.inlineData().get();
            byte[] imageBytes = blob.data().get();
            String mimeType = blob.mimeType().get();
        });
    // Returning empty means not altering the agent's response
    return Maybe.empty();
})
```

Let's break down what's happening in this lambda:

1.  **Find the image part**: We use a Java Stream to navigate the `llmResponse` structure.
    A response can have zero or one `Content` object (an `Optional`), with an optional list of `Part`s (which can be _text_, _function calls_, or _inline data_).
    We filter down to find the `Part` that contains `inlineData` — this is our image.

2.  **Save as an artifact**: `callbackContext.saveArtifact("rendered-image", part)` is a key ADK feature.
    It saves the raw image `Part` into the agent's artifact registry under the name `rendered-image`.
    This makes the generated image available to other agents or tools that might run later in a more complex pipeline.

3.  **Do something with the image bytes**: Potentially, instead of (or in addition to) saving the image as an artifact,
    you can decide to do something yourself with the bytes of the image and its MIME type,
    like saving that file directly to the file system if you're building some kind of command-line based agent tool.

## Going further: building a creative marketing agent

This simple agent is the building block for a more complex creative workflow.
Imagine a _"Creative Marketing Agent"_ built as a pipeline of agents.

- **Step 1 — Product ideation.** A user interacts with our `NanoBananaCreativeAgent`.
  They prompt: _"Generate an image of a new energy drink can called 'Cosmic Charge'. It should be dark blue with a glowing yellow lightning bolt."_

- **Step 2 — Image generation & persistence.** Our agent calls the model to generate the image.
  The user iterates potentially a few rounds to further improve the rendered picture, thanks to Nano Banana's editing capabilities.
  The `afterModelCallback` we just analyzed fires, and `cosmic-charge.png` is saved to the file system,
  and/or the image is also saved as an artifact in the agent's session.

- **Step 3 — Further asset generation.** A second agent in the pipeline
  (via an ADK `SequentialAgent` that we [explored in a previous article]({{< ref "/posts/2025/07/24/mastering-agentic-workflows-with-adk-sequential-agent/" >}})), a `MarketingAssetAgent`, is triggered.
  Its instruction might be: _"You will be given a product image.
  Your job is to create a marketing banner for social media."_
  This agent can now be given a new prompt like, _"Take the product image from the 'rendered-image' artifact and place it on a background of a starry nebula.
  Add the text 'Feel the Power of the Cosmos!'"._
  Or you could also have a dedicated video generation agent,
  using the [Veo 3](https://gemini.google/overview/video-generation/) video model,
  to generate a video illustrating the product in action, like someone drinking this fancy energy drink.

By saving the image to a file or as artifact, thanks to the callback trick, we've successfully passed a complex, generated asset from one stage of our agentic workflow to the next.

## Conclusion

Integrating advanced image generation and editing into your Java agentic applications is no longer science-fiction.
With the **Agent Development Kit** for Java, with just a few lines of hook code,
you can configure an agent to use powerful multimodal models like **Nano Banana**.
By leveraging the `afterModelCallback` in your ADK agent definition, you gain precise control over the model's output,
allowing you to process, save, and chain creative tasks together to build more useful and creative agents.

So go ahead, start experimenting, and see what amazing creative workflows you can build!
And, of course, be sure to read my series of [articles on ADK for Java]({{< ref "/tags/agent-development-kit/" >}})!
