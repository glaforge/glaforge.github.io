---
title: "Advanced RAG — Using Gemini and long context for indexing rich documents (PDF, HTML...)"
date: 2025-07-13T11:25:25+02:00
tags:
  - generative-ai
  - large-language-models
  - machine-learning
  - retrieval-augmented-generation
  - langchain4j

similar:
  - "posts/2025/07/06/advanced-rag-hypothetical-question-embedding.md"
  - "posts/2025/02/25/advanced-rag-sentence-window-retrieval.md"
  - "posts/2025/03/03/llms-txt-to-help-llms-grok-your-content.md"
---

A very common question I get when presenting and talking about advanced RAG
(Retrieval Augmented Generation) techniques, is
**how to best index and search rich documents like PDF** (or web pages),
that contain both text and rich elements, like pictures or diagrams.

Another very frequent question that people ask me is about **RAG versus long context windows**.
Indeed, models with long context windows usually have a more global understanding of a document,
and each excerpt in its overall context. But of course,
you can't feed all the documents of your users or customers in one single augmented prompt.
Also, RAG has other advantages like offering a much lower latency, and is generally cheaper.

However, the answer I usually give is that you can take the best of both worlds, with a **hybrid approach**:

- You can **use a RAG approach** (or a mix of keyword search engine, graph RAG, or vector-based RAG) to find relevant documents for the user query.
- And then **feed only those key documents in the context window** of a model like [Gemini](https://cloud.google.com/vertex-ai/generative-ai/docs/start/quickstart?usertype=adc&utm_campaign=CDR_0x7a40493f_default_b431756993&utm_medium=external&utm_source=blog) that accepts 1+ million tokens.

That way, the model can focus on whole documents, with a finer understanding of each one,
but is not overwhelmed with too many documents to find the needle in the haystack.

> The current trending topic of **context engineering** is exactly about this:
> it's crucial to give the best contextual information to your favorite LLM!

# **Using Gemini to finely index a rich PDF document for RAG search**

Before feeding the relevant document in the context window of the LLM, we first need to index it.

## About hypothetical question generation

In my last article, I explored an interesting technique called [Hypothetical Questions embedding]({{<ref "posts/2025/07/06/advanced-rag-hypothetical-question-embedding.md">}}). This technique works great with question/answer tasks, as the idea is to compare _"hypothetical"_ questions to user questions. This tends to give higher levels of similarity when calculating the vector similarity for the semantic search.

One aspect I haven't explained in detail is how many questions we should generate for a given paragraph or set of sentences. It seemed to me that 10 questions or so per chunks of 2000 characters or less was a good rule of thumb. But if you use an LLM to parse a document, and let it figure out sections of text that make sense together, the LLM can as well figure out which questions to ask, and how many of them, depending on both the length of the given text, and its semantic density.

## What about diagrams and other pictures?

Sometimes customers I talk to manage to extract and embed the text in rich documents, however, they're not sure how to treat the various diagrams and images in those documents. They may also use an image model to calculate embeddings for whole pages (containing both the text and the pictures). It's possible to use image models to extract bounding boxes around images and then somehow extract just the boxes containing the pictures. Then they analyze the picture, get a text description, and embed that text.

Again, a multimodal model like Gemini is actually able to look at each page, see where all the diagrams are, and see all the images in each page, to extract some meaningful description.

## 💡 The idea: Use an LLM to chunk text, generate questions, and describe pictures

All at once! Let’s use Gemini to do this for us (or any multimodal LLM with a context window large enough to contain a whole document of your corpus). We’ll use structured output to be get a JSON output that you can easily parse to extract the key information (chunks, questions, image descriptions, but also pages or titles).

# **The smart prompt**

Let’s have a look at the following prompt which we can use as system instructions for an LLM call:

```
Your goal is to analyze long documents for Retrieval Augmented
Generation (RAG) by splitting the content in pieces.
The content pieces will be the chunks that will be embedded
thanks to an embedding model to calculate vector embedding
to store in a vector database.

Given a long PDF document, you must extract and format the
content so that each piece of content is meaningful
as a standalone unit of text.

Each piece of content should be tagged with the page number
it appears in, and the title of the section it's situated in,
as well as a list of questions whose answers can be provided
by this piece of content.

If there is a table of content, you can use it for adding
more context to a given excerpt, or for the section titles,
but don't return the table of content as an excerpt.

When you encounter an image, a picture, or a diagram,
the piece of content you return should be the description
of the image with as much detail as possible.
If the figure has a caption, use it as the title
of the piece of content.
Like for text excerpts, use the title of the current section
the image is in in its description.

Don't create pieces of text for menu, navigation,
and other unrelated elements.
But be sure to create a piece of content for all the text
of the document.
Go through ALL the pages of the document.
The piece of text should be the exact text found in the article.
DON'T change a single world. DON'T summarize.
```

Let’s examine the prompt, but feel free to enhance or expand it for your needs:

- The first paragraph gives the general **goal** we try to achieve, and explains the general idea of the task we ask the LLM.
- The second paragraph tells the LLM it’s important to **create pieces of content** (chunks\!) **that are meaningful**. It tends to help it find relevant chunks that talk about the same topic or aspect, instead of splitting the document into random and/or fixed length spaces.
- The third paragraph details what information to carry for each individual piece of content. We want to retain:
  - the **page number** (in particular for PDF documents),
  - the **title of the section** the text appears in (if it’s a structured document with various sections and header titles),
  - a **list of questions** in the spirit of the Hypothetical Question Embedding technique we’ve used in the previous article,
  - and of course the **chunk** itself.
- The fourth paragraph says that we don’t need to create chunks for the table of contents, but that a table of contents can actually be useful for crafting the titles of the sections.
- The fifth paragraph now talks about diagrams, pictures, etc. It tells the LLM it should actually create a detailed description of the image as a textual representation. It also advises to pay attention to captions or the section the picture appears in.
- The last paragraph suggests to ignore certain elements of the page or document, like navigation elements, and also ask the LLM to create chunks of text for the whole document without missing anything, and to quote the text as is, without any rewriting or summarization.

Generally, the LLM will generate a number of questions that makes sense for the length and semantic density of the chunk. A smaller paragraph with more pieces of key information could yield more questions than a much longer paragraph that doesn’t carry much semantic meaning.

It’s important to give further advice on which content it can safely ignore, or that it should really take the text verbatim without any creative changes it could think of.

For the illustrations, not only will the LLM give you a detailed description of them, but it will also generate questions that can be answered by these illustrations. For example, if it’s a picture of a flag of Germany, it may generate a question like what are the colors of the German flag.

## Defining the structured output

In order to guide the LLM to generate a useful JSON output that you can then later parse easily, you can define its structured output JSON schema. Models like Gemini support this feature. Sometimes, some models require you to define the format of the JSON output via prompting, but more modern and bigger models usually support this feature out of the box.

The structured output I defined:

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "The title of the content."
      },
      "text": {
        "type": "string",
        "description": "The text content."
      },
      "page": {
        "type": "integer",
        "description": "The page number."
      },
      "questions": {
        "type": "array",
        "description": "A list of questions whose answers can be found in this pience of text.",
        "items": {
          "type": "string"
        }
      }
    },
    "required": ["title", "text", "page", "questions"]
  }
}
```

Here, we have an array of pieces that contain a title, a text chunk (which might be the detailed description of a picture), a page, and a list of hypothetical questions. All those fields are required.

I didn’t put any top level information like the title of the whole document, its location (URL/URI or unique ID), or potentially some tags that help categorize the document. But these are extremely useful bits of information you can also request the LLM to generate for you. I wrote about [using LLMs to tag pictures]({{< ref "posts/2024/08/12/let-llm-suggest-instagram-hashtags/" >}}) in an older article.

# **The prompt in action**

I’ve exported the Wikipedia article about the city of [Berlin](https://en.wikipedia.org/wiki/Berlin). I saved it as a PDF document.
Then I used the prompt from the previous section as **system instructions**. I passed the PDF document as a user message. I simply tweaked my prompt by using [Google AI Studio](https://aistudio.google.com/prompts/new_chat) but feel free to use any tool you prefer.

Let’s see some extracts of the JSON that Gemini generated for this PDF.

For the first chunk, it followed exactly the content of the first paragraph of the Wikipedia page:

```json
{
  "page": 1,
  "questions": [
    "What is Berlin's status in Germany?",
    "What is the population of Berlin?",
    "Which state surrounds Berlin?",
    "What is the population of Berlin's urban and metropolitan areas?"
  ],
  "text": "Berlin (/bɜːrˈlɪn/ bur-LIN; German: [bɛɐ̯ˈliːn]) is the capital and largest city of Germany, by both area and population.[10] With 3.7 million inhabitants,[5] it has the highest population within its city limits of any city in the European Union. The city is also one of the states of Germany, being the third smallest state in the country by area. Berlin is surrounded by the state of Brandenburg, and Brandenburg's capital Potsdam is nearby. The urban area of Berlin has a population of over 4.6 million and is therefore the most populous urban area in Germany.[6][11] The Berlin-Brandenburg capital region has around 6.2 million inhabitants and is Germany's second-largest metropolitan region after the Rhine-Ruhr region,[5] as well as the fifth-biggest metropolitan region by GDP in the European Union.[12]",
  "title": "Berlin"
}
```

It used `Berlin` as title, `1` as we’re on the first page, and it generated 4 questions, including questions related to the information about the population of the city, where it’s geographically situated, or what its relationship with the country itself (it’s the capital).

For the info box showing the flag and coat of arms of the city:

```json
 {
    "page": 1,
    "questions": [
      "What does the flag of Berlin look like?",
      "What does the coat of arms of Berlin depict?"
    ],
    "text": "The infobox shows the flag of Berlin, which is a horizontal tricolor of red, white, and red, with the city's coat of arms in the center of the white band. The coat of arms of Berlin is also shown, depicting a black bear standing rampant with its tongue out on a silver shield, topped by a golden crown.",
    "title": "Flag and Coat of arms"
  },
