---
title: "Tech Watch #2 — Oct 06, 2023"
date: 2023-10-06T16:34:35+02:00
tags:
  - tech-watch
  - generative-ai
  - large-language-models
  - json
  - databases
  - containers
  - unicode
---

-   [Generative AI exists because of the transformer\
    ](https://ig.ft.com/generative-ai/)I confess I rarely read the Financial Times, but they have a really neat articles with animations on how large language models work, thanks to the transformer neural network architecture, an architecture invented by Google in 2017. They talk about text vector embeddings, how the self-attention makes LLM understand the relationship between words and the surrounding context, and also doesn't forget to mention hallucinations, how "grounding" and RLHF (Reinforcement Learning with Human Feedback) can help mitigate them to some extent.

-   [Generative AI in practice: Concrete LLM use cases in Java, with the PaLM API](https://www.youtube.com/watch?v=ioTPfL9cd9k&t=7s) (video)\
    At Devoxx Belgium this week, the biggest theme of the conference was Generative AI and Large Language Models. The audience being mainly Java-focused, there was a very strong interest for Java developers to be able to take advantage of GenAI / LLMs in Java, instead of the ubiquitous Python. And all sessions along those lines were fully packed. The conference featured Microsoft's Java SemanticKernel, the open source LangChain4J project, or Spring's AI experimental module. The link above is the video of my presentation I did on using PaLM API but for the Java developer, using different approaches, and also with [LangChain4J](https://github.com/langchain4j/langchain4j).

-   [What "AI-Assistant for a Developer" is all about?](https://medium.com/google-cloud/what-ai-assistant-for-a-developer-is-all-about-723de644a449) and [An AI-assisted cloud? It's a thing now, and here are six ways it's already made my cloud experience better](https://seroter.com/2023/09/28/an-ai-assisted-cloud-its-a-thing-now-and-here-are-six-ways-its-already-made-my-cloud-experience-better/) are two articles from my colleagues Romin and Richard about how AI assistants will progressively make us, developers, more productive and stay in the flow.

-   [Heredoc notation in Dockerfiles\
    ](https://www.docker.com/blog/introduction-to-heredocs-in-dockerfiles/)Did you know you can use the "heredoc" notation in Dockerfiles, like <<EOF some script commands EOF, to run multiple commands like in a Bash file? It's just like writing RUN commands separated with &&, but in a nice script, and without creating extra layers. I think I'll start using this in my next Dockerfiles!

-   [The Absolute Minimum Every Software Developer Must Know About Unicode in 2023\
    ](https://tonsky.me/blog/unicode/)UTF-8 is pretty much ubiquitous nowadays, so we don't need to think about which encoding is used, but rather think about how to use UTF-8 properly. Unicode assigns a character (actually a code point) a number. Unicode is big, with more than 1 million code points. UTF-8 is an encoding: a way to store code points in memory, but the article mentions the other UTF encodings as well. But unicode is tricky as a characters with a diacritical mark, an emoji, etc, can be graphemes: the combination of several code points. And there are lots of tricky corner cases that stem from that (like the length of a string isn't trivial to calculate). A particular character (like a vowel with an accent) can be look alike another, but their composition of code points might differ, hence why there are different compositions and decompositions. So it's important to normalize strings when doing comparisons.

-   [Jq released version 1.7\
    ](https://github.com/jqlang/jq/releases)There's a new release of jq, the super handy command-line tool to explore and massage your JSON payloads! The new version uses decimal number literals to preserve precision. A new pick(stream) method to do projections (to filter just the stuff you're interested in), a debug() method to log some messages through stderr, and and abs() function, and plenty other little refinements and bug fixes.

-   [Goodbye integers. Hello UUIDv7!\
    ](https://buildkite.com/blog/goodbye-integers-hello-uuids)BuildKite's article delves into their choice of UUIDv7 for primary keys. The initially started with a combination of sequential primary keys for efficient indexing, but with a UUID as a secondary key for external use. But the characteristics of the 7th version of the UUID specification leads them to just use UUIDv7 instead. UUID eliminate the issue of coordination in distributed systems. Their random aspect makes them less guessable. But the drawback can be poor database index locality.

