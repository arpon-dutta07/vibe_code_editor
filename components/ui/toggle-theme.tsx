"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => { ready: Promise<void>; finished: Promise<void> };
};

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggle = (e: React.MouseEvent) => {
    const next = theme === "light" ? "dark" : "light";
    const doc = document as DocWithVT;

    const root = document.documentElement;
    root.style.setProperty("--ripple-x", `${e.clientX}px`);
    root.style.setProperty("--ripple-y", `${e.clientY}px`);

    setSpinning(true);
    setTimeout(() => setSpinning(false), 700);

    if (!doc.startViewTransition) {
      setTheme(next);
      return;
    }

    doc.startViewTransition(() => {
      setTheme(next);
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className="cursor-pointer p-2 rounded-xl hover:bg-muted/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      onClick={handleToggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span
        className="block transition-transform duration-700 ease-out"
        style={{ transform: spinning ? "rotate(180deg) scale(1.2)" : "rotate(0deg) scale(1)" }}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-foreground" />
        ) : (
          <Sun className="h-5 w-5 text-white" />
        )}
      </span>
    </button>
  );
}