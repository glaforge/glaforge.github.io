---
title: "Day 3 with Workflows — Variable assignment and expressions"
date: 2020-12-03T23:00:14+01:00
tags:
- google-cloud
- workflows

similar:
  - "posts/2020/12/09/day-6-with-workflows-arrays-and-dictionaries.md"
  - "posts/2020/12/10/day-7-with-workflows-pass-an-input-argument-to-your-workflow.md"
  - "posts/2020/12/02/day-2-with-workflows-a-workflow-is-made-of-steps-and-jumps.md"
---

Now that we have multiple steps in our workflow definition, 
let's see how we can pass data around, from a step to another.

![](/img/workflows-days/w03-var-assign.png)

In a step, you can assign values to variables. 
Those values can be ints, doubles, strings, or booleans (and also null). 
Use the `assign` keyword as follows:

```yaml
- assignments:
    assign:
        - two:  2
        - pi:  3.14
        - message:  "Hello"
        - bool:  True
```

Those variables are available in the whole scope of the workflow, and can be accessed in other steps. 
So let's see how we can do something with those variables. 
Let's add a second step to our workflow definition:

```yaml
- twoPi:
    return:  ${"Twice  pi  is  " + string(two * pi)}
```

We are using the `${}` notation to create an expression. 
We're multiplying two numbers, we're converting them to a string, 
and we're concatenating two strings together, to get our final value.

Note that not all operations are allowed on all types, so you might need to do some conversions 
with built-in [conversion functions](https://cloud.google.com/workflows/docs/reference/syntax?hl=en#conversion_functions) like the `string()` function in our example. 
There are all sorts of arithmetic operators or boolean logic operators.

{{< youtube dygoGp_tcCk >}}

For more information, you can read about 
[variable assignments](https://cloud.google.com/workflows/docs/reference/syntax?hl=en#assign-step), 
[data types](https://cloud.google.com/workflows/docs/reference/syntax?hl=en#data_types), and 
[expressions](https://cloud.google.com/workflows/docs/reference/syntax?hl=en#expressions). 
Next time, we'll also have a look at more complex data types.

