---
title: "Day 2 with Workflows — A workflow is made of steps and jumps"
date: 2020-12-02T23:16:07+01:00
tags:
- google-cloud
- workflows
---

Let's continue our discovery of [Goole Cloud Workflows](https://cloud.google.com/workflows)!

Yesterday, we discovered the UI of Workflows. 
We [created our first workflow]({{< ref "/posts/2020/12/01/day-1-with-workflows-your-first-step-to-hello-world" >}}). 
We started with a single step, returning a greeting message:

```yaml
- sayHello:
    return: Hello from Cloud Workflows!
```

A workflow definition is made of steps. 
But not just one! You can create several steps. 
In YAML, the structure of your workflow will be something like:

```yaml
- stepOne:
    # do something
- stepTwo:
    # do something else
- sayHello:
    return: Hello from Cloud Workflows!
```

By default, steps are executed in the order they appear, from top to bottom. 
The execution will finish when either you return a value, or you reach the final step. 
If there's no return statement, a null value is returned as result of the workflow execution.

A small step for a workflow execution, but you can also do a jump between steps! 
For that, you'll use the next instruction:

```yaml
- stepOne:
    next: stepTwo
- stepThree:
    next: sayHello
- stepTwo:
    next: stepThree
- sayHello:
    return: Hello from Cloud Workflows!
```

Here, we jump between steps, back and forth, before going to the final step that will return a value, and thus finish the execution of our workflow.

{{< youtube BTzb1m5pDXI >}}

Of course, we can go beyond a linear series of steps, and in subsequent articles, 
we'll see how we can create conditional jumps and switches, for more complex logic, 
and how we can pass some data and values between steps.

