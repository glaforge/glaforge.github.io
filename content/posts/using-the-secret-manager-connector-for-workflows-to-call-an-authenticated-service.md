---
title: "Using the Secret Manager connector for Workflows to call an authenticated service"
date: 2022-02-04T22:26:59+01:00
tags:
- google-cloud
- workflows
- secret-manager
---

Workflows allows you to call APIs, whether from or hosted on Google Cloud, or any external API in the wild. 
A few days ago, for example, we saw an example on 
[how to use the SendGrid API to send emails from a workflow](https://glaforge.appspot.com/article/sending-an-email-with-sendgrid-from-workflows). 
However, in that article, I had the API key hard-coded into my workflow, which is a bad practice. 
Instead, we can store secrets in [Secret Manager](https://cloud.google.com/secret-manager). 
Workflows has a specific [connector for Secret Manager](https://cloud.google.com/workflows/docs/reference/googleapis/secretmanager/Overview), 
and a useful method to access secrets.

In this article, we'll learn two things:
* How to access secrets stored in Secret Manager with the Workflows connector
* How to call an API that requires basic authentication

Let's access the secrets I need to do my basic auth call to the API I need to call:

```yaml
- get_secret_user:
    call:  googleapis.secretmanager.v1.projects.secrets.versions.accessString
    args:
      secret_id:  basicAuthUser
    result:  secret_user
- get_secret_password:
    call:  googleapis.secretmanager.v1.projects.secrets.versions.accessString
    args:
      secret_id:  basicAuthPassword
    result:  secret_password
```

The user login and password are now stored in variables that I can reuse in my workflow. 
I will create the Base64 encoded user:password string required to pass in the authorization header:

```yaml
- assign_user_password:
    assign:
    - encodedUserPassword:  ${base64.encode(text.encode(secret_user  +  ":"  +  secret_password))}
```

Equipped with my encoded user:password string, I can now call my API (here a cloud function) 
by added an authorization header with basic authentication (and return the output of the function):

```yaml
- call_function:
    call:  http.get
    args:
        url:  https://europe-west1-workflows-days.cloudfunctions.net/basicAuthFn
        headers:
            Authorization:  ${"Basic  " + encodedUserPassword}
    result: fn_output
- return_result:
    return: ${fn_output.body}
```

Workflows has built-in 
[OAuth2 and OIDC support for authenticating to Google hosted APIs, functions and Cloud Run services](https://cloud.google.com/workflows/docs/authentication#making_authenticated_requests), 
but it's also useful to know how to invoke other authenticated services, like those requiring basic auth, or other bearer tokens.