---
title: "Machine intelligence at Google scale, vision / speech APIs, Tensorflow, and Cloud Machine Learning"
date: 2016-12-04T15:49:55+01:00
type: "talk"
layout: "talk"
tags:
- google-cloud
- machine-learning
- vision-recognition
- speech-recognition
- tensorflow
---

With my colleague [Martin Görner](https://twitter.com/martin_gorner), at the [Devoxx](http://cfp.devoxx.be/2016/talk/HFW-0944/Machine_Intelligence_at_Google_Scale:_Vision%2FSpeech_API,_TensorFlow_and_Cloud_Machine_Learning) conference in Belgium last month, we gave a talk on Machine Learning, on the various APIs provided by Google Cloud, the TensorFlow Machine Learning Open Source project, the Cloud ML service. I didn't get a chance to publish the slides, so it's time I fix that!

Machine Intelligence at Google Scale: Vision/Speech API, TensorFlow and Cloud Machine Learning

The biggest challenge of Deep Learning technology is the scalability. As long as using single GPU server, you have to wait for hours or days to get the result of your work. This doesn't scale for production service, so you need a Distributed Training on the cloud eventually. Google has been building infrastructure for training the large scale neural network on the cloud for years, and now started to share the technology with external developers. In this session, we will introduce new pre-trained ML services such as Cloud Vision API and Speech API that works without any training. Also, we will look how TensorFlow and Cloud Machine Learning will accelerate custom model training for 10x - 40x with Google's distributed training infrastructure.

The video is available on YouTube (in particular, don't miss the cool demos!):

{{< youtube zqWt8oI4gEw >}}

And you can look at the slides here:

{{< speakerdeck b0bf5d296e4941ca89fc78c2efb37561 >}}