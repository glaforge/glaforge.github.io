---
title: "Groovy default params to avoid one-argument methods being called without params"
date: 2016-01-08T00:00:00.000+01:00
tags: [groovy]
---

Recently, I saw an interesting [tweet](https://twitter.com/djsmith42/status/679018096334675968), mentioning a JavaScript trick using default parameters to make a parameter mandatory.  

![](/img/misc/default-param-mandatory-javascript-trick.png)  

In a language like [Apache Groovy](http://www.groovy-lang.org), when statically compiled, you'd get a compilation error if you forgot a parameter, because the signature couldn't be found by the compiler. In dynamic mode, you'd get a runtime error though, with a MissingMethodException (and the error message should give you a hint as to which method you should actually call instead).  

But there's a particular case of the Groovy method dispatch that's a bit special (and actually something we might be removing at some point in a breaking version of the language, but it's been there since 1.0). When you have single-argument methods, you're allowed to call those methods without passing a parameter! And the parameter is filled simply with null. So you might have made a mistake in your code, forgetting to pass an actual parameter value, but you'd get neither a compilation error nor a runtime exception, but a null value.  

So I thought about that JavaScript trick, and adapted to this situation, to ensure that you can't call a one-argument method without an argument.  

```groovy
String up(String s) {
    s?.toUpperCase()
}

assert up('groovy') == 'GROOVY'

// a strange aspect of Groovy is that 
// you can call a one-argument method without passing any actual argument
// as if you were passing null, as in up(null)

assert up() == null

// let's use the JavaScript trick with mandatory default params:
// https://twitter.com/djsmith42/status/679018096334675968

String up2(String s = mandatory('s')) {
    s?.toUpperCase()
}

void mandatory(String paramName) {
    throw new Exception("Please provide an actual value for '$paramName'")
}

assert up2('groovy') == 'GROOVY'

try {
    up2()
} catch(emAll) {
    assert emAll.message == "Please provide an actual value for 's'"
}

// another approach with using a closure call as default value

String up3(String s = { -> throw new Exception("Please provide an actual value for 's'") }() ) {
    s?.toUpperCase()
}

assert up3('groovy') == 'GROOVY'

try {
    up3()
} catch(emAll) {
    assert emAll.message == "Please provide an actual value for 's'"
}
```

I've also pushed that example on the [Groovy Web Console](http://groovyconsole.appspot.com/script/5094328489738240), if you wanna play with it.