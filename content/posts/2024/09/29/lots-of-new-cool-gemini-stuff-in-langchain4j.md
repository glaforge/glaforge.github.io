---
title: "Lots of new cool Gemini stuff in LangChain4j 0.35.0"
date: 2024-09-25T13:41:19+02:00
tags:
  - generative-ai
  - langchain4j
  - java
  - google-cloud
  - large-language-model
  - gemini

similar:
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
  - "posts/2024/07/05/latest-gemini-features-support-in-langchain4j.md"
  - "posts/2026/02/06/latest-gemini-and-nano-banana-enhancements-in-langchain4j.md"
---

While [LangChain4j](https://docs.langchain4j.dev/) 0.34 introduced my
[new Google AI Gemini module](http://localhost:1313/posts/2024/09/05/new-gemini-model-in-langchain4j/),
a new 0.35.0 version is already here today, with some more cool stuff for Gemini and Google Cloud!

Let's have a look at what's in store!

## Gemini 1.5 Pro 002 and Gemini 1.5 Flash 002

This week, [Google announced](https://developers.googleblog.com/en/updated-production-ready-gemini-models-reduced-15-pro-pricing-increased-rate-limits-and-more/)
the release of the new versions of the Google 1.5 models:
* `google-1.5-pro-002`
* `google-1.5-flash-002`

Of course, both models are supported by LangChain4j!
The Google AI Gemini module also supports the `gemini-1.5-flash-8b-exp-0924` 8-billion parameter model.

Versions `002` come with:
* much improved math and reasoning capabilities \
  (7%-20% increase depending on the benchmark),
* 2x faster output, and 3x lower latency,
* and also roughly a 50% price cut!

## Google Cloud Storage document loader

When implementing Retrieval Augmented Generation (RAG), you must load the documents from somewhere.
You can feed the docs directly in the context, but LangChain4j comes with the notion of [document loaders](https://docs.langchain4j.dev/tutorials/rag#document-loader).
There are existing document loaders for the file system, for files at remote URLs, or source files stored in Github.

In this release, I've implemented a **Google Cloud Storage document loader**,
which lets you reference documents stored inside cloud storage buckets.

Create a GCS document loader with the new builder:

```java
var gcsLoader = GoogleCloudStorageDocumentLoader.builder()
    .project(System.getenv("GCP_PROJECT_ID"))
    .build();
```

Then you can load a single document, and parse it:

```java
Document document = gcsLoader.loadDocument(
    "BUCKET_NAME", "FILE_NAME.txt", new TextDocumentParser());
```

All the documents in a bucket:

```java
List<Document> documents = gcsLoader.loadDocuments(
    "BUCKET_NAME", new TextDocumentParser());
```

Or just the a list of files filtered with a _glob_ pattern:

```java
List<Document> documents = gcsLoader.loadDocuments(
    "BUCKET_NAME", "*.txt", new TextDocumentParser());
```

## Vertex AI Ranking API

When implementing Retrieval Augmented Generation (RAG), your vector database returns a certain number of results.
They are usually sorted by vector similarity.
But it's not necessarily because the vectors have the highest similarity, that they are necessarily the best matches to answer a user query.
In order to palliate this problem, there are ranking or reranking APIs and models that exist to order results according to how well they match the query.

The Vertex AI platform from Google Cloud offers a [ranking API](https://cloud.google.com/generative-ai-app-builder/docs/ranking)
for that purpose, a little known API that deserves more awareness.
I implemented a `ScoringModel` for this Vertex AI Ranking API:

```java
VertexAiScoringModel scoringModel = VertexAiScoringModel.builder()
    .projectId(System.getenv("GCP_PROJECT_ID"))
    .projectNumber(System.getenv("GCP_PROJECT_NUMBER"))
    .projectLocation(System.getenv("GCP_LOCATION"))
    .model("semantic-ranker-512")
    .build();

Response<List<Double>> score = scoringModel.scoreAll(Stream.of(
        "The sky appears blue due to a phenomenon called Rayleigh " +
        "scattering. Sunlight is comprised of all the colors of " +
        "the rainbow. Blue light has shorter wavelengths than other " +
        "colors, and is thus scattered more easily.",

        "A canvas stretched across the day,\n" +
        "Where sunlight learns to dance and play.\n" +
        "Blue, a hue of scattered light,\n" +
        "A gentle whisper, soft and bright."
        ).map(TextSegment::from).collect(Collectors.toList()),
    "Why is the sky blue?");

// [0.8199999928474426, 0.4300000071525574]
```

In the example above, a user asks _why the sky is blue_.
The Ranking API attempts to determine which of two excerpts best matches this question.
The first excerpt appears to be an explanation of this celestial phenomenon, while the second sounds more like a poem.
When scoring these text fragments, we observe that the first one has a higher value (0.82 vs. 0.43).

It is also possible to score just one piece of text with the `score(text, query)` and `score(segment, query)` methods.

Now what's interesting is that this LangChain4j notion of scoring models is also well integrated in the RAG pipeline:

```java
VertexAiScoringModel scoringModel = VertexAiScoringModel.builder()
    .projectId(System.getenv("GCP_PROJECT_ID"))
    .projectNumber(System.getenv("GCP_PROJECT_NUM"))
    .projectLocation(System.getenv("GCP_LOCATION"))
    .model("semantic-ranker-512")
    .build();

ContentAggregator contentAggregator =
    ReRankingContentAggregator.builder()
        .scoringModel(scoringModel)
        ...
        .build();

RetrievalAugmentor retrievalAugmentor =
    DefaultRetrievalAugmentor.builder()
        ...
        .contentAggregator(contentAggregator)
        .build();

return AiServices.builder(Assistant.class)
    .chatLanguageModel(...)
    .retrievalAugmentor(retrievalAugmentor)
    .build();
```

When creating the AI service, you specify the chat model to use.
Additionally, you can integrate a _retrieval augmentor_, which allows you to configure a _content aggregator_.
The content aggregator, in turn, can specify a _scoring model_.
This process involves three steps, but it enables you to leverage the ranking of semantic search results when implementing RAG.
This means you can prioritize the most relevant results based on their semantic similarity, not solely on their vector similarity.

## New parameters for the Vertex AI embedding models

Embedding models are critical for RAG, and LangChain4j has had support for the Google Cloud Vertex AI embedding models for a long time.
But there are a couple of new flags that have recently been introduced:

```java
EmbeddingModel embeddingModel = VertexAiEmbeddingModel.builder()
    .project(PROJECT_ID)
    .location("us-central1")
    .publisher("google")
    .modelName(MODEL_NAME)
    .autoTruncate(true)
    .outputDimensionality(512)
```

The `autoTruncate(true)` method automatically truncates text to embed to a maximum of 2048 tokens.
If your input is longer than this limit, you would get an error from the model.
With auto-truncation, no more error, but if your text is truncated, you might miss a bit of meaning from the part that was cut off.

The other new method is `outputDimensionality(512)`.
The Vertex AI embedding models usually default to 768-dimensional vectors.
However, our [latest embedding models](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings)
are [_Matryoshka_ embedding models](https://huggingface.co/blog/matryoshka),
which means that the most meaningful values in the vector comes first.
So when you do vector comparisons, you can make calculations quicker if you focus on the lowest dimensions,
and with this new method, you can just return vectors with less dimensions directly.

## Google AI embedding model

Speaking of embedding models, if you use the Google AI Gemini model instead of the Vertex AI flavor,
you can now also access our embedding models without relying on the Vertex AI models,
thanks to the new embedding model for Google AI:

```java
var embeddingModel = GoogleAiEmbeddingModel.builder()
    .apiKey(GOOGLE_AI_GEMINI_API_KEY)
    .modelName("embedding-001")
    .maxRetries(3)
    .logRequestsAndResponses(true)
    .titleMetadataKey("title")
    .taskType(GoogleAiEmbeddingModel.TaskType.RETRIEVAL_DOCUMENT)
    .outputDimensionality(512)
    .build();
```

This new embedding model is the same as the one coming from Vertex AI, and has the same feature set.

## Google AI Gemini token count estimation and tokenizer

The Google AI Gemini model implements the `TokenCountEstimator` interface,
which means you can use the `estimateTokenCount()` method to count tokens:

```java
var gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(GOOGLE_AI_GEMINI_API_KEY)
    .modelName("gemini-1.5-flash")
    .build();

int countedTokens = gemini.estimateTokenCount(
    "What is the capital of France?");
```

There is also now a `GoogleAiGeminiTokenizer` class, implementing the misnamed `Tokenizer` interface
(misnamed because it's not tokenizing text, it's just counting tokens):

```java
var geminiTokenizer = GoogleAiGeminiTokenizer.builder()
    .apiKey(GOOGLE_AI_GEMINI_API_KEY)
    .modelName("gemini-1.5-flash")
    .build();

int count = tokenizer.estimateTokenCountInText("Hello world!");
```

Note that both the `estimateTokenCount()` method and the `GoogleAiGeminiTokenizer` call a remote API endpoint.
They don't use a tokenizer class to count the tokens, so those calls incur some network hops.

What's interesting with the `Tokenizer`s is that they can be used by document splitters to split documents according to the number of tokens, rather than by characters or other boundaries:

```java
DocumentSplitter splitter = DocumentSplitters.recursive(
    maxSegmentSizeInTokens,
    maxOverlapSizeInTokens,
    geminiTokenizer);
```

Currently, only the Google AI module implements this `Tokenizer` interface, but it can be used with the Vertex AI Gemini module as well.
But later down the road, I think I'll also implement it for the Vertex AI module.

## Chat listener support

Both the Google AI Gemini and the Vertex AI modules implement the new chat listener support.

* Vertex AI Gemini:

```java
VertexAiGeminiChatModel.builder()
    .project(System.getenv("GCP_PROJECT_ID"))
    .location(System.getenv("GCP_LOCATION"))
    .modelName("gemini-1.5-pro-002")
    .listeners(singletonList(listener))
    .build();
```

* Google AI Gemini:

```java
GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_API_KEY"))
    .modelName("gemini-1.5-flash-002")
    .listeners(singletonList(listener))
    .build();
```

Let's have a look at the listener interface, which allows you to listen to model requests, responses, and errors:

```java
public interface ChatModelListener {
  default void onRequest(ChatModelRequestContext reqContext) {...}
  default void onResponse(ChatModelResponseContext respContext) {...}
  default void onError(ChatModelErrorContext errContext) {...}
}
```

The various `*Context` parameters contain various details about how the model was parameterized, what the prompt was, or what error was encountered.

It might be interesting to follow the recent [OpenTelemetry GenAI recommendations](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
and implement a listener that directly plugs into your observability solution!

## Enum structured output

I'll finish the laundry list of features with the **enum** structured output.

The Gemini models have great support for structured output.
Not only can you ask for JSON outputs, but you can also specify a JSON schema so that the model follows that schema for generating its JSON response.
This is of utmost importance for deterministic parseable results that fit well with your strongly typed programming language.

Gemini lets you return arbitray JSON objects and arrays.
But for tasks like classification or sentiment analysis, it is also able to return a single enum value, rather than a JSON object that would have a property containing the value.

* Vertex AI Gemini:

```java
 VertexAiGeminiChatModel model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("GCP_PROJECT_ID"))
    .location(System.getenv("GCP_LOCATION"))
    .modelName(GEMINI_1_5_PRO)
    .responseSchema(Schema.newBuilder()
        .setType(Type.STRING)
        .addAllEnum(Arrays.asList("POSITIVE", "NEUTRAL", "NEGATIVE"))
        .build())
    .build();

Response<AiMessage> response = model.generate(asList(
    SystemMessage.from(
        "Your role is to analyse the sentiment of user's messages"),
    UserMessage.from(
        "This is super exciting news, congratulations!")
));

System.out.println(response.content().text());
// POSITIVE
```

* Google AI Gemini:

```java
GoogleAiGeminiChatModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_API_KEY"))
    .modelName("gemini-1.5-flash")
    .responseFormat(ResponseFormat.builder()
        .type(JSON)
        .jsonSchema(JsonSchema.builder()
            .rootElement(JsonObjectSchema.builder()
                .properties(new LinkedHashMap<String, JsonSchemaElement>() {{
                    put("sentiment", JsonEnumSchema.builder()
                        .enumValues("POSITIVE", "NEUTRAL", "NEGATIVE")
                        .build());
                }})
                .build())
            .build())
        .build())
    .build();

ChatResponse response = gemini.chat(ChatRequest.builder()
    .messages(
        SystemMessage.from(
            "Your role is to analyse the sentiment of user's messages"),
        UserMessage.from(
            "This is super exciting news, congratulations!"
        )
    )
    .build());

System.out.println(response.aiMessage().text());
// POSITIVE
```

This is particularly useful for all sorts of classification tasks!

## Documentation updates

As I often used to say when working on the Apache Groovy project:

> "A feature doesn't exist if it's not documented."
>
> — Guillaume Laforge

With that motto in mind, I thought it was high time that I expanded the documentation for the Gemini related pages of the LangChain4j documentation:

* [Google Cloud Storage document loader](https://docs.langchain4j.dev/integrations/document-loaders/google-cloud-storage)
* [Google Cloud Ranking API](https://docs.langchain4j.dev/integrations/scoring-reranking-models/vertex-ai)
* [Vertex AI embedding models](https://docs.langchain4j.dev/integrations/embedding-models/google-vertex-ai)
* [Google AI Gemini models](https://docs.langchain4j.dev/integrations/language-models/google-ai-gemini)
* [Google Cloud Vertex AI Gemini models](https://docs.langchain4j.dev/integrations/language-models/google-vertex-ai-gemini)

## Tell me what you use LangChain4j's Gemini support for!

I'm really curious about what you are developing with LangChain4j, and even more so, if you're using the various Gemini components.
Don't hesitate to reach out to me, via the social media platforms mentioned below!
I'm also interested in the features you'd like to see prioritized and implemented.