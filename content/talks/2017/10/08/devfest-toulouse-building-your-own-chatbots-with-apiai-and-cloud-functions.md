---
title: "DevFest Toulouse — Building your own chatbots with API.ai and Cloud Functions"
date: 2017-10-08T16:56:13+01:00
type: "talk"
layout: "talk"
tags:
- chatbot
- dialogflow
- actions-on-google
- google-cloud
- cloud-functions
---

A few weeks ago, my buddy [Wassim](https://twitter.com/manekinekko) and I had the chance to present again on the topic of chatbots, with API.AI and Cloud Functions, at the [DevFest Toulouse](https://devfesttoulouse.fr/) conference.

Here's the latest update to our slide deck:

{{< speakerdeck 1b47c1e6bb7c4f81b5e0237cbfbda1ca >}}

Chatbots, per se, are not really new, in the sense that we've been developing bots for things like IRC for a long time, but back in the day, it was simply some regular expression labor of love, rather than the natural language that we use today. The progress in machine learning, in both speech recognition (for when you use devices like Google Home) and natural language understanding (NLU), is what led us to being able to speak and chat naturally to those chatbots we encounter now.

In this presentation, we're covering the key concepts that underpin the NLU aspects:

-   **Intents** --- the various kind of sentences or actions that are recognized (ex: "I-want-to-eat-something")
-   **Entities** --- the concepts and values that we manipulate or that are parameterizing intents (ex: the kind of food associated with the "I-want-to-eat-something" intent)
-   **Context** --- a conversation is not just a request-reply exchange, but the discussion between you and the chatbot can span longer back'n forth exchanges, and the chatbot needs to remember what was previously said to be useful and avoid any frustration for the user

We're also clarifying some of the terminology used when working with the Google Assistant and its Actions on Google developer platform:

-   **Google Assistant** --- a conversation between you and Google to help GTD
-   **Google Home** --- voice activated speaker powered by the Google Assistant
-   **Google Assistant SDK** --- kit to embed the Google Assistant in your devices
-   **Agent / chatbot / action** --- an actual app serving a particular purpose
-   **Actions on Google** --- developer platform to build apps for the Assistant
-   **Apps for the Google Assistant** --- 3rd party apps integrated to the Assistant
-   **Actions SDK** --- a software SDK for creating apps
-   **API.AI** (now called **DialogFlow**) --- a platform for creating conversational interfaces

It's important that your chatbot has a consistent persona, that corresponds to the core values or attributes of your brand, the spirit of your bot. A bot for children will likely be more friendly and use easy to understand vocabulary, vs a more formal tone for, say, a bank chatbot).

There are some great resources available for seeing if your chatbot and its conversation is ready for prime time:

-   [g.co/dev/ActionsChecklist](http://g.co/dev/ActionsChecklist) --- a checklist with various aspects to double check
-   [g.co/dev/ActionsDesign](http://g.co/dev/ActionsDesign) --- several useful guides explaining how proper human conversation work

Our tool of choice for our demo is [API.AI](https://api.ai/), for implementing the voice interactions. It's clearly one of the best platforms on the market that makes it simple to create intents, entities, handle contexts, deal with many predefined entity types, that also provides various pre-built conversations that you can peruse.

For the business logic, we went with [Google Cloud Functions](https://cloud.google.com/functions/) which allows us to define our logic using JavaScript and Node.JS. We also took advantage of the local [Cloud Functions emulator](https://cloud.google.com/functions/docs/emulator), to run our logic on our local machine, and [ngrok](https://ngrok.com/) for creating a tunnel between that local machine and API.AI. In API.AI, in the fulfillment webhook, you'll put the temporary URL given by ngrok, that then points at your local machine, via ngrok's tunnel. That way, you can see changes immediately, thanks to the live reloading supported by the emulator, making it easy to evolve your code.

Cloud Functions is Google's function-as-a-service offering, which is a serverless service, taylored for event-oriented systems as well as for direct HTTP invocation, and you pay only as you go, as requests are made or events are sent to your function. It's a cost effective solution, that scale automatically with your load.

To finish, we're also saying a few words about how to submit your bot to the Actions on Google development platform, to extend the Google Assistant with your own ideas.