---
title: "Maven tip: using Ant's optional FTP task"
date: "2005-04-26T00:00:00.000+02:00"
tags: [geek, maven, ant, build, tips]
---

[Maven](http://maven.apache.org/) is a pretty powerful tool, but sometimes, simple things can get complicated... I had to customize my build to upload some files through FTP. But it wasn't just a mere artifact to upload through FTP to the enterprise repository, so I couldn't use Maven's artifact plugin and its FTP method. So the solution was to use Ant's optional FTP task.

At first, it doesn't seem very complicated, since Maven can basically use any Ant task very easily, but the fact is that this optional Ant task is dependent on another library that you have to add to Maven's root classloader, otherwise you'll get a NoClassDefFound! And moreover, I couldn't even find NetComponents on ibiblio!

To save you that pain, please read the instructions below. It is inspired from [a solution](http://java2.5341.com/msg/101580.html) I've found by googling, but the problem is that it is not the cleanest solution, since you have to hack Maven to add the library in the root classpath, and modify Maven's own private configuration. That's not very portable! My friend [Vincent Massol](http://blogs.codehaus.org/people/vmassol), author of [JUnit in Action](http://tinyurl.com/7hprk) and of the upcoming [Maven Developer's Notebook](http://blogs.codehaus.org/people/vmassol/archives/001003_maven_book_and_maven_quiz.html), helped me improve upon that solution to make it portable across different build environments, without requiring to modify Maven's own configuration.

Here are the instructions:

*   Download NetComponents from: [http://www.savarese.org/oro/downloads/NetComponents-1.3.8.tar.gz](http://www.savarese.org/oro/downloads/NetComponents-1.3.8.tar.gz)
*   Uncompress the archive, take the NetComponent.jar and put it in a new directory:
    `${user.home}/.maven/repository/net-components`
*   Rename the jar to `NetComponents-1.3.8a.jar`
*   Add the dependency in your `project.xml`:

    ```xml
        <dependency>
          <groupid>net-components</groupid>
          <artifactid>NetComponents</artifactid>
          <version>1.3.8a</version>
          <b><properties>
            <classloader>root</classloader>
          </properties>
        </dependency>
    ```

    The `root` is there to tell Maven to load that dependency with its root classloader, so that it is available to Maven's Ant which is loaded by that root classloader.

*   Now, you can add a goal in your `maven.xml` file to call the FTP task, and don't forget to create a task definition:

    ```xml
    <!--?xml version="1.0" encoding="UTF-8"?-->
    <project default="java:compile" xmlns:ant="jelly:ant">

      <goal name="ftp">
        <taskdef name="ftp" classname="org.apache.tools.ant.taskdefs.optional.net.FTP"></taskdef>
        <ant:ftp server="yourserver.domain.com" userid="foo" password="bar" action="list" listing="list.txt">
          <fileset>
            <include name="*.html"></include>
          </fileset>
        </ant:ftp>
      </goal>

    </project>
    ```


For the purpose of this example, the above goal lists the `*.html` files in your remote home folder. It will create a `list.txt` file containing the result of that listing. But of course, all FTP operations are available to you.

Now just type `maven ftp` and you're done! Was it that hard? Well, once you've read that, it isn't, but still...

I hope it'll save you some precious minutes, if not hours if you're not a Maven guru.

For further information, here are some pointers:

*   [Original solution](http://java2.5341.com/msg/101580.html)
*   [Ant's optional FTP task](http://ant.apache.org/manual/OptionalTasks/ftp.html)
*   [NetComponents distribution](http://www.savarese.org/oro/downloads/NetComponents-1.3.8.tar.gz)