---
title: "LLMs.txt to help LLMs grok your content"
date: 2025-03-03T11:03:35+01:00
tags:
  - large-language-models
  - generative-ai

similar:
  - "posts/2025/02/15/the-power-of-large-context-windows-for-your-documentation-efforts.md"
  - "posts/2024/05/28/grounding-gemini-with-web-search-in-langchain4j.md"
  - "posts/2025/07/14/advanced-rag-using-gemini-and-long-context-for-indexing-rich-documents.md"
---

Since I started my career, I've been sharing what I've learned along the way in this blog.
It makes me happy when developers find solutions to their problems, or discover new things, thanks to articles I've written here.
So it's important for me that readers are able to find those posts.
Of course, my blog is indexed by search engines, and people usually find about it from Google or other engines, or they discover it via the links I share on social media.
But with LLM powered tools (like Gemini, ChatGPT, Claude, etc.) you can make your content more easily _grokkable_ by such tools.

A [proposal](https://llmstxt.org/) emerged last year to add a new file websites, `llms.txt`, which is a Markdown document that lists all the posts, pages, articles of that website. In a way, it's similar to other kind of indexing-related files like `robots.txt` or `sitemap.xml`. But this time, the idea is to offer the content of your documentation, website, or blog, as Markdown, easily _grokkable_ by LLM powered tools.

## Updating Hugo to generate LLMs.txt files

This blog post is powered by [Hugo](https://gohugo.io/), a static site generator.
I'll explain how I added 2 new files to my blog:

- [llms.txt](https://glaforge.dev/llms.txt) — which references links to all the blog posts, a bit like a sitemap.
- [llms-full.txt](https://glaforge.dev/llms-full.txt) — which contains all the blog post articles in one giant file.

In `config.toml`, I added two new output formats:

```toml
[outputFormats.llms]
baseName = "llms"
mediaType = "text/plain"
isPlainText = true

[outputFormats.llms-full]
baseName = "llms-full"
mediaType = "text/plain"
isPlainText = true

[outputs]
home = ["HTML", "RSS", "llms", "llms-full"]
```

And in my custom theme `layouts\_default` folder, I added two templates for those two files:

- `index.llms.txt` references all the articles

```
# Blog of {{ .Site.Title }}

> {{ .Site.Params.Description }}

You can find [more information about this site here](/about).

## All articles
{{ range .Site.RegularPages.GroupByDate "2006" }}

### {{ .Key }}
{{ range .Pages }}
- [{{- .Title -}}]({{- .Site.BaseURL -}}{{- .RelPermalink -}})
{{- end -}}
{{ end }}
```

- `index.llms-full.txt` provides the full content of all the articles

```
{{ range .Site.RegularPages }}
# {{ .Title }}

{{ .RawContent }}
{{- end -}}
```

## Now what can you do with that?

In my recent article on [the power of large context windows for your documentation efforts]({{<ref "posts/2025/02/15/the-power-of-large-context-windows-for-your-documentation-efforts/">}})) I mentioned that you could feed all your content into an LLM prompt and have a discussion with it. This is the same idea I'm following here. Thanks to the full export of all my articles, I can ask questions about everything I've written so far.

Let's go to [Google AI Studio](https://aistudio.google.com/) and ask Gemini, and its huge token context window!

![](/img/gemini/llms-txt-blog-content.png)

When I asked about the main topics of this blog, the above screenshot shows Gemini's answer, highlighting my content about [Apache Groovy](https://groovy-lang.org/), Google Cloud Platform, generative AI, Web APIs, software development best practices.

Look at the number of tokens! **My whole blog is about 682k tokens**! Only Gemini could _grok_ all of that and make sense of it.

As a follow up question, I also asked _"Can you detail more the articles about Generative AI?"_, and Gemini highlighted some of my recent articles and summarized them all:

> Okay, based on the file, here's a breakdown of the articles specifically about Generative AI:
>
> *   **The power of large context windows for your documentation efforts:** This article explores using LLMs with large context windows (like Gemini) to chat with reference documentation, to assist in tasks like creating new modules for LangChain4j. It discusses using "gitingest" to convert a GitHub project into a large text file that can be fed to an LLM.
> *   **A Generative AI Agent with a real declarative workflow:** This piece compares an imperative Java-based AI agent with a declarative approach using Google Cloud Workflows. The agent generates short sci-fi stories, and the article details the pros and cons of each method.
> *   **An AI agent to generate short sci-fi stories:** This project details how to build an AI-powered short story generation agent using Java, LangChain4j, Gemini, and Imagen 3, deployed on Cloud Run jobs. It contrasts explicit vs. autonomous agent workflows.
> *   **Analyzing trends and topics from Bluesky's Firehose with generative AI:** This article describes a project that analyzes the Bluesky social media stream, using vector embeddings and clustering to identify trending topics, and using Gemini to generate summaries of these topics.
> *   **Let's think with Gemini Flash 2.0's experimental thinking mode and LangChain4j:** This article explores the new "thinking mode" of Gemini 2.0 Flash, using LangChain4j to solve riddles and multimodal problems.
> *   **Detecting objects with Gemini 2.0 and LangChain4j:** This article discusses using Gemini 2.0's object detection capabilities with LangChain4j to recognize playing cards in images.
> *   **Semantic code search for Programming Idioms with LangChain4j and Vertex AI embedding models:** Explores the use of Vertex AI embedding models for semantic code search on the Programming Idioms community website. It focuses on using code retrieval task types and LangChain4j for efficient retrieval of code examples.
> *   **Redacting sensitive information when using Generative AI models:** Details the importance of redacting Personally Identifiable Information (PII) before sending user messages to LLMs, using the Google Cloud Data Loss Prevention (DLP) API.
> *   **Data extraction: The many ways to get LLMs to spit JSON content:** This article reviews different techniques to make LLMs generate JSON output and extract data from text, using Gemini and LangChain4j.
>
> These articles demonstrate a clear focus on using various LLMs (primarily Gemini) with tools like LangChain4j and Google Cloud services to address different AI-related problems.


Not only did it summarize all those recent articles, but I also like the final sentence that outlines what most of those articles have in common: They are primarily using the Gemini model, with the [LangChain4j framework](https://docs.langchain4j.dev/), and running on Google Cloud Platform.

When asked to dive deeper on what is so special about LangChain4j, for instance, then again it highlighted the key features of the framework (that I demonstrated in my articles):

> LangChain4j appears to be a central tool for building Generative AI solutions in the provided articles, so I collected a few pieces of information to explain what's so special about it:
>
> *   **Java-Centric Approach:** LangChain4j is a Java library. In a field dominated by Python, LangChain4j is a key tool for Java developers to leverage generative AI without having to switch to a different programming language or environment.
> *   **LLM Orchestration:** LangChain4j facilitates the orchestration of different components in an AI pipeline, from loading documents and splitting them into chunks, to calculate their embedding vectors, storing them in vector databases, and retrieve them to be passed to the LLM, and the augment the LLM prompt with context from those vectors. This reduces the complexity of AI application development.
> *   **Integration with Google Cloud Services:** LangChain4j has built-in integrations with Google Cloud's Vertex AI, Google AI Gemini, and Google Cloud Storage. This allows Java developers to easily use Google's LLMs, embedding models, and data storage solutions.
> *   **Extensible and Customizable:** The library offers a way to plug custom logic and algorithms into the different steps, and to define how the information should be used to interact with the LLM.
> *   **Higher-Level Abstractions:** LangChain4j provides higher-level abstractions for interacting with LLMs, such as the `AiServices` abstraction that returns type-safe objects, which allows developers to manipulate real Java objects, in a type-safe manner, instead of dealing with raw JSON strings.
> *   **Capabilities like Tool Calling, Context Window, and the like:** It integrates new LLM capabilities to improve the quality of the AI powered application's responses.
> *   **Metadata Handling**: It eases the handling of metadata in text segments, including filtering based on metadata during the retrieval phase.
>
> In the context of the articles, LangChain4j simplifies the implementation of complex tasks like:
>
> *   Creating chatbots that can answer questions based on a specific knowledge base (RAG).
> *   Analyzing trends in social media data.
> *   Generating structured content (e.g., JSON) from unstructured text.
> *   Implementing semantic code search.
>
> LangChain4j's key value is that it allows Java developers to more easily build, experiment with, and deploy Generative AI applications using their existing skills and infrastructure, while abstracting away much of the underlying complexity.

## Thoughts and summary

For the past months, I've been exploring various Retrieval Augmented Generation (RAG) techniques to improve the quality of answers for questions on heaps of documents and data, often chunked and stored in vector databases. However, RAG hits some limits when you want to ask more general questions, or to analyze some content more deeply, by understanding it in its entirety.

That's where LLMs like Gemini with large context windows help, as they can figure out the fine print, the relationships between various sections, see common patterns across articles. I believe we should take the **best of both worlds, by finding relevant documents with a hybrid search approach mixing keyword and semantic searches, but then feeding LLMs not only with extracts but with whole documents**.

The `llms.txt` initiative is interesting, and I hope it'll be adopted further in the future.
It will make it simpler for users to more easily reason about documentation, blogs, etc. via LLMs.
As LLMs are getting bigger context windows, the discussion with whole docs or sites become richer, with full understanding of the context of the corpus of documents.

