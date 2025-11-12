---
title: "Data extraction: The many ways to get LLMs to spit JSON content"
date: 2024-11-18T09:47:28+01:00
image: /img/gemini/robot-miner-drill.png
tags:
  - java
  - large-language-models
  - machine-learning
  - langchain4j
  - generative-ai

similar:
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
  - "posts/2024/07/05/latest-gemini-features-support-in-langchain4j.md"
  - "posts/2024/08/12/let-llm-suggest-instagram-hashtags.md"
---

Data extraction from unstructured text is a very important task where LLMs shine, as they understand human languages well. Rumor has it that 80% of the worldwide knowledge and data comes in the form of unstructured text (vs 20% for data stored in databases, spreadsheets, JSON/XML, etc.) Let’s see how we can get access to that trove of information thanks to LLMs.

In this article, we’ll have a look at different techniques to make LLMs generate JSON output and extract data from text. This applies to most LLMs and frameworks, but for illustration purposes, we’ll use [Gemini](https://deepmind.google/technologies/gemini/) and [LangChain4j](https://docs.langchain4j.dev/) in Java.

We’ll explore the following approaches:

- prompting
- function calling
- structured output with a JSON mode
- structured output with a JSON response schema

## Let’s get started

Your mission, if you accept it, is to extract the name and age from the biography of a person:

```
Anna is a 23 year old artist based in Brooklyn, New York. She
was born and raised in the suburbs of Chicago, where she developed a
love for art at a young age. She attended the School of the Art
Institute of Chicago, where she studied painting and drawing. After
graduating, she moved to New York City to pursue her art career.
Anna's work is inspired by her personal experiences and observations
of the world around her. She often uses bright colors and bold lines
to create vibrant and energetic paintings. Her work has been exhibited
in galleries and museums in New York City and Chicago.
```

From that text, we want to extract the following JSON snippet:

```json
{
  "name": "Anna",
  "age": 23
}
```

## Let’s just ask politely\!

The first approach is to simply craft a user message, via prompting, that requests the response to be returned as JSON. A simple prompt suffice:

```
Return the name and age of the person described in the biography below.
Give the name and age in the form of a JSON object following this
structure: `{"name": "Jon Doe", "age": 36}`
Only return JSON, without any explanation,
without surrounding markdown code markup.

Here is the biography:

Anna is a 23 year old artist based in Brooklyn, New York. She
was born and raised in the suburbs of Chicago, where she developed a
love for art at a young age. She attended the School of the Art
Institute of Chicago, where she studied painting and drawing. After
graduating, she moved to New York City to pursue her art career.
Anna's work is inspired by her personal experiences and observations
of the world around her. She often uses bright colors and bold lines
to create vibrant and energetic paintings. Her work has been exhibited
in galleries and museums in New York City and Chicago.

JSON:
```

Sometimes, LLMs don’t always follow precisely the instructions. So you have to nudge them a little bit by requesting them to really output only JSON, as sometimes they wrap their answers with messages like “Here is the name and age of the person…” or with extra Markdown code blocks. So you may have to further tweak the prompt.

Quick illustration with Gemini and LangChain4j:

```java
String biography = "Anna is a 23 year old artist…";

var model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("PROJECT_ID"))
    .location(System.getenv("LOCATION"))
    .modelName("gemini-1.5-pro-002")
    .build();

String response = model.generate("""
    Return the name and age of the person described in the biography
    below. Give the name and age in the form of a JSON object
    following this structure: `{"name": "Jon Doe", "age": 36}`
    Only return JSON, without any explanation,
    without surrounding markdown code markup.

    Here is the biography:

    """ + biography + """

    JSON:
    """);

System.out.println(response);
// {"name": "Anna", "age": 23}
```

The output is a `String`, so you have to parse it with your favorite JSON parser, but the data has been successfully extracted into a JSON object.

Most LLMs support the notion of system instructions. Usually, LLMs obey a bit more closely to those instructions, than via user prompts. So you could also rewrite the example above by splitting the instructions inside system instructions, and put only the biography in the user prompt.

## Function calling to the rescue\!

Before the advent of JSON modes and response schemas (that we’ll review in the next sections) a more certain way to get JSON outputs was to take advantage of function calling. You have to encourage the LLM to request a function call to extract the information. Here’s the trick.

```json
{
  "name": "extractNameAndAgeFromBiography",
  "description": "extract the name and age of a person described in the biographical text given in input",
  "parameters": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "age": {
        "type": "integer"
      }
    },
    "required": ["name", "age"]
  }
}
```

You define a function whose signature looks like `extractNameAndAgeFromBiography(String name, int age)`, following the OpenAPI specification. You should add very precise descriptions for the function and its arguments. Here, I could have added more information about the parameters, but the names seemed self-explanatory to me. Then you can just pass the biography directly, and it should just work out of the box.

You can add system instructions to request the model to call that method to find the name and age of the person. But sometimes, some LLMs also allow you to force the LLM to request a call to a function.

What does it look like in Java with LangChain4j?

```java
var model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("PROJECT_ID"))
    .location(System.getenv("LOCATION"))
    .modelName("gemini-1.5-pro-002")
    .toolCallingMode(ToolCallingMode.ANY)
    .allowedFunctionNames(List.of("extractNameAndAgeFromBiography"))
    .build();
```

I specified the tool calling mode: this `ANY` value instructs the model to call one of the methods defined in the allowed function names list. It is a forced call request. The model will have to request the call.

```java
Response<AiMessage> response = model.generate(
    List.of(
        SystemMessage.from("""
          Return the name and age of the person described by the user
          by calling the function `extractNameAndAgeFromBiography()`
          and passing the name and the age of the person recognized.
        """),
        UserMessage.from(biography)
    ),
    ToolSpecification.builder()
        .description("""
            extract the name and age of a person described
            in the biographical text given in input
        """)
        .name("extractNameAndAgeFromBiography")
        .parameters(
            JsonObjectSchema.builder()
                .addStringProperty("name")
                .addIntegerProperty("age")
                .required("name", "age")
                .build()
        )
        .build()
);
```

The `generate()` call is a bit more convoluted. With forced tool calling, the system message is not mandatory, but it can help ensure all parameters are passed as arguments. Look at how we defined the contract of the function `extractNameAndAgeFromBiography()` by creating an object with a string and integer properties.

Now we’ll extract the function call request. We don’t look at the text content, as the model returns a tool execution request instead:

```java
System.out.println(response
    .content()
    .toolExecutionRequests()
    .getFirst()
    .arguments());

// {"name":"Anna","age":23.0}
```

You can retrieve just the arguments, as a JSON string. It’s already following the JSON object structure we wished to obtain.

You might notice a minor annoyance here, though, which is the fact the age is not an integer, but a floating point number. I’m not entirely sure at this point why we don’t get an integer. I’ll have to dig a little deeper…

Let’s now have a look at the JSON mode and response schema approaches.

## JSON mode approach

Some LLMs started offering the ability to request the model to output valid JSON. It’s not necessarily 100% certain that it will follow your requested format (for example, some JSON object keys could sometimes be named differently) but it works most of the time.

With the JSON mode (sometimes called structured output, or constrained decoding), we come back to our first approach, by prompting the LLM to generate JSON. But this time, we don’t have to nudge the LLM as much, because it must always generate valid JSON in output. It won’t add any Markdown markup, or any commentary.

Let’s see how to use the JSON mode with Gemini and LangChain4j:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("PROJECT_ID"))
    .location(System.getenv("LOCATION"))
    .modelName("gemini-1.5-pro-002")
    .responseMimeType("application/json")
    .build();
