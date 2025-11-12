---
title: "Creating a Javelit chat interface for LangChain4j"
date: 2025-10-25T17:11:19+02:00
tags:
  - java
  - langchain4j
  - generative-ai
  - javelit

similar:
  - "posts/2025/10/26/a-javelit-frontend-for-an-ADK-agent.md"
  - "posts/2025/10/24/javelit-to-create-quick-interactive-app-frontends-in-java.md"
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
---

Yesterday, I uncovered the [Javelit](https://javelit.io) project in this
[article]({{<ref "posts/2025/10/24/javelit-to-create-quick-interactive-app-frontends-in-java.md">}})
where I built a small frontend to create and edit images
with Google's [Nano Banana](https://aistudio.google.com/models/gemini-2-5-flash-image) image model.

> **Javelit** is an open source project inspired by Streamlit from the Python ecosystem
> to enable rapid prototyping and deployment of applications in Java.

Today, I want to show you another example of Javelit.
This time, I'm creating a **chat interface** using [LangChain4j](https://docs.langchain4j.dev)
with the [Gemini](https://docs.langchain4j.dev/integrations/language-models/google-ai-gemini) chat model.

## What we want to build

![Generative AI chat interface built with Javelit, LangChain4j, and the Gemini model](/img/misc/javelit-langchain4j.png)

Notice how we alternate user and AI messages, and how the text is nicely rendered from Markdown?
Let's see how to implement such an interface with Javelit and LangChain4j.

## Let's build it!

Feel free to use any LLM model provider, but in my example today, I'm using Gemini:

```java
private static final ChatModel CHAT_MODEL = GoogleAiGeminiChatModel.builder()
    .modelName("gemini-2.5-flash")
    .apiKey(System.getenv("GOOGLE_API_KEY"))
    .build();
```

When using LangChain4j chat models at the low-level (not using `AiServices` or the new _agentic_ module),
we keep track of chat messages via a simple `List` of `ChatMessage`.
This chat history needs to be stored in Javelit's session state:

```java
List<ChatMessage> chatHistory = (List<ChatMessage>) Jt.sessionState()
    .computeIfAbsent("chatHistory", (key) -> new ArrayList<>());
```

Let's give this application a title, and prepare a _container_ that will receive all the chat messages from both the AI and the user:

```java
Jt.title(":coffee::parrot: LangChain4j Chat :speech_balloon:").use();
JtContainer msgContainer = Jt.container().use();
```

Notice that Javelit supports emoji code names!

Next, let's append all the messages from the chat history to the message container, alternating between AI and user messages:

```java
for (ChatMessage message : chatHistory) {
    switch (message.type()) {
        case USER -> Jt.markdown( ":speech_balloon: " +
            ((UserMessage) message).singleText()).use(msgContainer);
        case AI -> Jt.markdown(":robot: " +
            ((AiMessage) message).text()).use(msgContainer);
    }
}
```

Again, we're using the `Jt.markdown()` component that outputs Markdown.
Which is nice since LLMs love to return Markdown responses!

It's time to get some input message from the user, with the `Jt.textInput()` component, and save its value in a local variable:

```java
String inputMessage = Jt.textInput("Your message:").use();
```

Let's update the chat history, display the user's message, call the Gemini chat model, and then display its response:

```java
if (inputMessage != null && !inputMessage.trim().isEmpty()) {
    chatHistory.add(UserMessage.from(inputMessage));
    Jt.markdown(":speech_balloon: " + inputMessage).use(msgContainer);

    ChatResponse response = CHAT_MODEL.chat(chatHistory);
    chatHistory.add(response.aiMessage());

    Jt.markdown(":robot: " + response.aiMessage().text()).use(msgContainer);
}
```

And that's it!
When the user hits the enter key, after having typed its message, it retriggers a UI refresh.
It goes over all the UI component rendering again, but uses the state to show the alternation of user/AI messages.

## The whole source code

{{<details summary="Click to view the whole source code">}}

```java
/// usr/bin/env jbang "$0" "$@" ; exit $?
//DEPS dev.langchain4j:langchain4j-core:1.8.0
//DEPS dev.langchain4j:langchain4j-google-ai-gemini:1.8.0

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import io.javelit.core.Jt;
import io.javelit.core.JtContainer;

import java.util.ArrayList;
import java.util.List;

public class App {
  private static final ChatModel CHAT_MODEL = GoogleAiGeminiChatModel.builder()
      .modelName("gemini-2.5-flash")
      .apiKey(System.getenv("GOOGLE_API_KEY"))
      .build();

  public static void main(String[] args) {

    List<ChatMessage> chatHistory = (List<ChatMessage>) Jt.sessionState()
        .computeIfAbsent("chatHistory", (key) -> new ArrayList<>());

    Jt.title(":coffee::parrot: LangChain4j Chat :speech_balloon:").use();
    JtContainer msgContainer = Jt.container().use();

    for (ChatMessage message : chatHistory) {
      switch (message.type()) {
        case USER -> Jt.markdown( ":speech_balloon: " +
            ((UserMessage) message).singleText()).use(msgContainer);
        case AI -> Jt.markdown(":robot: " +
            ((AiMessage) message).text()).use(msgContainer);
      }
    }

    String inputMessage = Jt.textInput("Your message:").use();

    if (inputMessage != null && !inputMessage.trim().isEmpty()) {
      chatHistory.add(UserMessage.from(inputMessage));
      Jt.markdown(":speech_balloon: " + inputMessage).use(msgContainer);

      ChatResponse response = CHAT_MODEL.chat(chatHistory);
      chatHistory.add(response.aiMessage());

      Jt.markdown(":robot: " + response.aiMessage().text()).use(msgContainer);
    }
  }
}
```

{{</details>}}

Then you can run this class (after having [installed Javelit](https://docs.javelit.io/get-started/installation)) with:

```bash
javelit run App.java
```

## Summary

And voilà!
In this article, we've managed to build a **simple chat UI** for
[LangChain4j](https://docs.langchain4j.dev) chat models using the
[Javelit](https://javelit.io) UI toolkit.
We took advantage of Javelit's state management, as well as the built-in markdown rendering,
as LLMs generally use markdown in their responses.
