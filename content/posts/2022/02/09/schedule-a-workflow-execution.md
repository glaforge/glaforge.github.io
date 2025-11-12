---
title: "Schedule a Workflow Execution"
date: 2022-02-09T17:06:51+01:00
tags:
- google-cloud
- workflows
- scheduler

similar:
  - "posts/2020/12/16/day-9-with-workflows-deploying-and-executing-workflows-from-the-command-line.md"
  - "posts/2020/12/01/day-1-with-workflows-your-first-step-to-hello-world.md"
  - "posts/2022/11/28/workflows-patterns-and-best-practices-part-2.md"
---

There are [different ways to launch the execution](https://cloud.google.com/workflows/docs/executing-workflow) of a workflow. In previous articles, we mentioned that you can [use the gcloud command-line](https://cloud.google.com/workflows/docs/quickstart-gcloud) tool to create an execution, you can also use the various [client libraries](https://cloud.google.com/workflows/docs/quickstart-client-libraries) to invoke Workflows, or use the [REST API](https://cloud.google.com/workflows/docs/reference/executions/rest). A workflow itself can also invoke other workflows!

But today, I'd like to tell you how to schedule the execution of a workflow. For that purpose, we'll take advantage of [Cloud Scheduler](https://cloud.google.com/scheduler). The [documentation](https://cloud.google.com/workflows/docs/schedule-workflow) is actually covering this topic in detail, so be sure to grab all the info there. However, I'll go quickly through the steps, and tell you about a nice new feature in the cloud console to ease the scheduling of workflows!

First, you need to have both Workflows and Cloud Scheduler enabled:

```bash
gcloud services enable cloudscheduler.googleapis.com workflows.googleapis.com
```

Cloud Scheduler will need a service account with `workflows.invoker` role, to be allowed to call Workflows:

```bash
gcloud iam service-accounts create workflows_caller_sa
gcloud projects add-iam-policy-binding MY_PROJECT_ID \
  --member serviceAccount:workflows_caller_sa@MY_PROJECT_ID.iam.gserviceaccount.com \\
  --role roles/workflows.invoker
```

Now it's time to create the cron job:

```bash
gcloud scheduler jobs create http every_5_minute_schedule \
    --schedule="*/5 * * * *" \
    --uri="https://workflowexecutions.googleapis.com/v1/projects/MY_PROJECT_ID/locations/REGION_NAME/workflows/WORKFLOW_NAME/executions" \
    --message-body="{\"argument\": \"DOUBLE_ESCAPED_JSON_STRING\"}" \
    --time-zone="America/New_York" \
    --oauth-service-account-email="workflows_caller_sa@MY_PROJECT_ID.iam.gserviceaccount.com"
```

Here, you can see that Scheduler will run every 5 minutes (using the cron notation), and that it's going to call the Workflows REST API to create a new execution. You can also pass an argument for the workflow input.

The cool new feature I was eager to mention today was the direct integration of the scheduling as part of the Workflows creation flow, in the cloud console.

Now, when you create a new workflow, you can select a trigger:

![](/img/schedule-workflow/scheduler-trigger-1-600.jpg)

Click on the `ADD NEW TRIGGER` button, and select `Scheduler`. A side panel on the right will show up, and you will be able to specify the schedule to create, directly integrated, instead of having to head over to the Cloud Scheduler product section:

![](/img/schedule-workflow/scheduler-trigger-2-600.png)

And there, you can specify the various details of the schedule! It's nice to see both products nicely integrated, to ease the flow of creating a scheduled workflow.