```

Notice how we set the response MIME type to application/json? That’s how we enable Gemini to always return valid JSON in output.

```java
Response<AiMessage> response = model.generate(
    List.of(
        SystemMessage.from("""
            Return the name and age of the person described in the
            biography below. Give the name and age in the form of
            a JSON object following this structure:
            `{"name": "Jon Doe", "age": 36}`
            """
        ),
        UserMessage.from(biography)
    )
);

System.out.println(response.content().text());
// {"name": "Anna", "age": 23}
```

We just needed to encourage Gemini to follow the JSON structure shown in the example in the system instruction. We don’t have to give further nudges to the model to not output Markdown code markup, or to prevent it from adding extra explanations.

This gives great results, but to go even further and ensure that the returned JSON document is compliant with the format you really wish to get, you can also define a JSON response schema. That’s what we’re gonna see next.

## Even better with JSON schema for structured output

In addition to the response MIME type, you can specify the JSON schema that the JSON response must comply with. Let’s complement the previous example, and add that schema definition:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("PROJECT_ID"))
    .location(System.getenv("LOCATION"))
    .modelName("gemini-1.5-pro-002")
    .responseMimeType("application/json")
    .responseSchema(Schema.newBuilder()
        .setType(Type.OBJECT)
        .putProperties("name", Schema.newBuilder()
            .setType(Type.STRING)
            .setDescription(
                "The name of the person described in the biography")
            .build())
        .putProperties("age", Schema.newBuilder()
            .setType(Type.INTEGER)
            .setDescription(
                "The age of the person described in the biography")
            .build())
        .build())
        .addAllRequired(List.of("name", "age"))
    .build();
```

