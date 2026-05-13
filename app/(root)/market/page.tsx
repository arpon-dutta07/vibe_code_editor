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
import Image from "next/image";

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
    id: "backend-architecture",
    title: "Backend Architecture",
    description: "Templates and best practices for scalable Node.js and Go backends with clean architecture.",
    category: "Architecture",
    icon: Database,
    author: "Architects Inc",
    downloads: "850",
  },
  {
    id: "github-actions",
    title: "GitHub Actions Automator",
    description: "Automatically generate and optimize CI/CD pipelines for your projects.",
    category: "Integrations",
    icon: Github,
    author: "DevOps Pro",
    downloads: "2.1k",
  },
  {
    id: "webcontainer-runtime",
    title: "WebContainer Plus",
    description: "Enhanced runtime for WebContainers with pre-installed common dev tools.",
    category: "Tools",
    icon: Cpu,
    author: "StackBlitz",
    downloads: "3.4k",
  },
  {
    id: "react-starter-kit",
    title: "Modern React Starter",
    description: "Opinionated React starter with Tailwind 4, Shadcn, and TanStack Query.",
    category: "Templates",
    icon: Globe,
    author: "VibeCode Team",
    downloads: "1.5k",
  },
  {
    id: "performance-profiler",
    title: "Vibe Profiler",
    description: "Deep dive into your code's performance metrics with AI-driven suggestions.",
    category: "Tools",
    icon: Zap,
    author: "SpeedLab",
    downloads: "920",
  },
  {
    id: "sql-optimizer",
    title: "SQL Smart Query",
    description: "Let the AI optimize your PostgreSQL queries for maximum efficiency.",
    category: "Skills",
    icon: Terminal,
    author: "DB Masters",
    downloads: "1.1k",
    trending: true,
  },
  {
    id: "api-generator",
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

  const filteredItems = MARKET_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black w-full pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 tracking-tight mb-6"
          >
            Vibe Marketplace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Discover and install powerful skills, tools, and templates to supercharge your AI-powered development workflow.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
            <Input 
              placeholder="Search skills, tools, templates..." 
              className="pl-12 h-14 text-lg rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Navigation & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <Tabs defaultValue="All" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className={cn(
                    "px-6 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:border-rose-500 transition-all",
                    "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative p-5 md:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm flex flex-col h-full",
                "hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300"
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-rose-500/10 transition-colors shrink-0">
                    <item.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-rose-500 transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-rose-500 transition-colors truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">{item.author}</span>
                      <span className="shrink-0">•</span>
                      <span className="shrink-0">{item.downloads} installs</span>
                    </div>
                  </div>
                </div>
                {item.trending && (
                  <Badge className="bg-rose-500/10 text-rose-500 border-none shrink-0 mt-1 hidden sm:flex">
                    Trending
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 flex-grow text-[15px] leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                <Badge variant="outline" className="rounded-lg border-zinc-200 dark:border-zinc-800 px-3 py-1 font-medium">
                  {item.category}
                </Badge>
                <Button variant="ghost" className="hover:text-rose-500 hover:bg-rose-500/10 gap-2 font-semibold">
                  Learn More
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400">We couldn't find anything matching your search. Try different keywords.</p>
          </div>
        )}
      </section>
    </div>
  );
}
