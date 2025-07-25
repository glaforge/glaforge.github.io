---
title: "Mastering agentic workflows with ADK for Java: Parallel agents"
date: 2025-07-25T10:20:33+02:00
tags:
  - java
  - agent-development-kit
  - ai-agents
  - large-language-models
image: /img/adk/adk-parallel-agent.jpg
---

Let's continue our exploration of [ADK](https://github.com/google/adk-java) for Java (Agent Development Kit for building AI agents).
In this series, we've explored two fundamental agentic workflows:

- First, we used [`LlmAgent` with sub-agents]({{<ref "/posts/2025/07/23/mastering-agentic-workflows-with-ADK-sub-agents.md" >}}) to create a flexible, manager-and-specialists model.
- Then, we used the [`SequentialAgent`]({{<ref "/posts/2025/07/24/mastering-agentic-workflows-with-ADK-sequential-agent.md" >}}) to enforce a strict, linear order of operations.

But what if your problem isn't about flexibility or a fixed sequence? What if it's about **efficiency**? Some tasks don't depend on each other and can be done at the same time. Why wait for one to finish before starting the next?

This is where the ADK for Java offers a third, powerful pattern: the **`ParallelAgent`**.

## Maximum efficiency with parallel workflows

A parallel workflow is designed to execute multiple agents concurrently. It's the perfect solution when you need to perform several independent tasks and want to get them done as quickly as possible. The `ParallelAgent` runs its sub-agents in separate threads, waits for all of them to complete, and then gathers the results.

This is ideal for:

- **Comprehensive data gathering:** Running different types of searches or analyses on the same topic simultaneously.
- **Independent sub-tasks:** Performing unrelated actions that can happen in any order.
- **Saving time:** Drastically reducing the total execution time compared to running the same tasks one after another.

## A practical example: the `market-researcher`

Let's look at our `ParallelFlow.java` example, illustrated by the below diagram:

![](/img/adk/financial-report.png)

Here's the full source code, but we'll explore each part in details further down:

{{< details summary="Click to see the full source code, before diving in" >}}

```java
var companyProfiler = LlmAgent.builder()
    .name("company-profiler")
    .description(
        "Provides a general overview of a company.")
    .instruction("""
        Your role is to provide a brief overview of the
        given company.
        Include its mission, headquarters, and current CEO.
        Use the Google Search Tool to find this information.
        """)
    .model("gemini-2.0-flash")
    .tools(new GoogleSearchTool())
    .outputKey("profile")
    .build();

var newsFinder = LlmAgent.builder()
    .name("news-finder")
    .description(
        "Finds the latest news about a company.")
    .instruction("""
        Your role is to find the top 3-4 recent news headlines
        for the given company.
        Use the Google Search Tool.
        Present the results as a simple bulleted list.
        """)
    .model("gemini-2.0-flash")
    .tools(new GoogleSearchTool())
    .outputKey("news")
    .build();

var financialAnalyst = LlmAgent.builder()
    .name("financial-analyst")
    .description(
        "Analyzes the financial performance of a company.")
    .instruction("""
        Your role is to provide a snapshot of the given company's
        recent financial performance.
        Focus on stock trends or recent earnings reports.
        Use the Google Search Tool.
        """)
    .model("gemini-2.0-flash")
    .tools(new GoogleSearchTool())
    .outputKey("financials")
    .build();

var marketResearcher = ParallelAgent.builder()
    .name("market-researcher")
    .description(
        "Performs comprehensive market research on a company.")
    .subAgents(
        companyProfiler,
        newsFinder,
        financialAnalyst
    )
    .build();

var reportCompiler = LlmAgent.builder()
    .name("report-compiler")
    .description(
        "Compiles a final market research report.")
    .instruction("""
        Your role is to synthesize the provided information
        into a coherent market research report.
        Combine the company profile, latest news, and
        financial analysis into a single, well-formatted report.

        ## Company Profile
        {profile}

        ## Latest News
        {news}

        ## Financial Snapshot
        {financials}
        """)
    .model("gemini-2.0-flash")
    .build();

return SequentialAgent.builder()
    .name("company-detective")
    .description(
        "Collects various market information about a company.")
    .subAgents(
        marketResearcher,
        reportCompiler
    ).build();
```

{{</ details >}}

