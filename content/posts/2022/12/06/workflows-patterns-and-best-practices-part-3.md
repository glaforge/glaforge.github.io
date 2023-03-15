---
title: "Workflows patterns and best practices — Part 3"
date: 2022-12-06T14:12:25+01:00
tags:
- google-cloud
- workflows
canonical: "https://cloud.google.com/blog/topics/developers-practitioners/workflows-patterns-and-best-practices-part-3"
---

This is a three-part series of posts, in which we summarize Workflows and service orchestration patterns. In this third and final post, we talk about managing workflow life cycles and the benefits of using Firestore with Workflows. 

### Use subworkflows and Terraform to manage workflow definitions

If you're not careful, the workflow definitions you create with YAML or JSON can get out of hand pretty quickly. While it is possible to use subworkflows to define snippets of a workflow that can be reused from multiple workflows, Workflows does not support importing these subworkflows. Thankfully, there are other tools, such as Terraform, that can help.

In our [Deploying multi-YAML Workflows definitions with Terraform](https://cloud.google.com/blog/topics/developers-practitioners/deploying-multi-yaml-workflows-definitions-terraform) post, we showed how to use Terraform to define a workflow and import it into a Terraform configuration file. We further showed how to also import a subworkflow in the same workflow definition. This makes it easier to manage workflows and subworkflow definitions.

When you're defining a workflow, make sure you have a strategy to define and reuse subworkflows with Terraform or some other tool.

### GitOps your service orchestrations

[GitOps](https://opengitops.dev/) takes DevOps best practices used for application development (such as version control and CI/CD) and applies them to infrastructure automation. Service orchestrations, which have their own definition files and deployment cycles, can benefit from a GitOps approach as well.

In our [GitOps your service orchestrations](https://cloud.google.com/blog/topics/developers-practitioners/gitsops-service-orchestration) post, we showed how to use Cloud Build to manage an automated and staged rollout of workflow changes with tests along the way to minimize risk.

![/img/workflows-patterns/GitOps_Blog_1.max-800x800.max-800x800.png](/img/workflows-patterns/GitOps_Blog_1.max-800x800.max-800x800.png)

### Plan for multi-environment orchestrations

While GitOps helps to manage the deployment lifecycle of a workflow, sometimes you need to make changes to the workflow before deploying to different environments. That means you need to design workflows with multiple environments in mind. For example, instead of hardcoding the URLs called from the workflow, replace the URLs with staging and production URLs depending on where the workflow is being deployed.

In our [Multi-environment service orchestrations](https://cloud.google.com/blog/topics/developers-practitioners/multi-environment-service-orchestrations) post, we showed three different ways of replacing URLs in a workflow: passing URLs as runtime arguments, using Cloud Build to deploy multiple versions, and using Terraform to deploy multiple versions.

![/img/workflows-patterns/GOB2_-_2.max-700x700.max-700x700.png](/img/workflows-patterns/GOB2_-_2.max-700x700.max-700x700.png)

### Manage external state with Firestore

You define workflows YAML/JSON as the recipe and then execute it with optional runtime arguments as an individual isolated instance of that recipe. Sometimes, you need to store some state (typically a key/value pair) in a step from one workflow execution and later read that state in another step from another workflow execution. There's no intrinsic key/value store in Workflows. However, you can use Firestore to store and read key/value pairs from Workflows.

In our [Workflows state management with Firestore](https://medium.com/google-cloud/worklows-state-management-with-firestore-99237f08c5c5) post and its associated [sample](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/state-management-firestore), we showed a couple of subworkflows to put and get key/value pairs from Workflows with Firestore. This pattern is very useful when you need to manage some state in your workflow. 

### Workflows for reliable work and Firestore for reactive UI

You can count on Workflows to perform some long-running work reliably and as an admin, check the status of the workflow and the current running step using the Google Cloud console or the Workflows API. However, how do you keep end users up to date about the status of the workflow? To have this kind of reactive UI, you can have your workflow write its status to a Firestore document and have Firestore notify connected end users in real time.

At Google I/O, we demonstrated this pattern with two examples. In the [expense report application](https://github.com/GoogleCloudPlatform/smart-expenses), the UI updates the status of the approval process both for the employee and the manager. In the [translation application using callbacks](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/callback-translation), Firestore is used to show the status of an ongoing translation.

{{< youtube "l3aMs00ziYA" >}}

* * * * *

This wraps up our three-part series. For questions or feedback, or if you want to share your own best practices and patterns, feel free to reach out to us on Twitter @[meteatamel](https://twitter.com/meteatamel) and @[glaforge](https://twitter.com/glaforge).