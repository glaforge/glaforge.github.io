---
title: "Gemini Nano running locally in your browser"
date: 2024-08-07T15:57:33+02:00
image: /img/gemini/mini-bot-laptop-brain.jpg
tags:
  - generative-ai
  - large-language-model
  - gemini
  - chrome

similar:
  - "posts/2025/09/08/in-browser-semantic-search-with-embeddinggemma.md"
  - "posts/2025/11/03/driving-a-web-browser-with-Gemini-Computer-Use-model-in-Java.md"
  - "posts/2025/11/21/gemini-is-cooking-bananas-under-antigravity.md"
---

Generative AI use cases are usually about running large language models somewhere in the cloud.
However, with the advent of smaller models and open models, you can run them locally on your machine,
with projects like [llama.cpp](https://github.com/ggerganov/llama.cpp) or [Ollama](https://ollama.com/).

And what about in the browser?
With [MediaPipe](https://github.com/google-ai-edge/mediapipe) and [TensorFlow.js](https://www.tensorflow.org/js),
you can train and run small neural networks for tons of fun and useful tasks
(like recognising hand movements through the webcam of your computer), and it's also possible to run
[Gemma](https://ai.google.dev/gemma/) 2B and even 7B models.

But there's something interesting cooking these days: **built-in language models in the browser**!

The Chrome developers are working on a new Web API to integrate LLMs in the browser,
and are experimenting with the [Gemini Nano](https://deepmind.google/technologies/gemini/nano/) model
(already integrated in some smartphones like Samsung Galaxy or Google Pixel phones)
inside [Chrome Canary](https://www.google.com/chrome/canary/).

## Getting started with Gemini Nano and Chrome Canary

I'm sure you want to experiment with that too? Let's see how to proceed:

- First of all, you'll need to download [Chrome Canary](https://www.google.com/chrome/canary/)

- In `chrome://flags`, you must **enable** two experiments:

  - `Prompt API for Gemini Nano` and
  - `Enables optimization guide on device`.

- You'll have to restart the browser, after having enabled those two flags.

It may take quite a bit of time to download Gemini Nano (as it's a small model, it takes only around 1.7GB of space, but you'll need about 20GB at installation time on your hard drive)
but the API will tell you if the model weights are not fully downloaded yet.

## Experimenting in the playground

Now it's time to play!
Let's see what this embedded Gemini Nano can do, in the [Prompt API playground](https://chrome.dev/prompt-api-playground/).
This is a simple form where you can send prompts to the model, and see its replies.

![](/img/gemini/nano-playground.png)

Looks like it's smart enough to know that no cat ever went on the moon!

## A bit of code

The [code of this demo](https://github.com/tomayac/prompt-api-playground) is available on Github.

Let's have a look at the key lines of the **Prompt API** usage.

To know if the browser supports the Prompt API, you'll need to check the existence of the new `ai` object on `window`:

```javascript
if (!window.ai) {
    ...
}
```

Then you'll have to create a **text session** with:

```javascript
const session = await window.ai.createTextSession();
```

Then you can either wait for the full response, or stream the tokens as they are generated.
Here, let's see the streaming scenario, and how to iterate over the streamed tokens:

```javascript
const stream = await session.promptStreaming(
    "What's the name of the first cat who stepped on the moon?"
);

for await (const chunk of stream) {
    var fullResponse = chunk.trim();
    // do something with the response, like appending it to a DOM node
}
```

If you're not streaming the response, you can also do as follows,
to get the response in one go once it's fully generated:

```javascript
const result = await session.prompt(
    "What's the name of the first cat who stepped on the moon?"
);
```

## But why running AI in the browser?

Maybe I should have started there, afterall?
Why would you want to run models locally in the browser, rather than using a cloud-hosted one?

As the [documentation](https://developer.chrome.com/docs/ai/built-in) outlines:

* For **privacy reasons**: you may want to do local processing of sensitive data, to avoid sending such information on the web.
* For **latency gains**: once the model is loaded in the browser (in about 3 seconds on my machine), the model responds super fast to all subsequent requests.
So you can have a very snappy experience, without the long roundtrip through the internet!
* For **lower costs**: since all the AI inference is done in the browser, it's not going to cost you anything on the server-side.
* For **offline usage**: as it runs in the browser, even if you lost your internet connection, your Web UI will continue to function with all its smart AI features.

## Interesting resources

* Checkout the [Prompt API playground](https://chrome.dev/prompt-api-playground/) to play with it (after having followed the instructions above).
* Have a look at the [sources](https://github.com/tomayac/prompt-api-playground) of the playground to learn how the demo is done.
* There's a nice [publication](https://medium.com/google-cloud/google-chrome-has-a-secret-ai-assistant-9accb95f1911) that shows how to use the Prompt API to summarize the content of the web page displayed in your browser.
* The HuggingFace people have an [extended article](https://huggingface.co/blog/Xenova/run-gemini-nano-in-your-browser) on how to run Gemini Nano in the browser, with some advanced details about the Prompt API.
* Read the pages that explains the [goals of the built-in AI](https://developer.chrome.com/docs/ai/built-in).
* It's interesting to glance through the [explainer](https://github.com/explainers-by-googlers/prompt-api/) of the Prompt API to understand how it's been designed.
* And the best resource for the end, the [user guide of the built-in AI early preview](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit), which gives lots of details about the Prompt API.

## Summary

I've been focusing mostly on large language models in the cloud so far,
in particular [Gemini](https://cloud.google.com/vertex-ai/generative-ai/docs/start/quickstarts/quickstart-multimodal#gemini-text-only-samples-java),
but I'm excited at the prospect of the interesting use cases that it can enable.

Imagine, for example, a travel itinerary application, that would store all the information of your trip locally (in IndexedDB or a WebAssembly-fied sqlite),
and you could ask offline all the questions you want about the journey? (basically, **RAG in the browser**!)
No need to hunt for a public wifi network or a local SIM card.

There are also many tasks some browser extension could handle:
* When preparing my podcast episode and show notes, I could ask Gemini Nano to make a 5-bullet-point summary of the article I'm reading.
* When reading the reviews for a product, I could get a sentiment analysis signal that tells me if customers are happy with that product.

We could also think of some hybrid scenarios, as both cloud-hosted and local-running models could complement each other.

I hope this Web API will become a standard and that other browsers support it too, and offer different models as well.