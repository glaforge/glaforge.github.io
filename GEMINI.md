# Guillaume Laforge's Blog Writing Style & Hugo Guidelines

Always follow these guidelines when drafting, editing, or reviewing blog posts in this repository.

## 1. Voice, Tone, and Perspective
- **First-person perspective ("I")**: Write from Guillaume's personal perspective ("I built", "I wanted to test", "Here is the setup I use") while addressing the reader directly as "you" during instructional steps.
- **Simple, direct, and effective**: Keep sentences clear and paragraphs short (typically 1–3 sentences). Prefer plain English over pompous or academic phrasing.
- **No superlatives or AI slop**: Never use hype words ("revolutionary", "game-changing", "seamless", "delve", "tapestry", "testament", "moreover", "crucial"). Rely on concrete numbers, timings, token counts, or factual trade-offs instead of adjectives. (Apply the `deslopify` skill principles at all times.)
- **Pragmatic and honest**: Acknowledge limitations, edge cases, and trade-offs openly (e.g., when an alternative tool is a better fit, or when a benchmark is an early experiment rather than a scientific study).
- **Natural human touches**: Occasional parenthetical remarks `(like this)` for side thoughts are welcome. Avoid em-dashes (`—`); use parentheses, colons, or commas instead.

## 2. Article Structure
- **Immediate, grounded hook**: Start right away with the concrete trigger for the post: a real-world friction point, a new library/model release, or a project built for an upcoming conference. Never open with generic industry clichés.
- **Early links for impatient readers**: When showcasing a project or tool, include a `> [!NOTE]` callout near the top with direct links to the live application and GitHub repository.
- **Scannable sections**: Use clear `##` and `###` headings, bulleted lists, numbered steps, and Markdown tables (for comparing options, trade-offs, or benchmarks).
- **Practical code & configurations**: Show real, copy-pasteable code snippets (Java, shell commands, `pom.xml`, config files) rather than abstract pseudocode. Briefly explain the non-obvious parts right after the snippet.
- **Concise wrap-up**: End with a brief summary (`## Wrap-up`, `## Conclusion`, or `## Try It Out`), links to the repository/docs, and an open invitation for feedback.

## 3. Hugo Conventions
- **Location**: Posts live under `content/posts/YYYY/MM/DD/<slug>.md`.
- **Frontmatter**:
  ```yaml
  ---
  title: "..."
  description: "..."
  date: YYYY-MM-DDTHH:MM:SS+02:00
  image: /img/...
  tags:
  - tag1
  - tag2
  similar:
    - "posts/YYYY/MM/DD/related-post.md"
  ---
  ```
- **Internal links**: Use Hugo's ref shortcode when linking to other posts on the blog: `[link text]({{< ref "/posts/YYYY/MM/DD/slug.md" >}})`.
- **Admonitions / Callouts**: Use GitHub-style blockquote alerts supported by the theme: `> [!NOTE]`, `> [!TIP]`, `> [!INFO]`, `> [!WARNING]`, `> [!REMARK]`.
