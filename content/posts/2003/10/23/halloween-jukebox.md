---
title: "Halloween Jukebox"
date: "2003-10-23T00:00:00.000+02:00"
tags: [geek]
---

It's soon Halloween ! If you're making a party at home, like my girl friend and me, you'll want to frighten your friends a little bit. Some make-up, some fancy closes, some pumpkins, etc... and some... hhoorrriibblleee soooouuunnnndddsss !

I found on the net some nice wave sounds like evil laugthers, screams, ghosts noises, etc. Stéphanie wanted to make a Windows Media Player playlist with those sounds. Cool... But as a Java Geek, I decided to make something better ! That's why I decided to write a little Halloween jukebox.

The aim of this jukebox is to play random sounds from selected sub-directories (representing a category) containing sounds, at defined interval of time.

You will find the jar here : [HalloweenJukebox.jar](http://glaforge.free.fr/projects/halloweenjukebox/HalloweenJukebox.jar), and you will also have to download a zip with a few sounds there [sounds.zip](http://glaforge.free.fr/projects/halloweenjukebox/sounds.zip).

**Instructions** : save the jar file on your computer, save the zip file as well and unpack it somewhere. Double-click on the jar file to launch the jukebox. Select the "sound" directory where you have unzipped sounds.zip.

**Explanations** : in the GUI, you'll see on the left a list of sub-directories checked, that's the sounds you've chosen to play. Below you'll recognize the play and stop button. And you will also be able to select the time interval between each sound. Thanks to javax.sound, all sounds will be mixed in real-time, overlapping each other if you've chosen a short interval, it'll make some terrific soundtrack for your party ;-)

Enjoy, and Happy Halloween !