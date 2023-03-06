---
title: "Groovy Weekly #34 back from vacations!"
date: "2014-09-02T00:00:00.000+02:00"
tags: [groovy, groovy-weekly]
---

After a long summer break, it’s high time we resume Groovy Weekly, and come back to our every-Tuesday agenda! Get ready for lots of content!

  

If there were one particular item of news I’d like to highlight in this edition, that’s the news about the [New York Times that is going to use Groovy and its Android support](http://open.blogs.nytimes.com/2014/08/18/getting-groovy-with-reactive-android/?_php=true&_type=blogs&_r=0) (in the upcoming Groovy 2.4), as well as RxJava, to revamp its Android application to make more “reactive”.

  

Speaking of Groovy 2.4, it’s interesting to note that the new beta released today reduces the bytecode size, by not generating unneeded methods anymore. This should make Android developers happy, since they are overal limited in the number of methods in Android applications.

  

Next week will be pretty Groovy in Dallas, as the SpringOne2GX conference will be on. Perhaps we won’t have yet much news and presentations to share next Tuesday, but the following week will list all the great content and news happening at the conference. If you’re around, don’t hesitate to tell hi!

Releases

*   [Groovy 2.4-beta-3](http://glaforge.appspot.com/article/beta-3-for-groovy-2-4) released with reduced synthetic methods (particularly handy for Android developers) to reduce the bytecode size
    
*   [Ratpack 0.9.8](http://www.ratpack.io/versions/0.9.8) released with Ratpack's HttpClient testing support, dangling request detection, and reactive stream support
    
*   [Griffon 2.0 RC-2](http://docs.codehaus.org/display/GRIFFON/2014/08/11/Griffon+2.0.0.RC2+Released) released
    
*   [Gradle 2.1 RC-3](http://forums.gradle.org/gradle/topics/gradle-2-1-rc-3-is-now-available-for-testing) is available for testing
    
*   [Grooscript Gradle plugin 0.5.1](https://bintray.com/chiquitinxx/grooscript/org.grooscript%3Agrooscript-gradle-plugin/0.5.1) is out
    
*   [Grails Petclinic sample](https://github.com/grails-samples/grails-petclinic) app has been updated to 2.4.3 and now uses the asset-pipeline plugin and has new tests for the Domain classes.
    
*   [Gdub, an enhanced Gradle wrapper](http://www.gdub.rocks/)
    
*   [JavaFX charting support for GroovyLab](https://code.google.com/p/jlabgroovy/wiki/JavaFXChartsInGroovyLab)
    
*   Fabiano Taioli created a [micro Groovy, thread-safe, dependency injection container](http://fbn.github.io/gimple/), called Gimple
    

News

*   The [New York Times is going Groovy with Reactive Android](http://open.blogs.nytimes.com/2014/08/18/getting-groovy-with-reactive-android/?_php=true&_type=blogs&_r=0) by Mohit Panday
    
*   The Groovy project on Github has just crossed the [500th pull requests](https://github.com/groovy/groovy-core/pulls) mark. Still some work to close the 25 still open though! Keep'em coming, it's a wonderful way to contribute to the project!
    
*   The Grails Diary by Jacob Aae Mikkelsen
    

*   [Week 32](http://grydeske.net/news/show/56)
    
*   [Week 33](http://grydeske.net/news/show/57)
    
*   [Week 34](http://grydeske.net/news/show/58)
    
*   [Week 35](http://grydeske.net/news/show/59)
    

Articles

*   [Why your company should be using Groovy](http://www.objectpartners.com/2014/08/25/gr8conf-us-recap-why-your-company-should-adopt-groovy/)? Scott Hickey comes back on the Mutual of Omaha Groovy case study
    
*   Mark Perry on [Groovy Monads](http://mperry.github.io/2014/08/19/groovy-monads.html)
    
*   [Using the GrooScript Node.js support](http://grooscript.org/nodejs_example.html)
    
*   Robert Fletcher uses [Hamcrest with Spock](http://blog.freeside.co/2014/08/07/spock-and-hamcrest/)
    
*   [Multiple interface mocks with Spock](http://blog.freeside.co/2014/08/11/multiple-interface-mocks-with-spock/) by Rob Fletcher
    
*   [Ratpack: First Impressions](http://swalsh.org/blog/2014/08/26/ratpack-first-impressions/), by Sean Walsh
    
*   Andrés Almiray's Gradle glam: [custom Asciidoctor extensions](http://www.jroller.com/aalmiray/entry/gradle_glam_custom_asciidoctor_extensions) in Groovy
    
*   MrHaki’s Asciidoctor goodness: [writing extensions in Groovy](http://mrhaki.blogspot.fr/2014/08/awesome-asciidoc-write-extensions-using.html)
    
*   MrHaki's Groovy goodness
    

*   use [custom template class with MarkupTemplateEngine](http://mrhaki.blogspot.fr/2014/08/groovy-goodness-use-custom-template.html)
    
*   [nested templates with MarkupTemplateEngine](http://mrhaki.blogspot.fr/2014/08/groovy-goodness-nested-templates-with.html)
    
*   [using layouts with MarkupTemplateEngine](http://mrhaki.blogspot.fr/2014/08/groovy-goodness-using-layouts-with.html)
    

*   MrHaki's Gradle goodness
    

*   [getting more dependency insight](http://mrhaki.blogspot.fr/2014/08/gradle-goodness-getting-more-dependency.html)
    
*   [suppress progress logging](http://mrhaki.blogspot.fr/2014/08/gradle-goodness-suppress-progress.html)
    

*   [Eliminating development redeploys](http://www.cholick.com/entry/show/280) using Gradle
    
*   Romin Irani’s Gradle tutorial series
    

*   Part 4: [Java web applications](http://rominirani.com/2014/08/12/gradle-tutorial-part-4-java-web-applications/)
    
*   Part 5: [Google AppEngine plugin](http://rominirani.com/2014/08/15/gradle-tutorial-part-5-gradle-app-engine-plugin/)
    
*   Part 6: [Android Studio and Gradle](http://rominirani.com/2014/08/19/gradle-tutorial-part-6-android-studio-gradle/)
    
*   Part 7: [Android Studio, Gradle and Google AppEngine](http://rominirani.com/2014/08/20/gradle-tutorial-part-7-android-studio-app-engine-gradle/)
    
*   Part 8: [Gradle, Google AppEngine, Endpoints and Android Studio](http://rominirani.com/2014/08/25/gradle-tutorial-part-8-gradle-app-engine-endpoints-android-studio/)
    
*   Part 9: [Cloud Endpoints, persistence and Android Studio](http://rominirani.com/2014/08/26/gradle-tutorial-part-9-cloud-endpoints-persistence-android-studio/)
    
*   Part 10: [Consuming Cloud Endpoints in Android Studio](http://rominirani.com/2014/08/27/gradle-tutorial-part-10-consuming-endpoints-in-android-code/)
    

*   Robert Peszek's Grails/Hibernate series:
    

*   Part 3: [DuplicateKeyException, catch it if you can](http://rpeszek.blogspot.fr/2014/08/i-dont-like-grailshibernate-part-3.html)
    
*   Part 4: [Hibernate proxy objects](http://rpeszek.blogspot.fr/2014/08/i-dont-like-grailshibernat-part-4.html)
    
*   Part 5: [auto-saving and auto-flushing](http://rpeszek.blogspot.fr/2014/08/i-dont-like-hibernategrails-part-5-auto.html)
    

*   [Add Javascript unit tests and run them with “grails test-app”](http://www.objectpartners.com/2014/08/19/add-javascript-unit-tests-and-run-them-with-grails-test-app/) by Igor Shults
    
*   Dmitriy Drenkalyuk covers [advanced GORM features](http://sysgears.com/articles/advanced-gorm-features-inheritance-embedded-data-maps-and-lists-storing/): inheritance, embedded data, maps and lists storing
    

Presentations

*   Venkat Subramaniam reveals [how Groovy named parameter constructor works](https://twitter.com/agilelearner/status/496970094946562048)
    
*   GR8Conf US 2014 videos
    

*   [DevOps, Chef and Grails](https://www.youtube.com/watch?v=KvBjO4WXL24&feature=youtu.be), presented by Ken Liu
    
*   [Groovy Puzzlers](https://www.youtube.com/watch?v=k6vXQwxk7N8&feature=youtu.be) presentation by Baruch Sadogursky and Andrés Almiray
    
*   [Why your build matters](https://www.youtube.com/watch?v=oF-gK-x8RGw&feature=youtu.be), by Peter Ledbrook
    
*   [One build to rule them all](https://www.youtube.com/watch?v=ROYQlc-wVEg), by John Engelman
    
*   [REPL driven development with the Grails console](https://www.youtube.com/watch?v=bTRUC78X87g) plugin, by David Kuster
    

*   A paid video on [effective Gradle implementation](https://www.packtpub.com/effective-gradle-implementation/video) by Lee Fox and Ryan Vanderwerf for Packt Publishing
    

Google+ posts

*   Richard Vowles releases a [new version of his Maven Groovydoc plugin](https://plus.google.com/u/0/+RichardVowles/posts/fQzj2Zfn8Ux)
    
*   Al Baker reports about [Groovy's presence the next semantic web conference](https://plus.google.com/b/113675159854671799959/+AlBakerDev/posts/11DxyvNoKi7?cfem=1) with GroovySparql and Stardog-Groovy
    

Tweets

*   GVM 2.0 is rolling out a [new broadcast API](https://twitter.com/gvmtool/status/497521264094093313)
    
*   [Spring Boot 1.1.5](https://twitter.com/gvmtool/status/497490734980005889) is available through GVM
    
*   [Gradle 2.1 RC-2](https://twitter.com/gvmtool/status/505331657508134912) is available on GVM
    
*   The [Lazybones Gradle plugin](https://twitter.com/pledbrook/status/503823613536251904) is now in the Gradle plugin portal
    
*   [Lazybones 0.7.1](https://twitter.com/gvmtool/status/503591205071233024) is on GVM
    
*   Cédric Champeau is [gathering feedback about Groovy traits in production](https://twitter.com/cedricchampeau/status/503834637203173378) for his SpringOne2GX presentation
    
*   Cédric Champeau will be speaking about [Groovy and Android at Devoxx](https://twitter.com/cedricchampeau/status/504599269379436545)
    
*   The Asciidoctor Java integration [(Asciidoctorj) is on the road to Gradle](https://twitter.com/ysb33r/status/504665335476539392)
    
*   [Marcin Erdmann recently joined the GradleWare](https://twitter.com/cedricchampeau/status/506465145825267712) team. Congrats to him!
    
*   Peter Ledbrook reminds us we can [submit talks for the Groovy / Grails eXchange](https://twitter.com/pledbrook/status/505744842568531968) conference in London, next December
    

Mailing-lists posts

*   The debate around advocating Groovy vs Java resumes speaking about [how to manage adoption](http://groovy.329449.n5.nabble.com/Advocating-Groovy-vs-Java-Phase-II-How-to-Manage-Groovy-Adoption-td5720932.html)
    
*   A discussion on [using Groovy in a Java EE project](http://groovy.329449.n5.nabble.com/Using-groovy-in-a-JEE-project-td5720948.html)
    
*   Søren Berg Glasius is planning on taking over and [updating the GroovyBlogs website](http://groovy.329449.n5.nabble.com/GroovyBlogs-td5721104.html)
    
*   [Groovy as a gateway drug into the enterprise](http://groovy.329449.n5.nabble.com/The-potential-of-Groovy-for-unit-testing-Java-code-The-quot-ticket-to-Groovy-quot-for-millions-of-Ja-td5720984.html)
    
*   Sergei Egorov plays with [pattern matching in Groovy](http://groovy.329449.n5.nabble.com/Basic-Scala-like-pattern-matching-implementation-td5721078.html) thanks to his Groovy Macro project
    
*   Sergei Egorov created an [online Groovy AST console](http://groovy.329449.n5.nabble.com/Online-Groovy-AST-Console-td5720986.html)
    
*   Recent [Oracle's Java 8 updates have been breaking Groovy](http://groovy.329449.n5.nabble.com/Oracle-breaking-Groovy-is-a-problem-td5720928.html) but the Groovy team works with Oracle to resolve those problems
    
*   Ways to get an [executable Groovy program to run without Groovy installed](http://groovy.329449.n5.nabble.com/groovy-in-jar-td5720858.html)
    

Code snippets

*   Following up a question on the Groovy mailing-list about [how to disable @Grab](https://github.com/glaforge/disable-grab-sample/blob/master/src/main/groovy/disablegrab/DisableGrabTransformation.groovy), Guillaume Laforge created a small sample project showing a global AST transformation that generates compilation errors when the @Grab or @Grapes annotations are used in a Groovy script
    
*   A [Groovy puzzler in the "daily WTF"](http://thedailywtf.com/Articles/Securing-Input.aspx) about input validation
    

Events

*   [First San Diego Groovy user group meeting](https://twitter.com/ben_t_mcguire/status/503631937701830658) on September 3rd
    
*   The [Groovy & Grails eXchange Call for Paper is already open](https://twitter.com/skillsmatter/status/496936164809793536)!
    
*   A [Groovy and Grails training](https://skillsmatter.com/courses/265-groovy-and-grails-workshop) by Peter Ledbrook in London, end of September
    

Books

*   [Grails in Action 2nd edition](http://www.amazon.com/gp/product/1617290963) is now available on Amazon
    
*   MrHaki's [Grails Goodness notebook has been updated](http://mrhaki.blogspot.fr/2014/08/grails-goodness-notebook-updated.html) with new recipes