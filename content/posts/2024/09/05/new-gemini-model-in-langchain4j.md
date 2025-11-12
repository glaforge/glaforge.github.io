---
title: "New Gemini model in LangChain4j"
date: 2024-09-05T22:42:38+02:00
image: /img/gemini/daifuku-japan-robot.jpg
tags:
  - generative-ai
  - langchain4j
  - java
  - google-cloud
  - large-language-model

similar:
  - "posts/2024/07/05/latest-gemini-features-support-in-langchain4j.md"
  - "posts/2024/09/29/lots-of-new-cool-gemini-stuff-in-langchain4j.md"
  - "posts/2024/07/25/analyzing-videos-audios-and-pdfs-with-gemini-in-langchain4j.md"
---

A new version of [LangChain4j](https://docs.langchain4j.dev/), the super powerful LLM toolbox for Java developers, was released today.
In [0.34.0](https://github.com/langchain4j/langchain4j/releases), a new Gemini model has been added.
This time, this is not the Gemini flavor from Google Cloud Vertex AI, but the [Google AI](https://ai.google.dev/gemini-api/) variant.

It was a frequently requested feature by LangChain4j users,
so I took a stab at developing a new chat model for it, during my summer vacation break.

## Gemini, show me the code!

Let's dive into some code examples to see it in action!

But first, you'll need an API key.
So just follow the instructions to [obtain your Gemini API key](https://ai.google.dev/gemini-api/docs/api-key).
I've saved mine in the `GEMINI_AI_KEY` environment variable,
so that I don't have to hardcode it in my source files.

The code examples below have been compiled with Java 21.

I've imported the following libraries in my build tool:

- `dev.langchain4j:langchain4j-google-ai-gemini:0.34.0`
- `dev.langchain4j:langchain4j-core:0.34.0`
- `dev.langchain4j:langchain4j:0.34.0`

### Let's be polite and say hello

My mom always told me to be polite and to say hello:

```java
ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .build();

String response = gemini.generate("Konnichiwa Gemini!");

System.out.println("Gemini> " + response);
// Gemini> Konnichiwa! It's nice to hear from you.
//         What can I do for you today?
```

### Don't you like strawberries?

In the first example, I used the usual `generate()` method to send my greeting to Gemini.
But LangChain4j 0.34 introduces some new signatures and classes to interact with an LLM:

- `ChatRequest`: a new class that contains your conversation messages,
  the tools this request can use, and a response format definition to decide
  what should be the shape of the output
- `ChatResponse`: this class holds the LLM's response, the token usage information,
  and the _finish_ reason (ie. if the response was cut, filtered, or was generated till the end)
- `ChatResponse chat(ChatRequest req)`: this new method is added to the LLM contract to interact with it.

```java
ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .build();

ChatResponse chatResponse = gemini.chat(ChatRequest.builder()
    .messages(UserMessage.from(
        "How many R's are there in the word 'strawberry'?"))
    .build());

String response = chatResponse.aiMessage().text();

System.out.println("Gemini> " + response);
// Gemini> There are **three** R's in the word "strawberry".
```

### Let's roll the JSON dice!

Both Gemini 1.5 Flash and Pro allow you to specify that the output should be valid JSON.
It's sometimes called the **JSON mode**.

```java
ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .responseMimeType("application/json")
    .build();

String roll = gemini.generate("Roll a 6-sided dice");

System.out.println(roll);
// {"roll": "3"}
```

Gemini will always reply with valid JSON structures.

Here, the JSON object key is not always `roll`, and is sometimes `die`, `dice_roll`, etc.
But you could tweak your prompt to ask for a specific key name.

Gemini follows the instructions very precisely, but it's not guaranteed 100% that it will really use the requested key name.
But fear not, there's an even more powerful solution, thanks to response formats!

### Let's cook something with our strawberries

You can configure Gemini to make it generate outputs that comply with a JSON schema.
It's sometimes called **controlled generation**, or **constrained decoding**.

Let's say we have a schema that represents recipes!
It's time to do something with our strawberries!

```java
ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .responseSchema(JsonSchema.builder()
        .rootElement(JsonObjectSchema.builder()
            .properties(Map.of(
                "title", JSON_STRING_SCHEMA,
                "preparationTimeMinutes", JSON_INTEGER_SCHEMA,
                "ingredients", JsonArraySchema.builder()
                    .items(JSON_STRING_SCHEMA)
                    .build(),
                "steps", JsonArraySchema.builder()
                    .items(JSON_STRING_SCHEMA)
                    .build()
                ))
            .build())
        .build())
    .build();

String recipeResponse = gemini.generate(
    "Suggest a dessert recipe with strawberries");

System.out.println(recipeResponse);

/*
{"ingredients": ["1 pint fresh strawberries, hulled and sliced",
"1/2 cup sugar", "1/4 cup water", "1 tablespoon lemon juice",
"1/2 teaspoon vanilla extract", "1 cup heavy cream, whipped"],
"preparationTimeMinutes": 30, "steps": ["In a saucepan, combine
the sugar, water, and lemon juice. Bring to a boil over medium
heat, stirring until the sugar is dissolved.", "Reduce the heat
to low and simmer for 5 minutes, or until the syrup thickens
slightly.", "Remove from heat and stir in the vanilla extract.",
"Pour the syrup over the strawberries in a bowl and stir to coat.",
"Refrigerate for at least 30 minutes, or until chilled.",
"To serve, top the strawberries with whipped cream and enjoy!"],
"title": "Strawberry Shortcake"}
 */
```

Gemini strictly follows the specified JSON schema, and generates a JSON object that matches.

This is particularly important when you integrate LLMs in your application.
You want a deterministic format for the output that can easily be parsed and handled by your system.

### Tasty strawberries from Japan!

A few months back, I had the chance to visit Japan with my family,
and they have some really gorgeous and tasty strawberries there!
And don't get me started on strawberry daifukus (mochis with fruits inside) we had in Osaka!

But before tasting those lovely confections, we need to plan our trip to Japan.

In the previous example, you might have found that a bit painful to describe the JSON schema.
For the integration in a Java application, you might have some more complex data structures to represent,
so deriving the big schema to define them can be tedious.
Fortunately, there's a little trick to get the JSON schema for a Java class (or record, enum, etc.).

Let's define and describe our trip itinerary object:

```java
@Description("details of a trip itinerary")
record TripItinerary(
    String country,
    Integer numberOfPersons,
    Month month,
    @Description("key highlights when visiting the city")
    List<CityHighlights> cityHighlights
) {
    enum Month {
        JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY,
        AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER
    }

    record CityHighlights(
        String cityName,
        List<String> visitHighlights
    ) { }
}
```

The itinerary is represented by some records, enums, and lists,
and the `@Description` annotation can help the LLM to better understand what some elements might be about
(in particular when you have some cryptic field names, but here,
it's not strictly necessary as Gemini is smart enough to understand what each field is about)

Now let's ask for our Japan itinerary:

```java
ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .temperature(2.0)
    .responseSchema(jsonSchemaFrom(TripItinerary.class).get())
    .build();
```

We derive the JSON schema from the `TripItinerary` class.
No need to tediously craft a JSON schema for it.

Let's see what Gemini suggests for our visit:

```java
Response<AiMessage> tripResponse = gemini.generate(
    SystemMessage.from("You are an expert trip planner"),
    UserMessage.from("""
        Suggest an itinerary for Japan.
        Cities visited: Tokyo, Kyoto, Osaka.
        Trip for a family of 4 persons.
        Provide key highlights for each city visited.
        """)
);
```

We tell Gemini to act as an expert trip planner, and we give some details about the travellers, the cities we'd like to visit.

So what's the JSON structured output for this Japan visit?

```java
System.out.println(tripResponse);
/*
{"cityHighlights": [{"cityName": "Tokyo", "visitHighlights":
["Explore the vibrant Shibuya Crossing and the iconic Shibuya
Scramble.", "Visit the Meiji Jingu Shrine, a serene oasis in
the heart of Tokyo.", "Experience the fascinating world of
technology at the Miraikan National Museum of Emerging Science
and Innovation.", "Enjoy a traditional tea ceremony at one of
Tokyo's many teahouses.", "Get lost in the eclectic streets
of Harajuku and admire the unique fashion styles.", "Embark
on a scenic boat trip on the Sumida River, passing by Tokyo
Skytree.", "Indulge in a delightful sushi dinner at a renowned
Tsukiji Fish Market.", "Discover the charm of Ueno Park, home
to museums, temples, and the Ueno Zoo."]}, {"cityName": "Kyoto",
"visitHighlights": ["Wander through the serene gardens of the
Golden Pavilion (Kinkaku-ji).", "Immerse yourselves in the rich
history of the Kiyomizu-dera Temple, famous for its wooden stage.",
"Explore the ancient Gion district, known for its traditional
wooden buildings and geisha houses.", "Stroll through the Fushimi
Inari Shrine, famous for its thousands of red torii gates.",
"Discover the treasures of the Nishiki Market, offering a diverse
selection of food and crafts.", "Experience a traditional geisha
performance at one of Kyoto's exclusive theaters.", "Learn the
art of calligraphy at a traditional workshop in the Gion district.",
"Relax in the serene atmosphere of the Ryoan-ji Zen Garden.",
"Witness the beauty of the Arashiyama Bamboo Grove."]},
{"cityName": "Osaka", "visitHighlights": ["Experience the vibrant
Dotonbori district, renowned for its neon lights, street food,
and entertainment.", "Explore the Osaka Castle, a historic
landmark and symbol of the city.", "Enjoy the breathtaking
panoramic views from the Abeno Harukas, Japan's tallest
skyscraper.", "Visit the Osaka Aquarium Kaiyukan, home to diverse
marine life from around the world.", "Stroll through the lively
Kuromon Market, known for its fresh seafood and local produce.",
"Take a scenic ride on the Osaka Ferris Wheel, offering views of
the cityscape.", "Indulge in the delicious okonomiyaki, Osaka's
signature dish.", "Experience the unique culture of the Sumiyoshi
Taisha Shrine, dedicated to the gods of seafaring."]}],
"country": "Japan", "month": "MARCH", "numberOfPersons": 4}
 */
```

Damn! It didn't even mention the most delicious daifukus we had in Osaka!

### Can I go outside without my umbrella in Osaka, tonight?

Speaking of visiting Osaka and those great daifukus, what's the weather like there?
It's been raining a lot in Paris today, so I'm curious if it's better in Osaka.

This new Gemini chat model works with LangChain4j's higher-level abstractions: `AiServices`,
to create some very powerful LLM based apps, like smart agents or RAG (Retrieval Augmented Generation).

We'll have a look at a great use case for LLMs: **data extraction from free-form text**.

Let's define and describe a weather forecast record:

```java
record WeatherForecast(
    @Description("minimum temperature")
    Integer minTemperature,
    @Description("maximum temperature")
    Integer maxTemperature,
    @Description("chances of rain")
    boolean rain
) { }
```

We'll also create an interface for our weather service contract:

```java
interface WeatherForecastAssistant {
    WeatherForecast extract(String forecast);
}
```

Let's configure Gemini, instantiate our weather assistant,
and extract the weather forecast from today's newspaper:

```java
ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .build();

WeatherForecastAssistant forecastAssistant =
    AiServices.builder(WeatherForecastAssistant.class)
        .chatLanguageModel(gemini)
        .build();

WeatherForecast forecast = forecastAssistant.extract("""
    Morning: The day dawns bright and clear in Osaka, with crisp
    autumn air and sunny skies. Expect temperatures to hover
    around 18°C (64°F) as you head out for your morning stroll
    through Namba.
    Afternoon: The sun continues to shine as the city buzzes with
    activity. Temperatures climb to a comfortable 22°C (72°F).
    Enjoy a leisurely lunch at one of Osaka's many outdoor cafes,
    or take a boat ride on the Okawa River to soak in the beautiful
    scenery.
    Evening: As the day fades, expect clear skies and a slight chill
    in the air. Temperatures drop to 15°C (59°F). A cozy dinner at a
    traditional Izakaya will be the perfect way to end your day in
    Osaka.
    Overall: A beautiful autumn day in Osaka awaits, perfect for
    exploring the city's vibrant streets, enjoying the local cuisine,
    and soaking in the sights.
    Don't forget: Pack a light jacket for the evening and wear
    comfortable shoes for all the walking you'll be doing.
    """);

System.out.println("Gemini> " + forecast);
// Gemini> WeatherForecast[
//             minTemperature=15,
//             maxTemperature=22,
//             rain=false]
```

Awesome, no need for my umbrella!

What's great here is that we're dealing with a real type-safe Java object, not JSON strings like before.
So it integrates very well within our Java codebase!

### Time for a little coding quiz

Alright, after the touristic detour, let's get back to some math, and some coding.
LLMs are quite good at reasoning, in particular when you encourage them to think _step by step_.
But sometimes, they fall short, and can't really calcuate results.
They're language models, not calculators, right?

Gemini has the ability to create some Python scripts, and to execute them in a sandbox.
So how can we configure Gemini for solving a little math problem?

```java
ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .allowCodeExecution(true)
    .includeCodeExecutionOutput(true)
    .build();
```

There are 2 builder methods:

- `allowCodeExecution(true)`: to let Gemini know it can do some Python coding
- `includeCodeExecutionOutput(true)`: if you want to see the actual Python script it came up with, and the output of its execution

Do you know off head how much is `fibonacci(22)` or `ackermann(3, 4)`?
Let's ask Gemini:

```java
Response<AiMessage> mathQuizz = gemini.generate(
    SystemMessage.from("""
        You are an expert mathematician.
        When asked a math problem or logic problem,
        you can solve it by creating a Python program,
        and execute it to return the result.
        """),
    UserMessage.from("""
        Implement the Fibonacci and Ackermann functions.
        What is the result of `fibonacci(22)` - ackermann(3, 4)?
        """)
);
```

Looks like Gemini is a Python and math wiz:

````
Code executed:
```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

def ackermann(m, n):
    if m == 0:
        return n + 1
    elif n == 0:
        return ackermann(m - 1, 1)
    else:
        return ackermann(m - 1, ackermann(m, n - 1))

print(fibonacci(22) - ackermann(3, 4))
```
Output:
```
17586
```
The result of `fibonacci(22) - ackermann(3, 4)` is **17586**.

I implemented the Fibonacci and Ackermann functions in Python.
Then I called `fibonacci(22) - ackermann(3, 4)` and printed the result.
````

If you don't include the script code and output, you would receive only the end of the message:

```
The result of `fibonacci(22) - ackermann(3, 4)` is **17586**.

I implemented the Fibonacci and Ackermann functions in Python.
Then I called `fibonacci(22) - ackermann(3, 4)` and printed the result.
```

I didn't encounter any snake in Japan, but I'm happy Gemini can write some Python functions when needed!

### What about the weather in Tokyo?

Besides this Python code execution sandbox, the more traditional **function calling** mechanism works.
We heard about the weather in Osaka, now let's ask for Tokyo.

Let's define a _tool_ to retrieve structured weather forecasts:

```java
record WeatherForecast(
    String location,
    String forecast,
    int temperature) {}

class WeatherForecastService {
    @Tool("Get the weather forecast for a location")
    WeatherForecast getForecast(
        @P("Location to get the forecast for") String location) {
        if (location.equals("Paris")) {
            return new WeatherForecast("Paris", "sunny", 20);
        } else if (location.equals("London")) {
            return new WeatherForecast("London", "rainy", 15);
        } else if (location.equals("Tokyo")) {
            return new WeatherForecast("Tokyo", "warm", 32);
        } else {
            return new WeatherForecast("Unknown", "unknown", 0);
        }
    }
}
```

We need a weather forecast assistant as well, that we'll instantiate and configure with our tool, thanks to `AiServices`:

```java
interface WeatherAssistant {
    String chat(String userMessage);
}

WeatherForecastService weatherForecastService =
    new WeatherForecastService();

ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .temperature(0.0)
    .build();

WeatherAssistant weatherAssistant =
    AiServices.builder(WeatherAssistant.class)
        .chatLanguageModel(gemini)
        .tools(weatherForecastService)
        .build();

String tokyoWeather = weatherAssistant.chat(
        "What is the weather forecast for Tokyo?");

System.out.println("Gemini> " + tokyoWeather);
// Gemini> The weather forecast for Tokyo is warm
//         with a temperature of 32 degrees.
```

I didn't expect such warm temperatures in Tokyo!
Well, of course, it's all fake, but you can imagine calling a real weather service.

The beauty of LangChain4j's `AiServices` is that it handles calling the service for you.
Usually, with function calling, the LLM just replies with a request that says _you_ should be calling a tool or API,
and give it back the tool/API's answer.
Here, with `AiServices`, it's all automatic and transparent.

### Of parrots pictures, text files, and multimodality

Let's finish our whirlwind tour of this Google AI Gemini model for LangChain4j
with an example that highlights **Gemini's multimodal capabilities**.

Gemini is a multimodal LLM: in input, in addition to text, it accepts pictures, videos, audio, PDF files, and text files.

Let's ask what Gemini thinks of the cute colorful parrot mascot of LangChain4j.

```java
// README.md markdown file from LangChain4j's project Github repos
String base64Text = b64encoder.encodeToString(readBytes(
  "https://github.com/langchain4j/langchain4j/blob/main/README.md"));

// PNG of the cute colorful parrot mascot of the LangChain4j project
String base64Img = b64encoder.encodeToString(readBytes(
  "https://avatars.githubusercontent.com/u/132277850?v=4"));

ChatLanguageModel gemini = GoogleAiGeminiChatModel.builder()
    .apiKey(System.getenv("GEMINI_AI_KEY"))
    .modelName("gemini-1.5-flash")
    .build();

Response<AiMessage> response = gemini.generate(
    UserMessage.from(
        TextFileContent.from(base64Text, "text/x-markdown"),
        ImageContent.from(base64Img, "image/png"),
        TextContent.from("""
            Do you think this logo fits well
            with the project description?
            """)
    )
);

System.out.println("Gemini> " + response);
/*
   Gemini> The logo of a parrot drinking tea doesn't seem like a
   good fit for a project description of a Java version of LangChain.
   It's not clear how the logo relates to the project's purpose or
   functionality. A logo that better reflects the project's technical
   nature, such as a stylized representation of code or a language
   model, would be more appropriate.
 */
```

Ah well, looks like LLM don't want to be compared to _stochastic parrots_,
so it thinks the parrot mascot doesn't represent the project well enough!

Sorry Gemini, I have to disagree, I really love this logo!

This example shows that you can craft an elaborate prompt that contains a text query,
an external text file (the description of the project in Markdown format),
and the picture of the parrot mascot.

## Let's wrap up — with beautiful 'furoshiki' fabric!

Throughout this journey through code examples, strawberries, daifukus, Japan itineraries and weather forecasts,
you learned about the brand new LangChain4j module for Google AI's Gemini API, and its capabilities.
I hope this article makes you want to try it out!

Before calling it a day or night (depending on your timezone), I'd like to mention some limitations,
as it's still early days for this new module:

- Currently, there's only a `ChatLanguageModel` available,
  but no `StreamingChatLanguageModel` class, so you won't get streamed responses yet.
- Gemini's content caching capability is not surfaced in this implementation,
  so you can't use caching to save some bucks or yens.
- For multimodality, you should pass the Base64 encoded bytes of the files, and not use URLs to reference those resources,
  as this module doesn't yet upload files to Gemini's file service (Gemini won't download from an external URL).

Hopefully, the community will adopt this module, work with it, provide feedback to help us improve it further!
Don't hesitate to reach out with questions or to report any problems you encounter.
And if you build something cool, please tell me too!
