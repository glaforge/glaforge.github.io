---
title: "Redacting sensitive information when using Generative AI models"
date: 2024-11-25T09:24:50+01:00
image: /img/gemini/robot-redact.png
tags:
  - java
  - large-language-models
  - machine-learning
  - langchain4j
  - generative-ai
  - security
---

As we are making our apps smarter with the help of Large Language Models, we must keep in mind that we are often dealing with potentially sensitive information coming from our users. In particular, in the context of chatbots, our application users have the ability to input any text in the conversation.

Personally Identifiable Information (PII) should be dealt with the highest level of attention, because we care about our users, we don't want to leak their personal details, and we must comply with all sorts of laws or regulations. In a word, we are [responsible AI](https://cloud.google.com/responsible-ai) developers.

In this article, we'll learn about the Google Cloud [Data Loss Prevention](https://cloud.google.com/security/products/dlp) (DLP) API. It's a very powerful and rich service, which allows you to identify, classify, filter, redact any PII like names, passport numbers, bank account numbers, and more.

Today, with DLP, our goal is to redact the PII information sent by our user, before sending the user's message to our LLM.

In a nutshell (in pseudo-code), instead of doing:

```java
String userMessage = "...";
String response = model.generate(userMessage);
```

We want to add an instruction in the middle to redact the personally identifiable information before sending it to the LLM, so we need to to insert a method in between:

```java
String userMessage = "...";
String redactedMessage = redact(userMessage);
String response = model.generate(redactedMessage);
```

We'll simply redact the user message, but remember that there are other areas where you can apply good practices when handling user information. For example, when you store data, when you log interactions, etc.

## Meet our user!

Our user, let's call her Alicia, is a bit talkative, and shares way too much information that she should. Let's imagine that she is travelling, and lost her wallet, and needs some money to be wired in a rush. Maybe she could send a message to our travel application that looks as follows:

```java
String userMessage = """
    My name is Alicia Bob.
    My number is +33612345678, can you call me please?
    Please wire some $$$ on FR7630001007941234567890185
    You can check my passport if needed, it's 78TH67845.
    """;
```

Woh! In one message she gave her name, her phone number, her bank account (IBAN), and even her passport number! But our application doesn't necessarily need all those details!

In our code, we're sending that information to our Gemini model, using [LangChain4j](https://docs.langchain4j.dev/):

```java
var model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("GCP_PROJECT_ID"))
    .location(System.getenv("GCP_LOCATION"))
    .modelName("gemini-1.5-flash-002")
    .build();

String redactedMessage = redact(userMessage);

System.out.println(redactedMessage);

String response = model.generate(redactedMessage);
```

Our mission, if we accept it, is to implement the `redact()` method that will remove all the PII information from that request.

## Redacting this \[REDACTED\] message!

