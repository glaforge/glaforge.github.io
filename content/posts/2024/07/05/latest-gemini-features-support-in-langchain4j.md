---
title: "Latest Gemini features support in LangChain4j 0.32.0"
date: 2024-07-05T11:53:30+02:00
image: /img/gemini/imagen-v3-two-hands-shaking.jpg
tags:
  - generative-ai
  - langchain4j
  - java
  - google-cloud
  - large-language-model
---

[LangChain4j](https://docs.langchain4j.dev/) 0.32.0 was released yesterday,
including my [pull request](https://github.com/langchain4j/langchain4j/pull/1278)
with the support for lots of new Gemini features:

- **JSON output mode**, to force Gemini to reply using JSON, without any markup,
- **JSON schema**, to control and constrain the JSON output to comply with a schema,
- **Response grounding** with Google Search web results and with private data in Vertex AI datastores,
- Easier debugging, thanks to new builder methods to **log requests and responses**,
- **Function calling mode** (none, automatic, or a subset of functions),
- **Safety settings** to catch harmful prompts and responses.

Let's explore those new features together, thanks to some code examples!
And at the end of the article, if you make it through, you'll also discover **2 extra bonus points**.

## JSON output mode

Creating LLM-powered applications means working with text, as this is what LLMs return.
But to facilitate this integration between LLM responses and your code,
the text format of choice is usually JSON, as it's human-readable, and easy to parse programmatically.

However, LLMs are a bit chatty, and rather than sending you back a nice raw JSON document, instead, it replies with some extra sentence, and some markdown markup to wrap the piece of JSON.

Fortunately, Gemini 1.5 (Flash and Pro) allows you to specify the response MIME type.
Currently, only `application/json` is supported, but other formats may come later.

To do that, when instantiating the Gemini model, use the `responseMimeType()` builder method:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .responseMimeType("application/json")
    .build();

String response = model.generate("Roll a dice");

System.out.println(response);
```

No sentence, no markdown markup, nothing, just pure JSON:

```
{"roll": 3}
```

We didn't even need to say in the prompt we wanted to get a JSON response!

However, the JSON key of that document may vary from time to time, so you may still wish to be a bit more prescriptive in your prompt, and ask the model to return JSON explicitly, give it an example of the JSON output you expect, etc. That's the usual prompting approach...

But now there's more!

## JSON Schema output

This is quite unique in the LLM ecosystem, as I believe it's the only model out there that allows you to specify a JSON schema for constraining the JSON output.
This works for Gemini 1.5 Pro only, not with Gemini 1.5 Flash.

Let's have another look at our previous dice roll example, and let's update it to specify a JSON schema for the output generation:

```java
import static dev.langchain4j.model.vertexai.SchemaHelper.fromClass;
//...

record DiceRoll(int roll) {}

var model = VertexAiGeminiChatModel.builder()
    .project("genai-java-demos")
    .location("us-central1")
    .modelName("gemini-1.5-pro")
    .responseSchema(fromClass(DiceRoll.class))
    .build();

String response = model.generate("Roll a dice");

System.out.println(response);
```

The generated JSON document will always contain the `roll` key

```json
{ "roll": 5 }
```

In this example, we used a convenience method called `fromClass()` that creates a JSON schema that corresponds to a Java type (here a Java record).

But there's also another convenient method that lets us pass a JSON schema string, called `fromJsonSchema()`:

```java
var model = VertexAiGeminiChatModel.builder()
    .project("genai-java-demos")
    .location("us-central1")
    .modelName("gemini-1.5-pro")
    .responseSchema(fromJsonSchema("""
        {
            "type": "object",
            "properties": {
                "roll": {
                    "type": "integer"
                }
            }
        }
        """))
    .build();
```

It's also possible to construct a JSON schema programmatically:

```java
var model = VertexAiGeminiChatModel.builder()
    .project("genai-java-demos")
    .location("us-central1")
    .modelName("gemini-1.5-pro")
    .responseSchema(Schema.newBuilder()
        .setType(Type.OBJECT)
        .putProperties("roll",
            Schema.newBuilder()
                .setType(Type.INTEGER)
                .build())
        .build())
    .build();
```

Now you always get consistent JSON outputs!

## Response grounding with Google Search web results and Vertex AI datastores

Large Language Models are wonderful creative machines, but rather than benefiting from their high degree of creativity, we'd prefer having factual responses grounded on data and documents.

Gemini offers the ability to [ground responses](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/ground-gemini):

- against Google Search web results,
- against Vertex AI search datastores.

### Use Google Search to ground responses

The training of an LLM ended at a certain date: its _cut-off_ date.
So it doesn't know about news that happened after that date.
But you can request Gemini to use Google Search to find more up-to-date information.

For example, if we ask Gemini about the current elections going on in France, it could reply with something like this:

```
There is no current national election happening in France right now.

The last major national election in France was the **Presidential
election in April and May 2022**, where Emmanuel Macron won a second
term.

There are, however, **local elections** happening regularly in
different regions of France.

To stay updated on French elections, you can check the website of
the **French Ministry of the Interior** or reputable news sources
like **The Guardian, BBC, CNN, or Le Monde**.
```

Now, let's enable the use of Google Search web result with the `useGoogleSearch(true)` method:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .useGoogleSearch(true)
    .build();

String response = model.generate(
    "What is the current election going on in France?");

System.out.println(response);
```

The answer will be much different, and indeed factual and up-to-date:

```
France held the first round of a parliamentary election on July 4,
2024. The second round will be on July 7, 2024. The election is
significant because it could result in the first far-right government
in France since World War II.  The National Rally, President Emmanuel
Macron’s centrist alliance, and the New Popular Front coalition are
the three major political blocs competing in the election. The
outcome of the election is highly uncertain, with the far-right
National Rally potentially gaining a parliamentary majority.  If the
National Rally wins a majority, Macron would be expected to appoint
Jordan Bardella, the party's president, as prime minister.
```

There's indeed a parliamentary election going on right now in France.
Those elections were decided only a month ago, thus past the cut-of-date of the knowledge of the model.

> For my French audience, don't forget to go voting next Sunday!

### Grounding with Vertex AI Search

The idea is that we want to ground responses on our own data.
This is particularly important when the knowledge required is actually private information, like our internal docs, or our customers' docs.

My colleague Mete wrote a great
[article explaining how to setup grounding with private data](https://atamel.dev/posts/2024/07-01_grounding_with_own_data_vertexai_search/).
Below, I'll assume that we created a Vertex AI search app with a datastore backed by a Google Cloud Storage bucket that contains a fictious document which is a car manual, about the _Cymbel Starlight_ car model! I'm taking the same example as in Mete's article.

This time, we specify the search location to point at the Vertex AI search datastore with `vertexSearchDatastore()`:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .vertexSearchDatastore(String.format(
            "projects/%s/locations/%s/collections/%s/dataStores/%s",
            PROJECT_ID, "global", "default_collection",
            "cymbal-datastore_1720169982142")
    )
    .build();

String response = model.generate(
    "What is the cargo capacity of Cymbal Starlight?");

System.out.println(response);
```

It's a fictious car that doesn't exist, but it's covered in that private document, and indeed, Gemini is now able to respond to that question:

```
The Cymbal Starlight 2024 has a cargo capacity of 13.5 cubic feet.
```

What's interesting as well is that the response returned by Gemini provides some context about the source document that helped it answer the user query (we'll see in the next section how to enable logging requests and responses):

```
  grounding_metadata {
    2: {
      1: {
        3: 66
      }
      2: 0x3f7deee0
    }
    5: {
      2: {
        1: "gs://genai-java-demos-documents/cymbal-starlight-2024.pdf"
        2: "cymbal-starlight-2024"
      }
    }
    6: {
      1: {
        3: 66
        4: "The Cymbal Starlight 2024 has a cargo capacity of 13.5 cubic feet."
      }
      2: "\000"
      3: {
        257772: 63
      }
    }
```

However, to be honest, I'm not quite sure what the numbers exactly mean, but this metadata mentions that the PDF uploaded in cloud storage is the one that was used to shape the answer of the LLM, and gives an excerpt of the sentence that was found in the document.

## Request and response logging

To better understand what's going on under the hood, you can enable request and response logging.
That way, you're able to see exactly what is sent to Gemini, and what Gemini replies.

To enable logging, there are two methods we can use:

- `logRequests(true)` to log the request sent to Gemini,
- `logResponse(true)` to log the response received from Gemini.

Let's see that in action:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .logRequests(true)
    .logResponses(true)
    .build();

String response = model.generate("Why is the sky blue?");

System.out.println(response);
```

Here's what's logged:

```
[main] DEBUG dev.langchain4j.model.vertexai.VertexAiGeminiChatModel -
 GEMINI (gemini-1.5-flash) request: InstructionAndContent {
 systemInstruction = null,
 contents = [role: "user"
parts {
  text: "Why is the sky blue?"
}
]
} tools: []


[main] DEBUG dev.langchain4j.model.vertexai.VertexAiGeminiChatModel -
 GEMINI (gemini-1.5-flash) response: candidates {
  content {
    role: "model"
    parts {
      text: "The sky appears blue due to a phenomenon called
      **Rayleigh scattering**. Here\'s a breakdown:\n\n* **Sunlight
      is made up of all colors of the rainbow.**  When sunlight enters
      the Earth\'s atmosphere, it encounters tiny particles like
      nitrogen and oxygen molecules.\n* **These particles scatter the
      sunlight in all directions.**  However, shorter wavelengths of
      light, like blue and violet, scatter more strongly than longer
      wavelengths, like red and orange.\n* **This preferential
      scattering of shorter wavelengths is called Rayleigh
      scattering.**
      As a result, we see more blue light scattered throughout the sky,
      making it appear blue.\n\n**Why is the sky not violet?**\n\nEven
      though violet light scatters even more strongly than blue, our
      eyes are more sensitive to blue light. This is why we perceive
      the sky as blue rather than violet.\n\n**Other factors that
      affect sky color:**\n\n* **Time of day:** The sky appears more
      red or orange at sunrise and sunset because the sunlight has to
      travel through more of the atmosphere, scattering away most of
      the blue light.\n* **Clouds:** Clouds are made up of larger water
      droplets or ice crystals, which scatter all wavelengths of light
      equally. This is why clouds appear white.\n* **Pollution:**
      Pollution particles can scatter light differently, sometimes
      making the sky appear hazy or even reddish.\n\nLet me know if
      you have any other questions about the sky! \n"
    }
  }
  finish_reason: STOP
  safety_ratings {
    category: HARM_CATEGORY_HATE_SPEECH
    probability: NEGLIGIBLE
    probability_score: 0.054802597
    severity: HARM_SEVERITY_NEGLIGIBLE
    severity_score: 0.03314852
  }
  safety_ratings {
    category: HARM_CATEGORY_DANGEROUS_CONTENT
    probability: NEGLIGIBLE
    probability_score: 0.100348406
    severity: HARM_SEVERITY_NEGLIGIBLE
    severity_score: 0.06359858
  }
  safety_ratings {
    category: HARM_CATEGORY_HARASSMENT
    probability: NEGLIGIBLE
    probability_score: 0.10837755
    severity: HARM_SEVERITY_NEGLIGIBLE
    severity_score: 0.021491764
  }
  safety_ratings {
    category: HARM_CATEGORY_SEXUALLY_EXPLICIT
    probability: NEGLIGIBLE
    probability_score: 0.10338596
    severity: HARM_SEVERITY_NEGLIGIBLE
    severity_score: 0.020410307
  }
}
usage_metadata {
  prompt_token_count: 6
  candidates_token_count: 288
  total_token_count: 294
}
```

Let me give you a bit more details about the logging. LangChain4j uses Slf4j by default for logging.
Request & Response logging is logged at `DEBUG` level. So we have to configure our logger and/or logger façace accordingly.

In my test project for this article, I configured the following `Maven` dependencies for `Slf4j` and the `Simple` logger:

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.13</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>2.0.13</version>
</dependency>
```

I created a properties file to configure the loggers: `src/main/resources/simplelogger.properties`, which contains the following configuration:

```
org.slf4j.simpleLogger.defaultLogLevel=debug
org.slf4j.simpleLogger.log.io.grpc.netty.shaded=info
```

I set the default logging level to be `debug`.
But there's also Netty, the networking library used under the hood by the Gemini Java SDK, that logs at debug level.
So I specified that the logging for this library should only be at `info` and above, otherwise the output is super chatty.

## Function calling mode

So far, when using Gemini for
[function calling](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/function-calling),
the model would decide on its own if a function would be useful to call, and which function to call.

But Gemini introduces the ability to
[control the function or tool choice](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/function-calling#tool-config).

There are 3 options:

- `AUTO` — The familiar and default mode, where Gemini decides on its own if a function call is necessary and which one should be made,
- `ANY` — Allows to specify a subset of functions from all those available, but also forces the model to pick up one of them (only supported by Gemini 1.5 Pro),
- `NONE` — Even if tools are defined and available, prevents Gemini to use any of those tools.

Let's have a look at this example:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-pro")
    .logRequests(true)
    .logResponses(true)
    .toolCallingMode(ToolCallingMode.ANY)
    .allowedFunctionNames(Arrays.asList("add"))
    .build();

ToolSpecification adder = ToolSpecification.builder()
    .description("adds two numbers")
    .name("add")
    .addParameter("a", JsonSchemaProperty.INTEGER)
    .addParameter("b", JsonSchemaProperty.INTEGER)
    .build();

UserMessage message = UserMessage.from("How much is 3 + 4?");
Response<AiMessage> answer = model.generate(asList(message), adder);

System.out.println(
    answer.content().toolExecutionRequests().getFirst());
```

We specify the `ToolCallingMode.ANY` mode, and we list the allowed function names of the functions that the model must pick in order to reply to the request (with the `allowedFunctionNames()` builder method).

We describe the tool that can be called. We create a message.
And when calling `generate()`, we pass the tool specification corresponding to the function we want to be called.

The output will show that the model replied with the mandatory tool execution request:

```
ToolExecutionRequest { id = null, name = "add",
                       arguments = "{"a":3.0,"b":4.0}" }
```

Now it's our turn to call the `add` function with the arguments.
And then send back the function execution result back to Gemini.

> **Warning**:
> Currently, it is not possible to use the `ANY` forced function calling mode when using LangChain4j's `AiServices` class.
>
> `AiServices` takes care of automatic function calling. But the process is a two-step request / response mechanism:
>
> - First, we ask the model the math question and pass the tool specification along.
> - The model replies with a `ToolExecutionRequest`.
> - Then `AiServices` makes the function call locally, and replies to the model with the function execution result. However, since the `ANY` calling mode is specified at the model level, the model still wants to reply with yet another tool execution request. Although at this point, the second call made to the model was _just_ to pass the function execution result, not to request another tool execution.
> - So `AiServices` enters an infite loop as the model requests a function execution again and again, not taking into account the execution result that it received.
>
> When using `AiServices`, it's better to let Gemini operate under the default `AUTO` tool mode.
> So it knows when it needs to request a tool execution, or if just needs to handle the tool execution response.
>
> If you want to use the `ANY` mode with `allowedFunctionNames()`, then don't use `AiServices`, and handle the function calls on your own in your code, to avoid such infite loop situations.

## Specify safety settings

In LLM-powered applications, where users can enter any kind of weird textual inputs,
you may want to limit harmful content that may be ingested.
To do so, you can specify some safety settings, for different categories of content, with different thresholds of acceptance:

```java
import static dev.langchain4j.model.vertexai.HarmCategory.*;
import static dev.langchain4j.model.vertexai.SafetyThreshold.*;
//...
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .safetySettings(Map.of(
        HARM_CATEGORY_DANGEROUS_CONTENT, BLOCK_LOW_AND_ABOVE,
        HARM_CATEGORY_SEXUALLY_EXPLICIT, BLOCK_MEDIUM_AND_ABOVE,
        HARM_CATEGORY_HARASSMENT, BLOCK_ONLY_HIGH,
        HARM_CATEGORY_HATE_SPEECH, BLOCK_MEDIUM_AND_ABOVE
    ))
    .build();
```

If you want to make your app safer for your end-users, and to avoid malicious or ill-disposed users, that's the way to go!

## Bonus point #1: Streaming responses with lambda functions

I'll round up the review of Gemini-focused features with one little addition I contributed to the project:
the ability to pass a lambda instead of a streaming content handler, when using a streaming model.

This is not Gemini-related, you can use it with any model!

More concretely, if you want to use Gemini or another model in streaming mode, to see the response being printed as it's generated by the model, you would usually write the following code:

```java
var model = VertexAiGeminiStreamingChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash")
    .build();

model.generate("Why is the sky blue?", new StreamingResponseHandler<>() {
    @Override
    public void onNext(String aFewTokens) {
        System.out.print(aFewTokens);
    }

    @Override
    public void onError(Throwable throwable) {
        throw new RuntimeException(throwable);
    }
});
```

Using an anonymous inner class implementing the `StreamingResponseHandler` interface is quite verbose.
Fortunately, I contributed a couple static methods you can import, to make the code a little bit more concise:

```java
import static dev.langchain4j.model.LambdaStreamingResponseHandler.onNext;
import static dev.langchain4j.model.LambdaStreamingResponseHandler.onNextAndError;
//...

// onNext
model.generate("Why is the sky blue?",
    onNext(System.out::println));

// onNextAndError
model.generate("Why is the sky blue?",
    onNextAndError(
        System.out::println,
        ex -> { throw new RuntimeException(ex); }
));
```

Now you can stream your LLM output in a single instruction!

## Bonus point #2: Generating stunning images with Imagen v3

A second bonus point in this new LangChain4j release is the fact that the Vertex AI Image model now supports
[Imagen v3](https://deepmind.google/technologies/imagen-3/) (Google DeepMind's latest high-quality image generation model).

> **Warning:** To use the Imagen model, you'll still have to be allow-listed for now.
> You'll need to [fill this form](https://docs.google.com/forms/d/1cqt9padvfMgqn23W5FMPTqh7bW1KLkEOsC5G6uC-uuM/viewform)
> to request access to the model.

There are a few new parameters that are available that you can take advantage of when generating pictures.
Let's have a look at the following image generation code:

```java
var imagenModel = VertexAiImageModel.builder()
    .project(PROJECT)
    .location(LOCATION)
    .endpoint(ENDPOINT)
    .publisher("google")
    .modelName("imagen-3.0-generate-preview-0611")
    .aspectRatio(VertexAiImageModel.AspectRatio.LANDSCAPE)
    .mimeType(VertexAiImageModel.MimeType.JPEG)
    .compressionQuality(80)
    .watermark(true) // true by default with Imagen v3
    .withPersisting()
    .logRequests(true)
    .logResponses(true)
    .build();

String prompt = """
    An oil painting close-up, with heavy brush strokes full of
    paint, of two hands shaking together, a young one, and an
    old one conveying a sense of heartfelt thanks and connection
    between generations
    """;

Response<Image> imageResponse = imagenModel.generate(prompt);
System.out.println(imageResponse.content().url());
```

Let's see the resulting picture?

![](/img/gemini/imagen-v3-two-hands-shaking.jpg)

In the code above, you certainly noticed the new builder methods:

- `aspectRatio()` — not only square, but wide and narrow landscape and portrait modes are available,
- `mimeType()` — in addition to PNG, you can request JPEG image generation,
- `comressionQuality()` — when requesting JPEG, you can chose the level of compression for encoding the image,
- `watermark()` — to have all your generated images be watermarked with [SynthId](https://deepmind.google/technologies/synthid/),
- `logRequest()` / `logResponse()` — to see what is exchanged with the model, in and out,
- `persistToCloudStorage()` — to specify you want the image saved in a cloud storage bucket (not used in this example).

If you get a chance, and request access to Imagen v3, you'll notice really great quality improvements compared to v2!

## Conclusion

Lots of new Gemini related features in this
[release of LangChain4j](https://github.com/langchain4j/langchain4j/releases/tag/0.32.0)!
I hope this article helped you learn about them, and will make you want to use them in your projects.

If you want to go hands-on with Gemini with LangChain4j, don't forget to check out my self-paced codelab:
[Gemini codelabg for Java developers, using LangChain4j](https://glaforge.dev/posts/2024/03/27/gemini-codelab-for-java-developers/).
