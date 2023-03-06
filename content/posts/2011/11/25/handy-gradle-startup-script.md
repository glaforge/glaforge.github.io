---
title: "Handy Gradle startup script"
date: "2011-11-25T05:00:00.000+01:00"
tags: [groovy]
---

[Dierk](https://twitter.com/mittie) published a [gist](https://gist.github.com/1271516) on GitHub with a handy Gradle build script to help you bootstrap a Gradle-built project from scratch, without having to create the directory layout manually, or install the Gradle wrapper. 

This is pretty neat and should be integrated in Gradle to ease the creation of projects!  

I've [updated the gist](https://gist.github.com/1393868) with a more recent version of Groovy and Gradle.  

And so that I never forget about this handy Gradle build script, I'm blogging about it and reproducing it here, to save me precious minutes finding it again the next time I need it! So without further ado, here's the script in question:

```groovy
apply plugin : 'groovy'  
apply plugin : 'idea'   

repositories { mavenCentral() }   

dependencies {  
    groovy 'org.codehaus.groovy:groovy-all:1.8.4'  
}   

task makeDirs(description : 'make all dirs for project setup') << {  
    def sources = [sourceSets.main, sourceSets.test]  
    sources*.allSource\.srcDirs.flatten().each { File srcDir ->  
        println "making $srcDir"  
        srcDir.mkdirs()  
    }   
}   
task wrap(type : Wrapper, description : "create a gradlew") {  
    gradleVersion = '1.0-milestone-6'  }
```