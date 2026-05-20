"use client"

import { useEffect, useState, useCallback } from "react"
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
  FileText
} from "lucide-react"
import { toast } from "sonner"
import { ChatPanel } from "@/features/chat/components/chat-panel"
import { ProjectFileExplorer } from "@/features/project/components/project-file-explorer"
import { CommitHistory } from "@/features/project/components/commit-history"
import { SkillsPanel } from "@/features/project/components/skills-panel"
import { getProjectById, getProjectFiles, saveProjectFile } from "@/features/project/actions"
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

  const activeFile = files.find((f) => f.path === activeFilePath) ?? null
  const htmlFile = files.find((f) => f.path === "index.html")
  const cssFile = files.find((f) => f.path === "style.css")
  const jsFile = files.find((f) => f.path === "script.js")

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

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-300">
      {/* Top Bar */}
      <header className="h-12 bg-[#0f0f0f] border-b border-zinc-900 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-[1px] h-4 bg-zinc-800" />
          <span className="text-white font-medium text-sm">{projectName}</span>
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tight">
            {getLanguage(activeFilePath || "").toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => setRightTab(rightTab === "preview" ? "editor" : "preview")}
            className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs px-3 py-1.5 h-auto rounded-lg flex items-center gap-1.5 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <Play size={13} className={cn(rightTab === "preview" && "text-[#FF2D78] fill-[#FF2D78]")} />
            Preview
          </Button>
          <Button 
            onClick={onEditorSave} 
            disabled={saving} 
            className="bg-[#FF2D78] hover:bg-[#FF2D78]/90 text-white text-xs px-4 py-1.5 h-auto rounded-lg font-semibold transition-all active:scale-95"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="h-10 bg-[#0f0f0f] border-b border-zinc-900 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-1 h-full">
          <TabItem 
            active={leftTab === "chat"} 
            onClick={() => setLeftTab("chat")} 
            icon={<MessageSquare size={13} />} 
            label="Chat" 
          />
          <TabItem 
            active={leftTab === "files"} 
            onClick={() => setLeftTab("files")} 
            icon={<Files size={13} />} 
            label="Files" 
          />
          <TabItem 
            active={leftTab === "history"} 
            onClick={() => setLeftTab("history")} 
            icon={<History size={13} />} 
            label="History" 
          />
          <TabItem 
            active={leftTab === "skills"} 
            onClick={() => setLeftTab("skills")} 
            icon={<Wrench size={13} />} 
            label="Skills" 
          />
        </div>
        <div className="flex items-center gap-1 h-full">
          <TabItem 
            active={rightTab === "editor"} 
            onClick={() => setRightTab("editor")} 
            icon={<Code2 size={13} />} 
            label="Editor" 
          />
        </div>
      </div>

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
        <section className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
          {rightTab === "editor" ? (
            <>
              {/* File Tabs Row */}
              <div className="h-9 bg-[#0f0f0f] border-b border-zinc-900 flex items-center px-3 gap-1 shrink-0">
                {activeFilePath && (
                  <div className="bg-[#0a0a0a] border border-zinc-800 border-b-0 rounded-t-md px-3 h-full flex items-center gap-1.5 text-zinc-300 text-[11px] font-mono">
                    <FileText size={12} className="text-[#FF2D78]" />
                    <span className="truncate max-w-[150px]">{activeFilePath.split("/").pop()}</span>
                    <X size={12} className="text-zinc-600 hover:text-zinc-400 cursor-pointer ml-1" />
                  </div>
                )}
              </div>
              
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
            </>
          ) : (
            <div className="flex-1 min-h-0 bg-white">
              <HtmlPreview
                html={htmlFile?.content ?? ""}
                css={cssFile?.content}
                js={jsFile?.content}
              />
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

