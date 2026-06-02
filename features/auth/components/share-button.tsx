"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (typeof window === "undefined") return

    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Profile URL copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
      toast.error("Failed to copy link")
    }
  }

  return (
    <Button 
      onClick={handleShare}
      className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all text-xs font-semibold px-4 py-2 h-9 rounded-lg"
    >
      <Share2 className={`w-3.5 h-3.5 mr-2 ${copied ? "text-emerald-400" : ""}`} />
      {copied ? "Copied!" : "Share"}
    </Button>
  )
}
