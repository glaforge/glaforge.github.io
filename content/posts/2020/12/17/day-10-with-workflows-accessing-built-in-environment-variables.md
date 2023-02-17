---
title: "Day 10 with Workflows — Accessing built-in environment variables"
date: 2020-12-17T19:13:07+01:00
tags:
- google-cloud
- workflows
---

[Google Cloud Workflows](https://cloud.google.com/workflows) offers a few built-in environment variables that are accessible from your workflow executions.

{{< youtube sJQWbo49pWg >}}

There are currently [5 environment variables](https://cloud.google.com/workflows/docs/reference/environment-variables) that are defined:

- `GOOGLE_CLOUD_PROJECT_NUMBER`: The workflow project's number.
- `GOOGLE_CLOUD_PROJECT_ID`: The workflow project's identifier.
- `GOOGLE_CLOUD_LOCATION`: The workflow's location.
- `GOOGLE_CLOUD_WORKFLOW_ID`: The workflow's identifier.
- `GOOGLE_CLOUD_WORKFLOW_REVISION_ID`: The workflow's revision identifier.

Let's see how to access them from our workflow definition:

```yaml
- envVars:
    assign:
      - projectID:  ${sys.get_env("GOOGLE_CLOUD_PROJECT_ID")}
      - projectNum:  ${sys.get_env("GOOGLE_CLOUD_PROJECT_NUMBER")}
      - projectLocation:  ${sys.get_env("GOOGLE_CLOUD_LOCATION")}
      - workflowID:  ${sys.get_env("GOOGLE_CLOUD_WORKFLOW_ID")}
      - workflowRev:  ${sys.get_env("GOOGLE_CLOUD_WORKFLOW_REVISION_ID")}
- output:
    return:  ${projectID  +  " "  +  projectNum  +  " "  +  projectLocation  +  " "  +  workflowID  +  " "  +  workflowRev}
```

We use the built-in `sys.get_env()` function to access those variables. 
We'll revisit the various existing built-in functions in later episodes.

Then when you execute this workflow, you'll get an output like this:

```
"workflows-days 783331365595 europe-west4 w10-builtin-env-vars 000001-3af"
```

There's one variable I'd like to see added to this list, that would be the current execution ID. 
That could potentially be useful for identifying a particular execution, when looking in the logs, to reason about potential failure, or for auditing purposes.