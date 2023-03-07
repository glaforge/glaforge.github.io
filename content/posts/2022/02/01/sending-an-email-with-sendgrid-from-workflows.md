---
title: "Sending an email with SendGrid from Workflows"
date: 2022-02-01T21:04:31+01:00
tags:
- google-cloud
- workflows
- email
- sendgrid
---

Following up the [article]({{< ref "/posts/2022/01/21/reading-in-and-writing-a-json-file-to-a-storage-bucket-from-a-workflow.md" >}}) 
on writing and reading JSON files in cloud storage buckets, we saw that we could access the data of the JSON file, 
and use it in our workflow. Let's have a look at a concrete use of this.

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
The subworkflow below will return the content of the JSON data in the `env_details` variable.

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
However, for true environment-specific deployments, this is not yet ideal, 
as you would have to point to a different file in the bucket, or use a different bucket. 
And that information is currently hardcoded in the definition when you make the call to the subworkflow. 
But if you follow some naming conventions for the project names and bucket names, that map to environments, 
this can work! (ie. `PROD_bucket` vs `DEV_bucket`, or `PROD-env-info.json` vs `DEV-env-info.json`)

Let's wait for the support of environment variables in Workflows!
For notification purposes, especially in an asynchronous way, email is a great solution. 
I wanted to add an email notification step in [Google Cloud Workflows](https://cloud.google.com/workflows). 
Since GCP doesn't have an email service, I looked at the various email services available in the cloud: SendGrid, Mailgun, Mailjet, 
and even ran a quick Twitter [poll](https://twitter.com/glaforge/status/1488444661211533312) to see what folks in the wild are using. 
I experimented with SendGrid, and the [sign up](https://signup.sendgrid.com/) process was pretty straightforward, 
as I was able to [get started](https://docs.sendgrid.com/for-developers/sending-email/api-getting-started) quickly, 
by creating an API key, and sending my first email with cURL command.

Now comes the part where I needed to call that API from my workflow definition. 
And that's actually pretty straightforward as well. 
Let's see that in action:

```yaml
- retrieve_api_key:
    assign:
        - SENDGRID_API_KEY:  "MY_API_KEY"
- send_email:
    call:  http.post
    args:
        url:  https://api.sendgrid.com/v3/mail/send
        headers:
            Content-Type:  "application/json"
            Authorization:  ${"Bearer  " + SENDGRID_API_KEY}
        body:
            personalizations:
                - to:
                    - email: to@example.com
            from:
                email: from@example.com
            subject: Sending an email from Workflows
            content:
                - type: text/plain
                  value: Here's the body of my email
    result: email_result
- return_result:
    return: ${email_result.body}
```

In the `retrieve_api_key` step, I simply hard-coded the SendGrid API key. 
However, you can of course store that secret in Secret Manager, 
and then fetch the secret key thanks to the Workflows Secret Manager connector (that's probably worth a dedicated article!)

Then, in the `send_email` step, I prepare my HTTP POST request to the SendGrid API endpoint. 
I specify the content type, and of course, the authorization using the SendGrid API key. 
Next, I prepare the body of that request, describing my email, 
with a `from` field with a registered email user that I defined in SendGrid, a `to` field corresponding to the recipient, 
an email `subject` and `body` (just plain text, here). 
And that's pretty much it! 
I just translated the JSON body sent in the [cURL example](https://app.sendgrid.com/guide/integrate/langs/curl) from SendGrid's documentation, 
into YAML (using a handy JSON to YAML conversion [utility](https://www.json2yaml.com/))