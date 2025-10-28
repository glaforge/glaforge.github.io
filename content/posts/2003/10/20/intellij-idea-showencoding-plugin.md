---
title: "IntelliJ IDEA : ShowEncoding plugin"
date: 2003-10-20T00:00:00.000+02:00
tags: [geek, java, ide]
---

A bit more than a year ago, I wrote some utility classes related to file encodings/charsets. Those classes got integrated to IntelliJ IDEA. Those classes are useful for knowing the encoding of a byte array, or a file, or an input stream. You'll be able to know whether your file is encoded using UTF-8, or whether it used ISO-8859-1, or windows' specific windows-1252.

Unfortunately, inside IntelliJ IDEA, it is not currently possible to know the charset of the files edited. I filed a feature request in june. Unfortunately, this feature has not yet been implemented.

That's why I decided to write my own plugin for discovering the charset used in my files.

For download and more information, you can browse these links :

*   [Project page on the Wiki](http://www.intellij.org/twiki/bin/view/Main/ShowEncodingPlugin)