The response should be an object with a string name, and an integer age properties.

## Bonus points with type safe objects with LangChain4j

In our LangChain4j based examples, in Java, each time, the low-level APIs offered by the framework always responded with JSON strings. But as a Java developer, we’d prefer to manipulate real Java objects instead. Of course, you can take advantage of the unmarshalling capabilities of your favorite JSON library. But what if the framework provided a higher level abstraction and did all the work for you? That’s where we’ll use LangChain4j’s AI services.

First, let’s define a data structure to hold the name and age of our biographies, with a Java record:

```java
record Person(String name, int age) { }
```

The next step is to create a contract that the framework will implement for you. In input, a string biography, and in output, a Person record:

```java
interface PersonExtractor {
    @SystemMessage("""
        Your role is to extract the name and age
        of the person described in the biography.
        """)
    Person extractPerson(String biography);
}
```

Notice how we annotate the method with a system instruction that instructs the model what its role is.

We still need to instantiate our chat model:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("PROJECT_ID"))
    .location(System.getenv("LOCATION"))
    .modelName("gemini-1.5-pro-002")
    .responseMimeType("application/json")
    .responseSchema(SchemaHelper.fromClass(Person.class))
    .build();
```

We specify again the response MIME type, and also the response schema. But we’re using a convenience method provided by the SchemaHelper class to derive a schema from a Java class (here, our Person record).

Now we can instantiate our person extractor contract as follows:

```java
PersonExtractor extractor =
    AiServices.create(PersonExtractor.class, model);
```

And finally, we can pass it the biography in input:

```java
Person person = extractor.extractPerson(bio);

System.out.println(person.name());  // Anna
System.out.println(person.age());   // 23
```

We have an instance of our Person record in output that is properly populated with the name and age of the person described in our biography\! That way, as Java developers, we manipulate a real Java object, in a type-safe manner\! Our application is enhanced by an LLM, but from a developer perspective, we manipulate interfaces and objects.

## Summary

Lots of articles, videos, or presentations often talk about the chatbot use case, when creating applications powered by large language models. However, data extraction is another very important and useful task where LLMs shine.

In this article, we saw different approaches to do data extraction: via prompting, function calling, or with a JSON mode or JSON schema. If your LLM supports the ability to set a response schema, that’s definitely the best way to get the JSON output you expect.

Also, if the LLM orchestration framework you use supports it, be sure to check if it’s able to return type-safe objects that you can manipulate with your programming language directly, without having to parse the JSON string yourself.
