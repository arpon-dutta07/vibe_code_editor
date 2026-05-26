"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SYSTEM_ITEMS, SystemItem } from "@/features/systems/data/system-items";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Particles } from "@/components/ui/particles";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, Lock, ArrowUpRight, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SystemsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLElement>(null);

  const filteredSystems = SYSTEM_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSystems = [...filteredSystems].sort((a, b) => {
    // 1. Free ones at the top (isFree = true first)
    if (a.isFree && !b.isFree) return -1;
    if (!a.isFree && b.isFree) return 1;
    // 2. Ascending order alphabetically by name
    return a.name.localeCompare(b.name);
  });

  const featuredSystems = SYSTEM_ITEMS.filter(s => s.trending).slice(0, 3);

  const systemStats = [
    { value: String(SYSTEM_ITEMS.length), label: "designs" },
    { value: String(SYSTEM_ITEMS.filter((i) => i.isFree).length), label: "free" },
    { value: String(SYSTEM_ITEMS.filter((i) => !i.isFree).length), label: "premium" },
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

  const handleSystemClick = (item: SystemItem) => {
    router.push(`/systems/${item.id}`);
  };

  return (
    <div className="relative min-h-screen w-full pb-20 overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
      <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={120}
        staticity={40}
        ease={50}
      />

      {/* ── HERO — dark cinematic center ─────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center pt-32 pb-24 px-6 overflow-hidden bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200/50 dark:border-zinc-900/50"
      >
        {/* Rose radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(226,42,42,0.14) 0%, transparent 65%)",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] hidden dark:block"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 text-center w-full max-w-6xl mx-auto">
          <div
            className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/20 text-sm font-medium text-rose-400 mb-10"
            style={{ background: "rgba(226,42,42,0.07)" }}
          >
            <Zap className="w-3.5 h-3.5" />
            Style Gallery
          </div>

          <h1
            className="hero-h1 font-black tracking-[-0.04em] leading-[0.86] text-foreground dark:text-white mb-7"
            style={{ fontSize: "clamp(3.5rem,10vw,9.5rem)" }}
          >
            Design
            <br />
            Systems
          </h1>

          <p className="hero-sub text-lg text-muted-foreground dark:text-zinc-400 max-w-md mx-auto leading-relaxed mb-10">
            Explore our curated collection of premium design systems to give your next project a stunning visual foundation.
          </p>

          <div className="flex items-center justify-center gap-10 mb-12">
            {systemStats.map(({ value, label }, i) => (
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
              placeholder="Search design systems..."
              className="w-full pl-11 h-14 rounded-2xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-zinc-600 bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] focus:outline-none focus:border-zinc-400 dark:focus:border-white/[0.18] transition-colors text-sm shadow-sm dark:shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <section className="max-w-7xl mx-auto px-4 pt-12 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar (Desktop) */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="p-6 rounded-2xl border border-border dark:border-zinc-800 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-sm"
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Overview
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Systems</span>
                <span className="font-semibold">{SYSTEM_ITEMS.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Free Systems</span>
                <span className="font-semibold">{SYSTEM_ITEMS.filter(s => s.isFree).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Premium Systems</span>
                <span className="font-semibold">{SYSTEM_ITEMS.filter(s => !s.isFree).length}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="p-6 rounded-2xl border border-border dark:border-zinc-800 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-sm hidden lg:block"
          >
            <h3 className="font-bold text-lg mb-4">Featured Designs</h3>
            <div className="space-y-4">
              {featuredSystems.map((fs) => (
                <div 
                  key={fs.id} 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => handleSystemClick(fs)}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-border dark:border-zinc-800 transition-colors group-hover:border-primary/50" style={{ background: `${fs.palette[0]}15` }}>
                    <div className="w-4 h-4 rounded-full" style={{ background: fs.accent }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{fs.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{fs.isFree ? 'Free' : `₹${fs.price}`}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
            {sortedSystems.map((item, index) => (
              <SpotlightCard
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 3) * 0.1, duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "p-5 md:p-6 backdrop-blur-sm flex flex-col h-full cursor-pointer group bg-card/60 dark:bg-zinc-900/40",
                  "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(226,42,42,0.08)] hover:border-primary/40 active:scale-[0.98]"
                )}
                spotlightColor="rgba(244, 63, 94, 0.15)"
                onClick={() => handleSystemClick(item)}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground dark:text-zinc-50 mb-1 group-hover:text-primary dark:group-hover:text-rose-400 transition-colors truncate">
                      {item.name}
                    </h3>
                    <div className="text-[11px] font-medium uppercase tracking-wider opacity-80 mt-1" style={{ color: item.accent }}>
                      {item.tagline}
                    </div>
                  </div>
                  {item.trending && (
                    <Badge className="bg-primary/10 border border-primary/20 text-primary dark:text-rose-400 shrink-0 hidden sm:flex animate-badge-shimmer font-semibold relative overflow-hidden">
                      <span className="relative z-10">Trending</span>
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 mb-5">
                  {item.palette.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 shadow-sm"
                      style={{ background: color }}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground dark:text-gray-400 mb-6 line-clamp-2 flex-grow text-[14px] leading-relaxed transition-colors group-hover:text-foreground dark:group-hover:text-gray-300">
                  {item.desc}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    {item.isFree ? (
                      <Badge className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Free
                      </Badge>
                    ) : (
                      <Badge className="rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> ₹{item.price}
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-muted-foreground dark:text-gray-400 group-hover:text-primary dark:group-hover:text-rose-400 flex items-center gap-1.5 transition-colors duration-300">
                    {item.isFree ? (
                      <>
                        Use Style <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
                      </>
                    ) : (
                      <>
                        Unlock <Lock className="w-3.5 h-3.5 ml-0.5" />
                      </>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {sortedSystems.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6 shadow-sm">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground dark:text-zinc-50 mb-2">No systems found</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                We couldn't find anything matching your search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
