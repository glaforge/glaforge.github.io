---
title: "Timing a closure in Groovy"
date: 2004-02-26T00:02:00.000+01:00
tags: [groovy]

similar:
  - "posts/2012/04/23/run-a-groovy-script-in-vi.md"
---

When you want to make some optimizations to your code, you often use the good old System.currentTimeMillis() method to time certain parts of your application. I wanted to do a similar thing when hacking some Groovy scripts recently, and the idea came to me that I could simply create a timing closure! So here it is, for your eyes only:

```groovy
timer = { closure ->
    start = System.currentTimeMillis()
    closure()
    println System.currentTimeMillis() - start
}
```

Then you can use your brand new timing closure:

```groovy
timer { "sleep 10".execute().waitFor() }
```

That's not rocket science, but closures are really a powerful feature. Everyday I wish Java had such a feature built-in.