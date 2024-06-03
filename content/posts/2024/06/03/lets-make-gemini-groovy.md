---
title: "Let's make Gemini Groovy!"
date: 2024-06-03T11:49:26+02:00
image: /img/gemini/gemini-groovy-pop-art.jpg
tags:
  - groovy
  - google-cloud
  - generative-ai
  - large-language-models
  - java
  - langchain4j
---

The happy users of [Gemini Advanced](https://gemini.google.com/advanced),
the powerful AI web assistant powered by the Gemini model,
can execute some Python code, thanks to a built-in Python interpreter.
So, for math, logic, calculation questions, the assistant can let Gemini invent a Python script,
and execute it, to let users get a more accurate answer to their queries.

But wearing my [Apache Groovy](https://groovy-lang.org/) hat on,
I wondered if I could get Gemini to invoke some Groovy scripts as well, for advanced math questions!

## LangChain4j based approach

As usual, my tool of choice for any LLM problem is the powerful [LangChain4j](https://docs.langchain4j.dev/) framework!
Interestingly, there are already some code engine integrations,

- a [GraalVM Polyglot Truffle](https://www.graalvm.org/latest/reference-manual/polyglot-programming/) engine, that can execute Python and JavaScript code,
- a [Judge0](https://judge0.com/) engine that uses the Judge0 online code execution system, which also supports Groovy!

I haven't tried Judge0 yet, as I saw it was supporting Groovy 3 only, and not yet Groovy 4.
But for math or logic questions, Groovy 3 is just fine anyway.
Instead, I wanted to explore how to create my own Groovy interpreter!

In the following experiment, I'm going to use the [Gemini](https://deepmind.google/technologies/gemini/) model,
because it supports _function calling_, which means we can instruct the model that it can use some tools when needed.

Let's walk through this step by step.

First, I instantiate a Gemini chat model:

```java
var model = VertexAiGeminiChatModel.builder()
    .project("MY_GCP_PROJECT_ID")
    .location("us-central1")
    .modelName("gemini-1.5-flash-001")
    .maxRetries(1)
    .build();
```

Then, I create a tool that is able to run Groovy code, thanks to the `GroovyShell` evaluator:

```java
class GroovyInterpreter {
  @Tool("Execute a Groovy script and return the result of its execution.")
  public Map<String, String> executeGroovyScript(
    @P("The groovy script source code to execute") String groovyScript) {
    String script = groovyScript.replace("\\n", "\n");
    System.err.format("%n--> Executing the following Groovy script:%n%s%n", script);
    try {
      Object result = new GroovyShell().evaluate(script);
      return Map.of("result", result == null ? "null" : result.toString());
    } catch (Throwable e) {
      return Map.of("error", e.getMessage());
    }
  }
}
```

Notice the `@Tool` annotation that describes what this tool can do.
And the `@P` annotation which explains what the parameter is about.

I noticed that sometimes the raw script that Gemini suggested contained some `\n` strings,
instead of the plain newline characters, so I'm replacing them with newlines instead.

I return a map containing either a result (as a string), or an error message if one was encountered.

Now it's time to create our assistant contract, in the form of an interface,
but with a very carefully crafted system instruction:

```java
interface GroovyAssistant {
  @SystemMessage("""
    You are a problem solver equipped with the capability of \
    executing Groovy scripts.
    When you need to or you're asked to evaluate some math \
    function, some algorithm, or some code, use the \
    `executeGroovyScript` function, passing a Groovy script \
    that implements the function, the algorithm, or the code \
    that needs to be run.
    In the Groovy script, return a value. Don't print the result \
    to the console.
    Don't use semicolons in your Groovy scripts, it's not necessary.
    When reporting the result of the execution of a script, \
    be sure to show the content of that script.
    Call the `executeGroovyScript` function only once, \
    don't call it in a loop.
    """)
  String chat(String msg);
}
```

This complex system instruction above tells the model what its role is,
and that it should call the provided Groovy script execution function
whenever it encounters the need to calculate some function, or execute some logic.

I also instruct it to return values instead of printing results.

Funnily, Gemini is a pretty decent Groovy programmer,
but it insists on always adding semi-colons like in Java,
so for a more _idiomatic_ code style, I suggest it to get rid of them!

The final step is now to create our LangChain4j AI service with the following code:

```java
var assistant = AiServices.builder(GroovyAssistant.class)
    .chatLanguageModel(model)
    .chatMemory(MessageWindowChatMemory.withMaxMessages(20))
    .tools(new GroovyInterpreter())
    .build();
```

I combine the Gemini chat model, with a memory to keep track of users' requests,
and the Groovy interpreter tool I've just created.

Now let's see if Gemini is able to create and calculate a fibonacci function:

```java
System.out.println(
  assistant.chat(
    "Write a `fibonacci` function, and calculate `fibonacci(18)`"));
```

And the output is as follows:

> ```groovy
> def fibonacci(n) {
>   if (n <= 1) {
>     return n
>   } else {
>     return fibonacci(n - 1) + fibonacci(n - 2)
>   }
> }
> fibonacci(18)
> ```
>
> The result of executing the script is: 2584.

## Discussion

It took me a bit of time to find the right system instruction to get Groovy scripts that complied to my requirements.
However, I noticed sometimes some internal errors returned by the model, which I haven't fully understood
(and particularly why those happen at all)

On some occasions, I also noticed that LangChain4j keeps sending the same script for execution, in a loop.
Same thing: I still have to investigate why this rare behavior happens.

So this solution is a fun experiment, but I'd call it just that, an experiment, as it's not as rock-solid as I want it to be.
But if I manage to make it more bullet-proof, maybe I could contribute it back as a dedicated execution engine for LangChain4j!

## Full source code

Here's the full content of my experiment:

```java
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.vertexai.VertexAiGeminiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import groovy.lang.GroovyShell;
import java.util.Map;

public class GroovyCodeInterpreterAssistant {
  public static void main(String[] args) {
    var model = VertexAiGeminiChatModel.builder()
      .project("MY_GCP_PROJECT_ID")
      .location("us-central1")
      .modelName("gemini-1.5-flash-001")
      .maxRetries(1)
      .build();

    class GroovyInterpreter {
      @Tool("Execute a Groovy script and return the result of its execution.")
      public Map<String, String> executeGroovyScript(
          @P("The groovy script source code to execute")
          String groovyScript) {
        System.err.format("%n--> Raw Groovy script:%n%s%n", groovyScript);
        String script = groovyScript.replace("\\n", "\n");
        System.err.format("%n--> Executing:%n%s%n", script);
        try {
          Object result = new GroovyShell().evaluate(script);
          return Map.of("result", result == null ? "null" : result.toString());
        } catch (Throwable e) {
          return Map.of("error", e.getMessage());
        }
      }
    }

    interface GroovyAssistant {
      @SystemMessage("""
        You are a problem solver equipped with the capability of \
        executing Groovy scripts.
        When you need to or you're asked to evaluate some math \
        function, some algorithm, or some code, use the \
        `executeGroovyScript` function, passing a Groovy script \
        that implements the function, the algorithm, or the code \
        that needs to be run.
        In the Groovy script, return a value. Don't print the result \
        to the console.
        Don't use semicolons in your Groovy scripts, it's not necessary.
        When reporting the result of the execution of a script, \
        be sure to show the content of that script.
        Call the `executeGroovyScript` function only once, \
        don't call it in a loop.
        """)
      String chat(String msg);
    }

    var assistant = AiServices.builder(GroovyAssistant.class)
      .chatLanguageModel(model)
      .chatMemory(MessageWindowChatMemory.withMaxMessages(20))
      .tools(new GroovyInterpreter())
      .build();

    System.out.println(
      assistant.chat(
        "Write a `fibonacci` function, and calculate `fibonacci(18)`"));
  }
}
```
