---
title: "Day 7 with Workflows — Pass an input argument to your workflow"
date: 2020-12-10T20:04:09+01:00
tags:
- google-cloud
- workflows

similar:
  - "posts/2021/02/03/day-14-with-workflows-subworkflows.md"
  - "posts/2020/12/01/day-1-with-workflows-your-first-step-to-hello-world.md"
  - "posts/2020/12/09/day-6-with-workflows-arrays-and-dictionaries.md"
---

All the workflow definitions we've seen so far, in this series, were self-contained. 
They were not parameterized. But we often need our business processes to take arguments 
(the ID of an order, the details of the order, etc.), so that we can treat those input values and do something about them. 
That's where workflow input parameters become useful!

Let's start with a simple greeting message that we want to customize with a `firstname` and `lastname`. 
We'd like our workflow to look something like this:

```yaml
- output:
    return:  ${"Your  name  is  " + person.firstname + "  " + person.lastname}
```

In the example above, we have a `person` variable, on which we're requesting the fields `firstname` and `lastname`. 
This is actually a dictionary. But how do we let Cloud Workflows know about this variable? We need to define it somehow.

Workflow arguments are global to all the steps, so they need to be defined outside the scope of the steps themselves. 
Actually, workflows can be structured in sub-workflows: 
there's a main workflow, and possibly additional sub-workflows which are like routines or internal function definitions. 
We'll revisit the topic of sub-workflows in a later article. 
To declare our input parameter, we'll do it at the level of the main workflow, but in a more explicit fashion, with the following notation:

```yaml
main:
    params:  [person]
    steps:
        - output:
            return:  ${"Your  name  is  " + person.firstname + "  " + person.lastname}
```

We explicitly show the name of our main workflow. We use the `params` instruction. 
Note that our single argument, `person`, is surrounded by square brackets. 
The main workflow can only take a single dictionary parameter, however, as we'll see later, 
sub-workflows can take several input arguments, hence the square brackets notation to specify a list of arguments.

![](/img/workflows-days/w7-input-argument.png)

How do we pass this input argument? 
In the execution screen, in the input pane on the left, we create a JSON object, with a firstname and lastname keys. 
This JSON object is the dictionary in the person variable of our workflow definition.

In this video, you'll see input arguments in action:

{{< youtube 3dyKx2zBiXA >}}