---
title: "Natural language API and JavaScript promises to bind them all"
date: 2016-07-28T00:00:00.000+02:00
tags: [google-cloud]

similar:
  - "posts/2016/07/27/web-scraping-and-rest-api-calls-on-app-engine-with-jsoup-and-groovy-wslite.md"
  - "posts/2016/07/20/sentiment-analysis-on-tweets.md"
  - "posts/2017/01/03/new-features-in-the-google-cloud-natural-language-api-thanks-to-your-feedback.md"
---

A bit of [web scraping with Jsoup and REST API calls with groovy-wsclient]({{< ref "/posts/2016/07/27/web-scraping-and-rest-api-calls-on-app-engine-with-jsoup-and-groovy-wslite" >}}) helped me build my latest demo with [Glide](http://glide-gae.appspot.com/) / [Gaelyk](http://gaelyk.appspot.com/) on [App Engine](https://cloud.google.com/appengine/), but now, it's time to look a bit deeper into the analysis of the White House speeches:

![](/img/misc/whitehouse-speeches-630.png)

I wanted to have a feel of how positive and negative sentences flow together in speeches. Looking at the rhetoric of those texts, you'd find some flows of generally neutral introduction, then posing the problem with some negativity connotation, then the climax trying to unfold the problems with positive solutions. Some other topics might be totally different, though, but I was curious to see how this played out on the corpus of texts from the speeches and remarks published by the [White House press office](https://www.whitehouse.gov/briefing-room/speeches-and-remarks).

## The Cloud Natural Language API

For that purpose, I used the [Cloud Natural Language API](https://cloud.google.com/natural-language/docs/):

*   [Split the text into sentences](https://cloud.google.com/natural-language/docs/basics#sentence-extraction) thanks to the [text annotation](https://cloud.google.com/natural-language/reference/rest/v1beta1/documents/annotateText) capability. The API can split sentences even further, of course, by word, to figure out verbs, nouns, and all components of sentences (POS: Part Of Speech tagging).
*   Define the [sentiment](https://cloud.google.com/natural-language/docs/sentiment-tutorial) of sentences, with a polarity (negative to positive), and a magnitude (for the intensity of the sentiment expressed).
*   [Extract entities](https://cloud.google.com/natural-language/docs/basics#entity_analysis), ie. finding people / organization / enterprise names, place locations, etc.

Text annotation is important for better understanding text, for example to create more accurate language translations. Sentiment analysis can help brands track how their customers appreciate their products. And entity extraction can help figure out the topics of articles, who's mentioned, places where the action takes places, which is useful for further contextual search, like finding all the articles about Obama, all the speeches about Europe, etc. There's a wide applicability of those various services to provide more metadata, a better understanding for a given piece of text.

## Asynchronously calling the service and gathering results

Let's look back at my experiment. When I scrape the speeches, I actually get a list of paragraphs (initially enclosed in \<p> tags basically). But I want to analyze the text sentence by sentence, so I need to use the text annotation capability to split all those paragraphs into sentences that I analyze individually.

Currently, the sentiment analysis works on one piece of text at a time. So you have to make one call per sentence! Hopefully an option might come to allow to send several pieces of text in a batch, or giving the sentiment per sentence for a big chunk of text, etc. But for now, it means I'll have to make p calls for my p paragraphs, and then n calls for all the sentences. those p + n calls might be expensive in terms of network traffic, but on the other hand, I can make the sentence coloring appear progressively, and asynchronously, by using JavaScript Promises and Fetch API, as I'm making those calls from the client side. But it seems it's possible to [batch requests with the Google API Client](https://developers.google.com/api-client-library/java/google-api-java-client/batch), but I haven't tried that yet.

First of all, to simplify the code a bit, I've created a helper function that calls my backend services calling the NL API, that wraps the usage of the Fetch API, and the promise handling to gather the JSON response:

```javascript
var callService = function (url, key, value) {
    var query = new URLSearchParams();
    query.append(key, value);
    return fetch(url, {
        method: 'POST',
        body: query
    }).then(function (resp) {
        return resp.json();
    })
};
```

I use the URLSearchParams object to pass my query parameter. The handy json() method on the response gives me the data structure resulting from the call. I'm going to reuse that callService function in the following snippets:

```javascript
callService('/content', 'url', e.value).then(function (paragraphs) {
    paragraphs.forEach(function (para, paraIdx) {
        z('#output').append('<p id="para' + paraIdx + '">' + para + '</p>');
        callService('/sentences', 'content', para).then(function (data) {
            var sentences = data.sentences.map(function (sentence) {
                return sentence.text.content;
            });
            return Promise.all(sentences.map(function (sentence) {
                return callService('/sentence', 'content', sentence).then(function (sentenceSentiment) {
                    var polarity = sentenceSentiment.documentSentiment.polarity;
                    var magnitude = sentenceSentiment.documentSentiment.magnitude;
                    return {
                        sentence: sentence,
                        polarity: polarity,
                        magnitude: magnitude
                    }
                });
            }));
        }).then(function (allSentiments) {
            var coloredSentences = allSentiments.map(function (sentiment) {
                var hsl = 'hsl(' +
                    Math.floor((sentiment.polarity + 1) * 60) + ', ' +
                    Math.min(Math.floor(sentiment.magnitude * 100), 100) + '%, ' +
                    '90%) !important';
                return '<span style="background-color: ' + hsl + '">' + sentiment.sentence + '</span>';
            }).join('&nbsp;&nbsp;');
            z('#para' + paraIdx).html(coloredSentences);
        });
    });
});
```

The first call will fetch the paragraphs from the web scraping service. I display each paragraph right away, uncolored, with an id so that I can then later update each paragraph with colored sentences with their sentiment.

Now for each paragraph, I call the sentences service, which calls the NL API to get the individual sentences of each paragraph. With all the sentences in one go, I use the Promise.all(iterable) method which returns a promise that resolves when all the promises of sentiment analysis per sentence have resolved. This will help me keep track of the order of sentences, as the analysis can give me results in a non predictable order.

I also keep track of the paragraph index to replace all the sentences of each paragraph, once all the promises for the sentences are resolved. I update the paragraph with colored sentences once all sentences of a paragraph are resolved, joining all colored sentences together.