---
title: "First steps in TDD-land"
date: "2004-03-15T00:00:00.000+01:00"
tags: [geek]
---

Unit tests aren't really new for me, but so far, on the different projets on which I worked recently, I haven't really had the opportunity to develop "test firt". Moreover, I could not test much because those projects were not pretty test-friendly (static instances all around, nothing close to IoC/DI anywhere around). And also, on web-based and GUI projects, it is not that easy to write tests (when I have time, I should definitely have a look at those HTTP and Swing testing frameworks). Because of those projects, I was quite used to test things here and there with main methods and System.out.println()... you'll agree with me that it's not really professional. Not easy to make regression tests as well. Shame on me!

As a pet project, everybody must have one I guess, I'm a developer on the [Groovy](http://groovy-lang.org/) scripting language. Each time we develop something, we always test it, thanks to the geniusly designed Groovy testing framework settled by James. So I'm quite used to unit testing my work. But most of the time, even in Groovy, I code first, then test afterwards. I haven't taken the habit of writing the test first, then trying my best to make it pass. But recently, James improved the build process, so it's going to be easier to work test firt though (ability to launch a single test, and a quick-test maven goal was added).

Things are changing, at my new company, I'm starting a new project: a JMS implementation over a MOM (Message-Oriented Middleware). And I ceized the opportunity to make my first steps in TDD-land. And I must admit that I'm quite satisfied with this approach.

In order to retrieve the administered objects from a JNDI context, I created my own little embeded JNDI provider. That's my first real test-first piece of software. As I didn't know much of the implementation of such a beast, I thought testing it first was a good idea. And indeed it is: testing first allows me to guide my hand and my brain during the development process. As I discover the spec, as I read the Javadoc, I create tests that match those requirements, then try to implement them. This method should throw an NPE if the Name object is null? Ok, a new test. This NamingEnumeration.hasMore() method should return false if there's no more elements? Ok, once again a new test. At the end of the day, I have a fair amount of tests that correspond to the spec I must implement.

I won't detail more my implementation, but simply wanted to express my delighted feeling. I must admit that TDD is quite a pleasant and fruitful experience. And I can now understand better people infected by the test-first virus. As I code, as I understand better what I'm supposed to implement, the tests guide me and make me more confident with my code. With the nice JUnit integration within [IntelliJ IDEA](http://www.jetbrains.com/)(my favourite IDE and the best I've used so far) I'm feeling good when I see the famous green bar. As much as I can, and if I can convert my colleagues to the TDD approach, I'll be continuing writing JUnit tests first.

Another green bar, yes!!!