Now let's zoom in.
We've built a `market-researcher` designed to quickly compile a report on a public company.
The research involves several distinct tasks that don't depend on each other:

- **`company-profiler`**: Finds the company's mission, CEO, headquarter, etc.
- **`news-finder`**: Scans for recent news headlines.
- **`financial-analyst`**: Looks up stock performance.

Those agents are taking advantage of the `GoogleSearchTool` to find up-to-date information, beyond LLM's training cut-off date.

We can run all three of these at the same time. Each agent is configured with an `outputKey` to store its findings, just like we saw with the `SequentialAgent`.

```java
var companyProfiler = LlmAgent.builder()
    .name("company-profiler")
    // ...
    .outputKey("profile")
    .build();

var newsFinder = LlmAgent.builder()
    .name("news-finder")
    // ...
    .outputKey("news")
    .build();

var financialAnalyst = LlmAgent.builder()
    .name("financial-analyst")
    // ...
    .outputKey("financials")
    .build();
```

## The best of both worlds: a hybrid sequential-parallel flow

Now, here's where we take our architecture to the next level.
We're composing different flows, by **embedding our `ParallelAgent` inside a `SequentialAgent`**.

This creates a multi-stage pipeline that combines the efficiency of parallel execution with the structured order of a sequence.

Here's how our hybrid `company-detective` works.
It's a `SequentialAgent` agent.
It will trigger the parallel flow, and once it completes, it will compile the final report from the output of the parallel agents.

The sequential agent combines two steps:

```java
return SequentialAgent.builder()
    .name("company-detective")
    .description(
        "Collects various market information about a company.")
    .subAgents(
        marketResearcher,
        reportCompiler
    ).build();
```

1.  **Step 1 (in parallel):** Sub-agents are collecting information in parallel about the company, the latest news, and its financial status.

    ```java
    var marketResearcher = ParallelAgent.builder()
        .name("market-researcher")
        .description(
            "Performs comprehensive market research on a company.")
        .subAgents(
            companyProfiler,
            newsFinder,
            financialAnalyst
        )
        .build();
    ```

    This agent's only job is to execute the three research tasks concurrently.
    Once all three are done, it bundles their outputs (`profile`, `news`, `financials`) and passes them to the next stage in the sequence, thanks to `outputKey`s.

2.  **Step 2 (sequentially):** A final `report-compiler` agent runs.

    ```java
    var reportCompiler = LlmAgent.builder()
        .name("report-compiler")
        .instruction("""
            Your role is to synthesize the provided information...

            ## Company Profile
            {profile}

            ## Latest News
            {news}

            ## Financial Snapshot
            {financials}
            """)
        .build();
    ```

    This agent is a standard step in our `SequentialAgent`. It takes the collected data from the completed parallel step and formats it into a clean, final report.

By structuring our flow this way, we've created a highly modular and extensible pipeline. The parallel research block is a self-contained, reusable component. We could easily add more sequential steps before or after it, like a step to verify the company's stock ticker first, or a final step to email the report.

## Example run

I asked my composite agent: `Give me a report about Google`.
It ran through the various agents, and generated the following report about the company:

{{< details summary="Click to read the full report" >}}

