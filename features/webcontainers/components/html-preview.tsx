"use client"

import { useEffect, useRef } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HtmlPreviewProps {
  html: string
  css?: string
  js?: string
}

function buildSrcDoc(html: string, css?: string, js?: string): string {
  if (!css && !js) return html

  if (html.includes("</head>")) {
    let result = html
    if (css) result = result.replace("</head>", `<style>\n${css}\n</style>\n</head>`)
    if (js) result = result.replace("</body>", `<script>\n${js}\n</script>\n</body>`)
    return result
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${css ? `<style>\n${css}\n</style>` : ""}
</head>
<body>
${html}
${js ? `<script>\n${js}\n</script>` : ""}
</body>
</html>`
}

export function HtmlPreview({ html, css, js }: HtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const srcDoc = buildSrcDoc(html, css, js)

  function reload() {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc
    }
  }

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc
    }
  }, [srcDoc])

  if (!html) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Preview will appear here once the AI generates code.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-2 py-1 border-b bg-muted/30">
        <span className="text-xs text-muted-foreground font-mono">HTML Preview</span>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={reload} title="Reload preview">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      <iframe
        ref={iframeRef}
        className="flex-1 w-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="HTML Preview"
      />
    </div>
  )
}
