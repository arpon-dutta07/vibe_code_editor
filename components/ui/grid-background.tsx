"use client";

import { cn } from "@/lib/utils";

export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10 pointer-events-none", className)}>
      {/* Primary Grid Lines */}
      <div 
        className="absolute inset-0 h-full w-full bg-white dark:bg-black 
        bg-[linear-gradient(to_right,#80808025_1px,transparent_1px),linear-gradient(to_bottom,#80808025_1px,transparent_1px)] 
        bg-[size:40px_40px]" 
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
        bg-gradient-to-b from-transparent via-white/50 to-white dark:via-black/50 dark:to-black" 
      />
      
      {/* Stronger Center Mask */}
      <div 
        className="absolute inset-0 h-full w-full 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_30%,transparent_100%)]" 
      />
    </div>
  );
}
