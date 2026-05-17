"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageList } from "./message-list"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizonal, StopCircle } from "lucide-react"
import { getChatMessages } from "@/features/project/actions"

interface ChatPanelProps {
  projectId: string
  onFilesChanged?: () => void
}

export function ChatPanel({ projectId, onFilesChanged }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        {!historyLoaded ? (
          <div className="flex items-center gap-2 p-4 text-xs font-mono text-slate-600">
            <span className="animate-pulse">loading history...</span>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-slate-700/50 bg-slate-900/30">
        <div className="flex items-start gap-2">
          <span className="text-emerald-500 font-mono text-sm mt-2.5 select-none shrink-0">$</span>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="describe what you want to build..."
            className="min-h-[56px] max-h-[180px] resize-none text-sm font-mono bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-slate-600 text-slate-100 p-0 pt-2"
            disabled={isLoading}
          />
          {isLoading ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => stop()}
              title="Stop generation"
              aria-label="Stop generation"
              className="mt-1 shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={!input.trim()}
              onClick={handleSend}
              title="Send message"
              aria-label="Send message"
              className="mt-1 shrink-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-20"
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-[10px] text-slate-700 font-mono mt-1.5 ml-5">
          enter ↵ send · shift+enter newline
        </p>
      </div>
    </div>
  )
}
