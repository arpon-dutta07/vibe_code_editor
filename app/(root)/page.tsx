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
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MARKET_ITEMS } from "@/features/market/data/market-items";
import { SYSTEM_ITEMS } from "@/features/systems/data/system-items";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GridShader } from "@/components/ui/grid-shader";
import { Particles } from "@/components/ui/particles";
import { AboutSection } from "@/features/home/about-section";

gsap.registerPlugin(ScrollTrigger);

// ── Token types ────────────────────────────────────────────────────────
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

// ── Hero Code Mockup ──────────────────────────────────────────────────
function HeroCodeMockup() {
  const [lines, setLines] = useState(0);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (lines >= CODE.length) return;
    const t = setTimeout(() => setLines((n) => n + 1), 240 + Math.random() * 160);
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
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none blur-3xl opacity-25"
        style={{ background: "radial-gradient(ellipse, rgba(226,42,42,0.5) 0%, transparent 70%)" }}
      />
      <div
        className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-950/95"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)" }}
      >
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
                    <span key={j} className={TK_CLR[tok.k]}>{tok.v}</span>
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
        <div className="flex items-center justify-between px-5 py-2 border-t border-white/[0.05] bg-zinc-900/40 text-[11px]">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI active
          </div>
          <span className="font-mono text-zinc-600">TypeScript · UTF-8</span>
        </div>
      </div>
      {lines >= CODE.length && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="absolute -bottom-5 -right-4 flex items-center gap-2.5 bg-white dark:bg-zinc-900 border border-border dark:border-zinc-700/80 rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
        >
          <Cpu className="w-4 h-4 text-primary shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-foreground leading-none mb-0.5">3 completions</div>
            <div className="text-[10px] text-muted-foreground leading-none">ready to apply</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Dual-direction Marquee — 13g.fr double-row inspiration ────────────
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
  const doubled  = useMemo(() => [...MARQUEE_ITEMS, ...MARQUEE_ITEMS], []);
  const reversed = useMemo(() => [...MARQUEE_ITEMS, ...MARQUEE_ITEMS].reverse(), []);

  return (
    <div className="overflow-hidden bg-background dark:bg-zinc-950 border-y border-border/40 dark:border-zinc-900">
      {/* Row 1 — left */}
      <div className="py-3.5 overflow-hidden border-b border-border/20 dark:border-zinc-900/60">
        <motion.div
          className="flex shrink-0 w-max"
          animate={{ x: "-50%" }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((label, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground/80 dark:text-zinc-600 whitespace-nowrap px-8">
              {label}<span className="ml-8 text-primary/30 dark:text-rose-500/25">/</span>
            </span>
          ))}
        </motion.div>
      </div>
      {/* Row 2 — right */}
      <div className="py-3.5 overflow-hidden">
        <motion.div
          className="flex shrink-0 w-max"
          initial={{ x: "-50%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {reversed.map((label, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/70 dark:text-zinc-400 whitespace-nowrap px-8">
              {label}<span className="ml-8 text-border dark:text-zinc-800">/</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

// ── Scroll-scrub word ─────────────────────────────────────────────────
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
  const start   = (index / total) * 0.72;
  const end     = Math.min(((index + 3) / total) * 0.72, 0.94);
  const opacity = useTransform(progress, [start, end], [0.05, 1]);
  const y       = useTransform(progress, [start, end], [14, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-[0.22em] will-change-[transform,opacity]"
    >
      {word}
    </motion.span>
  );
});

// ── Bento card — cursor spotlight + sharp editorial corners ───────────
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
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden group",
        "bg-card dark:bg-zinc-950 border border-border/80 dark:border-zinc-800/80",
        "transition-[border-color,box-shadow] duration-500",
        "hover:border-border dark:hover:border-zinc-700 hover:shadow-[0_16px_56px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_16px_56px_rgba(0,0,0,0.55)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
        style={{
          background: "radial-gradient(280px circle at var(--sx, -100px) var(--sy, -100px), rgba(226,42,42,0.05) 0%, transparent 60%)",
        }}
      />
      {children}
    </motion.div>
  );
}

// ── Skill list row — IntegratedBio numbered list style ────────────────
const SkillListRow = memo(function SkillListRow({
  skill,
  index,
}: {
  skill: (typeof MARKET_ITEMS)[0];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-border/40 dark:border-zinc-800/60"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-5 py-7 group text-left"
        aria-expanded={open}
      >
        <span className="text-[10px] font-mono tabular-nums text-muted-foreground dark:text-zinc-700 w-7 shrink-0 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors duration-200">
          <skill.icon className="w-4 h-4 text-zinc-500 dark:text-zinc-500 group-hover:text-primary transition-colors duration-200" />
        </div>
        <span className="flex-1 text-[17px] font-bold text-foreground dark:text-zinc-200 group-hover:text-primary dark:group-hover:text-rose-400 transition-colors duration-200 min-w-0 truncate">
          {skill.title}
        </span>
        <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-700 shrink-0">
          {skill.category}
        </span>
        {skill.trending && (
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase tracking-wider shrink-0">
            <TrendingUp className="w-2.5 h-2.5" /> Hot
          </span>
        )}
        {skill.isFree ? (
          <span className="text-[11px] font-bold text-emerald-500 shrink-0 tabular-nums">Free</span>
        ) : (
          <span className="text-[11px] font-bold text-foreground dark:text-zinc-300 shrink-0 tabular-nums">₹{skill.price}</span>
        )}
        <span className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-500 dark:group-hover:border-zinc-500 flex items-center justify-center shrink-0 transition-colors duration-200">
          <span className={cn("block w-2 h-[1.5px] bg-zinc-500 transition-all duration-300", open ? "rotate-90" : "")} />
          <span className="absolute block w-2 h-[1.5px] bg-zinc-500" />
        </span>
      </button>
      <div
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="overflow-hidden">
          <div className="pl-[4.5rem] pb-7 pr-2">
            <p className="text-muted-foreground dark:text-zinc-400 text-[15px] leading-relaxed max-w-lg mb-4">
              {skill.description}
            </p>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground dark:text-zinc-600">
              <Download className="w-3 h-3" /> {skill.downloads} installs
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ── Design system palette card — taller, more editorial ───────────────
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
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden border border-border/80 dark:border-zinc-800/80 bg-card dark:bg-zinc-900 hover:border-zinc-300/60 dark:hover:border-zinc-600/50 transition-all duration-400 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
    >
      {/* Tall palette strip — image scale on hover */}
      <div className="h-28 w-full flex overflow-hidden">
        {system.palette.map((color, i) => (
          <div
            key={i}
            className="flex-1 transition-all duration-700 group-hover:brightness-110 group-hover:scale-[1.04] origin-bottom"
            style={{ background: color }}
          />
        ))}
        {/* Gradient overlay so text below reads well */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      </div>

      <div className="p-5 pt-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-bold text-[15px] text-foreground dark:text-zinc-100 group-hover:text-primary dark:group-hover:text-rose-400 transition-colors">
              {system.name}
            </h3>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mt-0.5" style={{ color: system.accent }}>
              {system.tagline}
            </p>
          </div>
          {system.isFree ? (
            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0">
              Free
            </span>
          ) : (
            <span className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold text-foreground dark:text-zinc-300 tabular-nums shrink-0">
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

// ── Benefit row — icon chip + hover-reveal stat + left accent line ───
function BenefitRow({ benefit }: { benefit: (typeof BENEFITS)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="benefit-row group relative pl-5 py-10 border-b border-border/50 dark:border-zinc-800/50 last:border-0 first:pt-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left accent line — scaleY draws down on hover */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px] bg-brand origin-top"
        initial={false}
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-x-6 items-start">
        {/* Giant number — color springs to brand rose/red on hover, otherwise uses border color */}
        <motion.span
          className="benefit-num font-black leading-[0.85] tabular-nums select-none text-right shrink-0"
          style={{ fontSize: "clamp(3.25rem, 5.5vw, 5.5rem)" }}
          animate={{ color: hovered ? "var(--benefit-num-hover)" : "var(--border)" }}
          transition={{ type: "spring", stiffness: 160, damping: 24 }}
        >
          {benefit.number}
        </motion.span>

        {/* Title + body */}
        <div className="pt-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center border border-border/80 dark:border-zinc-700/50 bg-muted/30 dark:bg-zinc-800/60 group-hover:border-brand/25 group-hover:bg-brand/5 transition-colors duration-300">
              <benefit.icon className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors duration-300" />
            </div>
            <h3 className="benefit-title text-xl md:text-2xl font-bold text-foreground dark:text-white tracking-tight leading-tight">
              {benefit.title}
            </h3>
          </div>
          <p className="benefit-body text-muted-foreground dark:text-zinc-500 text-base leading-relaxed max-w-lg pl-11">
            {benefit.body}
          </p>
        </div>

        {/* Stat — slides in from right on hover, desktop only */}
        <motion.div
          className="hidden md:flex flex-col items-end justify-start pt-3 shrink-0 min-w-[96px]"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 16 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-2xl font-black tabular-nums text-foreground dark:text-white tracking-tight leading-none mb-1">
            {benefit.stat}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-600 text-right leading-tight">
            {benefit.statLabel}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ── Testimonial — dark editorial, 13g.fr horizontal layout ───────────
const TESTIMONIALS = [
  {
    quote: "Replaced my entire dev setup with VibeCode. AI completions actually understand context across files — not just autocomplete.",
    name: "Aryan Kapoor",
    role: "Senior Frontend Engineer",
    initials: "AK",
    color: "bg-rose-500",
  },
  {
    quote: "Shipped our MVP in 3 days instead of 2 weeks. The design system marketplace is a game-changer for small teams.",
    name: "Priya Sharma",
    role: "Indie Developer",
    initials: "PS",
    color: "bg-violet-500",
  },
  {
    quote: "The scrape-and-rebuild skill saved us 40 hours on a client redesign. I don't know how I coded without this.",
    name: "Rahul Nair",
    role: "Full-stack Developer",
    initials: "RN",
    color: "bg-emerald-500",
  },
];

// ── Page constants ────────────────────────────────────────────────────
const STATEMENT =
  "Every line you write is powered by an intelligence that has studied the patterns of millions of developers. It predicts your next move, removes friction, and keeps you in the flow that makes great software.";

const BENEFITS = [
  {
    number: "01",
    title: "Cut boilerplate by nearly half",
    body: "Intelligent completions and template automation remove the repetitive overhead, so you spend time on the logic that actually matters.",
    icon: Zap,
    stat: "47%",
    statLabel: "less keystrokes",
  },
  {
    number: "02",
    title: "Code quality at every commit",
    body: "Real-time linting, automated formatting, and inline best-practice nudges keep the entire codebase consistent as the team grows.",
    icon: CheckCircle2,
    stat: "3.2×",
    statLabel: "fewer review cycles",
  },
  {
    number: "03",
    title: "Drop it into your existing stack",
    body: "Git, Docker, CI/CD pipelines, and your extensions connect without extra configuration. It fits where your team already works.",
    icon: GitBranch,
    stat: "< 4min",
    statLabel: "avg setup time",
  },
  {
    number: "04",
    title: "Learn while you build",
    body: "Inline documentation, interactive examples, and personalized suggestions turn everyday coding into a continuous skill-building loop.",
    icon: Activity,
    stat: "2.1×",
    statLabel: "faster onboarding",
  },
];

const HERO_STATS = [
  { value: "47.2K+", label: "developers" },
  { value: "0.23s",  label: "avg feedback" },
  { value: "54",     label: "languages" },
];

const FEATURED_SKILLS = MARKET_ITEMS.slice(0, 6);

const FEATURED_SYSTEMS = [
  ...SYSTEM_ITEMS.filter((s) => s.isFree).slice(0, 3),
  ...SYSTEM_ITEMS.filter((s) => !s.isFree).slice(0, 3),
];

// ── Home page ─────────────────────────────────────────────────────────
export default function Home() {
  const scrubRef    = useRef<HTMLDivElement>(null);
  const heroRef     = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroMouseRef   = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const heroRectRef    = useRef<DOMRect | null>(null);
  const bentoRef    = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

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
  const underlineScale = useTransform(
    scrubProgress,
    [
      ((words.length - 3) / words.length) * 0.72,
      Math.min(((words.length + 2) / words.length) * 0.72, 0.94),
    ],
    [0, 1]
  );

  // ── Bento image scale-fade on scroll (GSAP ImageScaleFade) ──────────
  useGSAP(() => {
    const imgs = gsap.utils.toArray<HTMLElement>(".bento-img");
    imgs.forEach((img) => {
      gsap.fromTo(
        img,
        { scale: 0.90, opacity: 0.6 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top 90%",
            end: "top 30%",
            scrub: 1.2,
          },
        }
      );
    });
  }, { scope: bentoRef });

  // ── Benefits GSAP stagger reveal (ScrollPin paradigm) ───────────────
  useGSAP(() => {
    const rows = gsap.utils.toArray<HTMLElement>(".benefit-row");
    rows.forEach((row) => {
      const num   = row.querySelector(".benefit-num");
      const title = row.querySelector(".benefit-title");
      const body  = row.querySelector(".benefit-body");
      gsap.from([num, title, body].filter(Boolean), {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: row,
          start: "top 86%",
          once: true,
        },
      });
    });
  }, { scope: benefitsRef });

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
      const nx = (e.clientX - left) / width  - 0.5;
      const ny = (e.clientY - top)  / height - 0.5;
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

      {/* ── HERO — untouched ─────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[100dvh] flex flex-col overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="animate-orb-1 absolute w-[800px] h-[800px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(226,42,42,0.22) 0%, transparent 70%)",
              filter: "blur(80px)",
              top: "-200px",
              left: "-200px",
              willChange: "transform",
            }}
          />
          <div
            className="animate-orb-3 absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
              bottom: "5%",
              right: "10%",
              willChange: "transform",
            }}
          />
        </div>

        <GridShader mouseRef={heroMouseRef} className="absolute inset-0 w-full h-full" />
        <Particles className="absolute inset-0 z-[1] pointer-events-none" quantity={80} staticity={30} ease={50} />

        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: "radial-gradient(700px circle at var(--gx, -200px) var(--gy, -200px), rgba(226,42,42,0.04), transparent 55%)",
          }}
        />
        <div className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_110%,transparent,var(--background)_70%)]" />

        <div
          ref={heroContentRef}
          className="relative z-10 flex-1 flex items-center w-full"
          style={{ transition: "transform 0.18s ease-out", willChange: "transform" }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-0 py-28 lg:min-h-[100dvh] items-center">
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
                      className={cn("block", li === 0 ? "text-primary dark:text-rose-400" : "")}
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.9, delay: 0.1 + li * 0.13, ease: [0.16, 1, 0.3, 1] }}
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
                  <Button variant="brand" size="lg" className="h-14 px-10 text-lg rounded-xl shadow-[0_6px_32px_rgba(226,42,42,0.42)] hover:shadow-[0_12px_52px_rgba(226,42,42,0.62)] transition-shadow duration-300 active:scale-[0.98]">
                    Start building free <ArrowUpRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/market">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-xl active:scale-[0.98]">
                    Explore marketplace
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
                className="flex items-center gap-10"
              >
                {HERO_STATS.map(({ value, label }, i) => (
                  <div key={label} className="relative">
                    {i > 0 && (
                      <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-border dark:text-zinc-700 select-none">/</span>
                    )}
                    <div className="text-[1.6rem] font-black tabular-nums tracking-tight text-foreground dark:text-white">{value}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="hidden lg:flex items-center justify-end pr-6">
              <HeroCodeMockup />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground dark:text-zinc-500">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1.5px] h-9 bg-gradient-to-b from-primary/70 via-border/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── MARQUEE — dual direction, dark forced ────────────────── */}
      <InfiniteMarquee />

      {/* ── BENTO GRID — sharp editorial cards, GSAP image scale ─── */}
      <section className="py-32 md:py-48 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-3xl"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-muted-foreground dark:text-zinc-600 mb-6">
              What's inside
            </p>
            <h2
              className="text-5xl md:text-[3.75rem] font-black tracking-[-0.03em] text-foreground dark:text-white leading-[1.0] mb-5"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Everything you need to build without friction.
            </h2>
            <p className="text-lg text-muted-foreground dark:text-zinc-500">
              One environment. All the tools. No context-switching.
            </p>
          </motion.div>

          <div
            ref={bentoRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr] xl:grid-rows-[300px_220px] gap-px bg-border/40 dark:bg-zinc-800/40 grid-flow-dense"
          >
            {/* Hero card — row-span-2 */}
            <BentoCard delay={0} className="xl:row-span-2 group min-h-[360px] xl:min-h-0">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/darkcode/600/600"
                  alt=""
                  fill
                  className="bento-img object-cover opacity-[0.06] dark:opacity-30 grayscale mix-blend-luminosity transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-transparent dark:from-zinc-950 dark:via-zinc-950/85 dark:to-transparent" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-10">
                <div className="mb-6">
                  <div className="inline-flex p-3 bg-brand/10 border border-brand/20 mb-5">
                    <Code2 className="w-6 h-6 text-primary dark:text-rose-400" />
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
                    <span key={lang} className="px-3 py-1 text-xs font-mono bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-400 border border-border/50 dark:border-zinc-750">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Collaboration — spans 2 cols */}
            <BentoCard delay={0.07} className="md:col-span-2 xl:col-span-2 group min-h-[200px] xl:min-h-0">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/teamwork/800/300"
                  alt=""
                  fill
                  className="bento-img object-cover opacity-[0.05] dark:opacity-20 grayscale mix-blend-luminosity transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-transparent" />
              </div>
              <div className="relative z-10 h-full flex items-center p-8 gap-7">
                <div className="shrink-0">
                  <div className="inline-flex p-3 bg-blue-500/10 border border-blue-500/20">
                    <Users className="w-6 h-6 text-blue-550 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 tracking-tight">Real-time collaboration</h3>
                  <p className="text-sm text-muted-foreground dark:text-zinc-400 leading-relaxed max-w-sm">
                    Your entire team in the same editor. Live cursors, inline comments, instant sync.
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Smart debugging */}
            <BentoCard delay={0.13} className="group min-h-[180px] xl:min-h-0">
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="inline-flex p-2.5 bg-amber-500/10 border border-amber-500/20 w-fit">
                  <Terminal className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground dark:text-white mb-2 tracking-tight">Smart debugging</h3>
                  <p className="text-xs text-muted-foreground dark:text-zinc-500 leading-relaxed">
                    Advanced breakpoints and AI-guided root cause analysis.
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Performance insights */}
            <BentoCard delay={0.19} className="group min-h-[180px] xl:min-h-0">
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="inline-flex p-2.5 bg-emerald-500/10 border border-emerald-500/20 w-fit">
                  <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground dark:text-white mb-2 tracking-tight">Performance insights</h3>
                  <p className="text-xs text-muted-foreground dark:text-zinc-500 leading-relaxed">
                    Detailed metrics and optimization suggestions, inline.
                  </p>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ── SKILLS TEASER — sticky left + numbered list ───────────── */}
      <section className="py-32 md:py-48 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-28">

            {/* Sticky left */}
            <div className="lg:w-[38%] lg:sticky lg:top-32 lg:h-fit">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-[0.18em] text-primary dark:text-rose-400 mb-7">
                  <Sparkles className="w-3 h-3" /> Skill Marketplace
                </div>
                <h2
                  className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-6"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  Extend your editor with skills.
                </h2>
                <p className="text-muted-foreground dark:text-zinc-400 text-lg leading-relaxed mb-10">
                  Purpose-built AI skills for every part of your workflow. Buy once, apply everywhere.
                </p>
                <div className="flex items-center gap-5">
                  <Link href="/market">
                    <Button variant="brand" size="lg" className="rounded-xl gap-2 shadow-[0_4px_24px_rgba(226,42,42,0.25)] hover:shadow-[0_6px_36px_rgba(226,42,42,0.4)] transition-shadow duration-300 active:scale-[0.98]">
                      Browse all skills <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground dark:text-zinc-700 mt-6">
                  {MARKET_ITEMS.length} skills · {MARKET_ITEMS.filter((s) => s.isFree).length} free
                </p>
              </motion.div>
            </div>

            {/* Right: numbered rows */}
            <div className="lg:w-[62%] border-t border-border/40 dark:border-zinc-800/60">
              {FEATURED_SKILLS.map((skill, i) => (
                <SkillListRow key={skill.id} skill={skill} index={i} />
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="pt-8"
              >
                <Link
                  href="/market"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground dark:text-zinc-500 hover:text-primary dark:hover:text-rose-400 transition-colors"
                >
                  See full marketplace <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCRUB TEXT — full dark cinematic section ─────────────── */}
      <section
        ref={scrubRef}
        className="py-40 md:py-64 px-6 relative overflow-hidden bg-background"
      >
        {/* Ambient rose glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 55% 40% at 25% 55%, rgba(226,42,42,0.05) 0%, transparent)",
          }}
        />
        {/* Decorative large background letter */}
        <div
          className="absolute right-[-2%] top-1/2 -translate-y-1/2 text-[32rem] font-black text-muted/20 dark:text-zinc-900/40 select-none leading-none pointer-events-none"
          aria-hidden
        >
          &lt;/&gt;
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-muted-foreground dark:text-zinc-700 mb-14">
            Built for developers who care
          </p>
          <div
            className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.22] tracking-[-0.015em] text-foreground dark:text-white pb-2"
            style={{ textWrap: "pretty" } as React.CSSProperties}
          >
            {words.slice(0, -3).map((word, i) => (
              <ScrubWord key={i} word={word} progress={scrubProgress} index={i} total={words.length} />
            ))}
            <span className="relative inline-block">
              {words.slice(-3).map((word, i) => (
                <ScrubWord
                  key={words.length - 3 + i}
                  word={word}
                  progress={scrubProgress}
                  index={words.length - 3 + i}
                  total={words.length}
                />
              ))}
              <motion.span
                aria-hidden
                className="absolute -bottom-[3px] left-0 h-[3px] w-full rounded-full bg-foreground dark:bg-white origin-left"
                style={{ scaleX: underlineScale }}
              />
            </span>
          </div>
        </div>
      </section>

      {/* ── DESIGN SYSTEMS TEASER — sticky left + tall palette cards ─ */}
      <section className="py-32 md:py-48 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-28">

            {/* Sticky left */}
            <div className="lg:w-[38%] lg:sticky lg:top-32 lg:h-fit">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-[0.18em] text-primary dark:text-rose-400 mb-7">
                  <Palette className="w-3 h-3" /> Design Gallery
                </div>
                <h2
                  className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-6"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  Visual foundations, ready to apply.
                </h2>
                <p className="text-muted-foreground dark:text-zinc-400 text-lg leading-relaxed mb-10">
                  Curated design systems with full color palettes, typography, and component styles. Apply any to your project in one click.
                </p>
                <div className="flex items-center gap-5">
                  <Link href="/systems">
                    <Button variant="brand" size="lg" className="rounded-xl gap-2 shadow-[0_4px_24px_rgba(226,42,42,0.25)] hover:shadow-[0_6px_36px_rgba(226,42,42,0.4)] transition-shadow duration-300 active:scale-[0.98]">
                      Browse all systems <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground dark:text-zinc-700 mt-6">
                  {SYSTEM_ITEMS.length} design systems · {SYSTEM_ITEMS.filter((s) => s.isFree).length} free
                </p>
              </motion.div>
            </div>

            {/* Right: palette cards grid */}
            <div className="lg:w-[62%]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40 dark:bg-zinc-800/40">
                {FEATURED_SYSTEMS.map((system, i) => (
                  <SystemPaletteCard key={system.id} system={system} delay={i * 0.07} />
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="pt-8"
              >
                <Link
                  href="/systems"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground dark:text-zinc-500 hover:text-primary dark:hover:text-rose-400 transition-colors"
                >
                  See full gallery <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS — GSAP stagger, enlarged numbers ─────────────── */}
      <section className="py-32 md:py-48 px-6 bg-background">
        <div ref={benefitsRef} className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-28">

            {/* Sticky left */}
            <div className="lg:w-[38%] lg:sticky lg:top-32 lg:h-fit">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-muted-foreground dark:text-zinc-700 mb-7">Why teams switch</p>
              <h2
                className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-6"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                Why teams make the switch.
              </h2>
              <p className="text-muted-foreground dark:text-zinc-500 text-lg leading-relaxed mb-10">
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
            </div>

            {/* Right: benefit rows */}
            <div className="lg:w-[62%]">
              {BENEFITS.map((benefit) => (
                <BenefitRow key={benefit.number} benefit={benefit} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — dark editorial, 13g.fr horizontal ─────── */}
      <section className="py-32 md:py-48 px-6 relative overflow-hidden bg-background border-t border-border/50 dark:border-zinc-900">
        {/* Giant decorative quote mark */}
        <div
          className="pointer-events-none select-none absolute -top-8 left-6 text-[18rem] font-black text-muted/10 dark:text-zinc-900/40 leading-none"
          aria-hidden
        >
          &ldquo;
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-muted-foreground dark:text-zinc-700 mb-5">
              From developers who switched
            </p>
            <h2
              className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Developers love it.
            </h2>
          </motion.div>

          {/* Full-width horizontal testimonial rows */}
          <div>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16 py-14 border-t border-border/50 dark:border-zinc-800/60"
              >
                {/* Stars + quote — 70% */}
                <div className="lg:w-[68%]">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <svg key={si} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-bold text-foreground dark:text-zinc-200 leading-[1.4] tracking-tight">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Author — 30% */}
                <div className="lg:w-[32%] lg:pt-14 flex items-start gap-4">
                  <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-black text-white shrink-0", t.color)}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-foreground dark:text-zinc-100 leading-none mb-1">{t.name}</p>
                    <p className="text-[12px] text-muted-foreground dark:text-zinc-650">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER — dark glass cards ────────────────────── */}
      <section className="py-32 md:py-40 px-6 relative z-10 bg-background border-t border-border/50 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-muted-foreground dark:text-zinc-700 mb-5">Pricing</p>
            <h2
              className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-foreground dark:text-white leading-[1.02] mb-4"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Start free. Scale with add-ons.
            </h2>
            <p className="text-lg text-muted-foreground dark:text-zinc-500 max-w-md">
              Buy skills and design systems individually, or bundle them for more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/40 dark:bg-zinc-800/40">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card dark:bg-zinc-900 p-6 flex flex-col gap-5"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-muted-foreground dark:text-zinc-500" />
                  <span className="text-sm font-semibold text-foreground/80 dark:text-zinc-300">Starter</span>
                </div>
                <div className="text-3xl font-black text-foreground dark:text-white tracking-tight">Free</div>
                <p className="text-xs text-muted-foreground dark:text-zinc-600 mt-1">3 projects · 32K context</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {["3 free skills included", "6 free design systems", "Community support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-in">
                <Button variant="outline" className="w-full text-xs h-9 border-border dark:border-zinc-700 text-foreground/80 dark:text-zinc-300 hover:bg-muted dark:hover:bg-zinc-800 hover:text-foreground dark:hover:text-white">
                  Get started
                </Button>
              </Link>
            </motion.div>

            {/* Pro — highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card dark:bg-zinc-900 border-t-2 border-brand p-6 flex flex-col gap-5 relative shadow-[0_0_60px_rgba(226,42,42,0.06)] dark:shadow-[0_0_60px_rgba(226,42,42,0.15)]"
            >
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-brand-foreground text-[10px] font-bold px-3 py-0.5 uppercase tracking-wider">
                Most popular
              </span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary dark:text-rose-400" />
                  <span className="text-sm font-semibold text-foreground/90 dark:text-zinc-200">Pro</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-foreground dark:text-white tracking-tight">₹999</span>
                  <span className="text-sm text-muted-foreground dark:text-zinc-500 pb-1">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground dark:text-zinc-600 mt-1">10 projects · 128K context</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {["5 premium skills included", "All design systems unlocked", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-450">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-in">
                <Button className="w-full text-xs h-9 bg-brand text-brand-foreground hover:bg-brand/90 shadow-[0_4px_20px_rgba(226,42,42,0.25)] dark:shadow-[0_4px_20px_rgba(226,42,42,0.4)] transition-all">
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
              className="bg-card dark:bg-zinc-900 p-6 flex flex-col gap-5"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground dark:text-zinc-500" />
                  <span className="text-sm font-semibold text-foreground/80 dark:text-zinc-300">Studio</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-foreground dark:text-white tracking-tight">₹2,499</span>
                  <span className="text-sm text-muted-foreground dark:text-zinc-500 pb-1">/mo</span>
                </div>
                <p className="text-xs text-muted-foreground dark:text-zinc-600 mt-1">Unlimited projects · 256K context</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {["All 12 skills included", "All 18 design systems", "Dedicated support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-in">
                <Button variant="outline" className="w-full text-xs h-9 border-border dark:border-zinc-700 text-foreground/80 dark:text-zinc-300 hover:bg-muted dark:hover:bg-zinc-800 hover:text-foreground dark:hover:text-white">
                  Contact sales
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              See full pricing — bundles, skills & context windows
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <AboutSection />

      {/* ── FINAL CTA — cinematic full-bleed dark ────────────────── */}
      <section className="py-40 md:py-64 px-6 relative overflow-hidden bg-background">
        {/* Full-bleed image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://picsum.photos/seed/night/1920/1080"
            alt=""
            fill
            className="object-cover opacity-[0.07] grayscale contrast-125"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background dark:from-zinc-950 dark:via-zinc-950/92 dark:to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_10%_50%,rgba(226,42,42,0.10),transparent)]" />
          <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={60} staticity={30} ease={50} />
        </div>

        {/* Decorative watermark */}
        <div
          className="pointer-events-none select-none absolute right-[-4%] bottom-0 font-black text-muted/20 dark:text-zinc-900/50 leading-none"
          style={{ fontSize: "clamp(8rem, 20vw, 22rem)", letterSpacing: "-0.05em" }}
          aria-hidden
        >
          Build.
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-24 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[10px] font-bold uppercase tracking-[0.26em] text-muted-foreground dark:text-zinc-700 mb-8"
            >
              Ready to start
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-5xl md:text-[5rem] font-black tracking-[-0.04em] text-foreground dark:text-white leading-[0.90] mb-8"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Ready to code with intelligence?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-lg text-muted-foreground dark:text-zinc-500 mb-12 max-w-md leading-relaxed"
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
                  className="h-13 px-8 text-base shadow-[0_4px_32px_rgba(226,42,42,0.38)] hover:shadow-[0_6px_44px_rgba(226,42,42,0.55)] transition-shadow duration-300 active:scale-[0.98]"
                >
                  Start building free <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/market">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-8 text-base border-border dark:border-zinc-700 text-foreground dark:text-white hover:bg-muted dark:hover:bg-zinc-800 bg-transparent active:scale-[0.98]"
                >
                  Explore marketplace
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stat cluster */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:flex flex-col gap-px shrink-0 bg-border/40 dark:bg-zinc-800/40"
          >
            {[
              { value: "47.2K", label: "developers active" },
              { value: "2.3M",  label: "lines completed" },
              { value: "98.7%", label: "uptime SLA" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col p-6 bg-card dark:bg-zinc-900 min-w-[210px]"
              >
                <span className="text-3xl font-black tabular-nums text-foreground dark:text-white tracking-tight">{value}</span>
                <span className="text-sm text-muted-foreground dark:text-zinc-650 mt-1">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
