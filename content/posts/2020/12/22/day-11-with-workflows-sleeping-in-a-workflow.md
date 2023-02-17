---
title: "Day 11 with Workflows — Sleeping in a workflow"
date: 2020-12-22T19:05:26+01:00
tags:
- google-cloud
- workflows
---

Workflows are not necessarily instantaneous, and executions can span over a long period of time. 
Some steps may potentially launch asynchronous operations, which might take seconds or minutes to finish, but you are not notified when the process is over. 
So when you want for something to finish, for example before polling again to check the status of the async operation, you can introduce a sleep operation in your workflows.

{{< youtube uaW_Cv3RCxQ >}}

To introduce a [sleep operation](https://cloud.google.com/workflows/docs/reference/syntax), add a step in the workflow with a call to the built-in sleep operation:

```yaml
- someSleep:
    call:  sys.sleep
    args:
        seconds:  10
- returnOutput:
    return:  We  waited  for  10  seconds!
```

A `sys.sleep` operation takes a `seconds` argument, where you can specify the number of seconds to wait.

By combining conditional jumps and sleep operations, you can easily implement polling some resource or API at a regular interval, to double check that it completed.