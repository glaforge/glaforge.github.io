---
title: "Creating kids stories with Generative AI"
date: 2023-06-08T12:12:42+02:00
tags:
- machine-learning
- large-language-models
- generative-ai
- micronaut
- groovy
- cloud-run
- google-cloud
- java

similar:
  - "posts/2023/05/30/getting-started-with-the-PaLM-API-in-the-java-ecosystem.md"
  - "posts/2025/01/27/an-ai-agent-to-generate-short-scifi-stories.md"
  - "posts/2025/01/31/a-genai-agent-with-a-real-workflow.md"
---

Last week, I wrote about how to [get started with the PaLM API in the Java ecosystem]({{< ref "/posts/2023/05/30/getting-started-with-the-PaLM-API-in-the-java-ecosystem" >}}),
and particularly, how to overcome the lack of Java client libraries (at least for now) for the PaLM API, and how to properly authenticate.
However, what I didn't explain was what I was building! Let's fix that today, by telling you a story, a kid story!
Yes, I was using the trendy **Generative AI** approach to generate bedtime stories for kids.

Without further ado, let me introduce you to my little app: [bedtime stories](https://bed-time-stories.web.app/).

[![](/img/bedtime/bedtime-stories-ui.png)](https://bed-time-stories.web.app/)

> [!INFO] Source Code
> If you're interested in the source code, head over to the Github [repository](https://github.com/glaforge/bedtimestories):
> it's implemented in [Apache Groovy](https://groovy-lang.org/), developed with the [Micronaut](https://micronaut.io/) framework,
> designed with the [Shoelace](https://shoelace.style/) web components, and deployed on Google [Cloud Run](https://cloud.run/), the serverless container runtime.

## The concept

For a good story, we need 3 key ingredients:
* a **character** — the main protagonist of the story whose adventures are narrated, like a princess, an astronaut, a firefighter...
* a **setting** — where (and potentially when) the action takes place, like a beautiful kingdom, a faraway planet, a mysterious haunted house...
* a **plot** — a rough idea of what's going to happen in the story, like an evil darkness is menacing the kingdom, huge shooting stars are menacing the planet...

In the UI, there are a few options to pick from, by default, but you can actually customise them at will, or better, come up with your own characters, settings, and plots.
You can play that game with your kids: *"hey, who should be the hero of our story tonight?"*. They may have an idea, or even a favorite character!

Then, just click the `Generate` button, and after 20s or so, you'll have a story ready!

## Where Generative AI comes in

Of course, the whole story is created thanks to Generative AI.
I used the [PaLM API](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview#palm-api) for that,
within my Google Cloud project, using the [Vertex AI](https://cloud.google.com/vertex-ai/) suite of machine learning services.

For the characters, settings, and plots, I came up with a few ideas on my own.
But I felt like the choice was limited and would warrant some more creativity.
So I asked [Bard](http://bard.google.com/) (powered by the PaLM API as well) to help me!
It's all about the *art of prompting*, of asking the right question to your favorite generative AI:

> [!INFO] Prompt
> Here are a few characters of bedtime kid stories:
> - a funny little princess with a strong character
> - a young astronaut exploring space
> - a fearless firefighter
> - a cute little cat with a long and silky fur
> - a gentle dragon with a colorful skin
>
> Suggest a list of other possible characters:

And lo and behold, I got a dozen suggestions that I then integrated in my character picker. Same thing for the settings and plots.
Interestingly, not only Bard (or PaLM) would give me suggestions, but it also gave me explanations on why those characters, settings and plots made sense.
So Generative AI is also here to help in the process of crafting your application, or your own prompts.

## The story generator prompt

The crux of this story is the main prompt that makes the requests to generate the actual story.
I wanted to have a familiar pattern or structure for my generated stories.
You've probably heard about such common structures for narration, in 3 or 5 acts.
I came across this [website](https://bubblecow.com/blog/importance-of-structure) about the 5-act approach,
with an exposition phase, the rising action, the climax, the falling action, and the final denouement.
So when crafting my prompt, first I started by telling PaLM who it was (a story teller), but then I also explained what a 5-act story act looks like,
and finally, I asked it to generate a story for my particular chosen trio of character, setting, and plot.
Here's my final prompt:

> [!INFO] Prompt
> You are a creative and passionate story teller for kids.
> Kids love hearing about the stories you invent.
>
> Your stories are split into 5 acts:
> - Act 1 : Sets up the story providing any contextual background the reader needs, but most importantly it contains the inciting moment. This incident sets the story in motion. An incident forces the protagonist to react. It requires resolution, producing narrative tension.
> - Act 2 : On a simplistic level this is the obstacles that are placed in the way of the protagonists as they attempt to resolve the inciting incident.
> - Act 3 : This is the turning point of the story. It is the point of the highest tension. In many modern narratives, this is the big battle or showdown.
> - Act 4 : The falling action is that part of the story in which the main part (the climax) has finished and you're heading to the conclusion. This is the calm after the tension of the climax.
> - Act 5 : This is the resolution of the story where conflicts are resolved and loose ends tied up. This is the moment of emotional release for the reader.
>
> Generate a kid story in 5 acts, where the protagonist is ${character}, where the action takes place ${setting} and ${plot}.

The fact of asking PaLM to structure the story that way also influences its textual output.
Not only did it create those 5 key parts, but it also added some bold act labels in its output, which I could filter to then split my string story into 5 smaller chunks.

## Where to go from there?

I hope you enjoyed the journey so far, and that you got a chance to generate your own story and tell it to a happy kid!

However, for now at least, this is just a concept, so I'm not sure whether I'll be developing it much further, but I'd like to share possible ways to improve this application.

* As I explained, it's a story in 5 acts, so we could offer the story over 5 distinct pages that you would have to turn.
Vertex AI also features an image generation service (still in preview for now), so the **stories could also be decorated with AI generated pictures**!
(We can even ask PaLM to generate ideas of prompts for image generation.)
* Currently, PaLM can generate up-to 1024 characters of output, but it has 8KB in input.
We can't generate a super long story, but since it's split in 5 acts, that can all fit in the input context window,
we could try to pass PaLM the whole generated story, and ask it 5 times to generate 1KB characters for each section, thus **lengthening the whole story by a factor of 5**.
* To go even further, we could use the multilingual capabilities of large language models,
or at least just the Translate API, to offer **translations of the app and the stories** into different languages.
* We could also imagine the app being able to narrate the story itself, by taking advantage of **Text-to-Speech voice generation**!
However you might miss on the great bonding opportunity with your kids when you tell them a story,
but on the other hand, kids could entertain themselves when you're busy by generating random stories on their own.
* Maybe we could also **save stories** that pleased our kids (and reshare them with others),
as each generation, even with the same trio of character/setting/plot, can yield very diverse outcomes.

So there are plenty options possible offered by Generative AI!

