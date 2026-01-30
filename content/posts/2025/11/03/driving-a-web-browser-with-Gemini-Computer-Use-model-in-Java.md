---
title: "Driving a web browser with Gemini's Computer Use model in Java"
date: 2025-11-02T00:00:00Z
tags:
- java
- generative-ai
- large-language-models
- ai-agents

similar:
  - "posts/2023/12/13/get-started-with-gemini-in-java.md"
  - "posts/2026/01/30/a-javelit-frontend-for-the-deep-research-agent.md"
  - "posts/2024/09/05/new-gemini-model-in-langchain4j.md"
---

In this article, I'll guide you through the process of programmatically interacting with a web browser
using the new [Computer Use model](https://ai.google.dev/gemini-api/docs/computer-use) in Gemini 2.5 Pro.
We'll accomplish this in Java :coffee: leveraging Microsoft's powerful [Playwright Java SDK](https://playwright.dev/java/) to handle the browser automation.

## The New Computer Use Model

Unveiled in this [announcement article](https://blog.google/technology/google-deepmind/gemini-computer-use-model/)
and made available in public preview last month, via the Gemini API
on [Google AI Studio](https://aistudio.google.com/prompts/new_chat) and
[Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/computer-use),
Gemini 2.5 Pro introduces a pretty powerful ["Computer Use"](https://ai.google.dev/gemini-api/docs/computer-use) feature.

This allows the model to understand and interact with a computer screen much like a human would.
It's a multimodal model that takes a screenshot of a web page as input and returns a sequence of actions to perform,
such as clicking buttons, filling out text fields, and navigating through pages,
until it reaches a certain goal set by the user.

The general flow is illustrated in the following diagram:

![Gemini Computer Use flow](/img/gemini/browser-use/computer-use-flow.png)

Let's get the project set up, and then we'll see further down how this flow works, and how to implement it, using Java and Playwright.

## Project Setup

For this tutorial, I'm using a straightforward Java project built with [Maven](https://maven.apache.org/).
We'll need two main dependencies: one for the [Gemini API](https://central.sonatype.com/artifact/com.google.genai/google-genai)
and another for [Playwright](https://central.sonatype.com/artifact/com.microsoft.playwright/playwright).

Here's the relevant section of my `pom.xml` file:

```xml
<dependencies>
    <dependency>
        <groupId>com.google.genai</groupId>
        <artifactId>google-genai</artifactId>
        <version>1.24.0</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.playwright</groupId>
        <artifactId>playwright</artifactId>
        <version>1.56.0</version>
    </dependency>
</dependencies>
```

## Getting Started with Playwright

Now, let's dive into the code.
[Playwright](https://playwright.dev/java/) is a library from Microsoft for automating browser actions,
and it's available for several languages, including Java.

Here’s a basic example of how to launch a browser and navigate to a page:

```java
import com.microsoft.playwright.*;

public class BrowserAutomation {
    public static void main(String[] args) {
        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(true)
            );
            Page page = browser.newPage();
            page.navigate("https://www.google.com");
            // We'll add the Gemini integration here.
            browser.close();
        }
    }
}
```

In this snippet, I'm using the [Chromium](https://www.chromium.org/chromium-projects/) browser that ships with Playwright.
But other browsers like [Firefox](https://www.mozilla.org/en-US/firefox/new/) are also available.

I'm launching it in _"headless"_ mode, meaning no browser window will be visible.
This is ideal for automated tasks where visual inspection isn't necessary.
For debugging, however, you can set `setHeadless(false)` to watch the automation in real-time.

## Integrating with Gemini

First, you'll need a Gemini API key, which you can obtain from [Google AI Studio](https://aistudio.google.com/app/apikey).
Once you have your key, it's best practice to set it as an environment variable named `GEMINI_API_KEY`.
We'll use a try with resources block to create (and close automatically) the client to access Gemini:

```java
try (Client client = new Client.Builder()
    .apiKey(System.getenv("GEMINI_API_KEY"))
    .build()) {
        // ...
}
```

With the browser automation foundation in place, we can now integrate Gemini to steer it.
The process works as a loop: we send a prompt with a goal to reach to the model,
the model returns a series of actions, our code executes them using Playwright,
we share the screenshot of the current web page after each action,
and we repeat the cycle until the task is complete.

### The Agent Loop

The Gemini documentation refers to this cyclical process as an _"agent loop"_:

1.  **Send Request**: The loop begins by sending the user's prompt, the latest UI screenshot, and the enabled `computer_use` tool to the model.
2.  **Receive Response**: The model analyzes the inputs and returns a `function_call` suggesting a specific UI action.
3.  **Execute Action**: Our Java code parses this `function_call` and translates it into a Playwright command to be executed in the browser.
4.  **Capture New State**: After the action is performed, we capture a new screenshot and send it back to the model along with a `function_response`, starting the loop over.

This process continues until the model determines the initial goal has been met.

### Code Walkthrough

Let's examine the `BrowserUse.java` file to see how this loop is implemented.
(You'll find the full source code at the bottom of the page.)

First, we initialize Playwright and the Gemini client (as explained above),
setting a specific viewport size which is crucial for the coordinate scaling we'll discuss shortly:

```java
try (Playwright playwright = Playwright.create()) {
    BrowserType chromium = playwright.chromium();
    Browser browser = chromium.launch(
      new BrowserType.LaunchOptions().setHeadless(true));
    final int WIDTH = 1000;
    final int HEIGHT = 1000;
    BrowserContext context = browser.newContext(
      new Browser.NewContextOptions().setViewportSize(WIDTH, HEIGHT));
    Page page = context.newPage();

    try (Client client = new Client.Builder()
            .apiKey(System.getenv("GEMINI_API_KEY"))
            .build()) {
        // The agent loop will go here.
    }
}
```

Next, we kick off the conversation with the model by sending our initial prompt.
This defines the overall goal for the agent.

```java
List<Content> history = new ArrayList<>();

Content initialContent = Content.fromParts(Part.fromText("""
    Find the tallest Stitch plushie under €100 on Amazon.fr
    and then provide the link to that item.
    """));

history.add(initialContent);

GenerateContentResponse response = client.models.generateContent(
    "gemini-2.5-computer-use-preview-10-2025",
    initialContent,
    GenerateContentConfig.builder()
        .tools(Tool.builder()
            .computerUse(ComputerUse.builder()
                .environment(
                    Environment.Known.ENVIRONMENT_BROWSER)
                .build())
            .build())
        .build());
```

Here, we're using the `gemini-2.5-computer-use-preview-10-2025` model and explicitly enabling the `computer_use` tool.

The core of the application is a `while` loop that continues as long as the model returns function calls for us to execute:

```java
while (response.functionCalls() != null &&
        !response.functionCalls().isEmpty()) {
    // ...
}
```

We iterate over the function calls returned by the model and use a `switch` statement to execute the corresponding Playwright action.
After each interaction, we save a screenshot of the page, that we give back to the model to _see_ the result of the action on the page.

```java
for (FunctionCall functionCall : response.functionCalls()) {
    // ...
    switch (functionCall.name().get()) {
        case "navigate_to_url":
            page.navigate((String) args.get("url"));
            result.put("status", "success");
            break;
        case "click_at":
            // ...
            break;
        // ... other cases
    }
    // ...
}
```

This `switch` block is the heart of the integration, translating the model's intentions into concrete browser actions.

> **Supported Actions:** You can check the list of
> [supported actions](https://ai.google.dev/gemini-api/docs/computer-use#supported-actions) in the documentation.
> You don't necessarily have to implement them all, depending on your use case.
> And there's a proposed [implementation](https://github.com/google-gemini/computer-use-preview/blob/main/computers/playwright/playwright.py)
> in Python that you can take inspiration from.
> Note that there are often multiple ways to implement certain actions, like scrolling for example.
> And you'll see in the full source code below how I implemented most of them in Java with Playwright.

### Coordinate Scaling

A critical detail in this process is coordinate handling.
The Gemini model operates on a normalized 1000x1000 grid, independent of the actual browser viewport size.
Therefore, we must scale the coordinates it provides to match our browser's dimensions.

In my case, I simply ended up using 1000x1000 for my browser window,
but I kept the scaling calculation in place, should I want to change the browser size in the future.

Here's the implementation for a `click_at` action:

```java
case "click_at":
    int xClick = ((Number) args.get("x")).intValue();
    int yClick = ((Number) args.get("y")).intValue();
    var scaledCoordForClicking =
        new ScaledCoord(xClick, yClick).scaleTo(WIDTH, HEIGHT);
    page.mouse().click(
        scaledCoordForClicking.x, scaledCoordForClicking.y);
    result.put("status", "success");
    break;
```

This is accomplished with a simple `ScaledCoord` record:

```java
private record ScaledCoord(int x, int y) {
    ScaledCoord scaleTo(int width, int height) {
        return new ScaledCoord(
                (int) (this.x / 1000.0 * width),
                (int) (this.y / 1000.0 * height)
        );
    }
}
```

### Accepting Safety Decisions

For certain actions, the model might require a confirmation before proceeding.
This is a safety feature to prevent unintended consequences, for example when dealing with sensitive information or performing critical operations.
The model will include a `safety_decision` field in its response, indicating that a confirmation is needed.
In a real-world application, you should prompt the user for their approval.
However, for the purpose of this demonstration, the code at the bottom of this article automatically acknowledges these safety decisions.
This is implemented by checking for the presence of the `safety_decision` field in the function call arguments
and then adding a `safety_acknowledgement` field with the value `true` to the function response, as you can see in the provided source code.

```java
for (FunctionCall functionCall : response.functionCalls()) {
    Map<String, Object> args = functionCall.args().get();

    Map<String, Object> result = new HashMap<>();
    if (args.containsKey("safety_decision")) {
        result.put("safety_acknowledgement", "true");
    }
    // ...
```

This `safety_decision` request often comes when you have to accept things like cookies policy, and other pop-ups.
You can learn more about this in the [documentation](https://ai.google.dev/gemini-api/docs/computer-use#safety-decisions).

### Closing the Loop

After executing an action, we must inform the model of the outcome.
This is done by adding a `function_response` containing the result to the conversation history.
We also give the model the screenshot, so it _sees_ the updated page.

```java
result.put("url", page.url());
// wait to ensure the page has fully rendered after the action
sleep(1000);
byte[] screenshot = page.screenshot(
    // also saving the screenshot locally for debugging purpose
    new Page.ScreenshotOptions()
        .setPath(Paths.get("screenshot-" + index++ + ".png")));
history.add(Content.fromParts(
        Part.fromFunctionResponse(functionCall.name().get(), result),
        Part.fromBytes(screenshot, "image/png")
));
```

We then call `generateContent` again with the updated history,
including the **result of the action** as well as the **screenshot of the page**,
and the loop continues until the model determines the task is finished and stops returning function calls.
At that point, we can print the final text-based response.

```java
System.out.println(response.text());
```

> :warning: **Important:** You **must always take a screenshot after each action**, and **send it to the model** each time.
> Otherwise, the Computer Use model is in the dark, and doesn't know what's going on in the browser.

This concludes our tour of how to use the Gemini 2.5 Pro Computer Use model with Java and Playwright.
Now, before having a look at the full source code at the bottom of the article,
let's have a look at a few example use cases I tried.

## Example Browser Use Requests

### Playing a Button Clicking Game

When working on implementing the Playwright Chromium functions to echo the actions requested by the model,
at first, I wasn't sure if my logic for handling button clicks was correct (in particular the coordinate scaling).
So I wanted to double check that it was working fine, and for that purpose,
I created a simple [button clicking game](https://storage.googleapis.com/public-bucket-for-demos/button.html?ne):
Each time you click on the red button, the button moves randomly on the page, and a score shows the number of clicks.
(Feel free to play it, it's boring stupid!)

I asked Gemini Computer Use to go to that game page, click the button 10 times, and respond with the final score at the end.
Logically, clicking 10 times would give a score of 10!

> Go to this red button clicking game page:
> https://storage.googleapis.com/public-bucket-for-demos/button.html
> Click 10 times the red button.
> Return the score displayed in the top left hand corner.

This little animated GIF shows you the button moving around and the score increasing:

{{<details summary="Click to see the animation" >}}
![button clicking game animation](/img/gemini/browser-use/animation-red-button.gif)
{{</details>}}

Here's the model's final answer:

> I have evaluated step 12. I clicked the button and the score increased to 10.
> I have clicked the button 10 times and the score is now 10, as displayed in the top left corner.

### Searching an Article on my blog

I asked Gemini Computer Use to find a particular article on my blog:

> Find an article on glaforge.dev on
> how to use Nano Banana in an ADK agent

Let's see that in action in this other animation:

{{<details summary="Click to see the animation" >}}
![Searching an article on my blog](/img/gemini/browser-use/animation-blog-article-search.gif)
{{</details>}}

Here's the model's final answer:
```
I have evaluated step 18 and scrolled down further. The article
presents the code for `NanoBananaCreativeAgent` and highlights
the line `.model("gemini-2.5-flash-image-preview")` as key for
telling the ADK to route requests to the Nano Banana
(Gemini 2.5 Flash Image) model for image generation within the agent.

It also mentions an `.afterModelCallback` part that it will zoom
in on. This article clearly explains how to configure the ADK
agent to use the Nano Banana model.

I have found the information requested.

The article "Creative Java AI agents with ADK and Nano Banana" on
glaforge.dev explains how to use the "Nano Banana" model
(gemini-2.5-flash-image-preview) within an ADK agent.

It is done by specifying `.model("gemini-2.5-flash-image-preview")`
when building the `LlmAgent` using `LlmAgent.builder()`
within the agent's definition.
The article also goes into handling the image output
using `.afterModelCallback`.
```

### Finding an Item on Amazon

This time, I asked Gemini Computer Use:
> Find the tallest Stitch plushie under €100 on Amazon.fr
> and give me the URL of the product.
> Be sure it's not Angel the pink one.

It found a nice Stitch plushie!

{{< details summary="Click to see the animation" >}}
![A big Stitch plushie found on Amazon](/img/gemini/browser-use/animation-stitch.gif)
{{</details>}}

## The Full Source Code

Tim to reveal the complete source code!
Feel free to adapt it to your needs, or to further expand the browser actions supported.

{{< details summary="Click to see the full source code" >}}
```java
import com.google.genai.Client;
import com.google.genai.types.*;
import com.microsoft.playwright.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

void main() {
    try (Playwright playwright = Playwright.create()) {
        BrowserType chromium = playwright.chromium();
        Browser browser = chromium.launch(new BrowserType.LaunchOptions().setHeadless(true));

        final int WIDTH = 1000;
        final int HEIGHT = 1000;

        BrowserContext context = browser.newContext(new Browser.NewContextOptions().setViewportSize(WIDTH, HEIGHT));
        Page page = context.newPage();

        try (Client client = new Client.Builder()
                .apiKey(System.getenv("GEMINI_API_KEY"))
                .build()) {

            List<Content> history = new ArrayList<>();

            Content initialContent = Content.fromParts(Part.fromText("""
                    Find an article on glaforge.dev on how to use Nano Banana in an ADK agent
                    """));

            history.add(initialContent);

            GenerateContentResponse response = null;
            int index = 0;

            while (true) {
                response = client.models.generateContent(
                    "gemini-2.5-computer-use-preview-10-2025",
                    history,
                    GenerateContentConfig.builder()
                        .tools(Tool.builder()
                            .computerUse(ComputerUse.builder()
                                .environment(Environment.Known.ENVIRONMENT_BROWSER)
                                .build())
                            .build())
                        .build());

                if (response.functionCalls() == null || response.functionCalls().isEmpty()) {
                    break;
                }

                if (!response.candidates().isEmpty()) {
                    history.add(response.candidates().get().get(0).content().get());
                }

                for (FunctionCall functionCall : response.functionCalls()) {
                    Map<String, Object> args = functionCall.args().get();
                    System.out.println("==> " + functionCall.name().get() + " " + args);

                    Map<String, Object> result = new HashMap<>();
                    if (args.containsKey("safety_decision")) {
                        result.put("safety_acknowledgement", "true");
                    }

                    switch (functionCall.name().get()) {
                        case "open_web_browser":
                            result.put("status", "success");
                            break;
                        case "navigate":
                        case "navigate_to_url":
                            page.navigate((String) args.get("url"));
                            result.put("status", "success");
                            break;
                        case "go_back":
                            page.goBack();
                            result.put("status", "success");
                            break;
                        case "get_page_content":
                            String pageContent = page.content();
                            if (pageContent.length() > 20000) {
                                pageContent = pageContent.substring(0, 20000);
                            }
                            result.put("content", pageContent);
                            break;
                        case "click_element":
                            try {
                                page.click((String) args.get("selector"));
                                result.put("status", "success");
                            } catch (PlaywrightException e) {
                                result.put("status", "error");
                                result.put("message", e.getMessage());
                            }
                            break;
                        case "click_at":
                            int xClick = ((Number) args.get("x")).intValue();
                            int yClick = ((Number) args.get("y")).intValue();
                            var scaledCoordForClicking =
                                new ScaledCoord(xClick, yClick).scaleTo(WIDTH, HEIGHT);
                            page.mouse().click(scaledCoordForClicking.x, scaledCoordForClicking.y);
                            result.put("status", "success");
                            break;
                        case "type_text":
                            String text = (String) args.get("text");
                            String selectorForTyping = (String) args.get("selector");
                            if (selectorForTyping != null) {
                                page.locator(selectorForTyping).type(text);
                            } else {
                                page.keyboard().type(text);
                            }
                            result.put("status", "success");
                            break;
                        case "type_text_at":
                            String text_to_type = (String) args.get("text");
                            boolean press_enter = (Boolean) args.getOrDefault("press_enter", false);
                            int xType = ((Number) args.get("x")).intValue();
                            int yType = ((Number) args.get("y")).intValue();
                            var scaledCoordForTyping =
                                new ScaledCoord(xType, yType).scaleTo(WIDTH, HEIGHT);
                            page.mouse().click(scaledCoordForTyping.x, scaledCoordForTyping.y);
                            page.keyboard().type(text_to_type);
                            if (press_enter) {
                                page.keyboard().press("Enter");
                            }
                            result.put("status", "success");
                            break;
                        case "scroll_document":
                            String direction = (String) args.get("direction");
                            int magnitude = 800;
                            if (args.containsKey("magnitude")) {
                                magnitude = ((Number) args.get("magnitude")).intValue();
                            }
                            if ("down".equals(direction)) {
                                page.evaluate("window.scrollBy(0, " + magnitude + ")");
                            } else if ("up".equals(direction)) {
                                page.evaluate("window.scrollBy(0, -" + magnitude + ")");
                            }
                            result.put("status", "success");
                            break;
                        case "search":
                            String query = (String) args.get("query");
                            if (query != null && !query.isEmpty()) {
                                page.navigate("https://www.google.com/search?q=" +
                                        URLEncoder.encode(query, StandardCharsets.UTF_8));
                                result.put("status", "success");
                            } else {
                                result.put("status", "unsupported function");
                                result.put("message", "search function requires a query argument.");
                            }
                            break;
                        case "take_screenshot":
                            byte[] screenshotBytes = page.screenshot();
                            result.put("screenshot-image-bytes", screenshotBytes);
                            result.put("status", "success");
                            break;
                        case "wait_5_seconds":
                            sleep(5000);
                            result.put("status", "success");
                            break;
                        default:
                            result.put("error", "unsupported function");
                    }
                    result.put("url", page.url());

                    sleep(1000);
                    byte[] screenshot = page.screenshot(
                            new Page.ScreenshotOptions()
                                .setPath(Paths.get("screenshot-" + index++ + ".png")));
                    history.add(Content.fromParts(
                            Part.fromFunctionResponse(functionCall.name().get(), result),
                            Part.fromBytes(screenshot, "image/png")
                    ));
                }
            }

            System.out.println(response.text());
        } finally {
            browser.close();
        }
    }
}

private record ScaledCoord(int x, int y) {
    ScaledCoord scaleTo(int width, int height) {
        return new ScaledCoord(
                (int) (this.x / 1000.0 * width),
                (int) (this.y / 1000.0 * height)
        );
    }
}

private static void sleep(int milliseconds) {
    try {
        Thread.sleep(milliseconds);
    } catch (InterruptedException e) {
        // do nothing
    }
}
```
{{</details>}}

## Conclusion

My experiments with the Gemini 2.5 Pro Computer Use model have been insightful, revealing both its potential and some of its limitations.

One of the first things you'll notice is the **pacing**.
Each turn in the agent loop, model call, and action execution, takes time.
A multi-step task like finding a product on an e-commerce site requires patience, as the process unfolds deliberately, one step at a time.
It's a good idea to wait a second before taking a screenshot, to be sure the page has fully rendered after the last action.
Otherwise you could feed a blank or half-blank screen back to the model, which won't be helpful.
So you would use a computer-use model probably more for asynchronous background tasks, and not for an immediate response.

A significant real-world challenge is the prevalence of **cookie consent banners and other pop-ups**.
But the model is able to click the right _"accept"_ buttons here and there, to get rid of them, and focus on the task at hand.
Captchas can also get in the way, because websites notice that this is an automated agent at play.
But there's a way to [automate what they call _safety decisions_](https://ai.google.dev/gemini-api/docs/computer-use#safety-decisions)
(which is what I implemented in the code, by auto-acknowledgement).

Interestingly, in one of my many experiments, in moments of apparent frustration,
the model decided to **abandon the target website and default to a Google search**,
to find the information on the website it couldn't find by scrolling and clicking around!

In summary, once you acknowledge some of the potential challenges, this is clearly a fascinating technology with a promising _agentic_ future!
Imagine web agents able to handle mundane but boring web-based tasks for you, saving you precious time?
That's definitely something worth investigating!