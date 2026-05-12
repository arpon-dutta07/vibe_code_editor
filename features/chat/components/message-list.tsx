"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ToolStatusPill } from "./tool-status-pill"
import { cn } from "@/lib/utils"
import type { UIMessage } from "ai"

interface MessageListProps {
  messages: UIMessage[]
  isLoading?: boolean
}

const TOOL_NAMES = new Set(["read_file", "write_file", "delete_file", "list_files", "run_command"])

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex flex-col gap-1 max-w-[90%]",
            msg.role === "user" ? "self-end items-end" : "self-start items-start",
          )}
        >
          {msg.role === "user" && (
            <div className="px-3 py-2 rounded-2xl rounded-br-sm bg-primary text-primary-foreground text-sm">
              {msg.parts.map((part, i) => {
                if (part.type === "text") return <span key={i}>{part.text}</span>
                return null
              })}
            </div>
          )}

          {msg.role === "assistant" && (
            <div className="flex flex-col gap-1">
              {msg.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <div key={i} className="prose prose-sm dark:prose-invert max-w-none text-sm px-1">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                    </div>
                  )
                }

                if (part.type === "step-start") {
                  return null
                }

                if (part.type === "dynamic-tool" || TOOL_NAMES.has(part.type)) {
                  const toolName = part.type === "dynamic-tool"
                    ? (part as { toolName?: string }).toolName ?? "unknown"
                    : part.type
                  const invocation = part as {
                    state: string
                    input?: unknown
                    output?: unknown
                    errorText?: string
                  }
                  const pillState = invocation.state === "output-available"
                    ? "done"
                    : invocation.state === "output-error"
                    ? "error"
                    : "streaming"

                  return (
                    <ToolStatusPill
                      key={i}
                      toolName={toolName}
                      args={(invocation.input as Record<string, unknown>) ?? {}}
                      result={invocation.output}
                      state={pillState}
                    />
                  )
                }

                return null
              })}
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="self-start flex items-center gap-1 px-3 py-2 rounded-2xl rounded-bl-sm bg-muted text-muted-foreground text-sm">
          <span className="animate-bounce delay-0">.</span>
          <span className="animate-bounce delay-100">.</span>
          <span className="animate-bounce delay-200">.</span>
        </div>
      )}
    </div>
  )
}
