---
title: "Wiki-like Java HTML editor !"
date: "2003-10-23T01:00:00.000+02:00"
tags: [geek]
---

Well, sometimes, we happend to make some fun stuff at work. Don't we ? Currently, we're developping a RAD tool for creating applications using a framework we've been developping for some time already. It's a classical Swing app. We decided to create a contextual help system : Each time a component is selected in the GUI (whether it be a tabbed pane or a node in a JTree), we show the corresponding help page in another frame that the user may show or hide as he wishes when he needs some help. I use a JEditorPane with an HTMLEditorKit to show those HTML help pages.

Well, you'll tell me there's nothing fun there, of course. The interesting part comes from the fact that I developped a wiki-like system for creating the content of those help pages. At work, nobody like writing documentation unfortunately, but with this new tool, you just check the edit checkbox, and you can WYSIWYG-ly edit your HTML page : create headings, paragraphs, styles, lists, etc. You can insert images, and create links to other pages. When creating a link, you have the choice of linking to an existing page, or you can automagically create a new page ! Indeed, I created a wiki-like system for creating, editing and viewing HTML help pages in our app.

Another idea we've had is to allow the final users to be able to append some user-defined comments on the help pages of our app. I think it's a rather innovative idea to be able to edit yourself the help system.

If I have some time, maybe I'll turn that into a nice IntelliJ IDEA plugin, so that one may edit some simple HTML pages, for storing some developper documentation.

In a future post, I'll give you something to play with. So stay tuned !