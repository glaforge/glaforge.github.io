---
title: "Serving static assets with Micronaut"
date: 2024-01-21T17:23:25+01:00
tags:
- java
- micronaut
---

My go-to framework when developing Java apps or microservices is
[Micronaut](https://micronaut.io).
For the apps that should have a web frontend, I rarely use
[Micronaut Views](https://micronaut-projects.github.io/micronaut-views/latest/guide/)
and its templating support.
Instead, I prefer to just **serve static assets** from my resource folder,
and have some JavaScript framework (usually [Vue.js](https://vuejs.org/))
to populate my HTML content (often using
[Shoelace](https://shoelace.style/) for its nice Web Components).
However, the [static asset documentation](https://docs.micronaut.io/latest/guide/#staticResources)
is a bit light on explanations.
So, since I always forget how to configure Micronaut to serve static assets,
I thought that would be useful to document this here.

In `/src/main/resources/application.properties`, I'm adding the following:

```properties
micronaut.router.static-resources.default.paths=classpath:public
micronaut.router.static-resources.default.mapping=/**
micronaut.router.static-resources.default.enabled=true

micronaut.server.cors.enabled=true
```

* The first line says that my resources will live in `src/main/resources/public/`.
* The second line means the pattern will match recursively for sub-directories as well.
* The `enabled` flag is to activate static serviing (not strictly needed as it's supposed to be enabled by default).
* I also enabled CORS (cross-origin resource sharing).

Then in `src/main/resources/public/`, I'll have my `index.html` file,
my `css` and `js` folders.

