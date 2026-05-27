"use client";

import React, { useState, useMemo, useRef, useCallback, memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowUpRight,
  Zap,
  TrendingUp,
  Download,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MARKET_ITEMS, CATEGORIES, MarketItem } from "@/features/market/data/market-items";
import { GridShader } from "@/components/ui/grid-shader";
import { Particles } from "@/components/ui/particles";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Skill accordion row ───────────────────────────────────────────────
const SkillAccordionRow = memo(function SkillAccordionRow({
  item,
  skillIndex,
  onClick,
}: {
  item: MarketItem;
  skillIndex: number;
  onClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  return (
    <div className="skill-row border-b border-border dark:border-zinc-800/80">
      <button
        className="w-full flex items-center gap-3 md:gap-5 py-5 px-0 text-left group"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className="text-[11px] font-mono text-muted-foreground dark:text-zinc-600 w-7 shrink-0 tabular-nums select-none">
          {String(skillIndex + 1).padStart(2, "0")}
        </span>

        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 flex items-center justify-center shrink-0 transition-colors duration-200">
          <item.icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-200" />
        </div>

        <span className="flex-1 min-w-0 text-base md:text-lg font-bold text-foreground dark:text-zinc-300 group-hover:text-foreground dark:group-hover:text-white transition-colors duration-200 truncate">
          {item.title}
        </span>

        <span className="hidden md:block text-xs text-muted-foreground dark:text-zinc-600 uppercase tracking-[0.14em] font-medium shrink-0">
          {item.category}
        </span>

        {item.trending && (
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase tracking-wider shrink-0">
            <TrendingUp className="w-2.5 h-2.5" />
            Hot
          </span>
        )}

        <span className="shrink-0 text-sm font-bold tabular-nums min-w-[56px] text-right">
          {item.isFree ? (
            <span className="text-emerald-500 dark:text-emerald-400">Free</span>
          ) : (
            <span className="text-foreground dark:text-white">&#8377;{item.price}</span>
          )}
        </span>

        <div className="shrink-0 w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-500 dark:group-hover:border-zinc-500 flex items-center justify-center transition-colors duration-200">
          {isOpen ? (
            <Minus className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          ) : (
            <Plus className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          )}
        </div>
      </button>

      {/* Expandable body — CSS grid-template-rows trick */}
      <div
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="overflow-hidden">
          <div className="pl-[4.25rem] pb-7 pr-2">
            <p className="text-muted-foreground dark:text-zinc-400 leading-relaxed text-[15px] mb-5 max-w-xl">
              {item.description}
            </p>
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="bg-foreground dark:bg-white text-background dark:text-zinc-950 hover:bg-foreground/80 dark:hover:bg-zinc-100 font-semibold gap-1.5 active:scale-[0.98]"
              >
                View Skill
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground dark:text-zinc-600">
                <Download className="w-3 h-3" />
                {item.downloads} installs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── Ad row (amber, no expand — direct navigation) ─────────────────────
function AdRow({ skill, onClick }: { skill: MarketItem; onClick: () => void }) {
  return (
    <div className="skill-row border-b border-border dark:border-zinc-800/80">
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 md:gap-5 py-5 px-0 text-left group"
      >
        <span className="text-[10px] font-mono font-bold text-amber-500/50 w-7 shrink-0 select-none">
          AD
        </span>

        <div className="w-9 h-9 rounded-xl border border-amber-500/25 group-hover:border-amber-500/50 flex items-center justify-center shrink-0 transition-colors duration-200"
          style={{ background: "rgba(245,158,11,0.08)" }}
        >
          <skill.icon className="w-4 h-4 text-amber-500" />
        </div>

        <span className="flex-1 min-w-0 text-base md:text-lg font-bold text-foreground dark:text-zinc-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors duration-200 truncate">
          {skill.title}
        </span>

        <span className="hidden md:block text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.18em] shrink-0">
          Sponsored
        </span>

        <span className="hidden sm:block w-10 shrink-0" />

        <span className="shrink-0 text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums min-w-[56px] text-right">
          &#8377;{skill.price}
        </span>

        <div className="shrink-0 w-6 h-6 rounded-full border border-amber-500/30 group-hover:border-amber-500/60 flex items-center justify-center transition-colors duration-200">
          <ArrowUpRight className="w-3 h-3 text-amber-500" />
        </div>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
const AD_POSITIONS = new Set([4, 9]);
const AD_SKILLS = MARKET_ITEMS.filter((s) => !s.isFree).slice(0, 3);

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const heroRectRef = useRef<DOMRect | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const filteredItems = useMemo(
    () =>
      MARKET_ITEMS.filter((item) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        const matchesCategory =
          activeCategory === "All" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
      }),
    [searchQuery, activeCategory]
  );

  const showAds = activeCategory === "All" && searchQuery === "";

  const gridItems = useMemo(() => {
    const items: Array<
      | { type: "skill"; item: MarketItem; skillIndex: number }
      | { type: "ad"; skill: MarketItem }
    > = [];
    let adIndex = 0;
    let skillNum = 0;
    filteredItems.forEach((item, i) => {
      if (showAds && AD_POSITIONS.has(i) && adIndex < AD_SKILLS.length) {
        items.push({ type: "ad", skill: AD_SKILLS[adIndex++] });
      }
      items.push({ type: "skill", item, skillIndex: skillNum++ });
    });
    return items;
  }, [filteredItems, showAds]);

  const handleSkillClick = useCallback(
    (item: MarketItem) => router.push(`/market/${item.id}`),
    [router]
  );

  const marketStats = [
    { value: String(MARKET_ITEMS.length), label: "skills" },
    { value: String(MARKET_ITEMS.filter((i) => i.isFree).length), label: "free" },
    { value: "7.8K", label: "installs" },
  ];

  // ── Hero entrance ──────────────────────────────────────────────────
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", { y: 14, opacity: 0, duration: 0.5 })
        .from(".hero-h1", { y: 64, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.25")
        .from(".hero-sub", { y: 22, opacity: 0, duration: 0.65 }, "-=0.55")
        .from(".hero-stat", { y: 12, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.45")
        .from(".hero-search-wrap", { y: 20, opacity: 0, duration: 0.5 }, "-=0.38");
    },
    { scope: heroRef }
  );

  // ── Rows ScrollTrigger stagger ─────────────────────────────────────
  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".skill-row");
      rows.forEach((row) => {
        gsap.from(row, {
          y: 20,
          opacity: 0,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            once: true,
          },
        });
      });
    },
    { scope: listRef, dependencies: [gridItems] }
  );

  return (
    <main className="overflow-x-hidden w-full max-w-full min-h-screen">
      {/* ── HERO — dark cinematic center ─────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[65dvh] flex flex-col items-center justify-center pt-32 pb-24 px-6 overflow-hidden"
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
          className="relative z-10 text-center w-full max-w-6xl mx-auto"
          style={{ transition: "transform 0.18s ease-out", willChange: "transform" }}
        >
          <div
            className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/20 text-sm font-medium text-rose-400 mb-10"
            style={{ background: "rgba(226,42,42,0.07)" }}
          >
            <Zap className="w-3.5 h-3.5" />
            Skill Marketplace
          </div>

          <h1
            className="hero-h1 font-black tracking-[-0.04em] leading-[0.86] text-foreground dark:text-white mb-7"
            style={{ fontSize: "clamp(3.5rem,10vw,9.5rem)" }}
          >
            <span className="text-primary dark:text-rose-400">Vibe</span>
            <br />
            Marketplace
          </h1>

          <p className="hero-sub text-lg text-muted-foreground dark:text-zinc-400 max-w-md mx-auto leading-relaxed mb-10">
            Discover and unlock powerful skills to supercharge your
            AI-powered development workflow.
          </p>

          <div className="flex items-center justify-center gap-10 mb-12">
            {marketStats.map(({ value, label }, i) => (
              <div key={label} className="hero-stat relative">
                {i > 0 && (
                  <span className="absolute -left-5 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 select-none">
                    /
                  </span>
                )}
                <div className="text-2xl font-black tabular-nums text-foreground dark:text-white">
                  {value}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-zinc-600 mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="hero-search-wrap relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-zinc-500 pointer-events-none" />
            <input
              placeholder="Search skills, tools, templates..."
              className="w-full pl-11 h-14 rounded-2xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-600 bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] focus:outline-none focus:border-zinc-400 dark:focus:border-white/[0.18] transition-colors text-sm shadow-sm dark:shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER + ACCORDION LIST ─────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-28">
        {/* Category pills — CSS active state only, no motion lib */}
        <div className="flex items-center gap-1.5 flex-wrap py-8 border-b border-border dark:border-zinc-800/80">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-[0.97]",
                activeCategory === category
                  ? "bg-foreground text-background dark:bg-white dark:text-zinc-950"
                  : "text-muted-foreground hover:text-foreground dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accordion list */}
        <div ref={listRef}>
          {gridItems.length > 0 ? (
            <>
              {/* Column header */}
              <div className="flex items-center gap-3 md:gap-5 py-3 border-b border-border dark:border-zinc-800/80">
                <span className="w-7 shrink-0" />
                <span className="w-9 shrink-0" />
                <span className="flex-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-600">
                  Skill
                </span>
                <span className="hidden md:block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-600 shrink-0">
                  Category
                </span>
                <span className="hidden sm:block w-10 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-600 shrink-0 min-w-[56px] text-right">
                  Price
                </span>
                <span className="w-6 shrink-0" />
              </div>

              {gridItems.map((entry, arrIdx) => {
                if (entry.type === "ad") {
                  return (
                    <AdRow
                      key={`ad-${entry.skill.id}-${arrIdx}`}
                      skill={entry.skill}
                      onClick={() => handleSkillClick(entry.skill)}
                    />
                  );
                }
                return (
                  <SkillAccordionRow
                    key={entry.item.id}
                    item={entry.item}
                    skillIndex={entry.skillIndex}
                    onClick={() => handleSkillClick(entry.item)}
                  />
                );
              })}
            </>
          ) : (
            <div className="flex flex-col items-start py-24">
              <div className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-border dark:border-zinc-800 mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-black text-foreground dark:text-zinc-50 mb-2">
                No results
              </h3>
              <p className="text-muted-foreground dark:text-zinc-400 leading-relaxed mb-6 max-w-sm">
                Nothing matches{" "}
                <span className="font-semibold text-foreground dark:text-zinc-200">
                  &ldquo;{searchQuery || activeCategory}&rdquo;
                </span>
                . Try different keywords or clear the filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="active:scale-[0.98]"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
