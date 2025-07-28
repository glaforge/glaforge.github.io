---
title: "Mastering agentic workflows with ADK: Loop agents"
date: 2025-07-28T09:37:02+02:00
tags:
  - java
  - agent-development-kit
  - ai-agents
  - large-language-models
image: /img/adk/adk-loop-agent.jpg
---

Welcome to the final installment of our series on **mastering agentic workflows** with the [ADK for Java](https://github.com/google/adk-java).
We've covered a lot of ground:

- [Part 1: **Sub-agents**]({{<ref "/posts/2025/07/23/mastering-agentic-workflows-with-ADK-sub-agents.md" >}}) for flexible, user-driven delegation.
- [Part 2: **Sequential agents**]({{<ref "/posts/2025/07/24/mastering-agentic-workflows-with-ADK-sequential-agent.md" >}}) for predictable, ordered processes.
- [Part 3: **Parallel agents**]({{<ref "/posts/2025/07/25/mastering-agentic-workflows-with-ADK-parallel-agent.md" >}}) for efficient, concurrent execution.

Now, we'll explore a pattern that enables agents to mimic a fundamental human problem-solving technique: **iteration**.
For tasks that require refinement, trial-and-error, and self-correction, the ADK provides a **`LoopAgent`**.

## Building agents that refine their work

Think about how you write code. You write a first draft, you review it (or a colleague does), you find issues, and you refine it.
You repeat this cycle until the code is correct. The `LoopAgent` is designed to automate exactly this kind of iterative process.

A loop workflow is perfect for:

- **Complex problem-solving:** Where the agent needs to try an approach, evaluate the outcome, and then try again.
- **Self-correction:** Building systems that can review and improve their own output.
- **Reaching a goal state:** Continuing a process until a specific condition is met.

## A practical example: a `code-refiner-assistant`

Let's look at our example of the day.
I've built a `code-refiner-assistant` that iteratively generates and reviews a Python function until it meets the required standards.

Let's detail its components, but first, a visual diagram will help understand the flow:

![](/img/adk/code-refiner-assistant.png)

First, we'll need a `code-generator` agent:

```java
var codeGenerator = LlmAgent.builder()
    .name("code-generator")
    .description(
        "Writes and refines code based on a request and feedback.")
    .instruction("""
        Your role is to write a Python function
        based on the user's request.
        On the first turn, write the initial version of the code.
        On subsequent turns, you will receive feedback on your code.
        Your task is to refine the code based on this feedback.

        Previous feedback (if any):
        {feedback?}
        """)
    .model("gemini-2.0-flash")
    .outputKey("generated_code")
    .build();
```

Notice two things:

- The result of this agent will be stored in the `generated_code` output key (in the agent's state).
- As this agent will be part of the refinement loop, it will look at the `feedback` that it might receive from a previous iteration of the loop. The `?` character signals the `feedback` state variable may be absent, which is the case for the first iteration. The question mark indicates that no exception should be thrown if this variable isn't present (again, in the case of the first iteration) this placeholder will just be replaced by an empty string.

Next, we need a `code-reviewer` agent to judge whether the code is complete or needs work:

```java
var codeReviewer = LlmAgent.builder()
    .name("code-reviewer")
    .description(
        "Reviews code and decides if it's complete or needs work.")
    .instruction("""
        Your role is to act as a senior code reviewer.
        Analyze the provided Python code for correctness,
        style, and potential bugs.

        Code to review:
        {generated_code}
        """)
    .model("gemini-2.0-flash")
    .outputKey("feedback")
    .build();
```

It takes in input the `generated_code` output from the `code-generator` agent.
And it will store its result in the `feedback` state variable, so that the `code-generator` can update the code if needed.

Now, let's put the two agents in a loop:

```java
var codeRefinerLoop = LoopAgent.builder()
    .name("code-refiner-loop")
    .description(
        "Iteratively generates and reviews code until it is correct.")
    .subAgents(
        codeGenerator,
        codeReviewer)
    .maxIterations(5) // Safety net!
    .build();
```

This coder/refiner loop is the first step of a sequential agent,
and the last step is the following `final-presenter` agent that displays the resulting reviewed code:

```java
var finalPresenter = LlmAgent.builder()
    .name("final-presenter")
    .description(
        "Presents the final, accepted code to the user.")
    .instruction("""
        The code has been successfully generated and reviewed.
        Present the final version to the user in a clear format.

        Final Code:
        {generated_code}
        """)
    .model("gemini-2.0-flash")
    .build();
```

Let's finalize this setup with the code of the sequential agent, combining the `code-refiner-loop` and `final-presenter` agents:

```java
return SequentialAgent.builder()
    .name("code-refiner-assistant")
    .description(
        "Manages the full code generation and refinement process.")
    .subAgents(
        codeRefinerLoop,
        finalPresenter)
    .build();
}
```

## The safety net: `maxIterations`

If we were running this agent as-is, it could run endlessly, looping over the code generator and code reviewer.
Fortunately, we added the instruction `maxIterations(5)` to the `LoopAgent` definition to avoid this situation.
No more than 5 iterations are allowed here.

You should **always specify a maximum number of iterations**, otherwise your agents could be stuck in an endless loop.

Now, we would like to stop the iteration once a certain condition is met:
when we're happy with the quality of the generated code, when the code doesn't need to be further improved.

## Exiting the loop early: `setEscalate(true)`

An uncontrolled loop is a dangerous thing. To stop a `LoopAgent`, there is one fundamental mechanism: calling `setEscalate(true)` on the context's event actions.
This is the universal _"break"_ statement that tells the ADK runtime to stop the current agent and pass control to its parent.

The key to building robust loops is understanding the two main strategies for invoking this critical method.

### Strategy #1: in-flight escalation with a `FunctionTool`

This approach treats exiting the loop as a primary, explicit action the agent must perform.

First, we define a simple Java method in our class to serve as the tool's implementation.
This method does one powerful thing: it calls `setEscalate(true)`.

```java
@Schema(description = """
    Call this function ONLY when the code-reviewer
    agent indicates no further changes are needed,
    signaling the iterative process should end.
    """)
public Map<String, Object> exitLoop(ToolContext toolContext) {
    toolContext.eventActions().setEscalate(true);
    return Map.of(); // Return value can an empty map
}
```

Next, we create an instance of `FunctionTool` and register it with our `code-reviewer` agent.
We also instruct the agent that it **MUST** call this tool when it's satisfied.

Let's have a look at the modified `code-reviewer`:

```java
var codeReviewer = LlmAgent.builder()
    .name("code-reviewer")
    .description("""
        Reviews code and decides if it's complete
        or needs more work.
        """)
    .instruction("""
        Your role is to act as a senior code reviewer.
        Analyze the provided Python code for correctness,
        style, and potential bugs.

        Code to review:
        {generated_code}

        If the code is perfect and meets the user's request,
        you MUST call the `exitLoop` tool.

        Otherwise, provide constructive feedback
        for the `code-generator` to improve the code.
        """)
    .model("gemini-2.0-flash")
    .outputKey("feedback")
    .tools(FunctionTool.create(this, "exitLoop"))
    .build();
```

When the agent calls this tool, the escalation happens _during_ the agent's turn, interrupting the normal flow.
This pattern is powerful because the decision to exit is a deliberate, observable action in the agent's execution trace.

### Strategy #2: programmatic escalation via `Callback`s

This approach is more programmatic.
Instead of a tool, we instruct the `code-reviewer` to output a simple keyword (like "EXIT") when it's done.
Then, we use a callback on the following agent to check for this keyword.

However, there's an important subtlety: a callback runs _before_ or _after_ an agent's turn starts or is complete.
Simply calling `setEscalate(true)` inside a callback is not enough, because the runtime might not _"notice"_ it.

**To ensure the escalation is processed**, the callback must also do one of two things:

1.  **Modify the state** (so the state delta is not empty).
2.  **Return a non-empty `Maybe`** (e.g., `Maybe.just(...)`).

This signals to the runtime that something has changed, prompting it to check for the escalation flag.
Returning `Maybe.empty()` in a callback is equivalent to actually doing nothing!

For callbacks, there are two approaches: we can draw a parallel to classic programming loops: `do/while` and `while`,
depending on whether you want to check before or after an agent runs to exit the loop.

![](/img/adk/adk-before-after-agent-callback.png)

#### The `do/while` approach: `afterAgentCallback`

This pattern checks the exit condition _after_ the main work of the iteration is done.
We place an `afterAgentCallback` usually on the _last_ agent in the loop (`code-reviewer`).
But you could also decide to exit the loop mid-way as well, depending on your use case.

It's important to also tweak the instructions to force the agent to return a particular magic word,
so that the callback can check the result and decide whether to exit.

```java
var codeReviewer = LlmAgent.builder()
    .name("code-reviewer")
    .description("""
        Reviews code and decides if it's complete or needs more work.
        """)
    .instruction("""
        Your role is to act as a senior code reviewer.
        Analyze the provided Python code for correctness,
        style, and potential bugs.

        Code to review:
        {generated_code}

        If the code is perfect and meets the user's request,
        you MUST reply with just one single word: EXIT
        Don't add any introduction or commentary.
        Just reply with EXIT.

        Otherwise, provide constructive feedback
        for the `code-generator to improve the code.
        """
    )
    .model("gemini-2.0-flash")
    .outputKey("feedback")
    .afterAgentCallback(callbackContext -> {
        var feedback = callbackContext.state()
            .getOrDefault("feedback", "").toString();

        if (feedback.trim().equalsIgnoreCase("EXIT")) {
            callbackContext.eventActions().setEscalate(true);
            callbackContext.state().put("review", "OK");
            return Maybe.just(
                Content.fromParts(Part.fromText("EXIT")));
        } else {
            return Maybe.empty();
        }
    })
```

The loop body (both `code-generator` and `code-reviewer`) always runs.
Then, the callback inspects the result.
Because the state is changed with a new `review` state variable,
and because we return a non-empty `Maybe`,
the runtime will process the `setEscalate(true)` flag and stop the next iteration.

Note that only one of setting a new state variable, and returning a non-empty `Maybe` is enough:
no need to do both like in this example.

#### The `while` approach: `beforeAgentCallback`

This pattern checks the exit condition _before_ the iteration begins.
We place a `beforeAgentCallback` on the _first_ agent in the loop (`code-generator`).
So the idea is to check whether a condition is met before starting a new iteration.

In our example, that applies to the `code-generator`,
but there's no need to change the prompt this time,
only adding the `beforeAgentCallback` is needed:

```java
var codeGenerator = LlmAgent.builder()
    .name("code-generator")
    .description(
        "Writes and refines code based on a request and feedback.")
    .instruction("""
        Your role is to write a Python function
        based on the user's request.
        On the first turn, write the initial version of the code.
        On subsequent turns, you will receive feedback on your code.
        Your task is to refine the code based on this feedback.

        Previous feedback (if any):
        {feedback?}
        """)
    .model("gemini-2.0-flash")
    .outputKey("generated_code")
    .beforeAgentCallback(callbackContext -> {
        var feedback = callbackContext.state()
            .getOrDefault("feedback", "").toString();

        if (feedback.trim().equalsIgnoreCase("EXIT")) {
            callbackContext.eventActions().setEscalate(true);
            return Maybe.just(
                Content.fromParts(Part.fromText("EXIT")));
        } else {
            return Maybe.empty();
        }
    })
    .build();
```

This is highly efficient. It checks the result from the last turn, and if it's time to exit,
it escalates _before_ running the `code-generator`, saving an unnecessary LLM call.

### Which strategy is better?

There's no single answer.

- The **`FunctionTool`** approach is excellent when the decision to exit is a core part of the agent's responsibility and should be an explicit action.
- The **Callback** approach offers a more deterministic, programmatic check that is less reliant on the LLM's tool-calling ability, making it ideal for simple state-based exit conditions.

### Don't forget the safety net!

Regardless of the pattern you choose, you must always include a `maxIterations` limit.
This is a critical safety net to prevent infinite loops if the agents get stuck in a cycle of corrections.

## Conclusion: The power of composition

Across this four-part series, we've seen how the ADK for Java provides a powerful and elegant toolkit for building sophisticated AI systems.
We've moved beyond single, monolithic agents to composing workflows that are flexible, ordered, efficient, and even iterative.

- **Sub-agents** brings flexibility and grants agents agency.
- **Sequential agents** give us order.
- **Parallel agents** give us speed.
- **Loop agents** give us intelligence through iteration.

The real magic happens when you realize these aren't mutually exclusive choices.
They are composable building blocks.
By combining these patterns, you can design and build truly advanced agentic applications that can tackle complex, multi-step problems in a robust and maintainable way.
