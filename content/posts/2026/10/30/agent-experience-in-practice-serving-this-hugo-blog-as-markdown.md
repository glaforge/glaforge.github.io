---
title: "Agent eXperience (AX) in practice: Serving this Hugo blog as Markdown"
description: "Improving the Agent eXperience (AX) of a Hugo blog on GitHub Pages by serving clean Markdown twin files for every article alongside llms.txt."
date: 2026-10-30T17:05:00+01:00
image: /img/gemini/agent-experience-hugo-markdown-banner.jpg
tags:
  - ai-agents
  - agent-experience
  - generative-ai
  - large-language-models
  - web
  - hugo
  - developer-relations
  - advocacy
similar:
  - "posts/2025/03/03/llms-txt-to-help-llms-grok-your-content.md"
---

Back in March 2025, I added [`llms.txt` and `llms-full.txt` support to this blog]({{< ref "/posts/2025/03/03/llms-txt-to-help-llms-grok-your-content.md" >}}).
The goal was to give Large Language Models a structured index of all my articles, plus a single consolidated file (`llms-full.txt`) that I could drop into Gemini's large context window to ask questions across everything I had ever written.

Since then, the way developers and AI tools interact with web content has evolved quite a bit.
Instead of manually uploading a 700k-token file into a chat prompt, we now rely on autonomous coding agents (like [Antigravity](https://antigravity.google/), Claude Code, GitHub Copilot, Cursor, or OpenCode) that browse the web and fetch individual documentation pages or blog posts on the fly.
Today, I took another step to make this blog friendlier to those agents: every article now has a clean Markdown twin (`.md`), linked from the HTML header and from `llms.txt`.

> [!NOTE]
> You can view the Markdown version of this very article at [agent-experience-in-practice-serving-this-hugo-blog-as-markdown.md](/posts/2026/10/30/agent-experience-in-practice-serving-this-hugo-blog-as-markdown.md), or inspect the updated site index at [llms.txt](/llms.txt).

## The Rise of Agent eXperience (AX)

Before looking at the Hugo configuration, it is worth stepping back to look at the broader shift behind this change: **Agent eXperience (AX)**.

In early 2025, Netlify CEO Mathias Biilmann coined the term *Agent Experience* to describe the holistic experience AI agents have as users of a product, platform, or website.
In an interview with Richard MacManus on The New Stack ([Beyond DX: Developers Must Now Learn Agent Experience (AX)](https://thenewstack.io/beyond-dx-developers-must-now-learn-agent-experience-ax/)), Biilmann noted that over a thousand sites were already being deployed to Netlify every day directly from ChatGPT and coding agents, requiring completely different authentication, handoff, and documentation flows than those built for humans alone.

Several recent articles have explored what AX means in practice for software teams and content creators:

- [Agents: The new, New Kingmakers](https://redmonk.com/sogrady/2026/09/16/new-new-kingmakers/) by Stephen O'Grady at RedMonk revisits his classic *New Kingmakers* thesis. A decade ago, developers became the decision-makers choosing which languages, libraries, and databases succeeded. Today, coding agents increasingly make those technology choices directly from a prompt (choosing frameworks, dependencies, and APIs on the developer's behalf).
- [What's the Difference between Generative Engine Optimization (GEO) & Agent Experience (AX)?](https://redmonk.com/kholterhoff/2026/08/24/ax-v-geo/) by Kate Holterhoff (also at RedMonk) draws a helpful boundary between marketing-driven GEO and engineering-driven AX: *"GEO gets you mentioned. AX determines what happens next."* Getting cited in an AI summary is one thing; making sure an agent can actually read your docs or operate your tool without failing is another.
- [Agent experience is the new developer experience](https://www.builder.io/blog/agent-experience) by Alice Moore at Builder.io looks at AX inside codebases. Because coding agents are stateless, they need minimal, transparent context and deterministic verification loops rather than bloated prompts.
- [Stop Getting Good at Protocols, Get Good at Agent Experience](https://www.oreilly.com/radar/stop-getting-good-at-protocols-get-good-at-agent-experience/) by Sean Roberts on O'Reilly Radar warns teams against chasing the "protocol of the month" (whether MCP, A2A, or skills) as a strategy in itself, instead of focusing on how reliably agents can discover, understand, and act on your services.

### AX in Developer Relations

This shift hits particularly close to home for those of us working in Developer Relations.
My friend [Patrick Chanezon](https://blog.chanezon.com/), who leads Developer Relations at Microsoft, wrote a thoughtful piece last November on [Reinventing Developer Relations in the age of AI Agents](https://blog.chanezon.com/2025/11/07/devrel-evolution-with-ai-agents.html).
In it, Patrick outlined three dimensions for the evolution of DevRel:
1. Helping developers transition from individual contributors to "managers of agents".
2. Transforming our own DevRel workflows with AI.
3. Treating AI agents as a primary user persona of our developer services and documentation, which means investing in Agent Experience (AX).

As Patrick pointed out, you cannot improve what you do not measure.
Just last week, he followed up with [Measuring Agent Experience: open sourcing the platform we use, Project Scope, and an AX practitioner handbook](https://blog.chanezon.com/2026/10/19/ax-handbook-and-project-scope.html), announcing the open-sourcing of Microsoft's *AX Practitioner Playbook* and *Scope*, a Kubernetes-based evaluation harness to benchmark how coding agents perform multi-turn tasks across different harnesses, models, skills, and MCP servers.

## Why `llms.txt` Alone Wasn't Enough

In her RedMonk article on AX vs. GEO, Kate Holterhoff pointed out an uncomfortable truth about `llms.txt`: while it was proposed as a discovery standard, web server traffic analysis (such as the study by Evil Martians) showed that very few AI agents automatically probe `/llms.txt` on their own when asked to read a page.

In practice, when a developer pastes a blog post URL into Claude Code, Cursor, or [Antigravity CLI](https://antigravity.google/product/antigravity-cli/) (or when an agent follows a link from a search tool), the agent fetches that specific URL directly.
Until today, my `/llms.txt` file also linked to the HTML URLs of my posts.
When an agent fetched one of those URLs, it received the full HTML document: header menus, social links, sidebar widgets, lightbox markup, and tens of kilobytes of inline syntax-highlighting `<span>` tags generated by Hugo.

Two resources inspired me to fix this:
- [acceptmarkdown.com](https://acceptmarkdown.com/), a guide and testing tool created by Ben Word that tracks which AI agents send `Accept: text/markdown` headers (currently supported by Claude Code, GitHub Copilot Chat and CLI, Cursor, OpenCode, and OpenClaw) or follow `<link rel="alternate" type="text/markdown">` tags (used by OpenAI's Codex CLI).
- Marko Denic's article, [How to Serve Markdown to AI Agents (and Why)](https://markodenic.com/serve-markdown-to-ai-agents/), which explains how to publish a `.md` twin for every page and configure HTTP content negotiation.

How much difference does serving clean Markdown make on this blog?
Because Hugo's syntax highlighter (`noClasses = true`) wraps every token of every code snippet in `<span style="...">` tags, the HTML pages are much heavier than the underlying prose and code.
Here is the raw size comparison on five recent articles from this blog:

| Article | HTML (`index.html`) | Markdown (`.md`) | Reduction |
| :--- | ---: | ---: | ---: |
| [The eMudhra CA Compromise]({{< ref "/posts/2026/10/21/the-emudhra-ca-compromise-why-your-jvm-is-vulnerable-and-how-to-fix-it.md" >}}) | 69.1 KB | 23.5 KB | **2.9x** |
| [Crafting a Devoxx Schedule with Gemini]({{< ref "/posts/2026/09/28/crafting-a-devoxx-schedule-with-gemini-langchain4j-and-micronaut.md" >}}) | 57.0 KB | 16.8 KB | **3.4x** |
| [Gemini 3.8 Flash TTS with Java]({{< ref "/posts/2026/09/24/gemini-3-8-flash-tts-and-custom-voices-with-the-interactions-java-sdk.md" >}}) | 34.9 KB | 8.9 KB | **3.9x** |
| [The Unofficial Antigravity SDK for Java]({{< ref "/posts/2026/07/31/the-unofficial-antigravity-sdk-for-java.md" >}}) | 49.8 KB | 14.3 KB | **3.5x** |
| [Sharing a Git-Backed Obsidian Vault]({{< ref "/posts/2026/09/13/sharing-a-git-backed-obsidian-vault-across-computers.md" >}}) | 16.6 KB | 6.8 KB | **2.4x** |

Beyond saving bytes and tokens, the agent gets clean fenced code blocks (` ```java `) instead of nested HTML spans, with zero navigation clutter.

## Generating Markdown Twins with Hugo

Since my blog content is already authored in Markdown with Hugo, and served via GitHub Pages, generating a clean `.md` twin at build time only took four small changes.

### 1. Enabling the `markDown` output format in `config.toml`

Hugo includes a built-in `markDown` output format with the `text/markdown` media type.
By default, Hugo outputs `/posts/YYYY/MM/DD/slug/index.md`.
I wanted the shorter `/posts/YYYY/MM/DD/slug.md` URL pattern (matching Marko Denic's setup).
In Hugo, you can achieve this without changing your existing HTML URLs by enabling `uglyURLs = true` globally while setting `noUgly = true` on `HTML` and `RSS`, and `noUgly = false` on `markDown`:

```toml
uglyURLs = true

[outputFormats.HTML]
noUgly = true

[outputFormats.RSS]
noUgly = true

[outputFormats.llms]
baseName = "llms"
mediaType = "text/plain"
isPlainText = true
noUgly = true

[outputFormats.llms-full]
baseName = "llms-full"
mediaType = "text/plain"
isPlainText = true
noUgly = true

[outputFormats.markDown]
mediaType = "text/markdown"
isPlainText = true
noUgly = false

[outputs]
home = ["HTML", "RSS", "llms", "llms-full"]
page = ["HTML", "markDown"]
```

### 2. Creating the Markdown template (`layouts/_default/single.md`)

Instead of copying the raw source file with its YAML frontmatter, I created a `single.md` template in my theme (`themes/glaforge-from-blank/layouts/_default/single.md`).
Following Marko Denic's recommendation, it starts with the article title, description, metadata (author, publication date, tags, and canonical URL), and then outputs the Markdown content while resolving Hugo's internal `{{</* ref "..." */>}}` shortcodes into full URLs:

```go-html-template
# {{ .Title }}
{{- with .Description }}

> {{ . }}
{{- end }}

Author: [{{ .Site.Params.author.name | default .Site.Title }}]({{ .Site.BaseURL }}) | Published: {{ .Date.Format "2006-01-02" }}{{ if and (not .Lastmod.IsZero) (ne (.Lastmod.Format "2006-01-02") (.Date.Format "2006-01-02")) }} | Updated: {{ .Lastmod.Format "2006-01-02" }}{{ end }}{{ with .Params.tags }} | Topics: {{ delimit . ", " }}{{ end }} | Canonical: {{ if .Params.canonical }}{{ .Params.canonical }}{{ else }}{{ .Permalink }}{{ end }}
{{ $content := .RawContent -}}
{{- $content = $content | replaceRE `\{\{<\s*ref\s+"/"\s*>\}\}` .Site.BaseURL -}}
{{- $content = $content | replaceRE `\{\{<\s*ref\s+"/?([^"]+?)(\.md)?"\s*>\}\}` (printf "%s$1/" .Site.BaseURL) }}
{{ $content }}
```

### 3. Advertising the Markdown and `llms.txt` versions in `<head>`

For agents that fetch the HTML page first and look for a machine-readable alternative (like OpenAI's Codex CLI), I added `<link rel="alternate">` tags right below `<link rel="canonical">` in `layouts/_default/baseof.html`, pointing to `llms.txt`, `llms-full.txt`, and the page's `.md` twin:

```go-html-template
<link rel="canonical" href="{{ if .Params.canonical }}{{ .Params.canonical }}{{ else }}{{ .Permalink }}{{ end }}">
<link rel="alternate" type="text/plain" href="{{ "llms.txt" | absURL }}" title="LLMs.txt (Summary & Index)">
<link rel="alternate" type="text/plain" href="{{ "llms-full.txt" | absURL }}" title="LLMs-full.txt (Full Corpus)">
{{ with .OutputFormats.Get "markDown" -}}
	{{ printf `<link rel="%s" type="%s" href="%s" title="%s (Markdown)">` .Rel .MediaType.Type .Permalink $.Title | safeHTML }}
{{- end }}
```

### 4. Pointing `llms.txt` directly to the `.md` files

Finally, I updated `layouts/_default/index.llms.txt` so that `/llms.txt` includes a short `## Programmatic access` guide for agents and links directly to the `.md` twin of each article rather than the HTML page:

```go-html-template
## Programmatic access

Agents and automated tools can access this blog's content in clean Markdown without HTML chrome:
- Fetch [llms.txt]({{ .Site.BaseURL }}llms.txt) for a structured index of all articles with direct links to their `.md` versions.
- Fetch [llms-full.txt]({{ .Site.BaseURL }}llms-full.txt) to ingest the entire blog corpus in a single Markdown document.
- Append `.md` to any article URL (or follow the `<link rel="alternate" type="text/markdown">` tag in any page's HTML `<head>`) to retrieve the raw Markdown twin of that article.

## All articles
{{ range .Site.RegularPages.GroupByDate "2006" }}

### {{ .Key }}
{{ range .Pages }}
{{- $url := .Permalink -}}
{{- with .OutputFormats.Get "markDown" -}}{{- $url = .Permalink -}}{{- end }}
- [{{- .Title -}}]({{- $url -}})
{{- end -}}
{{ end }}
```

## The Limitations of Static Hosting on GitHub Pages

While this static Hugo setup gets us a long way, hosting on GitHub Pages comes with a few HTTP-level limitations that are worth calling out.

First, the good news: when Hugo builds the `.md` files and deploys them via GitHub Actions, GitHub Pages serves them with the proper [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763.html) MIME type and UTF-8 charset parameter out of the box:

```http
HTTP/2 200
server: GitHub.com
content-type: text/markdown; charset=utf-8
```

However, because GitHub Pages is a purely static file host with no custom server configuration or header rules, two pieces from [acceptmarkdown.com](https://acceptmarkdown.com/) and Marko Denic's post are not possible on GitHub Pages alone:

1. **No HTTP Content Negotiation (`Accept: text/markdown`) on canonical URLs**:
   When an agent like Claude Code or Cursor requests `https://glaforge.dev/posts/2026/10/30/agent-experience-in-practice-serving-this-hugo-blog-as-markdown/` with `Accept: text/markdown`, GitHub Pages cannot dynamically rewrite that request to serve `agent-experience-in-practice-serving-this-hugo-blog-as-markdown.md`. It will still return `index.html` (`text/html`). To get the Markdown version, the agent (or user) either needs to follow the `<link rel="alternate" type="text/markdown">` tag in `<head>`, follow the link from `/llms.txt`, or append `.md` to the URL (stripping the trailing slash).
2. **No custom HTTP response headers (`Link`, `Vary`, `Cache-Control`)**:
   GitHub Pages does not support `_headers` files. We cannot attach a `Link: <...>; rel="canonical"` HTTP response header to the `.md` files, nor set `Vary: Accept` or `Cache-Control: private`. Including the `Canonical:` URL at the top of the Markdown text helps agents identify the canonical source, even without the HTTP `Link` header.

> [!TIP]
> If you want full `Accept: text/markdown` content negotiation and custom HTTP headers in front of GitHub Pages, the easiest option is to put your domain behind **Cloudflare** (either using a small Cloudflare Worker to route `Accept: text/markdown` requests to the `.md` file and set the `Vary` and `Link` headers, or enabling Cloudflare's *Markdown for Agents* feature) or to host on a platform that supports header-based rewrites like Netlify or Vercel.

## Auditing the Blog with `anc.dev`

To see how the blog fared against an automated agent-readiness checker, I ran it through [anc.dev](https://anc.dev/score/glaforge.dev) (which practices what it preaches by serving its own audit report as clean Markdown at [`https://anc.dev/score/glaforge.dev/md`](https://anc.dev/score/glaforge.dev/md)).

Out of the box, the audit verified `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, resolvable `.md` links inside `llms.txt`, Schema.org JSON-LD metadata, and semantic HTML landmarks (`<header>`, `<main>`, `<aside>`, `<footer>`), giving the site an initial score of 65% across applicable checks.

The remaining checks fell into two buckets:
- **HTTP-level checks that require a custom server or CDN worker**: `Accept: text/markdown` content negotiation, `Vary: Accept` headers, RFC 8288 `Link` response headers on `/`, and returning a Markdown 404 body when `Accept: text/markdown` hits an unknown URL.
- **Static HTML and metadata checks we can fix right in Hugo**: The audit surfaced a few interesting gotchas that I fixed right away:
  1. **The `hugo --minify` quote-stripping trap**: My GitHub Actions workflow builds the site with `hugo --minify`. By default, Hugo's HTML minifier (`tdewolff/minify`) strips quotes around attribute values that don't contain spaces, turning `<meta name="description" ...>` into `<meta name=description ...>` and `<link rel="alternate" ...>` into `<link rel=alternate ...>`. Lightweight crawlers and audit tools that match tags with regular expressions (like `/<meta[^>]+name=["']description["']/`) completely miss unquoted attributes! Adding `keepQuotes = true` in `config.toml` preserves standard quoted attributes:
     ```toml
     [minify]
       [minify.tdewolff]
         [minify.tdewolff.html]
           keepQuotes = true
     ```
  2. **A `<noscript>` fallback with machine entry points**: For fetch-only crawlers that look for a `<noscript>` block on the root page, I added a `<noscript>` element at the top of `<body>` in `baseof.html` linking directly to `llms.txt`, `llms-full.txt`, and `sitemap.xml`.
  3. **Declaring `Content-Signal` preferences in `robots.txt`**: Beyond standard `Allow`/`Disallow` rules, [contentsignals.org](https://contentsignals.org/) defines a `Content-Signal` directive so site owners can explicitly state their AI usage preferences (`ai-train`, `search`, `ai-input`) in `layouts/_default/robots.txt`:
     ```txt
     User-agent: *
     Content-Signal: ai-train=yes, search=yes, ai-input=yes
     Allow: /
     Disallow: /tags/

     Sitemap: https://glaforge.dev/sitemap.xml
     ```
  4. **A proper `<h1>` on the homepage**: On single articles, the post title is an `<h1>`, but on the homepage (`/`), post titles were `<h2>` and the blog title in `<header>` was a plain `<a>` link. Wrapping the homepage header title in an `<h1>` ensures non-JS agents parsing the root page immediately find a top-level heading.

## Wrap-up

Adapting a static blog to serve clean Markdown twins is a small, thirty-minute tweak in Hugo, and a practical step toward better Agent eXperience (AX).
Whether an agent discovers my articles through `/llms.txt`, inspects `<link rel="alternate" type="text/markdown">` in the HTML header, or fetches a `.md` URL directly, it can now read the prose and code snippets without wading through HTML layout noise.
