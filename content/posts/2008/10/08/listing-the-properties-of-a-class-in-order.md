---
title: "Listing the properties of a class in order"
date: 2008-10-08T00:00:00.000+02:00
tags: [groovy]
---

In the same vein as my recent article on [how to know the variables which are bound or not in a script](http://glaforge.free.fr/weblog/index.php?itemid=247), a user asked [how he could list in order the properties defined in a class](http://markmail.org/message/pmg6h5wfpclwqemd). Unfortunately, using MyClass.metaClass.properties won't guarantee the order in which properties were created. But reusing the technique in my previous article, one can visit the Groovy AST, in order, and just look at the property definitions, fill an ordered list of these properties, and return it once the traversal is finished. Here's what I came up with:

```groovy
import org.codehaus.groovy.ast.expr.*
import org.codehaus.groovy.ast.stmt.*
import org.codehaus.groovy.ast.*
import org.codehaus.groovy.control.*
import org.codehaus.groovy.classgen.*
import java.security.CodeSource

def scriptText = """
class Customer {
    def name
    def phone
    def address1
    def address2
}
"""

// we define a custom visitor that traverses the AST just to look at class properties
class PropertyVisitor extends ClassCodeVisitorSupport {
    def orderedProperties = []
    void visitProperty(PropertyNode node) {
        orderedProperties << node.name
    }
 
    protected SourceUnit getSourceUnit() {
        return source;
    }
}

// we define our custom PrimaryClassNodeOperation
// to be able to hook our code visitor
class CustomSourceOperation extends CompilationUnit.PrimaryClassNodeOperation {
    CodeVisitorSupport visitor
    void call(SourceUnit source, GeneratorContext context, ClassNode classNode) throws CompilationFailedException {
        classNode.visitContents(visitor)
    }
}

// we use our own class loader to add our phase operation
class MyClassLoader extends GroovyClassLoader {
    CodeVisitorSupport visitor
    protected CompilationUnit createCompilationUnit(CompilerConfiguration config, CodeSource source) {
        CompilationUnit cu = super.createCompilationUnit(config, source)
        cu.addPhaseOperation(new CustomSourceOperation(visitor: visitor), Phases.CLASS_GENERATION)
        return cu
    }
}

def visitor =  new PropertyVisitor()
def myCL = new MyClassLoader(visitor: visitor)
// simply by parsing the script with our classloader
// our visitor will be called and will visit the properties of the class in order
def script = myCL.parseClass(scriptText)

assert ['name', 'phone', 'address1', 'address2'] == visitor.orderedProperties
```

Seeing that such AST analysis can be useful from times to times, I even think we could add some GroovyShell#parseWithVisitor(myscript, myvisitor) to avoid writing the same boiler-plate code of setting up the classloader, compilation unit, and so on. This could be pretty handy. After a discussion with Jochen, we even thought some kind of debugging visitor could be handy, where you'd visit the AST interactively, executing some code on certain nodes, and the tool would record everything, so that you can later reuse that visit. This could be a fun little experiment, and a handy tool when someone needs to do some analysis of the code.