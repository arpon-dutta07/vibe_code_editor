"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Smartphone, Tablet, Monitor, Laptop, ExternalLink, RefreshCw, RotateCcw, RotateCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface DevicePreviewPanelProps {
  srcDoc: string
  mode: "mobile" | "tablet" | "laptop" | "desktop"
  isLandscape: boolean
  refreshTrigger: number
}

type DeviceMode = "mobile" | "tablet" | "laptop" | "desktop"

const DEVICE_CONFIGS = {
  mobile: { width: 375, height: 812, label: "Mobile" },
  tablet: { width: 768, height: 1024, label: "Tablet" },
  laptop: { width: 1280, height: 800, label: "Laptop" },
  desktop: { width: "100%", height: "100%", label: "Desktop" },
}

export function DevicePreviewPanel({ srcDoc, mode, isLandscape, refreshTrigger }: DevicePreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement & { _blobUrl?: string }>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Calculate scale based on container width
  const updateScale = useCallback(() => {
    if (!panelRef.current) return
    const padding = 80 // More padding for Lovable style
    const containerWidth = Math.max(100, panelRef.current.clientWidth - padding)
    const containerHeight = Math.max(100, panelRef.current.clientHeight - padding)

    if (mode === "desktop") {
      setScale(1)
      return
    }

    const config = DEVICE_CONFIGS[mode]
    let targetWidth = config.width as number
    let targetHeight = config.height as number

    if (isLandscape && (mode === "mobile" || mode === "tablet")) {
      [targetWidth, targetHeight] = [targetHeight, targetWidth]
    }

    const scaleW = containerWidth / targetWidth
    const scaleH = containerHeight / targetHeight
    
    const newScale = Math.min(1, scaleW, scaleH)
    setScale(newScale)
  }, [mode, isLandscape])

  // Update scale on mount, resize, and mode change
  useEffect(() => {
    updateScale()
    const observer = new ResizeObserver(updateScale)
    if (panelRef.current) observer.observe(panelRef.current)
    window.addEventListener("resize", updateScale)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateScale)
    }
  }, [updateScale])

  // Auto-refresh iframe when srcDoc or refreshTrigger changes
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc
    }
  }, [srcDoc, refreshTrigger])

  const currentConfig = DEVICE_CONFIGS[mode]
  const displayWidth = isLandscape && (mode === "mobile" || mode === "tablet") ? currentConfig.height : currentConfig.width
  const displayHeight = isLandscape && (mode === "mobile" || mode === "tablet") ? currentConfig.width : currentConfig.height

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-[#0a0a0a]" 
         style={{ 
           fontFamily: "'Inter', sans-serif",
         }}>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
           style={{ 
             backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
             backgroundSize: "32px 32px"
           }} 
      />

      {/* Preview Content Area */}
      <div 
        ref={panelRef}
        className="flex-1 flex items-center justify-center min-h-0 overflow-hidden relative"
      >
        <div 
          className={cn(
            "relative transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)]",
            mode === "desktop" ? "w-full h-full" : "flex items-center justify-center"
          )}
          style={mode !== "desktop" ? {
            width: displayWidth,
            height: displayHeight,
            transform: `scale(${scale})`,
            transformOrigin: "center center"
          } : undefined}
        >
          {/* Label and dimensions - Minimal style */}
          {mode !== "desktop" && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-forwards">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                {mode} {isLandscape ? "Landscape" : "Portrait"}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="text-[10px] font-medium text-white/20 font-mono">
                {displayWidth} × {displayHeight}
              </span>
            </div>
          )}

          <div className={cn(
            "w-full h-full bg-white transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden",
            mode === "mobile" && (isLandscape ? "rounded-[32px]" : "rounded-[48px]"),
            mode === "tablet" && "rounded-[24px]",
            mode === "laptop" && "rounded-xl",
            mode === "desktop" && "rounded-none",
            mode !== "desktop" && "shadow-[0_0_80px_rgba(0,0,0,0.4),0_0_20px_rgba(0,0,0,0.2)] border-[8px] border-zinc-900 ring-1 ring-white/10"
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
          
          {/* Device specific decorations - Minimalist Notch */}
          {mode === "mobile" && !isLandscape && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-zinc-900 rounded-2xl z-20 flex items-center justify-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <div className="w-8 h-1.5 rounded-full bg-zinc-800" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
