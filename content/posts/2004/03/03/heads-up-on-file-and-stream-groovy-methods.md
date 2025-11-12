---
title: "Heads-up on File and Stream groovy methods"
date: 2004-03-03T00:00:00.000+01:00
tags: [groovy]

similar:
  - "posts/2004/02/05/groovy-jdk-doc-parsing-java-with-qdox.md"
  - "posts/2004/04/23/a-groovy-web-server.md"
  - "posts/2009/02/27/whats-new-in-groovy-16.md"
---

Over the week-end, I implemented new groovy methods, as defined in GROOVY-208 Plus a few complementary methods.  

*   `getText()`:
    *   `BufferedReader.getText()`
    *   `File.getText()`
    *   `File.getText(encoding)`
    *   `Process.getText()`

You can now easily read the full content of a file or of a buffered reader and get it as a String.

```groovy
// retrieve the content of the file  
def content = new File("myFile.txt").text  
// you can specify the encoding of the file  
// note that since getText() has a parameter,   
// you cannot call it with something like text("UTF-8")   
content = new File("myFile.txt").getText("UTF-8") 
```

There is also a getText() method on Process which gathers the output of a process:

```groovy
stringOutput = "ls".execute().text // Unices  
stringOutput = "dir".execute().text // Windows
```

*   `write()`:
    *   `File.write(text)`
    *   `File.write(text, encoding)`

As we've defined read methods for reading the content of the file in one go, you can also write it in a single step as well. Note that write overwrite the previous content of the file. If you don't want the behaviour, use the append() method.

// write the text in the file  
new File("myFile.txt").write("Hello world")  
// you may also specify the encoding  
new File("myFile.txt").write("\\u20AC: is the symbol for the Euro currency", "UTF-16LE")

*   `append()`:
    *   `File.append(text)`
    *   `File.append(text, encoding)`

In the same spirit, I decided to add some append() methods to append text at the end of the File.

```groovy
def f = new File("myFile.txt").append("Hello World\\n")  
f.append("Hello again, that's me!")  
```

You can also specify the encoding. Of course, don't write in the same file with different encodings, no editors would be able to read it ;-)  

```groovy
def f = new File("myFile.txt").append("Hello World\\n", "UTF-16BE")  
f.append("Hello again, that's me!", "UTF-16BE")
```

*   `newWrite()`:
    *   `File.newWriter(encoding)`
    *   `File.newWriter(encoding, append)`
    *   `File.newWriter(append)`
    *   `File.newPrintWriter(encoding)`

Missing newWriter() methods have been added. It's now possible to specify the encoding used to write files, and optionnaly to specify wether we're in append mode.

```groovy
def writer = new File("myText.txt").newWriter("UTF-8", true)  
writer.write("\u20AC: euro symbol\n")  
writer.write('$: dollar symbol\n')  
writer.close()
```

*   `File.newReader(encoding)`

Previously, when creating a new Reader from a file, the encoding was automatically guessed, thanks to CharsetReaderToolkit I had implemented which smartly guessed the charset used to encode the file. Now, it is possible to overide this mechanism:

```groovy
def reader = new File("myText.txt").newReader("UTF-8")
```

*   `withWriter()`:
    *   `File.withWriter(encoding, closure)`
    *   `File.withWriterAppend(encoding, closure)`
    *   `OutputStream.withWriter(encoding, closure)`

I extended the withWriter methods, so that we may specify an encoding, and also specify the append more:

```groovy
// no need of course to close the writer,   
// since it's gracefully taken care of by the method  
newFile("myText.txt").withWriterAppend("UTF-8") { writer ->
    writer.write("\u20AC: euro symbol\n")  
    writer.write('$: dollar symbol\n')  
}  
```

*  `BufferedWriter.writeLine(text)`

In the example above, you may also use the new writeLine() method on BufferedReader, which is cleaner than appened "\\n" after each call to write(), so the example becomes:

```groovy
newFile("myText.txt").withWriterAppend("UTF-8") { writer -> 
    writer.writeLine('\u20AC: euro symbol') // cleaner than "\n" obviously  
    writer.writeLine('$: dollar symbol')  
}
```

Note that it appends a platform dependant new line.  

*   `File.readBytes()`

I've finally changed the readBytes() method to return an array of bytes instead of a List of Bytes which was quite ineficient:

```groovy
def bytes = new File("myText.txt").readBytes()
```

With all these methods, I thing we pretty can do anything we want! We should certainly cover all the scope of IO methods, especially of text files with optional specification of the encoding used.