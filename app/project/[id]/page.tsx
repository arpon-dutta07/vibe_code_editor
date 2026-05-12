"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, GitCommit, Wrench } from "lucide-react"
import { toast } from "sonner"
import { ChatPanel } from "@/features/chat/components/chat-panel"
import { ProjectFileExplorer } from "@/features/project/components/project-file-explorer"
import { CommitHistory } from "@/features/project/components/commit-history"
import { SkillsPanel } from "@/features/project/components/skills-panel"
import { getProjectById, getProjectFiles, saveProjectFile, deleteProject } from "@/features/project/actions"
import { HtmlPreview } from "@/features/webcontainers/components/html-preview"

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
  const [rightTab, setRightTab] = useState<"preview" | "editor">("editor")

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
      <div className="flex items-center justify-center h-screen text-muted-foreground text-sm">
        Loading project...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-2 border-b bg-background shrink-0">
        <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Button>
        <span className="text-sm font-medium truncate">{projectName}</span>
      </header>

      {/* Main layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Left: chat + sidebar tabs */}
        <ResizablePanel defaultSize={28} minSize={20} maxSize={45}>
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="w-full rounded-none border-b justify-start h-9 px-2 gap-1 shrink-0">
              <TabsTrigger value="chat" className="text-xs h-7">Chat</TabsTrigger>
              <TabsTrigger value="files" className="text-xs h-7">Files</TabsTrigger>
              <TabsTrigger value="history" className="text-xs h-7 gap-1">
                <GitCommit className="h-3 w-3" />History
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs h-7 gap-1">
                <Wrench className="h-3 w-3" />Skills
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 min-h-0 m-0">
              <ChatPanel projectId={id} onFilesChanged={refreshFiles} />
            </TabsContent>

            <TabsContent value="files" className="flex-1 min-h-0 m-0 overflow-hidden">
              <ProjectFileExplorer
                files={files}
                activeFilePath={activeFilePath}
                onSelectFile={onSelectFile}
              />
            </TabsContent>

            <TabsContent value="history" className="flex-1 min-h-0 m-0 overflow-y-auto">
              <CommitHistory commits={commits} />
            </TabsContent>

            <TabsContent value="skills" className="flex-1 min-h-0 m-0 overflow-y-auto">
              <SkillsPanel activeSkills={activeSkills} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: editor + preview */}
        <ResizablePanel defaultSize={72}>
          <Tabs value={rightTab} onValueChange={(v) => setRightTab(v as "preview" | "editor")} className="flex flex-col h-full">
            <div className="flex items-center justify-between px-2 border-b shrink-0 h-9">
              <TabsList className="h-7 rounded-none bg-transparent gap-1">
                <TabsTrigger value="editor" className="text-xs h-6">Editor</TabsTrigger>
                <TabsTrigger value="preview" className="text-xs h-6">Preview</TabsTrigger>
              </TabsList>
              {rightTab === "editor" && activeFilePath && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onEditorSave} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              )}
            </div>

            <TabsContent value="editor" className="flex-1 min-h-0 m-0">
              {activeFilePath ? (
                <MonacoEditor
                  height="100%"
                  language={getLanguage(activeFilePath)}
                  value={editorContent}
                  onChange={(v) => setEditorContent(v ?? "")}
                  theme="vs-dark"
                  options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: "on" }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Select a file to edit, or start chatting to generate one.
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1 min-h-0 m-0">
              <HtmlPreview
                html={htmlFile?.content ?? ""}
                css={cssFile?.content}
                js={jsFile?.content}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