```
## Google: Market Research Report (Q2 2025)

Executive Summary:

This report provides an overview of Google, its recent performance,
and current market position. Google, a subsidiary of Alphabet Inc.,
continues to be a dominant force in the technology industry, driven
by its core search engine, cloud services, and advancements in
artificial intelligence. Recent financial results for Q2 2025
exceeded expectations, demonstrating strong growth across key
segments. However, Google faces ongoing antitrust scrutiny and
reputational challenges.

1. Company Profile:

*   Name: Google (a subsidiary of Alphabet Inc.)
*   Mission: To organize the world's information and make it
    universally accessible and useful.
*   Headquarters: 1600 Amphitheatre Parkway, Mountain View,
    California (Googleplex)
*   CEO: Sundar Pichai (also CEO of Alphabet Inc.)

2. Latest News & Developments:

*   Antitrust Lawsuit: Illinois has joined an antitrust lawsuit
    accusing Google of monopolizing advertising technology, adding
    to the legal challenges faced by the company.
*   Antitrust Violation: A federal judge ruled that Google violated
    antitrust laws, further highlighting regulatory pressures.
*   Google Maps Update: Google Maps is now displaying the Gulf of
    Mexico as the "Gulf of America" for U.S. users, sparking some
    controversy and discussion.
*   BadBox 2.0 Botnet: Google is taking legal action against the
    BadBox 2.0 botnet, demonstrating its commitment to cybersecurity
    and protecting its users.

3. Financial Analysis (Q2 2025):

Alphabet Inc. reported strong financial results for the second
quarter of 2025, exceeding analysts' expectations.

*   Revenue: Consolidated revenue increased by 14% year-over-year
    to $96.4 billion (13% increase in constant currency).
    *   Google Services revenue increased by 12% to $82.5 billion,
        driven by Google Search, YouTube ads, and Google
        subscriptions.
    *   Google Cloud revenue increased by 32% to $13.6 billion,
        fueled by growth in Google Cloud Platform (GCP), AI
        Infrastructure, and Generative AI Solutions. The annual
        revenue run-rate for Google Cloud now exceeds $50 billion.
*   Operating Income: Increased by 14%, with an operating margin
    of 32.4%.
*   Net Income: Increased by 19%, and Earnings Per Share (EPS)
    increased by 22% to $2.31.
*   Capital Expenditures: Increased investment to approximately
    $85 billion in 2025 due to strong demand for cloud products
    and services.

4. Stock Performance & Trends:

*   Stock Performance: Alphabet's Class A shares initially fell
    slightly in after-hours trading but then rose by 2%.
    The stock was up about 1% for 2025 through Wednesday's close.
*   Analyst Ratings: The average rating for GOOG stock is "Buy,"
    with a 12-month stock price target of $206.35, representing a
    potential increase of 7.75%.
*   Recent Stock Movement: GOOG stock has risen by 3.96% compared
    to the previous week and 14.52% over the last month.
*   52-Week Range: $140.53 (low) to $207.05 (high).
*   AI Impact: Google's AI Overview tool has over 2 billion monthly
    users, boosting search impressions by 49% since launch.
*   Long-Term Growth: An investment of $1,000 in Alphabet stock at
    its IPO in 2004 would be worth approximately $75,272 today,
    reflecting a compound annual growth rate of 22.92% over 21 years.

5. Key Takeaways & Future Outlook:

*   AI as a Growth Driver: Sundar Pichai emphasizes that AI is
    positively impacting every part of the business and driving
    strong momentum. Google's advancements in AI are expected to
    continue to be a significant growth driver.
*   Cloud Services Expansion: The strong growth in Google Cloud
    revenue signifies its increasing competitiveness in the cloud
    computing market, challenging leaders like AWS and Azure.
    Increased capital expenditure in this area further indicates
    Google's commitment to expanding its cloud infrastructure.
*   Financial Strength: Alphabet's Q2 2025 results demonstrate
    its robust financial health and ability to generate significant
    revenue and profit.
*   Potential Challenges: Ongoing antitrust lawsuits and scrutiny
    pose risks to Google's market dominance and could potentially
    lead to changes in its business practices. Public perception
    issues, such as those arising from the Google Maps update,
    require careful management.

6. Conclusion:

Google remains a powerful and influential company with a strong
financial foundation and a commitment to innovation. Its investments
in AI and cloud computing position it well for future growth.
However, the company must navigate regulatory challenges and manage
its public image effectively to maintain its market leadership.
The overall outlook for Google appears positive, contingent on
its ability to adapt to evolving market dynamics and regulatory
pressures.
```

{{</ details >}}

## Choosing the right workflow

Let's quickly recap the three patterns we've covered:

- **`LlmAgent` with sub-agents:** Choose this for **flexibility**. The orchestrator LLM decides the best next step. It's great for conversational bots and user-driven tasks.
- **`SequentialAgent`:** Choose this for **order**. The process is fixed and predictable. It's perfect for automating linear, multi-step procedures.
- **`ParallelAgent`:** Choose this for **efficiency**. Independent tasks run concurrently. It's ideal for data gathering and speeding up workflows.

And as we've just seen, the true power comes from **composing these patterns together** to build sophisticated, real-world applications.

In the final article of this series, we'll explore one more fascinating workflow: the **loop flow**, designed for tasks that require iteration and self-correction.
Stay tuned!
