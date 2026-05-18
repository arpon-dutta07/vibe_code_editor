"use client";

import { useCallback, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2, Zap, Users, CheckCircle2, Terminal, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as PricingCard from "@/components/ui/pricing-card";
import { GridShader } from "@/components/ui/grid-shader";

// ---- Infinite Marquee ----
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

function InfiniteMarquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="py-5 overflow-hidden border-y border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm">
      <motion.div
        className="flex gap-0 shrink-0 w-max"
        animate={{ x: "-50%" }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((label, i) => (
          <span
            key={i}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600 whitespace-nowrap px-8"
          >
            {label}
            <span className="ml-8 text-rose-400/40">/</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ---- Scrub Word ----
function ScrubWord({
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
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.22em]">
      {word}
    </motion.span>
  );
}

// ---- Bento Card (with cursor spotlight) ----
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

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
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
        "bg-white dark:bg-zinc-900",
        "border border-zinc-200/80 dark:border-zinc-800/80",
        "transition-[box-shadow] duration-500",
        "hover:shadow-[0_12px_48px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      {/* Cursor spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
        style={{
          background:
            "radial-gradient(260px circle at var(--sx, -100px) var(--sy, -100px), rgba(244,63,94,0.055), transparent 60%)",
        }}
      />
      {children}
    </motion.div>
  );
}

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

export default function Home() {
  const scrubRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { scrollYProgress: scrubProgress } = useScroll({
    target: scrubRef,
    offset: ["start 0.85", "end 0.2"],
  });

  const words = STATEMENT.split(" ");

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = heroRef.current;
    if (!section) return;
    const { left, top, width, height } = section.getBoundingClientRect();
    const nx = (e.clientX - left) / width - 0.5;
    const ny = (e.clientY - top) / height - 0.5;

    heroMouseRef.current = { x: nx, y: ny };
    section.style.setProperty("--gx", `${e.clientX - left}px`);
    section.style.setProperty("--gy", `${e.clientY - top}px`);

    if (heroContentRef.current) {
      heroContentRef.current.style.transform = `translate(${-nx * 16}px, ${-ny * 11}px)`;
    }
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    heroMouseRef.current = { x: 0, y: 0 };
    if (heroContentRef.current) {
      heroContentRef.current.style.transform = "translate(0px, 0px)";
    }
  }, []);

  return (
    <div className="overflow-x-hidden w-full max-w-full">

      {/* ---- HERO ---- */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-background"
      >
        {/* Ambient color orbs — behind grid */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="animate-orb-1 absolute w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(244,63,94,0.18) 0%, transparent 70%)",
              filter: "blur(80px)",
              top: "-180px",
              left: "-150px",
            }}
          />
          <div
            className="animate-orb-2 absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)",
              filter: "blur(90px)",
              top: "15%",
              right: "-120px",
            }}
          />
          <div
            className="animate-orb-3 absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)",
              filter: "blur(80px)",
              bottom: "5%",
              left: "25%",
            }}
          />
        </div>

        {/* WebGL grid shader */}
        <GridShader
          mouseRef={heroMouseRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Cursor glow */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(700px circle at var(--gx, -200px) var(--gy, -200px), rgba(244,63,94,0.05), transparent 55%)",
          }}
        />

        {/* Radial vignette fades */}
        <div className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_80%_55%_at_50%_110%,transparent,var(--background)_70%)]" />
        <div className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(ellipse_50%_30%_at_50%_-5%,rgba(244,63,94,0.06),transparent)]" />

        {/* Hero content */}
        <div
          ref={heroContentRef}
          className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 pb-8 px-6 text-center w-full"
          style={{ transition: "transform 0.15s ease-out", willChange: "transform" }}
        >
          <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 text-sm font-medium text-rose-600 dark:text-rose-400 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            AI-native editor — public beta
          </motion.div>

          <h1
            className="text-[clamp(4rem,9vw,8rem)] font-black leading-[0.9] tracking-[-0.035em] text-zinc-900 dark:text-white mb-8"
          >
            {["Code faster.", "Think deeper."].map((line, li) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
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
            className="max-w-xl mx-auto text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-12"
            style={{ textWrap: "pretty" } as React.CSSProperties}
          >
            VibeCode brings AI-native editing to your browser. Write, debug, and ship without leaving your flow state.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button
                variant="brand"
                size="lg"
                className="h-12 px-8 text-base rounded-xl shadow-[0_4px_24px_rgba(244,63,94,0.3)] hover:shadow-[0_6px_36px_rgba(244,63,94,0.45)] transition-shadow duration-300"
              >
                Start building free
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/market">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
                Explore marketplace
              </Button>
            </Link>
          </motion.div>
          </div>
        </div>

        {/* Stats + scroll indicator — natural flow at bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72, ease: "easeOut" }}
          className="relative z-10 pb-10 flex flex-col items-center gap-6 px-6 w-full"
        >
          {/* Stats row */}
          <div className="flex items-center gap-10 sm:gap-16">
            {HERO_STATS.map(({ value, label }, i) => (
              <div key={label} className="relative text-center">
                {i > 0 && (
                  <span className="absolute -left-5 sm:-left-8 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 hidden sm:block select-none">
                    /
                  </span>
                )}
                <div className="text-xl font-black tabular-nums tracking-tight text-zinc-900 dark:text-white">
                  {value}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1.5px] h-9 bg-gradient-to-b from-rose-400/70 via-zinc-400/40 to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* ---- MARQUEE ---- */}
      <InfiniteMarquee />

      {/* ---- BENTO GRID ---- */}
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
              className="text-5xl md:text-[3.75rem] font-black tracking-[-0.025em] text-zinc-900 dark:text-white leading-[1.02] mb-5"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Everything you need to build without friction.
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">
              One environment. All the tools. No context-switching.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-[280px] gap-4 grid-flow-dense">
            <BentoCard
              delay={0}
              className="md:col-span-2 lg:col-span-2 lg:row-span-2 group min-h-[360px] lg:min-h-0"
            >
              <div className="absolute inset-0">
                <Image
                  src="https://picsum.photos/seed/darkcode/600/600"
                  alt=""
                  fill
                  className="object-cover opacity-[0.18] dark:opacity-[0.28] grayscale transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 dark:from-zinc-900 dark:via-zinc-900/90 to-transparent" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <div className="mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-5">
                    <Code2 className="w-6 h-6 text-rose-500" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-3">
                    AI-powered completions
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm text-[15px]">
                    Contextual suggestions trained on millions of codebases. The more you write, the smarter it gets.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["TypeScript", "Python", "Go", "Rust", "+50"].map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 text-xs font-mono rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard
              delay={0.08}
              className="md:col-span-2 lg:col-span-2 lg:row-span-1 group min-h-[200px] lg:min-h-0"
            >
              <div className="absolute inset-0">
                <Image
                  src="https://picsum.photos/seed/teamwork/800/300"
                  alt=""
                  fill
                  className="object-cover opacity-[0.14] dark:opacity-[0.2] grayscale transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-zinc-900 via-white/80 dark:via-zinc-900/80 to-transparent" />
              </div>
              <div className="relative z-10 h-full flex items-center p-8 gap-6">
                <div className="shrink-0">
                  <div className="inline-flex p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
                    Real-time collaboration
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                    Your entire team in the same editor. Live cursors, inline comments, instant sync.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.14} className="col-span-1 group min-h-[200px] lg:min-h-0">
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 w-fit">
                  <Terminal className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
                    Smart debugging
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Advanced breakpoints and AI-guided root cause analysis.
                  </p>
                </div>
              </div>
            </BentoCard>

            <BentoCard delay={0.2} className="col-span-1 group min-h-[200px] lg:min-h-0">
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="inline-flex p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit">
                  <Activity className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
                    Performance insights
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Detailed metrics and optimization suggestions, inline.
                  </p>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ---- SCRUB TEXT ---- */}
      <section
        ref={scrubRef}
        className="py-32 md:py-48 px-6 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_60%,rgba(244,63,94,0.035),transparent)]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-14">
            Built for developers who care
          </p>
          <div
            className="text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.25] tracking-[-0.015em] text-zinc-900 dark:text-white"
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

      {/* ---- STICKY BENEFITS ---- */}
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
                  className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-zinc-900 dark:text-white leading-[1.02] mb-6"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  Why teams make the switch.
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-10">
                  Real improvements to how you write, review, and ship code — every day.
                </p>
                <Link href="/dashboard">
                  <Button
                    variant="brand"
                    size="lg"
                    className="rounded-xl shadow-[0_4px_24px_rgba(244,63,94,0.25)] hover:shadow-[0_6px_36px_rgba(244,63,94,0.4)] transition-shadow duration-300"
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
                    "group py-12 border-b border-zinc-100 dark:border-zinc-800/80",
                    "last:border-0 first:pt-0"
                  )}
                >
                  <div className="flex gap-8 items-start">
                    <span className="benefit-number text-[4.5rem] font-black leading-none text-zinc-100 dark:text-zinc-800/70 select-none shrink-0 tabular-nums">
                      {benefit.number}
                    </span>
                    <div className="pt-2">
                      <h3 className="benefit-title text-2xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
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

      {/* ---- PRICING ---- */}
      <section className="py-32 md:py-48 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-[3.5rem] font-black tracking-[-0.025em] text-zinc-900 dark:text-white mb-4">
              Simple, honest pricing.
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              Start free. Upgrade when your team grows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start justify-items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm"
            >
              <PricingCard.Card>
                <PricingCard.Header>
                  <PricingCard.Plan>
                    <PricingCard.PlanName>
                      <Code2 aria-hidden="true" />
                      <span>Starter</span>
                    </PricingCard.PlanName>
                  </PricingCard.Plan>
                  <PricingCard.Description>Perfect for learning and experimentation</PricingCard.Description>
                  <PricingCard.Price>
                    <PricingCard.MainPrice>Free</PricingCard.MainPrice>
                  </PricingCard.Price>
                  <Link href="/auth/sign-in" className="w-full">
                    <Button className="w-full" variant="outline">Get started</Button>
                  </Link>
                </PricingCard.Header>
                <PricingCard.Body>
                  <PricingCard.List>
                    {["1 active project", "Basic AI suggestions", "Syntax highlighting (20+ languages)", "1 GB cloud storage", "Community support"].map((f) => (
                      <PricingCard.ListItem key={f}>
                        <span className="mt-0.5"><CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" /></span>
                        <span>{f}</span>
                      </PricingCard.ListItem>
                    ))}
                  </PricingCard.List>
                </PricingCard.Body>
              </PricingCard.Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm"
            >
              <PricingCard.Card className="ring-2 ring-rose-500/30 shadow-[0_0_60px_rgba(244,63,94,0.13)] dark:shadow-[0_0_60px_rgba(244,63,94,0.2)] scale-[1.03] z-10">
                <PricingCard.Header>
                  <PricingCard.Plan>
                    <PricingCard.PlanName>
                      <Zap aria-hidden="true" />
                      <span>Professional</span>
                    </PricingCard.PlanName>
                    <PricingCard.Badge>Most popular</PricingCard.Badge>
                  </PricingCard.Plan>
                  <PricingCard.Description>For developers and small teams</PricingCard.Description>
                  <PricingCard.Price>
                    <PricingCard.MainPrice>$15</PricingCard.MainPrice>
                    <PricingCard.Period>/ month</PricingCard.Period>
                  </PricingCard.Price>
                  <Link href="/auth/sign-in" className="w-full">
                    <Button className="w-full font-semibold bg-rose-500 text-white shadow-[0_4px_20px_rgba(244,63,94,0.35)] hover:bg-rose-600 hover:shadow-[0_6px_28px_rgba(244,63,94,0.5)] transition-all duration-300">
                      Get started
                    </Button>
                  </Link>
                </PricingCard.Header>
                <PricingCard.Body>
                  <PricingCard.List>
                    {["Unlimited projects", "Advanced AI completions", "Real-time collaboration", "100 GB cloud storage", "Git integration", "Code review tools", "Analytics dashboard", "Up to 5 members", "Priority email support"].map((f) => (
                      <PricingCard.ListItem key={f}>
                        <span className="mt-0.5"><CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" /></span>
                        <span>{f}</span>
                      </PricingCard.ListItem>
                    ))}
                  </PricingCard.List>
                </PricingCard.Body>
              </PricingCard.Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm"
            >
              <PricingCard.Card>
                <PricingCard.Header>
                  <PricingCard.Plan>
                    <PricingCard.PlanName>
                      <Users aria-hidden="true" />
                      <span>Enterprise</span>
                    </PricingCard.PlanName>
                  </PricingCard.Plan>
                  <PricingCard.Description>For large organizations and teams</PricingCard.Description>
                  <PricingCard.Price>
                    <PricingCard.MainPrice>Custom</PricingCard.MainPrice>
                  </PricingCard.Price>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full" variant="outline">Contact sales</Button>
                  </Link>
                </PricingCard.Header>
                <PricingCard.Body>
                  <PricingCard.List>
                    {["Everything in Professional", "Unlimited members", "Unlimited storage", "SSO integration", "Advanced security controls", "Role-based access", "API access and webhooks", "Advanced audit logs", "Dedicated account manager", "24/7 priority support", "Self-hosted infrastructure", "SLA guarantee"].map((f) => (
                      <PricingCard.ListItem key={f}>
                        <span className="mt-0.5"><CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" /></span>
                        <span>{f}</span>
                      </PricingCard.ListItem>
                    ))}
                  </PricingCard.List>
                </PricingCard.Body>
              </PricingCard.Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---- FINAL CTA ---- */}
      <section className="py-32 md:py-48 px-6 relative overflow-hidden bg-zinc-900 dark:bg-black">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://picsum.photos/seed/night/1920/1080"
            alt=""
            fill
            className="object-cover opacity-[0.08] grayscale"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 dark:from-black via-zinc-900/96 dark:via-black/96 to-zinc-900/80 dark:to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_50%,rgba(244,63,94,0.07),transparent)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="text-5xl md:text-7xl font-black tracking-[-0.03em] text-white leading-[0.94] mb-8"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Ready to code with intelligence?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-lg text-zinc-400 mb-12 max-w-md mx-auto leading-relaxed"
            style={{ textWrap: "pretty" } as React.CSSProperties}
          >
            Join developers who have replaced their old editor with something that thinks alongside them.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button
                variant="brand"
                size="lg"
                className="h-12 px-8 text-base rounded-xl shadow-[0_4px_32px_rgba(244,63,94,0.38)] hover:shadow-[0_6px_44px_rgba(244,63,94,0.55)] transition-shadow duration-300"
              >
                Start building free
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/market">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base rounded-xl border-white/20 text-white hover:bg-white/8 bg-transparent dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/8"
              >
                Explore marketplace
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
