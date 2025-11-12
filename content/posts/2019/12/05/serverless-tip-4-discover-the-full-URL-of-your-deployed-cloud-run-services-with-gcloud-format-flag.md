---
title: "Serverless tip #4 — Discover the full URL of your deployed Cloud Run services with gcloud format flag"
date: 2019-12-05T16:39:56+01:00
tags:
- google-cloud
- cloud-run
- serverless
- tips

similar:
  - "posts/2019/12/11/serverless-tip-5-how-to-invoke-a-secured-cloud-run-service-locally.md"
  - "posts/2019/12/11/8-production-ready-features-you-ll-find-in-cloud-run-fully-managed.md"
---

Requirements:

-   an existing Google Cloud Platform account
-   you have enabled the Cloud Run service and deployed already a container image

One of the nice things with Cloud Run is that when you deploy your services, you get a URL like https://myservice-8oafjf26aq-ew.a.run.app/, with a certificate, on the run.app domain name, etc.

You see the name of the service: myservice, the region shortcut where it was deployed: ew (Europe West), and then .a.run.app. However, you can't guess ahead of time what the final URL will be, as there is a randomly generated part in the URL (here: `8oafjf26aq`). Let's see how we can discover this whole URL.

From my terminal, I can request the list of deployed services (here, on the fully managed Cloud Run):

```bash
gcloud run services list \
       --platform managed
```

It's going to show me something like the following output:

```
   SERVICE      REGION        URL                                        LAST DEPLOYED BY     LAST DEPLOYED AT
✔  myservice    europe-west1  https://myservice-8oafjf26aq-ew.a.run.app  myself@foobar.com    2019-11-20T15:26:39.442Z
```

When describing the specific service (I had to specify the region as well, but you can set it by default if needed to avoid repeating yourself):

```bash
gcloud run services describe myservice \
       --platform managed \
       --region europe-west1
```

You'll see:

```
✔ Service hello in region europe-west1
https://myservice-8oafjf26aq-ew.a.run.app
Traffic:
  100%               LATEST (currently myservice-00002-dox)
Last updated on 2019-11-20T15:26:39.442Z by myself@foobar.com:
  Revision myservice-00002-dox
  Image:             gcr.io/my-sample-project/my-container-image:latest
```

So instead of parsing that ourselves somehow, there's a built-in way to get just the info we want, with the useful `--format` flag:

```bash
gcloud run services describe myservice \
    --format='value(status.url)' \
    --platform managed --region europe-west1 
```

This time, in output, you'll get just the URL, which you can then export or reuse with other commands.

```bash
https://myservice-8oafjf26aq-ew.a.run.app
```

The `glcoud` command provides three useful mechanisms to filter, format, or project the output and values returned. Here, we took advantage of format.

More information:

-   [https://cloud.run](https://cloud.run/), the serverless container platform
-   [Filtering and formatting fun with gcloud, GCP's command line interface](https://cloud.google.com/blog/products/gcp/filtering-and-formatting-fun-with)
-   [gcloud filters](https://cloud.google.com/sdk/gcloud/reference/topic/filters)
-   [gcloud formats](https://cloud.google.com/sdk/gcloud/reference/topic/formats)
-   [gcloud projections](https://cloud.google.com/sdk/gcloud/reference/topic/projections)