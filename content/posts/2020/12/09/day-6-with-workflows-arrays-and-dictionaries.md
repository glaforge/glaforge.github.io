---
title: "Day 6 with Workflows — Arrays and dictionaries"
date: 2020-12-09T22:14:55+01:00
tags:
- google-cloud
- workflows
---

So far, in this series of articles on [Cloud Workflows](https://cloud.google.com/workflows), 
we have used simple data types, like strings, numbers and boolean values. 
However, it's possible to use more complex data structures, 
like [arrays](https://cloud.google.com/workflows/docs/reference/syntax?hl=en#arrays) and 
[dictionaries](https://cloud.google.com/workflows/docs/reference/syntax?hl=en#dictionaries). 
In this new episode, we're going to use those new structures.

Arrays can be defined inline (like `anArray`) or spanning over several lines (like `anotherArray`):

```yaml
- assignment:
    assign:
        - anArray:  ["a",  "b",  "c"]
        - anotherArray:
            -  one
            -  two
- output:
    return:  ${anArray[0] + anotherArray[1]}
```

The output step will return the string `"atwo"`.

For dictionaries, you can define them as follows:

```yaml
- assignment:
    assign:
        - person:
            firstname:  "Guillaume"
            lastname:  "Laforge"
            age:  43
            kids:  ["Marion",  "Erine"]
- output:
    return:  ${person.firstname  +  " and "  + person.kids[1]}
```

The output step will return the string `"Guillaume and Erine"`.

Notice that we nested an array within a dictionary. 
So you can easily create dictionaries containing arrays, containing other dictionaries, etc, 
just like any JSON or YAML structures.

In the example we were able to access the second kid of the person, mixing both the field (dot) 
and index (square brackets) notations to access fields of our dictionary, and elements of our array.

This video shows both arrays and dictionaries in action:

{{< youtube 9JrqlV5s11Q >}}

In the coming articles, we'll see that such data structures are handy for dealing with API endpoint calls.

