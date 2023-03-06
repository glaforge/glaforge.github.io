---
title: "Four years to fix a trivial bug..."
date: "2005-11-26T00:00:00.000+01:00"
tags: [geek]
---

My friend Christopher just told me a [very old bug in the JDK](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058) has eventually been fixed in Mustang!

**UTF-8 encoding does not recognize initial BOM**

> Java does not recognize the optional BOM which can begin a UTF-8 stream. It treats the BOM as if it were the initial character of the stream.A Utf-8 stream can optionally beign with a byte order mark (see, for example [http://www.unicode.org.unicode/faq/utf\_bom.html](http://www.unicode.org.unicode/faq/utf_bom.html)). This is the character FEFF, which is represented as EF BB BF in utf-8. Java's utf-8 encoding does not recognize this character as a BOM, though; the result of reading such a stream is a set of characters beginning with FEFF.

I'm glad it's now fixed! I've been working around this bug for a long time already. I've even applied some patches to work around this issue to [Groovy](http://groovy.codehaus.org/) as well as in [IntelliJ IDEA](http://www.jetbrains.com/idea) -- thanks to Maxim who introduced my suggested fix inside this wonderful IDE.