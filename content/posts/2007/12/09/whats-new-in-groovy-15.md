---
title: "What's new in Groovy 1.5"
date: 2007-12-09T16:00:40+01:00
tags:
- groovy
canonical: "https://www.infoq.com/articles/groovy-1.5-new/"
---

[Groovy](http://groovy.codehaus.org/), the Java-like dynamic language for the JVM, matures over time like good wines. After the successful release of Groovy 1.0 in January 2007, the next major milestone with the 1.5 label already hits the shelves. With it, come several interesting novelties that we will examine in this article. The major addition to the language is the support of Java 5 features with annotations, generics and enums, making Groovy **the sole alternative dynamic language for the JVM fully supporting frameworks like Spring, Hibernate, JPA**, Google Guice, or TestNG. Apart from the new Java 5 features, a few syntax enhancements find their way in the language, as well as a more powerful dynamic behavior customization, a Swing UI builder on steroids, and improved tooling support.

## A groovier Groovy and why it matters

Groovy's key selling point has always been its **seamless integration with Java**. You can mix and match Groovy and Java classes together in very easy ways: You may have a Groovy class extending a Java class implementing a Groovy interface, and vice versa. Most of the other alternative JVM languages unfortunately won't let you seamlessly interchange classes of two different languages. So if you want to use the best language for the job without compromising your nice class hierarchy, you won't have many options to choose from, and Groovy gives you all the freedom for integrating both languages in the most transparent way.

Groovy shares the same libraries, the same object model, the same threading model, and the same security model as Java. In a way, you can consider Groovy as an implementation detail of your Java project, **without having to bear problematic impedance mismatch issues**.

Groovy is Java, and Groovy makes Java groovier. Compared with other languages, Groovy is certainly the language that provides the **flattest learning curve to Java developers**, thanks to a very similar syntax.

This is even more important to keep in mind that Groovy generates normal Java bytecode and uses the usual JDK libraries, so you won't need to learn whole new APIs or have complex integration mechanisms: out of the box, Groovy and Java are interchangeable. The added benefit is that you can **protect the investment** you made in Java **skills for your developers**, or in **costly application servers**, or third party or **home-grown libraries**, as you can reuse all of them without a problem from Groovy.

Speaking of calling into JDK, third party, or in-house libraries, alternative languages which don't support strong typing, can't always call all Java methods because of the fact they can't choose a certain polymorphic variation of the same method. When choosing an alternative language to improve your productivity or make your code more readable, if you need to call other Java classes, you will have to be very careful to the choice of language you will make, as you may encounter some road blocks along the way.

These days, all major Enterprise frameworks require the use of features like annotations, enums or generics, to be leveraged at their fullest extent. Fortunately, with Groovy 1.5, developers can benefit from the support of all these Java 5 features in their projects. Let's see how annotations, enums and generics can be used from Groovy.

## Java 5 additions

The Groovy compiler always generates Java bytecode which is compatible with older Java VMs, but relies on JDK 1.4 for the core libraries it is using. However, for certain of these Java 5 additions, using Java 5 bytecode was required, so that, for example, the generated classes may contain the bytecode information representing annotations with runtime retention policy. So although Groovy 1.5 can run on JDK 1.4, certain of these features will only be usable on JDK 5 - when this is the case, it will be mentioned in this article.

### Variable arguments

In Java 5, the ellipsis notation was created to denote methods with variable length arguments. With those little triple dots, Java lets users put as many parameters of the same type at the end of a method - actually, the vararg parameter is just an array of elements of that type. Varargs were already present in Groovy 1.0 - and still work with a JDK 1.4 runtime, but it is good to show how you can use them. Basically, whenever the last argument of a method is an array of objects, or a parameter declaration with a triple dot, you can pass multiple parameters to this method.

A first example will show the usage of varargs in Groovy with the ellipsis:

```groovy
int sum(int... someInts) {
    def total = 0
    for (int i = 0; i < someInts.size(); i++)
        total += someInts[i]
    return total
}

assert sum(1)       == 1
assert sum(1, 2)    == 3
assert sum(1, 2, 3) == 6
```

The assertions used in this example show how we can pass as many ints as desired. It is also interesting to see that, for more syntax compatibility with Java, the classical for loop has been added into Groovy - despite the presence of the groovier version with the in keyword that can also transparently iterate over various array or collection types.

Note that it is possible to have varargs support even with an array as last parameter by declaring the method as follows:

```groovy
int sum(int[] someInts) { /* */ }
```

This snippet is really trivial, and there are obviously more expressive ways of calculating a sum. For instance, if you have a list of numbers, you can sum all of them in a single line of code:

```groovy
assert [1, 2, 3].sum() == 6
```

Varargs in Groovy don't require JDK 5 as the underlying Java runtime, unlike annotations that we are now going to look at in the following section.

### Annotations

As shown in the [documentation of JBoss Seam](http://docs.jboss.com/seam/1.3.0.ALPHA/reference/en/html/ch10.html) which supports Groovy for writing its entities, controllers and components, annotations like `@Entity`, `@Id`, `@Override` and others can be used to decorate your beans:

```groovy
@Entity
@Name("hotel")
class Hotel implements Serializable
{
     @Id @GeneratedValue
     Long id

     @Length(max=50) @NotNull
     String name

     @Length(max=100) @NotNull
     String address

     @Length(max=40) @NotNull
     String city

     @Length(min=2, max=10) @NotNull
     String state

     @Length(min=4, max=6) @NotNull
     String zip

     @Length(min=2, max=40) @NotNull
     String country

     @Column(precision=6, scale=2)
     BigDecimal price

     @Override
     String toString() {
         return "Hotel(${name}, ${address}, ${city}, ${zip})"
     }
}
```

The Hotel entity is marked with the @Entity annotation, and it's given a name through @Name. Different parameters can be passed to your annotations like in the @Length annotation constraint where different upper and lower bound can be set for validation purpose. You can also notice **Groovy properties** in action: Where are all the getters and setters? Where are the public or private modifiers? You don't have to wait for Java 7 or 8 to get properties! By convention, defining a property is as simple as String country: a private country field will be auto-generated, as well as a public getter and setter. **Your code becomes naturally more concise and readable**.

Annotations can be used on classes, fields, methods and method parameters, like in Java. There are, however, two gotchas to be aware of. Firstly, you can use annotations in Groovy, but you cannot yet define them - however, it will be possible in an upcoming version of Groovy. Secondly, although the syntax is almost 100% the same as in Java, there is a little difference when an array of values is passed in parameter of the annotation: instead of curly braces to surround the elements, Groovy requires the use of square brackets to offer a more homogeneous syntax - since Groovy lists and arrays use square brackets to surround their elements as well.

With annotations in Groovy 1.5, you can easily define your [JPA or Hibernate annotated beans](http://www.curious-creature.org/2007/03/25/persistence-made-easy-with-groovy-and-jpa/) in Groovy, add an @Transactional annotation on your Spring services, test your Swing UI with TestNG and [Fest](http://www.jroller.com/aalmiray/entry/testing_groovy_uis_with_fest). All the useful and powerful enterprise frameworks leveraging annotations can be used from your Groovy-powered projects.

### Enums

Whenever you need a fixed set of constants of a same type, Enums come in handy. Say you need a clean way to define constants for days without resorting to using integer constants? Then Enums are your friend. The following snippet shows how to define the days of the week:

```groovy
enum Day {
     SUNDAY, MONDAY, TUESDAY, WEDNESDAY,
     THURSDAY, FRIDAY, SATURDAY
}
```

Once you have defined your enum, you can use it as in Java with the usual notation `Day.MONDAY` and you can spice up your `switch` / `case` statements with it as well:

```groovy
def today = Day.SATURDAY
switch (today) {
     // Saturday or Sunday
     case [Day.SATURDAY, Day.SUNDAY]:
         println "Weekends are cool"
         break
     // a day between Monday and Friday
     case Day.MONDAY..Day.FRIDAY:
         println "Boring work day"
         break
     default:
         println "Are you sure this is a valid day?"
}
```

Notice that Groovy's `switch` is a bit more powerful than C-like languages switches in that it is possible to use any kind of object in the switch and case. Instead of stacking up seven different case block with each enumerated value, you can regroup them in lists or ranges: whenever the value is in the list or the range, the case will be true and its associated instructions will be executed.

A more complex example inspired by the Java tutorial takes a more astronomical perspective on enums, and shows how your enums can have properties, constructors and methods:

```groovy
enum Planet {
     MERCURY (3.303e+23, 2.4397e6),
     VENUS   (4.869e+24, 6.0518e6),
     EARTH   (5.976e+24, 6.37814e6),
     MARS    (6.421e+23, 3.3972e6),
     JUPITER (1.9e+27,   7.1492e7),
     SATURN  (5.688e+26, 6.0268e7),
     URANUS  (8.686e+25, 2.5559e7),
     NEPTUNE (1.024e+26, 2.4746e7)

     double mass
     double radius

     Planet(double mass, double radius) {
         this.mass = mass;
         this.radius = radius;
     }

     void printMe() {
         println "${name()} has a mass of ${mass} " +
                 "and a radius of ${radius}"
     }
}
Planet.EARTH.printMe()
```

Like annotations, enums in Groovy require a JDK 5+ to run on, as Java 5 bytecode is generated.

### Static imports

In our previous examples of enums, we always had to prefix the enumerated value with its parent enum class, but thanks to static imports (which work even on a JDK 1.4 runtime) we can save some characters by dropping the Planet prefix:

```groovy
import static Planet.*

SATURN.printMe()
```

No more Planet prefix. But of course, static imports aren't only available for enums, but also work for other classes and static fields. What about doing some math?

```groovy
import static java.lang.Math.*

assert sin(PI / 6) + cos(PI / 3) == 1
```

Both the static methods of `java.lang.Math` and its static constants were statically imported to make the expression more concise. But if the abbreviations of sine and cosine are not readable for you, you can use aliasing in Groovy with the as keyword:

```groovy
import static java.lang.Math.PI
import static java.lang.Math.sin as sine
import static java.lang.Math.cos as cosine

assert sine(PI / 6) + cosine(PI / 3) == 1
```

Aliasing also works with normal imports too, not just static imports, and it can be pretty handy for adding some shortcut notation to very long class names as found in many frameworks, or for renaming methods or constants with non-obvious names, or not following your naming convention standards.

### Generics

A somewhat more controversial feature of Java 5 also finds its way in the latest release of Groovy 1.5 with Generics. Initially, it may feel odd to add even more typing information to a dynamic language, after all. Java developers usually believe that because of type erasure (for backward compatibility reasons with older versions of Java) no information is left in the class bytecode to represent the generic type. However, this is wrong, since through the reflection API, you are able to introspect a class to discover the types of its fields or of its methods arguments with the generics details.

So for instance, when you declare of field of type `List<String>`, somewhere in the bytecode, this information is kept in the form of some meta-information, although this field is really just of type `List`. This kind of reflexive information is used by enterprise frameworks like JPA or Hibernate to be able to relate a collection of elements from an entity to the entity representing the type of these elements.

To put this into practice, let us check if the generics information is kept on class fields:

```groovy
class Talk {
     String title
}

class Speaker {
     String name
     List<Talk> talks = []
}

def me = new Speaker(
     name: 'Guillaume Laforge',
     talks: [
         new Talk(title: 'Groovy'),
         new Talk(title: 'Grails')
     ])

def talksField =  me.class.getDeclaredField('talks')
assert talksField.genericType.toString() ==
    'java.util.Listt<Talk>'
```

We defined two classes: a Speaker class giving Talks at conferences. In the Speaker class, the talks property is of type `List<Talk>`. Then, we create a Speaker instance with two nice shortcuts for initializing the name and talks properties, and for creating a list of Talk instances. Once this setup code is ready, we retrieve the field representing the talks, and we check that the generic type information is correct: yes, `talks` is a `List`, but a `List` of `Talks`.

### Covariant return types

In Java 5, if you have a method in a subclass with the same name and parameter types as in a parent class, but with a return type derived from the parent method's return type, then we can override the parent method. In Groovy 1.0, covariant return types were not supported. But in Groovy 1.5, you can use them. Additionally, if you are trying to override a method with a return type not deriving from the parent class method's return type, a compilation error will be thrown. Covariant return types also work with parameterized types.

Beyond the support of Java 5 features which brought a few additions to the language, a few other syntax enhancements have been introduced in Groovy 1.5, and we are going to discover them in the following section.

## Syntax additions

### Elvis operator

Apart from the Java 5 features that brought annotations, generics and enums into Groovy, a new operator finds its way into the language: ?: the Elvis operator. When you see the operator in question, you will easily guessed why it was nicknamed that way - if not, think in terms of Smiley. This new operator is, in fact, a shortcut notation for the ternary operator. How many times are you using the ternary operator to change the value of a variable if its content is null to assign it some default value? The typical case in Java is as follows:

```groovy
String name = "Guillaume";
String displayName = name != null ? name : "Unknown";
```

In Groovy, since the language is able to "coerce" types to boolean values as needed (for instance where conditional expressions are required like in if or while constructs), in this statement, we can omit the comparison to null, because when a String is null, it is coerced to false, so in Groovy, the statement would become:

```groovy
String name = "Guillaume"
String displayName = name ? name : "Unknown"
```

However, you will still notice the repetition of the name variable, which would violate the DRY principle (Don't Repeat Yourself). As this construct is pretty common, the Elvis operator was introduced to simplify such recurring cases, and the statements become:

```groovy
String name = "Guillaume"
String displayName = name ?: "Unknown"
```

The second occurrence of the name variable is simply omitted and the ternary operator is no more ternary and is shortened to this more concise form.

It is also worth noticing that there are no side effects to this new construct, since the first element (here the name) is not evaluated twice as it would be the case with the ternary operator, so there's no need to introduce some intermediate temporary value to hold the result of the first evaluation of the first element of the ternary operator.

### Classical for loop

Although Groovy is not strictly speaking a 100% superset of Java, the Groovy syntax comes closer to the Java syntax after each release, and more and more Java code is also valid Groovy. The net benefit of this is that when you begin with Groovy, you can copy and paste Java code in your Groovy classes, and this should just work as expected. Then, over time, as you learn the language, you start throwing away the semi-colons which are not mandatory in Groovy, using GStrings (interpolated strings), or closures, etc. Groovy offers a rather flat learning curve to Java developers.

However, there was one omission to this Java-syntax compatibility in the fact the classical `for` loop inherited from Java's C background wasn't allowed in Groovy. Initially, the Groovy developers thought it was not the nicest syntax of all and preferred using the `for` / `in` construct which was more readable. But as the Groovy users regularly asked for this old construct to be also part of Groovy, the team decided to bring it back to Groovy.

With Groovy 1.5, you can either chose the Groovy `for` / `in`, or prefer the classical for loop:

```groovy
for (i in 0..9)
     println i

for (int i = 0; i < 10; i++)
     println i
```

At the end of the day, it is probably more a matter of taste, and long time Groovy users usually prefer the most concise syntax with the `for` / `in` loop instead.

### Named parameters without parenthesis

With its malleable and concise syntax, and its advanced dynamic capabilities, **Groovy is an ideal choice for implementing internal Domain-Specific Languages**. When you want to share a common metaphor between subject matter experts and developers, you can leverage Groovy to create a dedicated business language which models the key concept and business rules of your application. An important aspect of these DSLs is to make the code very readable, and also easier to write by non-technical persons. To achieve this goal even further, the grammar of the language was tweaked to allow us to use named parameters without the surrounding parenthesis.

First of all, in Groovy, named parameters look like this:

```groovy
fund.compare(to: benchmarkFund, in: euros)
compare(fund: someFund, to: benchmark, in: euros)
```

By adding new properties to numbers — which is possible in Groovy but beyond the scope of this article - we can also write code like this:

```groovy
monster.move(left: 3.meters, at: 5.mph)
```

Now by omitting parenthesis, the code can become a little clearer as shown below:

```groovy
fund.compare to: benchmarkFund, in: euros
compare fund: someFund, to: benchmark, in: euros
monster.move left: 3.meters, at: 5.mph
```

Obviously, this is not a big difference, but each statement becomes closer to real plain English sentences, and removes the usual boiler-plate technical code of the host language. This little enhancement of the grammar of the Groovy language gives more options to the designers of the business DSL.

## Improved tooling support

A common show-stopper when Groovy was a young language, was the lack of good tooling support: both the tool chain and the IDE support weren't up to the task. Fortunately, with the maturity and success of Groovy and the Grails web framework, this situation has changed.

## Introduction of the "joint" compiler

Groovy is well-known for its transparent and seamless integration with Java. But this is not just about being able to call Java methods from Groovy scripts, no, the integration between both languages goes well beyond that. For instance, it is totally possible to have a Groovy class extending a Java class which in turns implements a Groovy interface, or vice versa. This is something other alternative languages don't alway support, unfortunately. However, when mixing Groovy and Java classes together, so far, you had to be careful when compiling both type of classes by cleverly choosing the order of compilation, and when cyclic dependencies were spanning both languages, you may have hit a "chicken and egg" problem. Fortunately with Groovy 1.5, this is not the case anymore, and thanks to a contribution from JetBrains, the makers of the award winning [Java IDE IntelliJ IDEA](http://www.jetbrains/idea/), a "joint" compiler is available with which you can compile both Groovy and Java sources together in one go without having to think about dependencies between classes.

If you want to use the joint compiler from the command-line, you can call the groovyc command as usual, but specify the -j flag which will enable the joint compilation:

```bash
groovyc *.groovy *.java -j -Jsource=1.4 -Jtarget=1.4
```

For passing parameters to the underlying javac command, you can prefix the flags with the J prefix. You can also use the joint compiler through its Ant task from you Ant or Maven build files:

```xml
<taskdef name="groovyc"
         classname="org.codehaus.groovy.ant.Groovyc"
         classpathref="my.classpath"/>

<groovyc
     srcdir="${mainSourceDirectory}"
     destdir="${mainClassesDirectory}"
     classpathref="my.classpath"
     jointCompilationOptions="-j -Jsource=1.4 -Jtarget=1.4" />
```

### Maven plugin for Groovy

For the Maven users, there is also a fully featured Maven plugin hosted at Codehaus which allows you to build your Java / Groovy applications: compile your Groovy and Java code, generate documentation from the JavaDoc tags, or it even lets you write your own Maven plugins in Groovy. There is also a Maven archetype to bootstrap your Groovy project more rapidly. For more information, you may have a look at the documentation of the plugin: <http://mojo.codehaus.org/groovy/index.html>

### The GroovyDoc documentation tool

As a Java developer, you are used to documenting your code through JavaDoc tags in the comments of your classes, interfaces, fields, or methods. In Groovy, you can also use such tags in your comments, and have them being used by a tool called GroovyDoc to generate the equivalent JavaDoc documentation for all your Groovy classes.

There's an Ant task you can define then use to generate the documentation as follows:

```xml
<taskdef name="groovydoc"
     classname="org.codehaus.groovy.ant.Groovydoc">
     <classpath>
        <path path="${mainClassesDirectory}"/>
        <path refid="compilePath"/>
     </classpath>
</taskdef>

<groovydoc
     destdir="${docsDirectory}/gapi"
     sourcepath="${mainSourceDirectory}"
     packagenames="**.*" use="true"
     windowtitle="Groovydoc" private="false"/>
```

## New interactive shell and the Swing console

Groovy distributions always contained two different shells: a command-line shell as well as a Swing console. Groovysh, the command-line shell, has never been very friendly in terms of interactions with its user: whenever you wanted to execute a statement, you had to type 'go' or 'execute' after each one, so that it got executed. For quick prototyping or playing with some new API, typing 'go' each time was very cumbersome. The situation has changed in Groovy 1.5, since a new interactive shell is born. No need to type 'go' anymore.

This new shell features several enhancements, such as the use of the JLine library which provides ANSI coloring, tab completion for commands, line editing capabilities. You can work with different script buffers, remember already imported classes, load existing scripts, save the current script to a file, browse the history, etc. For detailed explanations of the supported features, please have a look at the [documentation](http://groovy.codehaus.org/Groovy+Shel).

The command-line shell isn't the only one that received some care, the Swing console has also been improved, with a new toolbar, with advanced undo capabilities, the possibility to increase or decrease the font size, syntax highlighting. A lot of polishing has been applied to the console.

### IntelliJ IDEA JetGroovy plugin

I will save the best of tooling support till the end of this section by mentioning the JetGroovy plugin: a free and Open Source IntelliJ IDEA plugin dedicated to the support of both Groovy and Grails. This plugin has been developed by JetBrains themselves, and provides unmatched support for both the language and the web framework.

To list a few of the available features of the Groovy support:

-   **Syntax highlighting** for all the syntax, plus different warnings for types not recognized, or when static type information is not known to help spot potential errors.
-   Ability to **run Groovy classes, scripts and JUnit test cases written in Groovy**.
-   **Debugger**: You can debug step by step across your Java and Groovy code, set breakpoints, show variables, the current stack, etc.
-   Joint compiler: the compiler **compiles both Groovy and Java** classes together and is able to resolve dependencies between both languages.
-   **Code completion** for packages, classes, properties, fields, variables, methods, keywords, and even specific support for the Swing UI builder.
-   Advanced class search and find usage.
-   **Refactorings**: most of the usual refactorings you've come to love in Java are available as well and work across Java and Groovy, like "surround with", introduce, inline or rename a variable, renaming for packages, classes, methods, and fields.
-   **Imports optimizations and code formatting**.
-   Structure view: to have a bird's eye view of your classes.

At the end of the day, you won't even notice whether you're developing a class in Groovy or in Java, considering the level of interplay and support offered inside IntelliJ IDEA. This is definitely a plugin to install if you're considering adding some dose of Groovy in your Java project, or if you plan to develop Grails applications.

More information can be found on [JetBrains website](http://www.jetbrains.net/confluence/display/GRVY/Groovy+Home).

Although I'm only mentioning the plugin for IntelliJ IDEA, for your Groovy developments, you don't have to change your habits. You can also use the Eclipse plugin which is regularly improved by the IBM Project Zero developers, or Sun's brand new support of Groovy and Grails in NetBeans.

## Performance improvements

Along with new features, this new release of Groovy brings noticeable performance improvements as well as lower memory consumption, compared to previous versions. In our informal benchmarks measuring the duration of all our test suites, we noticed speed improvements between 15% to 45% compared with our beta versions of Groovy 1.5 - and certainly higher figures can be expected by comparing with the now old Groovy 1.0. More formal benchmarks have yet to be developed, but those figures have also been confirmed by developers from an insurance company that is using Groovy to write the business rules of their policy risk calculation engine, and from another company who ran several tests on highly parallel machines. Overall, Groovy 1.5 should be faster and leaner in most situations. Your mileage may vary depending on your own context of usage of Groovy.

## Enhanced dynamic capabilities

Through the symbiotic relationships between the Groovy and Grails projects, new dynamic capabilities have been introduced in Groovy, after having matured in the heart of Grails.

Groovy is a dynamic language: put simply, it means that certain things like method dispatch happens at runtime, instead of at compile-time as it is the case of Java and other languages. There is a specific runtime system, called the MOP (stands for Meta-Object Protocol) that is responsible for the dispatching logic. Fortunately, this runtime system is open enough so that people can hook into the system and change its usual behavior. For each Java class and for each Groovy instance, there is an associated meta-class which represents this runtime behavior of your objects. Groovy offered various ways to interact with the MOP by defining custom meta-classes by extending some base class, but thanks to the contribution from the Grails project, a groovier kind of meta-class is available: the expando meta-class.

Again,code samples are easier to help us understand the concept. In the following example, the `msg` String instance has got a meta-class that we can access through the metaClass property. Then we change the meta-class of the `String` class to add a new method called up to the String class, to have a shortcut notation for the `toUpperCase()` method. To do so, we assign a closure to the up property of the meta-class which is created as we assign it the closure. This closure takes no argument (hence why it starts with an arrow), and we call the `toUpperCase()` method on the delegate of the closure, which is a special closure variable which represents the real object (here the String instance).

```groovy
def msg = "Hello!"
println msg.metaClass

String.metaClass.up = { -> delegate.toUpperCase() }
assert "HELLO!" == msg.up()
```

Through this meta-class, you can query the methods and/or properties which are available:

```groovy
// print all the methods
obj.metaClass.methods.each { println it.name }
// print all the properties
obj.metaClass.properties.each { println it.name }
```

You can even check that a certain method or property is available, with a finer granularity than through any instanceof check:

```groovy
def msg = 'Hello!'
if (msg.metaClass.respondsTo(msg, 'toUpperCase')) {
    println msg.toUpperCase()
}

if (msg.metaClass.hasProperty(msg, 'bytes')) {
    println  foo.bytes.encodeBase64()
}
```

These mechanisms are extensively used in the Grails web framework for instance to create dynamic finders: no need for DAOs in most circumstances, as you are able to call a `findByTitle()` dynamic method on a Book domain class. Through meta-classes, Grails automatically decorates the domain classes with such methods. Furthermore, if the method doesn't exist yet, it will be created and cached on first use. This can be accomplished by other advanced hooks as explained below.

Beyond those examples we've seen so far, expando meta-classes also provide some complementary hooks. Four other kind of methods can be added to an expando meta-class:

-   `invokeMethod()` lets you intercept all methods calls,
-   while `methodMissing()` will be called on last resort only of no other method is found.
-   `get`/`setProperty()` intercepts access to all properties,
-   whereas `propertyMissing()` is called when no property can be found.

With expando meta-classes, customizing the behavior of the types of your application becomes easier and can save precious time of development compared with the previous version of Groovy. Obviously, not everybody needs to use those techniques, but they can be handy in a number of situations where you want to apply some AOP (Aspect Oriented Techniques) to decorate your classes, and when you want to simplify and make more readable the business code of your application, by removing some unnecessary boiler-plate code.

## Swing on steroids

The Groovy project has the chance to have a team of talented Swing developers who worked hard to enhance the capabilities of Groovy to build user interfaces in Swing. The basic brick for building Swing UIs in Groovy is the SwingBuilder class: at a syntactical level in your source, you can visually see how Swing components are nested within each other. A simplistic example from the Groovy website shows how to simply create a little GUI:

```groovy
import groovy.swing.SwingBuilder
import java.awt.BorderLayout

import groovy.swing.SwingBuilder
import java.awt.BorderLayout as BL

def swing = new SwingBuilder()
count = 0
def textlabel
def frame = swing.frame(title:'Frame', size:[300,300]) {
    borderLayout()
    textlabel = label(text:"Clicked ${count} time(s).",
                      constraints: BL.NORTH)
    button(text:'Click Me',
              actionPerformed: {count++; textlabel.text =
              "Clicked ${count} time(s)."; println "clicked"},
              constraints:BorderLayout.SOUTH)
}
frame.pack()
frame.show()
```

In the novelties, the Swing builder concept has been extend to provide custom component factories. There are additional modules, not bundled with Groovy by default, which integrates the Swing components from JIDE or from the SwingX project into the usual Swing builder code.

Although this topic would deserve a full article, I'm only going to list some of the other improvements in this release, for instance, the `bind()` method. Inspired by the beans binding JSR (JSR-295), you can easily bind components or beans together to have them react upon changes made on each other. In the following example, the size of the insets of the button will be changed according to the value of the slider component:

```groovy
import groovy.swing.SwingBuilder
import java.awt.Insets

swing = new SwingBuilder()
frame = swing.frame {
     vbox {
        slider(id: 'slider', value:5)
        button('Big Button?!', margin:
             **bind(source: slider,
                  sourceProperty:'value',
                  converter: { [it, it, it, it] as Insets }))
     }
}
frame.pack()
frame.size = [frame.width + 200, frame.height + 200]
frame.show()
```

Binding components together is such a common task when building user interfaces, that this task has been simplified through this binding mechanism. There are also some other automatic binding options that can be used, but again, a dedicated article would probably be better.

In other new and noteworthy features, a few handy new methods have been added which leverage closures to call the infamous `SwingUtilities` class, and to start new threads: `edt()` will call `invokeAndWait()`, while `doLater()` will call `invokeLater()`, and `doOutside()` will just launch a closure in a new thread. No more ugly anonymous inner classes: just use closures through those shortcut methods!

Last but not least, separating the description of the view and its associated behavior logic has never been easier, thanks to the `build()` method on `SwingBuilder`. You can create a separate script which only contains the view, while the interactions or bindings between components are in the main class, making a clearer separation in the MVC model.

## Summary

In this article, the new and noteworthy features have been outlined, but we have barely scratched the surface of this new version of Groovy. The big highlights are mainly around the new Java 5 features, such as annotations, enums or generics: it makes Groovy perfectly capable of being integrated nicely and seamlessly with Enterprise frameworks such as Spring, Hibernate, or JPA. With the improvements in the syntax and with the enhanced dynamic capabilities, Groovy will let you customize your business logic by creating embedded Domain-Specific Languages, that you can easily integrate at the extension points of your application. The developer experience has progressed significantly through the work poured in the tooling support, this is no more a show stopper to the adoption of Groovy. Overall, with Groovy 1.5, the goal of simplifying the life of developers has never been so well fulfilled, and Groovy should definitely be part of all the Java developers' toolbox.