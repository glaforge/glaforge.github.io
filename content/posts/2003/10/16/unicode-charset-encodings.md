---
title: "Unicode, charset, encodings"
date: 2003-10-16T00:00:00.000+02:00
tags: [geek]
---

Today, through Java blogs, I came across [Joel Spolsky's post](http://www.joelonsoftware.com/articles/Unicode.html) regarding **_The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets_**. I have to recommend anybody curious about i18n issues to read this very good introduction. I wish I had read that before, two years ago, when I had to deal with different file encodings ;-)

This article remind me of one of my old home projects, back in the summer 2002. I was developing (and I'm still doing so) with IntelliJ IDEA at work, and I had messed up with some critical XML files because I was playing with the default encoding used by IntelliJ in the preferences panel... I was so ashamed that I decided to file some feature requests about automatic charset recognition for my beloved Java IDE. And even better, I coded some java classes that I gave Maxim Shafirov. And my code was finally integrated (perhaps modified to suit their needs) into IDEA 3.0.

For people interested in this package, you can have a look at my project page : [GuessEncoding](https://github.com/codehaus/guessencoding).