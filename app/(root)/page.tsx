"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Zap,
  Users,
  CheckCircle2,
  Terminal,
  Activity,
  GitBranch,
  Cpu,
  Sparkles,
  TrendingUp,
  Download,
  Palette,
} from "lucide-react";
import { MARKET_ITEMS } from "@/features/market/data/market-items";
import { SYSTEM_ITEMS } from "@/features/systems/data/system-items";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GridShader } from "@/components/ui/grid-shader";
import { Particles } from "@/components/ui/particles";
import { AboutSection } from "@/features/home/about-section";

// ── Token types for code syntax highlighting ──────────────────────────
type TK = "kw" | "fn" | "str" | "bool" | "var" | "op";
interface Token { k: TK; v: string }

const TK_CLR: Record<TK, string> = {
  kw:   "text-rose-400",
  fn:   "text-emerald-400",
  str:  "text-amber-300",
  bool: "text-violet-400",
  var:  "text-sky-300",
  op:   "text-zinc-500",
};

const CODE: Token[][] = [
  [{ k:"kw", v:"const" }, { k:"op", v:" " }, { k:"var", v:"editor" }, { k:"op", v:" = " }, { k:"kw", v:"await" }, { k:"op", v:" VibeCode." }, { k:"fn", v:"init" }, { k:"op", v:"({" }],
  [{ k:"op", v:"  " }, { k:"var", v:"model" }, { k:"op", v:": " }, { k:"str", v:'"vibecode-v3"' }, { k:"op", v:"," }],
  [{ k:"op", v:"  " }, { k:"var", v:"context" }, { k:"op", v:": " }, { k:"var", v:"workspace" }, { k:"op", v:"," }],
  [{ k:"op", v:"  " }, { k:"var", v:"stream" }, { k:"op", v:": " }, { k:"bool", v:"true" }],
  [{ k:"op", v:"});" }],
  [],
  [{ k:"kw", v:"for await" }, { k:"op", v:" (" }, { k:"kw", v:"const" }, { k:"op", v:" " }, { k:"var", v:"token" }, { k:"op", v:" of " }, { k:"var", v:"editor" }, { k:"op", v:") {" }],
  [{ k:"op", v:"  " }, { k:"var", v:"canvas" }, { k:"op", v:"." }, { k:"fn", v:"render" }, { k:"op", v:"(" }, { k:"var", v:"token" }, { k:"op", v:");" }],
  [{ k:"op", v:"}" }],
];

