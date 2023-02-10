---
title: "Reading in and writing a JSON file to a storage bucket from a workflow"
date: 2022-01-21T21:28:16+01:00
tags:
- google-cloud
- workflows
- cloud-storage
- json
---

[Workflows](https://cloud.google.com/workflows) provides several [connectors](https://cloud.google.com/workflows/docs/reference/googleapis) 
for interacting with various Google Cloud APIs and services. 
In the past, I've used for example the [Document AI connector](https://cloud.google.com/workflows/docs/reference/googleapis/documentai/Overview) 
to parse documents like expense receipts, 
or the [Secret Manager connector](https://cloud.google.com/workflows/docs/reference/googleapis/secretmanager/Overview) 
to store and access secrets like passwords. 
Another useful connector I was interested in using today was the 
[Google Cloud Storage connector](https://cloud.google.com/workflows/docs/reference/googleapis/storage/Overview), 
to store and read files stored in storage buckets.

Those connectors are auto-generated from their API discovery descriptors, 
but there are some limitations currently that prevent, for example, to download the content of a file. 
So instead of using the connector, I looked at the JSON API for cloud storage to see what it offered 
([insert](https://cloud.google.com/workflows/docs/reference/googleapis/storage/v1/objects/insert) and 
[get](https://cloud.google.com/storage/docs/json_api/v1/objects/get) methods).

What I wanted to do was to store a JSON document, and to read a JSON document. 
I haven't tried with other media types yet, like pictures or other binary files. 
Anyhow, here's how to write a JSON file into a cloud storage bucket:

```yaml
main:
    params:  [input]
    steps:
    - assignment:
        assign:
            - bucket:  YOUR_BUCKET_NAME_HERE
    - write_to_gcs:
        call:  http.post
        args:
            url:  ${"https://storage.googleapis.com/upload/storage/v1/b/"  +  bucket  +  "/o"}
            auth:
                type:  OAuth2
            query:
                name:  THE_FILE_NAME_HERE
            body:
                name:  Guillaume
                age:  99
```

In the file, I'm storing a JSON document that contains a couple keys, defined in the body of that call. 
By default, here, a JSON media type is assumed, so the body defined at the bottom in YAML is actually written as JSON in the resulting file. 
Oh and of course, don't forget to change the names of the bucket and the object in the example above.

And now, here's how you can read the content of the file from the bucket:

```yaml
main:
    params:  [input]
    steps:
    - assignment:
        assign:
            - bucket:  YOUR_BUCKET_NAME_HERE
            - name:  THE_FILE_NAME_HERE
    - read_from_gcs:
        call:  http.get
        args:
            url:  ${"https://storage.googleapis.com/download/storage/v1/b/"  +  bucket  +  "/o/"  +  name}
            auth:
                type:  OAuth2
            query:
                alt:  media
        result:  data_json_content
    - return_content:
        return:  ${data_json_content.body}
```

This time we change the GCS URL from `upload` to `download`, 
and we use the `alt=media` query parameter to instruct the GCS JSON API that we want to retrieve the content of the file (not just its metadata). 
In the end, we return the body of that call, which contains the content.