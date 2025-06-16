---
title: "Advanced RAG — Sentence Window Retrieval"
date: 2025-02-25T17:01:50+01:00
tags:
  - generative-ai
  - large-language-models
  - machine-learning
  - langchain4j
  - java
  - retrieval-augmented-generation
---

Retrieval Augmented Generation (RAG) is a great way to expand the knowledge of Large Language Models to let them know about your own data and documents. With RAG, LLMs can ground their answers on the information your provide, which reduces the chances of hallucinations.

Implementing RAG is fairly trivial with a framework like [LangChain4j](https://docs.langchain4j.dev/tutorials/rag). However, the results may not be on-par with your quality expectations. Often, you'll need to further tweak different aspects of the RAG pipeline, like the document preparation phase (in particular docs chunking), or the retrieval phase to find the best information in your vector database.

In this first article (hopefully of a series on advanced RAG techniques) I'd like to explore an approach that may yield better results: **sentence window retrieval**, inspired by the technique described in this [article](https://www.linkedin.com/pulse/sentence-window-retrieval-optimizing-llm-performance-rutam-bhagat-v24of/).

> I've explored many techniques in my [advanced RAG techniques]({{<ref "talks/2024/10/14/advanced-rag-techniques/">}}) presentation, if you feel like discovering other techniques that we'll explore in more details in this series.

## Let's step back to naive chunking

First, why do we even split documents in smaller chunks?
We split documents into chunks in RAG because:

- It's easier to find the specific, relevant piece of information within a smaller chunk than a huge document.
- Large Language Models have limited memory. Chunks allow us to feed them just the necessary context, instead of overwhelming them with the whole document.
- Smaller chunks lead to more precise retrieval, delivering more accurate answers.

The naive approach is to split in chunks of a certain amount of characters. For example, on the Wikipedia page of Berlin, a 100-character split might look as follows:

![](/img/rag/naive-chunk-1.png)

If a user asks the question _"What is the population of Berlin?"_, the number of inhabitants is split across two chunks. So neither the first, nor the second chunk would yield the correct information, for the LLM to generate an accurate answer.

An obvious improvement is to use overlapping chunks:

![](/img/rag/naive-chunk-2.png)

The red chunk and the orange chunk overlap: both contain the gray part as well. Which means that the second chunk contains the number (in full) we're interesteded in.

Another possible approach, to avoid splits and overlaps, is to chunk by sentences. After all, human beings write sentences for a good reason, because they bear information that represent a unit of semantic meaning.

![](/img/rag/naive-chunk-3.png)

However, both the chunk with overlap example above, as well as the sentence split expose another flaw: Notice that the pronoun `its`, in the second chunk or the second sentence doesn't carry the information that it actually references `Berlin`. So the pronoun misses an important aspect of the sentence: this is a sentence about the population of Berlin. Not any other city.

An alternative may be to increase the size of the chunk, and/or the size of the overlap, to avoid information to be split across chunks (like the population figure), and to give more context about possible links between sentences (like our pronoun-city). However, the wider the chunks, the more diluted the semantic meaning in the resulting vector embeddings.

With more dillution, it's harder to have query vectors (the user prompt) match the chunks of texts with high similarity values.

## Enters sentence window retrieval

The name of the technique comes from this [article](https://www.linkedin.com/pulse/sentence-window-retrieval-optimizing-llm-performance-rutam-bhagat-v24of/) I mentioned.
But maybe it's not the best name we could find. Maybe something like _wider-context-sliding-window-embedding_ would be more explicit, but that's a mouthful!

Let's have a look at this approach:

![](/img/rag/naive-chunk-4.png)

The idea is as follows:

- We calculate vector embeddings for the sentence in dark green.
- But we save the surrounding sentences in light green (for example, one sentence before, and two after).

At retrieval time, the vector similarity calculation will match better with the dark green sentence (in spite of its missing _Berlin_ aspect).
But the whole light + dark green context will be added in the prompt of the LLM, instead of the single sentence.

The advantages are that:

- We keep on carrying meaningful units of meaning with a few sentences, thus avoiding any key information cut between splits, and semantic dillution of bigger chunks.
- It helps the LLM resolve links between pronouns and their related entity. The LLM knows that we're talking about Berlin here.

## The canonical RAG implementation in LangChain4j

With LangChain4j, the base approach is as follows.
Let's start with the **ingestion phase**:

```java
// Load the document (the Wikipedia page about Berlin)

Document capitalDocument = Document.from(text);

// Define an embedding model to calculate vector embeddings,
// both for the text of the article, and for the user queries

var embeddingModel = VertexAiEmbeddingModel.builder()
    .project(System.getenv("GCP_PROJECT_ID"))
    .endpoint(System.getenv("GCP_VERTEXAI_ENDPOINT"))
    .location(System.getenv("GCP_LOCATION"))
    .publisher("google")
    .modelName("text-embedding-005")
    .build();

// Store the chunks and their vectors in a vector database
// (in this example, we'll use a simple in-memory store)

var embeddingStore = new InMemoryEmbeddingStore<TextSegment>();

// Ingest the document in chunks of 100 characters
// with an overlap of 20 characters,
// use the in-memory vector store,
// and the embedding model for vector calculations

EmbeddingStoreIngestor.builder()
    .documentSplitter(DocumentSplitters.recursive(100, 20))
    .embeddingStore(embeddingStore)
    .embeddingModel(embeddingModel)
    .build()
    .ingest(capitalDocument);
```

This is the naive approach using chunks of 100 characters with overlap.
Let's see what it looks like during the **retrieval phase**:

```java
// Declare the LLM model we want to use

VertexAiGeminiChatModel chatModel = VertexAiGeminiChatModel.builder()
    .project(System.getenv("GCP_PROJECT_ID"))
    .location(System.getenv("GCP_LOCATION"))
    .modelName("gemini-2.0-flash-001")
    .build();

// Create an interface contract
// that LangChain4j will implement for us

interface CapitalsAssistant {
    Result<String> learnAboutCapitals(String query);
}

// AiServices implements the interface
// and binds the LLM, and a content retriever
// that links the embedding model and vector store

CapitalsAssistant assistant =
    AiServices.builder(CapitalsAssistant.class)
        .chatLanguageModel(chatModel)
        .contentRetriever(EmbeddingStoreContentRetriever.builder()
            .embeddingModel(embeddingModel)
            .embeddingStore(embeddingStore)
            .build())
        .build();

// Now we can ask questions
Result<String> response = assistant.learnAboutCapitals(
    "How many inhabitants live in Berlin?");
```

We could also add a memory component, to keep track of the ongoing discussion, it's just one extra line. But here, I stick to just single user questions.

## Let's implement the sentence window retrieval

Now, how can we expand the above code to implement the algorithm?

We need to split the text in sentences, and keep track of the surrounding sentences, as a sliding window, to give extra context to the LLM.
We can store that information as metadata of each text segment.
We must prepare the LLM prompt by inserting the surrounding context, instead of single sentences.

At ingestion phase, we can plug a `TextSegmentTransformer` that transforms our text chunks, to compute and store the surrounding context in the text segment metadata. We need to override both `transform()` and `transformAll()` methods, because we need to modify all chunks together (to get the surrounding sentences):

```java
EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
  .documentSplitter(new DocumentBySentenceSplitter(200, 20))
  .embeddingStore(embeddingStore)
  .embeddingModel(embeddingModel)
  .textSegmentTransformer(new TextSegmentTransformer() {
    @Override
    public TextSegment transform(TextSegment segment) {
      return transformAll(Collections.singletonList(segment))
            .getFirst();
    }

    @Override
    public List<TextSegment> transformAll(List<TextSegment> segments) {
      List<TextSegment> list = new ArrayList<>();
      for (int i = 0; i < segments.size(); i++) {
        TextSegment textSegment = segments.get(i);

        // Create a sliding window of sentences to gather
        // the context surrounding the embedded sentence

        // (2 sentences before, 3 after,
        // but you could make it configurable)
        String context = IntStream.rangeClosed(i - 2, i + 3)
            .filter(j -> j >= 0 && j < segments.size())
            .mapToObj(j -> segments.get(j).text())
            .collect(Collectors.joining(" "));

        // Store the surrounding context as metadata
        // of the text segment (the current chunk)

        Metadata metadata =
            new Metadata(textSegment.metadata().toMap());
        metadata.put(METADATA_CONTEXT_KEY, context);
        list.add(TextSegment.from(textSegment.text(), metadata));
      }
      return list;
    }
  })
  .build();
```

That's a bit of code, but I hope to contribute an implementation to LangChain4j directly, so that you don't have to write this algorithm each time you want to apply it.

Let's focus now on the retrieval phase now, because we need to inject the surrounding context in the LLM prompt, instead of the sentence chunk itself. We need to create a `RetrievalAugmentor`, and configure the `ContentRetriever` we used before, and a `ContentInjector`:

```java
CapitalsAssistant assistant =
  AiServices.builder(CapitalsAssistant.class)
    .chatLanguageModel(chatModel)
    .retrievalAugmentor(DefaultRetrievalAugmentor.builder()

    // the content retriever is defined
    // at the level of the retrieval augmentor

    .contentRetriever(EmbeddingStoreContentRetriever.builder()
      .embeddingModel(embeddingModel)
      .embeddingStore(embeddingStore)
      .build())

    // We create a content injector that injects
    // the surrounding context in the LLM prompt

    .contentInjector((contents, userMessage) -> {

      // Retrieves the surrounding sentences
      // from the text segment's metadata

      String excerpts = contents.stream()
        .map(content ->
          content
            .textSegment()
            .metadata()
            .getString(METADATA_CONTEXT_KEY))
        .collect(Collectors.joining("\n\n"));

      // Customize the prompt for our geography use case

      return PromptTemplate.from("""
        You are a helpful geography assistant
        knowing everything about the capitals of the world.

        Here's the question from the user:
        <question>
        {{userMessage}}
        </question>

        Answer the question using the following information:
        <excerpts>
        {{contents}}
        </excerpts>
        """).apply(Map.of(
          "userMessage", userMessage.singleText(),
          "contents", excerpts
        )).toUserMessage();
    })).build())
  .build();
```

Again, that's a bit of code, but we can make it reusable easily if needed in different contexts.

## Summary

With this _sentence window retrieval_ approach, we calculate and store the vector embedding of a sentence, but we inject a wider surrounding context (a few sentences before and after) into the context of the LLM to generate its response with more information than just the single sentence. This tends to avoid the problem of key pieces of information cut in the middle, and to resolve references between sentences (like a pronoun pointing at a named entity defined earlier).

It's a technique worth experimenting with, to see if it gives better results in your own scenario.
However, before blindly applying a particular technique, be sure to prepare some evaluations: Measure the quality of your RAG pipeline before making changes. Then, measure after having applied a new technique, to see if the answers are better.

We'll have to explore the topic of evaluation another day, but in the meantime, I encourage you to read the blog posts of my colleague Mete Atamel who covered [RAG pipeline evaluation](https://atamel.dev/posts/2025/01-09_evaluating_rag_pipelines/), the [DeepEval](https://atamel.dev/posts/2025/01-14_rag_evaluation_deepeval/) tool, and the [RAG triad metric](https://atamel.dev/posts/2025/01-21_improve-rag-with-rag-triad-metrics/).