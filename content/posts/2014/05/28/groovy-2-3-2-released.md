---
title: "Groovy 2.3.2 released"
date: "2014-05-28T00:00:00.000+02:00"
tags: [groovy]
---

The Groovy team is pleased to announce the release of Groovy 2.3.2, a bug fix release for our 2.3 main branch.  

If you have already moved to Groovy 2.3, we strongly recommend you to upgrade to 2.3.2 rapidly, as our two prior 2.3 releases were using a buggy version of ASM which was generating wrong bytecode for inner classes.  

You can check this issue for more details: [https://jira.codehaus.org/browse/GROOVY-6808](https://jira.codehaus.org/browse/GROOVY-6808)  
  
Since any code compiled with Groovy 2.3.0 or 2.3.1 and using inner classes is likely to have faulty bytecode, please make sure to recompile everything with 2.3.2  
Our detailed JIRA change log: [http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20402](http://jira.codehaus.org/secure/ReleaseNote.jspa?projectId=10242&version=20402)  

And go download Groovy at the usual place: [http://groovy.codehaus.org/Download?nc](http://groovy.codehaus.org/Download?nc)  

Thanks to all who contributed!