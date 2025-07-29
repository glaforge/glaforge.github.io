---
title: "Mastering agentic workflows with ADK: the recap"
date: 2025-07-29T08:51:28+02:00
tags:
  - java
  - agent-development-kit
  - ai-agents
  - large-language-models
image: /img/adk/adk-workflow-recap.jpg
---

Over the past few articles, we've taken a deep dive into the powerful **agentic workflow orchestration** capabilities of the [Agent Development Kit](https://github.com/google/adk-java) (ADK) for **Java**. We've seen how to build robust, specialized AI agents by moving beyond single, monolithic agents. We've explored how to structure our agents for:

- **Part 1**: [Flexibility with sub-agents]({{<ref "/posts/2025/07/23/mastering-agentic-workflows-with-ADK-sub-agents.md" >}}) — Letting an orchestrator LLM decide the best course of action.
- **Part 2**: [Order with sequential agents]({{<ref "/posts/2025/07/24/mastering-agentic-workflows-with-ADK-sequential-agent.md" >}}) — Enforcing a strict, predictable execution path.
- **Part 3**: [Efficiency with parallel agents]({{<ref "/posts/2025/07/25/mastering-agentic-workflows-with-ADK-parallel-agent.md" >}}) — Running independent tasks concurrently to save time.
- **Part 4**: [Refinement with loop agents]({{<ref "/posts/2025/07/28/mastering-agentic-workflows-with-ADK-loop-agents.md" >}}) — Creating iterative processes for self-correction and complex problem-solving.

In this final post, let's bring it all together. We'll summarize each pattern, clarify when to use one over the other, and show how their true power is unlocked when you start combining them.

## A quick recap: your agentic workflow cheat sheet

Choosing the right workflow is about matching the structure of your problem to the structure of your agent system. Here’s a quick guide:

| Workflow       | Key ADK Class     | Use Case                                                                                  | Pros                                                                            | Cons                                                                                |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Sub-Agents** | `LlmAgent`        | User-driven, flexible tasks where the next step is not always known.                      | High flexibility, conversational, great for user-facing bots.                   | Less predictable, relies on LLM reasoning for flow control.                         |
| **Sequential** | `SequentialAgent` | Fixed, multi-step processes where order is critical.                                      | Predictable, reliable, easy to debug, guarantees order.                         | Inflexible, can be slower if tasks could be parallelized.                           |
| **Parallel**   | `ParallelAgent`   | Gathering data from multiple sources or running independent tasks.                        | Highly efficient, significantly reduces latency for I/O-bound tasks.            | All tasks run; no short-circuiting. Less suitable for tasks with dependencies.      |
| **Loop**       | `LoopAgent`       | Iterative refinement, self-correction, or processes that repeat until a condition is met. | Powerful for complex problem-solving, enables agents to improve their own work. | Can lead to infinite loops if not designed carefully (always use `maxIterations`!). |

## When to use each workflow

Let's distill the decision-making process down to its essence.

### Choose sub-agents for flexibility and conversation

The `LlmAgent` with a team of sub-agents is your go-to for building conversational assistants. This _"divide and conquer"_ strategy gives an orchestrator LLM the autonomy and agency to choose the right specialist (sub-agent) for the job based on the user's request.

#### Use it when:

- The user is in control, and the conversation can go in many different directions.
- You need to delegate to a wide range of tools or specialists.
- The exact sequence of operations is not — and should not be — predetermined.

### Choose `SequentialAgent` for order and predictability

When you have a process that must follow a specific order, the `SequentialAgent` is the perfect tool. It creates a fixed pipeline where the output of one step becomes the input for the next. This provides structure and guarantees a consistent outcome.

#### Use it when:

- You are automating a business process, like _"Step A, then Step B, then Step C."_
- The outcome of one agent is a necessary prerequisite for the next.
- You need a deterministic and easily debuggable workflow.

### Choose `ParallelAgent` for efficiency and speed

If your workflow involves multiple independent tasks—like fetching data from different APIs or performing separate
analyses—running them sequentially is a waste of time. The `ParallelAgent` executes these tasks concurrently, dramatically speeding up the total execution time.

#### Use it when:

- You have multiple I/O-bound tasks (e.g., web searches, database queries).
- The tasks do not depend on each other's results.
- Minimizing latency is a primary concern.

### Choose `LoopAgent` for iteration and refinement

Some problems can't be solved in a single shot. For tasks that require trial, feedback, and correction — like generating code and then having a reviewer agent critique it — the `LoopAgent` is indispensable.
It automates the cycle of _"do, check, refine."_

#### Use it when:

An agent needs to improve its work based on feedback (from another agent or a tool).
You are building a system that needs to work towards a goal state through iteration.
The task involves complex problem-solving that benefits from a trial-and-error approach.

## The Power of composition: better together

While each workflow is powerful on its own, **the real magic happens when you start composing them**.
This is the core philosophy of the ADK: building sophisticated systems from simple, modular blocks.

In our series, we saw a prime example of this with the `company-detective` agent. It was a `SequentialAgent` that orchestrated a two-step process:

- A `ParallelAgent` that ran three different research agents concurrently (`company-profiler`, `news-finder`, `financial-analyst`).
- A final `LlmAgent` (`report-compiler`) that took the aggregated results from the parallel step and synthesized them into a final report.

This hybrid approach gave us the best of both worlds:
the raw speed of parallel execution for data gathering and the structured order of a sequential pipeline to ensure the final report was only compiled after all the research was complete.

Similarly, we built a code-refiner-assistant by embedding a `LoopAgent` inside a `SequentialAgent`.
This allowed us to first iteratively generate and review code until it was perfect, and then proceed to the final step of presenting it to the user.

## Conclusion: determinism and control for better AI

By breaking down complex problems and assigning them to specialized agentic workflows, we gain more control and produce more reliable outcomes. Instead of relying on a single, massive LLM to figure everything out, we guide the process.
We trade a little bit of the LLM's raw agency for a massive gain in predictability, maintainability, and overall quality.

The [ADK for Java](https://github.com/google/adk-java) gives you the toolkit to be a true AI architect.
By mastering and combining these fundamental patterns (sub-agents, sequential, parallel, and loop) you can move beyond simple bots and start building genuinely capable and robust AI systems that solve real-world problems in a structured and deterministic way.
