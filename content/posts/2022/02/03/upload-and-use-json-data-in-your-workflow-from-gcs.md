---
title: "Upload and use JSON data in your workflow from GCS"
date: 2022-02-03T22:39:13+01:00
tags:
- google-cloud
- workflows
- json
- cloud-storage

similar:
  - "posts/2022/02/01/sending-an-email-with-sendgrid-from-workflows.md"
  - "posts/2022/01/21/reading-in-and-writing-a-json-file-to-a-storage-bucket-from-a-workflow.md"
  - "posts/2023/07/06/custom-environment-variables-in-workflows.md"
---

Following up the [article]({{< ref "/posts/2022/01/21/reading-in-and-writing-a-json-file-to-a-storage-bucket-from-a-workflow.md" >}}) 
on writing and reading JSON files in cloud storage buckets (GCS), we saw that we could access the data of the JSON file, and use it in our workflow. 
Let's have a look at a concrete use of this.

Today, we'll take advantage of this mechanism to avoid hard-coding the URLs of the APIs we call from our workflow. 
That way, it makes the workflow more portable across environments.

Let's regroup the logic for reading and loading the JSON data in a reusable subworkflow:

```yaml
read_env_from_gcs:
    params:  [bucket,  object]
    steps:
    - read_from_gcs:
        call:  http.get
        args:
            url:  ${"https://storage.googleapis.com/download/storage/v1/b/"  +  bucket  +  "/o/"  +  object}
            auth:
                type:  OAuth2
            query:
                alt:  media
        result:  env_file_json_content
    - return_content:
        return:  ${env_file_json_content.body}
```

You call this subworkflow with two parameters: the bucket name, and the object or file name that you want to load.

Now let's use it from the main workflow. We need a first step to call the subworkflow to load a specific file from a specific bucket. 
The subworkflow below will return the content of the JSON data in the env_details variable.

```yaml
​​main:
    params:  [input]
    steps:
    - load_env_details:
        call:  read_env_from_gcs
        args:
            bucket:  workflow_environment_info
            object:  env-info.json
        result:  env_details
```

Imagine the JSON file contains a JSON object with a `SERVICE_URL` key, pointing at the URL of a service, 
then you can call the service with the following expression: `${env_details.SERVICE_URL}` as shown below.

```yaml
    - call_service:
        call:  http.get
        args:
            url:  ${env_details.SERVICE_URL}
        result:  service_result
    - return_result:
        return:  ${service_result.body}
```

This is great for avoiding hardcoding certain values in your workflow definitions. 
However, for true environment-specific deployments, this is not yet ideal, as you would have to point to a different file in the bucket, or use a different bucket. 
And that information is currently hardcoded in the definition when you make the call to the subworkflow. 
But if you follow some naming conventions for the project names and bucket names, that map to environments, this can work! 
(ie. `PROD_bucket` vs `DEV_bucket`, or `PROD-env-info.json` vs `DEV-env-info.json`)

Let's wait for the support of environment variables in Workflows!