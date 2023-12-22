---
title: "Get Started with Gemini in Java"
date: 2023-12-13T16:45:51+01:00
image: /img/gemini/gemini.png
tags:
  - machine-learning
  - large-language-models
  - generative-ai
  - google-cloud
  - java
  - gemini
---

Google announced today the availability of
[Gemini](https://cloud.google.com/blog/products/ai-machine-learning/gemini-support-on-vertex-ai),
its latest and more powerful Large Language Model.
Gemini is **multimodal**, which means it's able to consume not only text, but also images or videos.

I had the pleasure of working on the Java samples and help with the Java SDK, with wonderful engineer colleagues, and I'd like to share some examples of **what you can do with Gemini, using Java**!

First of all, you'll need to have an account on Google Cloud and created a project.
The Vertex AI API should be enabled, to be able to access the Generative AI services,
and in particular the Gemini large language model.
Be sure to check out the
[instructions](https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/quickstart-multimodal?hl=en).

## Preparing your project build

To get started with some coding, you'll need to create a Gradle or a Maven build file
that requires the Google Cloud libraries BOM, and the `google-cloud-vertexai` library.
Here's an example with Maven:

```xml
...
<dependencyManagement>
    <dependencies>
        <dependency>
            <artifactId>libraries-bom</artifactId>
            <groupId>com.google.cloud</groupId>
            <scope>import</scope>
            <type>pom</type>
            <version>26.29.0</version>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>com.google.cloud</groupId>
        <artifactId>google-cloud-vertexai</artifactId>
    </dependency>
    ...
</dependencies>
...
```

## Your first queries

Now let's have a look at our first multimodal example, mixing text prompts and images:

```java
try (VertexAI vertexAI = new VertexAI(projectId, location)) {
    byte[] imageBytes = Base64.getDecoder().decode(dataImageBase64);

    GenerativeModel model = new GenerativeModel("gemini-pro-vision", vertexAI);
    GenerateContentResponse response = model.generateContent(
        ContentMaker.fromMultiModalData(
            "What is this image about?",
            PartMaker.fromMimeTypeAndData("image/jpg", imageBytes)
        ));

    System.out.println(ResponseHandler.getText(response));
}
```

You instantiate `VertexAI` with your Google Cloud project ID, and the region location of your choice.
To pass images to Gemini, you should either pass the bytes directly,
or you can pass a URI of an image stored in a cloud storage bucket (like `gs://my-bucket/my-img.jpg`).
You create an instance of the model. Here, I'm using `gemini-pro-vision`.
But later on, a `gemini-ultra-vision` model will also be available.
Let's ask the model to generate content with the `generateContent()` method,
by passing both a text prompt, and also an image.
The `ContentMaker` and `PartMaker` classes are helpers to further simplify
the creation of more advanced prompts that mix different modalities.
But you could also just pass a simple string as argument of the `generateContent()` method.
The `ResponseHandler` utility will retrieve all the text of the answer of the model.

Instead of getting the whole output once all the text is generated,
you can also adopt a streaming approach:

```java
model.generateContentStream("Why is the sky blue?")
    .stream()
    .forEach(System.out::print);
```

You can also iterate over the stream with a `for` loop:

```java
ResponseStream<GenerateContentResponse> responseStream =
    model.generateContentStream("Why is the sky blue?");

for (GenerateContentResponse responsePart: responseStream) {
    System.out.print(ResponseHandler.getText(responsePart));
}
```

## Let's chat!

Gemini is a multimodal model, and it's actually both a text generation model, but also a chat model.
So you can chat with Gemini, and ask a series of questions in context.
There's a handy `ChatSession` utility class which simplifies the handling of the conversation:

```java
try (VertexAI vertexAI = new VertexAI(projectId, location)) {
    GenerateContentResponse response;

    GenerativeModel model = new GenerativeModel(modelName, vertexAI);
    ChatSession chatSession = new ChatSession(model);

    response = chatSession.sendMessage("Hello.");
    System.out.println(ResponseHandler.getText(response));

    response = chatSession.sendMessage("What are all the colors in a rainbow?");
    System.out.println(ResponseHandler.getText(response));

    response = chatSession.sendMessage("Why does it appear when it rains?");
    System.out.println(ResponseHandler.getText(response));
}
```

This is convenient to use `ChatSession` as it takes care of keeping track
of past questions from the user, and answers from the assistant.

## Going further

This is just a few examples of the capabilities of Gemini. Be sure to check out some of the
[samples that are available on Github](https://github.com/GoogleCloudPlatform/java-docs-samples/tree/main/vertexai/snippets/src/main/java/vertexai/gemini).
Read [more about Gemini and Generative AI](https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/quickstart-multimodal?hl=en) in the Google Cloud documentation.
