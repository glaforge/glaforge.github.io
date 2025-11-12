---
title: "Minor new features of Groovy 2.0"
date: 2012-07-04T04:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2009/02/27/whats-new-in-groovy-16.md"
  - "posts/2012/06/28/whats-new-in-groovy-20.md"
  - "posts/2012/03/05/groovy-news-bits-api-additions-contributing-to-the-project-eclipse-plugin.md"
---

Although I've gone at length through the [key major features of Groovy 2.0](http://bitly.com/groovy2)in the InfoQ article, there have been a few smaller ones which are interesting to note. And groovy guys like [Tim Yates](http://blog.bloidonia.com/), [André Steingress](http://blog.andresteingress.com/) or [Mr Hakki](http://mrhaki.blogspot.fr/) were quick to blog about them!  

*   [`inject()` method with a default initial value](http://blog.bloidonia.com/post/26065857945/whats-new-in-groovy-2-0-inject-with-default)
*   [`takeWhile()` and `dropWhile()` methods](http://blog.bloidonia.com/post/26065074691/whats-new-in-groovy-2-0-takewhile-and-dropwhile)
*   [`withDefault()`, `withEager()` methods](http://blog.andresteingress.com/2012/06/29/groovy-2-0-love-for-grails-command-objects/)
*   [`matchesPartially()` method for matchers](http://mrhaki.blogspot.fr/2012/06/groovy-goodness-partial-matches.html) (to see if a string might match a pattern given more input)
*   [`@NotYetImplemented` transformation for test cases](http://blog.andresteingress.com/2012/03/04/using-notyetimplemented-in-test-cases/)
*   [an iterable `collectEntries()` variant](https://jira.codehaus.org/browse/GROOVY-5387)
*   [`first()` and `last()` working with iterables as well](https://jira.codehaus.org/browse/GROOVY-5407)
*   [`collate()` method](https://jira.codehaus.org/browse/GROOVY-5283) (although it's also in 1.8.6 actually) (see [coverage by Tim](http://blog.bloidonia.com/post/18073244930/whats-new-in-groovy-1-8-6-the-collate-method) and [Mr Hakki](http://mrhaki.blogspot.co.uk/2012/04/groovy-goodness-collate-list-into-sub.html))
*   [calendar ranges](https://jira.codehaus.org/browse/GROOVY-3916) (useful for iterating over days of a certain period)

Those are some smaller features compared to the big highlights of Groovy 2.0, but they are definitely useful and make you more productive every day!