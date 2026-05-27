"use client";

import { cn } from "@/lib/utils";

export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 -z-10 pointer-events-none overflow-hidden", className)}>
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
          bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] 
          bg-[size:40px_40px] opacity-[0.45] dark:opacity-100" 
        />
        
        {/* Secondary Dot Pattern */}
        <div 
          className="absolute inset-0 h-full w-full 
          bg-[radial-gradient(var(--border)_1px,transparent_1px)] 
          bg-[size:20px_20px] opacity-[0.35] dark:opacity-100" 
        />
      </div>
    </div>
  );
}
