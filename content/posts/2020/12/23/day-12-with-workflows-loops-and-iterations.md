---
title: "Day 12 with Workflows — Loops and iterations"
date: 2020-12-23T19:00:18+01:00
tags:
- google-cloud
- workflows
---

In previous episodes of this Cloud Workflows series, we've learned about 
[variable assignment](http://glaforge.appspot.com/article/day-3-with-cloud-workflows-variable-assignment-and-expressions), 
data structures like [arrays](http://glaforge.appspot.com/article/day-6-with-cloud-workflows-arrays-and-dictionaries), 
[jumps](http://glaforge.appspot.com/article/day-2-with-cloud-workflows-a-workflow-is-made-of-steps-or-even-jumps) and 
[switch conditions](http://glaforge.appspot.com/article/day-4-with-cloud-workflows-jumping-with-switch-conditions) to move between steps,
and [expressions](http://glaforge.appspot.com/article/day-3-with-cloud-workflows-variable-assignment-and-expressions) 
to do some computations, including potentially some built-in functions.

With all these previous learnings, we are now equipped with all the tools to let us create loops and iterations, 
like for example, iterating over the element of an array, perhaps to call an API several times but with different arguments. 
So let's see how to create such an iteration!

{{< youtube OXhV2cuKwo >}}

First of all, let's prepare some variable assignments:

```yaml
- define:
    assign:
        - array:  ['Google',  'Cloud',  'Workflows']
        - result:  ""
        - i:  0
```

-   The `array` variable will hold the values we'll be iterating over.
-   The `result` variable contains a string to which we'll append each values from the array.
-   And the `i` variable is an index, to know our position in the array.

Next, like in a for loop of programming languages, we need to prepare a condition for the loop to finish. We'll do that in a dedicated step:

```yaml
- checkCondition:
    switch:
        - condition:  ${i  <  len(array)}
          next:  iterate
    next:  returnResult
```

We define a `switch`, with a `condition` expression that compares the current index position with the length of the array, using the built-in `len()` function. 
If the condition is true, we'll go to an `iterate` step. If it's false, we'll go to the ending step (called `returnResult` here).

Let's tackle the iteration body itself. 
Here, it's quite simple, as we're just assigning new values to the variables: 
we append the i-th element of the array into the result variable, and we increment the index by one. 
Then we go back to the `checkCondition` step.

```yaml
- iterate:
    assign:
        - result:  ${result  +  array[i]  +  " "}
        - i:  ${i+1}
    next:  checkCondition
```

Note that if we were doing something more convoluted, for example calling an HTTP endpoint with the element of the array as argument, 
we would need two steps: one for the actual HTTP endpoint call, and one for incrementing the index value. 
However in the example above, we're only assigning variables, so we did the whole body of the iteration in this simple assignment step.

When going through the `checkCondition` step, if the condition is not met (ie. we've reached the end of the array), then we're redirected to the `returnResult` step:

```yaml
- returnResult:
    return:  ${result}
```

This final step simply returns the value of the `result` variable.