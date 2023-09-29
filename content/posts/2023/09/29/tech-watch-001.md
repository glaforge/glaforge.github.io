---
title: "Tech Watch #1 — 2023-09-29"
date: 2023-09-29T16:05:13+02:00
tags:
  - tech-watch
  - generative-ai
  - large-language-models
  - machine-learning
  - knowledge-graphs
  - observability
  - databases
  - containers
---

Inspired my by super boss [Richard Seroter](https://twitter.com/rseroter) with his regular [daily reading list](https://seroter.com/2023/09/28/daily-reading-list-september-28-2023-171/), I decided to record and share my _tech watch_, every week (or so).
I always take notes of interesting articles I read for my own curiosity and to remember them when I need those references later on. But also to share them with [Les Cast Codeurs podcast](https://lescastcodeurs.com/)!
So I hope it'll be interesting to my readers too!

- [LLMs Demand Observability-Driven Development\
  ](https://www.honeycomb.io/llms-demand-observability-driven-development)A great tribune from [Charity Majors](https://twitter.com/mipsytipsy) on the importance of observability-driven development, in the wake of large language models. Developing LLM based solutions is typically not something you can do with a classical test-driven approach, as you only really get proper test data when you have it coming from production usage. Furthermore, LLMs are pretty much unpredictable and underterministic. But with observability in place, you can better understand why there's latency in some scenarios, why the LLM came to certain solutions, and this will help you improve as your learn along the way.

- [How LangChain rebuilt their LLM documentation chatbot\
  ](https://blog.langchain.dev/building-chat-langchain-2/)For example: the choice of docs to parse: indexing source code didn't yield great results. Citing sources lets users dive deeper into the documentation and double check the LLM didn't hallucinate. Quality evaluation is important, to assess at each step of the process the impact of each change, each tweaks of your prompts, each change in the docs that are ingested. Also, how do you handle reindexing the documents, when there are changes in a document, when there are new pages to be indexed, or that disappear, to keep track of what has to be updated in the stored vector embeddings in vector store. A great trick about how to rephrase questions: sometimes you ask a question, ask a refinement, but you don't formulate a whole new question, so you can actually ask the LLM to reformulate a full question based on the conversation context, so as to find more meaningful similar text embeddings in the vector database.

- [macOS containers\
  ](https://macoscontainers.org/)You can run all sorts of Linux flavors inside containers, on all platforms, and even Windows containers. But with the macOS containers projects, that you can install with Homebrew, you can also install and run macOS containers. It's still early days for the project, it seems, and there are limitated container support in macOS itself, but it sounds promising. Also, macOS containers only run on top of macOS  itself.

- [Using PostgreSQL for queuing\
  ](https://adriano.fyi/posts/2023-09-24-choose-postgres-queue-technology/)With our without extensions, I see a lot of articles mentioning using PostgreSQL for everything! With the pgVector extension, for example, you can use Postgres as a vector database for storing parsed documents for your LLM use cases. In this article, the author suggests taking advantage of its pub/sub (with notify/listen) and row locking capabilities to implement queuing, and thus replacing other dedicated queuing components in your architecture.

- [Use ControlNet with StableDiffusion's SDXL\
  ](https://stable-diffusion-art.com/controlnet-sdxl/)You've probably all seen some cool images with some subliminal text appear, or with weird squares or spirals shapes, on social networks. This tutorial explains how you can guide StableDiffusion's SDXL model with ControlNet to shape particular picture generations, or to create pictures in the style of other pictures.

- [Transformer.js\
  ](https://huggingface.co/docs/transformers.js/index)A JavaScript transformer implementation that allows to load HuggingFace models, and do predictions and other LLM tasks right in the browser.

- [JVector\
  ](https://github.com/jbellis/jvector/)An open source Java project for fast vector search, used in Astra DB's vector search. This project was mentioned in TheNewStack's [article](https://thenewstack.io/5-hard-problems-in-vector-search-and-how-cassandra-solves-them/) on how Astra DB solves 5 typical problems of vector search. So for those who want to embed an Java vector store in their LLM use cases, this might be an option to look into, besides Lucene, for example.

- [Mixing LLMs and a Knowledge Graphs\
  ](https://www.marktechpost.com/2023/09/19/llms-knowledge-graphs/)Inherently, knowledge graphs have structured information and relationships, that LLM based projects can take advantage of. The article discusses different approaches and patterns to bind them together, to reduce hallucination, enhance transparency & interpretability.

- [Tracing is better than logging!\
  ](https://andydote.co.uk/2023/09/19/tracing-is-better/)It's often hard to figure out from logs what happened when a problem occurred. It's slightly better with structured logging to do some querying though. But with tracing, you can see correlations between traces, as they are nested, and see all the attributes you can attach to those spans, without mentioning the fact you can more easily understand where time is spent rather than just have a point in time like with a log statement.
