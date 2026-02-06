---
title: "Detecting objects with Gemini 2.0 and LangChain4j"
date: 2024-12-13T17:54:32+01:00
image: /img/gemini/robot-card-game.png
tags:
  - java
  - large-language-models
  - machine-learning
  - langchain4j
  - generative-ai
  - gemini

similar:
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
  - "posts/2024/12/20/lets-think-with-gemini-2-thinking-mode-and-langchain4j.md"
  - "posts/2024/07/05/latest-gemini-features-support-in-langchain4j.md"
---

Hot on the heels of the [announcement of Gemini 2.0](https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/),
I played with the new experimental model both from within [Google AI Studio](https://aistudio.google.com/app/prompts/new_chat),
and with [LangChain4j](https://docs.langchain4j.dev/).

Google released Gemini 2.0 Flash, with new modalities, including interleaving images, audio, text, video, both in input and output.
Even a live bidirectional speech-to-speech mode, which is really exciting!

When experimenting with AI Studio, what attracted my attention was AI Studio's new [starter apps](https://aistudio.google.com/starter-apps) section.
There are 3 examples (including links to Github projects showing how they were implemented):

- **spatial understanding** — get Gemini to recognize objects in pictures, and give you bounding boxes for those objects
- **video analyzer** — to summarize, describe scenes, extract texts and objects from videos
- **map explorer** — an integration with Google Maps to explore the world

The first one, on detecting objects, reminded me of an old demo of mine I had developed with Gemini 1.0 Pro Vision to recognise the cards of the Skyjo card game
(a fun little card game I've been playing a lot with my youngest daughter):

![](/img/gemini/skyjo-ai-studio.png)

If you look at the screenshot above, you'll see some prompt suggestions to get bounding boxes around detected objects.
You'll notice that the model seems pretty capable at recnogising the numbers on those cards.
And with some bits of prompt engineering, it ignores cards facing down (attribute a value of 0 for those cards).
In the end, you can sum up all the points, and have the current score for your cards.

Back in the day, Gemini 1.0 was making quite a few mistakes when detecting and recognising the values of the cards,
in particular when the cards were tilted, or upside down.
But Gemini 2.0 Flash has greatly improved, and is much more capable.

So I decided to see:

- if LangChain4j works well with Gemini 2.0 Flash,
- and if I can craft a prompt that detects my cards flawlessly.

And I'm glad to report that for all the photos I had taken of my games (14 pictures), I managed to score a 100% score of recognition.
Of course, LangChain4j is happy to call Gemini 2 without a problem (although we'll have to update the framework with the new modalities when a Java SDK is made available)

## Let's code!

I'll skip some of the boilerplate code to iterate over all my test pictures, properly labeled with the card values.
But you can have a look at this [gist](https://gist.github.com/glaforge/d6e845c673a5441823efc800d2d6bbf6) with all the code.

First, let's create some Java `record`s to represent the cards, their bounding box, and number labels:

```java
record Card(
    int label,
    BoundingBox boundingBox
) {
    record BoundingBox(int x1, int y1, int x2, int y2) {}
}
```

We'll use GSON for marshalling/unmarshalling those card details.

```java
var model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("PROJECT_ID"))
    .location(System.getenv("LOCATION"))
    .modelName("gemini-2.0-flash-exp")
    .responseMimeType("application/json")
    .responseSchema(SchemaHelper.fromClass(Card[].class))
    .temperature(0.1f)
    .build();
```

Notice that we're using the new model: `gemini-2.0-flash-exp` (it's labeled _experimental_ for now).
And also pay attention to the response MIME type, which is JSON, and the fact we're defining a response schema:
We instruct Gemini to return a valid JSON object whose schema corresponds to the `record`s we've just defined.

Next, let's load all the cards pictures and details (our sample dataset):

```java
var cardsExamples = processImageFiles
        Path.of("skyjo-counter/samples"));
```

Now we can iterate over all the cards, to check that Gemini 2 recognises all of them:

```java
for (CardsExample example : cardsExamples) {
    System.out.println("File: " + example.imageFile());
    // ...
}
```

Let's look at the convoluted prompt I came up with to ensure to recognise all my sample pictures:

```java
Response<AiMessage> response =
  model.generate(
    SystemMessage.from("""
      Detect playing cards with numbers, with no more than 12 items.
      Output a JSON list of cards, where each entry contains the 2D
      bounding box in `boundingBox` and the `label` is the big number
      displayed in the center of the card.
      If you see the text "SKYJO" on the card, use 0 as the label
      in `label`.
      Ignore the small numbers in the corners of the cards.
      Ignore cards with text written on them.
      Be careful when reading the numbers, as sometimes some cards
      are tilted, cut, or upside down.
      """),
  UserMessage.from(
    ImageContent.from(example.imageFile().toUri()),
      TextContent.from("""
        Detect the cards of this image.
        """)
  ));
```

We give Gemini some system instructions to pay attention to the (maximum 12) cards numbers,
to return bounding boxes around the detected cards, and to give the big number at the center of the cards as the label.
There are some extra instructions for cards upside down, to ignore the small numbers in the corners, or to pay attention to the fact some cards may be cut, tilted, etc.
This prompt may not necessarily perfect, but at least it worked for all my pictures!

Then, as user message, we pass both the picture, and the request to detect the cards in the picture.

Last step, let's parse the JSON returned structure with GSON
(I could have used LangChain4j's `AiServices` for a cleaner and more type-safe approach),
and we're counting the points.
If the sum of points isn't correct, we display the cards that have been recognised, for troubleshooting purpose.

Let's check the output:

```
File: skyjo-counter/samples/-1 -1 -2 0 3 0 4.jpg
 ==> Your points: 3
File: skyjo-counter/samples/1 4 1 -1 3 0 0 3 3 3.jpg
 ==> Your points: 17
File: skyjo-counter/samples/3 9 3 4 5 2 4 5.jpg
 ==> Your points: 35
File: skyjo-counter/samples/3 5 2 4 5.jpg
 ==> Your points: 19
File: skyjo-counter/samples/-1 4.jpg
 ==> Your points: 3
File: skyjo-counter/samples/1 0 2.jpg
 ==> Your points: 3
File: skyjo-counter/samples/1 0 3 4 0 3 1 -1 2.jpg
 ==> Your points: 13
File: skyjo-counter/samples/4 4 1 2 0 2 1 2 3.jpg
 ==> Your points: 19
File: skyjo-counter/samples/0 -1 -1 -2 0 0 0 0 -1.jpg
 ==> Your points: -5
File: skyjo-counter/samples/4 1 -2 2 4 2 3 3 0 5.jpg
 ==> Your points: 22
File: skyjo-counter/samples/4 3 0 -2 -1 -1 2 1 3.jpg
 ==> Your points: 9
File: skyjo-counter/samples/6 1 2 6 1 3.jpg
 ==> Your points: 19
File: skyjo-counter/samples/3 3 5 2 5.jpg
 ==> Your points: 18
File: skyjo-counter/samples/1 -2 5 2 -1 8 0.jpg
 ==> Your points: 13
```

The picture file names contain the values of the cards, so it was easy to check for the ground truth!
And if we sum up those numbers, we should come up with the same number of points.

## Now what?

Well, first of all, I'm happy that LangChain4j works with Gemini 2.0!
Secondly, that the quality of object detection keeps on progressing nicely.
Thirdly, I might have to update my old demo, to make it a PWA app that could run on mobile, so that I don't have to count the sum of the card numbers in my head, because I'm lazy!
