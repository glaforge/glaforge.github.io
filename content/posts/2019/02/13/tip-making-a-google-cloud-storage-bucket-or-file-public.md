---
title: "Tip: Making a Google Cloud Storage bucket or file public"
date: 2019-02-13T17:48:00+01:00
tags:
- google-cloud
- cloud-storage
- tips
---

[Google Cloud Storage](https://cloud.google.com/storage/) is the ideal product to store your object files (binary files, pictures, audio/video assets, and more).

Until recently, there was an option in the Google cloud console with a checkbox to quickly make a file or bucket public. However, and I would add "unfortunately", users tended to inadvertently clicking the checkbox, thus making potentail confidential assets public. So this risky, but easy, option, has been removed to avoid any unwanted data leak.

However, of course, it's still possible to [make buckets or files stored in Cloud Storage public](https://cloud.google.com/storage/docs/access-control/making-data-public). But you can't do it without paying attention! As I never quite remember how to do that (in spite of the linked documentation easily found with a quick Google search), I decided to highlight with a few screenshots how to achieve that!

I assume you already have or created a GCP project, and you also have a bucket full of assets that you want to make public, because you need to share them on the Web, for your mobile application, etc.

To illustrate this tip, let's have a look at the GCP cloud console:

![](/img/public-bucket/gcs-01-file-browser-small.png)

## Making a file public

First, we'll have a look at making a single file public.

You'll have to click the vertical triple dot icon on the right of the screen, and click on `Edit permissions`:

![](/img/public-bucket/gcs-02-permissions-drop-down-small.png)

Once you've clicked on this option, you'll be given the choice to add new permissions to members or groups of members:

![](/img/public-bucket/gcs-03-permissions-dialog-small.png)

In our case, we want to allow all the users to have read access on that particular file. So I'm giving the `Group` of `allUsers` the `Reader` access level. Then, once saved, in the file browser, you should see the following icon warning you the file is now public:

![](/img/public-bucket/gcs-04-public-warning-small.png)

## Making a bucket public

Instead of doing this for each individual file, you can also do the same at the bucket level, to give read access to the bucket and all its files in one go.

From the object browser, click on the `Permissions` tab. You will have to add the `allUsers` members the `Storage Object Viewer` role:

![](/img/public-bucket/gcs-05-bucket-permissions-small.png)

Click on the `Add members button`, type `allUsers`, select the `Storage > Storage Object Viewer` option, as follows, and click `add`:

![](/img/public-bucket/gcs-06-add-role-to-bucket-users-small.png)

Now if you head back to the file browser, you'll see all the files have the little warning icon telling you the resource is publicly accessible.

## For command-line gurus

I showed the visual approach from the cloud console... but there's a one-liner you can use, thanks to the [gsutil](https://cloud.google.com/storage/docs/gsutil) command.

For an individual file:

```bash
gsutil acl ch -u AllUsers:R gs://[BUCKET_NAME]/[OBJECT_NAME]
```

For a whole bucket:

```bash
gsutil iam ch allUsers:objectViewer gs://[BUCKET_NAME]
```

(Where you replace `[BUCKET_NAME]` with your project name, and `[OBJECT_NAME]` with the file name)

## More...

There's also a REST API that you can use to handle your buckets and file, as well as different client libraries in different languages that you can use as well.