---
title: "Machine Learning and Scaling Web Apis"
date: 2017-05-10T11:43:01+01:00
type: "talk"
layout: "talk"
tags:
- apis
- openapi
- google-cloud
- cloud-endpoints
- machine-learning
---


The [JAX conference](https://jax.de/), in Mainz, Germany, is coming to an end. I was there with my colleagues [Mete](https://twitter.com/meteatamel) and [Robert](https://twitter.com/hostirosti), and had the chance to cover two topics: Machine Learning and Scaling Web APIs. It's a pleasure to come back to this conference where the audience is always very focused, eager to learn, and is engaging in great and interesting conversations.

## Machine Intelligence at Google Scale

My [first presentation](https://jax.de/session/machine-intelligence-at-google-scale-visionspeech-api-tensorflow-and-cloud-machine-learning/) was about Machine Learning, and in particular with the Google Cloud APIs, including [Vision](https://cloud.google.com/vision/), [Speech](https://cloud.google.com/speech/), [Natural Language](https://cloud.google.com/natural-language/), [Translate](https://cloud.google.com/translate/), and [Video Intelligence](https://cloud.google.com/video-intelligence/). Although I'm not an expert in [TensorFlow](https://www.tensorflow.org/) and the [Cloud Machine Learning Engine](https://cloud.google.com/ml-engine/), I got a chance to say a few words about these. I guess I'll have to play with both at some point to be able to tell even more!

> The biggest challenge of Deep Learning technology is the scalability. As long as using single GPU server, you have to wait for hours or days to get the result of your work. This doesn't scale for production service, so you need a Distributed Training on the cloud eventually. Google has been building infrastructure for training the large scale neural network on the cloud for years, and now started to share the technology with external developers. In this session, we will introduce new pre-trained ML services such as Cloud Vision API and Speech API that works without any training. Also, we will look how TensorFlow and Cloud Machine Learning will accelerate custom model training for 10x -- 40x with Google's distributed training infrastructure.

{{< speakerdeck b3fe3f4eb13547fc8e81785c54aceafd >}}

## Scale a Swagger-based Web API with Google Cloud Endpoints

My [second session](https://jax.de/session/scale-a-swagger-based-web-api/) was about scaling web APIs, defined using the [Open API specification](https://www.openapis.org/), thanks to [Kubernetes](https://kubernetes.io/) and [Google Container Engine](https://cloud.google.com/container-engine/), for the scaling part of the story, and managing those APIs thanks to [Google Cloud Endpoints](https://cloud.google.com/endpoints/).

> Web APIs are more often specified with API definition languages like Swagger (now named OpenAPI Spec), as it can help you generate nice interactive documentation, server skeletons, and client SDKs, mocks, and more, making it simpler to get started both producing and consuming an API. In this session, Guillaume will demonstrate how to define a Web API with Swagger/OpenAPI Spec, and scale it using Cloud Endpoints, on the Google Cloud Platform.

{{< speakerdeck 490a2aa1c3c142d0ac2c40ea60af2cf5 >}}
