---
title: "Auto-completion in a DOS console"
date: 2005-01-26T00:00:00.000+01:00
tags: [geek, groovy]

similar:
  - "posts/2005/01/24/converting-a-word-document-to-html.md"
  - "posts/2004/12/30/scripting-activex-com-components-with-groovy.md"
  - "posts/2005/04/24/finding-styled-paragraphs-in-a-word-document.md"
---

When I'm on an old PC, what frustrates me a lot is when I can't auto-complete file names or paths when I'm in a DOS Console. If your computer (an old Win2K box like I have at work) is not configured for completion, it's easy to re-enable it by modifying two keys in the registry:

*   `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Command Processor\CompletionChar`
*   `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Command Processor\PathCompletionChar`

To both keys, assign an hexadecimal value representing the key used for completing statements. I'm quite used to the tab key for that purpose, so I set the hexadecimal value to 0x09.  

Of course, I couldn't resist to use [Groovy](http://groovy.codehaus.org/) and [Scriptom](http://glaforge.free.fr/weblog/groovy.codehaus.org/COM+Scripting) (Windows ActiveX/COM bridge for Groovy I developed recently) to automate the process, here is how:

```groovy
import org.codehaus.groovy.scriptom.ActiveXProxy

wshell = new ActiveXProxy("WScript.Shell")
wshell.RegWrite("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Command Processor\\CompletionChar", 9, "REG_DWORD")
wshell.RegWrite("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Command Processor\\PathCompletionChar", 9, "REG_DWORD")
```