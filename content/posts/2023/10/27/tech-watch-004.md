---
title: "Tech Watch #4 — October, 27, 2023"
date: 2023-10-27T14:06:59+02:00
image: /img/techwatch/tw003.png
tags:
  - tech-watch
  - generative-ai
  - large-language-models
  - databases
  - tools
---

- The [State of AI report](https://www.stateof.ai/) is pretty interesting to read (even if long!). Among the major sections: research, industry, but also politics, safety, and some predictions. You'll find an executive summary in one slide, on slide #8. On #22, emergent capabilities of LLMs is covered and mentions Stanford's research that talks about the importance of more linear and continuous measures as otherwise capabilities sound like they emerge out of the blue. On #23, they talk about the context length of LLMs being the new parameter count, as models try to have bigger context windows. However, on slide #24, they also talk about researchers who showed that in long context windows, often, the content provided in the middle is more ignored by LLMs compared to content at the beginning or end of the window. So be sure to put the important bits first or last, but not lost in the middle. Slide #26 speaks about smaller models trained with smaller curated datasets and can rival 50x bigger models. Slide #28 wonders if we're running out of human-generated data, and thus, if we're going to have our LLMs trained on... LLM generated data!

- [3D visualisation of vector embeddings from Tensorflow](https://projector.tensorflow.org/)As I'm working on a small application that would help visuliase vector embeddings, I was looking for existing apps or articles that show how vectors can be similar, and thus their semantic to be similar as well. And I came across this existing visualisation from the Tensorflow project, which uses the Word2Vec embedding approach. I like the fact you can use different 3D projections techniques like t-SNE or PCA, and you see related vectors closer in the 3D space, as their meaning is closer too.

- [A cron extension for PostgreSQL](https://www.citusdata.com/blog/2023/10/26/making-postgres-tick-new-features-in-pg-cron/)pg_cron is an extension for the PostgreSQL database that adds scheduling capabilities. It can even be scheduled to run your procedures or other SQL queries every few seconds.

- [Protomaps](https://protomaps.com/) is a free and open source map of the world, deployable as a single static file on cloud storage (including Google Cloud Storage). You can use OpenStreetMap tiles, as it's distributed with a version of OSM. It's using an efficient and open archive format for pyramids of tile data, accessible via HTTP Range requests.

- [ArtistAssistApp](https://artistassistapp.com/) is an application which can tell you which oil or water color paints to use and mix to create similar looking colors for your painting, as you try to reproduce a photo. As a wannabe painter myself, I always struggle creating mixes that match real colors, and this tool is pretty clever to let you find the right mix (at least if you use some well-known paint brands). This also reminds me of [mixbox](https://scrtwpns.com/mixbox/) which simulates color mixing as real color pigments mix in real paint, and using such algorithm would greatly improve the real-life accuracy of color mixes in digital art painting applications.

- [Vectorizer](https://vectorizer.ai/) is an online tool to transform an image into an SVG file. As I'm playing a bit with Generative AI-based image generation, sometimes, the upscalers don't suffice, and you want to transform a nice generated image into a vectorial format (for example clipart-like illustrations), so they scale gracefully in slide decks or on websites.
