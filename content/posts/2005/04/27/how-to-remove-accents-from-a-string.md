---
title: "How to remove accents from a String"
date: "2005-04-27T00:00:00.000+02:00"
tags: [java, tips]
---

My little puzzle of the day is to find how to remove accents from a String. There are different alternatives, different strategies, but none really suits my needs -- or my taste.

The naive approach is to use `String.replace()` to replace manually all characters, with a correspondance table, like "é" should be replaced with "e", etc. That's fine for some languages I know, like French or German, or even some latin languages, since we share the same alphabet. But with Russian, Greek, or some asian languages, my knowledge won't suffice! So I can't reliably produce a big hashtable with that knowledge. What a pity!

The other two approaches are using a `Normalizer` class which decomposes a string in its smallest constituents. Thus, a character with an accent is composed of a non-accentuated character and a diacritical mark. Then, once I have this expanded string, I can easily remove all characters representing a diacritical mark, because they all belong to a certain Unicode category.

Sun's JDK contains a non-public class called sun.text.Normalizer (which should be added to the JDK's public APIs), and [IBM's ICU](http://icu.sourceforge.net/) (International Components for Unicode) package also contains such a class. The following function will return a string without accents or other marks:

```java
public String removeAccents(String text) {
    return Normalizer.decompose(text, false, 0)
                     .replaceAll("\p{InCombiningDiacriticalMarks}+", "");
}
```

Using Sun's internal class is not a very portable solution, but using IBM's 3MB-gorilla JAR may be overkill for just removing accents. But after all, what are 3 megabytes when your machines have gigas of RAM and disk space? Would it slow your apps down? Probably not.

Does somebody know of another way to remove accents from a String?

**Update (2011/07/28):** Sun's JDK 6 now includes a Normalizer class. So for example, if you want to transform the accentuated letters to their non-accentuated form, you can do this:

```java
Normalizer.normalize(title, Normalizer.Form.NFD)
          .replaceAll("\p{InCombiningDiacriticalMarks}+", "")
```

Update (2012/03/14): George suggests in the comments a better category: \\\\p{IsM} which covers more combining marks than just accents.