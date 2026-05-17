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

  const colorClass =
    state === "error"
      ? "border-red-500/40 text-red-400 bg-red-500/5"
      : state === "streaming"
      ? "border-amber-500/40 text-amber-400 bg-amber-500/5 animate-pulse"
      : toolName === "write_file"
      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
      : toolName === "read_file"
      ? "border-sky-500/40 text-sky-400 bg-sky-500/5"
      : toolName === "list_files"
      ? "border-violet-500/40 text-violet-400 bg-violet-500/5"
      : "border-slate-600/40 text-slate-400 bg-slate-800/40"

  return (
    <div className="inline-flex flex-col my-0.5">
      <button
        onClick={() => hasContent && setExpanded((e) => !e)}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono",
          "border transition-colors",
          colorClass,
          hasContent ? "cursor-pointer hover:brightness-125" : "cursor-default",
        )}
      >
        {icon}
        <span>{label}</span>
        {hasContent && (expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
      </button>

      {expanded && hasContent && (
        <pre className="mt-1 p-2 text-[11px] bg-slate-900 rounded border border-slate-700/50 max-h-48 overflow-auto text-left whitespace-pre-wrap break-all font-mono text-slate-300">
          {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
