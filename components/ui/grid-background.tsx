"use client";

import { cn } from "@/lib/utils";

export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10 pointer-events-none overflow-hidden", className)}>
      {/* Breathing Radial Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] 
        bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,rgba(139,92,246,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.2)_0%,rgba(124,58,237,0)_70%)] 
        animate-breathe-glow" 
      />

      {/* Primary Grid Lines with subtle shift */}
      <div 
        className="absolute -inset-[100px] h-[calc(100%+200px)] w-[calc(100%+200px)] bg-white dark:bg-zinc-950 
        bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] 
        bg-[size:40px_40px] animate-grid-shift" 
      />
      
      {/* Secondary Dot Pattern */}
      <div 
        className="absolute inset-0 h-full w-full 
        bg-[radial-gradient(#80808025_1px,transparent_1px)] 
        bg-[size:20px_20px]" 
      />

      {/* Radial Gradient Mask for Fade Effect */}
      <div 
        className="absolute inset-0 h-full w-full 
        bg-gradient-to-b from-transparent via-white/50 to-white dark:via-zinc-950/50 dark:to-zinc-950" 
      />
      
      {/* Stronger Center Mask */}
      <div 
        className="absolute inset-0 h-full w-full 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_30%,transparent_100%)]" 
      />
    </div>
  );
}
