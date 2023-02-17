---
title: "Turning a Website Into a Desktop Application"
date: 2022-11-29T12:47:19+01:00
tags:
- web
- geek
- macos
---

Probably like most of you, my dear readers, I have too many browser windows open, 
with tons of tabs for each window. But there are always apps I come back to very often, 
like my email (professional & personal), my calendar, my chat app, or even social media 
sites like Mastodon or Twitter. You can switch from window to window with `CTRL/CMD-Tab`, 
but you also have to move between tabs potentially. But for the most common webapps or 
websites I’m using, I wanted to have a dedicated desktop application.


Initially, I was on the lookout for a Mac specific approach, as I’ve been a macOS users 
for many years. So I found some Mac-specific apps that can handle that. This website mentions 
[5 approaches for macOS](https://www.makeuseof.com/tag/website-desktop-mac-app/), including 
free, freemium, non-free apps, like Fluid, Applicationize (creating a Chrome extension), 
Web2Desk, or Unite. However, some of them create big hundred-mega wrappers. Another approach 
on Macs was using Automator, to create a pop-up window, but that’s just a pop-up, not a real app. 
There are also some promising open source projects like [Tauri](https://tauri.app/) 
and [Nativefier](https://github.com/nativefier/nativefier) which seem promising.

Fortunately, there’s a cool feature from Chrome, that should work across all OSses, 
and not just macOS. So if you’re on Linux or Windows, please read on. 
The websites you’ll turn into applications don’t even need to be PWAs (Progressive Web Apps).

Here’s how to proceed:

First, navigate to your website you want to transform into an application with your Chrome browser.

Click on the triple dots in the top right corner, then `More Tools`, and finally `Create Shorctut`:

![](/img/chrome-to-app/web2app-01-create-shortcut.png)

It will then let you customise the name of the application. 
It’ll reuse the favicon of the website as icon for the application. 
But be sure to check `Open as window` to create a standalone application:

![](/img/chrome-to-app/web2app-02-open-as-window.png)

Then you’ll be able to open the website as a standalone application:

![](/img/chrome-to-app/web2app-03-standalone-app.png)

I was curious if a similar feature existed with other browsers like Firefox. 
For the little fox, the only thing I could find was the ability to open Firefox in kiosk mode, 
in full-screen. But I wanted a window I could dimension however I wanted, not necessarily full-screen. 
I hope that Firefox will add that capability at some point. 
But for now, I’m happy to have this solution with Chrome!

