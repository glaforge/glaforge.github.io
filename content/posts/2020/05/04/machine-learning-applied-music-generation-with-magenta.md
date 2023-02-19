---
title: "Machine learning applied music generation with Magenta"
date: 2020-05-04T14:54:06+01:00
tags:
- geek
- music
- machine-learning
---

I missed this talk from Alexandre Dubreuil, when attending Devoxx Belgium 2019, but I had the chance to watch while doing my elliptical bike run, confined at home. It's about applying Machine Learning to music generation, thanks to the [Magenta project](https://magenta.tensorflow.org/), which is based on [Tensorflow](https://www.tensorflow.org/).

{{< youtube O4uBa0KMeNY >}}

I like playing music (a bit of piano & guitar) once in a while, so as a geek, I've also always been interested in computer generated music. And it's hard to generate music that actually sounds pleasant to the ear! Alexandre explains that it's hard to encode the rules a computer could follow to play music, but that machine learning is pretty interesting, as it's able to learn complex functions, thus understanding what does sound good.

He, then, covers the various types of music representations, like MIDI scores which are quite light in terms of data, and audio waves which on the high end of data as there are thousands of data points representing the position on the wave along the time axis. While MIDI represents a note of music, audio waves really represent the sound physically as a wave (of data points).

Note that in the following part of the article, I'm not an ML / AI expert, so I'm just trying to explain what I actually understood :-)

For MIDI, Recurrent Neural Networks (RNN) make sense, as they work on sequences for the input and output, and also have the ability to remember past information. And that's great as you find recurring patterns in music (series of chords, main song lines, etc.)

RNN tend to forget progressively those past events, so those networks often use Long-Short-Term-Memory to keep some of their memory fresh.

Variational Auto-Encoders are a pair of networks that diminish the dimensions of outputs compared to the quantity in input, but to then re-expand back to the same size of output. So VAEs try to actually generate back something that's close to what was initially given in input, but it events to reproduce similar patterns.

For audio waves, Magenta comes with a Convolutional Neural Network (CNN) called WaveNet, that's used for example for voice generation on devices like Google Home. There are WaveNet Auto-Encoders that also generate audio waves, because it can learn to generate the actual sound of instruments, or create totally new instruments, or mixes of sounds. Alexandre shows some cool demos of weird instruments made of cat sounds and musical instruments.

Magenta comes with various RNNs for drums, melody, polyphony, performance. With auto-encoders for WaveNet and MIDI too. There's also a Generative Adversarial Network (GAN) for audio waves. GANs are often used for generating things like pictures, for example.

The demos in this presentation are quite cool, with creating new instruments (cat + musical instrument), or for generating sequences of notes (drum score, melody score)

Alexandre ends the presentation with pointers to things like data sets of music, as neural networks further need to learn about style, performance, and networks need plenty of time to learn from existing music and instrument sounds, so as to create something nice to hear! He shows briefly some other cool demos using [TensorFlow.js](https://www.tensorflow.org/js), so that it works in the browser and that you can more easily experiment with music generation.

Also, Alexandre wrote the book "[Hands-On Music Generation with Magenta](https://www.packtpub.com/eu/data/hands-on-music-generation-with-magenta)", so if you want to dive deeper, there's much to read and experiment with!

