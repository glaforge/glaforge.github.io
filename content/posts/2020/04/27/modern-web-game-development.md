---
title: "Modern web game development"
date: 2020-04-27T15:04:09+01:00
tags:
- web
- gaming
- development
---

Next in my series of videos while doing sports at home, I watched this video from my colleague [Tom Greenaway](https://twitter.com/tcmg)! 
It's about modern web game development, and was recorded last year at Google I/O.

{{< youtube aVTYxHL45SA >}}

There are big gaming platforms, like Sony's PlayStation, Microsoft's XBox, Nintendo Switch, 
as well as plenty of mobile games on Android and iOS. 
But the Web itself, within your browser, is also a great platform for developing and publishing games! 
There's all that's needed for good games!

Tom explains that you need a functioning game (runs well on device, looks good, sounds good). 
And today, most of the game engines you can use for developing games actually provide an HTML5 target. 
You need users, and you need to have a good monetisation strategy. 
The web already provides all the right APIs for nice graphics, sound mixing, etc, and its a very open platform for spreading virally.

It was pretty interesting to hear about one of the key advantages of the web: it's URLs! 
You can be pretty creative with URLs. A game can create a URL for a given game session, 
for a particular state in a game, for inviting others to join.

In addition to game engines with a web target, Tom mentions also that it's possible to port games from C/C++ for example, 
to JavaScript in the browser, with a tool like [Emscripten](https://emscripten.org/). 
Even things like OpenGL 3D rendering can be translated into WebGL. 
But he also advises to look at WebAssembly, as it's really become the new approach to native performance in the browser. 
He mentioned [construct](https://www.construct.net/fr), it's basically the Box2D game engine, but optimised for WebAssembly.

For 3D graphics, for the web, the future lies in [WebGPU](https://gpuweb.github.io/gpuweb/), 
which is a more modern take on WebGL and OpenGL. For audio, 
there's the [Web Audio](https://www.w3.org/TR/webaudio/) APIs 
and worklets which allows you to even create effects in JavaScript or WebAssembly. 
But there are other useful APIs for game development, 
like the [Gamepad](https://www.w3.org/TR/gamepad/) API, the [Gyroscope](https://www.w3.org/TR/gyroscope/) API, etc.

For getting users, ensure that your game is fun of course, but also make it fast, in particular load fast, 
to avoid using users even before you actually got them to load the game! 
But you also need to think about this user acquisition loop: make the game load and start fast to enter the action right away, 
so you're really pulled in in the game, and that's then a good reason for users to share this new cool games with others. 
Of course, being featured on game sites & libraries helps, it gives a big boost, 
but it's not necessarily what will make you earn the most in the long run. 
Tom also shares various examples of games that were successful and worked well.