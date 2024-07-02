---
title: "The power of embeddings: How numbers unlock the meaning of data"
date: 2024-07-02T09:05:07+02:00
image: /img/gemini/author-ai-robot.jpg
tags:
  - generative-ai
  - machine-learning
---

## Prelude

> As I'm focusing a lot on Generative AI, I'm curious about how things work under the hood, to better understand what I'm using in my gen-ai powered projects.
> A topic I'd like to focus on more is: **vector embeddings**, to explain more clearly what they are, how they are calculated, and what you can do with them.
>
> A colleague of mine, [André](https://x.com/andreban), was showing me a [cool experiment](https://writer-m4n3dyfjhq-uc.a.run.app/)
> he's been working on, to help people prepare an interview, with the help of an AI, to shape the structure of the resulting final article to write.
>
> The idea is to provide: a topic, a target audience, and to describe the goals for the audience.
> Then, a large language model like [Gemini](https://deepmind.google/technologies/gemini/) prepares a list of questions (that you can update freely) on that topic.
> Next, it's your turn to fill in the blanks, answer those questions, and then the LLM generates an article,
> with a plan following those key questions and your provided answers.
> I cheated a bit, and asked [Gemini](https://gemini.google.com/) itself those questions, and honestly, I really liked how the resulting article came to be,
> and I wanted to share with you the outcome below.
>
> It's a great and simple introduction to vector embeddings!
> I like how AI can help organize information, shape the structure and the content for an article.
> **I'm not advocating for letting AI write all your articles**, far from that, but as an author,
> however, I like that it can help me avoid the blank page syndrome, avoid missing key elements in my dissertation, improve the quality of my written prose.
>
> Generative AI, in its creative aspect, and as your assistant, can be super useful! Use it as **a tool to help drive your creativity**!
> But **always use your critical sense to gauge the quality and factuality of the content**.

## Introduction: What are vector embeddings?

Imagine you have a vast library filled with books on every topic imaginable. Finding a specific book can be a daunting task, especially if you only know the general subject matter. Now imagine a magical system that can understand the meaning of each book and represent it as a unique code. This code, called a vector embedding, can then be used to quickly find the most relevant books based on your search query, even if you only have a vague idea of what you're looking for.

This is the power of vector embeddings. They are essentially numerical representations of complex data, like text, images, or audio, that capture the underlying meaning and relationships within the data. These numerical codes, arranged as vectors, allow computers to process and compare data in a way that mimics human understanding.

## From Text to Numbers: The Journey of Embedding Creation

Creating vector embeddings involves a multi-step process that transforms raw data into meaningful mathematical representations. The journey begins with **data preprocessing**, where the data is cleaned, normalized, and prepared for embedding generation. This might involve tasks like removing irrelevant information, standardizing data formats, and breaking text into individual words or subwords (tokenization).

Next comes the heart of the process: **embedding generation**. This step leverages various techniques and algorithms, such as Word2Vec, GloVe, BERT, and ResNet, to convert each data point into a high-dimensional vector. The specific algorithm chosen depends on the type of data being embedded (text, images, or audio) and the intended application.

For instance, Word2Vec uses a neural network to learn relationships between words by analyzing how they co-occur in large text corpora. This results in vector representations for words, where similar words have similar vectors, capturing semantic relationships. Similarly, for images, convolutional neural networks (CNNs) like ResNet can be used to extract features from images, resulting in vectors that represent the visual content.

## Vector Databases: The Power of Storing and Searching Embeddings

Once embeddings are generated, they need a dedicated storage system for efficient retrieval and comparison. This is where **vector databases** come into play. Unlike traditional databases designed for structured data, vector databases are optimized for storing and searching high-dimensional vector data.

Vector databases employ specialized indexing techniques, such as Annoy, HNSW, and Faiss, to create efficient data structures that allow for fast similarity search. This means that when a user submits a query (e.g., a search term, an image), the database can quickly find the most similar data points based on the similarity of their vector representations.

## Embeddings Empower Search: Finding the Needle in the Haystack

The combination of vector embeddings and vector databases revolutionizes search by enabling **semantic search**. This means that instead of relying solely on keyword matching, search engines can understand the meaning behind the data and find relevant results even if the query doesn't use exact keywords.

For example, imagine searching for "a picture of a dog with a hat." Traditional keyword-based search might struggle to find relevant images, as the search term might not match the image description. However, with vector embeddings, the search engine can understand the semantic meaning of the query and find images that contain both a dog and a hat, even if those words are not explicitly mentioned in the image description.

## Beyond Search: Expanding the Reach of Embeddings

Vector embeddings are not limited to search applications. They have become essential tools in a wide range of fields, including:

- **Retrieval Augmented Generation (RAG):** This technique combines the power of information retrieval and generative models to create more informative and relevant responses. Embeddings are used to find relevant information in large text corpora, which is then used to augment prompts for language models, resulting in more accurate and context-aware outputs.
- **Data Classification:** Embeddings enable the classification of data points into different categories based on their similarity. This finds application in areas like sentiment analysis, spam detection, object recognition, and music genre classification.
- **Anomaly Detection:** By representing data points as vectors, anomalies can be identified as data points that are significantly different from the majority. This technique is used in various fields, including network intrusion detection, fraud detection, and industrial sensor monitoring.

## Facing the Challenges and Shaping the Future

While vector embeddings have revolutionized data analysis, they still face some challenges. These include the difficulty of capturing polysemy (multiple meanings of a word), contextual dependence, and the challenge of interpreting the meaning behind the high-dimensional vector representations.

Despite these limitations, research continues to push the boundaries of vector embeddings. Researchers are exploring techniques like contextual embeddings, multilingual embeddings, knowledge graph integration, and explainable embeddings to overcome existing limitations and unlock the full potential of these powerful representations.

## Stepping into the World of Embeddings: Resources and Next Steps

For those interested in diving deeper into the world of vector embeddings, a wealth of resources is available. Online courses and tutorials on platforms like Coursera, Fast.ai, and Stanford's online learning platform provide a solid foundation in the underlying concepts and techniques.

Books like "Speech and Language Processing" by Jurafsky and Martin and "Deep Learning" by Goodfellow, Bengio, and Courville offer in-depth coverage of the field. Additionally, research papers and articles on platforms like arXiv and Medium offer insights into the latest advancements and applications.

To gain practical experience, explore Python libraries like Gensim, spaCy, and TensorFlow/PyTorch. These libraries provide tools for creating and working with embeddings, allowing you to build your own models and experiment with various applications.

The world of vector embeddings is constantly evolving, offering exciting opportunities for innovation and discovery. By understanding the power of these representations, you can unlock new possibilities for data analysis, information retrieval, and artificial intelligence applications.
