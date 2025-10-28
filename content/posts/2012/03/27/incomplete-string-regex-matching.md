---
title: "Incomplete string regex matching"
date: 2012-03-27T00:00:00.000+02:00
tags: [groovy]
---

Once in a while, I stumble upon the need of being able to tell whether a string could match a certain regular expression pattern, if it were given some more characters.  

For example, a user is typing a time in an input field, following the pattern of 2 digits, a colon, and 2 other digits. He enters the first two digits and the colon, and we're wondering if the time could be valid if he entered some more keystrokes.  

I found the [JRegex](http://jregex.sourceforge.net/) project and its documentation about [incomplete matching](http://jregex.sourceforge.net/gstarted-advanced.html#imatching) which showed me that it was possible to achieve such a goal. But using JRegex is adding another library on the classpath for such a small requirement, that I started wondering if there was a way to emulate that with Java's own regex support.  

We're used to methods like [`matches()`](http://docs.oracle.com/javase/6/docs/api/java/util/regex/Matcher.html#matches()) / [`find()`](http://docs.oracle.com/javase/6/docs/api/java/util/regex/Matcher.html#find()) on [`Matcher`](http://docs.oracle.com/javase/6/docs/api/java/util/regex/Matcher.html), but not so much with some of the other methods. I thought [`lookingAt()`](http://docs.oracle.com/javase/6/docs/api/java/util/regex/Matcher.html#lookingAt()) could be of help, but it's only interesting if you want to check that the beginning of an input string matches a pattern... whereas we want a full string to match the beginning of a pattern instead.  

After twitting about my quest, Fred Martini came up with the [solution](https://twitter.com/#!/adiguba/status/184649138464493569) to my problem. Thanks Fred! And the winner is... [`hitEnd()`](http://docs.oracle.com/javase/6/docs/api/java/util/regex/Matcher.html#hitEnd()). Looking at the JavaDoc, it's not that explicit how it could be used...  

> `public boolean hitEnd()`
>   
> Returns true if the end of input was hit by the search engine in the last match operation performed by this matcher.   
>
> When this method returns true, then it is possible that more input would have changed the result of the last search.  
>   
> **Returns:** true iff the end of input was hit in the last match; false otherwise  

When the matcher is trying to match the pattern against the input stream, it arrives at the end of the input stream before it could really say if the string matched that pattern or not. And as the JavaDoc says, perhaps that with some more input, the search could have succeeded.  

More concretely, let's have a look at a quick example, coded in Groovy for simplicity sake:  

```groovy
def input = /12:/ 
def pattern = Pattern.compile(/\\d{2}:\\d{2}/) 
def matcher = pattern.matcher(input) 

assert matcher.matches() || matcher.hitEnd()
```

Or for a more idiomatic Groovy version:  

```groovy
def matcher = /12:/ =~ /\\d{2}:\\d{2}/  
assert matcher.matches() || matcher.hitEnd()
```

Thinking about it... we could even add a `matchesPartially()` to the GDK!