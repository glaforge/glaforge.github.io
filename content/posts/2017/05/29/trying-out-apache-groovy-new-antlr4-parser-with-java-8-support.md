---
title: "Trying out Apache Groovy's new Antlr4 parser with Java 8 support"
date: 2017-05-29T11:37:52+01:00
tags:
- groovy
- java
- parsing
---

[Apache Groovy](http://www.groovy-lang.org/) is coming up with a new parser, that supports the Java 8 syntax elements, as well as some new notation and operators of its own (like !in, !instanceof or ?[] for safe navigation with collections, or with ?= for Elvis assignment). I blogged recently about the fact that you can [try this new flavor online on this forked Groovy Web Console](http://glaforge.appspot.com/article/testing-java-8-snippets-on-the-new-app-engine-java-8-runtime) version, without the need of installing everything. But today I'll tell you how to build it for yourself in order to run it on your machine.

It's still to be decided which is going to be the version number of the release containing the new "parrot" parser, but you can already play with this syntax today. As I'm the kind of guy living on the edge of Groovy, I always use Groovy from the firehose, using the master branch with the latest and greatest changes. But I always forget about the right parameters or environment variable to use to build Groovy with the new parser, and to activate it... although it's clearly [explained in the documentation](https://github.com/apache/groovy/tree/master/subprojects/parser-antlr4#how-to-enable-the-new-parser). So as a note to self, to know where to look at, I decided to write it down in this post!

Build Apache Groovy from the master branch with the Antlr4 parser:

```bash
./gradlew -PuseAntlr4=true installGroovy
```

It's going to build an installation of Groovy that you can point [SDKman](http://sdkman.io/) at:

```bash
$ sdk install groovy target/install/ dev
$ sdk use groovy dev
```

That way, you can use this "dev" version of Groovy in your shell. However, you still need to enable the Antlr4 parser, and you can do so with the following exported environment variable:

```bash
$ export JAVA_OPTS=-Dgroovy.antlr4=true
```

Then, when running groovyConsole or groovysh, you'll be able to try the new syntax.

To learn more about the new parser, you can have a look at my presentation with some of the novelties provided by the "parrot" parser here:

{{< speakerdeck cdbf0cee31fd4eeca3c4add6ad86b3b0 >}}

And you can read Sergio's translation of Daniel's article on the new features [here](http://sergiodelamo.es/preview-of-groovy-3/).