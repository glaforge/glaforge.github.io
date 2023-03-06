---
title: "Groovy on instantserver.io thanks to GVM"
date: "2013-06-18T00:00:00.000+02:00"
tags: [geek, groovy]
---

I recently came across [InstantServer.io](http://instantserver.io/), a nice little service that allows you to instantiate an Ubuntu server for testing, for 35 minutes, on Amazon EC2. You click on the green button, and you're given an account and a password, as well as the details to connect onto the machine through SSH.  

Please note that the service seems to be victim of its success, as requesting a new server takes more and more time it seems.  
  
I immediately thought about installing and launching Groovy on those remote servers, using [GVM](http://gvmtool.net/). However, there's no "unzip" command installed, and there's no JDK as well. So there are a few extra steps to be taken. I wanted to blog about the details (which I'm actually doing now!), but Tim Yates beat me to it with his detailed instructions!  

So my task is now simplified, and I'll simply copy the instructions here, thanks Tim!  

*   Create an instant server at [http://instantserver.io/](http://instantserver.io/)
*   Log into it using the username/password they supply
*   Run:

    ```bash
    sudo apt-get install unzip
    ```

*   And when that's done, run:

    ```bash
    sudo apt-get install openjdk-7-jre-headless export JAVA\_HOME=/usr/lib/jvm/java-7-openjdk-amd64
    ```
  
*   Then, install GVM:

    ```bash
    curl -s get.gvmtool.net | bash
    ```
  
*   And source the GVM script:

    ```bash
    source "/home/ubuntu/.gvm/bin/gvm-init.sh"
    ```

*   Install Groovy with GVM:

    ```bash
    gvm install groovy
    ```
  
*   And test:

    ```bash
    groovy -e "println 'Hello'"
    ```
  
Voilà !