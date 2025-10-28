---
title: "GPars reaches 1.0!"
date: 2012-12-19T00:00:00.000+01:00
tags: [groovy, gpars]
---

Václav Pech just [announced the final release of GPars 1.0](http://www.jroller.com/vaclav/entry/i_like_the_smell_of), the concurrency and parallel toolkit for Groovy and Java.  

We'll bundle [GPars 1.0](http://gpars.codehaus.org/) in the Groovy 2.1 distribution coming very soon!  
  
Let me quote some of the key changes and enhancements of this release (quoting from the "what's new" section of the [user guide](http://www.gpars.org/1.0.0/guide/guide/gettingStarted.html#gettingStarted_what'sNew)):

> Asynchronous functions
> 
> *   Allowed for delayed and explicit thread pool assignment strategies for asynchronous functions
> *   Performance tuning to the asynchronous closure invocation mechanism
> 
> Parallel collections
> 
> *   Added a couple of new parallel collection processing methods to keep up with the innovation pace in Groovy
> *   Merged the extra166y library into GPars
> 
> Actors
> 
> *   StaticDispatchActor has been added to provide easier to create and better performing alternative to _DynamicDispatchActor_
> *   A new method _sendAndPromise_ has been added to actors to send a message and get a promise for the future actor's reply
> 
> Dataflow
> 
> *   Operator and selector speed-up
> *   Kanban-style dataflow operator management has been added
> *   Chaining of Promises using the new _then()_ method
> *   Exception propagation and handling for Promises
> *   Added a DSL for easy operator pipe-lining
> *   Lifecycle events for operators and selectors were added
> *   Added support for custom error handlers
> *   A generic way to shutdown dataflow networks
> *   An shutdown poison pill with immediate or delayed effect was added
> *   Polished the way operators can be stopped
> *   Added synchronous dataflow variables and channels
> *   Read channels can report their length