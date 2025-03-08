---
title: "Quick Tip: Clearing disk space in Cloud Shell"
date: 2025-03-08T16:29:41+01:00
tags:
- google-cloud
- cloud-shell
- linux
- tips
---

Right in the middle of a [workshop](https://glaforge.dev/posts/2024/03/27/gemini-codelab-for-java-developers/) I was delivering, as I was launching Google Cloud console's [Cloud Shell](https://cloud.google.com/shell/docs) environment, I received the dreaded warning message: `no space left on device`.

And indeed, I didn't have much space left, and Cloud Shell was reminding me it was high time I clean up the mess! Fortunately, the shell gives a nice hint, with a pointer to this [documentation page](https://cloud.google.com/shell/docs/quotas-limits#clearing_disk_space) with advice on how to reclaim space.

The document suggests to run the following command:
```bash
du -hs $(ls -A)
```

This command shows the space each file uses within each sub-directory.

Here's the output I got after having cleaned up the many caches, directories and projects I didn't need anymore:

```
20K     .bash_history
4.0K    .bash_logout
4.0K    .bashrc
20M     .cache
320M    .codeoss
112K    .config
8.0K    .docker
247M    gemini-workshop-for-java-developers
4.0K    .gitconfig
341M    .gradle
12K     .gsutil
4.0K    .lesshst
16K     .npm
4.0K    .profile
0       .python_history
4.0K    README-cloudshell.txt
8.0K    .redhat
4.0K    .ssh
0       .sudo_as_admin_successful
8.0K    .vscode
```

You quickly see directories (like `.codeoss` or my `gemini-workshop-for-java-developers`) that fill up the most space, and you can go after each of those repositories and launch some `rm -Rf some-directory` commands here and there. Of course, pay attention to what you're going to delete, as this is irreversible!




