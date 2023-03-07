---
title: "Lucene's fun"
date: "2005-05-02T00:00:00.000+02:00"
tags: [groovy]
---

I played with Lucene today to index a CSV file representing the Unicode characters metadata. Lucene is so easy and fun to use, that's really the kind of libraries I like very much. I took some inspiration from my friend Jeremy who [played with Lucene and Groovy](http://javanicus.com/blog2/items/178-index.html) recently, by translating into Groovy some examples of [Lucene in Action](http://www.lucenebook.com/).

I've always been interested in i18n issues, charset/encoding malarkey, and so on. It's always a pain to deal with... but it's pretty damn interesting, and that's often a problem that native English speakers overlook.

In a previous article, you learned how to remove diacritical marks from strings (in particular [removing accents]({{< ref "/posts/2005/04/27/how-to-remove-accents-from-a-string" >}})), and I wanted to know how the JDK or IBM's ICU4J know how to decompose strings in their canonical form. Of course that's done through some data file containing that information. You can find [such a file](http://www.unicode.org/Public/UNIDATA/UnicodeData.txt) on the [Unicode website](http://www.unicode.org/). It contains information on each character regarding how to transform it to lowercase or uppercase, how to decompose it in its canonical form, or to learn its standard Unicode name.

I took this file, indexed its content and fields, and could easily use Lucene's search capabilities in no time to discover more about Unicode characters. As usual, here are some code snippets in Groovy!

So first of all, let's create an index out of that Unicode data file:

```groovy
import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.index.IndexWriter

def writer = new IndexWriter(new File("index"), new StandardAnalyzer(), true)

new File("UnicodeData.txt").eachLine { line ->
    def ucharFields = line.split(';', 15)
    if (ucharFields[0].length() == 4) {
        def doc = new Document()
        doc.add(Field.Keyword("code", ucharFields[0]))
        doc.add(Field.Text("name", ucharFields[1]))
        doc.add(Field.Keyword("category", ucharFields[2]))
        doc.add(Field.Keyword("clazz", ucharFields[3]))
        doc.add(Field.Keyword("bidi", ucharFields[4]))
        doc.add(Field.Keyword("decomposition", ucharFields[5]))
        doc.add(Field.Keyword("numeric", ucharFields[8]))
        doc.add(Field.Keyword("mirrored", ucharFields[9]))
        doc.add(Field.Keyword("uppercase", ucharFields[12]))
        doc.add(Field.Keyword("lowercase", ucharFields[13]))
        doc.add(Field.Keyword("titlecase", ucharFields[14]))
        writer.addDocument(doc)
    }
}
writer.optimize()
writer.close()
```

For each line of the document representing a character, I split it using ";" as the delimiter for the fields of the CSV. And I create a Lucene Document and adds some fields and content. You'll notice the different fields I'm interested in: like the name of the character, its uppercase or lowercase equivalent, etc. You can find [more information](http://www.unicode.org/Public/UNIDATA/UCD.html) about those fields in case you feel like learning more about that.

If you downloaded Lucene's jar and put both the jar and the UnicodeData.txt file in the same directory as your scripts, you can use the following command-line to create your index:

```bash
groovy -cp lucene-1.4.3.jar UIndexer.groovy
```

It will take some time, but it will create an index subdirectory containing Lucene's index.

Now that you have your index ready, you can query it with the following script:

```groovy
import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.queryParser.QueryParser
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.store.FSDirectory

def indexDir = new File("index")
def q = args[0]

def fsDir = FSDirectory.getDirectory(indexDir, false)
def is = new IndexSearcher(fsDir)

def queryParser = new QueryParser("name", new StandardAnalyzer())
def query = queryParser.parse(q)

def start = new Date().time
def hits = is.search(query)
def end = new Date().time

println "Found ${hits.length()} characters in ${end - start}ms:\n"

for ( i in 0 ..< hits.length() ) {
    def doc = hits.doc(i)
    println("${doc['code']} () -> ${doc['name']}")
    println("       category: ${doc['category']}")
    println("          class: ${doc['clazz']}")
    println("           bidi: ${doc['bidi']}")
    println("  decomposition: ${doc['decomposition']}")
    println("        numeric: ${doc['numeric']}")
    println("       mirrored: ${doc['mirrored']}")
    println("      uppercase: ${doc['uppercase']}")
    println("      lowercase: ${doc['lowercase']}")
    println("      titlecase: ${doc['titlecase']}")
    println("")
}
```

It opens the index, and takes a query as its first command-line argument. It parses the query, and searches the index, and in the end, it will return some useful results.

For instance, you can make some queries to know which characters contain the word cedilla in their name:

```bash
groovy -cp lucene-1.4.3.jar USearcher.groovy cedilla
```

And you can also search particular fields:

```bash
groovy -cp lucene-1.4.3.jar USearcher.groovy "category:Lu"
```

Those queries will print all the corresponding Unicode characters you're looking for.

As you can see through those two samples, creating the index, or searching the index is really simple and straightforward. Lucene does it jobs fairly well, and I just love it for that.