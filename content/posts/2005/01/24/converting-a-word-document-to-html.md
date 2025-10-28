---
title: "Converting a Word document to HTML"
date: 2005-01-24T00:00:00.000+01:00
tags: [groovy]
---

If you're under Windows, and that you need to do some shell scripting with ActiveX/COM components, Scriptom will certainly help you. Today, my boss just asked me if we could use [Scriptom](http://groovy.codehaus.org/COM%20Scripting) to convert a Word document into an HTML equivalent. And I decided to see if that was possible. To my delight, my little Scriptom module, backed by [Jacob](http://danadler.com/jacob/), helped me solve this integration problem with only 6 lines of Groovy code!

```groovy
import org.codehaus.groovy.scriptom.ActiveXProxy
import java.io.File

word = new ActiveXProxy("Word.Application")
word.Documents.Open(new File(args[0]).canonicalPath)
word.ActiveDocument.SaveAs(new File(args[1]).canonicalPath, 8)
word.Quit()
```

Now, I just need to launch:

```bash
groovy word2html.groovy specification.doc specification.html
```

And I've got a nice Word to HTML converter! Well... I know, not that nice. First of all, it's a Windows-only solution, but that fits my requirements regarding the platform I'm running on, but the other negative aspect is that the generated HTML is really, really ugly. I really wonder why Microsoft can't do a cleaner output. For the moment, I'm happy with that solution.

You probably noticed the magic number 8. It's the HTML format option. The available formats are:

*   0: `wdFormatDocument` (no conversion)
*   1: `wdFormatTemplate`
*   2: `wdFormatText`
*   3: `wdFormatTextLineBreaks`
*   4: `wdFormatDOSText`
*   5: `wdFormatDOSTextLineBreaks`
*   6: `wdFormatRTF`
*   7: `wdFormatUnicodeText`
*   8: `wdFormatHTML`

I haven't yet figured out how to be able to use constants directly in Groovy. I'll have to make Scriptom grok M$'s constants.

The example I've talked about has been tested with groovy-beta-9, Word 2000 and my additional Scriptom module for Groovy (don't forget to [install](http://groovy.codehaus.org/COM%20Scripting) it if you want to try that sample).