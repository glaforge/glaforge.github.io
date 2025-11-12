---
title: "Text classification with Gemini and LangChain4j"
date: 2024-07-11T22:26:36+02:00
image: /img/gemini/letter-sorting.jpg
tags:
  - generative-ai
  - langchain4j
  - java
  - google-cloud
  - large-language-model

similar:
  - "posts/2024/07/30/sentiment-analysis-with-few-shots-prompting.md"
  - "posts/2024/03/27/gemini-codelab-for-java-developers.md"
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
---

Generative AI has potential applications far beyond chatbots and Retrieval Augmented Generation.
For example, a nice use case is: **text classification**.

I had the chance of meeting some customers and prospects who had the need for triaging incoming requests, or for labeling existing data.
In the first case, a government entity was tasked with routing citizen requests to access undisclosed information to the right governmental service that could grant or reject that access. In the second case, a company needed to sort out tons of existing internal documents that were not properly organized, and they wanted to quickly start better structuring this trove of information, by labelling each of these docs into different categories.

In both situations, the task was a **text classification** one: to put each request or document in a distinct pile, so they could more easily be sorted out, organized, and treated more rapidly.

Before generative AI, text classification would be handled by data scientists who would craft and train dedicated machine learning models for that purpose. But it is now also possible to do the same with the help of large language models.
That's what I'd like to explore with you in this article today.