First, let's have a look at all the code of our `redact()` method, and we'll explain bits and pieces further down.
You can also look at this [gist](https://gist.github.com/glaforge/c7d7188aa3ff01a0f691b1e474ec0260) on Github with all the code as well.

```java
public static String redact(String userMessage) {
  try (var dlp = DlpServiceClient.create()) {
    var item = ContentItem.newBuilder().setValue(userMessage).build();
    var inspectConfigbuilder = InspectConfig.newBuilder();
    var redactConfig = DeidentifyConfig.newBuilder();
    var infoTypeTransfBuilder = InfoTypeTransformations.newBuilder();

    Stream.of("PERSON_NAME", "PHONE_NUMBER", "PASSPORT", "IBAN_CODE")
      .forEach(toRedact -> {
          var infoType = InfoType.newBuilder()
            .setName(toRedact)
            .build();
          inspectConfigbuilder.addInfoTypes(infoType);

          var replaceValueConfig =
            ReplaceValueConfig.newBuilder()
              .setNewValue(Value.newBuilder()
              .setStringValue("[" + toRedact + "]").build())
              .build();

          var primitiveTransformation =
            PrimitiveTransformation.newBuilder()
              .setReplaceConfig(replaceValueConfig).build();

          var infoTypeTransformation =
            InfoTypeTransformations.InfoTypeTransformation.newBuilder()
              .addInfoTypes(infoType)
              .setPrimitiveTransformation(primitiveTransformation)
              .build();

          infoTypeTransfBuilder
            .addTransformations(infoTypeTransformation);
        });

    redactConfig.setInfoTypeTransformations(
      infoTypeTransfBuilder);

    DeidentifyContentRequest request =
      DeidentifyContentRequest.newBuilder()
        .setParent(
            LocationName.of(System.getenv("GCP_PROJECT_ID"), "global")
            .toString())
        .setItem(item)
        .setDeidentifyConfig(redactConfig)
        .setInspectConfig(inspectConfigbuilder)
        .build();

    DeidentifyContentResponse response =
      dlp.deidentifyContent(request);

    return response.getItem().getValue();
  } catch (IOException e) {
    throw new RuntimeException("Failed to redact message.", e);
  }
}
```

As you can see, the DLP API is quite a bit verbose, but it's really super powerful, and is capable of more than just redacting PII information.

First of all, we need to create a client for the DLP service (which is `AutoCloseable`, hence the `try` with resources pattern):

```java
try (var dlp = DlpServiceClient.create()) { ... } catch (...) {...}
```

We create a `ContentItem` from our user message:

```java
var item = ContentItem.newBuilder()
    .setValue(userMessage)
    .build();
```

Then we'll create some `InfoType`s which represent the different kinds of identifiable information we're interested in:

```java
Stream.of("PERSON_NAME", "PHONE_NUMBER", "PASSPORT", "IBAN_CODE")
    .forEach(toRedact -> {
        var infoType = InfoType.newBuilder().setName(toRedact).build();
        inspectConfigbuilder.addInfoTypes(infoType);
```

Here, we care only for the person's name, phone number, passport, and IBAN codes. But there are a ton of [other details we can redact](https://cloud.google.com/sensitive-data-protection/docs/infotypes-reference).

The next few instructions will associate a text transformation rule to transform the PII information into some redacted format. We could have used just something like `[REDACTED]` but we are going to reuse the name of the info type: `[PERSON_NAME]`, `[PHONE_NUMBER]`, `[PASSPORT]`, and `[IBAN_CODE]`:

```java
var replaceValueConfig =
    ReplaceValueConfig.newBuilder()
        .setNewValue(Value.newBuilder()
            .setStringValue("[" + toRedact + "]").build())
        .build();

var primitiveTransformation =
    PrimitiveTransformation.newBuilder()
        .setReplaceConfig(replaceValueConfig).build();

var infoTypeTransformation =
    InfoTypeTransformations.InfoTypeTransformation.newBuilder()
        .addInfoTypes(infoType)
        .setPrimitiveTransformation(primitiveTransformation)
        .build();
```

We add all those text transformations to the information type transformation builder, and then it's time to actually make the request to the DLP service:

```java
DeidentifyContentRequest request =
    DeidentifyContentRequest.newBuilder()
        .setParent(
            LocationName.of(System.getenv("GCP_PROJECT_ID"), "global")
              .toString())
        .setItem(item)
        .setDeidentifyConfig(redactConfig)
        .setInspectConfig(inspectConfigbuilder)
        .build();

DeidentifyContentResponse response = dlp.deidentifyContent(request);

return response.getItem().getValue();
```

We wire everything together by creating a `DeidentifyContentRequest` instance with our user message (the item) and all PII identification and transformation configuration. We configured the DLP service by passing our Google Cloud project ID, after having [enabled the API](https://console.cloud.google.com/apis/library/dlp.googleapis.com). We call the DLP service with `dlp.deidentifyContent(request)` and finally we can get the redacted value with `response.getItem().getValue()`.

So what does our original user message look like now, once redaction is applied? Let's see:

```
My name is [PERSON_NAME] [PERSON_NAME].
My number is [PHONE_NUMBER], can you call me please?
Please wire some $$$ on [IBAN_CODE]
You can check my passport if needed, it's [PASSPORT].
```

No more personally identifiable information left!


## Summary

Our user's trust is one of the most important things we must care about. Not only for compliance purposes but also simply because it's the right thing to do. There are so many hackers out there trying to get access to such information, for nefarious reasons. Let's not offer them an extra chance to harm our users.

In this article and sample code, we've seen that the [Google Cloud DLP API](https://cloud.google.com/security/products/dlp?hl=en) is able to redact information, but it can be used in a myriad of ways, for example to analyze data at rest as well, or you can deidentify / reidentify information as well. Be sure to check out what this service is capable of doing. We focused on just a few PII details, but DLP supports a [huge number of identifiable information](https://cloud.google.com/sensitive-data-protection/docs/infotypes-reference).

There's a big [list of snippets](https://cloud.google.com/sensitive-data-protection/docs/samples/?hl=en) of code that you can have a look at to see what you can do with the DLP API. There are [SDKs](https://cloud.google.com/sensitive-data-protection/docs/libraries) for various programming languages, if you use another language than Java. And check out the [documentation](https://cloud.google.com/sensitive-data-protection/docs/sensitive-data-protection-overview)!

You can apply this technique to filter user input before sending it to a generative model, but you can also apply it in output as well, when/if you log user messages, or store data in databases or other places.

And remember, be mindful of your user's data!
