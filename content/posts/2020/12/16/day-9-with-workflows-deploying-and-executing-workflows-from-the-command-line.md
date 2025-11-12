---
title: "Day 9 with Workflows — Deploying and executing Workflows from the command-line"
date: 2020-12-16T19:44:08+01:00
tags:
- google-cloud
- workflows

similar:
  - "posts/2020/12/01/day-1-with-workflows-your-first-step-to-hello-world.md"
  - "posts/2022/02/09/schedule-a-workflow-execution.md"
  - "posts/2022/11/28/workflows-patterns-and-best-practices-part-2.md"
---

So far, in this series on [Cloud Workflows](https://cloud.google.com/workflows), 
we've only used the Google Cloud Console UI to manage our workflow definitions, and their executions. 
But it's also possible to deploy new definitions and update existing ones from the command-line, 
using the [GCloud SDK](https://cloud.google.com/sdk/). Let's see how to do that!

{{< youtube rVTPRUuidPI >}}

If you don't already have an existing service account, you should create one following these 
[instructions](https://cloud.google.com/workflows/docs/creating-updating-workflow#gcloud). 
I'm going to use the workflow-sa service account I created for the purpose of this demonstration.

Our workflow definition is a simple "hello world" like the one we created for 
[day #1]({{< ref "/posts/2020/12/01/day-1-with-workflows-your-first-step-to-hello-world" >}}) 
of our exploration of Google Cloud Workflows:

```yaml
- hello:
    return:  Hello  from  gcloud!
```

To deploy this workflow definition, we'll launch the following gcloud command, 
specifying the name of our workflow, passing the local source definition, and the service account:

```bash
$ gcloud beta workflows deploy w09-new-workflow-from-cli \
    --source=w09-hello-from-gcloud.yaml \
    --service-account=workflow-sa@workflows-days.iam.gserviceaccount.com
```

You can also add labels with the `--labels` flag, and a description with the `--description` flag, just like in the Google Cloud Console UI.

If you want to update the workflow definition, this is also the same command to invoke, passing the new version of your definition file.

Time to create an execution of our workflow!

```bash
$ gcloud beta workflows run w09-new-workflow-from-cli
```

You will see an output similar to this:

```yaml
Waiting for execution [d4a3f4d4-db45-48dc-9c02-d25a05b0e0ed] to complete...done.
argument: 'null'
endTime: '2020-12-16T11:32:25.663937037Z'
name: projects/783331365595/locations/us-central1/workflows/w09-new-workflow-from-cli/executions/d4a3f4d4-db45-48dc-9c02-d25a05b0e0ed
result: '"Hello from gcloud!"'
startTime: '2020-12-16T11:32:25.526194298Z'
state: SUCCEEDED
workflowRevisionId: 000001-47f
```

Our workflow being very simple, it executed and completed right away, hence why you see the result string 
(our Hello from gcloud! message), as well as the state as SUCCEEDED. 
However, workflows often take longer to execute, consisting of many steps. 
If the workflow hasn't yet completed, you'll see its status as `ACTIVE` instead, or potentially `FAILED` if something went wrong.

When the workflow takes a long time to complete, you can check the status of the last execution from your shell session with:

```bash
$ gcloud beta workflows executions describe-last
```

If you want to know about the ongoing workflow executions:

```bash
$ gcloud beta workflows executions list your-workflow-name
```

It'll give you a list of operation IDs for those ongoing executions. You can then inspect a particular one with:

```bash
$ gcloud beta workflows executions describe the-operation-id
```

There are other operations on executions, to wait for an execution to finish, or even cancel an ongoing, unfinished execution.

You can learn more about workflow execution in the [documentation](https://cloud.google.com/workflows/docs/executing-workflow). 
And in some upcoming episodes, we'll also have a look at how to create workflow executions from client libraries, and from the Cloud Workflows REST API.