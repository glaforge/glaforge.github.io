---
title: "AI Inktober — Generating ink drawings with Imagen 3"
date: 2024-09-30T21:25:46+02:00
tags:
  - machine-learning
  - langchain4j
  - java
  - google-cloud

similar:
  - "posts/2024/02/01/image-generation-with-imagen-and-langchain4j.md"
  - "posts/2025/09/10/generating-videos-in-java-with-veo3.md"
  - "posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories.md"
---

Every year, in October, takes place the [Inktober challenge](https://inktober.com/):
every day of the month, you have to do a drawing representing the word of the day.
The list of _prompts_ this year is the following:

![Inktober 2024 prompts](/img/ainktober/prompts.png)

I participated to some of the daily challenges the past few years, but I never did all of them.
But this year, for the fun, I thought I could ask Google's
[Imagen 3](https://deepmind.google/technologies/imagen-3/) image model to draw for me!
(Or at least to draw something I could try to reproduce.)

Of course, the goal of the challenge is not to generate images with the help of an AI.
On the contrary, the idea is about the pleasure you can have drawing yourself, with your own hands!
However, I was curious to see how Imagen would perform on such a challenge.

So I fired up my favorite Java AI framework: [LangChain4j](https://docs.langchain4j.dev/),
as it supports Imagen 3, as image model.

> **Note:** Imagen 3 is generally available on Google Cloud's Vertex AI platform, but it's behind an _allow list_.
> So you have to [request access](https://docs.google.com/forms/d/1cqt9padvfMgqn23W5FMPTqh7bW1KLkEOsC5G6uC-uuM/viewform) to be able to use it.

You will need the following dependency:

- For Gradle users:

```groovy
implementation 'dev.langchain4j:langchain4j-vertex-ai:0.35.0'
```

- For Maven users:

```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-vertex-ai</artifactId>
    <version>0.35.0</version>
</dependency>
```

Now let's have a look at the code:

```java
import dev.langchain4j.data.image.Image;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.vertexai.VertexAiImageModel;

import java.nio.file.Path;

public class AInktober {
    public static void main(String[] args) {
        VertexAiImageModel imagenModel = VertexAiImageModel.builder()
            .endpoint(System.getenv("GCP_VERTEXAI_ENDPOINT"))
            .location(System.getenv("GCP_LOCATION"))
            .project(System.getenv("GCP_PROJECT_ID"))
            .publisher("google")
            .modelName("imagen-3.0-fast-generate-001")
            .aspectRatio(VertexAiImageModel.AspectRatio.SQUARE)
            .negativePrompt("watercolor, gray shades")
            .persistTo(Path.of("/tmp/imagen"))
            .build();

        String prompt = """
            A black and white ink drawing of a
            backpack, on a fully white background
            """;

        Response<Image> imageResponse = imagenModel.generate(prompt);
        System.out.println(imageResponse.content().url());
    }
}
```

- I have set up several environment variables containing my Google Cloud project details.
- I decided to use `imagen-3.0-fast-generate-001`, which generates images faster (and cheaper!) than `imagen-3.0-generate-001`
  at the cost of a slightly lower quality (but for ink drawings, that's not really visible).
- I went with square images, but you can use landscape, portrait, and wider variants too.
- I added a negative prompt, because some images looked a bit more like watercolor at times, but I wanted images more black and white.
- I persist all the generated images into a temporary folder.
- My prompt contains the first subject of the day, a _"backpack"_, and I specify that I want a black and white ink drawing,
  but I also added that I wanted a white background, as sometimes the background can be fully black, or some sepia shade.

So what does the first image look like?

![Inktober 2024's backpack](/img/ainktober/ainktober-01-backpack.png)

It definitely looks like an ink drawing of a backpack!

Don't worry, I won't post a new article each day for the new daily image prompt.
Instead, I'll share the other days on my usual social media channels (see the bottom of the blog to find them out.)

Be sure to checkout Imagen 3, it's pretty good!