// ── Hero Code Mockup ─────────────────────────────────────────────────
function HeroCodeMockup() {
  const [lines, setLines] = useState(0);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (lines >= CODE.length) return;
    const t = setTimeout(
      () => setLines((n) => n + 1),
      240 + Math.random() * 160
    );
    return () => clearTimeout(t);
  }, [lines]);

  useEffect(() => {
    const t = setInterval(() => setCursor((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[500px]"
    >
      {/* Glow halo */}
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(ellipse, rgba(226,42,42,0.5) 0%, transparent 70%)",
        }}
      />

      {/* Editor window */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-950/95"
        style={{
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-zinc-900/50">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            <GitBranch className="w-3 h-3 text-zinc-600" />
            <span className="text-[11px] font-mono text-zinc-500">main.ts</span>
          </div>
        </div>

        {/* Code lines */}
        <div className="px-6 py-5 font-mono text-[13px] leading-[1.7] min-h-[240px]">
          {CODE.map((line, i) =>
            i < lines ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.16 }}
                className="flex"
              >
                <span className="w-6 shrink-0 text-right text-zinc-700 select-none mr-5 text-[11px] leading-[1.7]">
                  {i + 1}
                </span>
                <span>
                  {line.map((tok, j) => (
                    <span key={j} className={TK_CLR[tok.k]}>
                      {tok.v}
                    </span>
                  ))}
                  {i === lines - 1 && (
                    <span
                      className={cn(
                        "inline-block w-[7px] h-[14px] align-[-2px] bg-rose-400 ml-px transition-opacity duration-75",
                        cursor ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                </span>
              </motion.div>
            ) : null
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 border-t border-white/[0.05] bg-zinc-900/40 text-[11px]">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI active
          </div>
          <span className="font-mono text-zinc-600">TypeScript · UTF-8</span>
        </div>
      </div>

      {/* Floating suggestion badge (appears after typing completes) */}
      {lines >= CODE.length && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="absolute -bottom-5 -right-4 flex items-center gap-2.5 bg-white dark:bg-zinc-900 border border-border dark:border-zinc-700/80 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
        >
          <Cpu className="w-4 h-4 text-primary shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-foreground leading-none mb-0.5">
              3 completions
            </div>
            <div className="text-[10px] text-muted-foreground leading-none">
              ready to apply
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Infinite Marquee ──────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "AI Code Completion",
  "Real-time Collaboration",
  "Multi-Language Support",
  "Smart Debugging",
  "Git Integration",
  "Cloud-Native Storage",
  "Performance Insights",
  "Team Workflows",
  "Live Sync",
  "Secure by Default",
  "Inline Code Review",
  "Context-Aware Suggestions",
];

const InfiniteMarquee = memo(function InfiniteMarquee() {
  const doubled = useMemo(() => [...MARQUEE_ITEMS, ...MARQUEE_ITEMS], []);
  return (
    <div className="py-5 overflow-hidden border-y border-border dark:border-zinc-800 bg-background dark:bg-zinc-950 gpu">
      <motion.div
        className="flex gap-0 shrink-0 w-max"
        animate={{ x: "-50%" }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((label, i) => (
          <span
            key={i}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-zinc-600 whitespace-nowrap px-8"
          >
            {label}
            <span className="ml-8 text-primary/40">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
});

// ── Scroll-scrub word ────────────────────────────────────────────────
const ScrubWord = memo(function ScrubWord({
  word,
  progress,
  index,
  total,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const start = (index / total) * 0.72;
  const end = Math.min(((index + 3) / total) * 0.72, 0.94);
  const opacity = useTransform(progress, [start, end], [0.06, 1]);
  const y = useTransform(progress, [start, end], [10, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-[0.22em] will-change-[transform,opacity]"
    >
      {word}
    </motion.span>
  );
});

// ── Bento card with cursor spotlight ─────────────────────────────────
function BentoCard({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    if (cardRef.current) rectRef.current = cardRef.current.getBoundingClientRect();
  }, []);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [updateRect]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el || !rectRef.current) return;
    const { left, top } = rectRef.current;
    el.style.setProperty("--sx", `${e.clientX - left}px`);
    el.style.setProperty("--sy", `${e.clientY - top}px`);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl group",
        "bg-card dark:bg-zinc-900",
        "border border-border/80 dark:border-zinc-800/80",
        "transition-[box-shadow] duration-500",
        "hover:shadow-[0_12px_48px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
        style={{
          background:
            "radial-gradient(260px circle at var(--sx, -100px) var(--sy, -100px), rgba(226,42,42,0.055), transparent 60%)",
        }}
      />
      {children}
    </motion.div>
  );
}

// ── Skill thread card (ampcode thread-explorer style) ─────────────────
function SkillThreadCard({
  skill,
  delay = 0,
}: {
  skill: (typeof MARKET_ITEMS)[0];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl border border-border/80 dark:border-zinc-800/80 bg-card dark:bg-zinc-900 p-5 hover:border-primary/30 dark:hover:border-rose-500/25 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(226,42,42,0.06)] dark:hover:shadow-[0_8px_32px_rgba(226,42,42,0.12)]"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
          <skill.icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[15px] text-foreground dark:text-zinc-100 truncate group-hover:text-primary dark:group-hover:text-rose-400 transition-colors">
            {skill.title}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground dark:text-zinc-600">
            {skill.category}
          </span>
        </div>
        {skill.trending && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase tracking-wider shrink-0">
            <TrendingUp className="w-2.5 h-2.5" /> Hot
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground dark:text-zinc-500 leading-relaxed mb-4 line-clamp-2">
        {skill.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
          <Download className="w-3 h-3" />
          <span>{skill.downloads} installs</span>
        </div>
        {skill.isFree ? (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Free
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold text-foreground dark:text-zinc-300 tabular-nums">
            ₹{skill.price}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ── Design system palette card ─────────────────────────────────────────
function SystemPaletteCard({
  system,
  delay = 0,
}: {
  system: (typeof SYSTEM_ITEMS)[0];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl border border-border/80 dark:border-zinc-800/80 bg-card dark:bg-zinc-900 overflow-hidden hover:border-zinc-300/60 dark:hover:border-zinc-600/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <div className="h-16 w-full flex">
        {system.palette.map((color, i) => (
          <div
            key={i}
            className="flex-1 transition-all duration-500 group-hover:brightness-110"
            style={{ background: color }}
          />
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-bold text-[15px] text-foreground dark:text-zinc-100 group-hover:text-primary dark:group-hover:text-rose-400 transition-colors">
              {system.name}
            </h3>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.14em] mt-0.5"
              style={{ color: system.accent }}
            >
              {system.tagline}
            </p>
          </div>
          {system.isFree ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0">
              Free
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold text-foreground dark:text-zinc-300 tabular-nums shrink-0">
              ₹{system.price}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground dark:text-zinc-500 leading-relaxed line-clamp-2">
          {system.desc}
        </p>
      </div>
    </motion.div>
  );
}

// ── Testimonial card (13g.fr social proof inspiration) ────────────────
const TESTIMONIALS = [
  {
    quote:
      "Replaced my entire dev setup with VibeCode. AI completions actually understand context across files — not just autocomplete.",
    name: "Aryan Kapoor",
    role: "Senior Frontend Engineer",
    initials: "AK",
    color: "bg-rose-500",
  },
  {
    quote:
      "Shipped our MVP in 3 days instead of 2 weeks. The design system marketplace is a game-changer for small teams.",
    name: "Priya Sharma",
    role: "Indie Developer",
    initials: "PS",
    color: "bg-violet-500",
  },
  {
    quote:
      "The scrape-and-rebuild skill saved us 40 hours on a client redesign. I don't know how I coded without this.",
    name: "Rahul Nair",
    role: "Full-stack Developer",
    initials: "RN",
    color: "bg-emerald-500",
  },
];

function TestimonialCard({
  testimonial,
  delay = 0,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl border border-border/80 dark:border-zinc-800/80 bg-card dark:bg-zinc-900 p-7 flex flex-col gap-6 hover:border-border dark:hover:border-zinc-700/60 hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-300"
    >
      {/* Stars — 13g.fr style rating */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="flex-1 text-[15px] text-foreground/80 dark:text-zinc-300 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/60 dark:border-zinc-800/60">
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0",
            testimonial.color
          )}
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="text-[13px] font-bold text-foreground dark:text-zinc-100 leading-none mb-0.5">
            {testimonial.name}
          </p>
          <p className="text-[11px] text-muted-foreground dark:text-zinc-600 leading-none">
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page constants ────────────────────────────────────────────────────
const STATEMENT =
  "Every line you write is powered by an intelligence that has studied the patterns of millions of developers. It predicts your next move, removes friction, and keeps you in the flow that makes great software.";

const BENEFITS = [
  {
    number: "01",
    title: "Cut boilerplate by nearly half",
    body: "Intelligent completions and template automation remove the repetitive overhead, so you spend time on the logic that actually matters.",
  },
  {
    number: "02",
    title: "Code quality at every commit",
    body: "Real-time linting, automated formatting, and inline best-practice nudges keep the entire codebase consistent as the team grows.",
  },
  {
    number: "03",
    title: "Drop it into your existing stack",
    body: "Git, Docker, CI/CD pipelines, and your extensions connect without extra configuration. It fits where your team already works.",
  },
  {
    number: "04",
    title: "Learn while you build",
    body: "Inline documentation, interactive examples, and personalized suggestions turn everyday coding into a continuous skill-building loop.",
  },
];

const HERO_STATS = [
  { value: "47.2K+", label: "developers" },
  { value: "0.23s", label: "avg feedback" },
  { value: "54", label: "languages" },
];

const FEATURED_SKILLS = MARKET_ITEMS.slice(0, 6);

const FEATURED_SYSTEMS = [
  ...SYSTEM_ITEMS.filter((s) => s.isFree).slice(0, 3),
  ...SYSTEM_ITEMS.filter((s) => !s.isFree).slice(0, 3),
];

// ── Home page ────────────────────────────────────────────────────────
export default function Home() {
  const scrubRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const heroRectRef = useRef<DOMRect | null>(null);

  const { scrollYProgress: scrubProgressRaw } = useScroll({
    target: scrubRef,
    offset: ["start 0.85", "end 0.2"],
  });

  const scrubProgress = useSpring(scrubProgressRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const words = useMemo(() => STATEMENT.split(" "), []);

  const updateHeroRect = useCallback(() => {
    if (heroRef.current) heroRectRef.current = heroRef.current.getBoundingClientRect();
  }, []);

  useEffect(() => {
    updateHeroRect();
    window.addEventListener("resize", updateHeroRect);
    return () => window.removeEventListener("resize", updateHeroRect);
  }, [updateHeroRect]);

  const handleHeroMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const section = heroRef.current;
      if (!section || !heroRectRef.current) return;
      const { left, top, width, height } = heroRectRef.current;
      const nx = (e.clientX - left) / width - 0.5;
      const ny = (e.clientY - top) / height - 0.5;
      heroMouseRef.current = { x: nx, y: ny };
      section.style.setProperty("--gx", `${e.clientX - left}px`);
      section.style.setProperty("--gy", `${e.clientY - top}px`);
      if (heroContentRef.current) {
        requestAnimationFrame(() => {
          if (heroContentRef.current) {
            heroContentRef.current.style.transform = `translate3d(${-nx * 10}px, ${-ny * 7}px, 0)`;
          }
        });
      }
    },
    []
  );

  const handleHeroMouseLeave = useCallback(() => {
    heroMouseRef.current = { x: 0, y: 0 };
    if (heroContentRef.current) {
      heroContentRef.current.style.transform = "translate3d(0px, 0px, 0px)";
    }
  }, []);

  return (
    <div className="overflow-x-hidden w-full max-w-full relative">
      <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={100}
        staticity={40}
        ease={50}
      />

      {/* ── HERO — Asymmetric split ───────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      >
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="animate-orb-1 absolute w-[800px] h-[800px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(226,42,42,0.22) 0%, transparent 70%)",
              filter: "blur(80px)",
              top: "-200px",
              left: "-200px",
              willChange: "transform",
            }}
          />
          <div
            className="animate-orb-3 absolute w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
              bottom: "5%",
              right: "10%",
              willChange: "transform",
            }}
          />
        </div>

        <GridShader mouseRef={heroMouseRef} className="absolute inset-0 w-full h-full" />

        <Particles
          className="absolute inset-0 z-[1] pointer-events-none"
          quantity={80}
          staticity={30}
          ease={50}
        />

        {/* Cursor glow */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(700px circle at var(--gx, -200px) var(--gy, -200px), rgba(226,42,42,0.04), transparent 55%)",
          }}
        />

        {/* Bottom vignette fade */}
        <div className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_110%,transparent,var(--background)_70%)]" />

        {/* Content — asymmetric left/right split */}
        <div
          ref={heroContentRef}
          className="relative z-10 flex-1 flex items-center w-full"
          style={{ transition: "transform 0.18s ease-out", willChange: "transform" }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-0 py-28 lg:min-h-[100dvh] items-center">

            {/* LEFT: text block */}
            <div className="flex flex-col items-start">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary dark:text-rose-400 mb-10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                AI-native editor — public beta
              </motion.div>

              <h1 className="text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.88] tracking-[-0.04em] text-foreground dark:text-white mb-8">
                {["Code faster.", "Think deeper."].map((line, li) => (
                  <span key={line} className="block overflow-hidden pb-[0.05em]">
                    <motion.span
                      className={cn(
                        "block",
                        li === 0 ? "text-primary dark:text-rose-400" : ""
                      )}
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: 0.9,
                        delay: 0.1 + li * 0.13,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.38, ease: "easeOut" }}
                className="max-w-[480px] text-lg text-muted-foreground dark:text-zinc-400 leading-relaxed mb-12"
                style={{ textWrap: "pretty" } as React.CSSProperties}
              >
                VibeCode brings AI-native editing to your browser. Write, debug, and ship without leaving your flow state.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-start gap-4 mb-14"
              >
                <Link href="/dashboard">
                  <Button
                    variant="brand"
                    size="lg"
                    className="h-14 px-10 text-lg rounded-xl shadow-[0_6px_32px_rgba(226,42,42,0.42)] hover:shadow-[0_12px_52px_rgba(226,42,42,0.62)] transition-shadow duration-300 active:scale-[0.98]"
                  >
                    Start building free
                    <ArrowUpRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/market">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 text-lg rounded-xl active:scale-[0.98]"
                  >
                    Explore marketplace
                  </Button>
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
                className="flex items-center gap-10"
              >
                {HERO_STATS.map(({ value, label }, i) => (
                  <div key={label} className="relative">
                    {i > 0 && (
                      <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-border dark:text-zinc-700 select-none">
                        /
                      </span>
                    )}
                    <div className="text-[1.6rem] font-black tabular-nums tracking-tight text-foreground dark:text-white">
                      {value}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-500 mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: code mockup — hidden on mobile */}
            <div className="hidden lg:flex items-center justify-end pr-6">
              <HeroCodeMockup />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground dark:text-zinc-500">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1.5px] h-9 bg-gradient-to-b from-primary/70 via-border/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────── */}
      <InfiniteMarquee />

      {/* ── BENTO GRID — fractional asymmetric ───────────────────── */}
      <section className="py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl"
          >
            <h2
              className="text-5xl md:text-[3.75rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-5"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Everything you need to build without friction.
            </h2>
            <p className="text-lg text-muted-foreground dark:text-zinc-400">
              One environment. All the tools. No context-switching.
            </p>
          </motion.div>

          {/* Grid: 2fr 1fr 1fr on xl, collapses to 1 col on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr] xl:grid-rows-[300px_220px] gap-4">
            {/* Hero card — spans 2 rows on xl */}
            <BentoCard
              delay={0}
              className="xl:row-span-2 group min-h-[360px] xl:min-h-0"
            >
              <div className="absolute inset-0">
                <Image
                  src="https://picsum.photos/seed/darkcode/600/600"
                  alt=""
                  fill
                  className="object-cover opacity-[0.18] dark:opacity-[0.28] grayscale transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 dark:from-zinc-900 dark:via-zinc-900/90 to-transparent" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-10">
                <div className="mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-foreground dark:text-white mb-3">
                    AI-powered completions
                  </h3>
                  <p className="text-muted-foreground dark:text-zinc-400 leading-relaxed max-w-sm text-[15px]">
                    Contextual suggestions trained on millions of codebases. The more you write, the smarter it gets.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["TypeScript", "Python", "Go", "Rust", "+50"].map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 text-xs font-mono rounded-lg bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-400 border border-border dark:border-zinc-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Collaboration — spans 2 cols on md, 2 cols on xl */}
            <BentoCard
              delay={0.07}
              className="md:col-span-2 xl:col-span-2 group min-h-[200px] xl:min-h-0"
            >
              <div className="absolute inset-0">
                <Image
                  src="https://picsum.photos/seed/teamwork/800/300"
                  alt=""
                  fill
                  className="object-cover opacity-[0.12] dark:opacity-[0.18] grayscale transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background dark:from-zinc-900 via-background/75 dark:via-zinc-900/75 to-transparent" />
              </div>
              <div className="relative z-10 h-full flex items-center p-8 gap-7">
                <div className="shrink-0">
                  <div className="inline-flex p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 tracking-tight">
                    Real-time collaboration
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-zinc-400 leading-relaxed max-w-sm">
                    Your entire team in the same editor. Live cursors, inline comments, instant sync.
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Small cards */}
            <BentoCard delay={0.13} className="group min-h-[180px] xl:min-h-0">
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit">
                  <Terminal className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground dark:text-white mb-2 tracking-tight">
                    Smart debugging
                  </h3>
                  <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
                    Advanced breakpoints and AI-guided root cause analysis.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.19} className="group min-h-[180px] xl:min-h-0">
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit">
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground dark:text-white mb-2 tracking-tight">
                    Performance insights
                  </h3>
                  <p className="text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
                    Detailed metrics and optimization suggestions, inline.
                  </p>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── SKILLS TEASER ────────────────────────────────────────── */}
      <section className="py-32 md:py-40 px-6 border-t border-border/40 dark:border-zinc-900 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-rose-400 mb-6">
                <Sparkles className="w-3 h-3" /> Skill Marketplace
              </div>
              <h2
                className="text-5xl md:text-[3.75rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-5"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                Extend your editor with skills.
              </h2>
              <p className="text-lg text-muted-foreground dark:text-zinc-400">
                Purpose-built AI skills for every part of your workflow. Buy once, apply everywhere.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="shrink-0"
            >
              <Link href="/market">
                <Button variant="outline" size="lg" className="rounded-xl gap-2 active:scale-[0.98]">
                  Browse all skills
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {FEATURED_SKILLS.map((skill, i) => (
              <SkillThreadCard key={skill.id} skill={skill} delay={i * 0.06} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-10 pt-8 border-t border-border/40 dark:border-zinc-800/60 flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground dark:text-zinc-600">
              {MARKET_ITEMS.length} skills available · {MARKET_ITEMS.filter((s) => s.isFree).length} free
            </p>
            <Link
              href="/market"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground dark:text-zinc-300 hover:text-primary dark:hover:text-rose-400 transition-colors"
            >
              See full marketplace <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SCRUB TEXT ───────────────────────────────────────────── */}
      <section
        ref={scrubRef}
        className="py-32 md:py-48 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_60%,rgba(226,42,42,0.035),transparent)]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:text-zinc-600 mb-14">
            Built for developers who care
          </p>
          <div
            className="text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.25] tracking-[-0.015em] text-foreground dark:text-white"
            style={{ textWrap: "pretty" } as React.CSSProperties}
          >
            {words.map((word, i) => (
              <ScrubWord
                key={i}
                word={word}
                progress={scrubProgress}
                index={i}
                total={words.length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── DESIGN SYSTEMS TEASER ────────────────────────────────── */}
      <section className="py-32 md:py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold uppercase tracking-[0.16em] text-primary dark:text-rose-400 mb-6">
                <Palette className="w-3 h-3" /> Design Gallery
              </div>
              <h2
                className="text-5xl md:text-[3.75rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-5"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                Visual foundations, ready to apply.
              </h2>
              <p className="text-lg text-muted-foreground dark:text-zinc-400">
                Curated design systems with full color palettes, typography, and component styles. Apply any to your project in one click.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="shrink-0"
            >
              <Link href="/systems">
                <Button variant="outline" size="lg" className="rounded-xl gap-2 active:scale-[0.98]">
                  Browse all systems
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {FEATURED_SYSTEMS.map((system, i) => (
              <SystemPaletteCard key={system.id} system={system} delay={i * 0.06} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-10 pt-8 border-t border-border/40 dark:border-zinc-800/60 flex items-center justify-between"
          >
            <p className="text-sm text-muted-foreground dark:text-zinc-600">
              {SYSTEM_ITEMS.length} design systems · {SYSTEM_ITEMS.filter((s) => s.isFree).length} free
            </p>
            <Link
              href="/systems"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground dark:text-zinc-300 hover:text-primary dark:hover:text-rose-400 transition-colors"
            >
              See full gallery <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS — sticky left panel ─────────────────────────── */}
      <section className="py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-28">
            <div className="lg:w-[38%] lg:sticky lg:top-32 lg:h-fit">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-6"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  Why teams make the switch.
                </h2>
                <p className="text-muted-foreground dark:text-zinc-400 text-lg leading-relaxed mb-10">
                  Real improvements to how you write, review, and ship code — every day.
                </p>
                <Link href="/dashboard">
                  <Button
                    variant="brand"
                    size="lg"
                    className="rounded-xl shadow-[0_4px_24px_rgba(226,42,42,0.25)] hover:shadow-[0_6px_36px_rgba(226,42,42,0.4)] transition-shadow duration-300 active:scale-[0.98]"
                  >
                    Start building free
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            <div className="lg:w-[62%] space-y-0">
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={benefit.number}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "group py-12 border-b border-border/40 dark:border-zinc-800/80",
                    "last:border-0 first:pt-0"
                  )}
                >
                  <div className="flex gap-8 items-start">
                    <span className="benefit-number text-[4.5rem] font-black leading-none text-[#f0d5bc] dark:text-zinc-800/70 select-none shrink-0 tabular-nums">
                      {benefit.number}
                    </span>
                    <div className="pt-2">
                      <h3 className="benefit-title text-2xl font-bold text-foreground dark:text-white mb-3 tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground dark:text-zinc-400 text-lg leading-relaxed">
                        {benefit.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — 13g.fr social proof inspiration ──────── */}
      <section className="py-32 md:py-40 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_35%_at_50%_80%,rgba(226,42,42,0.03),transparent)]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground dark:text-zinc-600 mb-5">
              From developers who switched
            </p>
            <h2
              className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Developers love it.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER — 3 compact cards + link to full page ─── */}
      <section className="py-32 md:py-40 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-4">
              Start free. Scale with add-ons.
            </h2>
            <p className="text-lg text-muted-foreground dark:text-zinc-400 max-w-md mx-auto">
              Buy skills and design systems individually, or bundle them for more.
            </p>
          </motion.div>

          {/* Compact 3-column teaser */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border/80 dark:border-zinc-800 bg-card dark:bg-zinc-900 p-6 flex flex-col gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground dark:text-white">Starter</span>
                </div>
                <div className="text-3xl font-black text-foreground dark:text-white tracking-tight">Free</div>
                <p className="text-xs text-muted-foreground mt-1">3 projects · 32K context</p>
              </div>
              <ul className="space-y-2 flex-1">
                {["3 free skills included", "6 free design systems", "Community support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-in">
                <Button variant="outline" className="w-full text-xs h-8">Get started</Button>
              </Link>
            </motion.div>

            {/* Pro — highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border-2 border-primary/40 bg-card dark:bg-zinc-900 p-6 flex flex-col gap-4 shadow-[0_0_48px_rgba(226,42,42,0.12)] dark:shadow-[0_0_48px_rgba(226,42,42,0.2)] relative"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most popular
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground dark:text-white">Pro</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-foreground dark:text-white tracking-tight">₹999</span>
                  <span className="text-sm text-muted-foreground pb-1">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">10 projects · 128K context</p>
              </div>
              <ul className="space-y-2 flex-1">
                {["5 premium skills included", "All design systems unlocked", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-in">
                <Button className="w-full text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_rgba(226,42,42,0.3)] hover:shadow-[0_6px_28px_rgba(226,42,42,0.45)] transition-all">
                  Get started
                </Button>
              </Link>
            </motion.div>

            {/* Studio */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border/80 dark:border-zinc-800 bg-card dark:bg-zinc-900 p-6 flex flex-col gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground dark:text-white">Studio</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-foreground dark:text-white tracking-tight">₹2,499</span>
                  <span className="text-sm text-muted-foreground pb-1">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Unlimited projects · 256K context</p>
              </div>
              <ul className="space-y-2 flex-1">
                {["All 12 skills included", "All 18 design systems", "Dedicated support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-in">
                <Button variant="outline" className="w-full text-xs h-8">Contact sales</Button>
              </Link>
            </motion.div>
          </div>

          {/* CTA to full pricing page */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
            >
              See full pricing — bundles, skills & context windows
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <AboutSection />

      {/* ── FINAL CTA — horizontal split, left-aligned ───────────── */}
      <section className="py-32 md:py-48 px-6 relative overflow-hidden bg-zinc-900 dark:bg-zinc-950">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://picsum.photos/seed/night/1920/1080"
            alt=""
            fill
            className="object-cover opacity-[0.06] grayscale"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 dark:from-zinc-950 via-zinc-900/96 dark:via-zinc-950/96 to-zinc-900/80 dark:to-zinc-950/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_15%_50%,rgba(226,42,42,0.08),transparent)]" />
          <Particles
            className="absolute inset-0 z-0 pointer-events-none"
            quantity={60}
            staticity={30}
            ease={50}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-24 items-center">
          {/* Left: headline + CTAs */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="text-5xl md:text-[4.5rem] font-black tracking-[-0.03em] text-white leading-[0.94] mb-8"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Ready to code with intelligence?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-lg text-zinc-400 mb-10 max-w-md leading-relaxed"
              style={{ textWrap: "pretty" } as React.CSSProperties}
            >
              Join developers who have replaced their old editor with something that thinks alongside them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link href="/dashboard">
                <Button
                  variant="brand"
                  size="lg"
                  className="h-12 px-8 text-base rounded-xl shadow-[0_4px_32px_rgba(226,42,42,0.38)] hover:shadow-[0_6px_44px_rgba(226,42,42,0.55)] transition-shadow duration-300 active:scale-[0.98]"
                >
                  Start building free
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/market">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base rounded-xl border-white/20 text-white hover:bg-white/8 bg-transparent dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/8 active:scale-[0.98]"
                >
                  Explore marketplace
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: stat cluster */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:flex flex-col gap-4 shrink-0"
          >
            {[
              { value: "47.2K", label: "developers active" },
              { value: "2.3M", label: "lines completed" },
              { value: "98.7%", label: "uptime SLA" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col p-6 rounded-2xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm min-w-[200px]"
                style={{
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <span className="text-3xl font-black tabular-nums text-white tracking-tight">
                  {value}
                </span>
                <span className="text-sm text-zinc-500 mt-1">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
