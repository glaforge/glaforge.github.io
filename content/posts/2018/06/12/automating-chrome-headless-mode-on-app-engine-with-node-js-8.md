---
title: "Automating Chrome Headless mode on App Engine with Node.JS 8"
date: 2018-06-12T13:43:51+01:00
tags:
- google-cloud
- app-engine
- serverless
- nodejs
- chrome
---

On the [Google Cloud](http://cloud.google.com/) front today, the big news is the release of the [new Node.JS 8 runtime for Google App Engine Standard](https://cloudplatform.googleblog.com/2018/06/Now-you-can-deploy-your-Node-js-app-to-App-Engine-standard-environment.html). It's been a while since a completely new runtime was added to the list of supported platforms (Python, Java, PHP, Go). You could already run anything in custom containers on App Engine Flex, including your own containerized Node app, but now you can have all the nice developer experience on the Standard environment, with fast deployment times, and 0 to 1 to n instance automatic scaling (you can see the difference between those two environments [here](https://cloud.google.com/appengine/docs/nodejs/)).

To play with this new runtime, I decided to follow the steps in this guide about [using Chrome headless with Puppeteer](https://cloud.google.com/appengine/docs/standard/nodejs/using-headless-chrome-with-puppeteer).

As my readers know, I'm not really a Node person, and usually dabble more with [Apache Groovy](http://groovy-lang.org/) and Java, but this runtime was interesting to me as there's a nice integration with native packages. Let me explain.

The App Engine Node runtime [includes tons of native package out of the box](https://cloud.google.com/appengine/docs/standard/nodejs/reference/system-packages), without requiring you to install anything (except the Node modules that take advantage of those packages, of course.) For instance, if you need to do any audio / video manipulation, there's an ffmpeg package. If you want to deal with Git repositories, there's a git package. Need to manipulate images, there's ImageMagick, etc. And there are usually nice Node wrapper modules around those native components.

Among those system pre-installed packages, there's all the necessary ones to run [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome), ie. running the Chrome browser but without displaying its window basically.

Furthermore, there's the [Puppeteer](https://developers.google.com/web/tools/puppeteer/) Node module, which is a library to control Chrome. With those two, you can completely automate the usage of Chrome on the server-side.

What can you do with that? Well, you can:

-   look at / introspect / manipulate the DOM,
-   pre-render content for your single page apps,
-   take screenshots of web pages,
-   watch a particular page and compute diffs between different versions, etc.

## Let's get started!

Without blindly recopying all the steps explained in the tutorial for [running Chrome headless](https://cloud.google.com/appengine/docs/standard/nodejs/using-headless-chrome-with-puppeteer), I'll simply highlight some of key points. The goal is to let puppeteer take screenshots of webpages.

In your package.json, you need the reference the puppeteer module, and potentially express for handling your web requests:

```json
  "dependencies": {
    "express": "^4.16.3",
    "puppeteer": "^1.2.0"
  },
```

Taking advantage of Node 8's async capabilities, in your `app.js` file, you can instantiate puppeteer:

```javascript
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

Then navigate to the desired page:

```javascript
  const page = await browser.newPage();
  await page.goto(url);
```

Take a screenshot and render it back to the browser:

```javascript
  const imageBuffer = await page.screenshot();
  res.set('Content-Type', 'image/png');
  res.send(imageBuffer);
```

To deploy to the Node runtime, you also need the app.yaml deployment descriptor:

```yaml
runtime: nodejs8
instance_class: F4_1G
```

We specify that we want to use the new node runtime, but also that we want a slightly bigger instance to run our Node app, as Chrome is pretty hungry with RAM!

Then deploy your app with the [gcloud CLI](https://cloud.google.com/sdk/gcloud/).

Be sure to check the [whole code on Github](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/headless-chrome) for all the details.

One quick remark: although it's not mentioned in the tutorial, when you'll first try to deploy the application, it'll tell you that you need to enable the Container Builder API. The error message will be something like `Container Builder has not been used in project xyz before or it is disabled. Enable it by visiting...` You just need to follow the indicated URL to enable Container Builder. Container Builder is responsible for containerizing your application to be run on App Engine.

Then I was able to navigate to my app, pass it a URL, and get back the screenshot of the web page at that URL. It's pretty handy if you want to integrate thumbnails of websites you reference in your blog posts, for example, or if you want to see if there are differences between different versions of a web page (for integration testing purposes).

## Conclusion

The Java ecosystem has a wealth of libraries for various tasks, but often, there are native libraries which are more fully-featured, and Node generally provides nice wrappers for them. Chrome headless with Puppeteer is one example, but ImageMagick for image manipulation is another great one, where I could not find a good equivalent library in the Java ecosystem. So as they say, use the best tool for the job! In the age of microservices, feel free to use another tech stack that best fit the task at hand. And it's really exciting to see this [new Node 8 runtime for App Engine](https://cloudplatform.googleblog.com/2018/06/Now-you-can-deploy-your-Node-js-app-to-App-Engine-standard-environment.html) now being available so that you can take advantage of it in your projects.