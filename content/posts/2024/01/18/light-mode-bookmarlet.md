---
title: Light Mode Bookmarlet
date: 2024-01-18T09:49:01+01:00
tags:
  - chrome
  - bookmark
  - light-mode
  - dark-mode
---
A while ago, my friend Sylvain Wallez shared a little [bookmarlet](https://twitter.com/bluxte/status/1729912211882094701 "bookmarlet")  
on Twitter/X that transforms a dark mode site into light mode.  
I know the trend is towards dark mode, but for a lot of people with certain vision issues,  
for example with astigmatism like me, certain dark modes can very painful.

This site about [vision](https://www.allaboutvision.com/digital-eye-strain/is-dark-mode-better-for-eyes/ "vision")  
(and you'll find other similar references) mentions that:

> People who have myopia or **astigmatism** also may experience **halation** (from the word “halo”).  
> Halation occurs when light spreads past a certain boundary, creating a foggy or blurry appearance.

So for certain websites, often with a too strong contrast, I'm using the following bookmarklet trick.

Go to your bookmark manager, and save the following bookmarklet (I called mine "light mode"):

```javascript
javascript:(function(){document.documentElement.style.filter=document.documentElement.style.filter?%27%27:%27invert(100%)%20hue-rotate(180deg)%27})();
```

Now, to pretty print the above code and remove the URL encoded characters, to decypher what it does:

```javascript
(function () {
  document.documentElement.style.filter = document.documentElement.style.filter
    ? ""
    : "invert(100%) hue-rotate(180deg)";
})();
```

Two filters are going to be applied to your current web page:

- First, it will completely **invert** all the colors, like a negative photography
- Second, compared to Sylvain, I also add a **hue rotation** of 180 degrees

## Why the hue rotation

Because the color inversion is also going to shift the colors: a red will become blue, a yellow will be dark blue, a violet will turn pink, etc.  
With a hue rotation, we get back the right color, a red is still red, a blue is still blue, etc.  
The different however will be in the lightness, as a light blue becomes dark, and a dark green becomes light.  
But at least, it's a bit more faithful to the original images.

Here's a picture to highlight the differences.  
See how the rainbow picture is transformed:

![](/img/misc/invert-hue-roate.jpg)

## Possible improvements

Perhaps we could avoid applying the filter globally, or at least avoid to apply it somehow to the images, so that they are not affected by those filters.  
At least for now, that's good enough for me!