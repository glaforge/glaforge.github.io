---
title: "CVS and SSH2, not so easy"
date: 2004-01-13T00:00:00.000+01:00
tags: [geek, groovy]

similar:
  - "posts/2004/04/30/intellij-ssh2-finally-finds-its-way.md"
  - "posts/2004/05/07/tip-o-the-day-ssh-on-windows.md"
  - "posts/2011/09/19/groovy-on-github.md"
---

Yesterday, I was granted commit rights on the [Groovy](http://groovy.codehaus.org/) source tree, at [Codehaus](http://www.codehaus.org/). Of special interest for me :

*   I developed a utility class which helps Groovy create new Readers for text files with the correct encoding already set (I'm really keen on charset/encodings issues),
*   Adding some new Groovy methods to the core JDK classes,
*   Working on an automatic documentation generation engine "a la" Javadoc, so that it may be possible to browse all the methods that have been added to the core JDK classes.

James asked me if I wanted a CVS access to deal with those matters of interest instead of tunneling through him, and I gladfully accepted. But, alas, here starts the nightmare...

So far, I was a happy Windows user, and a happy IntelliJ user, but I'm starting to change my mind. It seems that IntelliJ does not speak SSH2. It's clever enough to deal with SSH1, but not SSH2 so far (as far as I know, it that's not the case, please, please tell me how that works!) Thus, I've had to do everything through the good ol'command line. I've set up a [page on Codehaus](http://wiki.codehaus.org/general/HowToDevelopWithCygwinUnderWindows) about that. Read on the steps to follow that I have reproduced here...

1.  First of all, you have to install CYGWIN on your platform: download it here and don't forget to check the options OpenSSH (will be needed for key pair generation) and CVS (you know how useful it may be), let's assume you've installed it in c:\\cygwin which is the default installation directory
2.  Add c:\\cygwin\\bin to your system path
3.  Open up a bash terminal and type ssh-keygen -t dsa to create an SSH key pair with the default name id\_dsa and id\_dsa.pub, and don't forget your pass phrase, otherwise your keys will be useless, (put both keys in c:\\cygwin\\home\\jsmith\\.ssh)
4.  Give Bob the despot (or the person responsible for the task) your public key (id\_dsa.pub) so that he installs it on the CVS server
5.  Once Bob tells you your account is created and your key installed, type eval \`ssh-agent\` in a terminal (it will tell you it's running in background with pid xxx)
6.  Type ssh-add to add your SSH key to the ssh-agent you've just launched to take care of the SSH connection and authentication
7.  In order to test your connection, you can follow this optional step : type ssh jsmith@cvs.codehaus.org to test if the connection succeeds then logout. If it fails, you're in trouble! Review all the steps carefully! eventually, export CVS\_RSH=ssh to tell CVS that you're using CVS through SSH
8.  You're done, now use cvs commands like cvs -d :ext:jsmith@cvs.codehaus.org:/scm/cvs -co groovy to checkout the latest flavour of groovy (or whatever other project)

So now, you can call yourself a Codehaus commiter