---
title: "Apple's Swift programming language inspired by Groovy"
date: 2014-06-02T00:00:00.000+02:00
tags: [groovy]
---

During Apple's [WWDC](https://developer.apple.com/wwdc/) conference was announced a new programming language, called [Swift](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/GuidedTour.html#//apple_ref/doc/uid/TP40014097-CH2-XID_1), targeted at developing on iOS devices (and likely Mac OS X in the future as well).  

When looking through the slides from the keynote, [online documentation](https://developer.apple.com/library/prerelease/ios/referencelibrary/GettingStarted/LandingPage/index.html#//apple_ref/doc/uid/TP40014345), and [iTunes ebook](https://itun.es/fr/jEUH0.l), an acquainted Groovy eye would immediately notice the inspiration the Swift designers took from Groovy.  

In one of the slides covering Swift, Groovy was even mentioned as one of the languages clearly making developers much more productive, although I disagree with the placement of Groovy in terms of performance as Groovy should clearly be leading the pack of the bottom right hand quadrant.  
![](/img/misc/swift.png)  

Swift is clearly a blend of various good things from many existing languages:

*   the getter / setter syntax close to the one from C#
*   the type after variable named and colon, like in Pascal-derived languages
*   string interpolation like in many scripting languages, using `\(foo)` versus Groovy's `${foo}`
*   the question mark suffix after a type to denote it can be nullable, like in Ceylon
*   the range operators .. and ... borrowed from Ruby (that Groovy also adopted and adapted for clarity, as Groovy's excluded upper bound is denoted by `..<` instead)

But Swift clearly took inspiration from Groovy on the following aspects.  

Groovy and Swift (as well as other scripting languages) do have that concept of script, where free-standing statements don't need to be bundled into some kind of class structure, making scripting languages nice for the REPL feedback loop.  

The syntax for lists and maps is the same in Swift and Groovy, with a comma-separated list of values surrounded by square brackets for lists, and key:value pairs comma-separated and surrounded again by square brackets for creating maps. The empty map is also the same with the \[:\] syntax.  

```groovy
// Swift
var shoppingList = ["catfish", "water", "tulips", "blue paint"]
shoppingList[1] = "bottle of water"
 
var occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
]
occupations["Jayne"] = "Public Relations"
var emptyMap = [:]
var emptyList = []

// Groovy
def shoppingList = ["catfish", "water", "tulips", "blue paint"]
shoppingList[1] = "bottle of water"
 
def occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
]
occupations["Jayne"] = "Public Relations"
def emptyMap = [:]
def emptyList = []
```

  
The sole difference here is actually the fact Groovy's using "def" instead of "var". But a nice aspect of Swift is that it's got a "let" keyword for defining constants. You can use "final" in Groovy but it's not enforced by the compiler (yet).  

Swift closures also adopt the same syntax as Groovy for its curly braces delimiters, but is using an "in" keyword to replace Groovy's arrow separating parameters from closure's body.  

Here's what an example of Swift closure looks like compared to Groovy:  

```groovy
// swift
numbers.map({
    (number: Int) -> Int in
    let result = 3 * number
    return result
})
    
// groovy
numbers.collect { int number ->
    def result = 3 * numbers
    return result
}
```

But there's also a shorter variant for both languages, with Swift's positional closure parameters, versus Groovy's "it" pseudo-keyword:  

```groovy
// swift
numbers.map({ 3 * $0 })
numbers.map({ it in 3 * it })

// groovy
numbers.collect { 3 * it }
```

Swift also adopted Groovy's syntactic rule that if a closure is the last parameter of a function or method, you can actually put that last parameter outside the parentheses like so:  

```groovy
// swift
sort([1, 5, 3, 12, 2]) { $0 > $1 }
    
// groovy
sort([1, 5, 3, 12, 2]) { a, b -> a > b }
// or possibly, if we pass an array as param
sort([1, 5, 3, 12, 2]) { it[0] > it[1] }
```

  
Another interesting aspect is named parameters. For instance, for instantiating objects:  

```groovy
// swift
var triangleAndSquare = TriangleAndSquare(size: 10, name: "another test shape")
    
// groovy
def triangleAndSquare = new TriangleAndSquare(size: 10, name: "another test shape")
```
  
Swift has a `@lazy` annotation similar to Groovy's `@Lazy` code transformation, to lazily instantiate complex fields only when they are first accessed:  

```groovy
// swift
class DataManager {
    @lazy var importer = DataImporter()
}
    
// groovy
class DataManager {
    @Lazy importer = new DataImporter()
}
```

Alongside its nullable types à la Ceylon, Swift adopted the safe navigation operator of Groovy (the next version of C# is going to support that Groovy notation as well):  

```groovy
// swift
let john = Person()
if let roomCount = john.residence?.numberOfRooms {
    println("John's residence has \(roomCount) room(s).")
} else {
    println("Unable to retrieve the number of rooms.")
}

// groovy
def john = new Person()
def roomCount = john.residence?.numberOfRooms
if (roomCount) {
    println "John's residence has ${roomCount} room(s)."
} else {
    println "Unable to retrieve the number of rooms."
}
```

  
Swift is brand new, and I haven't had much time to dive deeper yet, but it sounds like a nice and elegant language, and right out of the box, it makes me feel at home thanks to its resemblance with Groovy! It even makes me want to write Swift applications for some iOS device!