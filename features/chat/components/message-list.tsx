"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ToolStatusPill } from "./tool-status-pill"
import { CliGenerating } from "./cli-generating"
import { cn } from "@/lib/utils"
import type { UIMessage } from "ai"

interface MessageListProps {
  messages: UIMessage[]
  isLoading?: boolean
}

const TOOL_NAMES = new Set(["read_file", "write_file", "delete_file", "list_files", "run_command"])

function Timestamp() {
  return (
    <span className="text-[10px] text-slate-600 font-mono select-none">
      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
    </span>
  )
}

function UserBubble({ parts }: { parts: UIMessage["parts"] }) {
  const text = parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("")

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2 mb-0.5">
        <Timestamp />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">you</span>
      </div>
      <div className="relative group">
        <div className="absolute -left-3 top-2 w-1.5 h-1.5 rounded-full bg-indigo-500/70" />
        <div className="px-3 py-2 rounded-2xl rounded-br-none bg-indigo-600/20 border border-indigo-500/30 text-sm text-slate-100 max-w-[280px] break-words">
          {text}
        </div>
      </div>
    </div>
  )
}

function AssistantBubble({ parts }: { parts: UIMessage["parts"] }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest">ai</span>
        <Timestamp />
      </div>

      <div className="flex flex-col gap-1.5 max-w-full">
        {/* Tool pills row */}
        {parts.some((p) => p.type === "dynamic-tool" || TOOL_NAMES.has(p.type)) && (
          <div className="flex flex-wrap gap-1.5">
            {parts.map((part, i) => {
              if (part.type === "step-start") return null
              if (part.type !== "dynamic-tool" && !TOOL_NAMES.has(part.type)) return null
              const toolName =
                part.type === "dynamic-tool"
                  ? (part as { toolName?: string }).toolName ?? "unknown"
                  : part.type
              const inv = part as { state: string; input?: unknown; output?: unknown }
              const pillState =
                inv.state === "output-available" ? "done"
                : inv.state === "output-error" ? "error"
                : "streaming"
              return (
                <ToolStatusPill
                  key={i}
                  toolName={toolName}
                  args={(inv.input as Record<string, unknown>) ?? {}}
                  result={inv.output}
                  state={pillState}
                />
              )
            })}
          </div>
        )}

        {/* Text parts */}
        {parts.map((part, i) => {
          if (part.type !== "text") return null
          const text = (part as { type: "text"; text: string }).text
          if (!text.trim()) return null
          return (
            <div
              key={i}
              className={cn(
                "rounded-2xl rounded-bl-none px-3.5 py-2.5",
                "bg-slate-800/60 border border-slate-700/50",
                "text-sm text-slate-100",
                "prose prose-sm prose-invert max-w-none",
                "[&_pre]:bg-slate-900 [&_pre]:border [&_pre]:border-slate-700/60 [&_pre]:rounded-lg [&_pre]:text-xs",
                "[&_code]:text-emerald-400 [&_code]:bg-slate-900/80 [&_code]:px-1 [&_code]:rounded",
                "[&_a]:text-indigo-400 [&_a:hover]:text-indigo-300",
                "[&_strong]:text-white",
                "[&_h1]:text-base [&_h2]:text-sm [&_h3]:text-xs",
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex flex-col gap-5 p-4 pb-2">
      {/* Header bar */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 text-sm font-bold font-mono">$</span>
          </div>
          <p className="text-xs text-slate-500 font-mono text-center">
            describe what you want to build
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex flex-col",
            msg.role === "user" ? "items-end" : "items-start",
          )}
        >
          {msg.role === "user" && <UserBubble parts={msg.parts} />}
          {msg.role === "assistant" && <AssistantBubble parts={msg.parts} />}
        </div>
      ))}

      {isLoading && (
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest">ai</span>
          </div>
          <div className="rounded-2xl rounded-bl-none bg-slate-800/60 border border-slate-700/50 overflow-hidden">
            <CliGenerating />
          </div>
        </div>
      )}
    </div>
  )
}
