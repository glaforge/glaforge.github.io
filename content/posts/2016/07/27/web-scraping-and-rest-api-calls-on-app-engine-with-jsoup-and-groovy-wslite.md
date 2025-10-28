---
title: "Web scraping and REST API calls on App Engine with Jsoup and groovy-wslite"
date: 2016-07-27T00:00:00.000+02:00
tags: [gaelyk, google-cloud, groovy]
---

After my [Twitter sentiment article]({{< ref "/posts/2016/07/20/sentiment-analysis-on-tweets" >}}), those past couple of days, I've been playing again with the [Cloud Natural Language API](https://cloud.google.com/natural-language/docs/). This time, I wanted to make a little demo analyzing the text of speeches and remarks published by the press office of the White House. It's interesting to see how speeches alternate negative and positive sequences, to reinforce the argument being exposed.  

![](/img/misc/whitehouse-speeches-630.png)  

As usual, for my cloud demos, my weapons of choice for rapid development are [Apache Groovy](http://www.groovy-lang.org/), with [Glide](http://glide-gae.appspot.com/) & [Gaelyk](http://gaelyk.appspot.com/) on [Google App Engine](https://cloud.google.com/appengine/)! But for this demo, I needed two things:

*   a way to scrape the content of the [speeches & remarks](https://www.whitehouse.gov/briefing-room/speeches-and-remarks) from the White House press office
*   a library for easily making REST calls to the [Natural Language API](https://cloud.google.com/natural-language/docs/)

In both cases, we need to issue calls through the internet, and there are some limitations on App Engine with regards to such [outbound networking](https://cloud.google.com/appengine/docs/java/outbound-requests). But if you use the plain Java HTTP / URL networking classes, you are fine. And under the hood, it's using App Engine's own [URL Fetch service](https://cloud.google.com/appengine/docs/java/issue-requests).  
I used [Jsoup](https://jsoup.org/) for web scraping, which takes care itself for connecting to the web site.  
For interacting with the REST API, [groovy-wslight](https://github.com/jwagenleitner/groovy-wslite) came to my rescue, although I could have used the Java SDK like in my previous article.  
Let's look at Jsoup and scraping first. In my controller fetching the content, I did something along those lines (you can run this script in the Groovy console):

```groovy
@Grab('org.jsoup:jsoup:1.9.2') import org.jsoup.\*   
def url = 'https://www.whitehouse.gov/the-press-office/2016/07/17/statement-president-shootings-baton-rouge-louisiana' def doc = Jsoup.connect(url) .userAgent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0') .get() println doc.select('.forall-body .field-item p').collect { it.text() }.join('\\n\\n')
```

Now I'm gonna make a call with groovy-wslight to the NL API:

```groovy
@Grab('com.github.groovy-wslite:groovy-wslite:1.1.3')  
import wslite.rest.*   

def apiKey = 'MY_TOP_SECRET_API_KEY'   
def client = new RESTClient('https://language.googleapis.com/v1beta1/')  
def result = client.post(path: 'documents:annotateText', query: [key: apiKey]) {  
    type ContentType.JSON  
    json document: [  
        type : 'PLAIN_TEXT',  
        content: text  
    ], features: [  
        extractSyntax : true,  
        extractEntities : true,  
        extractDocumentSentiment: true  
    ]  
}  
// returns a list of parsed sentences  
println result.json.sentences.text.content  
// prints the overall sentiment of the speech  
println result.json.documentSentiment.polarity
```
  
Groovy-wslight nicely handles XML and JSON payloads: you can use Groovy maps for the input value, which will be marshalled to JSON transparently, and the GPath notation to easily access the resulting JSON object returned by this API.  

It was very quick and straightforward to use Jsoup and groovy-wslight for my web scraping and REST handling needs, and it was a breeze to integrate them in my App Engine application. In a follow-up article, I'll tell you a bit more about the sentiment analysis of the sentences of the speeches, so please stay tuned for the next installment!