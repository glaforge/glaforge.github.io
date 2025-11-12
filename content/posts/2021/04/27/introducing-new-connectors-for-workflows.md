---
title: "Introducing New Connectors for Workflows"
date: 2021-04-27T13:52:35+01:00
tags:
- google-cloud
- workflows
canonical: "https://cloud.google.com/blog/topics/developers-practitioners/introducing-new-connectors-workflows"

similar:
  - "posts/2022/11/04/workflows-tips-and-tricks.md"
  - "posts/2021/10/02/introducing-workflows-callbacks.md"
  - "posts/2022/11/28/workflows-patterns-and-best-practices-part-2.md"
---

[Workflows](http://cloud.google.com/workflows) is a service to orchestrate not only Google Cloud services, such as Cloud Functions,  Cloud Run, or machine learning APIs, but also external services. As you might expect from an orchestrator, Workflows allows you to define the flow of your business logic, as steps, in a YAML or JSON definition language, and provides an execution API and UI to trigger workflow executions. You can read more about the benefits of Workflows in our [previous article](https://cloud.google.com/blog/topics/developers-practitioners/better-service-orchestration-workflows).

We are happy to announce new [connectors](https://cloud.google.com/workflows/docs/connectors) for Workflows, which simplify calling Google Cloud services and APIs. 

The first documented connectors offered in preview when Workflows was launched in General Availability were:

-   Cloud Tasks
-   Compute Engine
-   Firestore
-   Pub/Sub
-   Secret Manager

The newly unveiled connectors are:

-   BigQuery
-   Cloud Build
-   Cloud Functions
-   Cloud Scheduler
-   Google Kubernetes Engine
-   Cloud Natural Language API
-   Dataflow
-   Cloud SQL
-   Cloud Storage
-   Storage Transfer Service
-   Cloud Translation
-   Workflows & Workflow Executions

In addition to simplifying Google Cloud service calls (no need to manually tweak the URLs to call) from workflow steps, connectors also handle errors and [retries](https://cloud.google.com/workflows/docs/connectors), so you don't have to do it yourself. Furthermore, they take care of APIs with [long-running operations](https://cloud.google.com/workflows/docs/connectors#long-running_operations), polling the service for a result when it's ready, with a back-off approach, again so you don't have to handle this yourself.

Let's take a look at some concrete examples on how connectors help. 

## Creating a Compute Engine VM with a REST API call

Imagine you want to create a Compute Engine Virtual Machine (VM) in a specified project and zone. You can do this by crafting an HTTP POST request with the proper URL, body, and OAuth2 authentication using the Compute Engine API's [instances.insert](https://cloud.google.com/compute/docs/reference/rest/v1/instances/insert) method as shown in [create-vm.yaml](https://github.com/GoogleCloudPlatform/workflows-demos/blob/master/connector-compute/create-vm.yaml):

```yaml
main:
  params: [args]
  steps:
  - init:
      assign:
      - project: ${sys.get_env("GOOGLE_CLOUD_PROJECT_ID")}
      - zone: "europe-west1-b"
      - machineType: "e2-small"
      - instanceName: "${args.instanceName}"
  - insert_machine:
      call: http.post
      args:
        url: ${"https://compute.googleapis.com/compute/v1/projects/" + project + "/zones/" + zone + "/instances"}
        auth:
          type: OAuth2
        body:
          name: ${instanceName}
          machineType: ${"zones/" + zone + "/machineTypes/" + machineType}
          disks:
          - initializeParams:
              sourceImage: "projects/debian-cloud/global/images/debian-10-buster-v20201112"
            boot: true
            autoDelete: true
          networkInterfaces:
          - network: "global/networks/default"
```


This works but it is quite error prone to construct the right URL with the right parameters and authentication mechanism. You also need to poll the instance status to make sure it's running before concluding the workflow:

```yaml
- get_instance:
      call: http.get
      args:
        url: ${"https://compute.googleapis.com/compute/v1/projects/" + project + "/zones/" + zone + "/instances/" + instanceName}
        auth:
          type: OAuth2
      result: getInstanceResult
  - assert_running:
      switch:
        - condition: ${getInstanceResult.body.status == "RUNNING"}
          next: end
      next: sleep
  - sleep:
      call: sys.sleep # Polling through sleep
      args:
        seconds: 3
      next: get_instance
```

Note that even the HTTP GET call above could fail and it'd be better to wrap the call in a retry logic. 

## Creating a Compute Engine VM with the Workflows compute connector

In contrast, let's now create the same VM with the compute connector dedicated to Compute Engine as shows in [create-vm-connector.yaml](https://github.com/GoogleCloudPlatform/workflows-demos/blob/master/connector-compute/create-vm-connector.yaml):

```yaml
main:
  params: [args]
  steps:
  - init:
      assign:
      - project: ${sys.get_env("GOOGLE_CLOUD_PROJECT_ID")}
      - zone: "europe-west1-b"
      - machineType: "e2-small"
      - instanceName: "${args.instanceName}"
  - insert_machine:
      call: googleapis.compute.v1.instances.insert
      args:
        project: ${project}
        zone: ${zone}
        body:
          name: ${instanceName}
          machineType: ${"zones/" + zone + "/machineTypes/" + machineType}
          disks:
          - initializeParams:
              sourceImage: "projects/debian-cloud/global/images/debian-10-buster-v20201112"
            boot: true
            autoDelete: true
          networkInterfaces:
          - network: "global/networks/default"
```

The overall structure and syntax is pretty similar, but this time, we didn't have to craft the URL ourselves, nor did we have to specify the authentication method. Although it's invisible in this YAML declaration, error handling and retry logic are handled by Workflows directly, unlike the first example where you have to handle it yourself.

## Transparent waiting for long-running operations

Some operations from cloud services are not instantaneous and can take a while to execute. A synchronous call to such operations will return immediately with an object that indicates the status of that long-running operation. 

From a workflow execution, you might want to call a long-running operation and move to the next step only when that operation has finished. In the standard REST approach, you have to check at regular intervals if the operation has terminated or not. To save you from the tedious work of iterating and waiting, connectors take care of this for you! 

Let's illustrate this with another example with Compute Engine. Stopping a VM can take a while. A [request](https://cloud.google.com/compute/docs/reference/rest/v1/instances/stop) to the Compute Engine REST API to stop a VM returns an [object](https://cloud.google.com/compute/docs/reference/rest/v1/instances/stop#response-body) with a status field that indicates whether the operation has completed or not.

The Workflows compute connector and its [instances.stop](https://cloud.google.com/compute/docs/reference/rest/v1/instances/stop) operation will appropriately wait for the stop of the VM -- no need for you  to keep checking its status until the VM stops. It greatly simplifies your workflow definition as shown in [create-stop-vm-connector.yaml](https://github.com/GoogleCloudPlatform/workflows-demos/blob/master/connector-compute/create-stop-vm-connector.yaml).

```yaml
main:
  params: [args]
  steps:
  - init:
      assign:
      - project: ${sys.get_env("GOOGLE_CLOUD_PROJECT_ID")}
      - zone: "europe-west1-b"
      - machineType: "e2-small"
      - instanceName: "${args.instanceName}"
  ...
  - stop_machine:
      call: googleapis.compute.v1.instances.stop
      args:
        instance: ${instanceName}
        project: ${project}
        zone: ${zone}
        # Optional connector parameters
        connector_params:
            timeout: 100 # total time is 100s
            polling_policy:  # optional polling parameters for LRO polling.
                initial_delay: 1
                multiplier: 1.25
  - assert_terminated:
      call: assert_machine_status
      args:
        expected_status: "TERMINATED"
        project: ${project}
        zone: ${zone}
        instanceName: ${instanceName}

assert_machine_status:
  params: [expected_status, project, zone, instanceName]
  steps:
  - get_instance:
      call: googleapis.compute.v1.instances.get
      args:
        instance: ${instanceName}
        project: ${project}
        zone: ${zone}
      result: instance
  - compare:
      switch:
      - condition: ${instance.status == expected_status}
        next: end
  - fail:
      raise: ${"Expected VM status is " + expected_status + ". Got " + instance.status + " instead."}
```

Note that we still use the [instances.get](https://cloud.google.com/compute/docs/reference/rest/v1/instances/get) operation in a subworkflow to check that the VM is indeed TERMINATED but this is nice-to-have as [instances.stop](https://cloud.google.com/compute/docs/reference/rest/v1/instances/stop) already waits for the VM to stop before returning.

In connector, users can set a timeout field, which is the total wait time for this connector call. All of the retries and polling logic is hidden. Now, compare this to [stop-vm.yaml](https://github.com/GoogleCloudPlatform/workflows-demos/blob/master/connector-compute/stop-vm.yaml) where the workflow stops the VM without the connector. You can see that the YAML is longer and the logic is more complicated with HTTP retry policy for the stop call and also the polling logic to make sure the VM is actually stopped.

## Increased reliability through connector retries

Even the best services can have momentary outages due to traffic spikes or network issues. Google Cloud Pub/Sub has an SLA of [99.95](https://uptime.is/99.95), which means no more than 43s of downtime per day on average, or under 22 minutes per month. Of course, most products routinely outperform their SLAs by a healthy margin. What if you want strong assurances your workflow won't fail if products remain within their SLAs? Since Workflows connectors retry operations over a period of several minutes, even if there is an outage of several minutes, the operation will succeed and so will the workflow.

## Let's connect!

To learn more about [connectors](https://cloud.google.com/workflows/docs/connectors), have a look at some of our [workflows-samples](https://github.com/GoogleCloudPlatform/workflows-samples/tree/main/src/connectors) repo, which show you how to interact with Compute Engine, Cloud Pub/Sub, Cloud Firestore, and Cloud Tasks. You can find the samples described in this blog post in [workflows-demos/connector-compute](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/connector-compute).

This is the initial set of connectors; there are many more Google Cloud products for which we will be creating dedicated connectors. We'd love to hear your thoughts about which connectors we should prioritize and focus on next (fill this [form](https://forms.gle/HKYn83bhDKWFSDQr7) to tell us). Don't hesitate to let us know via Twitter to [@meteatamel](https://twitter.com/meteatamel) and [@glaforge](http://twitter.com/glaforge)!