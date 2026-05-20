"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageList } from "./message-list"
import { Button } from "@/components/ui/button"
import { ArrowUp, StopCircle } from "lucide-react"
import { getChatMessages } from "@/features/project/actions"
import { cn } from "@/lib/utils"

interface ChatPanelProps {
  projectId: string
  onFilesChanged?: () => void
}

export function ChatPanel({ projectId, onFilesChanged }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, stop, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { projectId },
    }),
    onFinish: () => {
      onFilesChanged?.()
    },
  })

  useEffect(() => {
    getChatMessages(projectId).then((history) => {
      if (history.length > 0) setMessages(history)
      setHistoryLoaded(true)
    }).catch(() => setHistoryLoaded(true))
  }, [projectId])

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInput("")
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        {!historyLoaded ? (
          <div className="flex items-center justify-center h-full text-zinc-700 text-[11px] font-mono">
            <span className="animate-pulse">initializing secure session...</span>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="p-3 border-t border-zinc-900 bg-[#0a0a0a]">
        <div className="bg-[#141414] border border-zinc-800 rounded-xl p-2.5 flex items-end gap-2 focus-within:border-zinc-700 transition-colors">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none shadow-none focus:ring-0 outline-none text-zinc-300 text-xs placeholder:text-zinc-700 resize-none py-1.5 px-1 leading-relaxed"
            disabled={isLoading}
          />
          {isLoading ? (
            <Button
              type="button"
              size="icon"
              onClick={() => stop()}
              className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
            >
              <StopCircle className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              disabled={!input.trim()}
              onClick={handleSend}
              className={cn(
                "shrink-0 w-8 h-8 rounded-lg transition-all duration-200",
                input.trim() 
                  ? "bg-[#FF2D78] text-white shadow-[0_0_15px_rgba(255,45,120,0.3)] hover:scale-105 active:scale-95" 
                  : "bg-zinc-800 text-zinc-500 opacity-50 cursor-not-allowed"
              )}
            >
              <ArrowUp className="h-4 w-4 stroke-[3px]" />
            </Button>
          )}
        </div>
        <p className="text-[10px] text-zinc-700 text-center mt-1.5 select-none uppercase tracking-widest font-medium">
          press enter to send · shift+enter for new line
        </p>
      </div>
    </div>
  )
}

