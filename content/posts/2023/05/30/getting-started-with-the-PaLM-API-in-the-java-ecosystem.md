---
title: "Getting started with the PaLM API in the Java ecosystem"
date: 2023-05-30T15:42:32+02:00
tags:
- machine-learning
- large-language-models
- generative-ai
- micronaut
- groovy
- cloud-run
- google-cloud
- java
---

Large Language Models (LLMs for short) are taking the world by storm,
and things like ChatGPT have become very popular and used by millions of users daily.
Google came up with its own chatbot called [Bard](https://bard.google.com/),
which is powered by its ground-breaking [PaLM 2](https://ai.google/discover/palm2/) model and API.
You can also find and use the PaLM API from withing Google Cloud as well
(as part of [Vertex AI Generative AI](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview) products)
and thus create your own applications based on that API.
However, if you look at the documentation, you'll only find Python tutorials or notebooks,
or also explanations on how to make cURL calls to the API.
But since I'm a Java (and Groovy) developer at heart, I was interested in seeing how to do this from the Java world.

## Micronaut + Groovy + Cloud Run

My use case was to create a simple application that generates bedtime kid stories, using the PaLM LLM.
I went ahead and decided to use [Micronaut](https://micronaut.io) for my framework,
and [Apache Groovy](https://groovy-lang.org) for my programming language.
I containerize and deploy my application on [Cloud Run](https://cloud.run) on Google cloud.
And I use the [Cloud Run integration for Firebase](https://cloud.google.com/run/docs/integrate/firebase-hosting)
to have a nice domain for my app, and to serve my static content from Firebase's CDN.
I won't cover these aspects too much in this article,
but I want to stress the important roadblock you might encounter: authentication.

## Let's get started!

First, you may not necessarily have access to the Generative AI services in Google Cloud.
For that, you'll need to [sign up](https://cloud.google.com/ai/generative-ai) to join the Trusted Tester Program.
But once you have access, you'll be able to use the PaLM API programmatically for your own apps.

When experimenting with prompts to the LLM, you'll notice the handy sliding panel
that shows you how to interact with the API from code. But you only have the choice between Python and cURL.
That said, the cURL command helps you figure out how to call the API via REST:

```bash
curl \
    -X POST \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: application/json" \
    "https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_ID}:predict" -d \
    $'{
    "instances": [
        {
        "content": "Write a kid story about an astronaut visiting another galaxy but facing problems with shooting stars"
        }
    ],
    "parameters": {
        "temperature": 0.5,
        "maxOutputTokens": 1000,
        "topP": 0.8,
        "topK": 40
    }
    }'
```

We have the JSON structure in input, and if you call that command,
you'll get an output similar to the following one:

```json
{
  "predictions": [
    {
      "safetyAttributes": {
        "scores": [
          0.10000000149011612
        ],
        "blocked": false,
        "categories": [
          "Violent"
        ]
      },
      "content": "Once upon a time, there was a young astronaut called..."
    }
  ]
}
```

Our Micronaut will have to marshall/unmarshall those input and output JSON documents.
But the tricky bit for me was authentication.
From the command-line, the embedded `gcloud` command makes use of an access token,
which grants you access to the PaLM API.
But from my Micronaut/Groovy code, I needed to find a way to authenticate as well.

## Preparing a low-level HTTP client call

Let's craft the appropriate REST endpoint URI:

```groovy
def uri = UriBuilder
        .of("/v1/projects/${projectId}/locations/us-central1/publishers/google/models/text-bison:predict")
        .scheme("https")
        .host("us-central1-aiplatform.googleapis.com")
        .build()
```

Currently, the API is only available in the `us-central1` region, so it's hard-coded.

Then we need to prepare the request:

```groovy
def request = HttpRequest
        .POST(uri, [
                instances: [
                  [ content: storyPrompt ]
                ],
                parameters: [
                    temperature: 0.6,
                    maxOutputTokens: 1000,
                    topP: 0.8,
                    topK: 40
                ]
        ])
        .bearerAuth(token)
        .accept(MediaType.APPLICATION_JSON_TYPE)
        .contentType(MediaType.APPLICATION_JSON_TYPE)
```

In a moment, we'll see how we can create the bearer `token` we use in the `bearerAuth()` call.
Here, we just send the prompt, with some parameters to say how creative we want the LLM answer to be.

Finally, we make the request:

```groovy
def predictionResponse = client.toBlocking()
        .exchange(request, PredictionResponse)
        .body()

return predictionResponse.predictions.first().content
```

I created some classes to unmarshall the resulting JSON:

```groovy
import com.fasterxml.jackson.annotation.JsonProperty
import io.micronaut.serde.annotation.Serdeable

@Serdeable
class PredictionResponse {
    @JsonProperty("predictions")
    List<Prediction> predictions
}

@Serdeable
class Prediction {
    @JsonProperty("safetyAttributes")
    SafetyAttributes safetyAttributes
    @JsonProperty("content")
    String content
}

@Serdeable
class SafetyAttributes {
}
```

## Authenticating

When running my application locally, no problem, but once deployed, I needed to have a fresh bearer token.
I created a dedicated service account, with the minimum needed permissions:

* `roles/aiplatform.user` to have the rights to call the PaLM API
* `roles/logging.logWriter` as your Cloud Run app needs to write some logs back to Cloud Logging

This [article](https://medium.com/google-cloud/generative-ai-palm-2-model-deployment-with-cloud-run-54e8a398b24b)
also nicely explains how to handle deployment to Cloud Run.

My Cloud Run service will be deployed with that service account.

Locally, on my laptop, I used the `GOOGLE_APPLICATION_CREDENTIALS" approach,
by exporting a JSON key, and point at it via an environment variable:

```bash
GOOGLE_APPLICATION_CREDENTIALS="exported-key.json"
```

You can learn more about local development with
[Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev).

So locally, we use that exported key, and locally we use a generated token from the restricted service account.
And to generate that token, I had to use the
[google-auth-library-oauth2-http](https://github.com/googleapis/google-auth-library-java#google-auth-library-oauth2-http)

Here's the missing snippet to do so:

```groovy
def credentials = GoogleCredentials.applicationDefault
        .createScoped('https://www.googleapis.com/auth/cloud-platform')
credentials.refreshIfExpired()
def token = credentials.accessToken.tokenValue
```

To import that authentication library in my project, I defined its requirement in my `build.gradle` file:

```groovy
implementation('com.google.auth:google-auth-library-credentials:1.17.0')
```

## Voilà!

With the right authentication client library, I was able to create the beared token needed to authenticate
to the Vertex AI PaLM API, both locally on my laptop, and once deployed on Cloud Run as well.

Hopefully, when Google releases official Java client libraries,
it'll certainly be easier to interact with the PaLM API,
without having to create marshalling/unmarshalling code,
and will likely make it smoother to authenticate transparently.
So stay tuned!