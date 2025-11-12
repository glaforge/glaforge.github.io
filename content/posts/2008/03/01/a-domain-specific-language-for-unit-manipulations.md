---
title: "A Domain-Specific Language for unit manipulations"
date: 2008-03-01T00:20:00.000+01:00
tags: [dsl, groovy]

similar:
  - "posts/2009/02/27/whats-new-in-groovy-16.md"
  - "posts/2010/08/31/nicer-dsls-in-groovy-1-8-thanks-to-extended-command-expressions.md"
  - "posts/2006/04/18/builders-in-dynamic-languages.md"
---

Domain-Specific Languages are a hot topic, and have been popularized by languages like [Groovy](http://groovy.codehaus.org/) and Ruby thanks to their malleable syntax which make them a great fit for this purpose. In particular, **Groovy allows you to create internal DSLs**: business languages hosted by Groovy. In a recent research work, Tiago Antão has [decided to use Groovy](http://tiago.org/ps/2008/02/24/groovyscalarubypython-on-jvm/) to **model the resistance to drugs against the Malaria disease**. In two blog posts, Tiago explains some of the [tactics he used](http://tiago.org/ps/2008/02/25/dsl-tactics-in-groovy-1many/), and how to [put them together](http://tiago.org/ps/2008/02/27/chloroquine-malaria-treatment-and-groovy-dsl-tactics-in-groovy-2/) to create a mini-language for health related studies. In this work, he needed to represent quantities of medecine, like 300 miligram of Chloroquinine, a drug used against Malaria. Groovy lets you add properties to numbers, and you can represent such quantities with just `300.mg`. Inspired by this idea, the purpose of this article is to examine how to build a mini-DSL for manipulating measures and units by leveraging the [JScience library](http://www.jscience.org/).

First of all, let's speak about JScience. JScience is a Java library leveraging generics to represent various measurable quantities. JScience is also the Reference Implementation for [JSR-275: javax.measure.\*](http://www.jcp.org/en/jsr/detail?id=275). Whether it is for measuring mass, length, time, amperes or volts (and many more), the calculations you can do are type-safe and checked at compile-time: you cannot add a second to a kilogram, your program wouldn't compile. This is definitely one of the strength of the library. However fluent the library is, the notation used to represent an amount of some unit is still not as readable as scientist could wish.

How do you represent a mass with JScience?

```java
import static javax.measure.unit.SI.*;
import javax.measure.*;
import org.jscience.physics.amount.*;

// ...

Amount m3 = Amount.valueOf(3, KILO(GRAM));
Amount m2 = Amount.valueOf("2 kg");
Amount sum = m3.plus(m2);
```

The first expression leverages static imports to represent the [KILO](http://jscience.org/api/javax/measure/unit/SI.html#KILO(javax.measure.unit.Unit)) ([GRAM](http://jscience.org/api/javax/measure/unit/SI.html#GRAM)) unit, while the second simply parses the mass from a String. The last line does just an addition between the two masses. Still, it doesn't look like what a physicist would write. Wouldn't we want to use a mathematical notation, like `3 kg + 2 kg`? We will see how you can do this in Groovy.

Our first step will be to add units to numbers. We can't write `2 kg`, as it's not valid Groovy, instead, we'll write `2.kg`. To so, we'll add some dynamic properties to numbers, thanks to the [ExpandoMetaClass](http://groovy.codehaus.org/ExpandoMetaClass)mechanism.

```groovy
import javax.measure.unit.*
import org.jscience.physics.amount.*

// Allow ExpandoMetaClass to traverse class hierarchies
// That way, properties added to Number will also be available for Integer or BigDecimal, etc.
ExpandoMetaClass.enableGlobally()

// transform number properties into an mount of a given unit represented by the property
Number.metaClass.getProperty = { String symbol -> Amount.valueOf(delegate, Unit.valueOf(symbol)) }

// sample units
println( 2.kg )
println( 3.m )
println( 4.5.in )    
```

See how we created kilograms, meters and inches? The "metaclass" is what represents the runtime behavior of a class. When assigning a [closure](http://groovy.codehaus.org/Closures) to the getProperty property, all the requests for properties on Numbers will be rooted to this closure. This closure then uses the JScience classes to create a Unit and an Amout. The delegate variable that you see in this closure represents the current number on which the properties are accessed.

Okay, fine, but at some point, you'll need to multiply these amounts by some factor, or you will want to add to lengths together. So we'll need to do leverage Groovy's [operator overloading](http://groovy.codehaus.org/Operator+Overloading) to do some arithmetics. Whenever you have methods like multiply(), plus(), minus(), div(), or power(), Groovy will allow you to use the operators \*, +, -, /, or \*\*. Some of the conventions for certain of these operations being a bit different from those of Groovy, we have to add some new operator methods for certain of these operations:

```groovy
// define opeartor overloading, as JScience doesn't use the same operation names as Groovy
Amount.metaClass.multiply = { Number factor -> delegate.times(factor) }
Number.metaClass.multiply = { Amount amount -> amount.times(delegate) }
Number.metaClass.div = { Amount amount -> amount.inverse().times(delegate) }
Amount.metaClass.div = { Number factor -> delegate.divide(factor) }
Amount.metaClass.div = { Amount factor -> delegate.divide(factor) }
Amount.metaClass.power = { Number factor -> delegate.pow(factor) }
Amount.metaClass.negative = { -> delegate.opposite() }

// arithmetics: multiply, divide, addition, substraction, power
println( 18.4.kg * 2 )
println( 1800000.kg / 3 )
println( 1.kg * 2 + 3.kg / 4 )
println( 3.cm + 12.m * 3 - 1.km )
println( 1.5.h + 33.s - 12.min )
println( 30.m**2 - 100.ft**2 )

// opposite and comparison
println( -3.h )
println( 3.h < 4.h )
```

We can also do comparisons, as shown on the last line above, since these types are comparable. Again, free of charge. Something we have covered yet is compound units, such as speed, which is a mix of a distance and a duration. So, if you wanted to use a speed limit, you would like to write `90.km/h` but our DSL in its current state would only allow you to write `90.km/1.h`, which doesn't really look nice. To circumvent this issue, we could create as many variables as units. We could have a `h` variable, a `km` variable, etc. But I'd prefer something more _automatic_, by letting the script itself provide these units. In Groovy scripts, you can have local variables (whenever you define a variable, it's a local variable), but you can also pass or access variables through a binding. This is a convenient way to pass data around when you integrate Groovy inside a Java application, for instance, to share a certain context of data. We are going to create a new Binding called UnitBinding which will override the `getVariable()` method, so that all non-local variables which are used withing the Groovy script are looked up in this binding. You'll notice a special treatment for the variable 'out', which is where the `println()` method looks for for the output stream to use.

```groovy
// script binding to transform free standing unit reference like 'm', 'h', etc
class UnitBinding extends Binding {
    def getVariable(String symbol) {
        if (symbol == 'out') return System.out
        return Amount.valueOf(1, Unit.valueOf(symbol)) 
    }
}

// use the script binding for retrieving unit references
binding = new UnitBinding()

// inverse units
println( 30.km/h + 2.m/s * 2 )
println( 3 * 3.mg/L )
println( 1/2.s - 2.Hz )
```

The velocity now looks much more like the mathematical notation everybody would use. Now that all this magic is done, there's still one last thing we could do. Sometimes, you may want to convert different units, like feet and meters or inches and centimers. So, as the last step of our units DSL experiments, we'll add a `to()` method to do convertions.

```groovy
// define to() method for unit conversion
Amount.metaClass.to = { Amount amount -> delegate.to(amount.unit) }

// unit conversion
println( 200.cm.to(ft) )
println( 1.in.to(cm) )
```

At this point, we are able to easily manipulate amounts of any unit in a very convenient and natural notation. The _magic_ trick of adding properties to numbers makes the process of creating a unit DSL straightforward. This DSL is just a small part of the equation, as you may certainly want to represent other business related concepts, but this article will have shown you how to decorate a powerful existing library, so that the code becomes more natural to use by the end users of your DSL. In further articles, we'll discover some other tricks! Stay tuned!