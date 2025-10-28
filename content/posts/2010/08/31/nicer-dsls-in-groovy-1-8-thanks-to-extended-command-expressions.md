---
title: "Nicer DSLs in Groovy 1.8 thanks to Extended Command Expressions"
date: 2010-08-31T00:00:00.000+02:00
tags: [dsl, groovy]
---

A quick heads-up to tell you about an upcoming Groovy 1.8 feature which will allow us to make nicer DSLs. This feature will be available in Groovy 1.8-beta-2, which will probably be released before JavaOne.

Lidia Donajczyk was our Google Summer of Code student this year, working on the implementation of GEP-3, an extension to Groovy's command expressions. You can have a look at the [GEP-3 page](http://docs.codehaus.org/display/GroovyJSR/GEP+3+-+Command+Expression+based+DSL) for the guiding ideas behind this enhancement proposal.

Just like you could use simple command expressions before, like:

```groovy
println "hello"
move left
make coffee
drink tea
```

GEP-3 extends this for more complex sentences such as:

```groovy
drink tea with sugar and milk  
move left by 30.centimeters  
sendFrom "Guillaume" to "Jochen"  
send from: "Jochen" to "Lidia"  
Email.from "Lidia" to "Guillaume" withBody "how are you?"  
contact.name "Guillaume" age 33  
move left by 30.centimeters  
sell 100.shares of MSFT  
take 2.pills of chloroquinine in 6.hours  
blend red, green of acrylic  
artist.paint "wall" with "Red", "Green", and: "Blue" at 3.pm  
wait 2.seconds and execute { assert true }  
concat arr\[0\] with arr\[1\] and arr\[2\]  
developped with: "Groovy" version "1.8-beta-2"
```

A more [thourough example](http://groovyconsole.appspot.com/script/214001) is this:

```groovy
Recipe.instructions {
    take medium_bowl
    combine soy_sauce, vinegar, chili_powder, garlic
    place chicken into sauce
    turn once to coat
    marinate 30.minutes at room_temperature
}
```

## Summary of the pattern

*   A command-expression is composed of an even number of elements
*   The elements are alternating a method name, and its parameters (can be named and non-named parameters, and a mix of them)
*   A parameter element can be any kind of expression (ie. a method call `foo()`, `foo{}`, or some expression like `x+y`)
*   All those pairs of method name and parameters are actually chained method calls (ie. `send "hello" to "Guillaume"` is two methods chained one after the other as `send("hello").to("Guillaume"))`

## Current limitations

*   Extended command expressions are not yet allowed on the RHS (righ-hand side) of assignments, so you can't yet do: `def movement = move left by 30.centimeters`
*   Also, we can't yet use methods with zero-arguments.

Hopefully, we'll work on those limitations before the final release of Groovy 1.8. One of the nice aspects of this extended command expression pattern is that it should play nicely with most Java APIs following the Java builder pattern.