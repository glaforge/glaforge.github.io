---
title: "On CloudFoundry micro-cloud"
date: 2011-08-31T00:00:00.000+02:00
tags: [groovy]
---

VMware released the announced [CloudFoundry micro-cloud](http://blog.cloudfoundry.com/post/9331377393/we-shrunk-the-cloud-introducing-micro-cloud-foundry).  
First, what is that micro-cloud about? From the announcement on the website:

> Micro Cloud Foundry is a complete version of Cloud Foundry that runs in a virtual machine on a developer’s Mac or PC. It is a full instance of Cloud Foundry that provides the flexibility of local development while preserving your options for future deployment and scaling of your applications.

I'm quite happy that this virtualized version of the real CloudFoundry is available, as this will greatly simplify the process for developing and testing your application locally.  

One of the big pains I've had with an environment like [Google App Engine](http://code.google.com/appengine/) when developing [Gaelyk](http://gaelyk.appspot.com) is that the local development environment is not really an image of the production server. So there are various differences between the two environments that lead you to wasting tons of precious hours figuring out why something works locally, but not in production, and vice versa, sometimes things work in production but not locally! I think an virtual image should reflect way more the original environment and smooth out most differences that could lie around.  

I haven't downloaded it yet, but I'm impatient to try micro-cloud soon!  

Make sure to read Peter Ledbrook's article on [Grails on micro-CloudFoundry](http://blog.springsource.com/2011/08/24/using-micro-cloud-foundry-from-grails/).