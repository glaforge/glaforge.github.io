---
title: "Day 4 with Workflows — Jumping with switch conditions"
date: 2020-12-04T22:50:12+01:00
tags:
- google-cloud
- workflows
---

In the previous articles about Google [Cloud Workflows](https://cloud.google.com/workflows), 
we talked about how to [assign variables, create expressions]({{< ref "/posts/2020/12/03/day-3-with-workflows-variable-assignment-and-expressions" >}}), 
and also how to [jump from a step to another]({{< ref "/posts/2020/12/02/day-2-with-workflows-a-workflow-is-made-of-steps-and-jumps" >}}). 
It's time to combine both aspects to understand how we can do conditional jumps, thanks to the `switch` instruction.

Let's start with a first step defining a variable, whose value we'll use in our switch condition:

```yaml
- assignement:
    assign:
        - number:  42
```

Then we're going to create our second step that will use a `switch` instruction, with an expression:

```yaml
- evaluate:
    switch:
        - condition:  ${number  > 100}
          next:  highValue
        - condition:  ${number  <  100}
          next:  lowValue
    next:  end
```

We define two conditions with two expressions, checking if the number is above or below 100, 
then we go to a different step (`highValue` or `lowValue` steps). 
If none of the conditions are met, we go to the end of the workflow 
(or we could return some value or raise some error).

We also need our two steps to go to:

```yaml
- highValue:
    return:  "It's high!"
- lowValue:
    return:  "It's rather low!"
```

And we're done! If the number is `42`, like in our case, 
the execution of the workflow will go through the lowValue step, 
and return the string saying that it's a low value.

{{< youtube thSKszcLWSg >}}

Thanks to [switch conditionals](https://cloud.google.com/workflows/docs/reference/syntax?hl=en#jumps), 
with expressions and jumps, we can have non-linear logic in our workflow definitions. 
In upcoming articles, we will also have a look at how to use more complex data structures 
like arrays and dictionaries, and how to define inputs and outputs.