As usual, I'll be using the [Gemini model](https://deepmind.google/technologies/gemini/),
and the [LangChain4j framework](https://docs.langchain4j.dev/) for implementing illustrative examples in Java.

## Text classification: putting a label on a document

Before diving into the code, let's step back a short moment to clarify what text classification is about.
When we classify documents, we put a label on them.

For example, in a bug tracker, we could automate adding labels on new tickets that say that the bug report is related to a certain component.
So we would put the name of the component as the label for that new ticket.

For routing incoming document access requests, we could put the label of the service that must treat the request, etc.

**Filtering** is also a text classification problem: we can filter the content of emails to state whether they are spam or not.
And we can also use LLMs to filter harmful content from users' inputs, and even classify the category of harm (hateful speech, harrasment, etc.)

## Zero-shot prompting: just ask the model!

What about just asking a large language model what it thinks the classification, or the label should be?
And indeed, LLMs are often very smart and can figure out the correct classification, without being trained specifically for that purpose.

Let's illustrate this with a very common type of text classification: **sentiment analysis**.

First, we can define an `enum` representing the various sentiments that can be recognized:

```java
enum Sentiment {
    POSITIVE, NEUTRAL, NEGATIVE
}
```

We create a `record` which will hold the result of the sentiment analysis:

```java
record SentimentClassification(
    Sentiment sentiment
) {}
```

We will also need an `interface` to represent the type-safe Java service that the developers integrating this LLM-backed solution will call to retrieve the sentiment of the text:

```java
interface SentimentClassifier {
    SentimentClassification classify(String text);
}
```

Notice that it takes in input an unstructured `String` text, but in output, you'll manipulate a strongly typed object, not just a mere string.

It's time to prepare our Gemini model:

```java
var model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-pro")
    .responseMimeType("application/json")
    .responseSchema(Schema.newBuilder()
        .setType(Type.OBJECT)
        .putProperties("sentiment",
            Schema.newBuilder()
                .setType(Type.STRING)
                .addAllEnum(Stream.of(Sentiment.values())
                    .map(Enum::name)
                    .collect(Collectors.toList()))
                .build())
        .build())
    .build();
```

We're taking advantage of the latest feature of Gemini and LangChain4j, which permits to specify that we want 100% valid JSON in output,
and even better than this, we want the generated JSON output to comply with a JSON schema!

Now we create the sentiment analysis service:

```java
SentimentClassifier sentimentClassifier =
    AiServices.create(SentimentClassifier.class, model);
```

And we call it to retrieve the sentiment of the text we want to analyze:

```java
SentimentClassification classification =
    sentimentClassifier.classify("I am happy!");
System.out.println(classification.sentiment()); // POSITIVE
```

We didn't even need to give Gemini examples, this is why it's called _zero-shot prompting_.
LLMs are usually smart enough to easily handle familiar classification tasks like sentiment analysis.

## Few-shot prompting: when the model needs a little help

A more common approach with LLMs for text classification is _few-shot prompting_.
As the name implies, it's a prompting technique.

You give the model a task (classifying text), and you show it examples of classifications,
with a clear input/output format, to force the LLM to reply with just the expected class.

```java
ChatLanguageModel model = VertexAiGeminiChatModel.builder()
    .project(PROJECT_ID)
    .location(LOCATION)
    .modelName("gemini-1.5-flash-001")
    .maxOutputTokens(10)
    .maxRetries(3)
    .build();

PromptTemplate promptTemplate = PromptTemplate.from("""
    Analyze the sentiment of the text below.
    Respond only with one word to describe the sentiment.

    INPUT: This is fantastic news!
    OUTPUT: POSITIVE

    INPUT: Pi is roughly equal to 3.14
    OUTPUT: NEUTRAL

    INPUT: I hate disliked the pizza. Who'd put pineapple toppings?
    OUTPUT: NEGATIVE

    INPUT: {{text}}
    OUTPUT:
    """);

Prompt prompt = promptTemplate.apply(
    Map.of("text", "I love strawberries!"));

Response<AiMessage> response = model.generate(prompt.toUserMessage());

System.out.println(response.content().text()); // POSITIVE
```

In the above approach, we use LangChain4j's `PromptTemplate`, with a placeholder value `{{text}}` that will contain the text to classify.
We don't use an `enum` value though, so we have to discriminate against a string in the end.
But we could also apply the same schema response handling as in our previous zero-shot example.

Let's rewrite this code a little bit differently, to _fake_ a conversation with the model.
The model will see an exchange between a user and itself, and will also follow the same syntax, and will reply with just one word: the sentiment.
We'll use system instructions, and alternating AI and user messages:

```java
List<ChatMessage> fewShotPrompts = List.of(
    SystemMessage.from("""
        Analyze the sentiment of the text below.
        Respond only with one word to describe the sentiment.
        """),

    UserMessage.from("This is fantastic news!"),
    AiMessage.from("POSITIVE"),

    UserMessage.from("Pi is roughly equal to 3.14"),
    AiMessage.from("NEUTRAL"),

    UserMessage.from("I hate disliked the pizza. " +
                     "Who'd put pineapple toppings?"),
    AiMessage.from("NEGATIVE"),

    UserMessage.from("I love strawberries!")
);

response = model.generate(fewShotPrompts);

System.out.println(response.content().text()); // POSITIVE
```

Same outcome, stawberries are yummy!

## Text classification with embedding models

In the two previous sections, we took advantage of LLMs' abilities to classify text on their own,
based on their intrinsic knowledge, or with the help of a few examples.
But there's another way we can investigate: **using embedding vectors** to compare texts.

Embedding vectors are mathematical representations of words/sentences/paragraphs, in the form of a vector of floating point values.
The way those vectors are calculated by _embedding models_ makes those vector close to each other
(in terms of distance) when they are semantically close.
You can have a look at my recent article
[introducing vector embeddings]({{<ref "posts/2024/07/02/the-power-of-embeddings-how-numbers-unlock-the-meaning-of-data/">}}).

LangChain4j provides a `TextClassifier` interface which allows to classify text, by comparing it to sets of other texts
that belong to a same class. So we give a map of possible labels, associated with lists of texts that belong to that category.

In particular, there's an `EmbeddingModelTextClassifier` that uses embedding models to compare the texts with the examples of each labels.
We can even tweak its internal algorithm to say whether we prefer if a text should be closer to the average of all the examples,
or if we prefer if it's closer to one of the examples (by default, it's half distance to the mean, and half distance to the closest example.)

So let's have a look at this solution.

Instead of doing sentiment analysis, we'll go with recipe classification: our goal will be to classify a recipe,
to know if it's an _appetizer_, a _main course_, or a _dessert_.

First, we need to define our labels, with an `enum`:

```java
enum DishType {
    APPETIZER, MAIN, DESSERT
}
```

Because we don't have a dataset of recipes, we'll use Gemini to generate sample recipes, for each label.
For that, we need to configure Gemini:

```java
private static final VertexAiGeminiChatModel CHAT_MODEL =
    VertexAiGeminiChatModel.builder()
        .project(PROJECT_ID)
        .location(LOCATION)
        .modelName("gemini-1.5-flash")
        .build();
```

