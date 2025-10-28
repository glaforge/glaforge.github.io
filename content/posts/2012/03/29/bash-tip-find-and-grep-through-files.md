---
title: "bash tip: find and grep through files"
date: 2012-03-29T00:00:00.000+02:00
tags: [geek, tips, bash]
---

It happens once in a while that I want to find all files containing a certain string. I know command-line tools such as grep, cat, and find, but I never remember the right combination to achieve that task. So as to remember and reference it later, I write this small blog post to remind me how to do it:

```bash
find . -type f -exec grep YOURSTRING /dev/null {} \;
```

The `find .` part will search from the current directory (and all its subdirectories), `- type f` to search for files (not directories or links, etc), `-exec` to use the grep command to find through the files, with YOURSTRING as query string, /dev/null to throw away the errors you don't care about, and `{}` is the current file to search into with grep.

**Update:** a simple approach proposed in the comments is:

```bash
grep -r YOURSTRING \*
```