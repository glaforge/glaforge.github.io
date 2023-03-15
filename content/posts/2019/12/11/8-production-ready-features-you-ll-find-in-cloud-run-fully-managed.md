---
title: "8 production-ready features you'll find in Cloud Run fully managed"
date: 2019-12-11T13:42:59+01:00
tags:
- google-cloud
- cloud-run
canonical: "https://cloud.google.com/blog/products/serverless/a-developers-guide-to-new-features-in-cloud-run"
---

Since we [launched Cloud Run](https://cloud.google.com/blog/products/serverless/announcing-cloud-run-the-newest-member-of-our-serverless-compute-stack) at Google Cloud Next in April, developers have discovered that "serverless" and "containers" run well together. With [Cloud Run](https://cloud.google.com/run/), not only do you benefit from fully managed infrastructure, up and down auto-scaling, and pay-as-you-go pricing, but you're also able to package your workload however you like, inside a stateless container listening for incoming requests, with any language, runtime, or library of your choice. And you get all this without compromising portability, thanks to its [Knative](https://knative.dev/) open-source underpinnings. 

Many Google Cloud customers already use Cloud Run in production, for example, to deploy public websites or APIs, or as a way to perform fast and lightweight data transformations or background operations. 

*"Cloud Run promises to dramatically reduce the operational complexity of deploying containerized software. The ability to put an automatically scaling service in production with one command is very attractive."* - Jamie Talbot, Principal Engineer at Mailchimp.

[Cloud Run recently became generally available](https://cloud.google.com/blog/products/serverless/knative-based-cloud-run-services-are-ga), as both a fully managed platform or on [Anthos](https://cloud.google.com/anthos/), and offers a bunch of new features. What are those new capabilities? Today, let's take a look at what's new in the fully managed Cloud Run platform.

## 1. Service level agreement

With general availability, Cloud Run now comes with a [Service Level Agreement](https://cloud.google.com/run/sla) (SLA). In addition, it now offers [data location commitments](https://cloud.google.com/terms/service-terms) that allow you to store customer data in a specific region/multi-region. 

## 2. Available in 9 GCP regions

In addition to South Carolina, Iowa, Tokyo, and Belgium, in the coming weeks, you'll also be able to deploy containers to Cloud Run in North Virginia, Oregon, Netherlands, Finland, and Taiwan, for a total of nine [cloud regions](https://cloud.google.com/about/locations).

![/img/8cr/Cloud_run_regions.max-2000x2000.png](/img/8cr/Cloud_run_regions.max-2000x2000.png)

## 3. Max instances

Auto-scaling can be magic, but there are times when you want to limit the maximum number of instances of your Cloud Run services, for example, to limit costs. Or imagine a backend service like a database is limited to a certain number of connections---you might want to limit the number of instances that can connect to that service. With the [max instance](https://cloud.google.com/run/docs/configuring/max-instances) feature, you can now set such a limit.

Use the Cloud Console or Cloud SDK to set this limit:

```bash
gcloud run services update SERVICE-NAME --max-instances 42
```

## 4. More secure: HTTPS only
All fully managed Cloud Run services receive a stable and secure URL. Cloud Run now only accepts secure HTTPS connection and redirects any HTTP connection to the HTTPS endpoint. 

But having an HTTPS endpoint does not mean that your service is publicly accessible---you are in control and can opt into [allowing public access](https://cloud.google.com/run/docs/authenticating/public) to your service. Alternatively, you can [require authentication](https://cloud.google.com/run/docs/authenticating/overview) by leveraging the "Cloud Run Invoker" IAM role.

## 5. Unary gRPC protocol support

Cloud Run now lets you deploy and run [unary gRPC](https://grpc.io/docs/guides/concepts/) services (i.e., non-streaming gRPC), allowing your microservices to leverage this RPC framework. 

To learn more, read Peter Malinas' tutorial on [Serverless gRPC with Cloud Run](https://medium.com/@petomalina/%EF%B8%8Fserverless-grpc-with-cloud-run-bab3622a47da) using Go, as well as Ahmet Alp Balkan's article on [gRPC authentication on Cloud Run](https://ahmet.im/blog/grpc-auth-cloud-run/).

## 6. New metrics to track your instances

Out of the box, Cloud Run integrates with [Stackdriver Monitoring](https://cloud.google.com/monitoring/). From within the Google Cloud Console, the Cloud Run page now includes a new "Metrics" tab that shows charts of key performance indicators for your Cloud Run service: requests per second, request latency, used instance time, CPU and memory.

A new built-in Stackdriver metric called [`container/billable_instance_time`](https://cloud.google.com/monitoring/api/metrics_gcp#gcp-run) gives you insights into the number of container instances for a service, with the billable time aggregated from all container instances.

![/img/8cr/billable_container_instance_time.max-1200x1200.jpg](/img/8cr/billable_container_instance_time.max-1200x1200.jpg)

## 7. Labels
Like the bibs that identify the runners in a race, GCP [labels](https://cloud.google.com/run/docs/configuring/labels) can help you easily identify a set of services, break down costs, or distinguish different environments.

You can set labels from the Cloud Run service list page in Cloud Console, or update labels with this command and flag:

```bash
gcloud run services update SERVICE-NAME --update-labels KEY=VALUE
```

## 8. Terraform support

Finally, if you practice [Infrastructure as Code](https://cloud.google.com/solutions/infrastructure-as-code/), you'll be glad to know that [Terraform now  supports Cloud Run](https://www.terraform.io/docs/providers/google/r/cloud_run_service.html), allowing you to provision Cloud Run services from a Terraform configuration. 

```hcl
resource "google_cloud_run_service" "default" {
    name     = "hello"
    location = "us-central1"
    template {
        spec {
            containers {
                image = "gcr.io/cloudrun/hello"
            }
        }
    }
}
```

## Ready, set, go!

The baton is now in your hands. To start deploying your container images to Cloud Run, head over to our quickstart guides on [building and deploying your images](https://cloud.google.com/run/docs/quickstarts/build-and-deploy). With the [always free tier](https://cloud.google.com/free/) and the $300 credit for new GCP accounts, you're ready to take Cloud Run for a spin. To learn more, there's the [documentation](https://cloud.google.com/run/docs/) of course, as well as the [numerous samples](https://github.com/GoogleCloudPlatform/cloud-run-samples) with different language runtimes (don't miss the "Run on Google Cloud" [button](https://github.com/GoogleCloudPlatform/cloud-run-button) to automatically deploy your code). In addition, be sure to check out the community-contributed resources on the [Awesome Cloud Run](https://github.com/steren/awesome-cloudrun) github project. We're looking forward to seeing what you build and deploy!