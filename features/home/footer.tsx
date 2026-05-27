"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const NAVIGATE_LINKS = [
  { label: "Market", href: "/market" },
  { label: "Systems", href: "/systems" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

const CONNECT_LINKS = [
  { label: "GitHub", href: "#" },
  { label: "Twitter / X", href: "#" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="relative bg-background dark:bg-zinc-950 overflow-hidden border-t border-border/50 dark:border-zinc-900">
      {/* ── Decorative orb (IntegratedBio sphere inspiration) ── */}
      <div
        className="pointer-events-none absolute right-[-8%] top-[-20%] w-[55%] aspect-square rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,42,42,0.20) 0%, rgba(140,20,20,0.10) 35%, transparent 68%)",
          filter: "blur(90px)",
        }}
      />
      {/* Inner sphere ring */}
      <div
        className="pointer-events-none absolute right-[2%] top-[-5%] w-[42%] aspect-square rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(226,42,42,0.06) 0%, transparent 60%)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}
      />

      {/* ── Upper section ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-start gap-14 lg:gap-0 lg:justify-between">

          {/* Left: identity + tagline + CTA */}
          <div className="max-w-[280px]">
            <div className="flex items-center gap-2.5 mb-7">
              <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center shrink-0">
                <span className="text-[11px] font-black text-white leading-none">V</span>
              </div>
              <span className="text-sm font-bold text-foreground dark:text-white tracking-tight">VibeCode</span>
            </div>

            <p className="text-[13px] text-muted-foreground dark:text-zinc-550 leading-relaxed mb-9">
              AI-native code editor for developers who value speed, flow, and creative control.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border dark:border-white/12 text-[13px] font-semibold text-foreground dark:text-white hover:bg-muted/40 dark:hover:bg-white/[0.07] hover:border-foreground/20 dark:hover:border-white/20 transition-all duration-200 active:scale-[0.97]"
            >
              Start building free
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Right: nav columns */}
          <div className="flex gap-16 sm:gap-24">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-muted-foreground dark:text-zinc-600 mb-6">
                Navigate
              </p>
              <nav className="flex flex-col gap-4">
                {NAVIGATE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-muted-foreground hover:text-foreground dark:text-zinc-500 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.26em] text-muted-foreground dark:text-zinc-600 mb-6">
                Connect
              </p>
              <nav className="flex flex-col gap-4">
                {CONNECT_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-muted-foreground hover:text-foreground dark:text-zinc-500 dark:hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
                <span className="block h-px bg-border/40 dark:bg-zinc-800/60 w-full my-1" />
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-muted-foreground/80 hover:text-foreground dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom: giant wordmark (IntegratedBio style) ──────── */}
      <div className="relative z-10">
        {/* Copyright — floats above wordmark */}
        <div className="px-8 sm:px-12 mb-1">
          <p className="text-[10px] text-muted-foreground/60 dark:text-zinc-700">
            © {new Date().getFullYear()} VibeCode. All rights reserved.
          </p>
        </div>

        {/* The massive wordmark */}
        <p
          className="font-black text-foreground/5 dark:text-white/[0.03] leading-none pl-4 sm:pl-6 select-none"
          style={{
            fontSize: "clamp(5.5rem, 16.5vw, 18rem)",
            letterSpacing: "-0.04em",
          }}
        >
          VibeCode
        </p>
      </div>
    </footer>
  );
}
