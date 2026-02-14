---
title: "Grounding Gemini with Web Search results in LangChain4j"
date: 2024-05-28T07:42:43+02:00
image: /img/gemini/llama-glasses-gems.jpg
tags:
  - google-cloud
  - generative-ai
  - large-language-models
  - java
  - langchain4j
  - retrieval-augmented-generation

similar:
  - "posts/2024/07/05/latest-gemini-features-support-in-langchain4j.md"
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
  - "posts/2025/03/03/llms-txt-to-help-llms-grok-your-content.md"
---

The latest [release of LangChain4j](https://github.com/langchain4j/langchain4j/releases/tag/0.31.0) (version 0.31) added the capability of _grounding_ large language models with results from web searches.
There's an integration with
[Google Custom Search Engine](https://developers.google.com/custom-search/v1/overview),
and also [Tavily](https://tavily.com/).

The fact of _grounding_ an LLM's response with the results from a search engine
allows the LLM to find relevant information about the query from web searches,
which will likely include up-to-date information that the model won't have seen
during its training, past its cut-off date when the training ended.

> [!NOTE] Remark
> Gemini has a built-in [Google Web Search grounding](https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview#ground-public)
> capability, however, LangChain4j's Gemini integration doesn't yet surface this feature.
> I'm currently working on a pull request to support this.

## Asking questions to your website

An interesting use case for LLM web search grounding is for example if you want to search a particular website.
I was interested in asking questions related to articles that I have posted on my personal website and blog.
Let's see, step by step, how you can implement this.

### Creating a custom search engine

First of all, as I decided to use Google Custom Search, I created a new custom search engine.
I won't detail the steps involved in this process, as it's explained in the [documentation](https://developers.google.com/custom-search/docs/tutorial/creatingcse).
I created a custom search searching only the content on my website: [glaforge.dev](https://glaforge.dev).
But you can potentially search the whole internet if you wish, or just your company website, etc.

Google Custom Search gave me an API key, as well as a Custom Search ID (csi) for my newly created custom search engine.
You can test the custom search engine with that ID with this URL:
[https://programmablesearchengine.google.com/controlpanel/overview?cx=YOUR_CSI_HERE](https://programmablesearchengine.google.com/controlpanel/overview?cx=YOUR_CSI_HERE).
It gives you a Google Search-like interface where you can enter your queries.
There's also a widget that you can integrate in your website if you wish.

### Implementation

First of all, I configure the chat model I want to use.
I'm using the latest and fastest Gemini model: [Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/flash/).
I've saved my Google Cloud project ID and locaction in environment variables.

```java
VertexAiGeminiChatModel model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("PROJECT_ID"))
    .location(System.getenv("LOCATION"))
    .modelName("gemini-1.5-flash-001")
    .build();
```

Next, I configure my web search engine.
Here, I'm using Google Search, but it could be Tavily as well.
I also saved my API key and the ID of my custom web search in environment variables:

```java
WebSearchEngine webSearchEngine = GoogleCustomWebSearchEngine.builder()
    .apiKey(System.getenv("GOOGLE_CUSTOM_SEARCH_API_KEY"))
    .csi(System.getenv("GOOGLE_CUSTOM_SEARCH_CSI"))
//    .logRequests(true)
//    .logResponses(true)
    .build();
```

Note that you can log the requests and responses, for debugging purpose.

Next, I define a _content retriever_, this is a way to let LangChain4j know
that _content_ can be _retrieved_ from a particular tool or location:

```java
ContentRetriever contentRetriever = WebSearchContentRetriever.builder()
    .webSearchEngine(webSearchEngine)
    .maxResults(3)
    .build();
```

Now, I define the contract I want to use to interact with my Gemini model, by creating my own custom search `interface`:

```java
interface SearchWebsite {
    String search(String query);
}
```

This interface will be implemented by LangChain4j's `AiServices` system that binds several components together:
the chat language model (here, Gemini), and the web search content retriever I created above:

```java
SearchWebsite website = AiServices.builder(SearchWebsite.class)
    .chatLanguageModel(model)
    .contentRetriever(contentRetriever)
    .build();
```

Then I can ask my question to the LLM, which will find the relevant information in my blog:

```java
String response = website.search(
    "How can I call the Gemma model from LangChain4j?");

System.out.println("response = " + response);
```

If I comment out the line `contentRetriever(contentRetriever)`, Gemini does a best effort at answering my question,
but since there's nothing in its training data (before its cut-off date)
about how to call the [Gemma](https://blog.google/technology/developers/gemma-open-models/) model from LangChain4j,
it is not able to provide a useful answer.

But with the web search content retriever, Gemini is able to find the right material to ground its answer,
as the custom search returns my article on
[calling Gemma with Ollama, Testcontainers, and LangChain4j](https://glaforge.dev/posts/2024/04/04/calling-gemma-with-ollama-and-testcontainers/):

```
Based on the provided information, you can call the Gemma model from
LangChain4j using the following approach:

1. **Use Ollama:** The articles highlight Ollama as a tool for
interacting with Gemma. You would need to set up Ollama and ensure it
has access to the Gemma model.
2. **Integrate TestContainers:** TestContainers helps you manage
containerized environments for testing. You can use it to run Ollama
within a container alongside LangChain4j.
3. **Utilize LangChain4j:** LangChain4j provides the framework for
interacting with large language models. You would define your prompt,
send it to Ollama (which runs Gemma), and receive the response back
through LangChain4j.

**Example Steps:**

1. **Set up Ollama:** Install Ollama and configure it to use the
Gemma model.
2. **Create a Dockerfile:** Use a Dockerfile to define an image that
includes Ollama and any dependencies.
3. **Run Ollama in a container using TestContainers:** Start the
container using TestContainers and ensure it is accessible from your
LangChain4j code.
4. **Implement LangChain4j calls:** Use LangChain4j to construct your
prompt and send it to Ollama (which will pass it to Gemma).
5. **Receive and process the response:** Receive the generated response
from Gemma and process it as needed in your Java application.

**Note:** These steps provide a general approach. You will need to
refer to the documentation for Ollama, TestContainers, and LangChain4j
for specific implementation details.

This method leverages Ollama as an intermediary to access Gemma.
If you have access to Google's Gemini model directly, you might be
able to integrate it with LangChain4j without the Ollama step,
depending on the specific API or SDK offered by Google.
```

The LLM found that I have to use [Ollama](https://ollama.com/) and
[TestContainers](https://testcontainers.com/), as explained in my article.
This information wasn't part of my query, so it proves that it really found the info in the article.

## Discussion

The LLM based its answer on the _excerpts_ contained in the search results,
not the whole content of the article, so some aspects of this answer are not totally correct:
For instance, you don't have to _install_ Ollama or create your own _Dockerfile_.

To make the response perfect, I believe we would have to combine web search results
with Retrieval Augmented Generation, or pass the whole context of the article to the model,
so that it could provide a more thorough and factual answer.

For different queries that lead to shorter answers, the answer would probably be more to the point.

Another approach is to annotate our `String search(String query)` method with a `@SystemInstruction()`
with instructions that encourage the LLM to provide a shorter answer.
But it's difficult to find the right balance between too long and too short,
and of course without any sort of hallucinations!

For example, you can try with the following system instruction:

```java
interface SearchWebsite {
  @SystemMessage("""
    Provide a paragraph-long answer, not a long step by step explanation.
    Reply with "I don't know the answer" if the provided information isn't relevant.
    """)
  String search(String query);
}
```

I got the following response:

```
The provided information mentions using Gemma with Ollama,
TestContainers, and LangChain4j. You can use Ollama, a local
LLM server, and TestContainers, which provides lightweight,
disposable containers, to set up a testing environment.
Then, with LangChain4j, a Java library for interacting with LLMs,
you can call Gemma through the Ollama server.
```

Which is shorter and more factual, without being too short either!

## What's next?

In an upcoming article, I'll show you how to use Gemini's built-in Google Search grounding,
but first, I have to finish my pull request for the LangChain4j project!

Or I can explore how to reply more precisely to queries that lead to complex answers like the above,
maybe combinging a RAG approach to get the full context of the article found by the web search.

Also, the Tavily API seems to be able to return the raw content of the article,
so maybe it can help giving the LLM the full context of the article to base its answers on it.
So that may be worth comparing those two web search integrations too.

Stay tuned!

## Full sample code

For reference, here is the full sample (with the system instruction approach):

```java
import dev.langchain4j.model.vertexai.VertexAiGeminiChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.WebSearchContentRetriever;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.web.search.WebSearchEngine;
import dev.langchain4j.web.search.google.customsearch.GoogleCustomWebSearchEngine;

public class GroundingWithSearch {
  public static void main(String[] args) {
    VertexAiGeminiChatModel model = VertexAiGeminiChatModel.builder()
      .project(System.getenv("PROJECT_ID"))
      .location(System.getenv("LOCATION"))
      .modelName("gemini-1.5-flash-001")
      .build();

    WebSearchEngine webSearchEngine = GoogleCustomWebSearchEngine.builder()
      .apiKey(System.getenv("GOOGLE_CUSTOM_SEARCH_API_KEY"))
      .csi(System.getenv("GOOGLE_CUSTOM_SEARCH_CSI"))
//    .logRequests(true)
//    .logResponses(true)
      .build();

    ContentRetriever contentRetriever = WebSearchContentRetriever.builder()
      .webSearchEngine(webSearchEngine)
      .maxResults(3)
      .build();

    interface SearchWebsite {
      @SystemMessage("""
        Provide a paragraph-long answer, not a long step by step explanation.
        Reply with "I don't know the answer" if the provided information isn't relevant.
        """)
      String search(String query);
    }

    SearchWebsite website = AiServices.builder(SearchWebsite.class)
      .chatLanguageModel(model)
      .contentRetriever(contentRetriever)
      .build();

    String response = website.search(
      "How can I call the Gemma model from LangChain4j?");

    System.out.println("response = " + response);
  }
}
```
