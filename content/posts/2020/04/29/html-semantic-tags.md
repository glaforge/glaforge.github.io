---
title: "HTML semantic tags"
date: 2020-04-29T14:56:35+01:00
tags:
- html
- web
---

We all know about HTML 5, right? Well, I knew about some of the new semantic tags, 
like `header` / `nav` / `main` / `article` / `aside` / `footer`, 
but I'm still falling down to using tons of divs and spans instead. So as I want to refresh that blog at some point, 
it was time I revise those semantic tags. Let's take the little time we have during confinement to learn something!

There are likely plenty of videos of the topic, but this one was in my top results, so I watched:

{{< youtube kGW8Al_cga4 >}}

[HTML & CSS Crash Course Tutorial #6 - HTML 5 Semantics](https://www.youtube.com/watch?v=kGW8Al_cga4&list=WL&index=3&t=0s). 
It's part of a series of videos on the topic of HTML & CSS by the [Net Ninja](https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg). 
This particular episode was covering the topic of the semantic tags:

So you have a main tag that wraps the meaty content of your page (ie. not stuff like `header` / `footer` / `navigation`). 
Inside, you would put articles, that wrap each piece of content (a blog post, a news article, etc). 
Sections tend to be for grouping some other information, like a list of resources, some contact info. 
Asides can be related content like similar articles, or something somewhat related to your current article 
(perhaps a short bio of a character you're mentioning in your article?) 
In the header section, you'd put the title of your site, the navigation. 
The footer will contain your contact info.

Here's a basic structure of how those tags are organised:

![](/img/misc-learning/HTML+5+semantic+tag+structure.png)

After an explanation of those tags, the author does a live demo, building up a web page with all those tags. 
So it was a good refresher for me to remember how to use those tags, rather than nesting `div` after `div`!