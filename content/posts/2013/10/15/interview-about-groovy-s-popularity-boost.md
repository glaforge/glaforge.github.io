---
title: "Interview about Groovy's popularity boost"
date: "2013-10-15T02:00:00.000+02:00"
tags: [groovy]
---

I was interviewed by Darryl Taft from eWeek yesterday about the Groovy programming language's recent popularity boost. You can read the two-page long interview here:  
[Groovy programming language sees major boost in popularity](http://www.eweek.com/developer/groovy-programming-language-sees-major-boost-in-popularity.html)  

You'll certainly be interested in the answers to some of the questions, in particular who's using Groovy, or for which use cases Groovy is being used:  

> **--- Why do you think Groovy has gained in popularity over the last year?**   
>
> Groovy's widely used in the industry as the 1.7 million downloads a year can attest, but there's been an interesting surge in popularity recently. In particular, as you could see at SpringOne2GX in September, Groovy was nicely featured in the Pivotal's[Spring IO](http://spring.io/) platform for example in the upcoming Spring Framework 4.0 version, in [Spring Boot](https://spring.io/blog/2013/08/06/spring-boot-simplifying-spring-for-everyone), or [Reactor](https://spring.io/blog/2013/05/13/reactor-a-foundation-for-asynchronous-applications-on-the-jvm) and other projects. There's a lot of buzz around the Groovy ecosystem: with the [Grails](http://grails.org/) web framework ongoing growth, or the [Gradle](http://www.gradle.org/) build automation system that is being used by [Google for the building Android application](http://tools.android.com/tech-docs/new-build-system).  
>   
> **--- What makes Groovy an attractive language to use?**   
>
> Groovy's main goals has always been to simplify the life of developers, and particularly Java developers.  
>   
> Its syntax is based off of the Java language itself, so it's very straightforward and intuitive to learn, but at the same time offers various shortcuts and APIs to make developers much more productive, help them write more concise and more readable code, easier to maintain and evolve in the long run.  
>   
> It's also the alternative language on the Java Virtual Machine that offers the best and most seamless integration and interoperability with the Java platform, as developers don't need to convert from one system to the other as Groovy classes are plain Java classes and vice versa.  
>   
> Groovy's overall well suited for many situations, for writing small scripts to building more complex applications, for designing Domain-Specific Languages (DSLs) for business rules, etc.  
>   
> **--- What types of applications is Groovy most suited for?**   
>
> There are different use cases for applying Groovy in your projects.  
> Often Groovy is introduced in companies and projects thanks to the nice testing tools it offers and how readable tests can become thanks to them — for example, with the [Spock testing framework](http://docs.spockframework.org/en/latest/). Other shops adopt [Gradle](http://www.gradle.org/) for building complex applications where other tools like Ant or Maven show their weaknesses.  
>   
> Groovy is also often used for "scripting" or customizing applications through extension points featuring Groovy scripts.  
>   
> The Internet of Things world is using Groovy for scripting home automation, for interacting with the various nodes of the mesh network ([SmartThings](http://www.smartthings.com/) and [Carriots](https://www.carriots.com/) are integrating Groovy for that purpose).  
> You can also customize the Jenkins continuous integration platform with Groovy, or interact with the ElasticSearch search engine with a Groovy API, etc.  
>   
> Another interesting use case is for business rules.  
> I already briefly mentioned business rules and DSLs, but it's one of the key use cases for Groovy.  
>   
> I've seen several financial institutions, insurance companies, travel or energy companies use Groovy for describing their business rules — actuaries defining rules for loan grants, scientists creating scientific simulations (nuclear risks, disease evolutions, etc.), travel agents customizing booking processes, and more.  
>   
> The easy Groovy syntax plus its ability to write almost plain English sentences which are valid Groovy statements makes it simple to write readable business rules.  
>   
> Of course, also, beside just "integrating" Groovy in existing apps to extend their capabilities or writing business rules, you can also build full blown applications totally in Groovy, like when you build a big web application with the Grails web stack.  
>   
> **--- Are there any big Groovy applications out there, or any major companies using it?**   
>
> I was recently asked a similar question on Quora, where you can read my more [detailed answer](http://www.quora.com/Whos-using-Groovy-in-production).  
>   
> Above, I've listed a few of the key use cases where Groovy is often used, and in that question on Quora I'm giving a few examples of those scenarios.  
>   
> To name a few companies using Groovy:  
>   
> * **Netflix** is using Groovy in their [Asgard](http://netflix.github.io/asgard/) cloud automation platform (a case study will soon be published on Pivotal's blog by the way), as well as for other handy libraries like [Glisten](http://techblog.netflix.com/2013/09/glisten-groovy-way-to-use-amazons.html) to interact with Amazon's Simple Workflow Service.  
>   
> * **Google** have moved the **Android** application build over to Gradle which uses Groovy as the build language, so all Android developers will soon be using Groovy for building their Android applications  
>   
> * **LinkedIn** developed [Glu](http://pongasoft.github.io/glu/docs/latest/html/index.html) (their open source deployment and monitoring platform) in Groovy, but they are also using Grails web applications for recruiters using the LinkedIn platform and profile database  
>   
> * Various financial institutions like **JPMorgan**, **MasterCard**, **Crédit Suisse**, **Fanny Mae**, **Mutual of Omaha**   
> * The **European Patent Office** is using Groovy for collecting patents from all over the world, extract / transform all those patent formats in some kind of pivot formats, all that with Groovy  
> And many more... but the above are some of the more famous names that I know about.  
>   
> **--- What are you doing with Groovy these days?**   
>
> These days, we are ironing out the latest details of the Groovy 2.2 final release.  
>   
> We are also working on future versions of Groovy at the same time, and investigating and experimenting other areas where Groovy could offer some nice productivity boosts for developers (think simplifying Android development, big data manipulation and analyses, etc.)