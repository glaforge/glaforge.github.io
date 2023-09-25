---
title: "Discovering LangChain4J, the Generative AI orchestration library for Java developers"
date: 2023-09-25T19:08:04+02:00
tags:
  - machine-learning
  - large-language-models
  - generative-ai
  - micronaut
  - groovy
  - google-cloud
  - java
---

As I started my journey with Generative AI and Large Language Models, I've been overwhelmed with the omnipresence of Python.
Tons of resources are available with Python front and center. However, I'm a Java developer
(with a penchant for [Apache Groovy](https://groovy-lang.org/), of course).
So what is there for me to create cool new Generative AI projects?

When I built my first experiment with the
[PaLM API](https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/api-quickstart),
using the integration within the Google Cloud's Vertex AI offering,
I called the available [REST API](https://cloud.google.com/vertex-ai/docs/reference/rest),
from my [Micronaut](https://micronaut.io/) application.
I used Micronaut's built-in mechanism to marshal / unmarshal the REST API constructs to proper classes.
Pretty straightfoward.

You can learn more about this first app in my previous articles on
[generating kid stories](https://glaforge.dev/posts/2023/06/08/creating-kids-stories-with-generative-ai/)
and [how to get started with the PaLM API](https://glaforge.dev/posts/2023/05/30/getting-started-with-the-palm-api-in-the-java-ecosystem/)

But soon after, I discovered that the Vertex AI Java SDK, which covers all products and services of Vertex AI,
added support for the PaLM API thanks to a new
[prediction service client](https://cloud.google.com/vertex-ai/docs/generative-ai/text/test-text-prompts#generative-ai-test-text-prompt-java) class.
I was happy and decided to try it! So here's how making a simple call to the LLM looks like from Groovy:

```groovy
@Grab('com.google.cloud:google-cloud-aiplatform:3.24.0')
import com.google.cloud.aiplatform.v1beta1.*
import com.google.protobuf.Value
import com.google.protobuf.util.JsonFormat

String instance =
    '''{ "prompt": "Tell me more about Large Language Models"}'''
String parameters = '''{
  "temperature": 0.2,
  "maxOutputTokens": 256,
  "topP": 0.95,
  "topK": 40
}'''

String project = "my-llm-java-demos"
String location = "us-central1"
String publisher = "google"
String model = "text-bison"

def predictionServiceSettings =
    PredictionServiceSettings.newBuilder()
        .setEndpoint("${location}-aiplatform.googleapis.com:443")
        .build()

def predictionServiceClient =
    PredictionServiceClient.create(predictionServiceSettings)
def endpointName =
    EndpointName.ofProjectLocationPublisherModelName(project, location, publisher, model)

def instanceValue = Value.newBuilder()
JsonFormat.parser().merge(instance, instanceValue)
def instances = [instanceValue.build()]

def parameterValueBuilder = Value.newBuilder()
JsonFormat.parser().merge(parameters, parameterValueBuilder)
def parameterValue = parameterValueBuilder.build()

def resp = predictionServiceClient.predict(endpointName, instances, parameterValue)
// resp[0].content
println resp.predictionsList.first().structValue.fieldsMap['content'].stringValue 
```

You create a PredictionServiceSettings, then an EndpointName, and a PredictionServiceClient to call its `predict()` method. Not overly complicated to set up.

However, there are really two things that I really dislike about this API:

- Why are we parsing some JSON strings and creating some Protobuf structures? This isn't very developer friendly to me.
- And then, it also returns some generic Protobuf structure response, that I have to navigate through to find the relevant bits I'm interested in, instead of letting me call something like `resp[0].content`.

I'd rather have a proper set of Java classes that represent my prompt, my LLM settings, the response, etc. I was a bit disappointed and preferred the approach I took with REST marshalling / unmarshalling in my Micronaut application --- you can check the [code on Github](https://github.com/glaforge/bedtimestories).

![](https://avatars.githubusercontent.com/u/132277850?v=4)

## Here comes the delight, with LangChain4J!

If you're following the Generative AI field, you'll have come across the [LangChain](https://www.langchain.com/) project. It's a Python (and Javascript) orchestrator framework to connect various building blocks: large language models, document loaders, text splitters, output parsers, vector stores to store text embeddings, tools, and prompts.

With just a few lines of code, you're able to create some great integrations to implement your Generative AI use cases, like for example following the [Retrieval Augmented Generation](https://www.langchain.com/use-case/retrieval) pattern to create chat bots that talk with your documentation.

Remember that I'm a Java developer? I played a bit with the Python version of LangChain (I didn't try the Javascript/Typescript variant) but I wasn't at ease with Python, and I didn't want to learn a whole new ecosystem to implement my Generative AI ideas.

Fortunately, that's when I discovered the open source [LangChain4J](https://github.com/langchain4j) project! This is also an AI orchestrator framework, but for Java! It's very much inspired by the original LangChain project, but independent. So this is the perfect match for my programming language skills and Generative AI needs.

Now, let's compare our protobuf-_obstruse_ example from earlier, with an equivalent one based on LangChain4J (this time I used the chat model instead of the text model):

```groovy
@Grab('dev.langchain4j:langchain4j-vertex-ai:0.22.0')\
import dev.langchain4j.model.vertexai.*

VertexAiChatModel vertexAiChatModel =
    VertexAiChatModel.builder()
        .endpoint("us-central1-aiplatform.googleapis.com:443")
        .project("my-llm-java-demos")
        .location("us-central1")
        .publisher("google")
        .modelName("chat-bison@001")
        .temperature(1.0)
        .maxOutputTokens(256)
        .topK(40)
        .topP(0.95)
        .maxRetries(3)
        .build()

def response = vertexAiChatModel.sendUserMessage(
        "What is the best Large Language Model?")

println response.text()
```

It's very declarative and straightforward! I define my endpoint and my model settings with one builder. And then I just send messages to that chat model with just strings. And the response is also a simple string.

LangChain4J has won my heart!

## What's next?

I didn't stop there, I also built another Generative AI use case: I created a project that lets me ask questions about some documentation (in my case, I wanted to query the Apache Groovy documentation.) I'll tell you more about that project in a forthcoming article, as we dive deeper in LangChain4J, to cover text embeddings, vector stores, and more.

I'll be covering this topic on Generative AI with Java at
[Devoxx Belgium](https://devoxx.be/talk/?id=4452) next week, and
[Devoxx Morocco](https://devoxx.ma/talk/?id=4901) the following one.

But you can have a look already at some of the [more advanced examples](https://github.com/langchain4j/langchain4j-examples/tree/main/other-examples/src/main/java), to see how you can calculate vector embeddings locally with the all-MiniLM-L6-v2 embedding model, and store the vectors in a convenient in-memory vector store ([link](http://all_minilm_l6_v2)), how to do text classification ([link](https://github.com/langchain4j/langchain4j-examples/blob/main/other-examples/src/main/java/embedding/classification/EmbeddingModelTextClassifierExample.java)), how to talk chat with your documents with conversational retrieval chains ([link](https://github.com/langchain4j/langchain4j-examples/blob/main/other-examples/src/main/java/ChatWithDocumentsExamples.java)).

LangChain4J is still young, but already pretty powerful, and offers integrations with VertexAI and OpenAI, with vector stores like [ChromaDB](https://www.trychroma.com/), [Pinecone](https://www.pinecone.io/) or [Weaviate](https://weaviate.io/) databases, and more.

Be sure to [checkout LangChain4J](https://github.com/langchain4j) if you want to build your next Generative AI use case with Java!
