---
title: "Knowing which variables are bound or not in a Groovy script"
date: 2008-08-28T00:00:00.000+02:00
tags: [groovy]
---

A few weeks ago on the Groovy mailing-lists, a user wanted to know a way to find which variables were bound or not in a Groovy script, in the context of some custom rules engine. In a Groovy script, names that are not local variables, method parameters, etc. can come from the "binding" associated with a script. This is the way we "inject" variables and values into a script. A usual technique for retrieving variables lazily (for instance when you don't want to put in the binding a variable that is heavy to compute or retrieve) is to create a custom Binding class and override the methods for getting variables from it. But if you really really want to know before executing the scripts (to avoid any side effect upon execution) what variables are bound or not, I've come up with the following script which lists the bound and unbound variables, without having to execute the script.

```groovy
import org.codehaus.groovy.ast.expr.*
import org.codehaus.groovy.ast.stmt.*
import org.codehaus.groovy.ast.*
import org.codehaus.groovy.control.*
import org.codehaus.groovy.classgen.*
import java.security.CodeSource

// example script to analyze
def scriptText = '''
   def foo(args) { args && !d }
   Closure c = { 4 }
   int b = 6
   try {
       println(a + 5 - b + c() / foo(a))
   } catch (Throwable t) {
       println b
   } finally {
       throw d
   }
   assert b
'''

// define a visitor that visits all variable expressions
class VariableVisitor extends ClassCodeVisitorSupport {
   def bound = [] as SortedSet
   def unbound = [] as SortedSet
   void visitVariableExpression(VariableExpression expression) {
       // we're not interested in some special implicit variables
       if (!(expression.variable in ['args', 'context', 'this', 'super'])) {
           // thanks to this instanceof
           // we know if the variable is bound or not
           if (expression.accessedVariable instanceof DynamicVariable) {
               unbound << expression.variable
           } else {
               bound << expression.variable
           }
       }
       super.visitVariableExpression(expression)
   }

   protected SourceUnit getSourceUnit() {
       return source;
   }
}

// we define our custom PrimaryClassNodeOperation
// to be able to hook our code visitor
class CustomSourceOperation extends CompilationUnit.PrimaryClassNodeOperation {
   CodeVisitorSupport visitor
   void call(SourceUnit source, GeneratorContext context, ClassNode
classNode) throws CompilationFailedException {
       classNode.visitContents(visitor)
   }
}

// we use our own class loader to add our phase operation
class MyClassLoader extends GroovyClassLoader {
   CodeVisitorSupport visitor
   protected CompilationUnit
createCompilationUnit(CompilerConfiguration config, CodeSource source)
{
       CompilationUnit cu = super.createCompilationUnit(config, source)
       cu.addPhaseOperation(new CustomSourceOperation(visitor:
visitor), Phases.CLASS_GENERATION)
       return cu
   }
}

def visitor =  new VariableVisitor()
def myCL = new MyClassLoader(visitor: visitor)
// simply by parsing the script with our classloader
// our visitor will be called and will visit all the variables
def script = myCL.parseClass(scriptText)

println "Bound variables:   ${visitor.bound}"
println "Unbound variables: ${visitor.unbound}"
```