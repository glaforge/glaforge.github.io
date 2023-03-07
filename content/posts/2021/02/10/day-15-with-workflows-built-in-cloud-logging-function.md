---
title: "Day 15 with Workflows — Built-in Cloud Logging function"
date: 2021-02-10T16:01:24+01:00
tags:
- google-cloud
- workflows
- logging
---

In the two previous episodes, we saw how to 
[create and call subworkflows]({{< ref "/posts/2021/02/03/day-14-with-workflows-subworkflows" >}}), 
and we applied this technique to making a reusable routine for logging with Cloud Logging. 
However, there's already a built-in function for that purpose! So let's have a look at this integration.

{{< youtube V2hQekDwdRM >}}

To call the built-in logging function, just create a new step, and make a call to the `sys.log` function:

```yaml
- logString:
    call:  sys.log
    args:
        text:  Hello  Cloud  Logging!
        severity:  INFO
```

This function takes a mandatory parameter: text. And an optional one: severity.

The text parameter accepts all types of supported values, so it's not only string, 
but all kinds of numbers, as well as arrays and dictionaries. 
Their string representation will be used as text.

The optional severity parameter is an enum that can take the values: 
`DEFAULT`, `DEBUG`, `INFO`, `NOTICE`, `WARNING`, `ERROR`, `CRITICAL`, `ALERT`, `EMERGENCY`, 
with `DEFAULT` being... the default value if you don't specify a severity!

Here's another example with a dictionary as parameter, which will be output as text in the logs, and a severity of `WARNING`:

```yaml
- createDict:
    assign:
        - person:
            name:  Guillaume
            kids:  2
- logDict:
    call:  sys.log
    args:
        text:  ${person}
        severity:  WARNING
```

Looking at the results in the cloud logging console, you will see both messages appear:

![](/img/workflows-days/w15-builtin-log.png)

Don't hesitate to have a look at [reference documentation](https://cloud.google.com/workflows/docs/reference/stdlib/sys/log) 
to find more about the available built-in functions.