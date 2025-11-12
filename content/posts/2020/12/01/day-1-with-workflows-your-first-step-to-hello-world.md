---
title: "Day 1 with Workflows — Your first step to Hello World"
date: 2020-12-01T23:22:11+01:00
tags:
- google-cloud
- workflows

similar:
  - "posts/2020/12/16/day-9-with-workflows-deploying-and-executing-workflows-from-the-command-line.md"
  - "posts/2020/11/18/orchestrating-microservices-with-cloud-workflows.md"
  - "posts/2022/11/22/workflows-patterns-and-best-practices-part-1.md"
---

With more and more interconnected services, making sense of their interactions becomes critical. 
With Google [Cloud Workflows](https://cloud.google.com/workflows), 
developers can orchestrate and automate such complex systems by creating serverless workflows.

In this series of articles, we will learn together how to use Goole Cloud Workflows, 
and get to know all its features, with short and easy to read tutorials. 
For our first day, we'll discover and use the Workflows UI in the 
[cloud console](https://console.cloud.google.com/). 
We will create a simple "hello world" workflow, consisting of a simple step. 
Going further, in the coming days, we'll learn more about advanced features. 
But first things first!

{{< youtube 75BekrpL-qo >}}

In the Google Cloud console UI, you can locate Workflows in the `Tools` section of the hamburger menu:

![](/img/workflows-days/wf01-01-menu.png)

You can pin this menu item, to have it stick at the top of the list.

The first time you are accessing this page, you'll be greeted with the following screen, 
which will ask you to enable the Workflows API. So just click on `ENABLE`:

![](/img/workflows-days/wf01-02-enable-api.png)

Once the API is enabled, you'll be in the Workflows home screen:

![](/img/workflows-days/wf01-03-workflows-home.png)

Click on the `CREATE` button to create your first workflow definition:

![](/img/workflows-days/wf01-04-empty-state.png)

Find a name for your workflow (it should start with a letter). 
You can provide an optional description. Currently, only "us-central1" 
is available for the beta of Workflows, but more regions will be available later on.

Notice that we have to select a service account that Workflows will use to call other Google Cloud APIs, however here, there's a warning telling us that the project requires a service account. 
As I've created a brand new project, I didn't have any service account created. 
If you had used, for example, Cloud Functions beforehand, a default service account would have been created. If you need to create a service account, 
you can create one in `IAM & Admin > Service Accounts`, then use this one.

My first workflow will be called `w01-first-workflow`:

![](/img/workflows-days/wf01-05-form-filled.png)

Move on to the next section with the `NEXT` button. 
That's where you will define your workflow:

![](/img/workflows-days/wf01-06-definition.png)

This first workflow consists in one single step, called `sayHello`, 
and whose sole purpose is to return a hello world message:

```yaml
- sayHello:
    return: Hello from Cloud Workflows!
```

As you can see, workflow definitions are written using the 
[YAML](https://yaml.org/) configuration language.

Click `DEPLOY` to deploy the workflow. You will then see the details of your new workflow. 
In the "executions" tab, you can see past executions.

![](/img/workflows-days/wf01-07-created.png)

In the `logs` section, you can see the logging messages associated with your workflow creation, deployment and executions:

![](/img/workflows-days/wf01-08-logs.png)

And in the `definitions` section, you can see the YAML description you just created:

![](/img/workflows-days/wf01-09-definition.png)

Now click on the `EXECUTE` button. You will see the input section 
(we'll learn about input arguments in an upcoming article), and the YAML definition. 
Click the other `EXECUTE` button:

![](/img/workflows-days/wf01-10-exec-screen.png)

You will see the result of your execution (`succeeded`, with other details about the execution), 
as well as both the input and the output, with our greeting message:

![](/img/workflows-days/wf01-11-executed.png)

And here you are! You created your first workflow definition, and launched the first execution of this workflow!

In the coming days, we will have a closer look at the structure of workflow definitions (its steps), 
how to define input arguments, but also how to create an execution of a workflow from the command-line.

