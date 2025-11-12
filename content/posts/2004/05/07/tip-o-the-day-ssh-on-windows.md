---
title: "Tip O' the day : SSH on Windows"
date: 2004-05-07T00:00:00.000+02:00
tags: [geek, tips, ssh]

similar:
  - "posts/2004/01/13/cvs-and-ssh2-not-so-easy.md"
  - "posts/2004/04/30/intellij-ssh2-finally-finds-its-way.md"
---

My fellow readers might remember my problems with SSH which have often bothered me. I faced again a similar issue:

I wanted to upload a new Groovy snapshot Jar, before we release RC-1 next week. As a Groovy despot, with the help of some wonderful hausmates (particularly Trygve and Bob) I managed to authenticate myself with ssh-agent + ssh-add on the Codehaus server, so that maven doesn't require me to enter my passphrase for my key.

For the record, I'm using Cygwin on a windows XP box, with OpenSSH installed.

Here is the trick, in a cygwin-bash terminal type:

```
eval `ssh-agent`
ssh-add
maven -Dmaven.username=xxxx yourGoal
```

And I was done...