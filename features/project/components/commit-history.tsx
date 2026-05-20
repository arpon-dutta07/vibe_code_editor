"use client"

import { useState, useMemo } from "react"
import { GitCommit, MessageSquare, ChevronDown, ChevronRight, User, Bot, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Commit {
  id: string
  message: string
  summary: string
  diff: unknown
  createdAt: Date
  type: "commit"
}

interface ChatConversation {
  id: string
  userContent: string
  assistantContent: string
  createdAt: Date
  type: "conversation"
}

type HistoryItem = Commit | ChatConversation

interface CommitHistoryProps {
  commits: any[]
  messages?: any[]
}

export function CommitHistory({ commits, messages = [] }: CommitHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const history = useMemo(() => {
    // 1. Process Messages into Conversations (Pairs)
    const conversations: ChatConversation[] = []
    
    // Messages are ordered by createdAt desc from the action
    // We want to pair a 'user' message with the 'assistant' message that immediately followed it
    // Since we save them together in createMany, the assistant message usually has the same or slightly later timestamp
    // But in our current query they are desc, so assistant comes before user in the array if timestamps are identical or very close.
    
    const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    
    for (let i = 0; i < sortedMessages.length; i++) {
      const msg = sortedMessages[i]
      if (msg.role === "user") {
        const assistantMsg = sortedMessages[i + 1]?.role === "assistant" ? sortedMessages[i + 1] : null
        
        const getPartsText = (parts: any) => {
          if (typeof parts === 'string') return parts
          if (Array.isArray(parts)) {
            return parts
              .filter((p: any) => p.type === "text")
              .map((p: any) => p.text)
              .join("")
          }
          return ""
        }

        conversations.push({
          id: msg.id,
          userContent: getPartsText(msg.parts),
          assistantContent: assistantMsg ? getPartsText(assistantMsg.parts) : "No response recorded.",
          createdAt: new Date(msg.createdAt),
          type: "conversation"
        })
        
        if (assistantMsg) i++ // skip the assistant msg as it's paired
      }
    }

    // 2. Merge with Commits
    const combined: HistoryItem[] = [
      ...commits.map(c => ({ ...c, type: "commit" as const, createdAt: new Date(c.createdAt) })),
      ...conversations
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return combined
  }, [commits, messages])

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
          <Sparkles className="h-5 w-5 text-zinc-700" />
        </div>
        <p className="text-xs text-zinc-500 font-medium">No activity history yet.</p>
        <p className="text-[10px] text-zinc-600 mt-1 max-w-[180px]">Your file changes and chat history will appear here.</p>
      </div>
    )
  }

  function summarizePrompt(text: string) {
    const cleanText = text.trim().replace(/\n+/g, " ")
    if (cleanText.length <= 60) return cleanText
    return cleanText.substring(0, 57) + "..."
  }

  return (
    <div className="flex flex-col">
      {history.map((item) => {
        const isExpanded = expandedId === item.id
        const isCommit = item.type === "commit"

        if (isCommit) {
          const commit = item as Commit
          const diff = commit.diff as { files?: string[] } | null
          return (
            <div key={commit.id} className="border-b border-zinc-900 last:border-0 group">
              <button
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-4 text-left transition-all",
                  isExpanded ? "bg-zinc-900/30" : "hover:bg-zinc-900/50"
                )}
                onClick={() => setExpandedId(isExpanded ? null : commit.id)}
              >
                <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                  <GitCommit className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest">Code Update</span>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-zinc-300 line-clamp-1">{commit.message}</p>
                </div>
                <div className={cn("mt-1.5 transition-transform duration-200", isExpanded && "rotate-180")}>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-700" />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 ml-9 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                    <p className="text-xs text-zinc-400 leading-relaxed italic">"{commit.summary}"</p>
                  </div>
                  
                  {diff?.files && diff.files.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        Modified Assets
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {diff.files.map((f: string) => (
                          <span key={f} className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-mono">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        } else {
          const conv = item as ChatConversation
          return (
            <div key={conv.id} className="border-b border-zinc-900 last:border-0 group">
              <button
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-4 text-left transition-all",
                  isExpanded ? "bg-zinc-900/30" : "hover:bg-zinc-900/50"
                )}
                onClick={() => setExpandedId(isExpanded ? null : conv.id)}
              >
                <div className="w-6 h-6 rounded-md bg-[#FF2D78]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#FF2D78]/20">
                  <MessageSquare className="h-3.5 w-3.5 text-[#FF2D78]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#FF2D78]/80 uppercase tracking-widest">AI Session</span>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-zinc-300 line-clamp-1">{summarizePrompt(conv.userContent)}</p>
                </div>
                <div className={cn("mt-1.5 transition-transform duration-200", isExpanded && "rotate-180")}>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-700" />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 ml-9 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  {/* User Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                       <User className="h-3 w-3 text-zinc-600" />
                       <span className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Your Request</span>
                    </div>
                    <div className="p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/30">
                       <p className="text-xs text-zinc-500 leading-relaxed whitespace-pre-wrap">{conv.userContent}</p>
                    </div>
                  </div>

                  {/* AI Response Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                       <Bot className="h-3 w-3 text-emerald-500/70" />
                       <span className="text-[9px] text-emerald-500/60 uppercase font-black tracking-widest">AI Response</span>
                    </div>
                    <div className="p-3 bg-emerald-500/[0.03] rounded-lg border border-emerald-500/10">
                       <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{conv.assistantContent}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }
      })}
    </div>
  )
}