We'll also configure an embedding model to calculate the vector embeddings:

```java
private static final VertexAiEmbeddingModel EMBEDDING_MODEL =
    VertexAiEmbeddingModel.builder()
        .project(PROJECT_ID)
        .location(LOCATION)
        .endpoint(ENDPOINT)
        .publisher("google")
        .modelName("text-embedding-004")
        .taskType(VertexAiEmbeddingModel.TaskType.CLASSIFICATION)
        .build();
```

Vertex AI's embedding models are capable of handling various tasks, including:

- **classification**,
- semantic similarity,
- clustering,
- question answering,
- fact verification,
- query or document retrieval.

Let's create a method to generate a recipe for a particular type of dish:

```java
private static String recipeOf(DishType type) {
    return CHAT_MODEL.generate(
        "Write a recipe for a %s dish"
            .formatted(type.name().toLowerCase()));
}
```

And we'll collect 3 examples of recipes for each type of dish:

```java
var examplesOfRecipes = Stream.of(DishType.values())
    .collect(
        Collectors.toMap(
            dishType -> dishType,
            dishType ->
                Stream.generate(() -> recipeOf(dishType))
                    .limit(3)
                    .toList()
        )
    );
```

That way, we have our dataset ready, and we'll prepare a text classifier:

```java
EmbeddingModelTextClassifier<DishType> recipeClassifier =
    new EmbeddingModelTextClassifier<>(EMBEDDING_MODEL,
                                       examplesOfRecipes);
```

It takes a little while to calculate the initial embedding vectors of all the samples, but now our classifier is ready!
Let's see if the following recipe is an _appertizer_, a _main course_, or a _dessert_:

```java
List<DishType> classifiedDishes = recipeClassifier.classify("""
    **Classic Moist Chocolate Cake**

    This recipe delivers a rich, moist chocolate cake that's
    perfect for any occasion.

    Ingredients:
    * 1 ¾ cups all-purpose flour
    * 2 cups granulated sugar
    * ¾ cup unsweetened cocoa powder
    * 1 ½ teaspoons baking powder
    * 1 ½ teaspoons baking soda
    * 1 teaspoon salt
    * 2 large eggs
    * 1 cup milk
    * ½ cup vegetable oil
    * 2 teaspoons vanilla extract
    * 1 cup boiling water

    Instructions:
    * Preheat oven to 350°F (175°C). Grease and flour two 9-inch
      round cake pans.
    * Combine dry ingredients: In a large bowl, whisk together flour,
      sugar, cocoa powder, baking powder, baking soda, and salt.
    * Add wet ingredients: Beat in eggs, milk, oil, and vanilla until
      combined.
    * Stir in boiling water: Carefully stir in boiling water. The
      batter will be thin.
    * Bake: Pour batter evenly into prepared pans. Bake for 30-35
      minutes, or until a toothpick inserted into the center comes
      out clean.
    * Cool: Let cakes cool in pans for 10 minutes before transferring
      to a wire rack to cool completely.
    """);

System.out.println("This recipe is of type: " + classifiedDishes);
// This recipe is of type: [DESSERT]
```

And voilà, we used the full power of embedding models to calculate text similarity to classify our chocolate cake recipe as a dessert!

## Conclusion

Large Language Models like Gemini are great at classifying text, thanks to their general knowledge of the world that they acquired during their training. But for more specialized use cases, we might need to guide the LLM to recognize labels, because the subject is very specific to our data. That's when few-shot prompting or embedding model-based classification helps.

If we have lots of samples for each label, using a few-shot prompting approach means we'll have to pass all those examples again and again in the context window of the LLM, which yields a high token count. So if you pay per tokens, it can become a bit expensive.

If we use the embedding model text classifier, it might take a while to compute all the embedding vectors, but we'll do it only once, and then we can just calculate the vector embedding for the text to classify, so it's just the tokens of the text to classify that is incurred.
If we have lots of samples, the classifier needs to do quite a few vector / matrix computations to calculate the distance to the samples, but it's usually quite fast (unless we really have hundreds or thousands of samples).

I hope this article showed you that Generative AI is useful beyond the usual chatbots and RAG use cases.
It's great at text classification as well.
And LangChain4j and Gemini are well suited for that use case, and you learned how to implement different approaches to do text classification.
