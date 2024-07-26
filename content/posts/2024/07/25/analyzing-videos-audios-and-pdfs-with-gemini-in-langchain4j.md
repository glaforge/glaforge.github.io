---
title: "Analyzing video, audio and PDF files with Gemini and LangChain4j"
date: 2024-07-25T20:08:52+02:00
tags:
  - generative-ai
  - langchain4j
  - java
  - google-cloud
  - large-language-model
---

Certain models like Gemini are **multimodal**.
This means that they accept more than just text as input.
Some models support text and images, but **Gemini goes further and also supports audio, video, and PDF files**.
So you can mix and match text prompts and different multimedia files or PDF documents.

Until LangChain4j 0.32, the models could only support text and images,
but since my [PR](https://github.com/langchain4j/langchain4j/pull/1464) got merged into the newly released
[0.33](https://github.com/langchain4j/langchain4j/releases/tag/0.33.0) version,
you can use all those files with the LangChain4j Gemini module!

Let's have a look!

## Getting the transcription of a podcast recording

Are you an avid podcast listener and want to read its transcription?
Or you want to publish that transcription as show-notes of your own podcast on your website?

You can ask Gemini for the transcription with the following code:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-pro")
    .build();

Response<AiMessage> response = model.generate(
    UserMessage.from(
        AudioContent.from(
            "https://storage.googleapis.com/cloud-samples-data/"
            + "generative-ai/audio/pixel.mp3"),
        TextContent.from(
            "Write a transcription of this audio file")
    )
);

System.out.println(response.content().text());
```

Above, we created an audio content object with the `AudioContent.from(...)` method.
This method can take a string which can be a direct URL to a file on the web,
it can be a Google Cloud Storage URL as well (like `gs://bucket/audio.mp3`).
It is possible to load a local file from your file system with `AudioContent.from(Paths.get("audio.mp3").toUri())`.
You can even pass the base 64 encoded content of the audio file and specify its mime type.

### What else could you do with audio files?

- If you're in a hurry and don't have time to listen to this one-hour episode,
  instead of asking for the whole transcript, you could change the prompt to ask for a summary.
  That way you know if it's worth spending an hour to listen to it all.

- Gemini also accepts several audio files in input, so if you are recording interviews of persons on a specific topic,
  you could ask Gemini to contrast the differences in those responses.

## Preparing YouTube video chaptering

Let's say you're a YouTuber, and you want to do your own video chaptering, instead of relying on the the automatic chapters.
How can you do that?

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .build();

Response<AiMessage> response = model.generate(
    UserMessage.from(
        VideoContent.from(
            "https://storage.googleapis.com/cloud-samples-data/"
            + "generative-ai/video/behind_the_scenes_pixel.mp4"),
        TextContent.from(
            "Prepare chapters for this video file, "
            + "using the YouTube chapter notation")
    )
);

System.out.println(response.content().text());
```

For this video, the chapters generated look as follows:

```
00:00 Making a Film with a Blind Director
00:16 Adam Morse, Filmmaker
00:28 The Film Shoot
00:48 A Blind Man & His Girlfriend
01:15 Google Pixel Phone
01:33 Guided Frame
02:06 The Technical Crew
02:32 Visual Effects
02:45 Misconceptions About Blindness
03:20 Filmmaking with a Team
03:46 Google Accessibility
04:00 One Person's Perspective
04:29 Adam's Vision
05:03 A Beautiful Position
05:19 Google Logo
```

### What else could you do with videos?

- If a video of your meeting or your conference presentation has been recorded,
  you could use this approach to ask Gemini for a summary of the video, to get the various sections, to write the transcript.

- We often record videos of our family, our children, etc.
  It's not always easy to _search_ through those videos.
  You could ask Gemini to provide a summary of the video,
  that you would then index with some search engine, or just do some simple _grep_ search from the command-line.

## Asking questions about PDF documents

Let's have a look at one last example: PDF documents.

With LangChain4j, it's possible to use the Apache Tika-based document loader to get the text content of a PDF.
However, you loose some important semantic information, as the layout may be important,
or the figures may convey as well some critical details.

Fortunately, Gemini can ingest PDF documents directly, without an intermediate text transcription.

This allows you to ask questions about PDf documents, and since Gemini has a very large context window,
it's able to analyze very big documents, or several documents at the same time,
without having to implement your own RAG system (Retrieval Augmented Generation).

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .build();

Response<AiMessage> response = model.generate(
    UserMessage.from(
        PdfFileContent.from(
            "https://proceedings.neurips.cc/paper_files/paper/2017"
            + "/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf"),
        TextContent.from(
            "Give a summary of this paper")
    )
);

System.out.println(response.content().text());
```

This example analyzes the famous _"Attention is all you need"_ paper that introduced the concept of _Transformer_ neural networks:

```
This paper proposes a novel neural network architecture called the
Transformer, which relies entirely on an attention mechanism and
dispenses with recurrence and convolutions. The Transformer
outperforms existing models on two machine translation tasks, WMT
2014 English-to-German and WMT 2014 English-to-French, while
requiring significantly less training time. The authors argue that
the Transformer's ability to learn global dependencies without
regard to their distance in the input or output sequences, as well
as its parallelizable nature, make it a promising approach for
sequence modeling and transduction problems. They also present an
analysis of the Transformer's different components and their effect
on performance. The paper concludes by discussing potential future
directions for research.
```

### What else could you do with PDF documents?

- You can implement some smart question answering solutions over your documents.

- Gemini can help make sense of differences between two versions of your PDF paper.

- Gemini allows you to ingest multiple files at the same time,
  so it is possible to pass the PDF of your dishwasher manual,
  at the same time as a tutorial showing how to repair it,
  and then ask the LLM to answer a question on how to fix it.

## Summary

Multimodality is a powerful feature of Gemini,
and now LangChain4j is equiped with the ability to send text, images, audio files, videos, and PDF documents,
potentially all at the same time, to create some innovative multimedia integrations.
