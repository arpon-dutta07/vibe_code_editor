"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  ArrowUpRight,
  Zap,
  ShoppingCart,
  Lock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Particles } from "@/components/ui/particles";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MARKET_ITEMS, CATEGORIES, MarketItem } from "@/features/market/data/market-items";

// Ad slots inserted at fixed grid positions (0-indexed)
const AD_POSITIONS = new Set([4, 9]);

const AD_SKILLS = MARKET_ITEMS.filter((s) => !s.isFree).slice(0, 3);

function AdCard({ skill, onClick }: { skill: MarketItem; onClick: () => void }) {
  const Icon = skill.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5",
        "p-5 md:p-6 cursor-pointer flex flex-col h-full group",
        "hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(251,146,60,0.15)] transition-all duration-300"
      )}
    >
      <div className="absolute top-3 right-3">
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
          Featured
        </Badge>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-2xl bg-amber-500/10 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all duration-300 shrink-0">
          <Icon className="w-6 h-6 text-amber-500" />
        </div>
        <div className="min-w-0 pr-16">
          <h3 className="text-xl font-bold text-foreground dark:text-zinc-50 mb-1 group-hover:text-amber-500 transition-colors truncate">
            {skill.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Premium skill</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-[15px] leading-relaxed mb-5 flex-grow line-clamp-2">
        {skill.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-amber-500/20 mt-auto">
        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">₹{skill.price}</span>
        <Button
          size="sm"
          className="bg-amber-500 hover:bg-amber-400 text-white font-semibold gap-1.5 shadow-md shadow-amber-500/20"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Unlock Now
        </Button>
      </div>
    </motion.div>
  );
}

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = MARKET_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSkillClick = (item: MarketItem) => {
    router.push(`/market/${item.id}`);
  };

  // Build grid: inject ad cards at specific positions when not searching/filtering
  const showAds = activeCategory === "All" && searchQuery === "";
  const gridItems: Array<{ type: "skill"; item: MarketItem } | { type: "ad"; skill: MarketItem }> = [];

  let adIndex = 0;
  filteredItems.forEach((item, i) => {
    if (showAds && AD_POSITIONS.has(i) && adIndex < AD_SKILLS.length) {
      gridItems.push({ type: "ad", skill: AD_SKILLS[adIndex++] });
    }
    gridItems.push({ type: "skill", item });
  });

  return (
    <div className="relative min-h-screen w-full pb-20 overflow-x-hidden">
      <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={120}
        staticity={40}
        ease={50}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <TypingAnimation
            text="Vibe Marketplace"
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-foreground dark:text-white"
            duration={120}
            delay={3000}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease: "easeOut", duration: 0.4 }}
            className="text-xl text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Discover and unlock powerful skills to supercharge your AI-powered development workflow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ease: "easeOut", duration: 0.4 }}
            className="max-w-2xl mx-auto relative group transition-transform duration-300 ease-out focus-within:scale-[1.02]"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search skills, tools, templates..."
              className="pl-12 h-14 text-lg rounded-2xl bg-background/80 dark:bg-zinc-900/70 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, ease: "easeOut", duration: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-border dark:border-zinc-800 pb-8"
        >
          <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={cn(
                    "relative px-6 py-2.5 rounded-full border border-transparent transition-all duration-200",
                    "text-muted-foreground dark:text-gray-400 hover:bg-muted dark:hover:bg-zinc-800/50 hover:-translate-y-0.5 active:scale-[0.97]",
                    "data-[state=active]:text-primary dark:data-[state=active]:text-rose-400 data-[state=active]:hover:bg-transparent dark:data-[state=active]:hover:bg-transparent"
                  )}
                >
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-full border border-rose-500/30 bg-rose-500/10 shadow-[0_0_15px_rgba(226,42,42,0.1)]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10 font-medium tracking-wide">{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {gridItems.map((entry, index) => {
            if (entry.type === "ad") {
              return (
                <AdCard
                  key={`ad-${entry.skill.id}-${index}`}
                  skill={entry.skill}
                  onClick={() => handleSkillClick(entry.skill)}
                />
              );
            }

            const item = entry.item;
            return (
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
                onClick={() => handleSkillClick(item)}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 group-hover:bg-primary/10 group-hover:shadow-[0_0_20px_rgba(226,42,42,0.2)] group-hover:scale-[1.15] group-hover:-translate-y-1 transition-all duration-300 shrink-0">
                      <item.icon className="w-6 h-6 text-foreground dark:text-gray-300 group-hover:text-rose-500 transition-colors duration-300" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-foreground dark:text-zinc-50 mb-1 group-hover:text-primary dark:group-hover:text-rose-400 transition-colors truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                        <span className="truncate">{item.author}</span>
                        <span className="shrink-0 text-zinc-300 dark:text-zinc-700">•</span>
                        <span className="shrink-0">{item.downloads} installs</span>
                      </div>
                    </div>
                  </div>
                  {item.trending && (
                    <Badge className="bg-primary/10 border border-primary/20 text-primary dark:text-rose-400 shrink-0 mt-1 hidden sm:flex animate-badge-shimmer font-semibold relative overflow-hidden">
                      <span className="relative z-10">Trending</span>
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground dark:text-gray-400 mb-6 line-clamp-2 flex-grow text-[15px] leading-relaxed transition-colors group-hover:text-foreground dark:group-hover:text-gray-300">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-lg border-border dark:border-zinc-800 px-3 py-1 font-medium bg-zinc-50/50 dark:bg-zinc-900/50 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary dark:group-hover:text-rose-400 transition-all duration-300"
                    >
                      {item.category}
                    </Badge>

                    {/* Price / Free badge */}
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
                        Enable <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      </>
                    ) : (
                      <>
                        Buy Now <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
                      </>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6 shadow-sm">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground dark:text-zinc-50 mb-2">No results found</h3>
            <p className="text-muted-foreground dark:text-gray-400">
              We couldn't find anything matching your search. Try different keywords.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
