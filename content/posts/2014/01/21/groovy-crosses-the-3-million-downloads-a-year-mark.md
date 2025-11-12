---
title: "Groovy crosses the 3 million downloads a year mark"
date: 2014-01-21T04:00:00.000+01:00
tags: [groovy]

similar:
  - "posts/2014/01/21/groovy-weekly-5.md"
  - "posts/2015/07/08/groovy-weekly-73.md"
  - "posts/2015/02/03/groovy-weekly-56.md"
---

Back in 2012, I was pretty happy and proud to see Groovy being used more and more, and reaching 1.7 million downloads in 2012. But the competition with other alternative language, I was personally not sure how those figures would evolve over the course of 2013. Fortunately, thanks to the hard work of the Groovy core development team and the friendly community and ecosystem, I'm happy to report an impressive ongoing growth for 2013: Groovy crosses the 3 million downloads a year mark!  

I have compiled some statistics thanks to the Maven Central statistics, as well as through slicing and dicing the Codehaus Apache logs, and I'd like to illustrate two interesting findings.  

First, let's have a look at those download numbers, spanning both 2012 and 2013 to show the trend and growth. In the graph below (sorry for the subtitle in French) I've stacked up the Codehaus downloads (in blue) and the Maven Central downloads (in green), and put the total on top (in yellow).  

[![](/img/misc/groovy+download+evolution.png)](/img/misc/groovy+download+evolution.png)  

You'll notice that there are more downloads of Groovy "as a library" than as an installable binary distribution, as Central usually represents 3 to 4 times more downloads than Codehaus, but this is logical as Groovy is just a "dependency" to add to your project!  

The peaks you see on the graph usually correspond to major releases, for example the 2.2.0 RCs and GA releases in October 2013, or 2.1.0 end of December 2012, etc.  
The yellow line is showing the general trend in total number of downloads per month, starting from 100K+ per month in the beginning of 2012 up to 300K+ downloads a month at the end of 2013.  

Before moving to the second illustration, note that those numbers are downloads of Groovy itself. They don't account for downloads of Grails or Gradle, etc, as those projects actually bundle their own version of Groovy, and thus doesn't add downloads to our stats here. Those figures represent developer and company projects depending on Groovy or developers installing the Groovy distribution on their machines.  

Another interesting perspective is to see how the various Groovy versions are being adopted by the community. The graph below illustrates the proportion of each version being downloaded over 2012 and 2013.  

[![](/img/misc/groovy+version+adoption.png)](/img/misc/groovy+version+adoption.png)  

There have been many beta and RC releases of Groovy 2.0 in 2011 and first half of 2012, and Groovy 1.8 was really going strong, but with the release of Groovy 2.0 in June 2012, we've had a rapid adoption of Groovy 2.0, even though Groovy 1.8 has still been remaining significant (for instance, some projects like Gradle still rely on Groovy 1.8!).  
The release of Groovy 2.1 in January 2013 also induced a cliff of adoption towards the new version, dwarfing 2.0, as Groovy 2.0, 2.1 and 2.2 are very much compatible so users don't hesitate jumping their dependencies up.  

And then the release of Groovy 2.2 in November 2013 shows this version is also being nicely adopted, although perhaps less rapidly than 2.1 was -- but remember these are percentages on the graph. And as of December, Groovy 2.2 represents about 40%, slightly above the 38% of Groovy 2.1.  

What we see from this graph is that it usually takes around 4 months or so for the next major version of Groovy to be majoritarily adopted by Groovy developers.  

With the downloads almost doubling (1.7M to 3.0M) from 2012 to 2013, we see that Groovy clearly continue being very successful and widely used and deployed in tons of projects!  
Big thanks to the Groovy core team for its hard work towards this success, and to the whole community and ecosystem for fostering such a growth!