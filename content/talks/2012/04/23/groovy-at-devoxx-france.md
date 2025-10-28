---
title: "Groovy at Devoxx France"
date: 2012-04-23T02:00:00.000+02:00
type: "talk"
layout: "talk"
tags: [conference, groovy]
---

Last week saw the first edition of [Devoxx France](http://www.devoxx.fr/display/FR12/Accueil). And what a success it was! The conference was sold out at 1200 persons. There was a great wealth of interesting topics and many passionate attendees to talk to. Overall, I come back home impressed that the first edition worked out so well, flawlessly, and was such a joy to attend. So a big thank you and congrats to all those involved in making Devoxx France such a great event!  

Along with [Cédric Champeau](http://www.jroller.com/melix/), I had the pleasure to present the novelties of Groovy 2.0 (and a bit of retrospective on some of the key features of Groovy 1.8). We covered quickly the invoke dynamic support and modularization, and went into more depth into the static type checking and static compilation aspects.  

I've pushed the [slides of that presentation](http://www.slideshare.net/glaforge/groovy-20-devoxx-france-2012) on Slideshare, please see below for the embedded presentation.  

What was also interesting was to update my informal benchmarks which looked at the performance of Groovy in a certain number of situations:

*   without particular improvements (ie Groovy 1.7 and before),
*   with the primitive optimizations (Groovy 1.8),
*   and with static compilation.

The results are pretty good and show that in static compilation mode, Groovy's performance is as good as Java in most cases. There are still some improvements we can make, some bytecode to clean up, some bugs to iron out, etc, but overall, the goal of attaining Java's performance is reached. 

For my benchmark, I took some Java implementations of the Fibonaci suite, the calculation of Pi (quadrature style), and a binary tree implementation. I converted them to Groovy (often, it's just a file extension rename, plus removing some semicolons for good measure), without really trying to optimize them in a Groovy manner. And the results I got looked as follows:  

Fibonaci Pi (quadrature) Binary trees Java 143 ms 93 ms 4.5 s Groovy with static compilation 145 ms 96 ms 6.9 s Groovy with primitive optimizations 271 ms 103 ms 29.6 s Groovy without optimizations 3200 ms 2590 ms 50.0 s So that's pretty good news for those who are looking for performance, and more generally it'll benefit anyone as well in any case.  

And now... the slides!  

{{< slideshare 12628457 >}}