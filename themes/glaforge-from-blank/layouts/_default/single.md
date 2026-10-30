# {{ .Title }}
{{- with .Description }}

> {{ . }}
{{- end }}

Author: [{{ .Site.Params.author.name | default .Site.Title }}]({{ .Site.BaseURL }}) | Published: {{ .Date.Format "2006-01-02" }}{{ if and (not .Lastmod.IsZero) (ne (.Lastmod.Format "2006-01-02") (.Date.Format "2006-01-02")) }} | Updated: {{ .Lastmod.Format "2006-01-02" }}{{ end }}{{ with .Params.tags }} | Topics: {{ delimit . ", " }}{{ end }} | Canonical: {{ if .Params.canonical }}{{ .Params.canonical }}{{ else }}{{ .Permalink }}{{ end }}
{{ $content := .RawContent -}}
{{- $content = $content | replaceRE `\{\{<\s*ref\s+"/"\s*>\}\}` .Site.BaseURL -}}
{{- $content = $content | replaceRE `\{\{<\s*ref\s+"/?([^"]+?)(\.md)?"\s*>\}\}` (printf "%s$1/" .Site.BaseURL) }}
{{ $content }}
