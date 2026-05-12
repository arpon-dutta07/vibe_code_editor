"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageList } from "./message-list"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizonal, StopCircle } from "lucide-react"

interface ChatPanelProps {
  projectId: string
  onFilesChanged?: () => void
}

export function ChatPanel({ projectId, onFilesChanged }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, stop, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { projectId },
    }),
    onFinish: () => {
      onFilesChanged?.()
    },
  })

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
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Describe what you want to build..."
          className="min-h-[60px] max-h-[200px] resize-none text-sm"
          disabled={isLoading}
        />

        {isLoading ? (
          <Button type="button" size="icon" variant="outline" onClick={() => stop()} title="Stop generation">
            <StopCircle className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" size="icon" disabled={!input.trim()} onClick={handleSend} title="Send">
            <SendHorizonal className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
