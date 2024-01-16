---
title: "Functional builder approach in Java"
date: 2024-01-16T08:33:32+01:00
image: /img/misc/construction-toys-coffee-cup.jpg
tags:
  - java
  - golang
  - design-pattern
---

In Java, builders are a pretty classical pattern for creating complex objects with lots of attributes.
A nice aspect of builders is that they help reduce the number of constructors you need to create,
in particular when not all attributes are required to be set (or if they have default values).

However, I've always found builders a bit verbose with their `newBuilder()` / `build()` method combos,
especially when you work with deeply nested object graphs, leading to lines of code of builders of builders of...

As I was chatting about those builders with my colleague [Valentin](https://www.linkedin.com/in/deleplacevalentin/),
who is a Go developer, he told me about Golang's functional builder approach.
It's not a very common implementation practice for Java builders, but it's worth revisiting!

## First, the classical builder

Let's start with an example.
We want to create a builder for a class with a few attributes.
Not all attributes are mandatory, some may have some default values,
and we don't want to create as many constructors as possible combinations of attributes.

Let me introduce you to my `SomeModel` class:

```java
public class SomeModel {
    private String modelName;
    private Float temperature = 0.3f;
    private Integer maxOutputTokens = 100;
    // ... possibly many other attribtues

    private SomeModel(String modelName,
                      Float temperature,
                      Integer maxOutputTokens) {
        this.modelName = modelName;
        this.temperature = temperature;
        this.maxOutputTokens = maxOutputTokens;
    }
}
```

Creating tons of constructors for the various model configurations can be painful.
Furthermore, some attributes can have the same type, so from a user perspective, it's hard to know which value corresponds to which parameter type.
So creating a builder can reduce that toil.

We could write a static builder class inside `SomeModel` along the lines of:

```java
public class SomeModelBuilder {
    private String modelName;
    private Float temperature = 0.3f;
    private Integer maxOutputTokens = 100;

    public SomeModelBuilder modelName(String modelName) {
        this.modelName = modelName;
        return this;
    }

    public SomeModelBuilder temperature(Float temperature) {
        this.temperature = temperature;
        return this;
    }

    public SomeModelBuilder maxOutputTokens(Integer maxOutputTokens) {
        this.maxOutputTokens = maxOutputTokens;
        return this;
    }

    public SomeModel build() {
        return new SomeModel(modelName, temperature, maxOutputTokens);
    }
}
```

Inside `SomeModel` you would add a method to instantiate a builder:

```java
public static SomeModelBuilder newBuilder() {
    new SomeModelBuilder();
}
```

Then, the user would create a model instance with the builder as follows:

```java
var model = SomeBuilder.newBuilder()
    .modelName("gemini")
    .temperature(0.2f)
    .maxOutputToken(300)
    .build();
```

Not too bad.
The are some variations to this approach, like passing the builder in the class' constructor,
using setter methods that return `this`, using or not using final fields, etc.
But they are mostly stylistic variations.

However, I was wondering about this idea of a functional builder...

## Existing functional approaches in Java

I haven't found much litterature on this theme.
There are 2 blog posts
([here](https://medium.com/beingprofessional/think-functional-advanced-builder-pattern-using-lambda-284714b85ed5)
and [there](https://www.innovect.com/advanced-builder-using-java-8-lambda))
that suggest an approach with lambda expressions and `Consumer`s,
but I find it even more unconventional than the approach I'm going to describe further in this article:

```java
SomeModel model = new SomeModelBuilder()
        .with($ -> {
            $.modelName = "Gemini";
            $.temperature = 0.4f;
        })
        .with($ -> $.maxOutputTokens = 100);
```

You can pass one or more lambdas in chained calls.
It's the end-user who controls how the model is built, not the implementor, so I feel it's less safe.
The use of the `$` sign is a bit of a syntactical hack to avoid repeating the name of the variable corresponding to the model.
Finally, there's still a builder class after all, and maybe we can find a way to get rid of it.

Let's see what Go has to offer instead, and if we can get some inspiration from it!

## The Go approach

My colleague [Valentin](https://www.linkedin.com/in/deleplacevalentin/) pointed me at Dave Cheney's
[article](https://dave.cheney.net/2014/10/17/functional-options-for-friendly-apis) on Go's functional option pattern.
There's also a [video](https://www.youtube.com/watch?v=24lFtGHWxAQ) available.

The idea is that the class' constructor takes function _options_ as a vararg paramter,
that are able to modify the instance that's being built.

Let's illustrate this with the following snippet.

We create a `struct` that represents our model object like in our Java example:

```go
package main

import "fmt"

type SomeModel struct {
    modelName string
    temperature float32
    maxOutputTokens int
}
```

We define a method to construct our model, which takes a vararg of options:

```go
func NewModel(options ...func(*SomeModel)) (*SomeModel) {
    m := SomeModel{"", 0.3, 100}

    for _, option := range options {
        option(&m)
    }

    return &m
}
```

Those options are actually functions that take a model object as parameter.

Now we can create utility methods that create such option functions,
and we pass the value for each field of the `struct` via the method parameter.
So we have a method for each structure field: model name, temperature and max output tokens:

```go
func modelName(name string) func(*SomeModel) {
    return func(m *SomeModel) {
        m.modelName = name
    }
}

func temperature(temp float32) func(*SomeModel) {
    return func(m *SomeModel) {
        m.temperature = temp
    }
}

func maxOutputTokens(max int) func(*SomeModel) {
    return func(m *SomeModel) {
        m.maxOutputTokens = max
    }
}
```

Next we can create the model in the following way, by calling the utility methods that return functions
that are able to modify the `struct`.

```go
func main() {
    m := NewModel(
        modelName("gemini"),
        temperature(0.5),
        maxOutputTokens(100))

    fmt.Println(m)
}
```

Notice there's not even a `NewBuilder()` or `Build()` method!

## Let's implement our functional builder in Java!

We can follow the same approach in Java.
Instead of Go functions, we'll use Java's lambdas.
Our lambdas will be converted into `Consumer`s of `SomeModel`.

So let's recreate our `SomeModel` class, with the same fields as before.
This time, however, the constructor won't be `private`, and it'll take a list of options
(lambda expressions that consume instances of `SomeModel`).
We'll iterate over all of them to execute them:

```java
import java.util.function.Consumer;

public class SomeModel {
    private String modelName;
    private Float temperature = 0.3f;
    private Integer maxOutputTokens = 100;

    public SomeModel(ModelOption... options) {
        for (Option option : options) {
            option.accept(this);
        }
    }
```

And what is this `ModelOption` class? This is just a synonym for a `Consumer<SomeModel>`
(so not strictly needed, but can help with readability).
It's a nested interface:

```java
    public interface ModelOption extends Consumer<SomeModel> {}
```

Next, we create similar utility methods that will update the model instance:

```java
    public static ModelOption modelName(String modelName) {
        return (SomeModel model) -> {
            model.modelName = modelName;
        };
    }

    public static ModelOption temperature(Float temperature) {
        return (SomeModel model) -> {
            model.temperature = temperature;
        };
    }

    public static ModelOption maxOutputTokens(Integer maxOutputTokens) {
        return (SomeModel model) -> {
            model.maxOutputTokens = maxOutputTokens;
        };
    }
}
```

Now, if we want to create a model, we'll be able to call the constructor as follows:

```java
import fn.builder.SomeModel;
import static fn.builder.SomeModel.*;
//...

SomeModel model = new SomeModel(
    modelName("gemini"),
    temperature(0.5f),
    maxOutputTokens(100)
);
```

Don't forget to use a `static import` to keep the syntax short.

## Discussion

A few advantages I see with this approach:

- I like the fact we're using a constructor to construct our model instances!
- And the constructor is super simple and short!
- I'm also happy that I got rid of the verbose `newBuilder()` / `build()` combo.
  It feels like we don't really have a builder at play here.
- At first, I was wondering if I was opening the Pandora box, as I feared developers could provide their own lambda
  and potentially wreck havoc in my instance construction, but because of visibility rules,
  only my methods can modify the internals of the model class
- Although we're using a constructor, the fact of passing those method calls as parameters, it feels a bit like having
  [named arguments](https://www.groovy-lang.org/objectorientation.html#_named_parameters)
  like in languages like Python or Groovy (which can also
  [create builders for you](https://www.groovy-lang.org/metaprogramming.html#xform-Builder) via AST transformations).
  It also looks more like the classical builder too, which has that readability aspect.
- I can pass the arguments in whichever order I want.
- I can put validation rules both in each mutator method and in the constructor after all mutators have been called.

Potential tweaks:

- I used non-final fields, because I wanted to be able to define my default values for some fields at definition time
  rather than in the constructor, but we could certainly tweak this implementation a bit if needed.
  And anyway, only my mutator methods can alter those fields, so I guess it's fine.
- I was curious if I could use Java `enum`s for storing only my allowed mutators,
  but I haven't found an effective and concise way of implementing this.
  Java `enum`s don't work like Rust's, but there's an interesting article about this
  [here](https://www.reddit.com/r/java/comments/135i37c/rust_like_enums_in_java/) on how to implement sum types.
- I wondered also about a mix of `sealed` `interface`s and maybe `record`s, but similarly to `enum`s,
  I couldn't find a nice and short syntax that I was happy with.

In the cons:

- It's a bit unconventional, as I haven't seen this approach implemented in the wild.
  So maybe the approach suffers in terms of readability.
- The other concerns I have is with discoverability.
  When auto-completing code, an IDE like IntelliJ is smart enough to suggest the mutators methods can be used inside the constructor.
  But it's not that clear that such mutator methods exist.
  It's going to be important to document the constructor to say that those mutators exist.

## Feedback

I'd be curious to hear your thoughts on this.
Don't hesitate to interact with me on
[Mastodon](https://uwyn.net/@glaforge/111766219413506355),
[Twitter](https://twitter.com/glaforge/status/1747272263546905026), or
[BlueSky](https://bsky.app/profile/glaforge.bsky.social/post/3kj47jxwseg2m)
