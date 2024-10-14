---
title: "Advanced RAG Techniques"
date: 2024-10-14T10:11:14+02:00
type: "talk"
layout: "talk"
tags:
  - generative-ai
  - large-language-models
  - java
  - langchain4j
---

**Retrieval Augmented Generation** (RAG) is a pattern to let you prompt a large language model (LLM) about your own data, via in-context learning by providing extracts of documents found in a vector database (or potentially other sources too).

Implementing RAG isn't very complicated, but the results you get are not necessarily up to your expectations. In the presentations below, I explore various **advanced techniques to improve the quality of the responses returned by your RAG system**:

Ingestion chunking techniques like:

- Embedding of sliding windows of sentences
- Hypothetical question embedding
- Contextual retrieval embedding (invented recently by Anthropic)
- Semantic chunking (created by Greg Kamradt)

Retrieval techniques, including:

- Query compression
- Hypothetical Document Embedding (HyDE)

And I also mention how an _agentic_ approach can help for more advanced and complex needs, with providing intermerdiary results, combined in a final response. **Agentic RAG** is a very important and promising approach that I'll certainly come back to in upcoming articles.

At Devoxx Belgium 2024, I gave a 50-minute session, and a 3-hour long deep dive with my friend [Cédrick Lunven](https://x.com/clunven) from Datastax (we used the great [Astra DB](https://www.datastax.com/products/datastax-astra) vector database in our demos). You'll find both decks and videos below.

## Code available on Github

All the code presented in those sessions is available in this [Github repository](https://github.com/datastaxdevs/conference-2024-devoxx/)

## RAG: from dumb implementation to serious results

### Abstract

> Embarking on your RAG journey may seem effortless, but achieving satisfying results often proves challenging. Inaccurate, incomplete, or outdated answers, suboptimal document retrieval, and poor text chunking can quickly dampen your initial enthusiasm.
>
> In this session, we'll leverage LangChain4j to elevate your RAG implementations. We'll explore:
>
> - Advanced Chunking Strategies: Optimize document segmentation for improved context and relevance.
> - Query Refinement Techniques: Expand and compress queries to enhance retrieval accuracy.
> - Metadata Filtering: Leverage metadata to pinpoint the most relevant documents.
> - Document Reranking: Reorder retrieved documents for optimal result presentation.
> - Data Lifecycle Management: Implement processes to maintain data freshness and relevance.
> - Evaluation and Presentation: Assess the effectiveness of your RAG pipeline and deliver results that meet user expectations.
>
> Join us as we transform your simplistic RAG experience from one of frustration to delight your users with meaningful and accurate answers.

### Presentation slide deck

{{< speakerdeck a2207c4bc9b9447da5a397107da19d0f >}}

### YouTube video recording

{{< youtube 6_wUUYKBdE0 >}}

## RAG: from dumb implementation to serious results

### Abstract

> It’s easy to get started with Retrieval Augmented Generation, but you’ll quickly be disappointed with the generated answers: inaccurate or incomplete, missing context or outdated information, bad text chunking strategy, not the best documents returned by your vector database, and the list goes on.
>
> After meeting thousands of developers across Europe, we’ve explored those pain points, and will share with you how to overcome them. As part of the team building a vector database we are aware of the different flavors of searches (semantic, meta-data, full text, multimodal) and embedding model choices. We have been implementing RAG pipelines across different projects and frameworks and are contributing to LangChain4j.
>
> In this deep-dive, we will examine various techniques using LangChain4j to bring your RAG to the next level: with semantic chunking, query expansion & compression, metadata filtering, document reranking, data lifecycle processes, and how to best evaluate and present the results to your users.

### Presentation slide deck

{{< speakerdeck 5f7120a2dbeb4ffd917102321231cbc0 >}}

### YouTube video recording

{{< youtube RN7thifOmkI >}}
