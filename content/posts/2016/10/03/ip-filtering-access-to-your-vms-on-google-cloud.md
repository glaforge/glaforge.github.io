---
title: "IP filtering access to your VMs on Google Cloud"
date: 2016-10-03T17:25:56+01:00
tags:
- google-cloud
- gce
- ratpack
---

How do you filter access to your VMs on Google Cloud Platform? During a discussion with a customer, I was asked this question: only certain IP addresses or a range of IP addresses should have access to a particular VM. Let's see that in action!

Let's assume you already have an account on Google Cloud Platform, but if you don't, don't miss the [$300 credits for a free trial](https://cloud.google.com/free-trial/)! I created a new project, then navigated to the Compute Engine section to create a new VM instance. I used all the default parameters, except that I checked the checkbox for "Allow HTTP traffic", at the bottom of the following screenshot:

![](/img/misc/firewall-create-instance.png)

For the purpose of this demo, I went with allowing traffic first, and then updating the firewall rule, but the best approach (since you don't want to let users access this VM) is to not allow HTTP traffic, and add the right rule afterwards. But I wanted to check that the traffic was flowing through normally, and then updated the rule to check that, indeed, the traffic was filtered.

My VM server isn't doing anything useful at this point, so I should at least run some web app on it! Wearing my [Groovy](http://www.groovy-lang.org/) hat on, I decided to write a quick Groovy script with the [Ratpack](https://ratpack.io/) framework. Let's see how to setup our VM to serve a simple hello world!

Once your VM instance is instantiated, you'll see a little SSH link along your instance in the list of running VMs. You can click on it, and you'll be able to SSH into your running system. So what's the recipe to run a little hello world in Ratpack? I installed OpenJDK 8, [SDKMan](http://sdkman.io/) (to install Groovy, but which needed unzip to be installed for itself), and Groovy, with the following steps:

```bash
sudo su -
apt-get update
apt-get install openjdk-8-jdk
apt-get install unzip
curl -s "https://get.sdkman.io" | bash
source "/root/.sdkman/bin/sdkman-init.sh"
sdk install groovy
exit
mkdir ratpack
cd ratpack
vim hello.groovy
```

Then I created the hello.groovy Ratpack server with the following code:

```groovy
@Grab('io.ratpack:ratpack-groovy:1.4.2')
@Grab('org.slf4j:slf4j-simple:1.7.21')
import static ratpack.groovy.Groovy.ratpack

ratpack {
    serverConfig {
        port 80
    }
    handlers {
        get {
            render "Hello World!"
        }
    }
}
```

And then, I was ready to fire it with:

```bash
groovy hello
```

If you go back to your Google Cloud console, in the list of running instance, you certainly noticed the column showing the "External IP" address of your sever? Now you just need to let your browser open it. So head over to `http://123.123.123.123/` (or whichever IP you got), and you should see the infamous `Hello World!` message!

So far so good, but what we really want is to prevent access to this machine from anywhere, except a particular IP or range of IP addresses. Let's see how to do that next.

Let's go to the `Networking > Firewall rules`:

![](/img/ip-filter/firewall-edit-rule.png)

We're going to update the first rule: `default-allow-http`. Instead of `allowing from any source` with the `0.0.0.0/0` IP range, we're going to use our own custom range. In our case, let's say my own external IP address is `111.111.111.111`, so I'll restrict the range to just this IP with entering `111.111.111.111/0` as `Source IP range`. Let's save the firewall, and let the platform apply that change to our deployment. Once the change has taken place, you'll still be able to access your server at `http://123.123.123.123/`, because only your own IP address is white listed basically. But if you try with any other address (from a co-worker's machine, etc.), normally, nobody else will be able to access the sever beside you.

Done!

And now, for the bonus points! I started playing with that last week, and made the mistake of letting my VM instance running, underutilized. And this afternoon, as I resumed working on this article, I watch the list of instances running, and what do I see? The console telling me my VM instance is under-utilized and that I could save money by using a smaller VM instead! Looks like Google Cloud doesn't want me to waste my money! Sweet!

![](/img/ip-filter/firewall-save-cost.png)