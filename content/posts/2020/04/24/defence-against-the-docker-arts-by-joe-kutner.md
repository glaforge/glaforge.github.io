---
title: "Defence against the Docker arts by Joe Kutner"
date: 2020-04-24T15:34:25+01:00
tags:
- docker
- containers

similar:
  - "posts/2022/10/24/build-deploy-java-17-apps-on-cloud-run-with-cloud-native-buildpacks-on-temurin.md"
---

Confined at home, because of the corona-virus pandemic, I'm also doing sport at home. I have a small treadmill for light walks (mostly during conf calls!) and also an elliptical bike. I'd much rather run outside though, but I have to use what I have, even if I hate that stationary elliptical bike in my basement. It's so boring! So to avoid feeling like wasting my time, I decided to watch videos during my sessions! Not necessarily series on Netflix. No! But interesting technical videos. So today, I'd like to share with you a series of posts on those interesting videos I'm watching while exercising.

Today, thanks to the wonderful [Joe Kutner](https://twitter.com/codefinger), from [Heroku](https://www.heroku.com/), I learned about the Defence Against the Docker Arts! It was recorded at Devoxx Belgium 2019.

{{< youtube ofH9_sE2qy0 >}}

Joe starts with clearly differentiating Docker and Dockerfiles. Docker is an ecosystem, while Dockerfiles describe docker container images. An important distinction. The first part of the video, shows best practices on how to writer proper Dockerfiles, and references an article on the Docker blog [post](https://www.docker.com/blog/intro-guide-to-dockerfile-best-practices/) from last year on that topic: 

-   use official base images, rather than reinventing the wheel, as they are usually more up-to-date and secure
-   remember that images are built in layers, so to speed up your builds, ensure that the base layers are the ones that change less, and keep your source file changes in the last layer as they change the most
-   join several RUN commands into one by binding them together with ampersands
-   be explicit about the version of base images you use
-   try to chose minimal flavors of base images, as they can be pretty big
-   build from source in a consistent environment, so that developers are on the same page, with the same version of their environment (build tool, runtime versions)
-   fetch dependencies in a separate step, so dependencies are cached in their own layer
-   use multi-staged build to remove build dependencies not needed at runtime

That's a lot of things to know! Joe then moves on to talk about higher-level approaches, starting with the [BuildKit](https://github.com/moby/buildkit) Go library. It's more for platform developers than developers, but it gives you lots of advanced controls on how to build docker images.

Joe introduces [Jib](https://github.com/GoogleContainerTools/jib) which is a build plugin (both for Maven and Gradle) that let developers focus on writing and building their apps, but letting that plugin create properly layered docker images for you, using minimal base images. You can even build without a local Docker daemon.

After BuildKit and Jib, Joe talks about the new Cloud Native [BuildPacks](https://buildpacks.io/), a tool that builds OCI images from source, cleverly. There are buildpacks for plenty of platforms and runtimes, not just Java. Those new cloud native buildpacks build upon years of experience from Heroku and CloudFoundry, on the first version of the buildpack concept. Joe says that buildpacks are reusable, fast, modular and safe, and goes on to show the power of this approach that allowed Heroku, for instance, to safely and rapidly upgrade Heartbleed affected images by replacing the underlying OS with a patched / upgraded version, thanks to image rebasing.