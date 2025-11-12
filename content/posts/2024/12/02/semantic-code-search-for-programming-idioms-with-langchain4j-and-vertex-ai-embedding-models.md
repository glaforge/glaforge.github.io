---
title: "Semantic code search for Programming Idioms with LangChain4j and Vertex AI embedding models"
date: 2024-12-02T14:42:02+01:00
image: /img/gemini/search-robot-nuts-bolts-code.png
tags:
  - java
  - large-language-models
  - machine-learning
  - langchain4j
  - generative-ai

similar:
  - "posts/2024/05/28/grounding-gemini-with-web-search-in-langchain4j.md"
  - "posts/2025/09/08/in-browser-semantic-search-with-embeddinggemma.md"
  - "posts/2025/02/15/the-power-of-large-context-windows-for-your-documentation-efforts.md"
---

_By Guillaume Laforge & Valentin Deleplace_

The [Programming Idioms](https://programming-idioms.org/coverage) community website created by [Valentin](https://www.linkedin.com/in/deleplacevalentin/) lets developers share typical implementations in various programming languages for usual tasks like printing the famous “Hello World!” message, counting the characters in a string, sorting collections, or formatting dates, to name a few. And many more: there are currently 350 idioms, covering 32 programming languages. It’s a nice way to discover how various languages implement such common tasks!

The website features a typical keyword-based search feature, which is able to search through idiom descriptions, source code, comments, and tags. However, we (Guillaume & Valentin) were curious to see if we could enhance the search with a more semantic focus, taking advantage of Vertex AI **embedding models**, and their ability to **search through code from natural language queries**. With a semantic search, you’re not limited to results that match some keywords from a query, but you’ll get results even when using synonyms, or descriptions of what the code is doing.

Embedding models take a string in input, and generate a multidimensional floating point vector representation of that string. What’s interesting with those vectors is that input strings whose vectors are close to each other (for instance via a [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) calculation) are generally close to each other semantically speaking as well. This is why you can create **semantic searches**: you can search for semantically similar strings, even if they don’t share the same keywords and use synonyms instead. You can explore Guillaume’s article “[The power of embeddings: How numbers unlock the meaning of data](https://glaforge.dev/posts/2024/07/02/the-power-of-embeddings-how-numbers-unlock-the-meaning-of-data/)” to learn more about embedding models.

In the code shown in this article, we’ll be coding in Java, and we will be using the [LangChain4j](https://docs.langchain4j.dev/) open source framework. You can view the [full source code in this gist](https://gist.github.com/glaforge/4e45fa4222dd803d6d8bbf2b9335e90d), and below, we’ll highlight the key elements of this program.

We’ll be using the latest version of Google Cloud Vertex AI embedding models: `text-embedding-005`. Why is it important? Because this new version supports a new [task type](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings): `CODE_RETRIEVAL_QUERY`.

With this embedding model, there are different task types that optimize the embedding of text for different purposes, like for document retrieval, question & answering, fact verification… and now for code retrieval queries. **With this code retrieval query task type, you can search for code snippets with natural language**! This will come in handy for us when we want to do natural language semantic search throughout our programming idioms!

Before implementing our smart code search, if you want to learn more about the new task types of our embedding models, please go check this video:

_New "task type" embedding from the DeepMind team improves RAG search quality_
{{< youtube BgfSCTdlvAA >}}

## Let’s collect the idioms

The [Programming Idioms](https://programming-idioms.org/) website exposes a simple REST API. An endpoint allows you to get all the idioms in one HTTP GET call, but you can also access individual idioms via another GET request:

- https://programming-idioms.org/api/idioms/all — Lists all the idioms
- https://programming-idioms.org/api/idiom/202 — A single idiom identified by its ID

Idioms contain various fields like their title, description, keywords, and provide one or more implementations in various programming languages.

For example, the “Sum of squares” idiom starts like this:

```json
{
  Id: 202,
  OrigId: 0,
  Title: "Sum of squares",
  LeadParagraph: "Calculate the sum of squares _s of _data, an array of floating point values.",
  ExtraKeywords: "reduce",
  Author: "Bart",
  CreationDate: "2019-09-28T20:37:11.726064Z",
  LastEditor: "programming-idioms.org",
  EditSummary: "New Java implementation by user [reilas]",
  LastEditedImplID: 6839,
  OriginalAttributionURL: "",
  Picture: "",
  ImageURL: "",
  ImageWidth: 0,
  ImageHeight: 0,
  ImageAlt: "",
  Version: 40,
  VersionDate: "2024-11-08T22:54:02.691646Z",
  Implementations:
  [
    {
      Id: 3466,
      OrigId: -1,
      Author: "Bart",
      CreationDate: "2019-09-28T20:37:11.726064Z",
      LastEditor: "programming-idioms.org",
      LanguageName: "Pascal",
      CodeBlock: "var
  data: array of double;
...
  s := SumOfSquares(data);
...",
      OriginalAttributionURL: "",
      DemoURL: "",
      DocumentationURL: "",
      AuthorComment: "",
      Version: 2,
      VersionDate: "2021-12-07T10:07:15.952746Z",
      Rating: 0,
      Checked: false,
      ImportsBlock: "uses math;",
      PictureURL: "",
      Protected: false
    },
    …
  ]
}
```

What’s interesting for us, for a semantic code search engine, are the following idiom fields:

- `Id` — the unique ID of the idiom
- `Title` — that describes the idiom in a short way
- `LeadParagraph` — which is a more detailed definition of the idiom
- ExtraKeywords — words related to the idiom, for search

And for the implementations, the fields:

- `Id` — the unique ID of the idiom implementation
- `CodeBlock` — which contains the source code of the implemented idiom
- `LanguageName` — which says which programming language was used for that implementation
- AuthorComment — a small explanation about the implementation

We can represent those two notions, idiom & implementations, as Java records:

```java
record Idiom(
    @SerializedName("Id")
    long id,
    @SerializedName("Title")
    String title,
    @SerializedName("LeadParagraph")
    String description,
    @SerializedName("ExtraKeywords")
    String keywords,
    @SerializedName("Implementations")
    Implementation[] implementations
) {
    record Implementation(
        @SerializedName("Id")
        long id,
        @SerializedName("LanguageName")
        String language,
        @SerializedName("CodeBlock")
        String code,
        @SerializedName("AuthorComment")
        String comment

    ) {
    }
}
```

The annotations are here to map between the JSON key names and the Java record field names.

We load all the idioms from the website, and we create `TextSegment`s, which is the class used by [LangChain4j](https://docs.langchain4j.dev/) to pass to the embedding model for creating vectors.

```java
Idiom[] idioms = loadIdioms();

for (Idiom idiom : idioms) {
    System.out.println("-> " + idiom.title);

    for (var implementation : idiom.implementations) {
        var implementation = idiom.implementations[j];
        if (implementation.code != null &&
               !implementation.code.isBlank()) {
            allCodeSegments.add(new TextSegment(
                implementation.code,
                new Metadata()
                    .put("idiomId", idiom.id)
                    .put("title", idiom.title)
                    .put("description", idiom.description)
                    .put("titleAndDescription",
                        idiom.title + ": " + idiom.description)
                    .put("keywords", idiom.keywords)
                    .put("implementationId", implementation.id)
                    .put("language", implementation.language)
            ));
        }
    }
}
```

Notice that we also add some metadata. Not only do we embed the code snippets, but we also add some extra information like the title, description, keywords, or programming language. This will be useful for showing the results found during the semantic search.

We create a metadata field that concatenates the title and description of the idiom, as this is useful meta-information that the embedding model can use when calculating the vector embeddings. The `text-embedding-005` model pays attention to that information, and this will influence the calculations and enrich the semantic context of the vector embedding.

## Calculating embedding vectors

To compute those embeddings, we configure and use the `text-embedding-005` embedding model offered by Vertex AI. We define two instances of the model, with two distinct task types:

```java
private static final VertexAiEmbeddingModel EMBEDDING_MODEL =
    VertexAiEmbeddingModel.builder()
        .project(System.getenv("GCP_PROJECT_ID"))
        .location(System.getenv("GCP_LOCATION"))
        .modelName("text-embedding-005")
        .publisher("google")
        .taskType(VertexAiEmbeddingModel.TaskType.RETRIEVAL_DOCUMENT)
        .titleMetadataKey("titleAndDescription")
        .maxSegmentsPerBatch(150)
        .build();

private static final VertexAiEmbeddingModel EMBEDDING_MODEL_FOR_RETRIEVAL =
    VertexAiEmbeddingModel.builder()
        .project(System.getenv("GCP_PROJECT_ID"))
        .location(System.getenv("GCP_LOCATION"))
        .modelName("text-embedding-005")
        .publisher("google")
        .taskType(VertexAiEmbeddingModel.TaskType.CODE_RETRIEVAL_QUERY)
        .titleMetadataKey("titleAndDescription")
        .build();
```

We use the `EMBEDDING_MODEL` with a `RETRIEVAL_DOCUMENT` task type for the calculation of the vector embedding, but we use the `EMBEDDING_MODEL_FOR_RETRIEVAL` instance one, with a `CODE_RETRIEVAL_QUERY` task type for the retrieval.

The [documentation on task types](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/task-types#benefits_of_task_types) explains that it helps optimize the vector embedding calculation for different types of tasks. And this is what allows us to compare natural language queries like `"calculating string length"` with the actual code that computes the length of a string. Task types put the questions and answers closer in the embedding space.

We calculate all the embeddings in batch with:

```java
InMemoryEmbeddingStore<TextSegment> embeddingStore =
    new InMemoryEmbeddingStore<>();
List<Embedding> allEmbeddings =
    EMBEDDING_MODEL.embedAll(allCodeSegments).content();
embeddingStore.addAll(allEmbeddings, allCodeSegments);
embeddingStore.serializeToFile(filePath);
```

## Embedding the query and searching

With vector databases, when doing a search, we compare a vector embedding of what we’re searching for, with all the vector embeddings stored. So now that we have all our code snippets embedded, we need to compare an embedding of a user query to all those snippets. The in-memory embedding store can calculate cosine similarities between vectors for us.

Simplifying the code from the [gist](https://gist.github.com/glaforge/4e45fa4222dd803d6d8bbf2b9335e90d) a little, what we do here is to calculate the embedding for the user query, and prepare an embedding search request:

```java
Embedding queryEmbedding =
    EMBEDDING_MODEL_FOR_RETRIEVAL.embed(question)
        .content();

var searchRequestBuilder =
    EmbeddingSearchRequest.builder()
        .maxResults(5)
        .minScore(0.8)
        .queryEmbedding(queryEmbedding)
        .build();

EmbeddingSearchResult<TextSegment> searchResult =
    embeddingStore.search(searchRequest);
```

We chose to return only the 5 best search results, whose minimal score is above 0.8 (the score is a value between 0 and 1, with 1 being the highest). Then, we can iterate over the hits, and display the results for this search with some formatting:

```java
searchResult.matches().forEach(match -> {
    TextSegment matchedSegment = match.embedded();

    System.out.format("""
            ——— %s ——— (score: %4.5f) —————————
            Title: %s

            Description: %s

            Code:
            %s

            """,
        matchedSegment.metadata().getString("language"),
        match.score(),
        matchedSegment.metadata().getString("title"),
        matchedSegment.metadata().getString("description"),
        matchedSegment.text()
    );
});
```

We can try different queries:

- How can I make an HTTP POST request?
- How to count the characters in a string?
- How to use the LibXML parser in Perl?

For example, for the first query, the top results look interesting, with some good scores:

```
——— Java ——— (score: 0.85341) —————————
Title: Make HTTP POST request

Description: Make a HTTP request with method POST to the URL u

Code:
String s = HttpClient.newHttpClient().send(HttpRequest.newBuilder()
                        .uri(URI.create(u))
                        .POST(HttpRequest.BodyPublishers.ofString(content))
                        .build(), HttpResponse.BodyHandlers.ofString())
                .body();

——— D ——— (score: 0.84189) —————————
Title: Make HTTP POST request

Description: Make a HTTP request with method POST to the URL u

Code:
auto response = post(u, content);

——— Go ——— (score: 0.84010) —————————
Title: Make HTTP POST request

Description: Make a HTTP request with method POST to the URL u

Code:
response, err := http.Post(u, contentType, body)

——— Go ——— (score: 0.83938) —————————
Title: Make HTTP POST request

Description: Make a HTTP request with method POST to the URL u

Code:
response, err := http.PostForm(u, formValues)

——— Lisp ——— (score: 0.83770) —————————
Title: Make HTTP POST request

Description: Make a HTTP request with method POST to the URL u

Code:
(dex:post u)
```

Our search implementation found the right idioms and implementations.

## Restricting the search with metadata filtering

Now if we try to be more specific, like our question that asks explicitly to search for a specific programming language like Perl, the search would yield results in all programming languages. But the user wanted only Perl examples! Instead, to have better and more precise results, we can take advantage of LangChain4j’s [metadata filtering](https://docs.langchain4j.dev/integrations/embedding-stores/).

You remember that we added various metadata information to our embedded text segments? We included the programming language used in the code snippet in a language metadata field. With metadata filtering, we can focus the search only on a subset of vector embeddings whose language metadata field matches the programming language we’re interested in.

Let’s update our search query as follows:

```java
var searchRequestBuilder = EmbeddingSearchRequest.builder()
    .maxResults(5)
    .minScore(0.8)
    .queryEmbedding(queryEmbedding)
    .filter(new IsEqualTo("language",
        programmingLanguageRecognised))
    .build();
```

We added a `filter()` method, that checks that the language is equal to some value. But then, it means we have to know up-front that the user wants results just for one specific programming language. We could have some kind of UI element that users have to fill to select the programming language. But in our search query, we had a user providing the programming language directly in that query: `"How to use the LibXML parser in Perl?"`

In such a situation, we can’t rely on a UI component or CLI parameter, we have to guess the programming language requested from the query string itself. This is where Gemini can come to the rescue, with a little bit of prompting, we can ask the generative model to tell us if a programming language is present in the query, and which one.

First, let’s have a look at the programming languages offered by Programming Idioms:

```java
private static final List<String> KNOWN_PROGRAMMING_LANGUAGES =
    List.of("UNKNOWN",
        "Go", "Rust", "Python", "Perl", "Ruby", "Java", "JS",
        "C#", "Dart", "Pascal", "PHP", "C++", "Haskell", "D",
        "Lua", "Clojure", "Fortran", "Elixir", "Kotlin",
        "Erlang", "C", "Lisp", "VB", "Groovy", "Ada", "Scala",
        "Scheme", "Smalltalk", "Obj-C", "Cobol", "Prolog", "Caml"
);
```

We added an `UNKNOWN` value, when the language is not specified or recognised.

Now we configure a Gemini 1.5 Flash model, specifying a response schema to restrict the model’s answer to a value contained in the language enumeration of possible programming languages:

```java
private static final ChatLanguageModel GEMINI_MODEL =
    VertexAiGeminiChatModel.builder()
        .project(System.getenv("GCP_PROJECT_ID"))
        .location(System.getenv("GCP_LOCATION"))
        .modelName("gemini-1.5-flash-002")
        .responseSchema(Schema.newBuilder()
            .setType(Type.STRING)
            .addAllEnum(KNOWN_PROGRAMMING_LANGUAGES)
            .build())
        .build();
```

Let’s prompt Gemini to find the programming language in the user query (if present):

```java
String programmingLanguageRecognised =
    GEMINI_MODEL.generate(
        SystemMessage.from("""
            Your role is to classify the user message to decide
            if it is a question about a particular programming
            language or not.
            If you don't know, or if the programming language
            is not specified, reply with `UNKNOWN`, otherwise
            reply with just the name of the programming
            language recognized among the following list:
            """ + KNOWN_PROGRAMMING_LANGUAGES),
        UserMessage.from(question)
    ).content().text();
```

Gemini will either reply with `UNKNOWN` if no programming language was mentioned, or with the language it has recognized.

Now, when making a search for an idiom in a particular language, only implementations in that language are returned, giving much better results, in line with the expectations of the user.

## Possible further improvements

Where can we go from there? We can make the search a little bit snappier, or further enhance the quality of the search results.

Let’s talk first about the search speed. Searching through the in-memory vector database is pretty fast, and only requires a couple dozen milliseconds. After all, it’s all in memory, and there’s not millions of records in the database. But what takes more time are the round trips to the cloud hosted embedding models and for the generative model calls.

Depending on the cloud region you use, and from where you call the program, an embedding request can take up to a second and a half, and the Gemini call less than a second. So making a request to Gemini to guess the programming language, then calling the embedding model to embed the query for comparison with the in-memory database, would be roughly two and a half seconds long if done serially. Since both operations are unrelated, we can call them in parallel using an executor service with two threads:

```java
List<Future<Object>> futures;
try (var executorService = Executors.newFixedThreadPool(2)) {
    futures = executorService.invokeAll(List.of(
        () -> recognizeProgrammingLanguage(question),
        () -> embedQuery(question)
    ));
}
String programmingLanguageRecognised = (String) futures.get(0).get();
Embedding queryEmbedding = (Embedding) futures.get(1).get();
```

With this trick, the embedding and programming language guessing takes as much time as the longest of both tasks. Usually, it seems the embedding is the longest. So we shave a second of wait time for the user. It’s a win!

The other aspect we could improve further is the quality of search results. We already improved it by applying two techniques: using a code retrieval task type with our embedding model, and also the programming language filtering to avoid returning languages the user isn’t interested in.

However, there’s another approach we haven’t explored (this could be the topic for another article) which is to combine the existing keyword-based search provided by the Programming Idioms website, with our semantic search. This is what is called **hybrid search**: combining the results of two or more searches, to give better results, applying techniques like [Reciprocal Rank Fusion](https://medium.com/@devalshah1619/mathematical-intuition-behind-reciprocal-rank-fusion-rrf-explained-in-2-mins-002df0cc5e2a) to merge results.

Embedding and generative models understand text pretty well, but can struggle with acronyms, product names, etc, that they haven’t seen much (if at all) in their training set. But keyword-based searches excel at that. So by combining the best of both worlds, our little website search box could tackle more queries, and give the best answers to our users.

## Summary

This article explored semantic code search for programming idioms using Vertex AI [embedding models](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings) and the [LangChain4j](https://docs.langchain4j.dev/) framework. We aimed to enable natural language queries for code examples, going beyond keyword-based searches. Key learnings included:

- **Embedding models** represented text as multidimensional vectors, capturing semantic similarities.
- **Vertex AI's text-embedding-005** model, particularly the `CODE_RETRIEVAL_QUERY` task type, was optimized for code-related searches.
- **LangChain4j** provided a framework for building LLM applications in Java.
- **Gemini**, a generative AI model, could be used to infer the programming language from a user's query, improving search accuracy.
- **Parallel processing** enhanced search speed by concurrently executing embedding and language recognition tasks.
- **Metadata filtering** allowed for more precise searches based on attributes like the programming language name.
- **Hybrid search**, combining semantic and keyword-based approaches, could further improve search quality.

Overall, the article demonstrated how we could build a fast and intelligent programming idiom search engine that understands natural language queries and retrieves contextually relevant code examples.
