---
title: "Both Groovy 1.5.7 and 1.6-beta-2 are out!"
date: "2008-10-09T00:00:00.000+02:00"
tags: [groovy]
---

This is with great pleasure that the Groovy development team and [G2One](http://www.g2one.com/) announce the **joint release of both Groovy 1.5.7** -- current stable and maintenance branch -- and **Groovy 1.6-beta-2** -- the upcoming major release.  
  
Groovy 1.5.7 contains mainly bug fixes (61 bug fixes), but also some minor API improvements (20 improvements) backported from the1.6 branch, whereas Groovy 1.6-beta-2 brings a wealth of novelty (68 bug fixes and 38 improvements and new features). Here, we'll mainly cover the new features of beta-2.  
  
Following up on our major compile-time and runtime performance improvements in beta-1, we continued our efforts in that area for beta-2. But you'll also be interested in discovering the changes and new features brought by this new release.  
  
## Multiple Assignments  
  
In beta-1, we introduced the possibility to define multiple assignments. However, we faced some issues and ambiguities with the subscript notation, so we adapted the syntax slightly by using parentheses instead of square brackets. We also now cover all the assignment use cases, which wasn't the case previously.  
  
You can define and assign several variables at once:  
  
```groovy
def (a, b) = [1,2]  
assert a == 1  
assert b == 2  
```
  
And you can also define the types of the variables in one shot as follows:  
  
```groovy
def (int i, String j) = [1, 'Groovy']  
```
  
For the assignment (without priori definition of the variables), just don't use the 'def' keyword:  
  
```groovy
def a, b  
(a, b) = functionReturningAList()  
```
  
Otherwise, apart from the syntax change, the behavior is the same as in beta-1: if the list on the right-hand side contains more elements than the number of variables on the left-hand side, only the first elements will be assigned in order into the variables. Also, when there are less elements than variables, the extra variables will be assigned null.  
  
## Optional return for if/else and try/catch/finally blocks  
  
Although not a syntax change, but at least a new behavior: it is now possible for `if`/`else` and `try`/`catch`/`finally` blocks to return a value. No need to explicitly use the `return` keyword inside these constructs, as long as they are the latest statement in the block of code.  
  
As an example, the following method will return 1, although the `return` keyword was omitted.  

```groovy
 def method() {  
    if (true) 1 else 0  
 }  
```
  
You can have a look at our [test case](http://fisheye.codehaus.org/browse/~raw,r=13627/groovy/trunk/groovy/groovy-core/src/test/groovy/lang/SynteticReturnTest.groovy) to have an overview of this new behavior.  
  
## AST Transformations  
  
Although at times, it may sound like a good idea to extend the syntax of Groovy to implement new features (like this is the case for instance for multiple assignments), most of the time, we can't just add a new keyword to the grammar, or create some new syntax construct to represent a new concept. However, with the idea of AST (Abstract Syntax Tree) Transformations initiated and introduced in beta-1, we are able to tackle new and innovative ideas without necessary grammar changes.  
  
With AST Transformations, people can hook into the compiler to make some changes to the AST in order to change the program that is being compiled. AST Transformations provides Groovy with improved compile-time metaprogramming capabilities allowing powerful flexibility at the language level, without a runtime performance penalty.  
  
In beta-1, two AST Transformations found their way in the release, pioneered by our talented Groovy Swing team. With the @Bindable transformation marker annotation, property listeners are transparently added to the class for the property that is being annotated. Sames goes for the @Vetoable annotation for vetoing property changes.  
  
In beta-2, new transformations have been created:  

*   `@Singleton` to transform a class into a singleton ([example](http://fisheye.codehaus.org/browse/~raw,r=13529/groovy/trunk/groovy/groovy-core/src/test/org/codehaus/groovy/transform/vm5/GlobalTransformTest.groovy))
*   `@Immutable` to forbid changes to an instance once it's been created ([example](http://fisheye.codehaus.org/browse/~raw,r=13619/groovy/trunk/groovy/groovy-core/src/test/org/codehaus/groovy/transform/vm5/ImmutableTransformTest.groovy))
*   `@Delegate` transparently implement the delegation pattern ([example](http://fisheye.codehaus.org/browse/~raw,r=13592/groovy/trunk/groovy/groovy-core/src/test/org/codehaus/groovy/transform/vm5/DelegateTransformTest.groovy))
*   `@Lazy` for lazily initializing properties ([example](http://fisheye.codehaus.org/browse/~raw,r=13545/groovy/trunk/groovy/groovy-core/src/test/org/codehaus/groovy/transform/vm5/LazyTransformTest.groovy))
*   `@Category` / `@Mixin` helps mixin category methods at compile-time ([example](http://fisheye.codehaus.org/browse/~raw,r=12588/groovy/trunk/groovy/groovy-core/src/test/groovy/lang/vm5/MixinAnnotationTest.groovy))
*   `@Newify` allows to omit using the `new` keyword for creating instances, simply doing Integer(5) will create an instance, and also gives you the ability to use a Ruby-esque syntax with `Integer.new(5)`

Documentation will come on those transformations in time for the final release. In the meantime, don't hesitate to ask questions on the mailing-lists if you'd like to know more.  
  
## Swing builder  
  
The swing builder which pioneered AST transformations added support for binding to simple closures, i.e. `bean(property: bind { otherBean.property } )` is the same as `bind(source: otherBean, target: property)`. It is also a closure so you can do more complex expressions like `bean(location: bind {pos.x + ',' + pos.y} )` -- but the expression needs to stay simple enough: no loops or branching, for instance.  
  
## Grape, the adaptable / advanced packaging engine  
  
Also leveraging AST Transformations, Groovy 1.6-beta-2 provides a preview of the Groovy Advanced or Adaptable Packaging Engine. Groovy scripts can require certain libraries: by explicitly saying so in your script with the @Grab transformation or with the Grape.grab() method call, the runtime will find the needed JARs for you. With Grape, you can easily distribute scripts without their dependencies, and have them downloaded on first use of your script.  
  
For more information on Grape, please read the [documentation](http://groovy.codehaus.org/Grape).  
  
## Per instance metaclass even for POJOs  
  
So far, Groovy classes could have a per-instance metaclass, but POJOs could only have on metaclass for all instances (ie. a per-class metaclass). This is now not the case anymore, as POJOs can have per-instance metaclass too. Also, setting the metaclass property to null will restore the default metaclass.  
  
## ExpandoMetaClass DSL  
  
A new DSL for EMC was created to allow chaining the addition of new methods through EMC without the usual object.metaClass repetition. You can find some examples in our test cases again: [here](http://fisheye.codehaus.org/browse/~raw,r=12759/groovy/trunk/groovy/groovy-core/src/test/org/codehaus/groovy/runtime/PerInstanceMetaClassTest.groovy) and [there](http://fisheye.codehaus.org/browse/~raw,r=13016/groovy/trunk/groovy/groovy-core/src/test/groovy/vm5/ActorTest.groovy).  
  
## Runtime mixins  
  
One last feature I'll mention today is runtime mixins. Unlike the @Category/@Mixin combo, or even the @Delegate transformation, as their name imply, mixin behavior at runtime. You can find examples [here](http://fisheye.codehaus.org/browse/~raw,r=13119/groovy/trunk/groovy/groovy-core/src/test/groovy/lang/vm5/MixinTest.groovy), which also combine the use of the EMC DSL  
  
## Useful links  
  
You can [download both versions here](http://groovy.codehaus.org/Download), and the JARs will be available shortly on the central Maven repository.  
  
And you can read the [release notes from JIRA for 1.5.7](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&styleName=Html&version=14242) and the [release notes for 1.6-beta-2](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&styleName=Html&version=14261).  
  
## Further down the road  
  
We adapted the Groovy roadmap a little: as features which were supposed to be in 1.7 have already been implemented in 1.6, the scope of 1.7 is reduced and 1.8 is made useless, so after 1.6, we'll focus on 1.7 which will mainly bring one new major feature (the ability to define anonymous inner classes in Groovy, to bridge the small difference gap with Java), and afterwards, we'll be able to focus our energy on Groovy 2.0 improving and rewriting parts of the Groovy core to bring in even more performance and to pave the way for even more power features in future versions.  
  
We're looking forward to hearing about your feedback on those two releases.  
Thanks a lot to everybody for their help and respective contributions.