---
title: "Pretty-print Markdown on the console"
date: 2025-02-27T17:01:26+01:00
tags:
  - java
  - markdown
---

With Large Language Models loving to output Markdown responses, I've been wanting to display those Markdown snippets nicely in the console, when developing some LLM-powered apps and experiments.
At first, I thought I could use a Markdown parser library, and implement some kind of output formatter to display the text nicely, taking advantage of [ANSI color codes and formats](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797).
However it felt a bit over-engineered, so I thought _"hey, why not just use some simple regular expressions!"_ (and now you'll tell me I have a second problem with regexes)

In this blog post, I just want to share the few lines of code I've added in a utility class to output Markdown content nicely.
It's not covering all the bells & whistles of the Markdown syntax (in particular things like Github flavored extensions, like arrays, etc.) but it's good enough for my use case.

## Markdown syntax highlighting on the console

````java
public static String markdown(String md) {
  return md
    // Bold
    .replaceAll("\\*\\*(.*?)\\*\\*", "\u001B[1m$1\u001B[0m")
    // Italic
    .replaceAll("\\*(.*?)\\*", "\u001B[3m$1\u001B[0m")
    // Underline
    .replaceAll("__(.*?)__", "\u001B[4m$1\u001B[0m")
    // Strikethrough
    .replaceAll("~~(.*?)~~", "\u001B[9m$1\u001B[0m")
    // Blockquote
    .replaceAll("(> ?.*)",
        "\u001B[3m\u001B[34m\u001B[1m$1\u001B[22m\u001B[0m")
    // Lists (bold magenta number and bullet)
    .replaceAll("([\\d]+\\.|-|\\*) (.*)",
        "\u001B[35m\u001B[1m$1\u001B[22m\u001B[0m $2")
    // Block code (black on gray)
    .replaceAll("(?s)```(\\w+)?\\n(.*?)\\n```",
        "\u001B[3m\u001B[1m$1\u001B[22m\u001B[0m\n\u001B[57;107m$2\u001B[0m\n")
    // Inline code (black on gray)
    .replaceAll("`(.*?)`", "\u001B[57;107m$1\u001B[0m")
    // Headers (cyan bold)
    .replaceAll("(#{1,6}) (.*?)\n",
        "\u001B[36m\u001B[1m$1 $2\u001B[22m\u001B[0m\n")
    // Headers with a single line of text followed by 2 or more equal signs
    .replaceAll("(.*?\n={2,}\n)",
        "\u001B[36m\u001B[1m$1\u001B[22m\u001B[0m\n")
    // Headers with a single line of text followed by 2 or more dashes
    .replaceAll("(.*?\n-{2,}\n)",
        "\u001B[36m\u001B[1m$1\u001B[22m\u001B[0m\n")
    // Images (blue underlined)
    .replaceAll("!\\[(.*?)]\\((.*?)\\)",
        "\u001B[34m$1\u001B[0m (\u001B[34m\u001B[4m$2\u001B[0m)")
    // Links (blue underlined)
    .replaceAll("!?\\[(.*?)]\\((.*?)\\)",
        "\u001B[34m$1\u001B[0m (\u001B[34m\u001B[4m$2\u001B[0m)");
}
````

> This can easily be translated into other programming languages. Just be careful with the small differences in syntax of regular expressions.

For the following Markdown text:

````markdown
# Main title

Big title

## Subtitle

Small title

# Bold and italic

Some **bold text**.
Bits of _italicized text_.
It's **underlined**.
And ~~striked through~~.

## Links

A [link](https://www.example.com) to an article.

![alt text](image.jpg)

### Quoting

> a quote of someone famous, potentially wrapping around multiple lines.

# Lists

1. First item
2. Second item
3. Third item

- First item
- Second item
- Third item

# Code

Some inline `code` inside a paragraph.
Return type is `void` and args are `String[]`.

A fenced code block:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```
````

On the console output, the above Markdow document would be rendered as follows:

![](/img/misc/markdown-rendered-in-console.png)

Do you like this Markdown syntax highlighting?

## Bonus points

At first, in my utility class, I only had methods for adding some colors in my program outputs.
Even if you don't use Markdown, those touches of color can be useful to differentiate key parts of your output.

So I created some methods for wrapping text in ANSI codes:

```java
public static String red(String msg) {
    return "\u001B[31m" + msg + "\u001B[0m";
}

public static String green(String msg) {
    return "\u001B[31m" + msg + "\u001B[0m";
}
//...
public static String bold(String msg) {
    return "\u001B[1m" + msg + "\u001B[0m";
}

public static String italic(String msg) {
    return "\u001B[3m" + msg + "\u001B[0m";
}
//...
```

You can combine them like in `bold(green(msg))`, add more colors, or even write some fancy rainbow text!
As long as the output is still readable, it's all fair game!
