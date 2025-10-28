---
title: "Google announces Dart, new language for the web"
date: 2011-10-10T00:00:00.000+02:00
tags: [geek, groovy]
---

Google [announces Dart](http://blog.chromium.org/2011/10/dart-language-for-structured.html), at the [Goto Conference](http://gotocon.com/aarhus-2011/presentation/Opening%20Keynote:%20Dart,%20a%20new%20programming%20language%20for%20structured%20web%20programming): a new programming language for "structured web programming", for building web applications. Google also launched the [Dart website](http://www.dartlang.org/), where you can read about the rationale of the language, the [specification](http://www.dartlang.org/docs/spec/dartLangSpec.pdf), and play with some live examples.  

## The team behind Dart  

Reknown engineers [Lars Bak](http://gotocon.com/aarhus-2011/speaker/Lars+Bak) and [Gilad Bracha](http://gotocon.com/aarhus-2011/speaker/Gilad+Bracha) are on stage to present the language. Lars Bak worked on many virtual machines like Sun's HotSpot or more recently [Google V8](http://code.google.com/p/v8/), whereas Gilad Bracha is also famous for his work on the Java specification, his Smalltalk background, and the creation of a recent language called [Newspeak](http://newspeaklanguage.org/) (a flavour of Smalltalk). So with such a team of VM and language experts, you can expect some interesting outcome.  

But beyond those two well known figures, it seems Google has aligned a [big list of engineers](http://code.google.com/p/dart/people/list?num=100&start=0) to work on the project, as you can see on the Google code page. What is interesting as well, is that Bob Nystrom is also part of the team: Bob created the [Magpie language](http://magpie.stuffwithstuff.com/), which is a really creative, elegant, and innovative language. I hope Dart can get pattern matching as nicely as Magpie has it.  
What's Dart?  

Dart is a simple Object-Oriented language with single inheritance, class-based, with optional static types, and is single threaded. Dart resembles a mix of Java and JavaScript, when you look at the samples on the [Dart website](http://www.dartlang.org/).  
Dart's objectives are:

> *   Create a **structured yet flexible** language for web programming.*   Make Dart feel **familiar and natural** to programmers and thus easy to learn.*   Ensure that Dart delivers **high performance** on all modern web browsers and environments ranging from small handheld devices to server-side execution.

  
## Optional static types  

The choice of optional static typing is interesting, as it's also a choice we made with [Groovy](http://groovy.codehaus.org). As Gilad coined it: "you are innocent until proven guilty on types". Types are there when you need them, especially for larger-scale applications, where types simplify refactoring types, for example. But types don't get in the way when you don't need them.  

Using types will help developers express their intent more clearly, will help IDEs and other tools to better understand the structure of your applications, and less documentation will be needed as types will serve as a cue of what your objects at hand are all about. But in places where you don't need types (think inside your method bodies, and quick scripts or prototypes, etc), you can just omit the type information, and you'll only get warnings from the compiler if you make mistakes with the types.  

## Dedicated VM or compiled to JavaScript  

Dart code will be able to run either on a dedicated VM, or compiled to JavaScript so as to run on any modern browser (Chrome, Safari 5+, Firefox 4+). At some point, the VM might be integrated in Google Chrome. And you'll also be able to run Dart on the server-side, like this is the case with JavaScript and Google V8, for instance.  

## Isolates, an actor-like concurrency model  

Although Dart is single-threaded, its answer to concurrency comes without locking or shared memory, in the form of an actor-like model of concurrency, like in [Groovy's GPars](http://gpars.codehaus.org/Actor?nc). Those actors are actually called "isolates".  

## Miscelanous  

Here are some additional notes I took while looking at the documentation on the Dart website:  

*   Dart supports interpolated strings like [Groovy's GString](http://groovy.codehaus.org/Strings+and+GString), supporting both ${name} or $name like Groovy.
*   The visibility is quite simple, with just public and private. Private fields or classes are actually following a naming convention: prefixed with an underscore.
*   Dart requires semicolons, what a pity!
*   Dart has functions / closures, with a syntax like `(var a, var b) { body }`. Think JavaScript's function, but without the function keyword.
*   Dart supports getters and setters with a C#-like approach.
*   A fat arrow \=> is used for returning a value (when you don't need a full curly-braced function body but just want to return a value, for example for getters).
*   There's just one constructor for your classes, but you can somehow add additional named constructors with a method named prefixed by the class name.
*   The [grammar](https://code.google.com/p/dart/source/browse/branches/bleeding_edge/dart/language/grammar/Dart.g) was developed with Antlr.
*   There are a [bunch of samples](http://www.dartlang.org/samples/index.html) to look at that are available on Google Code.

## Status and more  

Dart is not quite done yet, and it seems certain aspects still need to be worked on, like reflection support, rest arguments, enums, pattern matching, etc. But it seems those features are also waiting for user support, as the Dart team is looking for feedback from the community. But despite its unfinished state, it seems Dart is already quite fast, as Dart is already faster than V8 JavaScript when it was initially launched. 

I'm sure the [Twitter account for Dart](https://twitter.com/#!/dart_lang) will quickly get a lot of followers. It's always interesting to follow the birth and evolution of new languages!  

## Update:

*   A [nice analysis on the language features](http://jlouisramblings.blogspot.com/2011/10/musings-on-dart.html)
*   The draft [Dart language specification](http://www.dartlang.org/docs/spec/dartLangSpec.pdf) is also interesting to read (although the document needs some concrete examples in various places to make it more readable)
*   The [slides of the presentation](http://gotocon.com/dl/goto-aarhus-2011/slides/GiladBracha_and_LarsBak_OpeningKeynoteDartANewProgrammingLanguageForStructuredWebProgramming.pdf) at GotoCon