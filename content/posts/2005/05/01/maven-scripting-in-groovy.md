---
title: "Maven scripting in Groovy"
date: 2005-05-01T00:00:00.000+02:00
tags: [groovy, maven, build]
---

Recently, on Maven's user list, someone wanted to be able to script Maven with Groovy, like it was already possible with BeanShell or Jython thanks to specific Jelly tags. But unfortunately, Maven didn't provide that kind of support for Groovy.

But there are good news on that front since [Jeremy Rayner](http://javanicus.com/blog2/) contributed a nice [Groovy Ant task](http://groovy.codehaus.org/Groovy+Ant+Task).

That Ant task will be available in the upcoming Groovy release (jsr-02), so if you want to play with Maven and Groovy, you'll have to build Groovy from sources in the meantime. But I'm going to reveal how to script Maven with Groovy in advance.

In your **maven.xml**, you can access Maven's POM:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project default="groovy" xmlns:ant="jelly:ant">
 <goal name="groovy">
   <ant:taskdef name="groovy" classname="org.codehaus.groovy.ant.Groovy" classpathref="maven.dependency.classpath"/>
   <ant:groovy>
       println pom.eachPropertyName{ println it }
       println pom.name
   </ant:groovy>
 </goal>
</project>
```

Don't forget to add Groovy in your dependencies:

```xml
   <dependency>
     <groupId>groovy</groupId>
     <artifactId>groovy-all</artifactId>
     <version>1.0-jsr-02-SNAPSHOT</version>
     <properties>
       <classloader>root</classloader>
     </properties>
   </dependency>
```

Currently, only the POM is added in the script context, but other variables or properties may be added, but you can already access almost everything from Maven's project. Don't hesitate to ping me if you've got some specific requests.