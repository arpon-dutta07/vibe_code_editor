"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Smartphone, Tablet, Monitor, ExternalLink, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface DevicePreviewPanelProps {
  srcDoc: string
  onRefresh?: () => void
}

type DeviceMode = "mobile" | "tablet" | "desktop"

export function DevicePreviewPanel({ srcDoc, onRefresh }: DevicePreviewPanelProps) {
  const [mode, setMode] = useState<DeviceMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("preview-device-mode") as DeviceMode) || "desktop"
    }
    return "desktop"
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Calculate scale based on container width
  const updateScale = useCallback(() => {
    if (!panelRef.current) return
    const panelWidth = panelRef.current.clientWidth - 48 // 24px padding on each side
    const panelHeight = panelRef.current.clientHeight - 48

    let targetWidth = panelWidth
    let targetHeight = panelHeight

    if (mode === "mobile") {
      targetWidth = 375
      targetHeight = 812 // Standard mobile height
    } else if (mode === "tablet") {
      targetWidth = 768
      targetHeight = 1024 // Standard tablet height
    }

    // Only scale down if the panel is smaller than the target width
    // In desktop mode, we want it to be responsive, so scale is 1
    const newScale = mode === "desktop" ? 1 : Math.min(1, panelWidth / targetWidth, panelHeight / targetHeight)
    setScale(newScale)
  }, [mode])

  // Update scale on mount, resize, and mode change
  useEffect(() => {
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [updateScale])

  // Auto-refresh iframe when srcDoc changes
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc
    }
  }, [srcDoc])

  // Sync mode to localStorage
  useEffect(() => {
    localStorage.setItem("preview-device-mode", mode)
  }, [mode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      const key = e.key.toLowerCase()
      if (key === "m") setMode("mobile")
      if (key === "t") setMode("tablet")
      if (key === "d") setMode("desktop")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    if (onRefresh) {
      onRefresh()
    } else if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc
    }
    setTimeout(() => setIsRefreshing(false), 600)
  }, [onRefresh, srcDoc])

  const openInNewTab = () => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(srcDoc)
      newWindow.document.close()
    }
  }

  const getTargetWidth = () => {
    if (mode === "mobile") return 375
    if (mode === "tablet") return 768
    return "100%"
  }

  const getTargetHeight = () => {
    if (mode === "mobile") return 812
    if (mode === "tablet") return 1024
    return "100%"
  }

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-[#08091a]" 
         style={{ 
           fontFamily: "'Inter', sans-serif",
           backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
           backgroundSize: "24px 24px"
         }}>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#00bcd4] opacity-[0.05] blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#6366f1] opacity-[0.05] blur-[80px] pointer-events-none rounded-full" />

      {/* Toolbar Container */}
      <div className="flex justify-center p-4 z-10 shrink-0">
        <div className="glass-toolbar flex items-center gap-1 p-1.5 rounded-[40px] backdrop-blur-[16px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] shadow-xl">
          <DeviceButton 
            active={mode === "mobile"} 
            onClick={() => setMode("mobile")} 
            icon={<Smartphone size={16} />} 
            label="Mobile" 
          />
          <DeviceButton 
            active={mode === "tablet"} 
            onClick={() => setMode("tablet")} 
            icon={<Tablet size={16} />} 
            label="Tablet" 
          />
          <DeviceButton 
            active={mode === "desktop"} 
            onClick={() => setMode("desktop")} 
            icon={<Monitor size={16} />} 
            label="Desktop" 
          />
          
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          
          <button 
            onClick={handleRefresh}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f0f2ff] transition-all",
              isRefreshing && "animate-spin"
            )}
            title="Refresh Preview"
          >
            <RefreshCw size={16} />
          </button>
          
          <button 
            onClick={openInNewTab}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[#f0f2ff] transition-all"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Preview Content Area */}
      <div 
        ref={panelRef}
        className="flex-1 flex flex-col items-center justify-center p-6 min-h-0 overflow-hidden relative"
      >
        <div 
          className={cn(
            "relative flex flex-col items-center origin-top transition-transform duration-300 ease-out",
            mode !== "desktop" && "my-auto"
          )}
          style={{ 
            width: mode === "desktop" ? "100%" : getTargetWidth(), 
            height: mode === "desktop" ? "100%" : getTargetHeight(),
            transform: `scale(${scale})`
          }}
        >
          {/* Label below iframe */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[11px] font-medium text-[#00bcd4]/60 uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {getTargetWidth()}px — {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </div>

          <div className={cn(
            "w-full h-full bg-white overflow-hidden transition-all duration-300",
            mode === "mobile" && "rounded-[40px] border-[2px] border-[rgba(255,255,255,0.15)] shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,188,212,0.1)]",
            mode === "tablet" && "rounded-[24px] border-[2px] border-[rgba(255,255,255,0.15)] shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,188,212,0.1)]",
            mode === "desktop" && "rounded-lg border-[1px] border-[rgba(255,255,255,0.1)] shadow-2xl"
          )}
          >
            <iframe
              ref={iframeRef}
              srcDoc={srcDoc}
              className="w-full h-full border-none bg-white"
              title="Device Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .glass-toolbar {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>
    </div>
  )
}

function DeviceButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-[30px] text-xs font-medium transition-all duration-300",
        active 
          ? "bg-[rgba(0,188,212,0.2)] text-[#00bcd4] border border-[rgba(0,188,212,0.5)] shadow-[0_0_12px_rgba(0,188,212,0.3)]" 
          : "text-[rgba(255,255,255,0.5)] bg-transparent hover:text-[#f0f2ff] hover:bg-[rgba(255,255,255,0.08)] border border-transparent"
      )}
    >
      <span className={cn("transition-transform duration-300", active && "scale-110")}>
        {icon}
      </span>
      <span className="hidden sm:inline uppercase tracking-wider text-[10px]">{label}</span>
    </button>
  )
}
