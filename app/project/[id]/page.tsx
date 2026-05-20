"use client"

import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Play, 
  MessageSquare, 
  Files, 
  History, 
  Wrench, 
  Code2, 
  X,
  FileText,
  Smartphone,
  Tablet,
  Monitor,
  Laptop,
  ExternalLink,
  RefreshCw,
  RotateCw
} from "lucide-react"
import { toast } from "sonner"
import { ChatPanel } from "@/features/chat/components/chat-panel"
import { ProjectFileExplorer } from "@/features/project/components/project-file-explorer"
import { CommitHistory } from "@/features/project/components/commit-history"
import { SkillsPanel } from "@/features/project/components/skills-panel"
import { getProjectById, getProjectFiles, saveProjectFile } from "@/features/project/actions"
import { DevicePreviewPanel } from "@/features/project/components/device-preview-panel"
import { HtmlPreview } from "@/features/webcontainers/components/html-preview"
import { cn } from "@/lib/utils"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

type ProjectFile = { id: string; path: string; content: string; projectId: string; updatedAt: Date }
type Commit = { id: string; message: string; summary: string; diff: unknown; createdAt: Date }

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [projectName, setProjectName] = useState("")
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [commits, setCommits] = useState<Commit[]>([])
  const [activeSkills, setActiveSkills] = useState<string[]>(["frontend-design"])
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [leftTab, setLeftTab] = useState<"chat" | "files" | "history" | "skills">("chat")
  const [rightTab, setRightTab] = useState<"editor" | "preview">("editor")
  
  // Preview Side Panel States
  const [showPreview, setShowPreview] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [previewMode, setPreviewMode] = useState<"mobile" | "tablet" | "laptop" | "desktop">("desktop")
  const [previewLandscape, setPreviewLandscape] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const editorSectionRef = useRef<HTMLDivElement>(null)


  const activeFile = files.find((f) => f.path === activeFilePath) ?? null
  const htmlFile = files.find((f) => f.path === "index.html") || files.find((f) => f.path.endsWith(".html"))
  const cssFile = files.find((f) => f.path === "style.css") || files.find((f) => f.path.endsWith(".css"))
  const jsFile = files.find((f) => f.path === "script.js") || files.find((f) => f.path.endsWith(".js") || f.path.endsWith(".ts"))

  // Responsive Check for Preview
  useEffect(() => {
    if (!editorSectionRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(editorSectionRef.current)
    return () => observer.disconnect()
  }, [])

  async function load() {
    try {
      const project = await getProjectById(id)
      if (!project) { router.push("/dashboard"); return }
      setProjectName(project.name)
      setFiles(project.files as ProjectFile[])
      setCommits(project.commits as Commit[])
      setActiveSkills(project.activeSkills)
      if (project.files.length > 0) {
        const first = project.files[0]
        setActiveFilePath(first.path)
        setEditorContent(first.content)
      }
    } catch {
      toast.error("Failed to load project")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  function onSelectFile(path: string) {
    setActiveFilePath(path)
    const f = files.find((f) => f.path === path)
    setEditorContent(f?.content ?? "")
  }

  async function onEditorSave() {
    if (!activeFilePath) return
    setSaving(true)
    try {
      await saveProjectFile(id, activeFilePath, editorContent)
      setFiles((prev) => prev.map((f) => f.path === activeFilePath ? { ...f, content: editorContent } : f))
      toast.success(`Saved ${activeFilePath}`)
    } catch {
      toast.error("Save failed")
    } finally {
      setSaving(false)
    }
  }

  const refreshFiles = useCallback(async () => {
    const fresh = await getProjectFiles(id).catch(() => null)
    if (fresh) {
      setFiles(fresh as ProjectFile[])
      if (fresh.length > 0 && !activeFilePath) {
        setActiveFilePath(fresh[0].path)
        setEditorContent(fresh[0].content)
      }
    }
  }, [id, activeFilePath])

  function getLanguage(path: string) {
    if (path.endsWith(".html")) return "html"
    if (path.endsWith(".css")) return "css"
    if (path.endsWith(".js") || path.endsWith(".ts")) return "javascript"
    if (path.endsWith(".json")) return "json"
    if (path.endsWith(".md")) return "markdown"
    return "plaintext"
  }

  const srcDoc = useMemo(() => {
    const html = htmlFile?.content ?? ""
    const css = cssFile?.content ?? ""
    const js = jsFile?.content ?? ""
    
    if (!html && !css && !js) return ""
    
    let combinedHtml
    if (html.includes("</head>")) {
      let result = html
      if (css) result = result.replace("</head>", `<style>${css}</style></head>`)
      if (js) result = result.replace("</body>", `<script>${js}</script></body>`)
      combinedHtml = result
    } else {
      combinedHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`
    }

    // Post-process the combined HTML
    let processedHtml = combinedHtml

    // 1. Inject CSP Meta Tag if it doesn't exist
    const cspTag = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval';">`
    if (!processedHtml.includes('Content-Security-Policy')) {
      if (processedHtml.includes('</head>')) {
        processedHtml = processedHtml.replace('</head>', `${cspTag}\n</head>`)
      } else {
        processedHtml = `<html><head>${cspTag}</head>${processedHtml}</html>`
      }
    }

    // 2. Replace unseeded image URLs with deterministic seeded ones
    let seedCounter = 0
    const getSeed = () => `img${++seedCounter}`

    processedHtml = processedHtml.replace(/https?:\/\/(?:loremflickr\.com|picsum\.photos)\/(\d+)\/(\d+)/g, (match, w, h) => {
      return `https://picsum.photos/seed/${getSeed()}/${w}/${h}`
    })
    processedHtml = processedHtml.replace(/https?:\/\/source\.unsplash\.com\/random(?:\/(\d+x\d+))?/g, (match, size) => {
      const [w, h] = size ? size.split('x') : [400, 300]
      return `https://picsum.photos/seed/${getSeed()}/${w}/${h}`
    })

    return processedHtml
  }, [htmlFile?.content, cssFile?.content, jsFile?.content])

  const openInNewTab = useCallback(() => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(srcDoc)
      newWindow.document.close()
    }
  }, [srcDoc])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-zinc-500 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#FF2D78] border-t-transparent rounded-full animate-spin" />
          Loading project...
        </div>
      </div>
    )
  }

  // Split view is available if editor section is wide enough
  const isSplitAvailable = containerWidth >= 700
  const activeSplitPreview = rightTab === "editor" && showPreview && isSplitAvailable

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-300">
      {/* Unified Navbar */}
      <header className="h-12 bg-[#0f0f0f] border-b border-zinc-900 flex items-center px-4 shrink-0 overflow-x-auto hide-scrollbar gap-4">
        <div className="flex items-center gap-1 h-full shrink-0">
          <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-400 transition-colors mr-2">
            <ArrowLeft size={16} />
          </Link>
          <span className="text-white font-medium text-sm mr-2">{projectName}</span>
          
          {activeFilePath && (
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1.5 mr-4">
              <span className="truncate max-w-[120px]">{activeFilePath.split("/").pop()}</span>
              {getLanguage(activeFilePath).toUpperCase()}
            </div>
          )}
          
          <div className="w-[1px] h-4 bg-zinc-800 mx-2" />
          
          <TabItem active={leftTab === "chat"} onClick={() => setLeftTab("chat")} icon={<MessageSquare size={13} />} label="Chat" />
          <TabItem active={leftTab === "files"} onClick={() => setLeftTab("files")} icon={<Files size={13} />} label="Files" />
          <TabItem active={leftTab === "history"} onClick={() => setLeftTab("history")} icon={<History size={13} />} label="History" />
          <TabItem active={leftTab === "skills"} onClick={() => setLeftTab("skills")} icon={<Wrench size={13} />} label="Skills" />
        </div>

        {/* Center: Device Controls */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          {(showPreview || rightTab === "preview") && (
            <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50 shrink-0">
            <DeviceButton active={previewMode === "mobile"} onClick={() => setPreviewMode("mobile")} icon={<Smartphone size={13} />} />
            <DeviceButton active={previewMode === "tablet"} onClick={() => setPreviewMode("tablet")} icon={<Tablet size={13} />} />
            <DeviceButton active={previewMode === "laptop"} onClick={() => setPreviewMode("laptop")} icon={<Laptop size={13} />} />
            <DeviceButton active={previewMode === "desktop"} onClick={() => setPreviewMode("desktop")} icon={<Monitor size={13} />} />
            <div className="w-[1px] h-3 bg-zinc-800 mx-1" />
            {(previewMode === "mobile" || previewMode === "tablet") && (
              <button onClick={() => setPreviewLandscape(!previewLandscape)} className={cn("p-1.5 rounded hover:bg-zinc-800 text-zinc-500", previewLandscape && "text-[#FF2D78] bg-[#FF2D78]/10")} title="Rotate"><RotateCw size={12} /></button>
            )}
            <button onClick={() => setRefreshTrigger(r => r + 1)} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500" title="Refresh"><RefreshCw size={12} /></button>
            <button onClick={openInNewTab} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500" title="Open in new tab"><ExternalLink size={12} /></button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 h-full shrink-0">
          <div className="flex items-center h-full mr-2">
            <TabItem active={rightTab === "editor"} onClick={() => setRightTab("editor")} icon={<Code2 size={13} />} label="Editor" />
            <TabItem active={rightTab === "preview"} onClick={() => setRightTab("preview")} icon={<Play size={13} />} label="Preview" />
          </div>

          <div className="w-[1px] h-4 bg-zinc-800 mr-2" />

          {/* <Button 
            variant="ghost" 
            onClick={() => {
              if (rightTab === "preview") {
                setRightTab("editor")
                setShowPreview(true)
              } else {
                setShowPreview(!showPreview)
              }
            }}
            className={cn(
              "bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs px-3 py-1.5 h-7 rounded-lg flex items-center gap-1.5 hover:bg-zinc-800 transition-all",
              (showPreview || rightTab === "preview") && "bg-[#FF2D78]/10 border-[#FF2D78]/30 text-zinc-300"
            )}
          >
            <Play size={12} className={cn((showPreview || rightTab === "preview") && "text-[#FF2D78] fill-[#FF2D78]")} />
            Split Preview
          </Button> */}
          <Button 
            onClick={onEditorSave} 
            disabled={saving} 
            className="bg-[#FF2D78] hover:bg-[#FF2D78]/90 text-white text-xs px-4 py-1.5 h-7 rounded-lg font-semibold transition-all active:scale-95 ml-1"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex min-h-0">
        {/* Left Panel (Chat & Navigation) */}
        <aside className="w-[360px] flex flex-col border-r border-zinc-900 bg-[#0a0a0a]">
          {leftTab === "chat" && (
            <ChatPanel projectId={id} onFilesChanged={refreshFiles} />
          )}
          {leftTab === "files" && (
            <div className="flex-1 overflow-hidden">
              <ProjectFileExplorer
                files={files}
                activeFilePath={activeFilePath}
                onSelectFile={onSelectFile}
              />
            </div>
          )}
          {leftTab === "history" && (
            <div className="flex-1 overflow-y-auto">
              <CommitHistory commits={commits} />
            </div>
          )}
          {leftTab === "skills" && (
            <div className="flex-1 overflow-y-auto">
              <SkillsPanel activeSkills={activeSkills} />
            </div>
          )}
        </aside>

        {/* Right Panel (Editor & Preview) */}
        <section 
          ref={editorSectionRef}
          className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]"
        >
          {rightTab === "preview" ? (
            <div className="flex-1 min-h-0 relative">
              <DevicePreviewPanel srcDoc={srcDoc} mode={previewMode} isLandscape={previewLandscape} refreshTrigger={refreshTrigger} />
            </div>
          ) : (
            <div className="flex-1 flex min-h-0 overflow-hidden relative">
              {/* Editor Side */}
              <div className={cn(
                "flex flex-col min-w-0 transition-all duration-300 ease-in-out",
                activeSplitPreview ? "flex-1" : "w-full"
              )}>
                {/* File Tabs Row - Removed per user request to merge navbars */}
                
                <div className="flex-1 min-h-0 relative">
                  {activeFilePath ? (
                    <MonacoEditor
                      height="100%"
                      language={getLanguage(activeFilePath)}
                      value={editorContent}
                      onChange={(v) => setEditorContent(v ?? "")}
                      theme="vs-dark"
                      options={{ 
                        minimap: { enabled: false }, 
                        fontSize: 12, 
                        wordWrap: "on",
                        lineNumbers: "on",
                        lineHeight: 28,
                        fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                        renderLineHighlight: "all",
                        scrollbar: {
                          vertical: "visible",
                          horizontal: "visible",
                          useShadows: false,
                          verticalHasArrows: false,
                          horizontalHasArrows: false,
                          verticalScrollbarSize: 8,
                          horizontalScrollbarSize: 8,
                        },
                        padding: { top: 20, bottom: 20 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        fixedOverflowWidgets: true,
                        roundedSelection: true,
                        cursorStyle: "line",
                        cursorWidth: 2,
                        renderWhitespace: "none",
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-sm gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                        <Code2 size={24} className="text-zinc-700" />
                      </div>
                      <p>Select a file to edit, or start chatting to generate one.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Side Panel */}
              <div className={cn(
                "border-l border-zinc-900 transition-all duration-300 ease-in-out overflow-hidden relative",
                activeSplitPreview ? "w-1/2 opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-full"
              )}>
                <DevicePreviewPanel srcDoc={srcDoc} mode={previewMode} isLandscape={previewLandscape} refreshTrigger={refreshTrigger} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}


function TabItem({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-full px-4 flex items-center gap-2 text-xs font-medium transition-all border-b-2",
        active 
          ? "border-[#FF2D78] text-white" 
          : "border-transparent text-zinc-600 hover:text-zinc-400"
      )}
    >
      <span className={cn(active ? "text-[#FF2D78]" : "text-zinc-600")}>
        {icon}
      </span>
      {label}
    </button>
  )
}

function DeviceButton({ 
  active, 
  onClick, 
  icon
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200",
        active 
          ? "bg-[#FF2D78]/20 text-[#FF2D78]" 
          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
      )}
    >
      {icon}
    </button>
  )
}
