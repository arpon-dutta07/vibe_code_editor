"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
  delay?: number;
}

export function TypingAnimation({
  text,
  duration = 100,
  delay = 2000,
  className,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text.charAt(index));
          setIndex((prev) => prev + 1);
        } else {
          // Pause at the end
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (index > 0) {
          setDisplayedText((prev) => prev.slice(0, -1));
          setIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
        }
      }
    };

    const timeout = setTimeout(
      handleTyping,
      isDeleting ? duration / 2 : duration
    );

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text, duration, delay]);

  return (
    <div className="flex items-center justify-center">
      <h1 className={cn("font-bold tracking-tight", className)}>
        {displayedText}
        <span className="ml-1 inline-block w-[3px] h-[0.9em] bg-current animate-pulse align-middle" />
      </h1>
    </div>
  );
}
