---
title: "Javelit to create quick interactive app frontends in Java"
date: 2025-10-24T17:33:27+02:00
tags:
  - java
  - generative-ai
  - javelit
image: /img/misc/javelit.png
---

Have you ever heard of [Javelit](https://javelit.io/)?
It's **like Streamlit** in the Python ecosystem, but **for the Java developer**!
I was lucky that the project creator reached out and introduced me to this cool little tool!

Javelit is a tool to **quickly build interactive app frontends in Java**, particularly for data apps, but it's not limited to them.
It helps you quickly develop rapid prototypes, with a **live-reload** loop, so that you can quickly experiment and update the app instantly.

The way it works (and thus the way you program with it) is a little unusual, so it took me a bit of time to really get it.
But basically, as the documentation states (in the [fundamentals section](https://docs.javelit.io/get-started/fundamentals)):

> Javelit's architecture allows you to write apps the same way you write plain Java methods.
> To unlock this, Javelit apps have a unique data flow: any time something must be updated on the screen,
> Javelit reruns your entire Java main method from top to bottom.

So you have to think about it as if there were somehow a big loop around your UI code,
and Javelit redraws it whenever you modify the source code (because of the live-reload capability),
or of course, when a user interacts somehow with the app (submitting a form, clicking a button, moving a slider, etc.)

It's possible to [embed](https://docs.javelit.io/get-started/installation/embedded-vanilla) it in your own servers,
but here, I'll illustrate it with the [standalone command-line tool](https://docs.javelit.io/get-started/installation/standalone),
which I've installed thanks to [Jbang](https://www.jbang.dev/).

## It always starts with _"Hello World!"_

A simple example could be:

```java
/// usr/bin/env jbang "$0" "$@" ; exit $?
import io.javelit.core.Jt;

public class App {
    public static void main(String[] args) {
        Jt.title("Hello World!").use();
        Jt.markdown("""
            ## My first official message
            Hello World!
            """).use();
    }
}
```

Then, once Javelit is [installed](https://docs.javelit.io/get-started/installation/standalone#install-javelit), you'd run it with the following command:

```bash
javelit run App.java
```

It will open your browser automatically, and you'll be able to view the app UI.
Then, start making some changes to the title or markdown text, and notice how the UI is live reloaded.

Later on, add maybe a button, or the [many components](https://docs.javelit.io/develop/api-reference) available,
like the various text elements, the input elements & forms, the containers, pages & layouts,
or the data components like tables or charts with [Apache Echarts](https://echarts.icepear.org/#/).

> Have a look at the more complete [Hello World](https://docs.javelit.io/get-started/installation/standalone#create-a-hello-world-app-and-run-it)
> from the documentation, which shows some interactivity with a button click counter.

## Creating an interactive image playground with Nano Banana

After "Hello World!", you've got to build something a little more involved, right?

Since I love playing with **Nano Banana** (i.e. Gemini 2.5 Flash Image) to create and edit pictures,
I decided to build an **interactive image playground, to create new images,
and then incrementally edit the image with further prompts**.

Here's the UI I came up with, and let's see how to build and interact with it:

![](/img/nano-banana/javelit-nano-banana-playground.png)

What do we see in that UI?
A title, a form containing a text area to enter the prompts, and a button to launch the image generation.
So we'll layout those components in that order:

```java
public class App {
  public static void main(String[] args) {

    Jt.title("🍌 Nano Banana Playground 🍌").use();

    var form = Jt.form().use();

    var text = Jt.textArea("Image prompt")
        .placeholder("An impressionist painting of a cat")
        .use(form);

    if (Jt.formSubmitButton("Generate image").use(form)) {
      // Nano Banana magic to generate or edit the image, then...
      Jt.html("<img src='data:" + mimeType +
          ";base64," + b64encoded + "'>")
          .use();
    }
  }
}
```

We added:

- a title with the `Jt.title().use()` method,
- a form, to associate the text area and submit button, with `Jt.form().use()`,
- a text area, with a placeholder, and hosted within the form, with `Jt.textArea().use()`,
- a button to launch the image generation, with `Jt.formSubmitButton().use()`,
- and `Jt.html().use()` to append an image as a data src `img` (there's no image component yet, but it's on the [roadmap](https://github.com/javelit/javelit/discussions/39)).

But what's more interesting is this mysterious `if` statement...
The first time, the UI is drawn with the title and form.
But since the user hasn't yet clicked the submit button, the `formSubmitButton()` method returns `false`.
So the code inside the `if` isn't executed.

But once the user interacts with the UI, after having entered some text and clicked on the button,
this time the method will return `true`, and the image component (here the HTML component) is going to be added to the UI.

At first, this is not really obvious, as you have to think in terms of loop redrawing the UI after each interaction with the components.
But you'll get the hang of it after a little while.

## Handling state

The idea of this image playground is to

- first, create a brand-new image,
- but then, you change the prompt with some image editing commands, and each time you submit the form, the image will be updated accordingly.

So you need to somehow [keep track of the state](https://docs.javelit.io/get-started/fundamentals/advanced-concepts#session-state)
from the previous interaction and rendering loop.
How do you do that? With the `Jt.sessionState()`.

For example, I want to save the bytes and the mime type of the image generated by Nano Banana, I would do:

```java
Jt.sessionState().put("mimeType", mimeType);
Jt.sessionState().put("bytes", data);
```

And if I want to get those variables back in the next rendering loop, I'd write:

```java
String mimeType = Jt.sessionState().getString("mimeType");
byte[] data = Jt.sessionState().get("bytes");
```

It's a so-called _typed map_, and there are many methods like `putIfAbsent()`, `computeInt()`, etc.

## The final version of the code of our playground

Most of the code below is actually generating and editing the image,
as I explained in previous articles [using the Gemini GenAI Java SDK]({{< ref "posts/2025/09/09/calling-nano-banana-from-java" >}}) directly,
or [within ADK for Java]({{< ref "posts/2025/09/22/creative-ai-agents-with-adk-and-nano-banana" >}}).
The UI code from Javelit is really just a dozen lines or so!

{{<details summary="Click to view the whole code">}}

```java
/// usr/bin/env jbang "$0" "$@" ; exit $?
//DEPS com.google.genai:google-genai:1.24.0

package demo;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.Part;
import io.javelit.core.Jt;

import java.util.Base64;

public class App {
  public static void main(String[] args) {

    Jt.title("🍌 Nano Banana Playground 🍌").use();

    var form = Jt.form().use();

    var imgContainer = Jt.empty().use();

    var text = Jt.textArea("Image prompt")
        .placeholder("An impressionist painting of a cat")
        .use(form);

    if (Jt.formSubmitButton("Generate image").use(form)) {

      try (Client client = new Client.Builder()
          .apiKey(System.getenv("GOOGLE_API_KEY"))
          .build()) {

        String mimeTypeFromState = Jt.sessionState().getString("mimeType");
        byte[] bytesFromState = (byte[]) Jt.sessionState().get("bytes");

        Content content;
        // first run --> create a brand-new image
        if (mimeTypeFromState == null || bytesFromState == null) {
          content = Content.fromParts(
              Part.fromText(text)
          );
        } else { // second run --> edit the previously generated image
          content = Content.fromParts(
              Part.fromBytes(bytesFromState, mimeTypeFromState),
              Part.fromText(text)
          );
        }

        var response = client.models.generateContent(
            "gemini-2.5-flash-image-preview",
            content,
            GenerateContentConfig.builder()
                .responseModalities("TEXT", "IMAGE")
                .build());

        response.candidates()
            .flatMap(candidates ->
                candidates.getFirst().content()
                    .flatMap(Content::parts)
                    .flatMap(parts -> parts.getLast().inlineData()))
            .ifPresent(inlineData -> {
              String mimeType = inlineData.mimeType().orElse("image/png");
              inlineData.data().ifPresent(data -> {
                Jt.sessionState().put("mimeType", mimeType);
                Jt.sessionState().put("bytes", data);

                String b64encoded = Base64.getEncoder().encodeToString(data);
                Jt.html("<img src='data:" + mimeType +
                        ";base64," + b64encoded + "'>")
                    .use(imgContainer);
              });
            });
      }
    }
  }
}
```

{{</details>}}

## Go ahead and have fun with Javelit!

I had a lot of fun playing with [Javelit](https://javelit.io/) so far,
and I'm looking forward to using this nice little tool to experiment with various application ideas.
I highly encourage you to try it out, so [go check out Javelit](https://javelit.io/)!
