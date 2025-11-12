---
title: "Serverless tip #3 — Use the Cloud Run button on your Git repository to deploy your project in a click"
date: 2019-12-04T16:44:23+01:00
tags:
- google-cloud
- cloud-run
- serverless
- git
- tips

similar:
  - "posts/2022/10/24/build-deploy-java-17-apps-on-cloud-run-with-cloud-native-buildpacks-on-temurin.md"
  - "posts/2019/12/11/8-production-ready-features-you-ll-find-in-cloud-run-fully-managed.md"
  - "posts/2020/08/04/running-micronaut-serverlessly-on-google-cloud-platform.md"
---

Requirements:

-   an existing Google Cloud Platform account
-   a Git or Github repository containing your project
-   your project can have a Dockerfile (but not mandatory)

With [Cloud Run](https://cloud.run/), you can easily deploy a container image and let it scale up and down as needed, in a serverless fashion:

-   No need to focus on infrastructure (provisioning servers, clusters, upgrading OS, etc.)
-   Your application can scale transparently from 0 to 1, and from 1 to n (no need for a pager when your app is featured on Hackernews)
-   You pay as you go, proportionally to the usage

If your project is hosted on Github, for example, how can you help users get started with your project? You usually explain all the steps needed to build a container image, or where to fetch a pre-made image from a hub, and then steps to actually deploy that image on the platform. But thanks to the Cloud Run button, you can add a button image on your README.md page for instance, and then users can click on it and get started with building and deploying to a GCP project automagically.

![](https://deploy.cloud.run/button.svg)

If the Git repository contains a Dockerfile, it will be built using the docker build command. Otherwise, the CNCF Buildpacks (with the pack build command) will be used to build the repository.

The Cloud Run button github project gives extra information on the parameterization of the deploy URL of the button, for example if you want to specify a particular branch or directory.

More information

-   [https://cloud.run](https://cloud.run/), the serverless container platform
-   Cloud Run button [github project](https://github.com/GoogleCloudPlatform/cloud-run-button)
-   Cloud Run button [announcement](https://cloud.google.com/blog/products/serverless/introducing-cloud-run-button-click-to-deploy-your-git-repos-to-google-cloud)
-   [CNFC Buildpacks](https://buildpacks.io/)