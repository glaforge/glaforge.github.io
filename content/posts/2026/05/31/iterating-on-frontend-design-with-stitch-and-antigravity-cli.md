---
title: "Iterating on Frontend Design with Stitch and Antigravity CLI"
date: 2026-05-31T17:40:33+02:00
image: /img/gwc/stitch-agy.jpg
tags:
- google-stitch
- antigravity-cli
- agentic-development
- generative-ai
- ai-agents
- groovy

similar:
  - "posts/2017/08/07/cloud-shell-and-its-orion-based-text-editor-to-develop-in-the-cloud.md"
---

My friend Leonard and I were collaborating over the weekend on some new updates for the [Groovy Web Console](https://groovyconsole.dev/).
This console is an online playground where [Apache Groovy](http://groovy-lang.org/) users can run Groovy scripts online, 
with different versions of the language, from Groovy 3 up to the experimental Groovy 6.
Additionally, there's a specific integration with the [Spock testing framework](https://spockframework.org/), 
which allows users to run tests written with the framework.

Here's what the old console (well, the current one at the time of this writing) looks like:

![](/img/gwc/gwc-old.jpg)

This is actually the second version of the online Groovy Web Console.
This version uses the [Bulma](https://bulma.io/) CSS framework.
But I'm sure you'll agree I'm not a frontend designer, and indeed, I'm more of a backend designer than anything!

Leonard was focusing on an upcoming GitHub integration, so users can save and publish scripts via GitHub.
And while discussing this integration, I mentioned that it might be nice to overhaul the UI:

![](/img/gwc/slack-discussion.jpg)

Alright, let's take on that challenge.
But since I'm not a frontend developer, I'm going to use AI to help me reach a result I would have never reached without help.

I used [Stitch](https://stitch.withgoogle.com/) to iterate over a new design.
Google Stitch is an AI-powered UI/UX design tool developed by Google Labs.
It acts as an AI-native software design canvas, letting you generate high-fidelity, 
interactive user interfaces and frontend code from natural language prompts, sketches, or existing images.

I gave Stitch a screenshot of the original design of the Groovy Web Console.
But I wanted something that looks more like the interface of a code editor like Visual Studio Code.
And I made sure all the usual functionality of the Groovy Web Console would still be surfaced.
After several iterations, and a few tweaks here and there, I came up with something that looked like this:

![](/img/gwc/stitch-0-design.jpg)

Stitch generated some [DESIGN.md](https://designmd.ai/) design systems that are represented by the typography, color, button styles on the left.
And on the right, you can see the VSCode-like interface I wanted to achieve.

> [!NOTE] Remark
> `DESIGN.md` is Google's new [open format](https://designmd.ai/): a single markdown file your AI coding tool reads to build consistent UI. 

Once I was happy with the design of the UI, I exported the whole project as a zip file (but you can export to Figma, AI Studio, via MCP, and more):

![](/img/gwc/stitch-1-export.jpg)

I uncompressed the zip archive in my project, and that's when I launched [Antigravity CLI](https://antigravity.google/product/antigravity-cli) to help me integrate the design.
As the project description states: Antigravity CLI is _"The terminal-first surface to interact with Antigravity agents. Stay in your flow without context switching."_

I told Antigravity CLI that we were going to work on the Groovy Web Console, and that I wanted to integrate the design from Stitch as the new UI for the project.
I went through various steps to finetune the integration, to further tweak the design and behavior of the UI.
Antigravity also helped me with updating the Cypress tests, and merging with upstream Git branches.
It was a very helpful partner in crime, as if I was working with a productive and knowledgeable co-worker.

So far, the Groovy Web Console looks like this:

![](/img/gwc/gwc-light.jpg)

And with a dark theme, like this:

![](/img/gwc/gwc-dark.jpg)

It's not the final design, and there are still a few things to tweak or integrate, 
but we're almost there, and I'm happy with my productive session with both Stitch and Antigravity CLI!

![](/img/gwc/agy-1-welcome.jpg)

Working with Antigravity CLI was pretty straightforward.
Before working on the new design, I let it guide me through some DNS and OAuth problems, as we wanted to add the ability to sign up with GitHub accounts
in order to allow users to save their Groovy scripts as private or public Gists.
The callback was a Cloud Function, but it was an old v1 flavor instead of the new v2 flavor.
Antigravity was able to connect to my Google Cloud project, inspect the available resources, make the necessary configuration changes, and handle cloud function re-deployments.

![](/img/gwc/agy-2-gcf2.jpg)

I had to configure the DNS records of my domain name provider, and it checked the status of my records:

![](/img/gwc/agy-3-dns.jpg)

Antigravity is also a great companion to remind me how to run this damn project! :smiley:

![](/img/gwc/agy-3-companion.jpg)

Then we went on a ride to work on the redesign, starting from the exported zip archive of the new look that I had prepared in Google Stitch:

![](/img/gwc/agy-4-design.jpg)

And if you want to better understand the architecture of your project, Antigravity can generate a Mermaid diagram after having analyzed the resources in the Google Cloud project:

![](/img/gwc/project-architecture.svg)

## Summary

Using the combination of Google [Stitch](https://stitch.withgoogle.com/) and 
[Antigravity CLI](https://antigravity.google/product/antigravity-cli) proved to be a productive workflow. 
As someone who is definitely not a frontend engineer, this duo was exactly what I needed. 
Stitch allowed me to easily design and iterate on a beautiful, modern UI from just an initial screenshot and prompt, 
while Antigravity CLI helped me integrate that design and tie all the complex pieces (from tests to cloud infrastructure) together nicely.

If you want to learn more about Antigravity CLI in particular, don't hesitate to read my colleagues' articles:
* Romin's [Antigravity CLI tutorial series](https://medium.com/google-cloud/antigravity-cli-tutorial-series-12b46cfe3bf2) for all the details about the CLI,
* and Daniela's [The Hitchhiker’s Guide to Antigravity 2.0](https://medium.com/google-cloud/the-hitchhikers-guide-to-antigravity-2-0-af17eb4845c0) for a general understanding of all the Antigravity components.