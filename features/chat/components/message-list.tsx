"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ToolStatusPill } from "./tool-status-pill"
import { cn } from "@/lib/utils"
import { FileText, ChevronRight } from "lucide-react"
import type { UIMessage } from "ai"

interface MessageListProps {
  messages: UIMessage[]
  isLoading?: boolean
}

const TOOL_NAMES = new Set(["read_file", "write_file", "delete_file", "list_files", "run_command"])

function Timestamp({ className }: { className?: string }) {
  return (
    <span className={cn("text-[10px] text-zinc-600 font-medium tabular-nums", className)}>
      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
    </span>
  )
}

function VibeCodeAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-[#FF2D78] flex items-center justify-center shrink-0 shadow-lg shadow-[#FF2D78]/20 border border-white/10">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l9 4.9V17.1L12 22l-9-4.9V6.9L12 2z" />
      </svg>
    </div>
  )
}

function FileChip({ name }: { name: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] text-zinc-500 font-mono group hover:border-zinc-700 transition-colors cursor-default">
      <FileText size={12} className="text-[#FF2D78]" />
      <span className="truncate max-w-[200px]">{name}</span>
    </div>
  )
}

function UserBubble({ parts }: { parts: UIMessage["parts"] }) {
  const text = parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("")

  return (
    <div className="flex flex-col items-end gap-1.5 max-w-[85%] self-end">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-br-sm p-3 shadow-sm">
        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
      <Timestamp className="mr-1" />
    </div>
  )
}

function AssistantBubble({ parts }: { parts: UIMessage["parts"] }) {
  return (
    <div className="flex items-start gap-3 max-w-[90%]">
      <VibeCodeAvatar />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">AI</span>
          <Timestamp />
        </div>

        <div className="flex flex-col gap-1.5 max-w-full">
          {/* Tool pills / File chips */}
          {parts.some((p) => p.type === "dynamic-tool" || TOOL_NAMES.has(p.type)) && (
            <div className="flex flex-wrap gap-2">
              {parts.map((part, i) => {
                if (part.type === "step-start") return null
                if (part.type !== "dynamic-tool" && !TOOL_NAMES.has(part.type)) return null
                
                const toolName = part.type === "dynamic-tool"
                    ? (part as { toolName?: string }).toolName ?? "unknown"
                    : part.type
                const inv = part as { state: string; input?: any; output?: any }
                
                // If it's a file write, show a file chip
                if (toolName === "write_file" && inv.input?.file_path) {
                  return <FileChip key={i} name={inv.input.file_path} />
                }

                const pillState =
                  inv.state === "output-available" ? "done"
                  : inv.state === "output-error" ? "error"
                  : "streaming"
                  
                return (
                  <ToolStatusPill
                    key={i}
                    toolName={toolName}
                    args={inv.input ?? {}}
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
                  "bg-[#141414] border border-zinc-800 rounded-2xl rounded-tl-sm p-3",
                  "text-[13px] text-zinc-300 leading-relaxed shadow-sm",
                  "prose prose-sm prose-invert max-w-none",
                  "prose-p:m-0 prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-zinc-800 prose-pre:my-2 prose-pre:rounded-xl",
                  "prose-code:text-[#FF2D78] prose-code:bg-zinc-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
                  "prose-strong:text-white prose-strong:font-semibold"
                )}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <VibeCodeAvatar />
          </div>
          <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-[0.2em]">
            System ready. Awaiting instructions.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className="flex flex-col"
        >
          {msg.role === "user" && <UserBubble parts={msg.parts} />}
          {msg.role === "assistant" && <AssistantBubble parts={msg.parts} />}
        </div>
      ))}

      {isLoading && (
        <div className="flex items-start gap-3">
          <VibeCodeAvatar />
          <div className="bg-[#141414] border border-zinc-800 rounded-2xl rounded-tl-sm p-3 py-4 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D78] animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D78] opacity-50 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D78] opacity-30 animate-bounce" />
          </div>
        </div>
      )}
    </div>
  )
}

