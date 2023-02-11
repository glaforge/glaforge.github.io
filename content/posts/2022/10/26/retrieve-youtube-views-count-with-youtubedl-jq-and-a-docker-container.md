---
title: "Retrieve YouTube views count with youtubeDL, JQ, and a Docker container"
date: 2022-10-26T14:53:39+01:00
tags:
- youtube
- advocacy
- docker
- containers
- jq
---

I wanted to track the number of views, and also likes, of some YouTube videos I was featured in. 
For example, when I present a talk at a conference, often the video becomes available at a later time, and I'm not the owner of the channel or video. 
At first, I wanted to use the [YouTube Data API](https://developers.google.com/youtube/v3), 
but I had the impression that I could only see the stats of videos or channels I own, 
however I think I might be wrong, and should probably revisit this approach later on.

My first intuition was to just scrape the web page of the video, but it's a gobbledygook of JavaScript, 
and I couldn't really find an easy way to consistently get the numbers in that sea of compressed JavaScript. 
That's when I remembered about the [youtube-dl project](https://youtube-dl.org/). 
Some people think of this project as a way to download videos to watch offline, but it's also a useful tool that offers lots of metadata about the videos. 
You can actually even use the project without downloading videos at all, but just fetching the metadata.

For example, if I want to get the video metadata, without downloading, I can launch the following command, after having installed the tool locally:

```bash
youtube-dl -j -s https://www.youtube.com/watch?v=xJi6pldZnsw
```

The `-s` flag is equivalent to `--simulate` which doesn't download anything on disk.

And the `-j` flag is the short version of `--dump-json` which returns a big JSON file with lots of metadata, including the view count, 
but also things like links to transcripts in various languages, chapters, creator, duration, episode number, and so on and so forth.

Now, I'm only interested in view counts, likes, dislikes. 
So I'm using [jq](https://stedolan.github.io/jq/) to filter the big JSON payload, and create a resulting JSON document with just the fields I want.

```bash
jq '{"id":.id,"title":.title,"views":.view_count,"likes":(.like_count // 0), "dislikes":(.dislike_count // 0)}'
```

This long command is creating a JSON structure as follows:

```json
{
 "id": "xJi6pldZnsw",
 "title": "Reuse old smartphones to monitor 3D prints, with WebRTC, WebSockets and Serverless by G. Laforge",
 "views": 172,
 "likes": 6,
 "dislikes": 0
}
```

The `.id`, `.title`, `.view_count`, etc, are searching for that particular key in the big JSON documentation. 
The `// 0` notation is to avoid null values and return 0 if there's no key or if the value associated with the key is null. 
So I always get a number --- although I noticed that sometimes, the likes are not always properly accounted for, but I haven't figured out why.

So far so good... but if you pass a URL of a video with a playlist, or if you pass a playlist URL, it will fetch all the metadata for all the videos. 
This is actually useful: you can even create your own playlists for the videos you want to track. 
There's one odd thing happening though when using youtube-dl with such URLs: it will output a JSON document per line for each video. 
It's not returning an array of those documents. So I found a nice trick with jq to always put the results within an array, whether you pass a URL for a single video, or a video with a playlist:

```bash
​​jq -n '[inputs]'
```

So I'm piping the `youtube-dl` command, the first and second `jq` commands.

Rather than installing those tools locally, I decided to containerize my magic commands.

Let me first show you the whole `Dockerfile`:

```Dockerfile
FROM ubuntu:latest
RUN apt-get update && apt-get -y install wget
    && wget https://yt-dl.org/latest/youtube-dl -O /usr/local/bin/youtube-dl
    && chmod a+rx /usr/local/bin/youtube-dl
    && apt-get -y install python3-pip jq 
    && pip3 install --upgrade youtube-dl
COPY ./launch-yt-dl.sh
RUN chmod +x /launch-yt-dl.sh
ENTRYPOINT ["./launch-yt-dl.sh"]
```

And also this bash script mentioned in the Dockerfile:

```bash
#!/bin/bash\
youtube-dl -j -s -- "$@" | jq '{"id":.id,"title":.title,"views":.view_count,"likes":(.like_count // 0), "dislikes":(.dislike_count // 0)}' | jq -n '[inputs]'
```

I went with the latest ubuntu image. I ran some apt-get commands to install wget to download the latest youtube-dl release, Python 3's pip to upgrade youtube-dl. 
There's no recent apt module for youtube-dl, hence why we have those steps together.

What's more interesting is why I don't have the youtube-dl and jq commands in the Dockerfile directly, but instead in a dedicated bash script. 
Initially I had an `ENTRYPOINT` that pointed at youtube-dl, so that arguments passed to the docker run command would be passed as arguments of that entrypoint. 
However, after those commands, I still have to pipe with my jq commands. And I couldn't find how to do so with `ENTRYPOINT` and `CMD`. 
When raising the problem on [twitter](https://twitter.com/glaforge/status/1584800385256280064), 
my friends [Guillaume Lours](https://twitter.com/glours/status/1584810960136683521) and [Christophe Furmaniak](https://twitter.com/cfurmaniak/status/1584845647647506432) pointed me in the right direction with this idea of passing through a script.

So I use the `$@` bash shortcut, which expands as arguments `$1 $2 $3`, etc. in case there are several videos passed as arguments. 
I have the jq pipes after that shortcut. 
But for my `ENTRYPOINT`, it's fine, the args are passed directly to it, and it's that intermediary script that weaves the args in my longer command.

Next, I just need to build my Docker container:

```bash
docker build . -t yt-video-stat
```

And then run it:

```bash
docker run --rm -it yt-video-stat "https://www.youtube.com/watch?v=xJi6pldZnsw"
```

And voila, I have the stats for the YouTube videos I'm interested in!