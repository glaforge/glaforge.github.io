---
title: "Just a handy command-line tool"
date: 2023-06-07T15:48:02+02:00
tags:
- tools
- cli
- build
---

When developing new projects on my laptop, I often run some commands over and over again.
Regardless of how far you've gone with your CI/CD pipelines, running commands locally without resorting to becoming a bash ninja can be pretty easy with... `just`!

> [`just`](https://just.systems/) is a handy way to save and run project-specific commands

It's a command-line tool that lets you define some commands to run (called recipes), in the form of a Makefile-inspired syntax.
It even allows you to define dependencies between the various tasks of your `justfile`.
It runs across all environments (Mac, Linux, Windows), and is quick to install.
It loads `.env` files in which you can define variables specific to your project (other developers can have the same `justfile` but have variables specific for their projects)

Without further ado, let's see it in action in my current project.

In my project, I have the following `justfile`:

```make
set dotenv-load

alias r := run
alias b := build
alias d := deploy

default: run

run:
    ./gradlew -t run

build:
    gcloud builds submit -t $CLOUD_REGION-docker.pkg.dev/$PROJECT_ID/containers/$CONTAINER_NAME:v1

deploy: build
     gcloud run deploy bedtimestories --image=$CLOUD_REGION-docker.pkg.dev/$PROJECT_ID/containers/$CONTAINER_NAME:v1
```

* The first instruction tells `just` to load an `.env` file.
* The (optional) alias lines allow me to define shorcuts for commands that I run very often
* There are three commands: `run`, `build`, and `deploy`:
    * `run` will run my application locally with `gradle`
    * `build` will containerize my app with my `Dockerfile` on Google Cloud Build
    * `deploy` depends on `build` and will deploy my container on Google Cloud Run

And now, I _just_ run: `just run`, `just deploy`, or their shortcuts: `just r` or `just d`.

You also noticed the dollar variables which are interpolated from my `.env` file which contains the following variables:

```bash
PROJECT_ID=some-project-id
CLOUD_REGION=us-central1
CONTAINER_NAME=some-container-name
```

It's `just` a new little handy tool in my toolbox!

Go check it out: [just.systems](https://just.systems/).
And have a look at the [cheat sheet](https://cheatography.com/linux-china/cheat-sheets/justfile/) for more examples and syntax.