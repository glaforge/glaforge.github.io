---
title: "A Gemini and Gemma tokenizer in Java"
date: 2024-10-04T15:41:10+02:00
image: /img/gemini/robot-chef-knife.jpg
tags:
  - java
  - large-language-models
  - machine-learning
  - langchain4j
  - generative-ai
---

It's always interesting to know _how the sausage is made_, don't you think?
That's why, a while ago, I looked at
[embedding model tokenization](https://glaforge.dev/posts/2024/02/05/visualize-palm-based-llm-tokens/),
and I implemented a little [visualization](https://tokens-lpj6s2duga-ew.a.run.app/) to see the tokens in a colorful manner.
Yet, I was still curious to see how Gemini would tokenize text...

Both LangChain4j Gemini modules (from
[Vertex AI](https://docs.langchain4j.dev/integrations/language-models/google-vertex-ai-gemini) and from
[Google AI Labs](https://docs.langchain4j.dev/integrations/language-models/google-ai-gemini))
can count the tokens included in a piece of text.
However, both do so by calling a REST API endpoint method called `countTokens`.
This is not ideal, as it requires a network hop to get the token counts, thus adding undesired extra latency.
Wouldn't it be nicer if we could count tokens locally instead?

Interestingly, both Gemini and the open-weights [Gemma](https://ai.google.dev/gemma)
models share the same tokenizer and token vocabulary.
Also, the tokenizer is based on [SentencePiece](https://github.com/google/sentencepiece),
which is a tokenizer/detokenizer implementing the byte-pair-encoding (BPE) and unigram language algorithms.

If you look at the [Gemma code on HuggingFace](https://huggingface.co/google/gemma-2-9b-it/tree/main),
you'll see a `tokenizer.json` file that you can open to see the available tokens in the vocabulary,
and a `tokenizer.model` file which is some kind of binary compressed variation.

Knowing that the list of tokens supported by Gemini and Gemma is available in those files, and how they are encoded,
I was curious to see if I could implement a Java tokenizer that could run locally, rather than calling a remote endpoint.

The `SentencePiece` implementation from Google is a C++ library, but I didn't really feel like wrapping it myself with JNI,
and fortunately, I discovered that the [DJL](https://djl.ai/) project had done the JNI wrapping job already.

So let's see how to tokenize text for Gemini and Gemma, in Java!

## Gemini and Gemma tokenization in Java with DJL

First of all, let's setup the dependency on DJL's `SentencePiece` module:

- From Maven:

```xml
<dependency>
    <groupId>ai.djl.sentencepiece</groupId>
    <artifactId>sentencepiece</artifactId>
    <version>0.30.0</version>
</dependency>
```

- From Gradle:

```groovy
implementation 'ai.djl.sentencepiece:sentencepiece:0.30.0'
```

I saved the `tokenizer.model` file locally.
Note that it's a 4MB file, as Gemini/Gemma have a very large vocabulary of around a quarter million of tokens!

Now, let's instantiate an `SpTokenizer` object that loads this vocabulary file, and tokenize some text:

```java
import ai.djl.sentencepiece.SpTokenizer;
// ...
Path model = Paths.get("src/test/resources/gemini/tokenizer.model");
byte[] modelFileBytes = Files.readAllBytes(model);

try (SpTokenizer tokenizer = new SpTokenizer(modelFileBytes)) {
    List<String> tokens = tokenizer.tokenize("""
    When integrating an LLM into your application to extend it and \
    make it smarter, it's important to be aware of the pitfalls and \
    best practices you need to follow to avoid some common problems \
    and integrate them successfully. This article will guide you \
    through some key best practices that I've come across.
    """);

    for (String token: tokens) {
        System.out.format("[%s]%n", token);
    }

    System.out.println("Token count: " + tokens.size());
}
```

When running this Java class, you'll see the following output:

```
[When]
[▁integrating]
[▁an]
[▁L]
[LM]
[▁into]
[▁your]
[▁application]
...

Token count: 61
```

## Next steps

Do we need next steps? Yes, why not!
My idea is to contribute a tokenizer module to LangChain4j,
so that the Vertex AI Gemini and the Google AI Gemini modules can both import it,
instead of relying on remote endpoint calls to count tokens.
