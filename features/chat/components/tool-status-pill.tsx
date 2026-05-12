"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, FilePen, Trash2, FolderSearch, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

type ToolName = "read_file" | "write_file" | "delete_file" | "list_files" | "run_command"
type PillState = "streaming" | "done" | "error"

interface ToolPillProps {
  toolName: string
  args: Record<string, unknown>
  result?: unknown
  state: PillState
}

const ICONS: Record<ToolName, React.ReactNode> = {
  read_file: <FileText className="h-3 w-3" />,
  write_file: <FilePen className="h-3 w-3" />,
  delete_file: <Trash2 className="h-3 w-3" />,
  list_files: <FolderSearch className="h-3 w-3" />,
  run_command: <Terminal className="h-3 w-3" />,
}

function getLabel(toolName: string, args: Record<string, unknown>, state: PillState, result?: unknown): string {
  const path = (args.path as string) ?? ""
  const cmd = (args.cmd as string) ?? ""
  const res = result as Record<string, unknown> | undefined
  const lines = res?.lines as number | undefined
  const count = res?.count as number | undefined
  const exitCode = res?.exitCode as number | undefined

  if (toolName === "read_file") return state === "done" ? `Read ${path}${lines ? ` (${lines} lines)` : ""}` : `Reading ${path}`
  if (toolName === "write_file") return state === "done" ? `Wrote ${path}` : `Editing ${path}`
  if (toolName === "delete_file") return state === "done" ? `Deleted ${path}` : `Deleting ${path}`
  if (toolName === "list_files") return state === "done" ? `Scanned (${count ?? "?"} files)` : "Scanning project"
  if (toolName === "run_command") return state === "done" ? `Ran: ${cmd}${exitCode !== undefined ? ` (exit ${exitCode})` : ""}` : `Running: ${cmd}`
  return toolName
}

export function ToolStatusPill({ toolName, args, result, state }: ToolPillProps) {
  const [expanded, setExpanded] = useState(false)
  const icon = ICONS[toolName as ToolName]
  const label = getLabel(toolName, args, state, result)

  const hasContent = state === "done" && result != null

  return (
    <div className="inline-flex flex-col my-1">
      <button
        onClick={() => hasContent && setExpanded((e) => !e)}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono",
          "bg-muted/60 text-muted-foreground border border-border/50",
          "transition-colors hover:bg-muted",
          state === "streaming" && "animate-pulse",
          state === "error" && "border-red-500/50 text-red-400",
          hasContent ? "cursor-pointer" : "cursor-default",
        )}
      >
        {icon}
        <span>{label}</span>
        {hasContent && (expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
      </button>

      {expanded && hasContent && (
        <pre className="mt-1 p-2 text-xs bg-muted rounded-md max-h-48 overflow-auto text-left whitespace-pre-wrap break-all font-mono border border-border/30">
          {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
