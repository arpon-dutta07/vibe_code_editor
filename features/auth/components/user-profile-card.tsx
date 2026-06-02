"use client"

import { useState } from "react"
import { Rotating3DObject } from "./rotating-3d-object"

interface UserProfileCardProps {
  displayName: string
  usernameHandle: string
  profileUserId: string
  matrixCells: number[]
  msgsCount: number
  threadsCount: number
  addedLines: number
  removedLines: number
  changedLines: number
  avatarLetter: string
}

export function UserProfileCard({
  displayName,
  usernameHandle,
  profileUserId,
  matrixCells,
  msgsCount,
  threadsCount,
  addedLines,
  removedLines,
  changedLines,
  avatarLetter,
}: UserProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="w-full md:w-[380px] shrink-0 relative group select-none cursor-default h-fit md:self-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer subtle rainbow glow around the card (spec-compliant, zero ugly rotating boxes) */}
      <div 
        className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-700 blur-2xl z-0"
        style={{ 
          background: isHovered 
            ? "radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.12), rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.06))" 
            : "transparent",
          transform: isHovered ? "scale(1.03)" : "scale(1.0)"
        }}
      />
      
      {/* Premium holographic/sticker-like glow overlay around the borders */}
      <div 
        className="absolute -inset-[1px] rounded-3xl pointer-events-none transition-all duration-500 z-0"
        style={{
          background: isHovered 
            ? "linear-gradient(135deg, rgba(244, 63, 94, 0.4) 0%, rgba(16, 185, 129, 0.3) 50%, rgba(59, 130, 246, 0.4) 100%)" 
            : "transparent"
        }}
      />
      
      <div 
        className={`bg-card/95 border rounded-3xl backdrop-blur-3xl relative overflow-hidden p-8 flex flex-col min-h-[560px] z-10 transition-all duration-500 ${
          isHovered 
            ? 'border-transparent shadow-[0_24px_100px_rgba(244,63,94,0.12)]' 
            : 'border-border dark:border-zinc-800/80 shadow-[0_24px_80px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.6)]'
        }`}
        style={{
          boxShadow: isHovered 
            ? "0 0 25px rgba(244, 63, 94, 0.15), 0 0 50px rgba(16, 185, 129, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.02)" 
            : undefined
        }}
      >
        {/* Real-time rotating 3D wireframe sphere in the background (only scales up and gets active on hover) */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-700 pointer-events-none overflow-hidden rounded-3xl"
          style={{ 
            opacity: isHovered ? 0.6 : 0.05,
            transform: isHovered ? "scale(1.05)" : "scale(1.0)"
          }}
        >
          <Rotating3DObject isHovered={isHovered} />
        </div>

        {/* Premium Holographic Sticker/Foil shine overlay across the card face on hover */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(135deg,rgba(255,255,255,0)_20%,rgba(244,63,94,0.06)_40%,rgba(16,185,129,0.08)_50%,rgba(59,130,246,0.06)_60%,rgba(255,255,255,0)_80%)] bg-[length:200%_200%] animate-[shimmer_5s_infinite_linear]"
          style={{
            mixBlendMode: "overlay"
          }}
        />

        {/* Cyberpunk vertical borders (Fidelity spec detail) */}
        <div 
          className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[7px] font-mono tracking-[0.3em] text-zinc-600/60 pointer-events-none uppercase whitespace-nowrap select-none z-10"
          style={{ transform: "rotate(-90deg) translateX(-50%)" }}
        >
          Activity
        </div>
        
        <div 
          className="absolute right-[-15px] top-1/2 -translate-y-1/2 rotate-90 origin-right text-[6.5px] font-mono tracking-[0.25em] text-zinc-600/50 pointer-events-none uppercase whitespace-nowrap select-none z-10"
          style={{ transform: "rotate(90deg) translateX(50%)" }}
        >
          {profileUserId}
        </div>

        {/* Glowing 3D Organic Sphere (CSS orb animation matching screenshot) */}
        <div className="absolute top-6 right-6 w-36 h-36 rounded-full overflow-hidden opacity-60 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-amber-500/10 to-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <div 
            className="absolute inset-2 bg-background dark:bg-zinc-950 rounded-full border border-border dark:border-zinc-800/60 shadow-inner"
            style={{ 
              backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(244,63,94,0.18), transparent)' 
            }} 
          />
          <div className="absolute inset-6 bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.15),transparent_60%)] rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        {/* Logo/Brand Watermark inside card (Spec fix: using our site "vibecode") */}
        <div className="flex items-center gap-2 mb-8 opacity-50 relative z-10">
          <span className="text-[13px] font-bold tracking-tight text-zinc-700 dark:text-zinc-300 font-mono">vibecode</span>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        </div>

        {/* Huge dynamic profile Avatar initial */}
        <div className="relative mb-6 z-10">
          <div className="w-[100px] h-[100px] rounded-full bg-[#3c965c] flex items-center justify-center text-[44px] font-medium text-white shadow-2xl shadow-emerald-950/50 select-none border border-emerald-400/25">
            {avatarLetter}
          </div>
        </div>

        {/* Names & Username */}
        <div className="mb-8 relative z-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-1.5 font-serif select-all">
            {displayName}
          </h1>
          <p className="text-[14px] text-zinc-500 font-mono select-all">
            @{usernameHandle}
          </p>
        </div>

        {/* Interactive heatmap grid matrix (Matches screenshot matrix perfectly) */}
        <div className="mb-8 relative z-10">
          <div className="grid grid-cols-20 gap-[3px] p-[2px] bg-zinc-200/60 dark:bg-zinc-950/60 rounded-lg border border-border dark:border-zinc-900/50 w-fit">
            {matrixCells.map((intensity, idx) => (
              <div 
                key={idx}
                className={`w-[11px] h-[11px] rounded-[2px] transition-colors duration-500 ${
                  intensity > 0 
                    ? 'bg-rose-500/90 border border-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.5)]' 
                    : 'bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-950'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card stats footer grid */}
        <div className="mt-auto space-y-5 border-t border-border dark:border-zinc-900 pt-6 relative z-10">
          
          {/* Row: MSGS and THREADS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-foreground select-all">{msgsCount}</span>
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Msgs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-foreground select-all">{threadsCount}</span>
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Threads</span>
            </div>
          </div>

          {/* Grid: ADDED, REMOVED, CHANGED (styled beautifully as spec) */}
          <div className="grid grid-cols-3 gap-2 text-[11px] font-mono font-semibold pt-1 border-t border-border dark:border-zinc-900/40">
            <div className="flex flex-col">
              <span className="text-emerald-500 dark:text-emerald-400 select-all">+{addedLines.toLocaleString()}</span>
              <span className="text-[8px] font-bold tracking-wider text-zinc-400 dark:text-zinc-600 uppercase mt-0.5">Added</span>
            </div>
            <div className="flex flex-col">
              <span className="text-rose-600 dark:text-rose-500 select-all">-{removedLines.toLocaleString()}</span>
              <span className="text-[8px] font-bold tracking-wider text-zinc-400 dark:text-zinc-600 uppercase mt-0.5">Removed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-amber-600 dark:text-amber-500 select-all">-{changedLines.toLocaleString()}</span>
              <span className="text-[8px] font-bold tracking-wider text-zinc-400 dark:text-zinc-600 uppercase mt-0.5">Changed</span>
            </div>
          </div>

        </div>

      </div>
      
      {/* Global CSS Shimmer Keyframe */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0%; }
          100% { background-position: -200% 0%; }
        }
      `}</style>
    </div>
  )
}
