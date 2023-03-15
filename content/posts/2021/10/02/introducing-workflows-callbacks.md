---
title: "Introducing Workflows callbacks"
date: 2021-10-03T10:38:29+01:00
tags:
- google-cloud
- workflows
canonical: "https://cloud.google.com/blog/topics/developers-practitioners/introducing-workflows-callbacks"
---

With [Workflows](http://cloud.google.com/workflows), developers can easily orchestrate various services together, on Google Cloud or third-party APIs. Workflows [connectors](https://cloud.google.com/blog/topics/developers-practitioners/introducing-new-connectors-workflows) handle long-running operations of Google Cloud services till completion. And Workflow executions can also wait for time to pass with the built-in [`sys.sleep function`](https://cloud.google.com/workflows/docs/reference/stdlib/sys/sleep), till some computation finishes, or some event takes place. 

But what if you need some user input or some approval in the middle of the workflow execution, like validating automatic text translation? Or an external system like a fulfillment center or an inventory system that is going to notify that products are back in stock? Instead of using a combination of "sleep" instructions and API polling, now you'll be able to use Workflows callbacks! 

With callbacks, the execution of a workflow can wait until it receives a call to a specific callback endpoint. Let's have a look at a concrete example.

## Case study: human validation of automated translation

Let's have a look at a concrete example! Machine learning based translations have reached an incredible level of quality, but sometimes, you want a human being to validate the translations produced. Thanks to Workflows callbacks, we can add a human, or an autonomous system, into the loop.

To illustrate this case study, the following diagram will show you a possible implementation of the whole process:

![/img/workflows-days/architecture-translation.max-1200x1200.png](/img/workflows-days/architecture-translation.max-1200x1200.png)

1.  First, the user visits a translation web page. They fill a textarea with the text they want to translate, and click on the translate button.
2.  Clicking on the button will call a Cloud Function that will launch an execution of the workflow. The text to translate is passed as a parameter of the function, and as a parameter of the workflow too.
3.  The text is saved in Cloud Firestore, and the Translation API is called with the input text, and will return the translation, which will be stored in Firestore as well. The translation appears on the web page in real-time thanks to the Firebase SDK.
4.  A step in the workflow creates a callback endpoint (also saved in Firestore), so that it can be called to validate or reject the automatic translation. When the callback endpoint is saved in Firestore, the web page displays validation and rejection buttons.
5.  The workflow now explicitly awaits the callback endpoint to be called. This pauses the workflow execution.
6.  The user decides to either validate or reject the translation. When one of the two buttons is clicked, a Cloud Function is called, with the approval status as parameter, which will in turn call the callback endpoint created by the workflow, also passing the approval status. The workflow resumes its execution, and saves the approval in Firestore. And this is the end of our workflow.

## Creating a callback and awaiting incoming calls

Two new built-in functions are introduced in the standard Workflows library:

-   [`events.create_callback_endpoint`](https://cloud.google.com/workflows/docs/reference/stdlib/events/create_callback_endpoint) --- to create and setup the callback endpoint

-   [`events.await_callback`](https://cloud.google.com/workflows/docs/reference/stdlib/events/await_callback) --- to wait for the callback endpoint to be called

With `events.create_callback_endpoint` you specify the HTTP method that should be used for invoking the callback endpoint, and you get a dictionary with the URL of that endpoint that you can pass to other systems. And with `events.await_callback`, you pass the callback endpoint to wait on, pass a timeout defining how long you want to wait, and when the endpoint is called, you get access to the body that was sent to the endpoint.

Let's have a look at the [YAML definition](https://github.com/GoogleCloudPlatform/workflows-demos/blob/master/callback-translation/translation-validation.yaml#L73) of our workflow, where we apply those two new functions. First, we're going to create the callback:

```yaml
- create_callback:
    call: events.create_callback_endpoint
    args:
        http_callback_method: "POST"
    result: callback_details
```

The callback endpoint is now ready to receive incoming requests via a `POST HTTP` method, and the details of that endpoint are stored in the `callback_details` dictionary (in particular, the url key will be associated with the URL of the endpoint).

Next, we pause the workflow, and await the callback with:

```yaml
- await_callback:
    call: events.await_callback
    args:
        callback: ${callback_details}
        timeout: 3600
    result: callback_request
```

The `callback_details` from earlier is passed as argument, as well as a timeout in seconds to wait for the callback to be made. When the call is received, all the details of the request are stored in the `callback_request` dictionary. You then have access to the full HTTP request, including its headers or its body. In case the timeout is reached, a `TimeoutError` is raised and can be caught by a `try /` `except` block.

## Going further and calling us back!

If you want to have a closer look at the above example, all the [code for this workflow](https://github.com/GoogleCloudPlatform/workflows-demos/blob/master/callback-translation/translation-validation.yaml) can be found in the [Workflows samples](https://github.com/GoogleCloudPlatform/workflows-demos/) Github repository. And you can follow the details of this [tutorial](https://cloud.google.com/workflows/docs/tutorial-callbacks-firestore) to replicate this workflow in your own project. As this is still a preview feature for now, please be sure to [request access to this feature](https://docs.google.com/forms/d/e/1FAIpQLSdgwrSV8Y4xZv_tvI6X2JEGX1-ty9yizv3_EAOVHWVKXvDLEA/viewform), if you want to try it on your own.

For more information on callbacks, be sure to read the [documentation](https://cloud.google.com/workflows/docs/creating-callback-endpoints). To dive deeper into the example above, please checkout the Github [repository](https://github.com/GoogleCloudPlatform/workflows-demos/tree/master/callback-translation) of this translation validation sample. Don't hesitate to let us know via Twitter to [@glaforge](http://twitter.com/glaforge) what you think of this feature, and how you intend on taking advantage of it in your own workflows!

[](https://cloud.google.com/blog/topics/developers-practitioners/introducing-new-connectors-workflows)