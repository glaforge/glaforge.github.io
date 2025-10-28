---
title: "Mac trick: change Time Machine backup interval"
date: 2012-03-14T00:00:00.000+01:00
tags: [geek, macos]
---

If you think Time Machine is backing up your Mac too often, you can customize the interval between two automatic scheduled backups. I found that trick on [MacYourself](http://www.macyourself.com/2010/02/21/how-to-change-time-machine-backup-interval-backup-manually/).  

Open up a Terminal, and change the value, in seconds, of the interval (here 7200 seconds == 2 hours instead of the standard one hour):  

```bash
sudo defaults write /System/Library/LaunchDaemons/com.apple.backupd-auto StartInterval -int 7200
```

**Update:** This doesn't seem to work on Mac OS X Lion, although it worked in previous versions (like Leopard). Till we find a good workaround, Thomas, in the comments, suggested looking at this nice little utility: [Time Machine Scheduler](http://www.klieme.com/TimeMachineScheduler.html).