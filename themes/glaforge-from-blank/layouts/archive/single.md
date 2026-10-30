# {{ .Title }}

Author: [{{ .Site.Params.author.name | default .Site.Title }}]({{ .Site.BaseURL }}) | Canonical: {{ .Permalink }}
{{- range (.Site.RegularPages.GroupByDate "2006") -}}
{{- if and (gt .Key 1) .Pages }}

## {{ .Key }}
{{- range (.Pages.GroupByDate "January") }}

### {{ .Key }}
{{- range .Pages }}
{{- if (ne .Params.hidden true) }}
{{- $url := .Permalink -}}
{{- with .OutputFormats.Get "markDown" -}}{{- $url = .Permalink -}}{{- end }}
- {{ .Date.Format "Jan 02" }} — [{{ .Title }}]({{ $url }})
{{- end }}
{{- end }}
{{- end }}
{{- end }}
{{- end }}
