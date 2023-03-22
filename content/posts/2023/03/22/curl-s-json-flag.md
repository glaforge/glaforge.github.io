---
title: "cURL's --json flag"
date: 2023-03-22T07:14:06+01:00
tags:
- apis
- rest
- tips
---

As cURL was celebrating its [25th birthday](https://daniel.haxx.se/blog/2023/03/20/twenty-five-years-of-curl/), I was reading Daniel Stenberg's story behind the project, and discovered a neat little feature I hadn't heard of before: the `--json` flag! Daniel even [blogged](https://daniel.haxx.se/blog/2022/02/02/curl-dash-dash-json/) about it when it landed in cURL 7.82.0 last year.

So what's so cool about it? If you're like me, you're used to post some JSON data with the following verbose approach:

```bash
curl --data '{"msg": "hello"}' \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    https://example.com
```

You have to pass the data, and also pass headers to specify the content-type.
You can make it slightly shorter with the one-letter flags:

```bash
curl -d '{"msg": "hello"}' \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    https://example.com
```

But with the recent addition of this flag, it's much shorter, as you don't have to specify the mime types:

```bash
curl --json '{"msg": "hello"}' https://example.com
```

It's available since version 7.82.0, and on my Mac laptop, I have version 7.86.0.

For reference, here's the excerpt of the manual that gives the details about the `--json` flag:

```
--json <data>
    (HTTP) Sends the specified JSON data in a POST request to the
    HTTP server. --json works as a shortcut for passing on these
    three options:

    --data [arg]
    --header "Content-Type: application/json"
    --header "Accept: application/json"

    There is no verification that the passed in data is actual
    JSON or that the syntax is correct.

    If you start the data with the letter @, the rest should be a
    file name to read the data from, or a single dash (-) if you
    want curl to read the data from stdin. Posting data from a file
    named 'foobar' would thus be done with --json @foobar and to
    instead read the data from stdin, use --json @-.

    If this option is used more than once on the same command line,
    the additional data pieces will be concatenated to the previous
    before sending.

    The headers this option sets can be overridden with --header
    as usual.

    --json can be used several times in a command line

    Examples:

    curl --json '{ "drink": "coffe" }' https://example.com
    curl --json '{ "drink":' --json ' "coffe" }' https://example.com
    curl --json @prepared https://example.com
    curl --json @- https://example.com < json.txt
```