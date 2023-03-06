---
title: "Guicy: a Groovy Guice?"
date: "2007-03-26T00:00:00.000+02:00"
tags: [groovy]
---

![](http://crazybob.org/uploaded_images/juice-770770.gif)I recently came across [Bob Lee](http://crazybob.org/)'s brand new IoC/DI framework: [Guice](http://code.google.com/p/google-guice/). I'm usually using [Spring](http://www.springframework.org/) for that purpose, and also because it goes much farther than just IoC/DI, but I thought I'd give Guice a try, especially because I wanted to play with [Groovy](http://groovy.codehaus.org/)'s support for annotations. So I [downloaded Guice](http://google-guice.googlecode.com/files/guice-1.0.zip), and read the nice getting started[documentation](http://docs.google.com/Doc?id=dd2fhx4z_5df5hw8) I also took a snapshot of Groovy 1.1 that supports Java 5 annotations. With guice-1.0.jar and aopalliance.jar on my classpath, and with the latest Groovy snapshot distribution properly installed, I was ready to go!

So, how do we start? Well, first of all, you must have some service contract that you'd like to depend on and to inject in some client code. Nothing really fancy here, I just shamelessly took inspiration from the documentation:

```groovy
interface Service {
    void go()
}
```

Now, I need a concrete implementation of this service:

```groovy
class ServiceImpl implements Service {
    void go() {
        println "Okay, I'm going somewhere"
    }
}
```

So far so good, now, we'll need some client code that needs a service to be injected. This is where you're going to see some specific juicy annotation coming into play.

```groovy
class ClientWithCtor {

    private final Service service

    @Inject
    Client(Service service) {
        this.service = service
    }

    void go() {
        service.go()
    }
}
```

Here, I'm creating a client class where I'm using constructor injection. The sole thing we have to do here is just use the `@Inject` annotation. But of course, so far, the wiring isn't specified anywhere, and we have to do it now. Guice has the concept of Modules which contain programmatic code to wire classes together.

```groovy
class MyModule implements Module {
    void configure(Binder binder) {
        binder.bind(Service)
            .to(ServiceImpl)
            .in(Scopes.SINGLETON)
    }
}
```

We are binding the `Service` interface to the `ServiceImpl` implementation. And we also mention the scope of the injection: we want to have one single implementation of that service available. Instead of specifying the scope in the module, you could also use a `@Singleton` annotation on the `ServiceImpl` class.

Now that everything is in place, we can create a Guice's injector and retrieve and call a properly wired client with the following code:

```groovy
def injector = Guice.createInjector(new MyModule())

def clientWithCtor = injector.getInstance(ClientWithCtor)
clientWithCtor.go()
```

Instead of the constructor-based approach, I prefer using a setter-based approch. And since Groovy creates getters and setters automagically when you define a property, the code is a bit shorter:

```groovy
class ClientWithSetter {

    @Inject Service service

    void go() {
        service.go()
    }
}
```

And the code for injecting is still the same:

```groovy
def clientWithSetter = injector.getInstance(ClientWithSetter)
clientWithSetter.go()
```

I'm not sure I'd use Guice for a customer project anytime soon, but for small projects where I want a xml-free DI framework, that might do! However, I might be tempted to use Grails' [Spring bean builder](http://grails.org/Spring+Bean+Builder)instead, since it's a pretty cool way to avoid the usual XML-hell when working with Spring. Also, in conclusion, it seems that Groovy's new support for annotations work quite well, as demonstrated also by Romain while [integrating Groovy and JPA](http://www.curious-creature.org/2007/03/25/persistence-made-easy-with-groovy-and-jpa/). I'm sure this will propel **Groovy as the de facto enterprise scripting solution** leveraging the wealth of frameworks and libraries using annotations.