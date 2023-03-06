---
title: "Finding styled paragraphs in a Word document"
date: "2005-04-24T02:00:00.000+02:00"
tags: [groovy]
---

When working with Word documents, you'd often like to be able to extract relevant content automatically thanks to some scripts. That's exactly what I wanted to do this afternoon. I have a Word document which contains some scripts written with a specific style, and I wanted to extract those snippets, so that I may be able to check that they compile or that the unit tests they represent be asserted successfully.

As usual, you need to choose the right tool for the job. And for me, the right tool was my lovely [Scriptom](http://groovy.codehaus.org/COM+Scripting) module for [Groovy](http://groovy.codehaus.org/). Scriptom allows you to fill in the gap between Groovy scripts and your native ActiveX/COM components (on Windows obvioulsy).

I've found an [interesting article](http://msmvps.com/jonathangreensted/archive/2004/12/07/22717.aspx) explaining how one can do to find Word styles efficiently. The code was in C#, so the small burden was to convert C# code into Groovy, but that wasn't very complicated. I also put together all adjacent styled text so that I may build entire scripts (and not one line each time). And I was done!

The little program takes two arguments: the file name, and the style you wish to find in that document. You use simple and double quotes to surround the style name. I've regrouped together all contiguous styles together. And what else... well, the other comments are in the source code! So let's see what the code looks like!

```groovy
import org.codehaus.groovy.scriptom.ActiveXProxy

def style = ""
def fileName = ""

if (args.length != 2) {
    println "Usage: groovy extractStyle yourFile.doc yourStyle"
    System.exit(1)
} else {
    fileName = args[0]
    style = removeQuotes(args[1])
}

// creating the Word application
def word = new ActiveXProxy("Word.Application")
try {
    // opening your document
    word.Documents.Open(new File(fileName).canonicalPath)

    // getting the content of the document
    def doc = word.ActiveDocument
    def range = doc.Content
    // prepare the search of styled text
    range.Find.ClearFormatting()
    range.Find.Style = style

    def start, end = 0
    def text = ""
    def found = true
    // while there is styled text to find...
    while (found) {
        // execute the find command

        found = range.Find.Execute().value
        start = range.Start.value
        if (end != start && end != 0) {
            // seperate found occurencies with a separator
            println("=" * 72)
            println text
            text = ""
        }
        // get the text content of the styled text found
        // without the last newline
        text += removeNewLine(range.Text.value) + "\n"
        end = range.End.value
    }
} finally {
    // quitting the Word application
    // without saving the changes (wdDoNotSaveChanges = 0)
    word.Quit(0)
}

/** Remove potential simple or double quotes around the name of the style to find */
String removeQuotes(String s) {
    if (s.startsWith(/'/) && s.endsWith(/'/) || s.startsWith(/"/) && s.endsWith(/"/))
        return s.substring(1, s.length() - 1)
    else
        return s
}

/** Remove the last new line character which doesn't render well under DOS */
String removeNewLine(String s) {
    switch (s.length()) {
        case 0: return ""
        case 1: return ""
        default: return s.substring(0, s.length() - 1)
    }
}
```