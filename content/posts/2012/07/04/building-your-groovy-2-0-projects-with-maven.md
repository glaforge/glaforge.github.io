---
title: "Building your Groovy 2.0 projects with Maven"
date: "2012-07-04T02:00:00.000+02:00"
tags: [groovy]
---

There are various options for building your Groovy projects: including Ant with the [Groovyc Ant task](http://groovy.codehaus.org/The+groovyc+Ant+Task), or with [Gradle Groovy plugin](http://www.gradle.org/docs/current/userguide/groovy_plugin.html). But today, I'd like to speak about Maven. You have actually two possible choices: [GMaven](http://gmaven.codehaus.org/) or the [Groovy Eclipse Maven plugin](http://groovy.codehaus.org/Groovy-Eclipse+compiler+plugin+for+Maven).  

## GMaven 

GMaven 1.4 already allowed you to use Groovy 2.0 even before the final release of Groovy, although a new 1.5 version is about to be released soon, which should also include the option to use the "invoke dynamic" support which is currently missing for GMaven 1.4.  

Keegan Witt, the lead of the GMaven project, just recently [posted an example POM to configure GMaven with Groovy 2.0](http://groovy.329449.n5.nabble.com/Groovy-Eclipse-compiler-plugin-for-Maven-replacing-gmaven-td5709858.html#a5710494):  

```xml
<properties>
  <gmavenVersion>1.4</gmavenVersion>
  <gmavenProviderSelection>2.0</gmavenProviderSelection>
  <groovyVersion>2.0.0</groovyVersion>
</properties>
<dependencies>
  <dependency>
    <groupId>org.codehaus.groovy</groupId>
    <artifactId>groovy-all</artifactId>
    <version>${groovyVersion}</version>
  <dependency>
</dependencies>
<build>
  <plugins>
    <plugin>
      <groupId>org.codehaus.gmaven</groupId>
        <artifactId>gmaven-plugin</artifactId>
        <version>${gmavenVersion}</version>
        <configuration>
          <providerSelection>${gmavenProviderSelection}</providerSelection>
          <sourceEncoding>UTF-8</sourceEncoding>
        </configuration>
        <executions>
          <execution>
            <goals>
              <goal>generateStubs</goal>
              <goal>compile</goal>
              <goal>generateTestStubs</goal>
              <goal>testCompile</goal>
            </goals>
          </execution>
        </executions>
        <dependencies>
         <dependency>
           <groupId>org.codehaus.groovy</groupId>
           <artifactId>groovy-all</artifactId>
           <version>${groovyVersion}</version>
         </dependency>
       </dependencies>
    </plugin>
  </plugins>
</build>
````

Stay tuned for version 1.5 of the GMaven plugin.  

## Groovy Eclipse compiler plugin for Maven 

The alternative solution is to use the compiler from the Groovy Eclipse project, which can be used as a Maven plugin. Not long ago, I changed a Maven-powered project to use Groovy Eclipse instead of GMaven, and it worked flawlessly, and I was quite happy with the result.  

The [Groovy Eclipse compiler plugin for Maven](http://groovy.codehaus.org/Groovy-Eclipse+compiler+plugin+for+Maven) is very well documented, so be sure to have a look at it for all the details on how to best configure it.  

In the meantime, the simplest way to build your Groovy 2.0 sources can be achieved with this simpler configuration, as it's using 2.0 by default:

```xml
<build>
...
<plugins>
  <plugin>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>2.3.2</version>
    <configuration>
      <compilerId>groovy-eclipse-compiler</compilerId>
    </configuration>
    <dependencies>
      <dependency>
        <groupId>org.codehaus.groovy</groupId>
        <artifactId>groovy-eclipse-compiler</artifactId>
        <version>2.7.0-01</version>
      </dependency>
    </dependencies>
  </plugin>
  ...
</plugins>
</build>
```