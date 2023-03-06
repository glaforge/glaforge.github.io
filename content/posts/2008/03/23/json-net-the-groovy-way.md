---
title: "JSON.Net, the Groovy way"
date: "2008-03-23T00:00:00.000+01:00"
tags: [groovy]
---

On [Ajaxian](http://ajaxian.com/archives/jsonnet-20), the other day, I spotted an article about [JSON.Net](http://www.codeplex.com/Json), a project aiming at simplifying the production and consumption of JSON data for the .Net world, and I wanted to contrast what I've read with what we are doing with [Groovy](http://groovy.codehaus.org/) and [Grails](http://grails.org/). I rarely speak about the Microsoft world, but the latest features of C# 3 are very interesting and powerful, particularly the anonymous types, their closures (whatever they are called), and LINQ for querying relational or tree structured data.

For instance, here's how JSON.Net produces JSON content:

```csharp
JObject o = JObject.FromObject(new
{
    channel = new
    {
        title = "James Newton-King",
        link = "http://james.newtonking.com",
        description = "James Newton-King's blog.",
        item =
            from p in posts
            orderby p.Title
            select new
            {
                title = p.Title,
                description = p.Description,
                link = p.Link,
                category = p.Categories
            }
        }
    });
```

Here, we can see the new anonymous type feature, with the new {} construct to easily create new data structure, without requiring the creation of classes or interfaces. And in the item element, we notice LINQ at work providing an SQL like notation to select the posts ordered by title.

In Groovy and Grails land, we are reusing the map notation to [create JSON content](http://grails.org/doc/1.0.x/guide/6.%20The%20Web%20Layer.html#6.1.7%20XML%20and%20JSON%20Responses), that we then coerce to JSON using the as operator:

```groovy
import grails.converters.JSON

def data = [
    channel: [
        title: "James Newton-King",
        link: "http://james.newtonking.com",
        description: "James Newton-King's blog.",
        item: 
            posts.sort { it.title }.collect { 
            [
                title: it.title,
                description: it.description,
                link: it.link,
                category: it.categories
            ]
        }
    ]
]

// then, if you want to render this structure as JSON inside a Grails controller:
render data as JSON
```

Unlike LINQ with its SQL-like notation, Groovy favors a more functional approach, using the sort() and collect() taking closures to do the filtering and aggregation. These methods are added by the Groovy Development Kit to the usual Java collection classes.