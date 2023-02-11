---
title: "Workflows Tips and Tricks"
date: 2022-11-04T14:15:43+01:00
tags:
- google-cloud
- workflows
- tips
---

Here are some general tips and tricks that we found useful as we used Google Cloud [Workflows](https://cloud.google.com/workflows):

## Avoid hard-coding URLs

Since Workflows is all about calling APIs and service URLs, it's important to have some clean way to handle those URLs. 
You can hard-code them in your workflow definition, but the problem is that your workflow can become harder to maintain. 
In particular, what happens when you work with multiple environments? 
You have to duplicate your YAML definitions and use different URLs for the prod vs staging vs dev environments. 
It is error-prone and quickly becomes painful to make modifications to essentially the same workflow in multiple files. 
To avoid hard-coding those URLs, there are a few approaches.

The first one is to externalize those URLs, and 
[pass them as workflow execution arguments](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/multi-env-deployment#option-1-use-urls-as-runtime-arguments). 
This is great for workflow executions that are launched via the CLI, via the various client libraries, or the REST & gRPC APIs. 
However, there's a limitation to this first approach, in the case of event-triggered workflows, where the invoker is Eventarc. 
In that case, that's Eventarc that decides which arguments to pass (ie. the event payload). 
There's no way to pass extra arguments in that case.

A safer approach is then to use some placeholder replacement techniques. 
Just use a tool that replaces some specific string tokens in your definition file, before deploying that updated definition. 
We explored that approach using some 
[Cloud Build steps that do some string replacement](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/multi-env-deployment#option-2-use-cloud-build-to-deploy-multiple-versions). 
You still have one single workflow definition file, but you deploy variants for the different environments. 
If you're using Terraform for provisioning your infrastructure, we've got you covered, you can also employ a 
[similar technique with Terraform](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/multi-env-deployment#option-3-use-terraform-to-deploy-multiple-versions).

There are also other possible approaches, like taking advantage of Secret Manager and the dedicated 
[workflow connector](https://cloud.google.com/workflows/docs/reference/googleapis/secretmanager/Overview), 
to store those URLs, and retrieve them. Or you can also 
[read some JSON file in a cloud storage bucket](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/gcs-read-write-json#load-environment-specific-variables-from-a-json-file-in-gcs), 
within which you would store those environment specific details.

## Take advantage of sub-steps

Apart from branching or looping, defining your steps is a pretty sequential process. One step happens after another. 
Steps are their own atomic operation. 
However, often, some steps really go hand-in-hand, like making an API call, logging its outcome, retrieving and assigning parts of the payload into some variables. 
You can actually regroup common steps into substeps. This becomes handy when you are branching from a set of steps to another set of steps, without having to point at the right atomic step.

```yaml
main:
    params:  [input]
    steps:
    - callWikipedia:
        steps:
        - checkSearchTermInInput:
            switch:
                - condition:  ${"searchTerm"  in  input}
                  assign:
                    - searchTerm:  ${input.searchTerm}
                  next:  readWikipedia
        - getCurrentTime:
            call:  http.get
            args:
                url: ...
            result:  currentDateTime
        - setFromCallResult:
            assign:
                - searchTerm:  ${currentDateTime.body.dayOfTheWeek}
        - readWikipedia:
            call:  http.get
            args:
                url:  https://en.wikipedia.org/w/api.php
                query:
                    action:  opensearch
                    search:  ${searchTerm}
            result:  wikiResult
    - returnOutput:
            return:  ${wikiResult.body[1]}
```

## Wrap expressions

The dollar/curly brace `${}` expressions are not part of the YAML specification, so what you put inside sometimes doesn't play well with YAML's expectations. 
For example, putting a colon inside a string inside an expression can be problematic, as the YAML parser believes the colon is the end of the YAML key, and the start of the right-hand-side. 
So to be safe, you can actually wrap your expressions within quotes, like: `'${...}'`

Expressions can span several lines, as well as the strings within that expression. 
That's handy for SQL queries for BigQuery, like in our [example](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/bigquery-parallel):

```yaml
query:  ${
 "SELECT TITLE, SUM(views)
    FROM `bigquery-samples.wikipedia_pageviews."  +  table  +  "`
    WHERE LENGTH(TITLE) > 10
    GROUP BY TITLE
    ORDER BY SUM(VIEWS) DESC
    LIMIT 100"
}
```

## Replace logic-less services with declarative API calls

In our [serverless workshop](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop/), in lab 1, 
we had a [function service](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop/blob/master/functions/image-analysis/nodejs/index.js#L19) 
that was making a call to the Cloud Vision API, checking a boolean attribute, then writing the result in Firestore. 
But the Vision API can be called declaratively from Workflows. 
The boolean check can be done with a switch conditional expression, and even writing to Firestore can be done via a declarative API call. 
When rewriting our application in [lab 6](https://github.com/GoogleCloudPlatform/serverless-photosharing-workshop/blob/master/workflows/workflows.yaml#L33) 
to use the orchestrated approach, we moved those logic-less calls into declarative API calls.

There are times where Workflows lack some built-in function that you would need, so you have no choice but fork into a function to do the job. 
But when you have pretty logic-less code that just makes some API calls, you'd better just write this declaratively using Workflows syntax.

It doesn't mean that everything, or as much as possible, should be done declaratively in a Workflow either. 
Workflows is not a hammer, and it's definitely not a programming language. 
So when there's real logic, you definitely need to call some service that represents that business logic.

## Store what you need, free what you can

Workflows keeps on granting more memory to workflow executions, but there are times, with big API response payloads, where you'd be happy to have even more memory. 
That's when sane memory management can be a good thing to do. 
You can be selective in what you store into variables: don't store too much, but store just the right payload part you really need.
Once you know you won't need the content of one of your variables, you can also reassign that variable to null, that should also free that memory. 
Also, in the first place, if the APIs allow you to filter the result more aggressively, you should also do that. 
Last but not least, if you're calling a service that returns a gigantic payload that can't fit in Workflows memory, 
you could always delegate that call to your own function that would take care of making the call on your behalf, and returning to you just the parts you're really interested in.

Don't forget to check the documentation on [quotas and limits](https://cloud.google.com/workflows/quotas) to know more about what's possible.

## Take advantage of sub-workflows and the ability to call external workflows

In your workflows, sometimes there are some steps that you might need to repeat. 
That's when [subworkflows](https://cloud.google.com/workflows/docs/reference/syntax/subworkflows) become handy. 
Sub-workflows are like sub-routines, procedures or methods. 
They are a way to make a set of steps reusable in several places of your workflow, potentially parameterized with different arguments. 
The sole downside maybe is that subworkflows are just local to your workflow definition, so they can't be reused in other workflows. 
In that case, you could actually create a dedicated reusable workflow, because you can also 
[call workflows from other workflows](https://cloud.google.com/workflows/docs/reference/googleapis/workflowexecutions/Overview)! The workflows connector for workflows is there to help.

## Summary

We've covered a few tips and tricks, and we've reviewed some useful advice on how to make the best use of Workflows. 
There are certainly others we're forgetting about. 
So feel free to share them with [@meteatamel](https://twitter.com/meteatamel) and [@glaforge](https://twitter.com/glaforge) over Twitter.

And don't forget to double check what's in the Workflows [documentation](https://cloud.google.com/workflows/docs). 
In particular, have a look at the built-in functions of the [standard library](https://cloud.google.com/workflows/docs/reference/stdlib/overview), 
at the [list of connectors](https://cloud.google.com/workflows/docs/reference/googleapis) that you can use, 
and perhaps even print the [syntax cheat sheet](https://cloud.google.com/workflows/docs/reference/syntax/syntax-cheat-sheet)!

Lastly, check out all the [samples](https://cloud.google.com/workflows/docs/samples) in the documentation portal, 
and all the [workflow demos](https://github.com/GoogleCloudPlatform/workflows-demos) Mete and I have built and open sourced over time.