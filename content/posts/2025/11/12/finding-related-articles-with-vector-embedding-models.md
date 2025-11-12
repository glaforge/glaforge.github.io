---
title: "Finding related articles with vector embedding models"
date: 2025-11-12T08:52:42+01:00
tags:
- generative-ai
- machine-learning
- large-language-models
image: /img/gemini/similar-document-vector-embedding.jpg
similar:
  - "posts/2025/03/03/llms-txt-to-help-llms-grok-your-content.md"
  - "posts/2025/09/08/in-browser-semantic-search-with-embeddinggemma.md"
  - "posts/2024/12/02/semantic-code-search-for-programming-idioms-with-langchain4j-and-vertex-ai-embedding-models.md"
---

When you enjoyed reading an article on a blog, you might be interested in other, similar articles.
As a blog author, you want to surface that relevant content to your readers to keep them engaged.
For a long time, I've wanted to add a _"Similar articles"_ section to my posts, but I never quite found a simple and effective way to do it.
Hugo (the static stite generator I'm using) has a [related content](https://gohugo.io/content-management/related-content/) concept, but it wasn't really what I was after.

But with the power of modern generative AI models (in particular, embedding models),
I've finally implemented a system that automatically finds and displays related content.
In this post, I'll walk you through how I did it.

## The Core Idea: From Words to Numbers

The fundamental challenge is to determine how _"similar"_ two articles are.
Humans can do this intuitively by reading them, but how can a computer do it? The answer lies in a technique called **vector embeddings**.

The idea is to convert a piece of text into a list of numbers, called a vector.
This vector represents the text's semantic meaning.
Texts with similar meanings will have vectors that are "close" to each other in a multi-dimensional space.
So, the process looks like this:

1.  **Summarize:** For each article, create a concise summary that captures its essence.
2.  **Embed:** Convert each summary into a vector embedding.
3.  **Compare:** Calculate the "distance" between every pair of vectors.
4.  **Display:** For each article, find the ones with the closest vectors and display them.

Let's dive into each step.

### Step 1: Summarizing the Content

My blog posts can be quite long and cover various topics.
To get a clean signal for comparison, I first decided to summarize each article.
This helps to distill the core message and remove noise.

This approach was also necessary because most embedding models have limitations on the size of the input text they can accept.
Many of my articles were too long for the embedding model's input, so creating detailed summaries that are as close as possible to the original content ensures that the resulting embedding vector accurately represents the article's meaning.

For this task, I turned to Google's **Gemini** model, specifically `gemini-2.5-flash`, which is fast and effective.
With the help of [Gemini CLI](https://geminicli.com/),
I wrote a simple Node.js [script](https://github.com/glaforge/glaforge.github.io/blob/main/summarize-and-embed.js)
that iterates through all my Markdown files, extracts the content, and sends it to the Gemini API with a straightforward prompt:

```javascript
const prompt = `Please provide a long, detailed, and factual summary
of the following article. The summary should capture the main points,
key arguments, and any important conclusions. It should be
comprehensive enough to give a good understanding of the article's
content.

Article:
${text}

Summary:
`
```

To call Gemini, you need to import the `@google/genai module`:
```javascript
import {GoogleGenAI} from '@google/genai';
```

Pass an API key (that you can obtain from [Google AI Studio](https://aistudio.google.com/api-keys)):
```javascript
const genAI = new GoogleGenAI({apiKey: API_KEY});
```

Then call the model to create the summary:
```javascript
const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
});

const summary = result?.candidates?.[0]?.content?.parts?.[0]?.text;
```


To avoid re-generating summaries every time I run the script, I added a simple caching mechanism.
The first time the script runs, it generates a summary and saves it to a text file in a `summaries/` directory, mirroring the structure of my `content/posts/` directory. On subsequent runs, it just reads the summary from the cache.

### Step 2: Creating Vector Embeddings

Once I have a summary, the next step is to convert it into a vector. This is where embedding models come in.
I used another of Google's models, `gemini-embedding-001`, which is designed for this exact purpose.

The model takes a piece of text and returns a vector.
You can even configure the size of this vector.
I chose a dimensionality of 256, which provides a good balance between detail and performance (to speed up vector similarity calculations).

I also specified the `task_type` as `SEMANTIC_SIMILARITY`, which optimizes the embeddings for this kind of comparison task.
You can check the other [task types](https://ai.google.dev/gemini-api/docs/embeddings#supported-task-types), for classification, clustering, Q&A, etc.

Again, this is fairly short to write in JavaScript:
```javascript
const result = await genAI.models.embedContent({
    model: "gemini-embedding-001",
    contents: texts,
    task_type: "SEMANTIC_SIMILARITY",
    output_dimensionality: 256,
});
const embeddings = result?.embeddings;
```

My script collects all the summaries and sends them to the embedding model in batches of 100 (the maximum allowed by the API).
This is much more efficient than sending them one by one.

### Step 3: Calculating Similarity

Now that every article's summary is represented by a 256-dimensional vector, how do we measure the "distance" between them?
The most common method for this is **cosine similarity**.

Imagine each vector as an arrow pointing in a certain direction in a 256-dimensional space.
The [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) measures the angle between two of these arrows.
- If the arrows point in the same direction (a small angle), the texts are very similar, and the cosine similarity is close to 1.
- If the arrows are perpendicular, the texts are unrelated, and the similarity is 0.
- If they point in opposite directions, they are dissimilar, and the similarity is -1.

The calculation itself is quite simple.
When the vectors are normalized
(which I do, as the vectors are not always normalized depending on the output dimensionality you've chosen),
the cosine similarity is just their [dot product](https://en.wikipedia.org/wiki/Dot_product).

### Step 4: Putting It All Together in a Script

The Node.js script that orchestrates this whole process is available on GitHub: [summarize-and-embed.js](https://github.com/glaforge/glaforge.github.io/blob/main/summarize-and-embed.js).

Here's how it works:
1.  It finds all my blog posts.
2.  It loops through them, either loading the summary from the cache or generating a new one (with a one-second delay between API calls to avoid rate limiting).
3.  It generates embeddings for all summaries in batches.
4.  It then iterates through every article and calculates the cosine similarity with every other article.
5.  For each article, it sorts the others by their similarity score in descending order. I also filter out any articles with a similarity score below 0.75 to ensure the recommendations are high-quality.
6.  Finally, it takes the top 3 most similar articles and updates the frontmatter of the original Markdown file, adding a `similar` array with the paths to the related posts.

### Step 5: Displaying the Similar Articles in Hugo

With the `similar` array in my frontmatter, the final step was to display the links in my blog's theme.
I'm using the Hugo static site generator, and this was surprisingly easy.
I edited the partial template responsible for rendering a single post to include this snippet:

```html
{{ with .Params.similar }}
<div class="similar-articles">
    <h3>Similar articles</h3>
    <ul>
    {{ range . }}
        {{ with site.GetPage . }}
            <li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
        {{ end }}
    {{ end }}
    </ul>
</div>
{{ end }}
```

This code checks if the `similar` parameter exists. If it does, it loops through the paths.
For each path, it uses Hugo's `site.GetPage` function to fetch the full page object, from which I can get the `.Title` and `.RelPermalink`.
And with a little bit of CSS, it looks like a nice, integrated part of my blog.

## What Does It Look Like?

Let's have a look at a few examples (you'll see the recommended articles at the bottom of each post).

For my article on the [Gemini Computer Use model]({{<ref "posts/2025/11/03/driving-a-web-browser-with-gemini-computer-use-model-in-java/" >}}),
the vector similarity suggested 3 articles related to Gemini as well:
* [Get Started with Gemini in Java]({{<ref "posts/2023/12/13/get-started-with-gemini-in-java/" >}})
* [New Gemini model in LangChain4j]({{<ref "posts/2024/09/05/new-gemini-model-in-langchain4j/" >}})
* [Gemini Function Calling]({{<ref "posts/2023/12/22/gemini-function-calling/" >}})

On the article about [using the Nano Banana image model within an ADK agent]({{<ref "posts/2025/09/22/creative-ai-agents-with-adk-and-nano-banana/">}}),
the algorithm refered to those 3 articles on getting started with ADK, how to call Nano Banana from Java, or how to get started with Gemini:
* [Generating and editing images with Nano Banana in Java]({{<ref "posts/2025/09/09/calling-nano-banana-from-java/">}})
* [Write AI agents in Java — Agent Development Kit getting started guide]({{<ref "posts/2025/05/20/writing-java-ai-agents-with-adk-for-java-getting-started/">}})
* [Get Started with Gemini in Java]({{<ref "posts/2023/12/13/get-started-with-gemini-in-java/">}})

For some quite unique articles, sometimes it would return even just one or zero result at all,
but that's expected, because if there are no articles that are similar,
I don't want my readers to get suggestions about totally unrelated material.

## Considerations and Other Approaches

I'm happy with the _summarize --> embed approach_ as it is simple and gives me pretty good recommendations.
However, I considered some alternatives.

### Leveraging Tags

First of all, I'm using _tags_ on my blog.
So I considered leveraging them, as I strive for consistency in applying them to my articles.
For instance, I could have narrowed the search space to only articles sharing at least one common tag.
Alternatively, a heuristic could have been devised to influence the ranking, favoring articles with a higher number of shared tags.

### Averaging Vectors (Mean Pooling)

I went with the summarization route because of the limited input size of the embedding model.
But **summarization is a lossy process**, as you lose some precision along the way.
Through some experiments, I noticed that summarization could sometimes result in a similarity score that was 0.1 lower than a direct embedding of the full text.
I have a threshold of similarity of >0.75, so 0.1 can make a difference for article selection.

If you chunk your article into smaller passages (according to the maximum number of characters or tokens your embedding model can ingest), you'll end up with multiple chunks and their respective vector embeddings.
One approach is to calculate the average of these vectors, assuming this 'mean pooled' vector isn't too far from the embedding of the entire text.
I didn't extensively explore this, but my initial impressions suggested it sometimes performed worse than the summarization and embedding method.
This wasn't a scientific study, just my gut feeling, and the finer details of research papers on mean pooling escaped me at the time! Averaging vectors is often mentioned in articles as _mean pooling_.

### Passage to Passage Comparisons

A higher fidelity approach would have been to do a passage-to-passage comparison.
If you're familiar with **RAG** ([Retrieval Augmented Generation]({{<ref "tags/retrieval-augmented-generation/">}})), you know about the chunking phase we've just mentioned.
In RAG, you compare the query's vector with vectors of document passages.
This passage-to-passage comparison approach could also be applied to compare a full article with other full articles.
You could then devise a function to aggregate these passage-level similarities into an overall document score, favoring documents with more highly similar passages.
This could be a higher fidelity comparison, but I didn't explore this idea as the number of embedding requests and matrix comparisons is significantly higher (and thus more expensive and time consuming).

### A Mix! With Reciprocal Rank Fusion

Last but not least, you could even combine those approaches together: summarize/embed, tag set comparison, passage-to-passage chunking/embedding and comparison.
Each approach yields a ranking of similar articles, but their scores aren't necessarily on the same scale, as they're comparing different aspects of similarity.
In such situations, you can use methods like [Reciprocal Rank Fusion](https://medium.com/@devalshah1619/mathematical-intuition-behind-reciprocal-rank-fusion-rrf-explained-in-2-mins-002df0cc5e2a) (RRF)
to combine different rankings together.
RRF is often used in hybrid search scenarios, where you want to combine different searches together, like a classical keyword-based search, and a semantic search.

Ultimately, since the simple summarization-and-embed solution provided good results, I decided against further complicating the system.
Sometimes, being pragmatic and choosing a 'good enough' solution is more effective than pursuing the absolute best.
However, I wanted to share this thought process and highlight that various other solutions exist.

## Conclusion

And there you have it!
It might seem like a lot of steps, but the overall process is quite logical.
By leveraging the power of **summarization** and **embedding models**, I was able to build a powerful **related articles feature**.
For now, I'm still running the script manually, but later on, I'll see how I can integrate it in my GitHub Actions workflow.

It's a great example of how generative AI can be used to enhance existing applications in practical and useful ways.
I'm really happy with the results, and I hope my readers will find the new recommendations useful for discovering more content they're interested in.



