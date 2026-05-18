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
  const [animating, setAnimating] = useState(false);
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

    setAnimating(true);
    setTimeout(() => setAnimating(false), 520);

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
      className="cursor-pointer p-2 rounded-xl transition-[box-shadow,background-color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 hover:bg-primary/10 hover:shadow-[0_0_0_1.5px_rgba(226,42,42,0.25)] dark:hover:bg-white/6 dark:hover:shadow-[0_0_0_1.5px_rgba(251,113,133,0.22)]"
      onClick={handleToggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className={animating ? "icon-spin-pop block" : "block"}>
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-foreground" />
        ) : (
          <Sun className="h-5 w-5 text-white" />
        )}
      </span>
    </button>
  );
}