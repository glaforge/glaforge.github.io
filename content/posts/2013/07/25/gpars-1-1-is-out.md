---
title: "GPars 1.1 is out"
date: 2013-07-25T00:00:00.000+02:00
tags: [groovy]
---

[Václav Pech](http://www.jroller.com/vaclav/) just announced the release of GPars 1.1, the multi-paradigm concurrency and parallel Groovy-friendly toolkit:  

> The GA release of GPars 1.1.0 has just been published and is ready for you to grab. It brings gradual improvements into dataflow as well as a few other domains. Some highlights:  
>   
> *   `LazyDataflowVariable` added to allow for lazy asynchronous values
> *   Timeout for Selects
> *   Added a Promise-based API for value selection through the Select class
> *   Enabled listening for bind errors on DataflowVariables
> *   Minor API improvement affecting Promise and DataflowReadChannel
> *   Protecting agent's blocking methods from being called from within commands
> *   Updated to the latest 0.7.0 GA version of Multiverse
> *   Migrated to Groovy 2.0
> *   Used `@CompileStatic` where appropriate
> *   A few bug fixes
> 
> You can [download](http://gpars.codehaus.org/Download) GPars 1.1.0 directly or [grab it from the maven repo](http://gpars.codehaus.org/Integration).  
>   
> Have a lot of fun trying out GPars 1.1.0!