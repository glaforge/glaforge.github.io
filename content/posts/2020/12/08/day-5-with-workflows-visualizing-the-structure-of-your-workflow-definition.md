---
title: "Day 5 with Workflows — Visualizing the structure of your workflow definition"
date: 2020-12-08T22:26:13+01:00
tags:
- google-cloud
- workflows
---

So far, in our Cloud Workflows series, we have seen some of the YAML syntax for defining workflows. 
However, steps are defined after each other, as a series of step definitions, 
but in spite of the jump instructions, the conditionals, 
you don't really see visually what is going to be the next potential step in a workflow execution.

Fortunately, a new UI enhancement has landed in the Google Cloud Console: 
the ability to visualize a workflow definition with a graph, when you're editing the definition. 
Furthermore, the graph is updated in quasi real-time as you make updates to the definition.

![](/img/workflows-days/w05-graph.png)

Let's see this in action in the video below:

{{< youtube RQ11ATLxf3I >}}

Thanks to this visualization, it's easier to further understand how your workflow definition is structured, how executions operate. You can more easily track which steps follows a particular step.

Enjoy!

