---
title: "Tech Watch #3 — October, 20, 2023"
date: 2023-10-20T17:32:51+02:00
image: /img/techwatch/tw003.png
tags:
  - tech-watch
  - generative-ai
  - large-language-models
  - java
  - unicode
  - webassembly
  - graphics
---

- [Stop Using char in Java. And Code Points](https://horstmann.com/unblog/2023-10-03/index.html)\
  It's a can of worms, when you start messing with chars, code points, and you're likely going to get it wrong in the end. As much as possible, stay away from chars and code points, and instead, use as much as possible the String methods like `indexOf()` / `substring()`, and some regex when you really need to find grapheme clusters.

- Paul King shared his presentations on [Why use Groovy in 2023](https://speakerdeck.com/paulk/groovy-today) and an
  [update on the Groovy 5 roadmap](https://speakerdeck.com/paulk/groovy-roadmap)It's interesting to see how and where Groovy goes beyond what is offered by Java, sometimes thanks to its dynamic nature, sometimes because of its compile-time transformation capabilities. When Groovy adopts the latest Java features, there's always a twist to make things even groovier in Groovy!

- [The State of WebAssembly in 2023](https://blog.scottlogic.com/2023/10/18/the-state-of-webassembly-2023.html)\
  I often enjoy the articles from the folks at Scott Logic. This one is about a survey they ran on the topic of WebAssembly. Languages like Rust and JavaScript are seeing increased usage (for targeting wasm). Wasm is used a lot for web app development, but serverless seems to be he second most common use case, as well as for hosting plugin environments. The survey also mentions that threads, garbage collection and the new component model are the features developer are most interested in. For WASI, all the I/O related proposals like HTTP, filesystem support, sockets, are the ones developers want (although WASIX which covered this area received mixed reactions).

- [Tell your LLM to take a deep breath!](https://arstechnica.com/information-technology/2023/09/telling-ai-model-to-take-a-deep-breath-causes-math-scores-to-soar-in-study/)\
  We tend to humanize large language models via [anthropomorphism](https://en.wikipedia.org/wiki/Anthropomorphism), as much as we see human faces in anything like with [pareildolia](https://en.wikipedia.org/wiki/Pareidolia), although LLMs are neither sentients nor human. So it's pretty ironic that to get a better result in some logic problem solving, we need to tell the LLM to actually take a deep breath! Are they now able to breathe?

- [Wannabe security researcher asks Bard for vulnerabilities in cURL](https://hackerone.com/reports/2199174)\
  Large Language Models can be super creative, that's why we employ them to imagine new stories, create narratives, etc. And it seems wannabe security experts believe that what LLMs say is pure facts, probably what happened to this person that reported that they asked Bard to find a vulnerability in cURL! And Bard indeed managed to be creative enough to craft an hypothetical exploit, even explaining where a possible integer overflow could take place. Unfortunately, the generated exploit text contained many errors (wrong method signature, invented changelog, code that doesn't compile, etc.)

- [LLMs confabulate, they don't hallucinate](https://www.beren.io/2023-03-19-LLMs-confabulate-not-hallucinate/)\
  A few times, I've seen this mention on social networks about the fact we should say that LLM confabulate, instead of hallucinate. Confabulation is usually a brain disorder that makes people confidently tell things that may be true or not, in a convincing fashion (they don't even know it's false or a lie). Hallucination is more of a misinterpretation of the sensory input, like having the impression to see a pink elephant! The article linked above explains the rationale.

- Greg Kamradt tweets about the [use cases for multimodal vision+text LLMs](https://twitter.com/GregKamradt/status/1711772496159252981)\
  You'd think that you could just get a model that describes a picture as a text, and then mix that description with other text snippets. But models that really fully understand both images and texts are way more powerful than this. In this tweet, Greg distinguishes different scenarios: description, interpretation, recommendation, convertion, extraction, assistance and evaluatation. For example, we could imagine transforming an architecture diagram into a proper Terraform YAML file, or a UI mockup into a snippet of code that builds that UI for real. You You could show a picture of a dish, and ask for its recipe!

- [The Story of AI Graphics at JetBrains](https://blog.jetbrains.com/blog/2023/10/16/ai-graphics-at-jetbrains-story/)\
  I've always loved generative and procedural art, both for games and indeed for art. I really enjoyed this article which is going through the story of how they are generating their nice splash screens and animations for the JetBrains family of products. Neural networks at play here!
