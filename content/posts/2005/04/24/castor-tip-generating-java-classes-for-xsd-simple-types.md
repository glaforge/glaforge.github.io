---
title: "Castor tip: generating Java classes for XSD simple types"
date: 2005-04-24T00:00:00.000+02:00
tags: [geek, java, orm, tips]
---

At work, I'm using [Castor](http://castor.codehaus.org/) XML to Java binding to marshall/unmarshall messages in my Web Services, inside a custom framework (Struts, OJB, JAXM, etc). I have defined my messages as XSD Schemas, and I'm using [Castor's Maven plugin](http://maven.apache.org/reference/plugins/castor/) to auto-generate my Java classes at build time.

All is good and well... Hmm, almost! Castor's SourceGenerator generates Java classes for complex types and elements, but not for simple types, and unfortunately, I badly needed to marshall those simple types as well. But fortunately, I've found a little trick to transform simple types to complex types, so that Castor can generate the associated Java classes, with its useful and handy marshall() methods.

Let's take a little example. Say you have a simple type which is just a restriction upon strings:

```xml
<xs:simpletype name="ApplicationType">
  <xs:restriction base="xs:string">
    <xs:minlength value="1"></xs:minlength>
    <xs:maxlength value="32"></xs:maxlength>
  </xs:restriction>
</xs:simpletype>
```

This type won't give you a Java class, thus you'll have to transform it into a complex type, and here is how you can do that:

```xml
<xs:simpletype name="String32">
  <xs:restriction base="xs:string">
    <xs:minlength value="1"></xs:minlength>
    <xs:maxlength value="32"></xs:maxlength>
  </xs:restriction>
</xs:simpletype>

<xs:complextype name="ApplicationType">
  <xs:simplecontent>
    <xs:extension base="ths:String32"></xs:extension>
  </xs:simplecontent>
</xs:complextype>
```

Though I'm happy with that trick, I've however filed a [JIRA issue](http://jira.codehaus.org/browse/CASTOR-1079) in Castor's bugtracker, so that they can add a new option to allow us to generate Java classes for simple types too.