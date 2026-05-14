"use client";

import { cn } from "@/lib/utils";

export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10 pointer-events-none overflow-hidden", className)}>
      {/* 
        Animated Grid and Dots
        - Slow diagonal parallax drift (animate-grid-drift)
        - Primary lines (40px)
        - Secondary dots (20px)
      */}
      <div className="absolute -inset-[100px] h-[calc(100%+200px)] w-[calc(100%+200px)] animate-grid-drift">
        {/* Primary Grid Lines */}
        <div 
          className="absolute inset-0 h-full w-full 
          bg-[linear-gradient(to_right,#80808025_1px,transparent_1px),linear-gradient(to_bottom,#80808025_1px,transparent_1px)] 
          bg-[size:40px_40px]" 
        />
        
        {/* Secondary Dot Pattern */}
        <div 
          className="absolute inset-0 h-full w-full 
          bg-[radial-gradient(#80808025_1px,transparent_1px)] 
          bg-[size:20px_20px]" 
        />
      </div>

      {/* Radial Gradient Mask for Fade Effect */}
      <div 
        className="absolute inset-0 h-full w-full 
        bg-gradient-to-b from-transparent via-zinc-50/50 to-zinc-50 dark:via-zinc-950/50 dark:to-zinc-950" 
      />
      
      {/* Stronger Center Mask */}
      <div 
        className="absolute inset-0 h-full w-full 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_30%,transparent_100%)]
        [-webkit-mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_30%,transparent_100%)]" 
      />
    </div>
  );
}
