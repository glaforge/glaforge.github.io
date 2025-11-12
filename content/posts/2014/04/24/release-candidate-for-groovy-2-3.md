---
title: "Release candidate for Groovy 2.3"
date: 2014-04-24T00:00:00.000+02:00
tags: [groovy]

similar:
  - "posts/2014/04/28/second-release-candidate-of-groovy-2-3.md"
  - "posts/2014/12/24/first-release-candidate-of-groovy-2-4.md"
  - "posts/2008/12/22/the-groovy-1-6-release-candidate-is-out.md"
---

The Groovy team is happy to announce the first release candidate of Groovy 2.3!  

The major changes between this version and the last beta include:

*   a simplification of the semantics of traits, by [removing `@ForceOverride` and making it the default](http://beta.groovy-lang.org/docs/groovy-2.3.0-rc-1/html/documentation/core-traits.html#_differences_with_java_8_default_methods)
*   the [implementation of stackable traits](http://beta.groovy-lang.org/docs/groovy-2.3.0-rc-1/html/documentation/core-traits.html#_chaining_behavior) for improved composition of behavior
*   a new [`@Builder` AST transformation to generate builders for immutable classes](http://beta.groovy-lang.org/docs/groovy-2.3.0-rc-1/html/documentation/core-metaprogramming.html#_available_ast_transformations)
*   bug fixes on generics type inference

For more details on the changes in this version, please refer to the [JIRA release notes](https://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20227). 
 
The release can be [downloaded](http://groovy.codehaus.org/Download) from the usual place.  

We're looking forward to hearing about your feedback, and unless anything super critical arises, we're targeting an imminent final release next week!