---
title: "More voice control for Actions on Google"
date: 2017-11-16T16:40:32+01:00
tags:
- actions-on-google
- chatbot
---

Today, there were some interesting [announcements for Actions on Google](https://developers.googleblog.com/2017/11/help-users-find-interact-re-engage-with.html), for building your conversational interfaces for the [Google Assistant](https://assistant.google.com/). Among the great news, one item particularly caught my attention: the improved SSML support:

> **Better SSML**:
> We recently rolled out an update to the web simulator
> which includes a new SSML audio design experience.
> We now give you more options for creating natural,
> quality dialog using newly supported SSML tags, including \<prosody>,
> \<emphasis>, \<audio> and others. The new tag \<par> is coming soon
> and lets you add mood and richness, so you can play background music
> and ambient sounds while a user is having a conversation with your app.
> To help you get started, we've added over 1,000 sounds to the sound library.
> Listen to a brief SSML audio experiment that shows off some of the new features here.

SSML stands for [Speech Synthesis Markup Language](https://www.w3.org/TR/speech-synthesis/). It's a W3C standard whose goal is to provide better support for a more natural sounding speech generation.

So far, [Actions on Google](https://developers.google.com/actions/) had limited SSML support, but today, there's a bit more you can do with SSML to enhance your apps' voice!

At the Devoxx Belgium conference last week, in a couple of talks showing Dialogflow, 

Actions on Google, and Cloud Functions, I showed some quick examples of SSML.

For example, I [made an attendee do some squats on stage](https://youtu.be/7NjRqMYH11s?t=40m41s)! (but the camera didn't catch that unfortunately.) I created a loop over a tick-tock sound to mimick a countdown. I repeated x times the tick-tock sound. With x audio elements. But we can do better now, by using the repeatCount attribute instead!

```xml
<audio src="gs://my-bucket-sounds/tick-tock-1s.wav" repeatCount="10" />
```

It's much better than repeating my audio tag 10 times!

If you want to make your interactions even more lively, you could already use the Actions on Google [sound library](https://developers.google.com/actions/tools/sound-library/), or use a free sound library like [Freesound](https://www.freesound.org/).

But there's a promising upcoming tag that's gonna be supported soon: \<par/>

If you will, par is a bit like a multi-track audio mixer. You'll be able to play different sounds in parallel, or make the voice speak in parallel. So you could very well have a background sound or music, with your app speaking at the same time.

Speaking of voice, the human voice goes up and down in pitch. With the prosody element, you can define the rate, pitch, and volume attributes. For instance, I make my voice sing some notes with semitones (but to be honest, it doesn't quite sound yet like a real singer!)

```xml
<speak>
  <prosody rate="slow" pitch="-7st">C</prosody>
  <prosody rate="slow" pitch="-5st">D</prosody>
  <prosody rate="slow" pitch="-3st">E</prosody>
  <prosody rate="slow" pitch="-2st">F</prosody>
  <prosody rate="slow" pitch="0st">G</prosody>
  <prosody rate="slow" pitch="+2st">A</prosody>
  <prosody rate="slow" pitch="+4st">B</prosody>
  <prosody rate="slow" pitch="+6st">C</prosody>
</speak>
```

You can also play with different levels of emphasis:

```xml
<speak>
  This is 
  <emphasis level="strong">really</emphasis>
  cool!
</speak>
```

Learn more about all the [support SSML tags in the Actions on Google documentation](https://developers.google.com/actions/reference/ssml)! It's gonna be even more fun to create lively voice interactions with all those improvements!