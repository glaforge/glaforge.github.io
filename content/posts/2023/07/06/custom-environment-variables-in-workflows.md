---
title: "Custom Environment Variables in Workflows"
date: 2023-07-06T14:44:24+02:00
tags:
- google-cloud
- workflows

similar:
  - "posts/2020/12/17/day-10-with-workflows-accessing-built-in-environment-variables.md"
  - "posts/2022/02/03/upload-and-use-json-data-in-your-workflow-from-gcs.md"
  - "posts/2022/02/01/sending-an-email-with-sendgrid-from-workflows.md"
---

In addition to the built-in [environment variables available by default](https://cloud.google.com/workflows/docs/reference/environment-variables) in Google Cloud [Workflows](https://cloud.google.com/workflows) (like the project ID, the location, the workflow ID, etc.) it’s now possible to define your own [custom environment variables](https://cloud.google.com/workflows/docs/use-environment-variables)!

Why is it useful and important? It’s particularly handy when you want to read information that is dependent on the deployment of your workflow, like, for example, information about the environment you’re running in. Is my workflow running in development, staging, or production environment? Then you can read your custom `MY_ENVIRONMENT` variable, like you read the existing built-in environment variables. And you define such variables at deployment time.

In our [best practices articles](https://cloud.google.com/blog/topics/developers-practitioners/workflows-patterns-and-best-practices-part-3#:~:text=Plan%20for%20multi%2Denvironment%20orchestrations), and in the more detailed article on [multi-environment service orchestration](https://cloud.google.com/blog/topics/developers-practitioners/multi-environment-service-orchestrations), my colleague [Mete](https://atamel.dev/) and I had shared ways to implement such an approach. You have a workflow that orchestrates some API calls. But you want to have one single workflow definition that can run in different environments. There were a few approaches, each with pros and cons, to do that: by passing the API URLs as parameters of the workflow execution (but it doesn’t work for event-triggered workflows), by replacing some special text tokens before deployment, or even with some string replacement when deploying with Terraform.

But now, things are simpler! Let’s see how to **define custom environment variables** and how to **access them**.

## Calling an API endpoint in staging or in prod

With custom environment variables, you can now deploy the exact same workflow definition, but with different variables, using the `sys.get_env()` built-in function:


```bash
- call_a_service:
    call: http.get
    args:
      url: ${sys.get_env("SERVICE_URL"}
```


And on deployment, specify `SERVICE_URL` to point at the staging or the production URL of that service.

## Setting environment variables

Now that we’ve seen how to access an environment variable, let’s see how you can set it.

As explained in the documentation about [custom environment variables](https://cloud.google.com/workflows/docs/use-environment-variables), you can use different flags to define, update, delete those variables.

You can specify one or more variables with `--set-env-vars`:

```bash
gcloud workflows deploy WORKFLOW_NAME \
    --set-env-vars KEY1=VALUE1,KEY2=VALUE2
```


Use a file that contains all your custom environment variables (one `key:value` per line):


```bash
gcloud workflows deploy WORKFLOW_NAME \
    --env-vars-file FILE_PATH
```

You can also update vars with the `--update-env-vars` flag, remove some with `--remove-env-vars`, or delete them all with `--clear-env-vars`.

## Bonus tip: Use the `default()` built-in function in case the environment variable isn’t defined

In case the environment variable wasn’t defined at deployment time, you can use the `default()` value method to set a default value, like in this example

```yaml
- logEnv:
    call: sys.log
    args:
        text: ${default(sys.get_env("ENVIRONMENT"), "PRODUCTION")}
```

Here, we’re logging the value of the environment, but if the `ENVIRONMENT` custom environment variable isn’t defined, by default, the value will be `PRODUCTION`.

## Summary

With custom environment variables, you can parameterize your workflows to tackle different use cases. One of the most frequently used ones is to use those environment variables to distinguish between different environments, like prod or staging. But you can also use them to configure different parameters of your workflow, like defining some configurable limits (number of retries), different endpoints or parameters for the services you call. You define your workflow once, and customize the deployment with different environment variables.
