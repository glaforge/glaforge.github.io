---
title: "A tight development loop for developing bots with API.ai, the Google Cloud Functions emulator, Node.js and Ngrok"
date: 2017-02-05T15:33:09+01:00
tags:
- chatbot
- dialogflow
- google-cloud
- cloud-functions
- nodejs
- javascript
- ngrok

similar:
  - "posts/2017/03/14/happy-pi-day-google-home-helps-you-learn-the-digits-of-pi.md"
  - "posts/2016/12/16/a-poor-man-assistant-with-speech-recognition-and-natural-language-processing.md"
  - "posts/2020/05/26/sip-a-cup-of-java-11-for-your-cloud-functions.md"
---

For [Google Cloud Next](https://cloudnext.withgoogle.com/) and [Devoxx France](http://devoxx.fr/), I'm working on a new talk showing how to build a conference assistant, to whom you'll be able to ask questions like "what is the next talk about Java", "when is Guillaume Laforge speaking", "what is the topic of the ongoing keynote", etc.

For that purpose, I'm developing the assistant using [API.AI](https://api.ai/). It's a "conversational user experience platform" recently acquired by Google, which allows you to define various "intents" which correspond to the kind of questions / sentences that a user can say, and various "entities" which relate to the concepts dealt with (in my example, I have entities like "talk" or "speaker"). API.AI lets you define sentences pretty much in free form, and it derives what must be the various entities in the sentences, and is able to actually understand more sentences that you've given it. Pretty clever machine learning and natural language process at play. In addition to that, you also have support for several spoken languages (English, French, Italian, Chinese and more), integrations with key messaging platforms like Slack, Facebook Messenger, Twilio, or [Google Home](https://madeby.google.com/home/). It also offers various SDKs so you can integrate it easily in your website, mobile application, backend code (Java, Android, Node, C#...)

When implementing your assistant, you'll need to implement some business logic. You need to retrieve the list of speakers, the list of talks from a backend or REST API. You also need to translate the search for a talk on a given topic into the proper query to that backend. In order to implement such logic, API.AI offers a Webhook interface. You instruct API.AI to point at your own URL that will take care of dealing with the request, and will reply adequately with the right data. To facilitate the development, you can take advantage of the SDKs I mentioned above, or you can also just parse and produce the right JSON payloads. To implement my logic, I decided to use [Google Cloud Functions](https://cloud.google.com/functions/), Google's recent serverless, function-based offering. Cloud Functions is currently is alpha, and supports JavaScript through Node.js.

For brevity sake, I'll focus on a simple example today. I'm going to create a small agent that replies to queries like "what time is it in Paris" or some other city.\
In API.AI, we're going to create an "city" entity with a few city names:

![](/img/tightloop/wtii-01-entity.png)

Next, we're creating the "ask-for-the-time" intent, with a sentence like "what time it is in Paris?":

![](/img/tightloop/wtii-02-intent.png)

Quick remark, when creating my intent, I didn't use the built-in @sys.geo-city data type, I just created my own city kind, but I was pleasantly surprised that it recognized the city name as a potential @sys.geo-city type. Neat!\
With our intent and entity ready, we enable the "fulfillment", so that API.AI knows it should call our own business logic for replying to that query:

![](/img/tightloop/wtii-03-fullfillment.png)

And that's in the URL field that we'll be able to point at our business logic developed as a Cloud Function. But first, we'll need to implement our function.

After having created a project in the Google Cloud console (you might need to request being whitelisted, as at the time of this writing the product is still in alpha), I create a new function, that I'm simply calling 'agent'. I define the function as being triggered by an HTTP call, and with the source code inline.

For the source of my function, I'm using the "actions-on-google" NPM module, that I'm defining in the package.json file:

```json
{
  "name": "what-time-is-it",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node server.js",
    "deploy": "gcloud alpha functions deploy agent --project what-time-is-it-157614  --trigger-http --stage-bucket gs://what-time-is-it-157614/"
  },
  "description": "An agent to know the time in various cities around the world.",
  "main": "index.js",
  "repository": "",
  "author": "Guillaume Laforge",
  "dependencies": {
    "actions-on-google": "^1.0.5"
  }
}
```

And the implementation looks like the following:

```javascript
var ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
const ASK_TIME_INTENT = 'ask-for-the-time';  
const CITY = 'city';
function whatTimeIsIt(assistant) {
  var city = assistant.getArgument(CITY);
  if (city === 'Paris') 
    assistant.ask("It's noon in Paris.");
  else if (city === 'London') 
    assistant.ask("It's 11 a.m. in London.");
  else 
    assistant.ask("It's way to early or way too late in " + city);
}
exports.agent = function(request, response) {
    var assistant = new ApiAiAssistant({request: request, response: response});
    var actionMap = new Map();
    actionMap.set(ASK_TIME_INTENT, whatTimeIsIt);
    assistant.handleRequest(actionMap);
};
```

Once my function is created, after 30 seconds or so, the function is actually deployed and ready to serve its first requests. I update the fulfillment details to point at the URL of my newly created cloud function. Then I can use the API.AI console to make a first call to my agent:

![](/img/tightloop/wtii-04-testing.png)

You can see that my function replied it was noon in Paris. When clicking the "SHOW JSON" button, you can also see the JSON being exchanged:

```json
{
  "id": "20ef54be-ee01-4fbe-9e6e-e73305046601",
  "timestamp": "2017-02-03T22:22:08.822Z",
  "result": {
    "source": "agent",
    "resolvedQuery": "what time is it in paris?",
    "action": "ask-for-the-time",
    "actionIncomplete": false,
    "parameters": {
      "city": "Paris"
    },
    "contexts": [
      {
        "name": "_actions_on_google_",
        "parameters": {
          "city": "Paris",
          "city.original": "Paris"
        },
        "lifespan": 100
      }
    ],
    "metadata": {
      "intentId": "b98aaae0-838a-4d55-9c8d-6adef4a4d798",
      "webhookUsed": "true",
      "webhookForSlotFillingUsed": "true",
      "intentName": "ask-for-the-time"
    },
    "fulfillment": {
      "speech": "It's noon in Paris.",
      "messages": [
        {
          "type": 0,
          "speech": "It's noon in Paris."
        }
      ],
      "data": {
        "google": {
          "expect_user_response": true,
          "is_ssml": false,
          "no_input_prompts": []
        }
      }
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success"
  },
  "sessionId": "4ba74fa2-e462-4992-9587-2439b32aad3d"
}
```

So far so good, it worked. But as you start fleshing out your agent, you're going to continue making tests manually, then update your code and redeploy the function, several times. Although the deployment times of Cloud Function is pretty fast (30 seconds or so), as you make even simple tweaks to your function's source code, adding several times 30 seconds, you will quickly feel like you're wasting a bit of time waiting for those deployments. What if... you could run your function locally on your machine, let API.AI point at your local machine somehow through its fulfillment configuration, and make changes live to your code, and test the changes right away without needing any redeployment! We can! We are going to do so by using the Cloud Functions emulator, as well as the very nice ngrok tool which allows you to expose your local host to the internet. Let's install the Cloud Functions emulator, as shown in its documentation:

```bash
npm install -g @google-cloud/functions-emulator
```

Earlier, we entered the code of our function (index.js and package.json) directly in the Google Cloud Platform web console, but we will now retrieve them locally, to run them from our own machine. We will also need to install the actions-on-google npm module for our project to run:

```bash
npm install actions-on-google
```

Once the emulator is installed (you'll need at least Node version 6.9), you can define your project ID with something like the following (update to your actual project ID):

```bash
functions config set projectId what-time-is-it-157614
```

And then we can start the emulator, as a daemon, with:

```bash
functions start
```

We deploy the function locally with the command:

```bash
functions deploy agent --trigger-http
```

If the function deployed successfully on your machine, you should see the following:

![](/img/tightloop/witi-05-function-deployed.png)

Notice that your function is running on localhost at:

```
http://localhost:8010/what-time-is-it-157614/us-central1/agent
```

We want this function to be accessible from the web. That's where our ngrok magic bullet will help us. Once you've signed-up to the service and installed it on your machine, you can run ngrok with:

```bash
ngrok http 8010
```

The command will expose your service on the web, and allow you to have a public, accessible https endpoint:

![](/img/tightloop/wtii-06-ngrok.png)

In the API.AI interface, you must update the fulfillment webhook endpoint to point to that https URL: [https://acc0889e.ngrok.io](https://acc0889e.ngrok.io/). But you must also append the path shown when running on localhost: what-time-is-it-157614/us-central1/agent, so the full path to indicate in the fulfillment URL will be: <https://acc0889e.ngrok.io/what-time-is-it-157614/us-central1/agent>

![](/img/tightloop/wtii-07-new-fulfillment.png)

Then I use the API.AI console to send another test request, for instance what is the time in San Francisco. And it's calling my local function:

![](/img/tightloop/wtii-08-typo.png)

And in the ngrok local console, you can indeed see that it's my local function that has been called in the emulator:

![](/img/tightloop/wtii-09-ngrok.png)

Nice, it worked! We used the Cloud Functions emulator, in combination with ngrok, to route fulfillment request to our local machine. However, the astute reader might have noticed that my bot's answer contained a typo, I wrote "to early", instead of "too early". Damn! I'll need to fix that locally, in a tight feedback loop, rather than having to redeploy all the time my function. How do I go about it? I just open my IDE or text editor, fix the typo, and here you go, nothing to redeploy locally or anything, the change is already applied and live. If I make a call in the API.AI console, the typo is fixed:

![](/img/tightloop/wtii-10-typo-fixed.png)

Thanks to the [Cloud Functions emulator](https://github.com/GoogleCloudPlatform/cloud-functions-emulator) and [ngrok](https://ngrok.com/), I can develop locally on my machine, with a tight develop / test loop, without having to deploy my functions all the time. The changes are taken into account live: no need to restart the emulator, or deploy the function locally. Once I'm happy with the result, I can deploy for real. Then, I'll have to remember to change the webhook fulfillment URL to the real live cloud function.