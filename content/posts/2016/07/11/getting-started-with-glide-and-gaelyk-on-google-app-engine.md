---
title: "Getting started with Glide and Gaelyk on Google App Engine"
date: "2016-07-11T00:00:00.000+02:00"
tags: [gaelyk, google-cloud]
---

Back in 2009, I created [Gaelyk](http://gaelyk.appspot.com/), a lightweight toolkit for developing [Google App Engine](https://cloud.google.com/appengine)apps using the [Apache Groovy](http://groovy-lang.org/)programming language. I even had the chance to [speak at Google I/O 2009](https://www.youtube.com/watch?v%3DNEnniZTdOYk)about it! Good times, good times… [Vladimír Oraný](https://twitter.com/musketyr)later joined me in maintaining and evolving Gaelyk, and [Kunal Dabir](https://twitter.com/kdabir)created the fun [Glide](http://glide-gae.appspot.com/) project, which is a thin wrapper around Gaelyk to further streamline the development of small to mid-sized apps for Google App Engine.

Today, I want to share with you a quick start guide to develop a little app, that shows some tweets from selected accounts with the [Twitter API](https://dev.twitter.com/rest/public)(thanks to [Twitter4J](http://twitter4j.org/en/)), and using the [Material Design Light](https://getmdl.io/) template for the look’n feel (I used the “[dashboard](https://getmdl.io/templates/dashboard/index.html)” template). I won’t list all the exact steps, all the precise changes made to the templates, etc, but I want to give you the keys for having a productive experience with Glide and Gaelyk on App Engine. And here’s a screenshot of what we’ll be building:

![](/img/misc/tweet-glide.png)

Ready? Let’s start!

## Installing Glide

In the Groovy community, most developers these days are using [SDKMan](http://sdkman.io/) to install SDKs for Groovy, Gradle, Grails, and more. Glide also comes in the form of an SDK, with a command-line, and is available via SDKMan. So, first step, let’s install SDKMan from your shell (there’s also a Windows-friendly version):

```bash
$ curl -s "https://get.sdkman.io" | bash
```

It will automatically install the SDK manager. Then, either you just open up a new terminal, or you run the following command, to have access to SDKMan in your current session:

```bash
$ source "$HOME/.sdkman/bin/sdkman-init.sh"
```

To check the installation succeeded, you can run it with the sdk command, for example by printing the current version of SDKMan:

```bash
$ sdk version
```

Now that SDKMan is installed, it’s time to install Glide as well:

```bash
$ sdk install glide
```

You can then check that glide is indeed functioning correctly by executing:

```bash
$ glide
```

If you’re on Windows or if you’re not planning to keep SDKMan around, you can also [install Glide by other means](http://glide-gae.appspot.com/docs/installing), manually, as explained in the documentation.

## Creating the skeleton of our application

Okay, we’re ready to create our first Glide / Gaelyk application! (You can also check out the Glide [tutorial](http://glide-gae.appspot.com/docs/quick-start) as well)

```bash
$ glide --app tweetapp create 
$ cd tweetapp 
$ glide run
```

Head over to your browser at http://localhost:8080/, and you’ll see a brilliant “hello glide” message showing up. So far so good, the app is running locally, transparently thanks to the App Engine SDK, now let’s tweak this skeleton!

The project structure is pretty simple, in the directory, you’ll see a glide.groovy file at the root, and an “app” sub-folder containing index.groovy and `_routes.groovy`:

*   `glide.groovy` — the configuration file for your app
*   `index.groovy` — the default controller
*   `_routes.groovy` — listing the mappings between URLs and controllers, and more

## Configuring our application  

In `glide.groovy`, you’ll have the app name and version name defined:

```groovy
app { 
    name="my-tweet-demo" 
    version="1" 
}
```

You might have to change the application name, as we shall see later on, when we deploy the application.

To use the latest version of the App Engine SDK, you can append the following to explicitly ask for a specific version of the SDK:

```groovy
glide { 
    versions { 
        appengineVersion = "1.9.38" 
    } 
}
```

## Defining library dependencies

At the root of our project, we’ll actually add a new configuration file: glide.gradle. This file will allow us to define library dependencies. It’s basically a fragment of a [Gradle](https://gradle.org/)build configuration, where you can define those dependencies using the usual Gradle [syntax](https://docs.gradle.org/current/userguide/artifact_dependencies_tutorial.html). In our glide.gradle file, we’ll add the following dependency, for our Twitter integration:

```groovy
dependencies { 
    compile "org.twitter4j:twitter4j-appengine:4.0.4" 
}
```

## Using the Material Design Lite template

To make things pretty, we’ll be using the [Material Design Lite dashboard sample](https://getmdl.io/templates/index.html), but feel free to skip this part if you want to go straight to the coding part! Download the ZIP archive. It comes with an index.html file, as well as a style.css stylesheet. We’ll copy both files to the app/ folder, but we’ll rename index.html into index.gtpl (to make it a Groovy template file).

When you have a bigger project, with more assets, it’s obviously better to organize these views, stylesheets, JavaScript files, images, etc, in their own respective sub-folders. But for the purpose of my demo, I’ll keep everything in the same place.

You’ll see the template installed and visible if you go to this local URL:

[http://localhost:8080/index.gtpl](http://localhost:8080/index.gtpl)

I won’t detail all the changes to make to the template, and I’ll let you clean the template yourselves, but we can already remove everything that’s inside the inner div of the main tag: that’s where we’ll display our tweets!

## Let's make pretty URLs!

We’d like to have some nice URLs for our app. For that, we’ll now have a look at the \_routes.groovy file where you can define your URL mappings, to point at templates (\*.gtpl files) or at controllers (\*.groovy files, that can render some output directly or forward to templates for rich views). What shall we put in our routes definitions?

```groovy
get "/", redirect: "/u/glaforge"  
get "/u/@who", forward: "/index.groovy?u=@who", 
    validate: { request.who ==~ /[a-zA-Z0-9_]{1,15}/ },  
    cache: 1.minute  
get "/u/@who", forward: "/index.groovy?u=@who&error=invalid"
```

You can have a look at the Gaelyk documentation that defines the [routes definition syntax](http://gaelyk.appspot.com/tutorial/url-routing%23route-definition) for further explanations on what’s possible.

The root of the app, `/`, will redirect to /u/glaforge, to visualize my latest tweets. And all URLs like `/u/*` will forward to our index.groovy controller, that will fetch the tweets for that Twitter user, and forward them to the index.gtpl view for rendering the result.

```
/u/glaforge → /index.groovy?u=glaforge → /index.gtpl
```

The routing syntax is using the `@foo` notation to denote query path variables, that we can then reuse in the forwarding part.

The routing rules are evaluated in order, and the first one that matches the URL will be chosen. We have two get `/u/@who` routes, in the first case, we have a validation rule that checks that the @who path variable is a valid Twitter handle (using Groovy’s [regular expression matching](http://docs.groovy-lang.org/latest/html/documentation/index.html%23_regular_expression_operators) operator). If the validation fails, this route isn’t chosen, and the chain will continue, and it will fall back to the following route that forwards to the template with an error query parameter.

Also interesting to note is the use of caching, with:

```groovy
cache: 1.minute
```

The output of this URL will be put in App Engine’s Memcache so that for the next minute, all requests to the same URL will be fetched from the cache, rather than having to call again the controller and the Twitter API, thus saving on computation and on third-party API call quota.

For the purpose of development, you might want to comment that caching configuration, as you do want to see changes to that template or controller as you’re making changes.

## Time to code our tweet fetching controller

To user the Twitter API, you’ll have to register a new application on the [Twitter Apps page](https://apps.twitter.com/). Twitter will give you the right credentials that you’ll need to connect to the API. You’ll need the four following keys to configure the Twitter4J library:

*   the consumer API key
*   the secrete consumer API key
*   the access token
*   and the secret access token

Let’s configure Twitter4J with that information. I’ll implement the “happy path” and will skip part of the proper error handling (an exercise for the reader?), to keep the code short for this article.

```groovy
import twitter4j.* 
import twitter4j.conf.*   

def conf = new ConfigurationBuilder(
    debugEnabled: true, 
    OAuthAccessToken: "CHANGE_ME", 
    OAuthAccessTokenSecret: "CHANGE_ME", 
    OAuthConsumerKey: "CHANGE_ME", 
    OAuthConsumerSecret: "CHANGE_ME")
.build()   

def twitter = new TwitterFactory(conf).instance
```

The API is configured with your credentials. Be sure to replace all the `CHANGE_ME` bits, obviously!

Let’s lookup the Twitter handle coming through the query parameter, thanks to the user ‘u’ attribute on the params map:

```groovy
def accounts = twitter.lookupUsers(params.u)
```

There should only be two cases (that’s where there may be some more error handling to do!): 1) there’s no user found, or there’s only one. Let’s start with no user found:

```groovy
if (accounts.isEmpty()) { 
    request.errorMessage = "Account '${params.u}' doesn't exist." 
}
```

If no user account was found, we’ll put an error message in the request that’ll be forwarded to our view template.

In the else branch, we’ll handle the the normal case where the user was found:

```groovy
} else { 
    User userAccount = accounts[0] 
    def tweets = twitter.search(new Query("from:${params.u}"))
        .tweets.findAll { !it.isRetweet() }
```

We get the first account returned, and issue a search request for the latest tweets from that account. We filter out the retweets to keep only the user’s original tweets (but it’s up to you if you want to keep them).

In the request for the view, we’ll add details about the account:

```groovy
request.account = [ 
    name : userAccount.name, 
    handle: userAccount.screenName, 
    avatar: userAccount.biggerProfileImageURL  
]
```

And we’ll also add the list of tweets:

```groovy
request.tweets = tweets.collect { Status s -> [  
        id : s.id, 
        timestamp: s.createdAt.time,  
        content : s.text
    ]
}
```

And to finish our controller, we’ll forward to the view:

```groovy
forward 'index.gtpl'
```

Now that our controller is ready, we’ll have to surface the data into the view template.

## Modify the view template

Wherever the template displays the “Home” label, we’ll replace these with the Twitter handle. For that, we can use String interpolation in the template with the ${} notation. If there’s no error message, there should be an account, and we display that handle.

```groovy
${ request.errorMessage ? 'Home' : '@' +request.account.handle }
```

Let’s display the list of tweets, or the error message if there’s one. We’ll iterate over the tweets from the request attributes, and add the following in the inner div of the main tag (fore brevity sake, I'll remove the divs and css needed to make things pretty):

```groovy
<% 
if (request.tweets) { 
    request.tweets.each { tweet -> %> ${tweet.content} <% } 
} else { %> 
    ${request.errorMessage}  
<% 
} %>
```

And voila, our app is ready! Well, at least, it works locally on our app server, but it’s time to deploy it for real on App Engine!

## Deploying to Google App Engine

Let’s login in the [Google Cloud Platform console](https://console.cloud.google.com)to create our application project. If you don’t already have an account, you can benefit from the [free trial which offers $300 of credits](https://cloud.google.com/free-trial/) for the full platform.

![](/img/src/app-engine-project-creation.png)

Be sure to pay attention to the actual project ID that will have been created, it may be slightly different than the project name itself. This project ID is also called the app ID, and that’s the actually what you have to put in the glide.groovy file, in the app.name field (right, it’s a bit confusing, isn’t it?)

When the project is created, you’re able to use the glide command-line to deploy the application:

```bash
$ glide upload
```

If you see an error like below in the logs, it might mean that there’s a problem with your app ID, so be sure to double check it’s correct:

> 403 Forbidden You do not have permission to modify this app (app_id=u's~my-tweet-demo').

Another occurrence of this error message is when you are using different accounts with Google Cloud Platform. For instance, in my case, I have both a personal gmail account for my personal apps, and a google.com account for my work related apps. I had to zap `~/.appcfg_oauth2_tokens_java` to let the upload logic to use the correct account, and ask me to authentication with OAuth2.

Once the upload succeeded, you can access your app here:

[http://my-tweet-demo.appspot.com](http://my-tweet-demo.appspot.com)

Hooray, you’ve done it! :-)