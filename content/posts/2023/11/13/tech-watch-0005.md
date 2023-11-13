---
title: "Tech Watch #5 — November, 15, 2023"
date: 2023-11-13T12:33:50+01:00
image: /img/techwatch/tw005.png
tags:
  - tech-watch
  - generative-ai
  - large-language-models
  - java
  - crdt
  - webassembly
  - macos
---

- Some friends shared this article from Uwe Friedrichsen, tilted [back to the future](https://www.ufried.com/blog/back_to_the_future/), that talks about this feeling of "déjà-vu", this impression that in IT we keep on reinventing the wheel. With references to mainframes, Uwe compared CICS to Lambda function scheduling, JCL to step functions, mainframe software development environments to the trendy platform engineering. There are two things I like about this article. First of all, it rings a bell with me, as we've seen the pendulum swing as we keep reinventing some patterns or rediscovering certain best practices, sometimes favoring an approach one day, and coming back to another approach the next day. But secondly, Uwe referenced Gunter Dueck who talked about spirals rather than a pendulum. I've had that same analogy in mind for years: rather than swinging on one side to the next and back, I always had this impression that we're circling and spiraling, but each time, even when passing on the same side, we've learned something along the way, and we're getting closer to an optimum, with a slightly different view angle, and hopefully with a better view and more modern practices. Last week at FooConf #2 in Helsinki, I was just talking with my friend [Venkat Subramaniam](https://agiledeveloper.com/aboutus.html) about this spiral visualisation, and I'm glad to see I'm not the only one thinking that IT is spiraling rather than swinging like a pendulum.

- [Automerge-repo, a batteries included toolkit for building local-first applications](https://automerge.org/blog/2023/11/06/automerge-repo/)\
  [Automerge](https://automerge.org/) is one of the most well-known CRDT algorithm (Conflict-Free Replicated Data Type) that allows you to implement collaborative applications (think Google Docs kind of collaboration, for example). With CRDT algorithms and data structures, concurrent changes on different devices can be merged automatically without requiring a central server, and without complex merge processes. However, having an algorithm and data structure is one thing, but to put the whole system in place is not necessarily easy. This new automerge-repo projects tries to solve this problem, by offering networking and storage adapters to facilitate the communication between the peers, or with a potential sync server.

- The WebAssembly Garbage Collection proposal (WasmGC) lands in the latest Chrome version. The [V8 team dives into the details about WasmGC](https://v8.dev/blog/wasm-gc-porting). It'll be particularly useful to better support garbage collected languages (like Java and friends) without having to ship a garbage collector in each wasm package.

- Although I'm not developing native apps for Macs, I spotted this article about an [open source implementation of Apple code signing and notarization](https://gregoryszorc.com/blog/2022/08/08/achieving-a-completely-open-source-implementation-of-apple-code-signing-and-notarization/), implemented in Rust, and that can run on non-Mac hardware. With this approach, when you're building native apps for the Mac, you can integrate that approach in your Linux-based CI/CD pipeline, without having a Mac box somewhere.

- [Document summarization is an area where large language models excel](https://medium.com/google-cloud/langchain-chain-types-large-document-summarization-using-langchain-and-google-cloud-vertex-ai-1650801899f6). There are different approaches to do so when your context window can't fit the whole document to summarize. In this article, different approaches are mentioned: stuffing (when it fits in the context window), Map/Reduce to split the content in sections that can be summarised and a summary of summary can be made, and the more sequential Refine method where we summarize what fits in memory, and then ask to refine that first summary with the details of the following sections, till we run out of content.

- Large Language Models face two big issues: one is hallucinations and how to mitigate them by grounding answers or finding ways to assess the response's factuality, and the other one is prompt injection, as a malignant attacker can misguide an LLM to do something else than what it was programmed for. The folks at Scott Logic developed a demo based on the idea of ImmersiveLabs' [online playground](https://prompting.ai.immersivelabs.com/) to experiment with prompt injection and techniques to circumvent them. There's also an [article](https://blog.scottlogic.com/2023/11/03/spy-logic.html) that talks about the project, and a [video](https://blog.scottlogic.com/2023/10/31/mitigating-prompt-injections.md.html) that shows it all in action.

- My good friend Ken Kousen dives into [the magic of AI Services with LangChain4J](https://kousenit.org/2023/11/06/the-magic-of-ai-services-with-langchain4j/). He has a nice blog post, and also a great accompanying [video](https://www.youtube.com/watch?v=Bx2OpE1nj34) on YouTube where he shows some of the powerful features of LangChain4J, in particular the AI service that allows you to decorate an interface with annotations to interact with your large language model and get plain Java types or objects in return.

- My colleague Romin Irani also [integrated LangChain4J and the PaLM 2 chat model](https://medium.com/google-cloud/integrating-langchain4j-and-palm-2-chat-bison-model-a684cefd67af), showing how to deploy a Google Cloud Function chatbot.

- Baeldung also gives in [introduction to LangChain4J](https://www.baeldung.com/java-langchain-basics) showing the basics of prompts, models, memory management, retrieval, chains, and agents.

- [LangChain4J using Redis](https://www.linkedin.com/pulse/langchain4j-using-redis-stephan-janssen-lobpe/): Stephan Janssen, the founder of Devoxx, is using [LangChain4J](https://github.com/langchain4j) inside the Devoxx CFP and schedule application. In this article on LinkedIn, he explains how he used Redis to store vector embeddings corresponding to the talks of the conference, to search for similar talks.
