---
title: "Beyond the chatbot or AI sparkle: a seamless AI integration"
date: 2025-05-23T14:27:27+02:00
tags:
  - generative-ai
  - machine-learning
  - large-language-models
image: /img/gemini/ai-sparkle-chat.png
---

When I talk about [Generative AI](http://localhost:1313/tags/generative-ai), whether it's with developers at conferences or with customers, I often find myself saying the same thing: **chatbots are just one way to use Large Language Models** (LLMs).

Unfortunately, I see many articles or presentations that just focus on demonstrating LLMs at work within the context of chatbots. I feel guilty of showing the traditional chat interfaces too. But there's so much more to it!

For example, when I [analyzed Bluesky topic trends](https://glaforge.dev/posts/2025/01/06/analyzing-trends-and-topics-from-blueskys-firehose-with-generative-ai/), there was no chatbot involved, but [Gemini](https://cloud.google.com/vertex-ai/generative-ai/docs/start/quickstarts/quickstart-multimodal?utm_campaign=CDR_0x7a40493f_default_b419777287&utm_medium=external&utm_source=blog) and [embedding models](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings?utm_campaign=CDR_0x7a40493f_default_b419777287&utm_medium=external&utm_source=blog) helped me make sense of clusters of posts. Or when I played with [generating short science fiction stories](https://glaforge.dev/posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories/), there was again no chat interface, but the LLM and the [Imagen](https://cloud.google.com/vertex-ai/generative-ai/docs/models/imagen/3-0-generate-002?utm_campaign=CDR_0x7a40493f_default_b419777287&utm_medium=external&utm_source=blog) image generation models were used for their creative facet.

LLMs are also very powerful to replicate more classical Natural Language Processing tasks (NLP) like sentiment analysis, entity extraction, etc. But sometimes dedicated predictive models are more (cost) effective at those tasks. However, **LLMs allow developers to implement those NLP use cases easily** by properly prompting their favorite model. And developers may then be able to add nice and seamless features here and there in their applications.

## The trigger

What led me to share my views on these usage patterns of AI? It’s when I read Kojo Osei’s article titled “[there should be no AI button](https://kojo.blog/ai-button/)”. Indeed, we’re seeing a **proliferation of AI “_sparkle”_ buttons** in various applications and websites. This feels like a quick hack, an extra patch, to say that the application is smart, but it also adds unnecessary cognitive load and breaks the user's focus. **It takes more than an AI sparkle button to make an application intuitive and seamlessly smart**!

The author argues that dedicated "AI buttons" in user interfaces are a flawed and temporary design choice. The author says, and I agree, that **the best AI user experience is seamless and integrated**, and that AI buttons create unnecessary limitations and frustrations. The article calls for more contextual alternatives that don't artificially segregate AI functionalities, and avoid breaking the flow of the user.

## My take

In my opinion, the best way to use AI is to build it right into your applications, making them smarter and more helpful **in a way that feels completely natural to the user**. It's not about hiding the fact that AI is involved – on the contrary, I believe users should know. But, as people go about their daily tasks in an app or on a website, AI should be there to assist them smoothly, **without them needing to click a special "AI button"** to make something happen, or **having to open a chat window to ask for help**.

I see chat interfaces as one specific use case for LLMs, and that's fine. But they aren't the only option, and I don't think they're always the most intuitive or the least disruptive. **People need to stay in their flow**, focused on what they're doing. Their **work should be augmented by AI**, not broken up by extra clicks or messages.

Think about it: if someone is deep in concentration, writing or designing, the last thing they need is to stop, look for a button, and then start a conversation with an AI to get a suggestion. That kind of interruption significantly increases their cognitive load, breaks their focus and makes the whole process feel clunky.

## Examples of more seamless and intuitive flows

Personally, I like when a smart application is proactive but doesn’t get in the way of my normal flow. To illustrate this, let’s think about some common patterns I’ve seen that I found successful at this:

- In Gmail and Chat, the UI shows me a [summary of the ongoing conversation](https://support.google.com/chat/answer/12918975?hl=en&co=GENIE.Platform%3DDesktop) that I missed. I can still go through the unread messages, but I can also be up-to-speed rapidly by reading the summary, and then quickly glancing through the messages to get more details.

- Another summarization example is when I use [Obsidian](https://obsidian.md/) to take notes of articles I find interesting and want to remember. I installed a Chrome add-on, the [Obsidian web clipper and its “interpreter”](https://help.obsidian.md/web-clipper/interpreter), that I configured to use Gemini, to create a bullet point summary of the articles, and create relevant tags that help me navigate through similar content I’ve already in my notes.

- For coding, we (developers) are now used to the seamless LLM-powered code completion. I like how it waits a little before suggesting anything. And often, when I use [Gemini Code Assist](https://codeassist.google/), I have the impression that the LLM read my mind and knew exactly about the code I wanted to write. And if it’s not what I wanted, I’m not really disrupted or distracted, as I can continue typing if the suggestion doesn’t make sense.

- To stay in the realm of developer workflows, your AI peer is at work as the first responder to the tickets users create, then you can hop in the conversation as the user details their issues. Similarly, for PRs (Pull Requests), your AI coding bot can analyze the code you submitted and make first recommendations to improve it, like the [Gemini Code Assist bot does on Github](https://github.com/marketplace/gemini-code-assist).

- Before creating a ticket, the bug tracker could also take advantage of LLM-powered or embedding-based semantic search to find similar issues, to avoid creating duplicates, or guide the reporter to pick up the right component or category, depending on what the issue is all about.

- Large Language Models are great at creating first drafts of documents. Give it the right outline, directions, ideas, and you’ll get a first sketch that you can refine — even a few sentences in this very article that you read were first drafted with Gemini!

- You can also imagine this draft generation in contexts like CRM apps, where users can create a first draft of something they want to send their customers, depending on the current situation of that customer. Or like in the linked article, with this image creation app, where the user draws a few broad strokes of colors to guide the image generation to follow along.

- But of course if you’re already working in a chat environment (like Slack or similar messaging platforms), it still makes sense to be able to chat with an AI-powered bot! I don’t want to get rid of chat spaces altogether. But an AI assistant should be that: an assistant, a peer, a colleague you can involve where needed, or who can nudge you to tell you _“hey, you forgot to add a test”_, or _“here are the relevant PRDs or bug entries about this new feature you’re talking about”_, or _“here’s a summary of the relevant past conversations on that topic”_.

These are some examples of non-intrusive and seamless integrations, but **UX designers need to rethink the app** or website, and be acquainted with what LLMs can offer. **Making an application smart isn’t just adding an AI sparkle button or a chatbot interface**.

## Conclusion

While chatbots are great for things like customer support or answering direct questions, they're not always the best fit for every situation. For many tasks, I believe AI assistance should be **more like a quiet, helpful partner** — there when you need it, maybe even anticipating what you need, without you having to constantly ask.

What I really believe we should aim for is AI that boosts what people are already doing, making their work easier and more powerful without adding extra steps. We should be **creating experiences where AI enhances the tools people use every day**, making them more efficient and insightful, **without forcing them to constantly switch contexts** or explicitly request AI intervention for every little thing via a sparkle button or a chat message.

Ultimately, I think the AI integrations that will truly succeed are the ones that don't feel like an add-on. Instead, they'll feel like a natural, intelligent part of the system. My ideal is to see us build AI experiences that genuinely empower people by **working seamlessly in the background**, helping them **stay focused** and achieve more, more rapidly.
