---
title: "Some custom VS Code settings"
date: 2023-03-08T22:34:43+01:00
tags:
- geek
- vscode
- ide
- tips

similar:
  - "posts/2012/08/09/also-back-to-vi-macvim-actually.md"
---

I regularly use both [IntelliJ IDEA](https://www.jetbrains.com/idea/) and [Visual Studio Code](https://code.visualstudio.com/) as my environments for developing.
But like all tools, we often need to personalise them to our liking, to feel at ease, or to be more productive.
As we read code more than we write, there are certain settings in your favorite editor to improve your reading experience. Today, I'll share of the tweaks I've made to my VS Code settings.

You can edit some of the settings by opening the UI of the settings dialog box, but you can also edit the `JSON` file in which those settings are saved. On a Mac, for example, the `settings.json` file is stored in `~/Library/Application Support/Code/User/`.

Here are my current custom settings, compared to the default configuration:

```json
{
    "security.workspace.trust.untrustedFiles": "open",
    "window.title": "${folderPath} ${separator} ${activeEditorShort}",
    "breadcrumbs.enabled": true,
    "workbench.colorCustomizations": {
        "[Default Dark+]": {
            "editor.lineHighlightBackground": "#404020FF",
            "editorLineNumber.activeForeground": "#ffff00",
        },
        "[Default Light+]": {
            "editor.lineHighlightBackground": "#FFEEEE",
            "editorLineNumber.activeForeground": "#ff0000",
        }
    },
    "workbench.tree.renderIndentGuides": "always",
    "workbench.tree.indent": 10,
    "editor.fontSize": 12,
    "editor.fontFamily": "Fira Code",
    "editor.fontLigatures": true,
    "editor.formatOnPaste": true,
    "editor.guides.bracketPairs": true,
    "files.trimTrailingWhitespace": true,
    "editor.mouseWheelZoom": true
}
```

Let's go through them:

* `security.workspace.trust.untrustedFiles` — allows to open a file not part of the project without warning
* `window.title` — for a custom window title, with the root of the project, and the name of the current opened file
* `breadcrumbs.enabled` — to display a breadcrumbe to see where I'm located in the file tree, and inside the file's structure itself
* `editor.lineHighlightBackground` and `editorLineNumber.activeForeground` — I've customised the colors of the current line the cursor is on, as well as the line number in the gutter, to make it stand out more on my dark background
* `workbench.tree.renderIndentGuides` and `workbench.tree.indent` — adds the little vertical bars in the file explorer, to visually see the current level or depth in the directory structure, and specifies how far apart they should be
* `editor.fontSize` — customize the default font size (but it may already be 12 by default)
* `editor.fontFamily` and `editor.fontLigatures` — I'm using Fire Code for my coding font, and I enable the ligatures to have nice looking operators
* `editor.formatOnPaste` — to automatically format the code that you pase, without having to manually reident it
* `editor.guides.bracketPairs` — for drawing a little vertical line that highlights the current scope of the block my cursor is in
* `files.trimTrailingWhitespace` — I like to trim the trailing whitespace at the end of a line automatically (to avoid some dummy commit because of a remaining space, for instance)
* `editor.mouseWheelZoom` — to allow mousewheel zoom in and out to increase / decrease font size