```

It described clearly the orientation and colors of the bands of the German flag, and described the bear on the coat of arms. The title also mentioned the flag and coat of arms. Some embedding models sometimes accept some title metadata that help them better understand the context for calculating vector embeddings. The questions are also quite obvious: what the flag looks like or what is depicted in the coat of arms.

I won’t go through the whole (and long\!) document, but you’ll notice that for some short paragraphs with dense information, the LLM can generate a lot more questions than for a paragraph that doesn’t say much (for example with more descriptive but less important details).

# **What to do with this structured output?**

As we’ve activated structured output, we had the following JSON structure returned by the LLM:

```json
[
  {
     "page": 1,
     "questions": [
       "question 1", "question 2"...
     ],
    "text": "...",
    "title": "..."
  }...
]
```

With that JSON document, you can go through each chunk, calculate vector embeddings for both questions and the chunk itself, and store the page and title as metadata, in a database supporting vector operations. Then you’re ready to go with your RAG pipeline\!

# **Implementation with LangChain4j**

This approach is pretty straightforward to implement with any framework, and of course, with [LangChain4j](https://docs.langchain4j.dev/) in Java.

{{< details summary="Click to view the code and explanations" >}}
First, describe the data structure that will be used for the structured output:

```java
@Description("A single piece of content")
record PieceOfContent(
    @Description("Number of the page this text appears in")
    int page,
    @Description("Title of the section of this text")
    String title,
    @Description("The text chunk")
    String text,
    @Description("List of questions that can be answered by this text")
    List<String> questions
) {}
```

Then, configure the chat model, here we’ll use Gemini 2.5 Flash, and load the document:

```java
try (VertexAiGeminiChatModel model = VertexAiGeminiChatModel.builder()
    .project(System.getenv("GCP_PROJECT_ID"))
    .location(System.getenv("GCP_LOCATION"))
    .modelName("gemini-2.5-flash")
    .responseSchema(SchemaHelper.fromClass(PieceOfContent[].class))
    .build()) {

    Path pathToPdf = Path.of("src/main/resources/Berlin-Wikipedia.pdf");
    byte[] pdfBytes = Files.readAllBytes(pathToPdf);
    String encodedPdf = new String(Base64.getEncoder().encode(pdfBytes));
```

Now, it’s time to prepare the call to the model:

```java
ChatResponse chatResponse = model.chat(ChatRequest.builder()
.messages(SystemMessage.from("""
        Your goal is to analyze long documents for Retrieval Augmented
        Generation (RAG) by splitting the content in pieces.
        The content pieces will be the chunks that will be embedded
        thanks to an embedding model to calculate vector embedding
        to store in a vector database.

        Given a long PDF document, you must extract and format
        the content so that each piece of content is meaningful
        as a standalone unit of text.

        Each piece of content should be tagged with the page number
        it appears in, and the title of the section it's situated in,
        as well as a list of questions whose answers can be provided
        by this piece of content.

        If there is a table of content, you can use it for adding
        more context to a given excerpt, or for the section titles,
        but don't return the table of content as an excerpt.

        When you encounter an image, a picture, or a diagram, the piece
        of content you return should be the description of the image
        with as much detail as possible.
        If the figure has a caption, use it as the title of the piece
        of content.
        Like for text excerpts, use the title of the current section
        the image is in in its description.

        Don't create pieces of text for menu, navigation, references,
        and other unrelated elements.
        But be sure to create a piece of content
        for all the text of the document.
        Go through ALL the pages of the document.
        The piece of text should be the exact text found in the article.
        DON'T change a single world. DON'T summarize.
        """),
    UserMessage.from(
        TextContent.from("Analyze the following document:"),
        PdfFileContent.from(PdfFile.builder()
            .base64Data(encodedPdf)
            .mimeType("application/pdf")
            .build()))
)
.build());

String responseText = chatResponse.aiMessage().text();
PieceOfContent[] piecesOfContent =
    new Gson().fromJson(responseText, PieceOfContent[].class);
```

We passed the prompt we talked about, and the PDF file of the Wikipedia page. The model then returns the JSON structure that we unmarshal into an array of our record.

{{</details>}}

# **Conclusion**

Taking advantage of a large language model like Gemini allows you to avoid going through the chunking in your own way, and instead rely on the LLM to do semantic chunking for you. You can read more about Retrieval Augmented Generation in some of my [previous articles]({{<ref "tags/retrieval-augmented-generation/">}}) on the topic.
