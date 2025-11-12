---
title: "Day 13 with Workflows — Logging with Cloud Logging"
date: 2021-02-02T17:35:19+01:00
tags:
- google-cloud
- workflows
- logging

similar:
  - "posts/2021/02/10/day-15-with-workflows-built-in-cloud-logging-function.md"
  - "posts/2020/12/15/day-8-with-workflows-calling-an-HTTP-endpoint.md"
  - "posts/2021/02/03/day-14-with-workflows-subworkflows.md"
---

Time to come back to our series on Cloud Workflows. 
Sometimes, for debugging purposes or for auditing, it is useful to be able to log some information via Cloud Logging. 
As we saw last month, you can 
[call HTTP endpoints]({{< ref "/posts/2020/12/15/day-8-with-workflows-calling-an-HTTP-endpoint" >}}) from your workflow. 
We can actually use 
[Cloud Logging's REST API](https://cloud.google.com/logging/docs/reference/v2/rest/v2/entries/write) to log such messages! 
Let's see that in action.

```yaml
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
                  textPayload:  Hello  World  from  Cloud  Workflows!
```

We call the <https://logging.googleapis.com/v2/entries:write> API endpoint to write new logging entries. 
We authenticate via OAuth2---as long as the service account used for the workflow execution allows it to use the logging API. 
Then we pass a JSON structure as the body of the call, indicating the name of the logger to use, 
which resources it applies to, and also the textPayload containing our text message. You could also use a ${} expression to log more complex values.

Once this workflow definition is done and deployed, you can execute it, and you should see in the logs your message appear:

![](/img/workflows-days/w13-cloud-logging.png)

Voila! You can log messages to Cloud Logging!

Let's recap in this video:

{{< youtube XwzSgBB6Kq4 >}}

In the next episode, we'll take advantage of subworkflows, 
to create a reusable set of steps that you will be able to call several times throughout your workflow definition,
without repeating yourself, by turning this logging example into a subworkflow.