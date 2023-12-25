---
title: "Gemini Function Calling"
date: 2023-12-22T18:03:43+01:00
tags:
  - machine-learning
  - large-language-models
  - generative-ai
  - google-cloud
  - java
  - gemini
---

A promising feature of the Gemini large language model released recently by [Google DeepMind](https://deepmind.google/),
is the support for [function calls](https://ai.google.dev/docs/function_calling).
It's a way to supplement the model, by letting it know an external functions or APIs can be called.
So you're not limited by the knowledge cut-off of the model: instead, in the flow of the conversation with the model,
you can pass a list of functions the model will know are available to get the information it needs,
to complete the generation of its answer.

For example, if you want to ask the model about the weather, it doesn't have the realtime information about the weather forecast.
But we can tell it that there's a function that can be called, to get the forecast for a given location.
Internally, the model will acknowledge it doesn't know the answer about the weather,
but it will request that you call an external function that you describe, using a specific set of parameters which correspond to the user's request.

Just days ago, I wrote about how to [get started with Gemini in Java]({{< ref "/posts/2023/12/13/get-started-with-gemini-in-java" >}}).
In that article, we explored how to use the hand-written Java SDK that is available to interact with Gemini from Java.
However, the Java SDK doesn't yet expose all the features of the model: in particular, function calling is missing.
But not all hope is lost! Because under the hood, the SDK relies on the generated protobuf classes library, which exposes everything!

> Soon, Gemini will be supported by [LangChain4j](https://github.com/langchain4j/langchain4j),
> and the Java SDK will also provide an easier way to take care of function calling.
> But in this article, I wanted to explore the use of the internal protobuf classes, to see how to best implement its support in the SDK.

Let's go step by step!

Instead of using the `GenerativeModel` API from the SDK, we'll go straight with the `PredictionServiceClient`:

```java
try (VertexAI vertexAI = new VertexAI(projectId, location)) {
  PredictionServiceClient client = vertexAI.getPredictionServiceClient();
  ...
}
```

We need to prepare a function declaration to describe the kind of functions that the LLM can ask us to call, and we'll wrap it in a `Tool`:

```java
FunctionDeclaration functionDeclaration = FunctionDeclaration.newBuilder()
    .setName("getCurrentWeather")
    .setDescription("Get the current weather in a given location")
    .setParameters(
        Schema.newBuilder()
            .setType(Type.OBJECT)
            .putProperties("location", Schema.newBuilder()
                .setType(Type.STRING)
                .setDescription("location")
                .build()
            )
            .addRequired("location")
            .build()
    )
    .build();

Tool tool = Tool.newBuilder()
    .addFunctionDeclarations(functionDeclaration)
    .build();
```

Functions are described using classes that represent a subset of the OpenAPI 3 specification.

> This is important to provide descriptions for the functions and its parameters,
> as the LLM will use that information to figure out which function to call, and which parameters should be passed.

Next, let's prepare a question asking about the weather in Paris, and configuring the text generation request with that prompt and the tool defined above:

```java
String resourceName = String.format(
    "projects/%s/locations/%s/publishers/google/models/%s",
    vertexAI.getProjectId(), vertexAI.getLocation(), modelName);

Content questionContent =
    ContentMaker.fromString("What's the weather in Paris?");

GenerateContentRequest questionContentRequest =
    GenerateContentRequest.newBuilder()
        .setEndpoint(resourceName)
        .setModel(resourceName)
        .addTools(tool)
        .addContents(questionContent)
        .build();

ResponseStream<GenerateContentResponse> responseStream =
    new ResponseStream<>(new ResponseStreamIteratorWithHistory<>(
        client
            .streamGenerateContentCallable()
            .call(questionContentRequest)
            .iterator())
);

GenerateContentResponse generateContentResponse =
    responseStream.stream().findFirst().get();
Content callResponseContent =
    generateContentResponse.getCandidates(0).getContent();
```

If you print the `callResponseContent` variable, you'll see that it contains a function call request,
suggesting that you should call the predefined function with the parameter of `Paris`:

```
role: "model"
parts {
  function_call {
    name: "getCurrentWeather"
    args {
      fields {
        key: "location"
        value {
          string_value: "Paris"
        }
      }
    }
  }
}
```

At that point, as the developer, it's your turn to work a little, and make the call to that function yourself!
Let's pretend I called an external Web Service that gives weather information, and that it returns some JSON payload that would look like so:

```json
{
  "weather": "sunny",
  "location": "Paris"
}
```

We need now to create a function response structure to pass that information back to the LLM:

```java
Content contentFnResp = Content.newBuilder()
    .addParts(Part.newBuilder()
        .setFunctionResponse(
            FunctionResponse.newBuilder()
                .setResponse(
                    Struct.newBuilder()
                        .putFields("weather",
                            Value.newBuilder().setStringValue("sunny").build())
                        .putFields("location",
                            Value.newBuilder().setStringValue("Paris").build())
                        .build()
                )
                .build()
        )
        .build())
    .build();
```

Then, since LLMs are actually stateless beasts, we need to give it the whole context of the conversation again,
passing the query, the function call response the model suggested us to make, as well as the response we got from the external weather service:

```java
GenerateContentRequest generateContentRequest = GenerateContentRequest.newBuilder()
    .setEndpoint(resourceName)
    .setModel(resourceName)
    .addContents(questionContent)
    .addContents(callResponseContent)
    .addContents(contentFnResp)
    .addTools(tool)
    .build();
```

And to finish, we'll invoke the `client` one last time with that whole dialog and information, and print a response out:

```java
responseStream = new ResponseStream<>(new ResponseStreamIteratorWithHistory<>(
    client
        .streamGenerateContentCallable()
        .call(generateContentRequest)
        .iterator())
);

for (GenerateContentResponse resp : responseStream) {
    System.out.println(ResponseHandler.getText(resp));
}
```

And happily, Gemini will reply to us that:

```
The weather in Paris is sunny.
```

What a lovely way to start the holiday season with a nice and sunny weather!

I wish you all happy year end festivities, and I look forward to seeing you next year.
Hopefully next month, I'll be able to show you some cool new SDK features or the LangChain4j integration!
Thanks for reading.
