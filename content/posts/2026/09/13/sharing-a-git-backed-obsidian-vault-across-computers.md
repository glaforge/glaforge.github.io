---
title: "Sharing a Git-Backed Obsidian Vault Across Computers"
description: "How to avoid constant merge conflicts, line ending discrepancies, and sync friction when sharing an Obsidian vault across multiple computers using Git."
date: 2026-09-12T09:00:00+02:00
tags:
- obsidian
- git
- productivity
- tools
image: /img/obsidian/obsidian-git-sync-banner-with-title.jpg
---

I rely on [Obsidian](https://obsidian.md/) daily to capture ideas, interesting links & articles, and research clippings. 
Because I alternate between different machines (my work computer and my personal laptop) I need my vault synchronized everywhere.

Instead of third-party cloud folders or paying for cloud sync tiers, I back my vault with a private Git repository (hosted on GitHub) and use the community [obsidian-git](https://github.com/Vinzent03/obsidian-git) plugin. 

Git gives you full ownership, complete version history, granular diffs, and zero vendor lock-in. But if you simply `git init` your vault and call it a day, you will quickly run into some issues:

- Constant merge conflicts on internal UI layout files every time you open Obsidian on the other machine.
- Operating system noise (`.DS_Store`, `Thumbs.db`) polluting your commit log.
- Trashed notes accidentally getting resurrected by Git pulls.
- End-of-line (`CRLF` vs `LF`) discrepancies turning entire files into phantom diffs when switching between macOS/Linux and Windows.
- Diverging branches if you start typing before pulling new changes.

Here is the pragmatic, battle-tested setup I use to make cross-computer Git synchronization completely friction-free.


## 1. Avoid merge conflicts by configuring `.gitignore`

The primary source of headache with Git-backed vaults is `.obsidian/workspace.json` (and `workspace-mobile.json`). 

Obsidian writes to `workspace.json` constantly: active tab, cursor position, scroll offset, split panel dimensions, and freshly generated internal UUIDs. If you leave your laptop and sit down at your desktop, pulling latest changes will almost certainly trigger a merge conflict on that single file.

Beyond workspace layout, you also don't want local caches, graph visualization coordinates, or search/AI indexes checked into Git. 

Here is what your `.gitignore` should look like in the root of your vault:

```gitignore
# OS & IDE metadata
.DS_Store
._*
Thumbs.db
desktop.ini
.vscode/

# Obsidian internal trash
.trash/

# Obsidian local UI & workspace state
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/workspace*.json

# Obsidian cache, indexes & graph state
.obsidian/cache/
.obsidian/graph.json
.obsidian/copilot-index*.json
```

A few important details:
- **`.trash/`**: When you delete a note in Obsidian, it moves to `.trash/` by default. If Git tracks it, deleting a note on one machine will often cause it to linger or get revived when pulling on another.
- **`graph.json`**: Graph layout physics and node positions depend on your screen resolution. Keeping it local prevents resolution clashes between monitors.
- **Untrack existing files**: If you already committed `workspace.json` in the past, adding it to `.gitignore` is not enough. You must untrack it once:
  ```bash
  git rm --cached .obsidian/workspace.json .obsidian/graph.json
  git commit -m "chore: stop tracking local workspace and graph state"
  ```


## 2. Normalize line endings with `.gitattributes`

If you ever open your vault across different operating systems (e.g., macOS on a laptop, Windows or Linux on a desktop), Git's default line ending conversions can turn an entire note into a diff just because `LF` became `CRLF`.

To eliminate this, create a `.gitattributes` file at the root of your vault:

```gitattributes
# Normalize all text files to LF in the repository
* text=auto eol=lf

# Explicitly mark text formats
*.md text eol=lf
*.canvas text eol=lf
*.json text eol=lf
*.js text eol=lf
*.css text eol=lf

# Explicitly mark binary assets
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.webp binary
*.ico binary
*.pdf binary
*.zip binary
*.tar.gz binary
*.mp3 binary
*.mp4 binary
*.m4a binary
*.wav binary
```

This ensures every text file is stored with clean `LF` line endings on GitHub/GitLab, regardless of which OS checked it in.


## 3. Tune the obsidian Git plugin

The [obsidian-git](https://github.com/Vinzent03/obsidian-git) plugin handles Git operations directly inside Obsidian without requiring you to jump into a terminal. 

In the plugin settings, two configuration toggles make a big difference:

1. **Auto-pull on startup (`autoPullOnBoot: true`)**:
   As soon as you launch Obsidian on machine B, it pulls down any commits made from machine A before you start modifying notes.
2. **Pull before push (`pullBeforePush: true`)**:
   Ensures local commits integrate remote changes first, preventing rejected pushes.

### The backup workflow: Automatic vs. intentional

You have two choices for committing and pushing:
- **Timer-based auto-backup**: You can set `autoSaveInterval` and `autoPushInterval` (e.g., every 10 or 15 minutes), or enable backup on file change with a quiet pause.
- **Manual sync with a hotkey**: If you prefer clean, meaningful commits rather than a stream of automated checkpoints, assign a hotkey (such as `Cmd + Shift + S` or `Ctrl + Shift + S`) to **`Obsidian Git: Commit and sync`**. Hit it whenever you finish a working session before walking away from your computer.


## 4. What configuration to share (and what to keep private)

A major advantage of Git is keeping your Obsidian environment identical on every workstation:

- **What I track**: 
  - `.obsidian/community-plugins.json` (enabled plugins)
  - `.obsidian/core-plugins.json`
  - `.obsidian/app.json` and `appearance.json` (theme and editor preferences)
  - `.obsidian/plugins/*/` (plugin scripts and CSS)

  Tracking your installed plugins means you never have to re-install or re-configure a community plugin when setting up a new computer. Clone the repo, open Obsidian, and everything works out of the box.

- **What to keep private**: 
  - **API keys and tokens**: If you use community plugins that interact with AI models (Gemini, Claude, OpenAI) or external services, check where they store their credentials. Plugins that use the OS keychain (like `apiKeySecretName`) are safe. If a plugin writes a raw API key directly to its `.obsidian/plugins/<plugin-name>/data.json`, add that specific file to your `.gitignore` and configure the key locally on each computer.


## Wrap-up

Git and Obsidian can work great together: plain text markdown files backed by distributed version control. 

By ignoring volatile workspace state, enforcing consistent line endings with `.gitattributes`, and enabling auto-pull on launch, you eliminate 99% of synchronization friction. You get a seamless, private, multi-machine knowledge base with a full revision history and zero recurring costs.
