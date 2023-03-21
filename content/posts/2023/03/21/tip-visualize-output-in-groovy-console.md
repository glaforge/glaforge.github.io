---
title: "Tip: Visualize output in the Groovy Console"
date: 2023-03-21T15:00:47+01:00
tags:
- groovy
- tips
- swing
---

For some scripting tasks, my favorite go-to tool is the **Groovy Console**,
and writing code with [Apache Groovy](https://groovy-lang.org/).
Usually, you just spill some `println` calls all over the place to display some textual information.
But there's a little known secret. Not really secret though,
as it's properly [documented](http://docs.groovy-lang.org/2.4.1/html/documentation/tools-groovyconsole.html#GroovyConsole-Visualizingscriptoutputresults).
It's possible to display images (like `BufferedImage` or its parent `java.awt.Image`)
or all sorts of rich components (from the `Swing` UI toolkit, like `JPanel`, `JLabel`, etc.)

For example, to display an image in the output pane of my Groovy Console, I can load it up via an `ImageIcon`:

```groovy
import javax.swing.*

def url = "https://pbs.twimg.com/profile_images/1590794600867893271/ttqX3njd_400x400.jpg".toURL()
new ImageIcon(url)
```

For that purpose, you'll have to ensure that the `View > Visualize Script Results` is enabled, as shown in the picture below:

![](/img/misc/groovy-console-visualize-output.png)

As mentioned in the [documentation](http://docs.groovy-lang.org/2.4.1/html/documentation/tools-groovyconsole.html#GroovyConsole-Visualizingscriptoutputresults), you could for example display maps or lists as nice Swing `JTable`.
Or for some data visualisation, you could also used any Java libraries that output images or that can be embeded in Swing components,
like the venerable JFreeChart library (ie. here's a StackOverflow question that shows that JFreeChart charts can be embedded in Swing components like `JPanel`).
