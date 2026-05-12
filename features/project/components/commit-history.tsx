"use client"

import { useState } from "react"
import { GitCommit, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Commit {
  id: string
  message: string
  summary: string
  diff: unknown
  createdAt: Date
}

interface CommitHistoryProps {
  commits: Commit[]
}

export function CommitHistory({ commits }: CommitHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (commits.length === 0) {
    return (
      <p className="px-3 py-4 text-xs text-muted-foreground text-center">No commits yet.</p>
    )
  }

  return (
    <div className="flex flex-col">
      {commits.map((commit) => {
        const isExpanded = expandedId === commit.id
        const diff = commit.diff as { files?: string[] } | null
        return (
          <div key={commit.id} className="border-b last:border-0">
            <button
              className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-accent/50 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : commit.id)}
            >
              <GitCommit className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate font-medium">{commit.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(commit.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
                </p>
              </div>
              {isExpanded ? <ChevronDown className="h-3 w-3 mt-1 shrink-0" /> : <ChevronRight className="h-3 w-3 mt-1 shrink-0" />}
            </button>

            {isExpanded && (
              <div className={cn("px-3 pb-2 text-xs text-muted-foreground space-y-1")}>
                <p>{commit.summary}</p>
                {diff?.files && diff.files.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 font-mono">
                    {diff.files.map((f: string) => <li key={f}>{f}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
