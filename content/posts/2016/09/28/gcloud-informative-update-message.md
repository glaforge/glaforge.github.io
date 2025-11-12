---
title: "GCloud informative update message"
date: 2016-09-28T17:30:28+01:00
tags:
- google-cloud
- gcloud

similar:
  - "posts/2016/10/17/viewing-my-groovy-source-files-in-stackdriver-debug-view.md"
  - "posts/2016/11/13/latest-features-of-google-cloud-platform.md"
---

I was playing with the [new IntelliJ IDEA plugin for Google App Engine](https://cloudplatform.googleblog.com/2016/08/never-leave-your-Java-IDE-with-Google-Cloud-Tools-for-IntelliJ-plugin.html) yesterday. The plugin depends on the [gcloud SDK](https://cloud.google.com/sdk/gcloud/) to do its work. And I started exploring gcloud a little bit more.

I was experiencing some odd bug which prevented me to run my application locally with the App Engine's local app server. It was a bug which was present in an old version of gcloud and its App Engine component, so I had to update the SDK and its App Engine Java component to fix it. No big deal, but what I wanted to highlight here was a little detail about that upgrade process.

I love when SDKs give me information about what needs updating and what's new in the new versions I'm using!

I've been using [SDKMan](http://sdkman.io/) for dealing with various SDK installations, like those for Groovy, Grails, Gradle, etc, and I've always liked when it was telling me which SDK updates were available, what was new in SDKMan. And I'm glad to see that gcloud behaves the same, and gives informative details about what's new. So let's see that in action.

First of all, while debugging my problem with a colleague, he asked me which versions of the SDK and the App Engine component I had. So I ran the following command:

```bash
$ gcloud version
Google Cloud SDK 119.0.0
alpha 2016.01.12
app-engine-java 1.9.38
app-engine-python 1.9.38
beta 2016.01.12
bq 2.0.24
bq-nix 2.0.24
core 2016.07.21
core-nix 2016.06.06
gcloud 
gsutil 4.19
gsutil-nix 4.19
```

At the time of this writing, the latest version of gcloud was actually 127.0.0, but I had 119.0.0. And for the app-engine-java component, I had version 1.9.38 although 1.9.42 was available. So it was time to update!

```bash
$ gcloud components update

Your current Cloud SDK version is: 119.0.0
You will be upgraded to version: 127.0.0
┌──────────────────────────────────────────────────────────┐
│            These components will be updated.             │
├─────────────────────────────────┬────────────┬───────────┤
│               Name              │  Version   │    Size   │
├─────────────────────────────────┼────────────┼───────────┤
│ BigQuery Command Line Tool      │     2.0.24 │   < 1 MiB │
│ Cloud SDK Core Libraries        │ 2016.09.20 │   4.9 MiB │
│ Cloud Storage Command Line Tool │       4.21 │   2.8 MiB │
│ gcloud app Java Extensions      │     1.9.42 │ 135.6 MiB │
│ gcloud app Python Extensions    │     1.9.40 │   7.2 MiB │
└─────────────────────────────────┴────────────┴───────────┘
The following release notes are new in this upgrade.
Please read carefully for information about new features, breaking changes,
and bugs fixed.  The latest full release notes can be viewed at:
  https://cloud.google.com/sdk/release_notes
127.0.0 (2016/09/21)
  Google BigQuery
      - New load/query option in BigQuery client to support schema update
        within a load/query job.
      - New query option in BigQuery client to specify query parameters in
        Standard SQL.
  Google Cloud Dataproc
      - gcloud dataproc clusters create flag
        --preemptible-worker-boot-disk-size can be used to specify future
        preemptible VM boot disk size.
  Google Container Engine
      - Update kubectl to version 1.3.7.
  Google Cloud ML
      - New gcloud beta ml predict command to do online prediction.
      - New gcloud beta ml jobs submit prediction command to submit batch
        prediction job.
  Google Cloud SQL
      - New arguments to beta sql instances create/patch commands for Cloud
        SQL Second Generation instances:
        ◆ --storage-size Sets storage size in GB.
        ◆ --maintenance-release-channel Sets production or preview channel
          for maintenance window.
        ◆ --maintenance-window-day Sets day of week for maintenance window.
        ◆ --maintenance-window-hour Sets hour of day for maintenance window.
        ◆ --maintenance-window-any (patch only) Clears maintenance window
          setting.
[...]

```

I snipped the output to just show the details of the changes for the latest version of gcloud, but it showed me the actual changelog up until the version I had... and as I hadn't updated in a while, there was lots of improvements and fixes! But it's really nice to see what had changed, and sometimes, you can discover some gems you weren't even aware of!

So if you're working on some kind of SDK, with auto-update capabilities, be sure to provide a built-in changelog facility to help your users know what's new and improved!