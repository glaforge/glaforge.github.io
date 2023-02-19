---
title: "Decoding a QR code by hand"
date: 2020-04-26T15:07:49+01:00
tags:
- qrcode
- geek
---

Doing sport at home on a treadmill or an elliptical bike is pretty boring, when you're confined, 
so to make things more interesting, I'm watching some videos to learn something new while exercising. 
This time, I found this old video about how to decode QR codes... by hand! 
Have you ever thought how these were encoded?

{{< youtube KA8hDldvfv0 >}}

This video comes from the [Robomatics](https://www.youtube.com/channel/UCnqifAqGaat6blFe8wlllOw) YouTube channel. 
You recognise easily QR codes thanks to the 3 big squares with the inner white line. 
I knew about the purple dotted lines that was fixed in those patterns. 
What I didn't know however was that there's a mask that is applied to the data, to avoid QR codes to potentially look all white or black. 
It was interesting to see also how the bytes were encoded: how they follow a path through out the matrix.

However, what this video doesn't cover, for example, is how error correction is working. 
You might have some holes or a bad picture of a QR code, but still being able to decode it with some level of loss of data. 
So I'll have to learn how that part works some day!