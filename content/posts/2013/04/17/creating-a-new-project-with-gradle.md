---
title: "Creating a new project with Gradle"
date: "2013-04-17T00:00:00.000+02:00"
tags: [groovy]
---

Since I started using [Gradle](http://www.gradle.org/) for building my projects, as soon as I needed to create a brand new project from scratch, I wished that Gradle guided my hand and created the right directory structure and minimal Gradle build script.  

A bit less than two years ago, I was inspired by Dierk's [gist](https://gist.github.com/Dierk/1271516) providing a basic build that provided two tasks, one for creating the directory layout, and the other one to create the Gradle wrapper. I turned that gist into a [blog post of my own]({{< ref "/posts/2011/11/25/handy-gradle-startup-script" >}}), with just minor version updates, as I wanted to remember how to do that the next time I'd create a new Gradle-based project.  

But we were not the only ones missing this capability in Gradle!  

More recently, [Marcin leveraged the init script capabilities of Gradle](http://blog.proxerd.pl/article/my-gradle-init-script) to make the process a bit smoother, so that we don't have to blindly and stupidly copy and paste the same sample build script each time. With his approach, we add the project layout and wrapper creation in the ~/.gradle/init.gradle script, so that it's available in your new projects by default.  

Last but not least, just the other day, Erik came up with a [similar approach](http://www.jworks.nl/2013/04/16/creating-projects-with-gradle/) as the original gist for creating projects, with some more flags to customize which directories we want created.  

As it seems we're all reinventing the wheel, I wondered on twitter [how come this basic functionality wasn't already included in Gradle](https://twitter.com/glaforge/status/324484467911704576)! And in matter of minutes, I got some additional pointers about other archetypes and template solutions, like the [dt\_java](https://github.com/svene/dt_java) project which provides templates for Gradle-based projects amon other things, the [Gradle templates plugin](https://github.com/townsfolk/gradle-templates).  

But the good news is that this often needed feature is actually getting some attention from our Gradle(ware) friends, and we're going to see some form of project creation in Gradle 1.6 soon, as shown in this [design document](https://github.com/gradle/gradle/blob/master/design-docs/build-initialisation.md).  
Ultimately, creating a template project and a Gradle wrapper will likely be as simple as:

```bash
gradle setupBuild --type groovy-library  
gradle wrapper
```

And then, no more hacks needed, you'll have a nice and ready-to-build project in matter of mere seconds, without resorting to our various tactics listed above!  
I'm looking forward to Gradle 1.6 even if just for that new capabilities we've all been longing for!