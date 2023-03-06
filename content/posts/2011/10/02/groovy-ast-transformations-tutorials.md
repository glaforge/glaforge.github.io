---
title: "Groovy AST transformations tutorials"
date: "2011-10-02T00:00:00.000+02:00"
tags: [dsl, groovy]
---

[Groovy](http://groovy.codehaus.org) is a powerful language that gives the opportunity to its users to plugin into the compilation process to create what we call AST transformations, ie. the ability to customize the Abstract Syntax Tree representing your programs before the compiler walks this tree to generate Java bytecode.  

Since Groovy 1.6, many useful such transformations have been added to Groovy, like [@Delegate](http://groovy.codehaus.org/Delegate+transformation) to implement delegation, [@Immutable](http://groovy.codehaus.org/Immutable+transformation) to make your types immutable, or [@Grab](http://groovy.codehaus.org/Grape) to add dependencies to your scripts, and many more. However, mastering the Groovy AST and compiler APIs is not such a simple task, and requires some advanced knowledge of the inner workings of Groovy.  

[Joachim Baumann](http://joesgroovyblog.blogspot.com/), Groovy committer and [German Groovy book](http://www.dpunkt.de/buecher/2610.html) author, wrote a very nice series of articles on the topic of authoring AST transformations, covering:

*   [compiler phases and syntax trees](http://joesgroovyblog.blogspot.com/2011/09/ast-transformations-compiler-phases-and.html)
*   [prerequisites and annotations](http://joesgroovyblog.blogspot.com/2011/09/ast-transformations-prerequisites-and.html)
*   [the implementation of the example transformation itself](http://joesgroovyblog.blogspot.com/2011/09/ast-transformations-transformation.html)
*   [testing and error messages](http://joesgroovyblog.blogspot.com/2011/09/ast-transformations-testing-and-error.html)
*   [creating a complex AST transformation](http://joesgroovyblog.blogspot.com/2011/10/ast-transformation-using-astbuilder.html)

If you're interested in writing your own transformations, those very well written articles are really a great start that should get you up to speed very rapidly.