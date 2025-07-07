---
title: "Advanced RAG — Hypothetical Question Embedding"
date: 2025-07-06T15:57:28+02:00
tags:
  - generative-ai
  - large-language-models
  - machine-learning
  - langchain4j
  - java
  - retrieval-augmented-generation
---

In the first article of this Advanced RAG series, I talked about an approach I called
[sentence window retrieval]({{<ref "posts/2025/02/25/advanced-rag-sentence-window-retrieval.md">}}),
where we calculate vector embeddings per sentence, but the chunk of text returned
(and added in the context of the LLM) actually contains also surrounding sentences
to add more context to that embedded sentence.
This tends to give a better vector similarity than the whole surrounding context.
It is one of the techniques I'm covering in my talk on [advanced RAG techniques]({{<ref "talks/2024/10/14/advanced-rag-techniques/">}}).

Today, I'd like to cover another technique I often use in **applications which are more Question/Answer focused**,
where users ask questions, to find answers contained in the indexed documents: **Hypothetical Question Embedding**.

This is an approach I first discovered in this article which covers both
[hypothetical question embedding and hypothetical document embedding](https://pixion.co/blog/rag-strategies-hypothetical-questions-hyde) (HyDE, which we might cover in another article later on).
Comparing user queries to hypothetical questions is the technique we'll study today.

## The intuition behind Hypothetical Questions

When explaining vector similarity (or distance), we usually say that embedding vectors of user queries are closer to vector embeddings of text chunks that contain the answer to that query.
It's generally true, and that's why simple fixed-size chunking approaches (with overlap) work usually pretty well enough.
However, this naive approach compares questions to text containing potential answers.

:bulb: Intuitively, wouldn't it be better to **compare user questions to other questions**?
Or to compare an hypothetical answer (even if wrong) to text chunks with the answer?

Let's say you want to embed this chunk of text from the Wikipedia page of Berlin:

> Berlin is the capital and largest city of Germany, by both area and population. With 3.7 million inhabitants, it has the highest population within its city limits of any city in the European Union. The city is also one of the states of Germany, being the third smallest state in the country by area. Berlin is surrounded by the state of Brandenburg, and Brandenburg's capital Potsdam is nearby. The urban area of Berlin has a population of over 4.6 million and is therefore the most populous urban area in Germany. The Berlin-Brandenburg capital region has around 6.2 million inhabitants and is Germany's second-largest metropolitan region after the Rhine-Ruhr region, as well as the fifth-biggest metropolitan region by GDP in the European Union.

The idea is to ask an LLM, like [Gemini](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-pro?utm_campaign=CDR_0x7a40493f_default_b429992869&utm_medium=external&utm_source=blog), to generate questions about this paragraph, with a prompt similar to the following:

> Suggest 10 clear questions whose answer could be given by the user provided text.
> Don't use pronouns, be explicit about the subjects and objects of the question.

You might want to **change the number of questions generated, depending on the length of the chunk of text**,
or if you know that some documents you embed seem to have a higher or lower density of information.
You can also let the LLM figure out on its own how many questions it could ask.

The second sentence of the prompt is critical to avoid the LLM to generate questions with pronouns, like `its population is...`.
You want **_fully-qualified_ named entities**, to have the whole context of the information.

For this paragraph, the LLM could generate 10 questions like the following ones:

> 1. What city is the capital of Germany?
> 2. What is the population of Berlin within the city limits?
> 3. Which city in the European Union has the highest population within its city limits?
> 4. What is Berlin's rank by area among the states of Germany?
> 5. Which German state surrounds the city of Berlin?
> 6. What is the population of the urban area of Berlin?
> 7. What is the most populous urban area in Germany?
> 8. How many inhabitants does the Berlin-Brandenburg capital region have?
> 9. What is Germany's second-largest metropolitan region?
> 10. What is the rank of the Berlin-Brandenburg metropolitan region by GDP in the European Union?

When comparing the user query `What is the population of Berlin` or `How many inhabitants live in Berlin?`,
it would match better (higher similarity) with the second generated question: `What is the population of Berlin within the city limits?`.

**When storing the results in the database with vector support, you will have one record per question.**
You will have the vector embedding of each question, associated with the whole paragraph each time.
There's redundancy here, as the chunk of text is repeated as many times as there are questions.
So this is a technique that uses more space.
And it takes also more time (and potentially higher cost) to embed a whole document as you have to call an LLM for each chunk.
But we'll come back to the pros and cons in the following section.

**Upon retrieval, the user question is compared to all those generated questions.**
**And at prompt augmentation time, it's the text chunk that is returned, not the generated question.**

> :arrow_right: If you want to test this idea of **hypothetical question embeddidng**, feel free to go ahead and try this
> [application](https://hypothetical-questions-1029513523185.europe-west1.run.app/)
> I vibe-coded with [Gemini Canvas](https://gemini.google.com/canvas) (for scaffolding the UI) and
> [Gemini CLI](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/?utm_campaign=CDR_0x7a40493f_default_b429992869&utm_medium=external&utm_source=blog)
> (for creating the server app) and deployed to Cloud Run.
>
> You can:
>
> - enter a chunk of text,
> - generate hypothetical questions for that chunk,
> - compare the vector embeddings between the user query, the document, and the hypothetical questions.
>
> [![](/img/rag/hypothetical-questions-ui.png)](https://hypothetical-questions-1029513523185.europe-west1.run.app/)

## Hypothetical Question embedding vs fixed-sized chunk embedding

What are the pros and cons of each approach?

### Classical Fixed-Sized Chunk Embedding

This is the most straightforward method. You simply split your documents into chunks of a fixed size (e.g., 500 characters) and then create an embedding for each chunk.

**Pros: 👍**

- **Simplicity and speed**: It's easy to implement and computationally efficient, making it great for large datasets.
- **Predictable size**: Uniform chunk sizes make it easy to manage and process without resource spikes.

**Cons: 👎**

- **Context splitting**: This method can cut sentences or even words in half, leading to a loss of meaning and context. However this is generally mitigated thanks to using an overlap between chunks.
- **Loss of coherence**: Arbitrarily splitting text can make it difficult for the model to understand the overall narrative or argument.
- **_"Lost in the middle"_ problem**: Important information can be lost if it's located in the middle of a long document, as the smaller, more focused chunks might not capture the broader context. It can be mitigated with storing and returning a wider surrounding context than what was embedded (i.e. the technique from the [first article]({{<ref "posts/2025/02/25/advanced-rag-sentence-window-retrieval.md">}}) of this series).

### Hypothetical Question Embedding

With this technique, you use a language model to generate questions for each chunk of your document. Then, you embed these questions instead of the document chunks themselves. When a user asks a question, the system compares their query to the embedded hypothetical questions. But when augmenting the context of the LLM with the results of the vector search, you actually return the inital text from which questions were extracted.

**Pros: 👍**

- **Improved alignment**: You are comparing a question to a question, which can lead to better semantic matching than comparing a question to a document chunk. This can significantly improve retrieval accuracy.
- **Addresses the _"Lost in the Middle"_ problem**: By generating questions for all parts of a document, you're more likely to retrieve relevant information regardless of where it is.

**Cons: 👎**

- **Increased index size**: Generating multiple questions per document chunk means your vector index can become much larger, potentially slowing down search and increasing storage costs. This is because you store the chunk of text as many times as the number of questions which were generated.
- **Upfront computational cost**: You need to use a language model to generate all the hypothetical questions, which can be time-consuming and expensive if you use hosted models that you pay by the token.
- **Quality depends on generated questions**: The effectiveness of this method is entirely dependent on the quality of the generated questions. If the language model fails to generate relevant questions, the retrieval will suffer.
- **Non-deterministic questions**: When you re-index your documents (for example because there was an update) even when using the same embedding model, as this approach relies on an LLM, the new batch of questions might be quite different, as the LLM won't necessarily generate the same questions each time.

## Implementation details

The Hypothetical Question approach can be implemented in any language or framework.
But for the sake of this article, I'll be using [LangChain4j](https://docs.langchain4j.dev/) in Java.

You can have a look at the whole [source code](https://github.com/datastaxdevs/conference-2024-devoxx/blob/main/devoxx-rag-naive-to-advanced/src/test/java/devoxx/rag/_3_advanced_rag_ingestion/_37_hypothetical_questions_embedding.java) of this implementation, but I'll explain in details below what's happening.

### At ingestion time

Let's ingest the documents, generate questions, and calculate the vector embeddings.

{{< details summary="Click to view the code and explanations" >}}

The first thing to do is to load the document (I saved the Wikipedia article as a text file):

```java
Document documentAboutBerlin = FileSystemDocumentLoader.loadDocument("berlin.txt", new TextDocumentParser());
```

Let's configure the large language model, here with Gemini from Vertex AI,
using a response schema, to force the model to return a JSON array of hypothetical question strings:

```java
VertexAiGeminiChatModel gemini = VertexAiGeminiChatModel.builder()
    .project(System.getenv("GCP_PROJECT_ID"))
    .location(System.getenv("GCP_LOCATION"))
    .modelName(MODEL_GEMINI_FLASH)
    .maxRetries(5)
    .responseSchema(Schema.newBuilder()
        .setType(Type.ARRAY)
        .setItems(Schema.newBuilder().setType(Type.STRING).build())
        .build())
    .build();
```

The `QuestionParagraph` record will hold a pair of question and the current text paragraph whose content can answer the question:

```java
record QuestionParagraph(
    String question,
    TextSegment paragraph
) {}
```

The question/paragraph pairs are held in a list:

```java
List<QuestionParagraph> allQuestionParagraphs = new ArrayList<>();
```

I'm splitting the document into paragraphs, with paragraphs no longer than 2000 characters, and with an overlap of 100 characters, when the threshold is hit:

```java
DocumentByParagraphSplitter splitter =
    new DocumentByParagraphSplitter(2000, 100);
List<TextSegment> paragraphs = splitter.split(documentAboutBerlin);
```

Now comes the interesting part!
For each paragraph, I ask the LLM to generate 10 questions, and I store the question/paragraphs pairs in the `allQuestionParagraphs` list:

```java
for (TextSegment paragraphSegment : paragraphs) {
    ChatResponse aiResult = gemini.chat(
        SystemMessage.from("""
            Suggest 10 clear questions whose answer could be given
            by the user provided text.

            Don't use pronouns, be explicit about the subjects
            and objects of the question.
            """),
        UserMessage.from(paragraphSegment.text())
    );
    String[] questions =
        gson.fromJson(aiResult.aiMessage().text(), String[].class);

    for (int i = 0; i < questions.length; i++) {
        String question = questions[i];
        allQuestionParagraphs.add(
            new QuestionParagraph(question, paragraphSegment));
    }
}
```

The other important piece is to calculate the vector embeddings of the questions,
but save the text of the paragraph in the embedding vector store:

```java
List<TextSegment> embeddedSegments = allQuestionParagraphs.stream()
    .map(questionParagraph -> TextSegment.from(
        questionParagraph.question(),
        new Metadata().put(
            PARAGRAPH_KEY, questionParagraph.paragraph().text())))
    .toList();

List<Embedding> embeddings =
    embeddingModel.embedAll(embeddedSegments).content();
embeddingStore.addAll(embeddings, embeddedSegments);
```

I'm using the `text-embedding-004` model (configured elsewhere in the code).
You can use also `text-embedding-005` or the new `gemini-embedding-01` model,
but the latter lacks batching for now, so you can't embed several text segments at once.

The key aspect to pay attention to is that I store extra metadata: the actual paragraph.
But it's really the hypothetical question whose embedding vector is calculated.
But the metadata will be useful at retrieval time, to inject the paragraph in the LLM prompt.

{{</details>}}

### At retrieval time

Now that the ingestion is done, let's have a look at the retrieval phase, when users ask questions.

{{< details summary="Click to view the code and explanations" >}}

Let's use the low-level components of LangChain4j to do the search:

```java
EmbeddingSearchResult<TextSegment> searchResults = embeddingStore.search(EmbeddingSearchRequest.builder()
    .maxResults(4)
    .minScore(0.7)
    .queryEmbedding(embeddingModel.embed(queryString).content())
    .build());
```

This means we're calculating the vector embedding of `queryString` (the user's question), and compare it with the other vectors stored in the database. We want to retrieve only 4 results with a minimum similarity score of 0.7 (value ranging between 0 and 1).

> :warning: A very important remark: be sure to **use the same embedding model for both ingestion and retrieval**.
> Otherwise the vector embedding values will likely be drastically different, and will give totally garbage results.

Now it's time to do the prompt augmentation, by injecting all the paragraphs associated with the closest vectors of the query:

Concatenate all the relevant paragraphs:

```java
String concatenatedExtracts = searchResults.matches().stream()
    .map(match -> match.embedded().metadata().getString(PARAGRAPH_KEY))
    .distinct()
    .collect(Collectors.joining("\n---\n", "\n---\n", "\n---\n"));
```

And augment the prompt with those extracts:

```java
UserMessage userMessage = PromptTemplate.from("""
    You must answer the following question:
    {{question}}

    Base your answer on the following documentation extracts:
    {{extracts}}
    """).apply(Map.of(
    "question", queryString,
    "extracts", concatenatedExtracts
)).toUserMessage();
```

At the end, it's time to ask the LLM to formulate a response with this augmented prompt:

```java
String response = chatModel.chat(userMessage).aiMessage().text();
```

And voilà!

{{</details>}}

## Fixed chunk embedding or Hypothetical Question Embedding?

The question I often get is to know which technique should be used: fixed chunking, hypothetical question embedding, or another?
I'll reply with the typical consultant answer: **it depends!**

That's the point where I'll tell you that **evaluation is key!**
Hypothetical Question embedding typically work better for applications that are indeed Question/Answer focused.
If users ask questions about their data (let's say, an HR chatbot to ask questions about the vacation policy)
this technique works well.
But maybe for applications where the semantic search is more about finding similar documents, this might not yield the same kind of performance.

It's important to run evaluation on your data, with typical user queries, and check which technique yields better results.
We might cover evaluation in another article, later on.

> :arrow_right: If you want to learn more about evaluation techniques, be sure to check out the [articles](https://atamel.dev/)
> from my colleague [Mete Atamel](https://x.com/meteatamel).

## Going forward

- Play with the [hypothetical question application](https://hypothetical-questions-1029513523185.europe-west1.run.app/)
  I deployed on [Cloud Run](https://cloud.google.com/run?utm_campaign=CDR_0x7a40493f_default_b429992869&utm_medium=external&utm_source=blog) to see the impact on vector similarity.
- Have another read of my article on the
  [sentence window retrieval]({{<ref "posts/2025/02/25/advanced-rag-sentence-window-retrieval.md">}}) technique,
  to see if it fits better with the kind of documents you have in your corpus.
- You can also watch the [talk on advanced RAG techniques]({{<ref "talks/2024/10/14/advanced-rag-techniques/">}}),
  as well as the slides, to see all the other techniques that can be combined.
- But never forget to prepare evaluations on your data, with typical user queries, to compare which techniques yield better results!
