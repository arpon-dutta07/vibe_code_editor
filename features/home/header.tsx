"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import UserButton from "../auth/components/user-button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    setFlashKey((k) => k + 1);
    setFlashing(true);
    const t = setTimeout(() => setFlashing(false), 420);
    return () => clearTimeout(t);
  }, [scrolled]);

  const navLinks = [
    { href: "/market", label: "Market" },
    { href: "/systems", label: "Systems" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 pt-3">
      <motion.div
        animate={{ maxWidth: scrolled ? 840 : 1180 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative mx-auto rounded-2xl pointer-events-auto",
          "flex items-center justify-between",
          "px-4 py-2.5",
          "transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300",
          scrolled
            ? [
                "bg-white/38 dark:bg-zinc-950/45",
                "backdrop-blur-3xl saturate-[1.8]",
                "border border-white/50 dark:border-white/12",
                "shadow-[0_8px_40px_-4px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.55)]",
                "dark:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)]",
              ].join(" ")
            : [
                "bg-white/12 dark:bg-white/5",
                "backdrop-blur-md",
                "border border-white/30 dark:border-white/10",
                "shadow-[0_2px_20px_rgba(0,0,0,0.04)]",
              ].join(" ")
        )}
      >
        {/* ── Beam outline + shine ───────────────────────────────────── */}
        {flashKey > 0 && (
          <motion.div
            key={`beam-${flashKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.95, ease: "easeInOut", times: [0, 0.36, 1] }}
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
            aria-hidden
          >
            {/* All-around glow — inset + outer ring, no solid color edges */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/35 dark:ring-rose-400/35 shadow-[0_0_22px_6px_rgba(226,42,42,0.18),inset_0_0_22px_4px_rgba(226,42,42,0.16)] dark:shadow-[0_0_22px_6px_rgba(251,113,133,0.2),inset_0_0_22px_4px_rgba(251,113,133,0.18)]" />

            {/* Shiny sweep — bright highlight races left → right */}
            <motion.div
              initial={{ x: "-110%" }}
              animate={{ x: "210%" }}
              transition={{ duration: 0.62, delay: 0.08, ease: [0.4, 0, 0.55, 1] }}
              className="absolute inset-y-0 w-28 -skew-x-12"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
              }}
            />
          </motion.div>
        )}

        {/* ── Content — brightness flash highlights every element ─────── */}
        <motion.div
          key={`content-${flashKey}`}
          animate={
            flashKey > 0
              ? { filter: ["brightness(1)", "brightness(1.22)", "brightness(1)"] }
              : { filter: "brightness(1)" }
          }
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="flex items-center justify-between w-full"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logo.svg"
              alt="VibeCode"
              height={28}
              width={28}
              className={cn("shrink-0 transition-transform duration-300 group-hover:rotate-12", flashing && "rotate-12")}
            />
            <span className="font-bold text-[14px] tracking-[-0.01em] text-white mix-blend-difference hidden sm:block">
              VibeCode
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className="relative px-4 py-2 rounded-xl text-[13px] font-medium tracking-[0.005em] text-white mix-blend-difference"
              >
                {label}
                {pathname === href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-3 bottom-1.5 h-[1.5px] rounded-full bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Mobile nav */}
            <div className="flex md:hidden items-center gap-0.5 mr-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white mix-blend-difference"
                >
                  {label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
            <UserButton />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
