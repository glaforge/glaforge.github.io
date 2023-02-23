---
title: "Billions of lines of code in a single repository, seriously?"
date: 2016-11-23T16:35:08+01:00
type: "talk"
layout: "talk"
tags:
- google
- git
---

When I joined Google last June, I discovered a new world: tons of new acronyms or project code names to learn about, but also a particular environment for your source code. At Google, engineers work on a huge monolithic source code repository comprising of: 

-   1 billion files
-   9 million source files
-   2 billion lines of code
-   35 million commits
-   86 terabytes of content
-   45 thousands of commits every day.

Rachel Potvin, who's an engineering manager at Google, wrote [an article for ACM](http://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext) about how Google handles such a huge repository, as well as the tools and practices around that. Wired also covered the topic in their article "[Google is 2 billion lines of code and it's all in one place](https://www.wired.com/2015/09/google-2-billion-lines-codeand-one-place)". And Rachel also [presented this topic at the @Scale conference](https://www.youtube.com/watch?v=W71BTkUbdqE).

> Google stores all its source code in one single monolithic repository! Imagine 25,000 software developers working simultaneously on 86 TB of data, including two billion lines of code in 9 million unique source files. Each week, there are as many lines of code changed as there are lines in the full Linux kernel repository. How does Google’s source code works at this scale? What are the advantages and drawbacks of such an approach? Come and learn about what it means to work on such a big mammoth repository.

You can find the slide deck embedded below:

{{< speakerdeck d3714d006f694a9f915b8637bb192eea >}}

And the talk was also recorded, so you can view the video on Devoxx's YouTube channel here:

{{< youtube yM0GQw1zgrA >}}