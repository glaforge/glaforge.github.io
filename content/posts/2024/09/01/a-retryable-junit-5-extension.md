---
title: "A retryable JUnit 5 extension for flaky tests"
date: 2024-09-01T16:00:51+02:00
tags:
  - java
  - large-language-model
  - junit
---

As I work a lot with Large Language Models (LLMs), I often have to deal with flaky test cases,
because LLMs are not always consistent and deterministic in their responses.
Thus, sometimes, a test passes maybe a few times in a row, but then, once in a while, it fails.

Maybe some prompt tweaks will make the test pass more consistently,
or using techniques like few-shot prompting will help the model better understand what it has to do.
But in some circumenstances, you can't find ways around those weird failures,
and the sole solution I found was to make a test _retryable_.

If a test fails, let's retry a few more times (2 or 3 times) till it passes.
But if it fails everytime in spite of the retries, then it'll just fail as expected.

I wrote JUnit _Rules_ in the past for such situations, but that was in the JUnit 4 days.
Now, I'm using JUnit 5, and although it's possible to make JUnit 4 tests run under JUnit 5,
I thought it was a great opportunity to try creating a JUnit 5 _extension_,
which is the more powerful mechanism that replaces JUnit 4 rules.

## It all starts with a failing test case

Let's say you have an hypothetical flaky test that fails a few times in a row:

```java
    private static int count = 1;
    @Test
    void test_custom_junit_retry_extension() {
        assertThat(count++).isEqualTo(4);
    }
```

The first 3 executions will see an assertion failure, but the 4th would succeed
as the counter is then equal to `4`.

I'd like to annotate this test method with a custom annotation that indicates the number of times I'm ready to retry that test:

```java
    private static int count = 1;
    @Test
    @ExtendWith(RetryExtension.class)
    @Retry(4)
    void test_custom_junit_retry_extension() {
        assertThat(count++).isEqualTo(4);
    }
```

This `@ExtendedWith()` annotation indicates that I'm registering a JUnit 5 extension.
And `@Retry(4)` is a custom annotation that I've created.

Note that `@ExtendedWith()` can be at the class-level, but it can also live at the method level.

Let's have a look at the `@Retry` annotation:

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface Retry {
    int value() default 3;
}
```

By default, I attempt the test 3 times, if no number is provided for the annotation value.

Now it's time to see how the extension code works:

```java
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestExecutionExceptionHandler;

import java.util.concurrent.atomic.AtomicInteger;

public class RetryExtension implements TestExecutionExceptionHandler {

    private final AtomicInteger counter = new AtomicInteger(1);

    private void printError(Throwable e) {
        System.err.println(
            "Attempt test execution #" + counter.get() +
            " failed (" + e.getClass().getName() +
            "thrown):  " + e.getMessage());
    }

    @Override
    public void handleTestExecutionException(
        ExtensionContext extensionContext, Throwable throwable)
        throws Throwable {

        printError(throwable);

        extensionContext.getTestMethod().ifPresent(method -> {
            int maxExecutions =
                method.getAnnotation(Retry.class) != null ?
                method.getAnnotation(Retry.class).value() : 1;

            while (counter.incrementAndGet() <= maxExecutions) {
                try {
                    extensionContext.getExecutableInvoker().invoke(
                        method,
                        extensionContext.getRequiredTestInstance());
                    return;
                } catch (Throwable t) {
                    printError(t);

                    if (counter.get() >= maxExecutions) {
                        throw t;
                    }
                }
            }
        });
    }
}
```

Let's go through the code step by step:
* The extension has a counter to count the number of executions
* a `printError()` method is used to report the assertion failure or exception
* The class implements the `TestExecutionExceptionHandler` interface
* That interface requires the method `handleTestExecutionException()` to be implemented
* This method is invoked when a test throws some exception
* If an exception is thrown, let's see if the method is annotated with the `@Retry` annotation
* and let's retrieve the number of attempts demanded by the developer
* Then let's loop to do some more executions of the test method, until it passes or up to the number of attempts

## Missing standard JUnit 5 extension?

I thought a `@Retry` extension would be pretty common, and that it would be integrated in JUnit 5 directly.
Or at least, some library would provide common JUnit 5 extensions?
But my search didn't yield anything meaningful.
Did I overlook or miss something?

At least now, I have a solution to work around some flaky tests, thanks to this retryable extension!

## Going further

If you want to learn more about JUnit 5 extensions,
there were a few resources that helped me develop this extension.
First of all, two artciles from Baeldung on
[Migrating from JUnit 4 to JUnit 5](https://www.baeldung.com/junit-5-migration)
to understand the changes since JUnit 4, and this
[Guide to JUnit 5 Extensions](https://www.baeldung.com/junit-5-extensions).
And of course, the JUnit 5 documentation on
[extensions](https://junit.org/junit5/docs/current/user-guide/#extensions).