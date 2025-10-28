---
title: "From named-parameters to Domain-Specific Languages"
date: 2006-08-13T00:00:00.000+02:00
tags: [dsl, groovy]
---

There have always been a few irritating things to me in Java. However, working on Groovy made me go beyond these limitations, or all the useless boiler-plate code one has to write. If I had to ask for some new features in Java 7, that would certainly be:

*   have closure support (or delegate or whatever you call that)
*   native syntax for common data structures like lists and maps
*   named parameters

Today, I'm going to say a few words about the last item on my list: named parameters.

A few days ago, I read Patrick who was speaking about [var args and Java's lack of named parameters](http://blogs.opensymphony.com/plightbo/2006/08/var_args_and_javas_lack_of_nam.html). It also remind me about Paul's ideas regarding [improvements ](http://paulhammant.com/blog/at-least-one-unilateral-improvement-to-java.html)we could bring to Java. I'm definitely on the same wave-length on those Java wishes.

Regarding named-parameters, despite living on the JVM (and hence its limitations), Groovy decided to provide a simple solution for passing named parameters to methods: we're leveraging the native syntax for Maps and the omition of square brackets. So in Groovy, when you define a map, you can use that native syntax:

```groovy
def myMap = [aKey: 1, anotherKey: 2, lastKey: 3]
```

This is quite convenient. But we went a bit further, because when we pass a map as a method argument, we can omit the brackets, so in the end, you can make method calls look like:

```groovy
myAccount.debit(amount: 500, currency: "euro")
monster.move(x: 400, y: 300, z: 200)
```

As Groovy allows you to add methods to all classes, you'd probably better add some more readable amounts, like with:

```groovy
500.euros
200.dollars
```

So the debit() method could look like that, without named parameters and parentheses:

```groovy
myAccound.debit 500.euros
```

And we're getting closer to [Domain-Specific Languages](http://en.wikipedia.org/wiki/Domain-specific_programming_language). Operator overloading would also help making the intent potentially clearer:

```groovy
myAccound + 500.euros
myAccound - 200.dollars
myAccount << 500.euros
myACcount >> 500.euros
```

I guess method calls are often clearer to read though

Back to DSLs, with named-parameter, closures, operator overloading, if I take again my bank account example again, we could imagine money transactions like that:

```groovy
def someMoney = 500.euros
InTransaction.do {
    accOne.credit( amount: someMoney )
    accTwo.debit( amount: someMoney )
}
```

Or to symbolize the money transfer between accounts:

```groovy
InTransaction.do { accOne << 500.euros << accTwo }
```

Again on named-parameters, Patrick was mentioning DAO finder methods. They could advantageously be replaced with:

```groovy
dao.findBy(name: "Harry", lastName: "Potter")
dao.findAllBy(author: "Rowling")
```

[Grails](http://grails.org/) even goes further with finder methods by intercepting imaginary method calls that translate into queries:

```groovy
def results = Book.findByTitle("The Stand")
results = Book.findByTitleLike("Harry Pot%")
results = Book.findByReleaseDateBetween( firstDate, secondDate )
results = Book.findByReleaseDateGreaterThan( someDate )
results = Book.findByTitleLikeOrReleaseDateLessThan( "%Something%", someDate )
```

Be careful to those who don't like long method names! But of course, there are [other solutions](http://grails.org/GORM#GORM-DomainClassQuerying) for doing queries.