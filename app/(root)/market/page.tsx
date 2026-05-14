"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Code2, 
  Palette, 
  Database, 
  Globe, 
  Zap, 
  Terminal, 
  Github, 
  Cpu, 
  ArrowUpRight 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { GridBackground } from "@/components/ui/grid-background";
import { SkillDetailModal } from "@/components/modal/skill-detail-modal";
import { getSkillMarkdown } from "@/features/project/actions/skill-actions";
import { toast } from "sonner";

const MARKET_ITEMS = [
  {
    id: "frontend-design",
    title: "Frontend Design Skill",
    description: "Advanced principles for distinctive, production-grade frontend development. Includes color theory and spacing.",
    category: "Skills",
    icon: Palette,
    author: "VibeCode Team",
    downloads: "1.2k",
    trending: true,
  },
  {
    id: "architecture-design",
    title: "Backend Architecture",
    description: "Templates and best practices for scalable Node.js and Go backends with clean architecture.",
    category: "Architecture",
    icon: Database,
    author: "Architects Inc",
    downloads: "850",
  },
  {
    id: "ci-cd-pipelines",
    title: "GitHub Actions Automator",
    description: "Automatically generate and optimize CI/CD pipelines for your projects.",
    category: "Integrations",
    icon: Github,
    author: "DevOps Pro",
    downloads: "2.1k",
  },
  {
    id: "testing-scripts",
    title: "Testing Scripts Plus",
    description: "Enhanced runtime for testing with pre-installed common dev tools.",
    category: "Tools",
    icon: Cpu,
    author: "VibeCode Team",
    downloads: "3.4k",
  },
  {
    id: "frontend",
    title: "Modern React Starter",
    description: "Opinionated React starter with Tailwind 4, Shadcn, and TanStack Query.",
    category: "Templates",
    icon: Globe,
    author: "VibeCode Team",
    downloads: "1.5k",
  },
  {
    id: "logging",
    title: "Vibe Logger",
    description: "Deep dive into your code's performance metrics with AI-driven suggestions.",
    category: "Tools",
    icon: Zap,
    author: "SpeedLab",
    downloads: "920",
  },
  {
    id: "database-selection",
    title: "SQL Smart Query",
    description: "Let the AI optimize your PostgreSQL queries for maximum efficiency.",
    category: "Skills",
    icon: Terminal,
    author: "DB Masters",
    downloads: "1.1k",
    trending: true,
  },
  {
    id: "backend",
    title: "Instant API",
    description: "Generate full REST or GraphQL APIs from your database schema in seconds.",
    category: "Tools",
    icon: Code2,
    author: "VibeCode Team",
    downloads: "2.5k",
    trending: true,
  }
];

const CATEGORIES = ["All", "Skills", "Tools", "Templates", "Architecture", "Integrations"];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState<{ id: string; title: string; description: string; icon: any; content: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredItems = MARKET_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSkillClick = async (item: typeof MARKET_ITEMS[0]) => {
    try {
      const result = await getSkillMarkdown(item.id);
      if (result.success && result.content) {
        setSelectedSkill({
          id: item.id,
          title: item.title,
          description: item.description,
          icon: item.icon,
          content: result.content
        });
        setIsModalOpen(true);
      } else {
        toast.error(result.error || "Failed to load skill details.");
      }
    } catch (error) {
      toast.error("An error occurred while loading skill details.");
    }
  };

  const heroWords = "Vibe Marketplace".split(" ");

  return (
    <div className="relative min-h-screen w-full pb-20 overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <GridBackground />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 min-h-[1.2em] flex items-center justify-center space-x-3 md:space-x-5"
          >
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, ease: "easeOut", duration: 0.4 }}
                className="animate-marketplace-title"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: heroWords.length * 0.08, ease: "easeOut", duration: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Discover and install powerful skills, tools, and templates to supercharge your AI-powered development workflow.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (heroWords.length + 1) * 0.08, ease: "easeOut", duration: 0.4 }}
            className="max-w-2xl mx-auto relative group transition-transform duration-300 ease-out focus-within:scale-[1.02]"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
            <Input 
              placeholder="Search skills, tools, templates..." 
              className="pl-12 h-14 text-lg rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Navigation & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (heroWords.length + 2) * 0.08, ease: "easeOut", duration: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8"
        >
          <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className={cn(
                    "relative px-6 py-2.5 rounded-full border border-transparent transition-all duration-200",
                    "text-gray-600 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:-translate-y-0.5 active:scale-[0.97]",
                    "data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400 data-[state=active]:hover:bg-transparent dark:data-[state=active]:hover:bg-transparent"
                  )}
                >
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-full border border-rose-500/30 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10 font-medium tracking-wide">{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredItems.map((item, index) => (
            <SpotlightCard
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 3) * 0.1, duration: 0.4, ease: "easeOut" }}
              className={cn(
                "p-5 md:p-6 backdrop-blur-sm flex flex-col h-full cursor-pointer group bg-white/50 dark:bg-zinc-900/40",
                "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(244,63,94,0.08)] hover:border-rose-500/40 active:scale-[0.98]"
              )}
              spotlightColor="rgba(244, 63, 94, 0.15)"
              onClick={() => handleSkillClick(item)}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 group-hover:bg-rose-500/10 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] group-hover:scale-[1.15] group-hover:-translate-y-1 transition-all duration-300 shrink-0">
                    <item.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-rose-500 transition-colors duration-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">{item.author}</span>
                      <span className="shrink-0 text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="shrink-0">{item.downloads} installs</span>
                    </div>
                  </div>
                </div>
                {item.trending && (
                  <Badge className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0 mt-1 hidden sm:flex animate-badge-shimmer font-semibold relative overflow-hidden">
                    <span className="relative z-10">Trending</span>
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 flex-grow text-[15px] leading-relaxed transition-colors group-hover:text-gray-800 dark:group-hover:text-gray-300">
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                <Badge variant="outline" className="rounded-lg border-zinc-200 dark:border-zinc-800 px-3 py-1 font-medium bg-zinc-50/50 dark:bg-zinc-900/50 group-hover:border-rose-500/30 group-hover:bg-rose-500/5 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-all duration-300">
                  {item.category}
                </Badge>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 flex items-center gap-1.5 transition-colors duration-300">
                  Learn More
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ease-out" />
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6 shadow-sm">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-2">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400">We couldn't find anything matching your search. Try different keywords.</p>
          </div>
        )}
      </section>

      <SkillDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skill={selectedSkill}
      />
    </div>
  );
}