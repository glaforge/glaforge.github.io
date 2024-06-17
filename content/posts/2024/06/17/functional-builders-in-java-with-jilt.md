---
title: "Functional builders in Java with Jilt"
date: 2024-06-17T20:31:25+02:00
image: /img/gemini/construction-coffee.jpg
tags:
  - java
  - golang
  - design-pattern
---

A few months ago, I shared an article about what I called Java
[functional builders]({{< ref "posts/2024/01/16/java-functional-builder-approach/" >}}),
inspired by an equivalent pattern found in Go.
The main idea was to have builders that looked like this example:

```java
LanguageModel languageModel = new LanguageModel(
    name("cool-model"),
    project("my-project"),
    temperature(0.5),
    description("This is a generative model")
);
```

Compared to the more tranditional builder approach:

- You're using the `new` keyword again to construct instances.
- There's no more `build()` method, which felt a bit verbose.

Compared to using constructors with tons of parameters:

- You have methods like in traditional builders, that say what each parameter is about (`name()`, `temperature()`...)
  a bit similar to named parameters in some programming languages.

The approach I followed was to take advantage of lambda functions under the hood:

```java
public static ModelOption temperature(Float temperature) {
    return model -> model.temperature = temperature;
}
```

However, there were a few downsides:

- Of course, it's not very conventional! So it can be a bit disturbing for people used to classical builders.
- I didn't make the distinction between required and optional parameters (they were all optional!)
- The internal fields were not `final`, and I felt they should be.

## Discovering Jilt

When searching on this topic, I found [Adam Ruka](https://x.com/adam_ruka)'s great annotation processor library:
[Jilt](https://github.com/skinny85/jilt).

One of the really cool features of Jilt is its staged builder concept,
which makes builders very type-safe, and forces you to call all the required property methods by chaining them.
I found this approach very elegant.

Adam heard about my functional builder approach, and decided to implement this new style of builder in Jilt.
There are a few differences with my implementation, but it palliates some of the downsides I mentioned.

Let's have a look at what functional builders looks like from a usage standpoint:

```java
LanguageModel languageModel = languageModel(
    name("cool-model"),
    project("my-project"),
    temperature(0.5),
    description("This is a generative model")
);
```

Compared to my approach, you're not using constructors (as annotation processors can't change existing classes),
so you have to use a static method instead. But otherwise, inside that method call,
you have the named-parameter-like methods you're used to use in builders.

Here, `name()`, `project()` and `temperature()` are mandatory, and you'd get a compilation error if you forgot one of them.
But `description()` is optional and can be ommitted.

Let's now look at the implementation:

```java
import org.jilt.Builder;
import org.jilt.BuilderStyle;
import org.jilt.Opt;

import static jilt.testing.LanguageModelBuilder.*;
import static jilt.testing.LanguageModelBuilder.Optional.description;
//...
LanguageModel languageModel = languageModel(
    name("cool-model"),
    project("my-project"),
    temperature(0.5),
    description("This is a generative model")
);
//...
@Builder(style = BuilderStyle.FUNCTIONAL)
public record LanguageModel(
    String name,
    String project,
    Double temperature,
    @Opt String description
) {}
}
```

I used a Java `record` but it could be a good old POJO.
You must annotate that class with the `@Builder` annotation.
The `style` parameter specifies that you want to use a _functional_ builder.
Notice the use of the `@Opt` annotation to say that a parameter is not required.

## Derived instance creation

Let me close this article with another neat trick offered by Jilt, which is how to build other instances from existing ones:

```java
@Builder(style = BuilderStyle.FUNCTIONAL, toBuilder = "derive")
public record LanguageModel(...) {}
//...
LanguageModel derivedModel = derive(languageModel, name("new-name"));
```

By adding the `toBuilder = "derive"` parameter to the annotation, you get the ability to create new instances
similar to the original one, but you can change both required and optional parameters, to derive a new instance.

## Time to try Jilt!

You can try functional builders in [Jilt 1.6](https://github.com/skinny85/jilt) which was just released a few days ago!
