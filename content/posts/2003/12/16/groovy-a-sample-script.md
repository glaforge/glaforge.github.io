---
title: "Groovy: a sample script"
date: 2003-12-16T00:00:00.000+01:00
tags: [groovy]
---

In the [IntelliJ forums](http://www.intellij.net/forums/), I came across an off-topic (but funny) [post](http://www.intellij.net/forums/thread.jsp?forum=22&thread=58983&message=645130&q=536f6d65626f647920746f6c64206d65206f6e6365207468617420746865726520617265206f6e6c792074776f20776f72647320696e2074686520456e676c69736820#645130) by Robert Gibson who was wondering :

> Somebody told me once that there are only two words in the English language which contain each vowel, once only, in alphabetical order. Anybody know what the other one is?

Indeed, there are more than two words corresponding to those constraints. I then wrote a little Java class which took all the words of a [words file](http://www.und.edu/org/crypto/crypto/words/english_word_list/) (with 100k words) and tested if they matched a regexp corresponding to those constraints.

But for the fun and for living on the cutting edge, I decided to also write a [Groovy](http://groovy-lang.org/) script doing the very same thing. In fact, it's much more consise, and overall, I've fallen in love with closures. I'd love to have closures in Java.

Here is my little script (in fact, it is my second ever written Groovy script after my [LOAF implementation](http://glaforge.free.fr/weblog/index.php?itemid=46&catid=2))

```groovy
def foo = new File("wordlist.txt")
foo.eachLine{ word ->
  if (word ==~ "^[^aeiou]*a[^aeiou]*e[^aeiou]*i[^aeiou]*o[^aeiou]*u[^aeiou]*$" ) 
    println word
}
```