"use client"

import { FileText, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProjectFile {
  path: string
  content: string
}

interface ProjectFileExplorerProps {
  files: ProjectFile[]
  activeFilePath: string | null
  onSelectFile: (path: string) => void
  onNewFile?: () => void
  onDeleteFile?: (path: string) => void
}

export function ProjectFileExplorer({
  files,
  activeFilePath,
  onSelectFile,
  onNewFile,
  onDeleteFile,
}: ProjectFileExplorerProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Files</span>
        {onNewFile && (
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onNewFile} title="New file">
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {files.length === 0 && (
          <p className="px-3 py-4 text-xs text-muted-foreground text-center">No files yet. Start chatting to generate code.</p>
        )}
        {files.map((file) => (
          <div
            key={file.path}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 cursor-pointer text-sm",
              "hover:bg-accent hover:text-accent-foreground transition-colors",
              activeFilePath === file.path && "bg-accent text-accent-foreground",
            )}
            onClick={() => onSelectFile(file.path)}
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate font-mono text-xs">{file.path}</span>
            {onDeleteFile && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); onDeleteFile(file.path) }}
                title="Delete file"
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
