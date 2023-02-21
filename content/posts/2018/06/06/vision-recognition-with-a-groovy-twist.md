---
title: "Vision recognition with a Groovy twist"
date: 2018-06-06T14:05:23+01:00
tags:
- groovy
- vision
- machine-learning
---

Last week at [GR8Conf Europe](https://gr8conf.eu/), I spoke about the machine learning APIs provided by 
[Google Cloud Platform](https://cloud.google.com/): Vision, Natural Language, Speech recognition and synthesis, etc. 
Since it's GR8Conf, that means showing samples and demos using a pretty [Groovy](http://groovy-lang.org/) language, 
and I promised to share my code afterwards. So here's a series of blog posts covering the demos I've presented. 
We'll start with the Vision API.

The Vision API allows you to:

-   Get labels of what appears in your pictures,
-   Detect faces, with precise location of face features,
-   Tell you if the picture is a particular landmark,
-   Check for inappropriate content,
-   Give you some image attributes information,
-   Find if the picture is already available on the net,
-   Detects brand logos,
-   Or extract text that appears in your images (OCR).

You can try out those features online directly from the Cloud Vision API product page:

<https://cloud.google.com/vision/>

Here's a selfish example output:

![](/img/vision-groovy/ml-apis-01-try-out+small.png)

In this first installment, I'll focus on two aspects: labels and OCR. But before diving, I wanted to illustrate some of the **use cases** that those features enable, when you want to boost your apps by integrating the Vision API.

## Label detection

What's in the picture? That's what label detection is all about. So for example, if you're showing a picture from your vacations with your family and dog on the beach, you might be getting labels like *"People, Beach, Photograph, Vacation, Fun, Sea, Sky, Sand, Tourism, Summer, Shore, Ocean, Leisure, Coast, Girl, Happiness, Travel, Recreation, Friendship, Family"*. Those labels are also accompanied by percentage confidence.

### Example use cases:

-   If your website is a photography website, you might want your users to be able to search for particular pictures on specific topics. Rather than having someone manually label each and every picture uploaded, you can store those labels as keywords for your search engine.
-   You're building the next Instagram for animals, perhaps you want to check that the picture indeed contains a dog in it. Again labels will help to tell you if that's the case or not.
-   Those labels can help with automatic categorization as well, so you can more easily find pictures along certain themes.

## Face detection

Vision API can spot faces in your pictures with great precision, as it gives you detailed information about the location of the face (with a bounding box), as well as the position of each eye, eyebrows, nose, lips / mouth, ear, or chin. It also tells you how your face is tilted, even with which angle!

You can also learn about the sentiment of the person: joy, sorrow, anger, surprise. In addition, you're told if the face is exposed, blurred, or has some headwear.

### Example use cases:

-   Snapchat-style, you want to add a mustache or silly hat to pictures uploaded by your users.
-   Another handy aspect is that you can also count the number of faces in a picture. For example, if you want to count the number of attendees in a meeting or presentation at a conference, you'd have a good estimate of people with the number of faces recognized.

## Landmark detection

If the picture is of a famous landmark, like say, the Eiffel Tower, Buckingham Palace, the Statue of Liberty, the Golden Gate, the API will tell you which landmark it recognized, and will even give you the GPS coordinates of the place.

### Example use cases:

-   Users of your app or site should only upload pictures of a particular location, you could use those coordinates to automatically check that the place photographed is within the right geo-fenced bounding box.
-   You want to automatically show pictures on a map on your app, you could take advantage of the GPS coordinates, or automatically enrich a tourism websites with pictures from the visitors of that place.

## Inappropriate content detection

Vision API will give you a percentage confidence about whether the picture contains adult content, is a spoofed picture (with user added text and marks), bears some medical character, displays violence or racy materials.

### Example use case:

-   The main use case here is indeed to be able to filter images automatically, to avoid any bad surprise of user-generated content showing up in your site or app when it shouldn't.

## Image attributes and web annotations

Pictures all have dominant colors, and you can get a sense of which colors are indeed representing the best your image, 
in which proportion. Vision API gives you a palette of colors corresponding to your picture.

In addition to color information, it also suggests possible crop hints, so you could crop the picture to different aspect ratios.

You get information about whether this picture can be seen elsewhere on the net, 
with a list of URL with matched images, full matches, or partial matches.

Beyond the label detection, the API identifies "entities", returning to you IDs of those entities 
from the Google [Knowledge Graph](https://www.google.com/intl/bn/insidesearch/features/search/knowledge.html).

### Example use cases:

-   To make your app or website responsive, before loading the full images, you'd like to show colored placeholders for the picture. You can get that information with the palette information returned.
-   You'd like to automatically crop pictures to keep the essential aspects of it.
-   Photographers upload their pictures on your website, but you want to ensure that no one steals those pictures and put them on the net without proper attribution. You can find out whether this picture can be seen elsewhere on the web.
-   For the picture of me above, Vision API recognized entities like "Guillaume Laforge" (me!), Groovy (the programming language I've been working on since 2003), JavaOne (a conference I've often spoken at), "Groovy in Action" (the book I've co-authored), "Java Champions" (I've recently been nominated!), or "Software Developer" (yes, I still code a bit)

## Brand / logo detection

In addition to text recognition, that we'll mention right below, Vision API tells you if it recognized some logos or brands.

### Example use case:

-   If you're a brand, have some particular products, and you want your brand or products to be displayed on supermarket shelves, you might have people take pictures of those shelves and confirm automatically if your logo is displayed or not.

### OCR / text recognition

You can find the text that is displayed on your pictures. Not only does it gives you the raw text, but you also get all the bounding boxes for the recognized words, as well as offers a kind of document format, showing the various blocks of texts that appear.

### Example use case:

-   You want to automatically scan expense receipts, enter text rapidly from pictures, etc. The usual use cases for OCR!

## Time to get Groovy!

People often wonder where and when they can use the Vision API, I think I've given enough use cases for now, with detailed explanations. But it's time to show some code, right? So as I said, I'll highlight just two features: label detection and text detection.

Using the Apache Groovy programming language, I wanted to illustrate two approaches: the first one using the a REST client like [groovy-wslite](https://github.com/jwagenleitner/groovy-wslite), and the second one just using the [Java SDK](https://cloud.google.com/vision/docs/libraries) provided for the API.

### Preliminary

In order to use the Vision API, you'll need to have created an account on Google Cloud Platform (GCP for short). 
You can benefit from the $300 of credits of the [free trial](https://cloud.google.com/free/), as well as free quotas. 
For instance, for the Vision API, without even using your credits, you can make 1000 calls for free every month. 
You can also have a look at the [pricing](https://cloud.google.com/vision/pricing) of the API, once you go above the quota or your credits.

Briefly, if you're not already using GCP or have an account on it, please register and create your account on GCP, 
then create a cloud project. Once the project is created, 
[enable access to Vision API](https://cloud.google.com/vision/docs/before-you-begin), 
and you're ready to follow the steps detailed hereafter.

Although we've enabled the API, we still need somehow to be authenticated to use that service. 
There are different possibilities here. 
In the first sample with the OCR example, I'm calling the REST API and will be using an API key passed as query parameter, 
whereas for my label detection sample, I'm using a service account with applicaction default credentials. 
You can learn more about those approaches in the documentation on [authentication](https://cloud.google.com/vision/docs/auth).

Okay, let's get started!

### OCR calling the Vision REST endpoint

With spring and summer, allergetic people might be interested in which pollens are going to cause their allergies to bother them. Where I live, in France, there's a website showing a map of the country, and you can hover the region where you are, and see a picture of the allergens and their levels. However, this is really just a picture with the names of said allergens. So I decided to get their list with the Vision API.

![](/img/vision-groovy/ml-apis-03-allergens-labels+small.png)

In Apache Groovy, when calling REST APIs, I often use the [groovy-wslite](https://github.com/jwagenleitner/groovy-wslite) library. But there are other similar great libraries like [HTTPBuilder-NG](https://http-builder-ng.github.io/http-builder-ng/), which offer similar capabilities with nice syntax too.

Let's [grab](http://docs.groovy-lang.org/latest/html/documentation/grape.html) the REST client library and instantiate it:

```groovy
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.2')
import wslite.rest.*

def client = new RESTClient('https://vision.googleapis.com/v1/')
```

Here's the URL of the picture whose text I'm interested in:

```groovy
def imgUrl = "http://internationalragweedsociety.org/vigilance/d%2094.gif"
def API_KEY = 'REPLACE_ME_WITH_REAL_API_KEY'
```

Then I'm going to send a post request to the `/images:annotate` path with the API key as query parameter. 
My request is in JSON, and I'm using Groovy's nice list & maps syntax to represent that JSON request, 
providing the image URL and the feature I'm interested in (ie. text detection):

```groovy
def response = client.post(path: '/images:annotate', query: [key: API_KEY]) {
    type ContentType.JSON
    json "requests": [
        [
            "image": [
                "source": [
                    "imageUri": imgUrl
                ]
            ],
            "features": [
                [
                    "type": "TEXT_DETECTION"
                ]
            ]
        ]
    ]
}
```

This corresponds to the following JSON payload:

```json
{
    "requests": [
        {
            "image": {
                "source": {
                    "imageUri": imgUrl
                }
            },
            "features": [
                {
                    "type": "TEXT_DETECTION"
                }
            ]
        }
    ]
}
```

Thanks to Groovy's flexible nature, it's then easy to go through the returned JSON payload to get the list and println all the text annotations and their description (which corresponds to the recognized text):

```groovy
println response.json.responses[0].textAnnotations.description
```

### Label detection with the Java client library

For my second sample, as I visited Copenhagen for [GR8Conf Europe](https://gr8conf.eu/), 
I decided to see what labels the API would return for a typical picture of the lovely colorful facades of the 
[Nyhavn](https://en.wikipedia.org/wiki/Nyhavn) harbor.

![](/img/vision-groovy/ml-apis-02-nyhavn+small.png)

Let's [grab](http://docs.groovy-lang.org/latest/html/documentation/grape.html) the Java client library for the vision API:

```groovy
@Grab('com.google.cloud:google-cloud-vision:1.24.1')
import com.google.cloud.vision.v1.*
import com.google.protobuf.*
```

Here's the URL of the picture:

```groovy
def imgUrl = "https://upload.wikimedia.org/wikipedia/commons/3/39/Nyhavn_MichaD.jpg" .toURL()
```

Let's instantiate the ImageAnnotatorClient class. It's a closeable object, so we can use Groovy's withCloseable{} method:

```
ImageAnnotatorClient.create().withCloseable { vision ->
```

We need the bytes of the picture, that we obtain with the `.bytes` shortcut, and we create a `ByteString` object from the [protobuf](https://developers.google.com/protocol-buffers/) library used by the Vision API:

```groovy
def imgBytes = ByteString.copyFrom(imgUrl.bytes)
```

Now it's time to create our request, with the @AnnotateImageRequest` builder, 
using Groovy's [tap{}](http://docs.groovy-lang.org/latest/html/groovy-jdk/java/lang/Object.html#tap(groovy.lang.Closure)) 
method to make the use of the builder pattern easier:

```groovy
def request = AnnotateImageRequest.newBuilder().tap {
    addFeatures Feature.newBuilder().setType(Feature.Type.LABEL_DETECTION).build()
    setImage    Image.newBuilder().setContent(imgBytes).build()
}.build()
```

In that request, we ask for the label detection feature, and pass the image bytes. 
Then it's time to call the API with our request, and iterate over the resulting label annotations and their confidence score:

```groovy
vision.batchAnnotateImages([request])
      .responsesList.each { res ->
    if (res.hasError())
        println "Error: ${res.error.message}"

    res.labelAnnotationsList.each { annotation ->
        println "${annotation.description.padLeft(20)} (${annotation.score})"
    }
  }
}
```

The labels found (and their confidence) are the following:

```
            waterway (0.97506875)
water transportation (0.9240114)
                town (0.9142202)
               canal (0.8753313)
                city (0.86910504)
               water (0.82833123)
              harbor (0.82821053)
             channel (0.73568773)
                 sky (0.73083687)
            building (0.6117833)
```

Pretty good job!

## Conclusion

First of all, there are tons of situations where you can benefit from image recognition thanks to [Google Cloud Vision](https://cloud.google.com/vision/). Secondly, it can get even groovier when using the [Apache Groovy](http://groovy-lang.org/) language!

In the upcoming installment, we'll speak about natural language understanding, text translation, speech recognition and voice synthesis. So stay tuned!