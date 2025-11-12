---
title: "Day 14 with Workflows — Subworkflows"
date: 2021-02-03T17:02:24+01:00
tags:
- google-cloud
- workflows

similar:
  - "posts/2022/11/04/workflows-tips-and-tricks.md"
  - "posts/2021/02/10/day-15-with-workflows-built-in-cloud-logging-function.md"
  - "posts/2021/02/02/day-13-with-workflows-logging-with-cloud-logging.md"
---

Workflows are made of sequences of steps and branches. 
Sometimes, some particular sequence of steps can be repeated, and it would be a good idea to avoid error-prone repetitions in your workflow definition 
(in particular if you change in one place, and forget to change in another place). 
You can modularize your definition by creating subworkflows, a bit like subroutines or functions in programming languages. 
For example, yesterday, we had a look at [how to log to Cloud Logging]({{< ref "/posts/2021/02/02/day-13-with-workflows-logging-with-cloud-logging" >}}): 
if you want to log in several places in your workflow, you can extract that routine in a subworkflow.

Let's see that in action in the video below, and you can read all the explanations afterwards:

{{< youtube tbiFaO_LOdg >}}

First things first, let's step back and look at the structure of workflow definitions. 
You write a series of steps, directly in the main YAML file.
You can move back and forth between steps thanks to 
[jumps]({{< ref "/posts/2020/12/04/day-4-with-workflows-jumping-with-switch-conditions" >}}), 
but it wouldn't be convenient to use jumps to emulate subroutines 
(remember the good old days of BASIC and its gotos?). 
Instead, Cloud Workflows allows you to separate steps under a `main`, and subroutines under their own subroutine name.

So far we had just a sequence of steps:

```yaml
- stepOne:
 ...
- stepTwo:
 ...
- stepThree:
 ...
```

Those steps are implicitly under a `main` routine. 
And here's how to show this main routine explicitly, by having that `main` block, and `steps` underneath:

```yaml
main:
    steps:
        - stepOne:
 ...
        - stepTwo:
 ...
        - stepThree:
 ...
```

To create a subworkflow, we follow the same structure, but with a different name than `main`, but you can also pass parameters like so:

```yaml
subWorkflow:
    params:  [param1,  param2,  param3:  "default value"]
    steps:
        - stepOne:
 ...
        - stepTwo:
 ...
        - stepThree:
 ...
```

Notice that you can pass several parameters, and that parameters can have default values when that parameter is not provided at the call site.

Then in your main flow, you can call that subworkflow with a `call` instruction. 
Let's take a look at a concrete example, that simply concatenates two strings:

```yaml
main:
    steps:
        - greet:
            call:  greet
            args:
                greeting:  "Hello"
                name:  "Guillaume"
            result:  concatenation
        - returning:
            return:  ${concatenation}

greet:
    params:  [greeting,  name:  "World"]
    steps:
        - append:
            return:  ${greeting  +  ", "  +  name  +  "!"}
```

In the `call` instruction, we pass the `greeting` and `name` arguments, and the result will contain the output of the subworkflow call. 
In the subworkflow, we defined our parameters, and we have a single step just return an expression which is the desired greeting message concatenation.

One last example, but perhaps more useful than concatenating strings! 
Let's turn yesterday's Cloud Logging integration into a reusable subworkflow. 
That way, you'll be able to call the log subworkflow as many times as needed in your main workflow definition, without repeating yourself:

```yaml
main:
  steps:
    - first_log_msg:
        call:  logMessage
        args:
          msg:  "First message"
    - second_log_msg:
        call:  logMessage
        args:
          msg:  "Second message"

logMessage:
  params:  [msg]
  steps:
    - log:
        call:  http.post
        args:
            url:  https://logging.googleapis.com/v2/entries:write
            auth:
                type:  OAuth2
            body:
                entries:
                    - logName:  ${"projects/"  +  sys.get_env("GOOGLE_CLOUD_PROJECT_ID")  +  "/logs/workflow_logger"}
                      resource:
                        type:  "audited_resource"
                        labels:  {}
                      textPayload:  ${msg}
```

And voila! We called our `logMessage` subworkflow twice in our main workflow, just passing the text message to log into Cloud Logging.