---
title: "Mastering agentic workflows with ADK for Java: Sequential agents"
date: 2025-07-24T08:58:00+02:00
tags:
  - java
  - agent-development-kit
  - ai-agents
  - large-language-models
image: /img/adk/adk-paris-sequential.jpg

similar:
  - "posts/2025/07/29/mastering-agentic-workflows-with-ADK-the-recap.md"
  - "posts/2025/07/23/mastering-agentic-workflows-with-ADK-sub-agents.md"
  - "posts/2025/07/25/mastering-agentic-workflows-with-ADK-parallel-agent.md"
---

In the [first part of this series]({{<ref "/posts/2025/07/23/mastering-agentic-workflows-with-ADK-sub-agents.md" >}}), we explored the _"divide and conquer"_ strategy using **sub-agents** to create a flexible, modular team of AI specialists. This is perfect for situations where the user is in the driver's seat, directing the flow of conversation. But what about when the _process_ itself needs to be in charge?

Some tasks are inherently linear. You have to do Step A before Step B, and Step B before Step C. Think about a CI/CD pipeline: you build, then you test, then you deploy. You can't do it out of order... or if you do, be prepared for havoc!

For these situations, the [ADK for Java](https://github.com/google/adk-java) provides another powerful tool in our orchestration toolbox: the **`SequentialAgent`**.

## When order matters: the sequential workflow

A sequential workflow is all about creating a predictable, step-by-step process. Unlike the flexible sub-agent model where an orchestrator LLM decides which sub-agent to invoke and when, a `SequentialAgent` executes a predefined list of agents in a fixed order.

This is useful for:

- **Automating multi-step processes:** Guiding a user through a fixed procedure, like a trip planner or a complex data analysis pipeline.
- **Ensuring consistency:** Guaranteeing that tasks are always performed in the correct sequence for reliable and predictable outcomes.
- **Building on previous results:** Creating workflows where the output of one step is the essential input for the next.

## A practical example: a `trip-planner`

Let's dive into our `SequentialFlow.java` example (code further down). This code defines a `trip-planner` agent that guides a user through the process of planning a vacation. You can't suggest restaurants before you have an itinerary, and you can't build an itinerary before you've researched the destination. This is a perfect use case for a `SequentialAgent`.

Our `trip-planner` consists of three specialist agents that will be executed in a specific order:

1.  **`destination-researcher`**: The first step. It takes a user's request (e.g., _"a romantic weekend in Paris"_) and finds suitable attractions.
2.  **`itinerary-creator`**: The second step. It takes the list of attractions from the previous step and organizes it into a logical 2-day plan.
3.  **`restaurant-suggester`**: The final step. It takes the completed itinerary and enriches it with relevant lunch and dinner recommendations.

I'll show you the full source code here first, but then in subsequent sections, we'll explore each steps in more detail.

{{< details summary="Click to see the full source code, before diving in" >}}

```java
var destinationResearcher = LlmAgent.builder()
    .name("destination-researcher")
    .description("""
        Finds points of interest for a given destination
        and travel style.
        """)
    .instruction("""
        Your role is to find points of interest for a given
        city and travel style, according to the duration of
        the trip, and potentially budget.
        Use the Google Search Tool to find relevant information.
        Present the results as a simple bullet point list
        of key attractions.
        """)
    .model("gemini-2.0-flash")
    .tools(new GoogleSearchTool())
    .outputKey("destination-research")
    .build();

var itineraryCreator = LlmAgent.builder()
    .name("itinerary-creator")
    .description("""
        Creates an itinerary from a list of attractions.
        """)
    .instruction("""
        Your role is to create a logical itinerary
        from the provided list of attractions:

        {destination-research}

        Group the attractions by proximity or theme for each day.
        Present the itinerary clearly, with each day's plan laid out.
        """)
    .model("gemini-2.0-flash")
    .outputKey("itinerary")
    .build();

var restaurantSuggester = LlmAgent.builder()
    .name("restaurant-suggester")
    .description("""
        Suggests restaurants for each day of the itinerary.
        """)
    .instruction("""
        Your role is to suggest one lunch and one dinner restaurant
        for each day of the itinerary:

        {itinerary}

        Use the Google Search Tool to find restaurants
        that are near the day's activities
        and match the overall travel style.
        Add the restaurant suggestions to the itinerary.
        """)
    .model("gemini-2.0-flash")
    .tools(new GoogleSearchTool())
    .build();

return SequentialAgent.builder()
    .name("trip-planner")
    .description("""
        Helps you plan a trip by finding attractions,
        creating an itinerary, and suggesting restaurants.
        """)
    .subAgents(
        destinationResearcher,
        itineraryCreator,
        restaurantSuggester
    )
    .build();
```

{{</ details >}}

## The magic ✨ of state passing: `outputKey`

_"But wait,"_ you ask, _"if these are separate agents, how does the `itinerary-creator` know what the `destination-researcher` found?"_

This is the core mechanism of the `SequentialAgent`: **passing state between agents**. The ADK makes this incredibly simple and elegant using an `outputKey`.

Here’s how it works:

1.  **The _producer_ agent:** The agent that generates the data uses the `.outputKey("some-key")` method. This tells the `SequentialAgent` to store the final result of this agent's turn in a context variable named `some-key`.

    ```java
    var destinationResearcher = LlmAgent.builder()
        .name("destination-researcher")
        // ... instructions ...
        .outputKey("destination-research") // <-- Produces the data
        .build();
    ```

2.  **The _consumer_ agent:** The next agent in the sequence can then reference this stored data directly in its instructions using curly braces: `{some-key}`.

    ```java
    var itineraryCreator = LlmAgent.builder()
        .name("itinerary-creator")
        .instruction("""
            Your role is to create a logical itinerary
            from the provided list of attractions:

            {destination-research} // <-- Consumes the data

            Group the attractions by proximity or theme for each day.
            """)
        .outputKey("itinerary") // Can produce data for the next agent!
        .build();
    ```

The ADK handles the injection automatically. The `{destination-research}` placeholder will be replaced by the full output of the `destinationResearcher` agent before the prompt is sent to the `itineraryCreator` agent.

## Building the `SequentialAgent`

Putting it all together is straightforward. We use the `SequentialAgent.builder()` and provide our agents to the `.subAgents()` method.
The key difference here is that **the order is strictly enforced**.

```java
return SequentialAgent.builder()
    .name("trip-planner")
    .description("""
        Helps you plan a trip by finding attractions,
        creating an itinerary, and suggesting restaurants.
        """)
    .subAgents(
        destinationResearcher, // will always run first
        itineraryCreator,      // will always run second
        restaurantSuggester    // will always run third
    )
    .build();
```

When this agent runs, it will execute `destinationResearcher`, take its output, feed it into `itineraryCreator`, take _its_ output, feed it into `restaurantSuggester`, and finally return the completed, enriched itinerary to the user.
The last agent could also reference the output of the first agent if needed, for full context awareness!

## Example run

{{< details summary="Click to see the the output of a full run" >}}

Ideally, you would have a first agent collecting key information like the destination, number of days of the stay, the budget you plan to spend, the types of attractions you'd like to visit, and the sort of cuisine you want to eat.
Here, I'm going straight with the full detailed request:

```
👤 You > Plan a trip of 5 days in Paris, with a medium budget,
to visit the key tourist attractions (museums, parks, landmarks),
and eat French cuisine!
```

Let's see what the destination research replies:

```
🤖 destination-researcher >

Okay, I can help you plan a 5-day trip to Paris focusing on key
tourist attractions, French cuisine, and keeping it within a medium
budget. Here are some ideas:

Here is a possible itinerary for your 5-day trip to Paris:

Attractions:

*   Eiffel Tower: A must-see iconic landmark. Consider booking timed
    tickets in advance to avoid long queues. You can climb to the
    second floor or the top for panoramic views.
*   Louvre Museum: One of the world's largest and most visited
    museums, home to masterpieces like the Mona Lisa. Booking a time
    slot in advance is essential.
*   Arc de Triomphe: Climb to the top of the Arc for stunning views
    of the Champs-Élysées and the city.
*   Notre Dame Cathedral: While still undergoing restoration, you can
    view the cathedral from the outside and visit the archeological
    crypt.
*   Seine River Cruise: A relaxing way to see many of Paris's famous
    landmarks from a different perspective. Many cruises depart
    near the Eiffel Tower.
*   Musée d'Orsay: Housed in a former railway station, this museum
    features Impressionist and Post-Impressionist art.
*   Palace of Versailles: A former royal residence, this opulent
    palace and its gardens are a must-see. Advance booking is required.
*   Sainte-Chapelle: Known for its stunning stained glass windows.
    Booking a timeslot in advance is recommended.
*   Montmartre & Sacré-Cœur Basilica: Explore the artistic neighborhood
    of Montmartre and visit the Sacré-Cœur Basilica for panoramic views.

Parks & Gardens:

*   Luxembourg Gardens: A beautiful and popular park with gardens,
    fountains, and activities.
*   Tuileries Garden: Located between the Louvre and Place de la
    Concorde, this formal garden is perfect for a stroll.
*   Parc des Buttes-Chaumont: One of the most beautiful and unique
    gardens in Paris, with an artificial mountain structure and
    impressive panoramic views.
*   Parc Monceau: An English-style garden with follies, statues,
    and children's play areas.

Food:

*   Bouillon Chartier: Offers traditional French cuisine
    at affordable prices.
*   Chez Gladines: Serves hearty Basque-inspired cuisine
    at reasonable prices.
*   Le Bistrot des Vosges: A no-frills restaurant with classic
    French dishes at affordable prices.
*   Brasserie Dubillot: An all-day spot for affordable
    French classics.
*   Explore local markets: Visit Rue Montorgueil
    for a taste of local market life.

Possible Itinerary Outline:

*   Day 1: Eiffel Tower, Champ de Mars, Seine River cruise,
           Arc de Triomphe, Champs-Élysées.
*   Day 2: Louvre Museum, Tuileries Garden, Place de la Concorde,
           Sainte-Chapelle, Notre Dame (exterior).
*   Day 3: Montmartre (Sacré-Cœur Basilica, Place du Tertre),
           Moulin Rouge (exterior), explore the neighborhood.
*   Day 4: Versailles Palace and Gardens (allow a full day).
*   Day 5: Musée d'Orsay, Luxembourg Gardens,
           explore the Latin Quarter.

Tips for a Medium Budget:

*   Paris Museum Pass: Consider purchasing a Paris Museum Pass
    for access to over 50 museums and monuments.
    A 4-day pass might be a good option.
*   Free museum days: Some museums offer free entry on the first
    Sunday of the month, but be prepared for crowds.
*   Lunch menus: Many restaurants offer affordable fixed-price
    lunch menus.
*   Picnics: Enjoy picnics in the parks and gardens
    to save money on meals.
*   Transportation: Use the efficient
    and affordable Paris Metro system.
*   Accommodation: Consider staying in areas slightly outside
    the city center for more affordable options.
*   Look for "bouillons": These restaurants serve traditional
    French food at reasonable prices.

Enjoy your trip to Paris!
```

It found some good suggestions for the duration of the trip, and does so considering the allocated budget.

Now let's see what the itinerary agent comes up with:

```
🤖 itineraryCreator >

Okay, here is a possible 5-day Paris itinerary with a medium budget,
focusing on key attractions, French cuisine,
and efficient use of time:

Day 1: Iconic Paris & Latin Quarter Charm

*   Morning (9:00 AM): Eiffel Tower. Pre-book tickets online to
    avoid long queues. Ascend to the second floor for stunning
    panoramic views. Budget ~€18-€29 (depending on lift access).
*   Lunch (12:00 PM): Enjoy a classic French crepe from a street
    vendor near the Eiffel Tower. Budget ~€8-€12.
*   Afternoon (1:30 PM): Champ de Mars & Musée du Quai Branly -
    Jacques Chirac. Relax in the park with views of the tower.
    Then visit the museum dedicated to non-European art and cultures.
    Museum Budget: ~€12.
*   Late Afternoon (4:30 PM): Walk or take the Metro to the
    Latin Quarter. Explore the historic Sorbonne University and
    browse the Shakespeare and Company bookstore.
    Dinner (7:30 PM): Enjoy a traditional French meal at a bistro
    in the Latin Quarter. Look for set menus (formules) for better
    value. Try a steak frites or moules marinières*. Budget ~€20-€30.

Day 2: Art, Gardens & Montmartre Magic

*   Morning (9:00 AM): Musée du Louvre. Focus on key masterpieces
    like the Mona Lisa, Venus de Milo, and Winged Victory
    of Samothrace. Pre-book tickets! Budget: ~€17.
    Lunch (12:30 PM): Grab a quick and tasty sandwich jambon-beurre
    (ham and butter sandwich) from a boulangerie* near the Louvre.
    Budget ~€5-€8.
*   Afternoon (2:00 PM): Tuileries Garden. Stroll through the
    beautiful gardens connecting the Louvre to Place de la Concorde.
*   Late Afternoon (4:00 PM): Place de la Concorde & Champs-Élysées.
    Admire the obelisk and walk along the famous avenue towards the
    Arc de Triomphe.
*   Evening (6:30 PM): Take the Metro to Montmartre. Explore the
    charming streets, visit the Sacré-Cœur Basilica, and enjoy the
    artistic atmosphere of Place du Tertre.
    Dinner (8:00 PM): Have dinner at a traditional bistro in
    Montmartre. Consider soupe à l'oignon gratinée* (French onion soup).
    Budget ~€20-€30.

Day 3: History, Notre Dame & Parisian Elegance

*   Morning (9:30 AM): Île de la Cité. Visit the Conciergerie
    (former royal palace and prison) and Sainte-Chapelle
    (stunning stained glass windows).
    Budget: Conciergerie ~€11.50, Sainte-Chapelle ~€11.50.
*   Lunch (12:30 PM): Enjoy a picnic lunch by the Seine River,
    with bread, cheese, and fruit from a local market. Budget ~€10-€15.
*   Afternoon (2:00 PM): Notre Dame Cathedral. View the cathedral
    from the outside (still under renovation but an important landmark).
    Walk around Île Saint-Louis and try Berthillon ice cream.
*   Late Afternoon (4:00 PM): Le Marais District. Explore the trendy
    Marais district, known for its Jewish heritage, art galleries,
    and boutiques. Visit Place des Vosges, the oldest planned square
    in Paris.
*   Dinner (7:30 PM): Have dinner in Le Marais. This area offers
    diverse cuisine options. Consider falafel or a crêperie. Budget ~€15-€25.

Day 4: Versailles Grandeur

*   Full Day (9:00 AM - 5:00 PM): Palace of Versailles.
    Take a train (RER C) to Versailles (approx. 45 minutes).
    Explore the palace, gardens, and Marie Antoinette's estate
    (the Petit Trianon and the Queen's Hamlet).
    Pre-book tickets! Palace and Estate of Trianon ticket ~€21.50.
*   Lunch (1:00 PM): Have lunch at one of the cafes in the
    Versailles gardens, or pack your own picnic to save money.
    Budget ~€10-€20.
*   Dinner (8:00 PM): Upon return to Paris,
    have dinner near your accommodation.

Day 5: Museums and Departure

*   Morning (9:30 AM): Musée d'Orsay. Located in a
    former train station,
    this museum houses a stunning collection of Impressionist
    and Post-Impressionist art. Budget ~€16.
    Lunch (12:30 PM): Enjoy a final French lunch at a brasserie
    near the Musée d'Orsay. Try a croque monsieur or salade niçoise*.
    Budget ~€15-€25.
*   Afternoon (2:00 PM): Depending on your departure time,
    you can visit the Centre Pompidou for modern art (~€15),
    do some souvenir shopping, or revisit a favorite spot.
*   Departure: Allow ample time to travel to the airport
    or train station.

Budget Considerations (per person per day - estimates):

*   Accommodation: €70-€120 (hostel private room/budget hotel)
*   Food: €40-€60 (mix of affordable eateries, picnics,
    and some restaurant meals)
*   Attractions: €20-€40 (depending on museum choices
    and pre-booking)
*   Transportation: €10-€15 (Metro/bus travel - consider a
    travel pass if using public transport frequently)

Tips for a Medium Budget Trip:

*   Accommodation: Consider staying in a hostel private room,
    a budget hotel in a less central location, or an Airbnb.
*   Transportation: Utilize the Paris Metro for efficient travel.
    Consider purchasing a Navigo Découverte pass for unlimited
    travel within zones 1-5.
    Food: Take advantage of affordable lunch options like formules*
    (set menus), crêpes, and sandwiches. Shop at local markets
    for picnic supplies.
*   Museums: Take advantage of free museum days (usually the first
    Sunday of the month, but check in advance). Consider the Paris
    Museum Pass if you plan to visit many museums.
*   Free Activities: Walk along the Seine, explore parks and gardens,
    visit free churches, and enjoy the atmosphere of different
    neighborhoods.

Enjoy your trip to Paris!
```

Alright, it detailed the itinerary with quite precise timings.
It already includes some culinary suggestions, but the next agent will make some concrete suggestions:

```
🤖 > restaurant-suggester

Okay, I can help you enhance your Paris itinerary with restaurant
suggestions for lunch and dinner each day, keeping your medium budget
and focus on French cuisine in mind. I will use the Google Search Tool
to find restaurants near your planned activities.

Day 1: Iconic Paris & Latin Quarter Charm

*   Morning (9:00 AM): Eiffel Tower. Pre-book tickets online to avoid
    long queues. Ascend to the second floor for stunning panoramic
    views. Budget ~€18-€29 (depending on lift access).
*   Lunch (12:00 PM): Enjoy a classic French crepe from a street
    vendor near the Eiffel Tower. Budget ~€8-€12.
    Restaurant Suggestion: Crêperie Générale* (near Eiffel Tower) -
    Quick and affordable crepes with various sweet and savory options.
*   Afternoon (1:30 PM): Champ de Mars & Musée du Quai Branly -
    Jacques Chirac. Relax in the park with views of the tower.
    Then visit the museum dedicated to non-European art and cultures.
    Museum Budget: ~€12.
*   Late Afternoon (4:30 PM): Walk or take the Metro to the Latin Quarter.
    Explore the historic Sorbonne University and browse the
    Shakespeare and Company bookstore.
    Dinner (7:30 PM): Enjoy a traditional French meal at a bistro in
    the Latin Quarter. Look for set menus (formules) for better value.
    Try a steak frites or moules marinières*. Budget ~€20-€30.
    Restaurant Suggestion: Le *Bouillon Chartier* (Latin Quarter/Grands
    Boulevards area) - A historic and very popular bouillon serving
    classic French dishes at very affordable prices. Expect queues.

Day 2: Art, Gardens & Montmartre Magic

*   Morning (9:00 AM): Musée du Louvre. Focus on key masterpieces
    like the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace.
    Pre-book tickets! Budget: ~€17.
    Lunch (12:30 PM): Grab a quick and tasty sandwich jambon-beurre
    (ham and butter sandwich) from a boulangerie* near the Louvre.
    Budget ~€5-€8.
    Restaurant Suggestion: *Boulangerie Julien* (various locations
    including near the Louvre) - Known for its traditional jambon-beurre*
    and other delicious sandwiches and pastries.
*   Afternoon (2:00 PM): Tuileries Garden. Stroll through the beautiful
    gardens connecting the Louvre to Place de la Concorde.
*   Late Afternoon (4:00 PM): Place de la Concorde & Champs-Élysées.
    Admire the obelisk and walk along the famous avenue towards the
    Arc de Triomphe.
*   Evening (6:30 PM): Take the Metro to Montmartre.
    Explore the charming streets, visit the Sacré-Cœur Basilica,
    and enjoy the artistic atmosphere of Place du Tertre.
    Dinner (8:00 PM): Have dinner at a traditional bistro in Montmartre.
    Consider soupe à l'oignon gratinée* (French onion soup).
    Budget ~€20-€30.
    Restaurant Suggestion: Le *Relais Gascon* (Montmartre) -
    Hearty Southwestern French cuisine, known for its generous portions
    and reasonable prices.

Day 3: History, Notre Dame & Parisian Elegance

*   Morning (9:30 AM): Île de la Cité. Visit the Conciergerie
    (former royal palace and prison) and Sainte-Chapelle
    (stunning stained glass windows).
    Budget: Conciergerie ~€11.50, Sainte-Chapelle ~€11.50.
*   Lunch (12:30 PM): Enjoy a picnic lunch by the Seine River,
    with bread, cheese, and fruit from a local market.
    Budget ~€10-€15.
    Restaurant Suggestion (for supplies): Marché Maubert*
    (near Île de la Cité) - A lively local market where you can
    buy fresh bread, cheese, fruits, and other picnic essentials.
*   Afternoon (2:00 PM): Notre Dame Cathedral.
    View the cathedral from the outside (still under renovation
    but an important landmark). Walk around Île Saint-Louis and
    try Berthillon ice cream.
*   Late Afternoon (4:00 PM): Le Marais District. Explore the trendy
    Marais district, known for its Jewish heritage, art galleries,
    and boutiques. Visit Place des Vosges, the oldest planned square
    in Paris.
*   Dinner (7:30 PM): Have dinner in Le Marais.
    This area offers diverse cuisine options.
    Consider falafel or a crêperie. Budget ~€15-€25.
    Restaurant Suggestion: *L'As du Fallafel* (Le Marais) -
    Famous for its delicious and affordable falafel sandwiches.
    Expect a queue, but it moves quickly.

Day 4: Versailles Grandeur

*   Full Day (9:00 AM - 5:00 PM): Palace of Versailles.
    Take a train (RER C) to Versailles (approx. 45 minutes).
    Explore the palace, gardens, and Marie Antoinette's estate
    (the Petit Trianon and the Queen's Hamlet).
    Pre-book tickets! Palace and Estate of Trianon ticket ~€21.50.
*   Lunch (1:00 PM): Have lunch at one of the cafes in the
    Versailles gardens or pack your own picnic to save money.
    Budget ~€10-€20.
    Restaurant Suggestion: *La Flotille* (Versailles Gardens) -
    A casual restaurant in the gardens offering salads, sandwiches,
    and hot dishes. A convenient option if you don't want to pack a picnic.
*   Dinner (8:00 PM): Upon return to Paris, have dinner near your accommodation.
    Restaurant Suggestion: This depends on the location of your accommodation.
    If you provide this, I can give a more specific recommendation.
    Otherwise, search for a local brasserie or bistro* in your neighborhood.

Day 5: Museums and Departure

*   Morning (9:30 AM): Musée d'Orsay. Located in a former train station,
    this museum houses a stunning collection of Impressionist and
    Post-Impressionist art. Budget ~€16.
    Lunch (12:30 PM): Enjoy a final French lunch at a brasserie
    near the Musée d'Orsay.
    Try a croque monsieur or salade niçoise*.
    Budget ~€15-€25.
    Restaurant Suggestion: *Brasserie Thoumieux* (near Musée d'Orsay) -
    A classic Parisian brasserie with a stylish Art Deco interior,
    serving traditional dishes.
*   Afternoon (2:00 PM): Depending on your departure time,
    you can visit the Centre Pompidou for modern art (~€15),
    do some souvenir shopping, or revisit a favorite spot.
*   Departure: Allow ample time to travel to the airport or train station.
    Restaurant Suggestion (if near Centre Pompidou): Crêperie Beaubourg*
    (near Centre Pompidou) - A good option for a quick and affordable
    crepe before heading to the airport.

```

There's a restaurant being suggested twice, as it's in the same area, another one that's not really French cuisine,
or sometimes it's some small food-on-the-go suggestsions to keep the budget on target.
In some places, the LLM would have liked more precise guidance to help you make a choice.
But overall, the culinary expert gave some good suggestions!

{{</ details >}}

## When to choose `SequentialAgent`

- Choose a **`SequentialAgent`** when you have a fixed, linear process where Step B logically depends on the output of Step A. It provides predictability and structure.
- Choose an **`LlmAgent` with sub-agents** (as in [part 1]({{<ref "/posts/2025/07/23/mastering-agentic-workflows-with-ADK-sub-agents.md" >}})) when you need flexibility and want the orchestrator LLM to dynamically decide the best tool or next step based on the conversational context.

By understanding both patterns, you can build incredibly robust and sophisticated AI systems tailored to the specific problem you're trying to solve.

Stay tuned for the next part of the series, where we'll explore how to run agents in parallel to handle multiple tasks at once!
