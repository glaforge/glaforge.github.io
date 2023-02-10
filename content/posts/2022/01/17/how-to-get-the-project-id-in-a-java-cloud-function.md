---
title: "How to get the project ID in a Java Cloud Function"
date: 2022-01-17T22:20:29+01:00
tags:
- google-cloud
- cloud-functions
- java
---

As I was working with my colleague [Sara Ford](https://cloud.google.com/developers/advocates/sara-ford) 
on testing the Cloud Functions runtimes for the upcoming "second generation" of the product, 
rebased on the [Cloud Run](https://cloud.run/) platform, I wrote a few simple functions for the Java runtime. 
In one of those Java functions, I wanted to use Google Cloud Storage, to download a file from a bucket. 
I took a look at the existing 
[sample](https://github.com/googleapis/google-cloud-java/blob/main/google-cloud-examples/src/main/java/com/google/cloud/examples/storage/objects/DownloadObject.java) 
to download an object:

```java
Storage storage = StorageOptions.newBuilder()
    .setProjectId(projectId)
    .build()
    .getService();

Blob blob = storage.get(BlobId.of(bucketName, objectName));
blob.downloadTo(Paths.get(destFilePath));
```

I know the name of the bucket, the name of the file, I'm going to store the file in the local file system. 
So I have all the information needed... except the project ID within which I deployed my Java cloud function. 
So how do I get the project ID, in Java, inside the Cloud Functions environment?

A previous iteration of Cloud Functions had various useful environment variables available, which included the project ID. 
So you could retrieve the ID with a `System.getenv()` call. 
However, for various compatibility reasons between the various runtimes, 
with the [Knative](https://knative.dev/docs/) open source project, that variable disappeared along the road.

However, I know that the project ID is also part of the internal 
[compute metadata](https://cloud.google.com/appengine/docs/standard/java/accessing-instance-metadata) 
that is accessible via a special URL:

<http://metadata.google.internal/computeMetadata/v1/project/project-id>

With that knowledge in mind, I thought I could simply make a quick HTTP request to get that information:

```java
private String getProjectId() {
  String projectId = null;
  HttpURLConnection conn = null;
  try {
      URL url = new URL("http://metadata.google.internal/computeMetadata/v1/project/project-id");
      conn = (HttpURLConnection)(url.openConnection());
      conn.setRequestProperty("Metadata-Flavor", "Google");
      projectId = new String(conn.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
      conn.disconnect();
  } catch (Throwable t) {}
  return projectId;
}
```

For the call to work, it is mandatory to set the `Metadata-Flavor` header that you see above. 
I used Java's built-in `HttpURLConnection` for the job. 
There are other HTTP libraries that could've made the code simpler, but at first, 
I didn't want to bring another HTTP client, just for retrieving a simple project meta-information.

I'm one of the developers who designed the 
[Functions Framework for Java](https://github.com/GoogleCloudPlatform/functions-framework-java) 
that is used to craft cloud functions in Java, however, I've written quite a few functions using Node.js as well. 
And in the Node ecosystem, there's actually an NPM module whose responsibility is to retrieve such project metadata. 
With the [gcp-metadata](https://www.npmjs.com/package/gcp-metadata) module, you can require it and then fetch the project ID with:

```javascript
const gcpMetadata = require('gcp-metadata');
const projectId = await gcpMetadata.project('project-id');
```

I was surprised I couldn't easily find an equivalent library in Java. 
It took me a while to find it, but it actually exists too! 
That's the [com.google.cloud:google-cloud-core](https://googleapis.dev/java/google-cloud-core/latest/index.html) library! 
And it's trivial to use:

```java
import com.google.cloud.ServiceOptions;

String projectId = ServiceOptions.getDefaultProjectId();
```

An extra dependency in my pom.xml, one import and one static method call on `ServiceOptions`, 
and I can get the GCP project ID! So I'm now able to pass the project ID to my `StorageOptions` builder.
But for some reason, I recalled that at times, in some other projects I had written, 
I remembered not really needing that project ID information, as the libraries 
I was using were smart enough to infer such information from the environment. 
Let's look again at the `StorageOptions` from the beginning. 
What if I simply omit the `setProjectId()` method call? 
Lo and behold... indeed, it was actually not required, and the project ID was inferred, transparently. 
So I didn't really need to search for how to retrieve this project ID at all! 
And actually, you can further simplify the creation of the StorageOptions down to:

```java
Storage storage = StorageOptions
    .getDefaultInstance()
    .getService();
```

At least, now, I know how to retrieve the project ID in Java, 
in case the libraries or the environment are not providing such details on their own!

