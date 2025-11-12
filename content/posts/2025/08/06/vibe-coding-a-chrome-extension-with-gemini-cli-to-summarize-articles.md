---
title: "Vibe-coding a Chrome extension with Gemini CLI to summarize articles"
date: 2025-08-06T13:29:54+02:00
image: /img/gemini/vibe-coded-chrome-extension.png
tags:
  - ai-agents
  - large-language-models

similar:
  - "posts/2025/02/15/the-power-of-large-context-windows-for-your-documentation-efforts.md"
  - "posts/2025/09/08/in-browser-semantic-search-with-embeddinggemma.md"
  - "posts/2025/11/03/driving-a-web-browser-with-Gemini-Computer-Use-model-in-Java.md"
---

I often find myself staring at a wall of text online.
It could be a lengthy technical article, a detailed news report, or a deep-dive blog post.
My first thought is often: _"Is this worth the time to read in full?"_
On top of that, for my podcast, [Les Cast Codeurs](https://lescastcodeurs.com/), I'm constantly gathering links and need to create quick shownotes, which is essentially... a summary.

My first attempt to solve this was a custom [Gemini Gems](https://gemini.google/overview/gems/) I created: a personalized chatbot that could summarize links.
It worked, but I often ran into a wall: it couldn't access paywalled content, pages that required a login, or dynamically generated sites that I was already viewing in my browser.
The solution was clear: I needed to bring the summarization _to_ the content, not the other way around.
The idea for a Chrome extension was born.

This got me thinking: what if I had a browser extension that could give me the gist of any page with a single click?
I had the idea and the need, but one small problem: I'd never built a Chrome extension before.

This project became an experiment in the trendy _"vibe-coding"_ approach, and my partner in crime was the
**[Gemini CLI](https://developers.google.com/gemini/cli?utm_campaign=CDR_0x7a40493f_default_b436838088&utm_medium=external&utm_source=blog)**.
I didn't start by reading pages of documentation.
Instead, I had a clear vision for what I wanted and decided to build it interactively.

What made the process so unique was that the Gemini CLI was incredibly proactive.
From the very beginning, when I just created an empty directory for the project, it immediately understood my intent.
Before I even had a chance to ask, it suggested that I probably wanted to create a Chrome extension for summarization and laid out a full plan, just by infering the intent because of the actual name of the directory I had created!

Throughout the development, it took liberties, suggesting better ways to handle the API key setup and proposing new features.
It felt less like giving instructions and more like a productive collaboration between a human and an AI.
The result is the [Gemini summarizer Chrome extension](https://github.com/glaforge/chrome-gemini-summarize-extension), and it was built entirely _on vibes_.

Of course, not everything is always roses and bloom, like when Gemini CLI reverted some of my manual changes (which lead me to warn it that I had actually made some manual changes, so that it could update its internal context), or when it somehow ran into a loop and not obeying my command, for some reason I couldn't really figure out.
Restarting it made it work: maybe like us, humans, it needs a break once in a while?
I'm probably _anthropomorphising_ too much, but overall, that was a productive experience!

## Under the hood: Powered by Gemini

The core of this extension is, of course, the Google Gemini API. It's responsible for the powerful summarization capabilities.
To use the extension, you'll need to provide your own [Gemini API key](https://aistudio.google.com/app/apikey).
Don't worry, it's stored securely and locally in your browser's storage and is only used to communicate with the official Google AI endpoints.

## Features that evolved from the _vibe_

What started as a simple idea quickly grew as we built it. Here's what the extension can do:

- **Summarize web pages**: Click the button to get a summary of the main article on a page.
- **Summarize selected text only**: If you highlight a specific piece of text, the extension is smart enough to summarize only your selection.
- **Real-time streaming**: The summary doesn't just appear; it streams in word-by-word, making the experience feel fast and responsive.
- **Go shorter**: Got a summary but want it even more concise? The _"Shrink"_ button re-summarizes the summary to be as brief as possible.
- **Speak my language**: A simple toggle lets you get your summary in either English or French _(I'm writing shownotes for the podcast in French)._
- **Copy with formatting**: The copy button copies the summary as rich text, preserving all the formatting like bolding and bullet points. That way, it's easy to paste in a Google Docs, in a Slack channel or wherever you want.

## Potential future evolutions

This project is fully functional (at least for my personal need) but there are always more _vibes_ to explore. Here are a few ideas for where this could go next:

1.  **Publish to the Chrome Web Store**: To make installation as easy as a single click for any user.
2.  **Expanded language support**: Add a dropdown or input field to allow summarization in any language Gemini supports.
3.  **Customizable prompts**: Allow users to tweak the summarization prompts directly in the options page to tailor the style of the summaries to their exact needs. And maybe even support multiple prompts at the same time, that you can choose from another dropdown.

## Get the code and vibe code your own variant

This entire project is open-source and available on GitHub. I encourage you to check it out, install it for yourself, and see how it feels.

> :arrow_right: **[View the project on GitHub](https://github.com/glaforge/chrome-gemini-summarize-extension)**

The [installation](https://github.com/glaforge/chrome-gemini-summarize-extension?tab=readme-ov-file#installation)
is straightforward for developers, with instructions in the `README.md` file — until I decide it's worth sharing it more broadly via the Chrome extension store!

More importantly, I encourage you to take this as inspiration.
If you have an idea, even if you don't know the technology, try vibe-coding it.
I now find myself starting projects I wouldn't have dared to before because I wasn't familiar with the language, framework, or patterns.
I'd think of a cool app idea but wouldn't even start, knowing it would take too many days or evenings just to get something basic going.
With vibe-coding, I can experiment and get a working prototype in a fraction of the time.

In the _pure_ vibe-coding approach as [coined by Andrej Karpathy](https://x.com/karpathy/status/1886192184808149383),
you wouldn't even look at the generated code at all.
But I'm a developer, I can't help it, and will always look at how my AI coding agent does its magic.

I didn't know how Chrome extensions were defined and worked, but now, I'm more knowledgeable because I had the chance to witness how to build such an extension, and see the project structure, the key files needed (`manifest.json`), the use of service workers, how to store a secret like an API key in Chrome's storage, etc. It's a **great learning opportunity where you actually look at the generated vibed-coded code**!

That's the real power of this new way of building software: a great model like
[Gemini](https://cloud.google.com/vertex-ai/generative-ai/docs/models?utm_campaign=CDR_0x7a40493f_default_b436838088&utm_medium=external&utm_source=blog) paired with a great tool like the
[Gemini CLI](https://developers.google.com/gemini/cli?utm_campaign=CDR_0x7a40493f_default_b436838088&utm_medium=external&utm_source=blog).
It's a game-changer.
Feel free to [fork this project](https://github.com/glaforge/chrome-gemini-summarize-extension), extend it, or build your own extension from scratch.
Happy vibe-coding!
