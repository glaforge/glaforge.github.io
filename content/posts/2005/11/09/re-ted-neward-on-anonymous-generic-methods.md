---
title: "Re: Ted Neward on anonymous generic methods"
date: 2005-11-09T00:00:00.000+01:00
tags: [groovy]
---

C#'s fanatic Ted Neward is amazed at how cool C#'s [anonymous generic methods](http://blogs.tedneward.com/CommentView,guid,f96809ba-7332-4df7-84c8-490ec66c584f.aspx) are. He then gives an example of a little program that filters some entries according to a critiria, using some generic types and delegates. It's about finding all persons from a set of persons whose last name is "Neward". Sam Pullara even showed his own version of the [same program in Java](http://www.javarants.com/B1823453972/C1464297901/E20051108213800/index.html) and explains that [IntelliJ IDEA](http://www.jetbrains.com/)allowed him to type roughly 10% of the characters of the program thanks to the wonderful completion and code templating capabilities of that IDE.

What strikes me is how verbose both versions are. Even C# with its delegate isn't particularly less verbose, except a few lines saved. No real readability, expressiveness or productivity gained -- though I must confess I do like all those nifty little features available in the upcoming C# 3.0. Naturally, I was tempted to give my own [Groovy](http://groovy.codehaus.org/) version of the problem. Here it is, and please note the conciseness and clarity of the following code:

```groovy
class Person {
    @Property String firstName
    @Property String lastName
    @Property int age
    String toString() { "Person{firstName='$firstName', lastName='$lastName', age=$age}" }
}

def persons = [
    new Person(firstName: "Cathi", lastName: "Gero", age: 35),
    new Person(firstName: "Ted", lastName: "Neward", age: 35),
    new Person(firstName: "Stephanie", lastName: "Gero", age: 12),
    new Person(firstName: "Michael", lastName: "Neward", age: 12),
]

def newards = persons.findAll{ it.lastName == "Neward" }

newards.each{ println it }
```