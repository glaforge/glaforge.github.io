---
title: "Cloud Shell and its Orion-based text editor to develop in the cloud"
date: 2017-08-07T23:42:11+01:00
tags:
- cloud-shell
- google-cloud
- ide
---

After deploying in the cloud, there's a new trend towards programming in the cloud. Although I'm not sure we're quite there yet, there are a couple of handy tools I've been enjoying when working on the [Google Cloud Platform](https://cloud.google.com/).

I had been using the built-in [Cloud Shell](https://cloud.google.com/shell/) console, on the Google Cloud console, to have a terminal already pre-configured for my Google Cloud project. It allows you to easily have access to your whole environment, run commands, etc, just like you would from your own computer. The fact that all the command-line tools you can imagine (gradle, maven, gcloud sdk, etc) are already there is helpful, as well as the fact that you are already configured for using other cloud services.

To launch the shell, look no further than the top right hand corner, and click on the little [>_] button. It will launch the terminal in the bottom part of your cloud console.

![](/img/cloud-shell/cloud-shell-launch.png) 

You will see the console popping up below, and you'll be ready to access your project's environment:

![](/img/cloud-shell/cloud-shell-terminal.png)

But look at this little pen icon above? If you click it, you'll get your terminal in full screen in another window, but more interestingly, it will launch a proper file editor! It's an editor based on [Eclipse Orion's web editor](https://orionhub.org/). You have your usual file browsing pane, to navigate to and select which files you want to edit, and you also have things like syntax highlighting to better understand the code at hand.

![](/img/cloud-shell/cloud-shell-editor.png)

The more friendly those built-in web editors will become, the sooner we'll really be able to develop in the cloud. I believe I will still continue to work on my local computer a long, but there are already times when I prefer running some operations directly in the cloud: for example, tasks that are really network hungry, they benefit directly from the wonderful network that cloud shell has access to, which is much snappier than the connection I have at home on my DSL router. For example, running some Docker build command, or fetching tons of dependencies for Node or Maven/Gradle, and it's really much nicer and faster within Cloud Shell. So having the added capability of also editing some files in my project make things pretty snappy.

There was a recent article on the Google Cloud blog outlining the [beta launch of the Cloud Shell's code editor](https://cloudplatform.googleblog.com/2017/07/Cloud-Shells-code-editor-now-in-beta.html), which is why I wanted to play with this new built-in editor.