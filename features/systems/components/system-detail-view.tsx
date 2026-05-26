"use client";

import * as React from "react";
import {
  ChevronLeft,
  Calendar,
  Activity,
  Lock,
  LogIn,
  ShoppingCart,
  Zap,
  BadgeCheck,
  Palette,
  Monitor,
  FileText,
  Sun,
  Moon,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SystemItem } from "@/features/systems/data/system-items";
import { Particles } from "@/components/ui/particles";
import { purchaseSkill } from "@/features/project/actions/skill-actions";
import { useRouter } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SystemPreviewIframe } from "./system-preview-iframe";

interface SystemDetailViewProps {
  system: SystemItem & {
    isLoggedIn: boolean;
    isPurchased: boolean;
  };
  skillMd: string;
}

export function SystemDetailView({ system, skillMd }: SystemDetailViewProps) {
  const router = useRouter();
  const [buying, setBuying] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<"live" | "markdown">("live");
  const [previewTheme, setPreviewTheme] = React.useState<"light" | "dark">("light");
  const [copied, setCopied] = React.useState(false);

  const showFullContent = system.isPurchased;

  const handleCopy = () => {
    navigator.clipboard.writeText(skillMd);
    setCopied(true);
    toast.success("Copied DESIGN.md to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = async () => {
    if (!system.isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setBuying(true);
    try {
      // Reusing purchaseSkill since it adds to purchasedSkills array
      const res = await purchaseSkill(system.id);
      if (res.success) {
        toast.success(res.alreadyOwned ? "Already owned!" : `${system.name} unlocked!`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Purchase failed");
      }
    } catch {
      toast.error("Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20 relative overflow-x-hidden">
      <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={120}
        staticity={40}
        ease={50}
      />
      <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <Link
          href="/systems"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Systems
        </Link>
      </div>

      {/* Top Header Block - Details on left, Checkout Card on right */}
      <div className="flex flex-col lg:flex-row gap-12 mb-12">
        {/* Main Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div 
              className="p-4 rounded-3xl shadow-inner border border-border shrink-0 flex items-center justify-center"
              style={{ background: `${system.palette[0]}15` }}
            >
              <Palette className="w-12 h-12" style={{ color: system.accent }} />
            </div>
            <div className="flex flex-col pt-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  {system.name}
                </h1>
                {system.trending && (
                  <Badge
                    variant="secondary"
                    className="bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  >
                    Trending
                  </Badge>
                )}
                {system.isFree ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Free
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                    ₹{system.price}
                  </Badge>
                )}
                {system.isPurchased && !system.isFree && (
                  <Badge className="bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Purchased
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mb-1">{system.desc}</p>
              <div className="text-[12px] font-bold uppercase tracking-widest mt-2" style={{ color: system.accent }}>
                {system.tagline}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Action */}
        <div className="w-full lg:w-[340px] shrink-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
              {/* CTA button */}
              {system.isFree ? (
                <div className="w-full h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-base">
                  <Zap className="w-5 h-5" />
                  {system.isLoggedIn ? "Enabled by Default" : "Free — Sign in to use"}
                </div>
              ) : system.isPurchased ? (
                <div className="w-full h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center gap-2 text-primary font-semibold text-base">
                  <BadgeCheck className="w-5 h-5" />
                  Purchased — Active in projects
                </div>
              ) : (
                <Button
                  onClick={handleBuy}
                  disabled={buying}
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {buying ? "Processing…" : `Buy Now — ₹${system.price}`}
                </Button>
              )}

              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Installs
                  </span>
                  <span className="text-sm font-medium text-foreground">{system.downloads}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Updated
                  </span>
                  <span className="text-sm font-medium text-foreground">Recently</span>
                </div>

                <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Author</span>
                  <span className="text-sm font-medium text-foreground">{system.author}</span>
                </div>

                <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-bold text-foreground">
                    {system.isFree ? (
                      <span className="text-emerald-500">Free</span>
                    ) : (
                      <span>₹{system.price}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Preview Section */}
      <div className="w-full mt-16">
        {/* Preview Navigation & Toggle Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            <Palette className="w-6 h-6 text-rose-500" />
            Preview
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Tab Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/40 p-0.5">
              <button
                onClick={() => setPreviewMode("live")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap",
                  previewMode === "live"
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
              <button
                onClick={() => setPreviewMode("markdown")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap",
                  previewMode === "markdown"
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>DESIGN.md</span>
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/40 p-0.5">
              <button
                onClick={() => setPreviewTheme("light")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap",
                  previewTheme === "light"
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setPreviewTheme("dark")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap",
                  previewTheme === "dark"
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl border border-border bg-card/50 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {/* Viewport container */}
          <div className={cn(
            "w-full overflow-hidden relative",
            showFullContent ? "h-auto" : "min-h-[500px] max-h-[600px]"
          )}>
            {previewMode === "live" ? (
              <SystemPreviewIframe system={system} skillMd={skillMd} theme={previewTheme} />
            ) : (
              <div className={cn(
                "w-full flex flex-col bg-zinc-950 text-zinc-100",
                showFullContent ? "h-[800px]" : "h-[600px]"
              )}>
                {/* DESIGN.md header bar */}
                <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between shrink-0 font-mono text-xs">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <FileText className="w-3.5 h-3.5" /> DESIGN.md
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors rounded cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                {/* Markdown code body */}
                <div className="flex-1 overflow-auto">
                  <SyntaxHighlighter
                    language="markdown"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "24px",
                      background: "transparent",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      fontFamily: "var(--font-mono), monospace",
                    }}
                  >
                    {skillMd}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

            {/* Gate — shown when not purchased */}
            {!showFullContent && (
              <div className="absolute inset-0 z-10 flex flex-col justify-end select-none">
                {/* Deep fade from content */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/85 dark:via-zinc-950/90 to-card dark:to-zinc-950 pointer-events-none" />

                {/* Gate panel */}
                <div
                  className="relative overflow-hidden border-t border-zinc-700/60 dark:border-zinc-700/40 bg-zinc-50 dark:bg-zinc-950 mt-auto"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                >
                  {/* Grid backdrop */}
                  <div
                    className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />

                  {/* Scanlines */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.025]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,1) 3px, rgba(0,0,0,1) 4px)",
                    }}
                  />

                  {/* Glow orb */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-48 bg-rose-500/6 dark:bg-rose-500/8 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center text-center px-8 py-12 pb-16 gap-0">
                    {/* Status badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        {system.isFree ? "Free — Auth Required" : "Premium Design System"}
                      </span>
                    </div>

                    {/* Heading */}
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none mb-3">
                      {!system.isLoggedIn
                        ? system.isFree
                          ? "Sign in to use for free"
                          : "Sign in to purchase"
                        : `Unlock this design system`}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 max-w-sm leading-relaxed mb-8">
                      {system.isFree
                        ? "This system is completely free — just create an account to activate it in your projects."
                        : "One-time purchase. Use this premium aesthetic across all your projects."}
                    </p>

                    {/* Price slab — paid + logged in only */}
                    {!system.isFree && system.isLoggedIn && (
                      <div className="flex items-stretch mb-8 border border-zinc-300 dark:border-zinc-700/80 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 bg-white dark:bg-zinc-900 border-r border-zinc-300 dark:border-zinc-700/80 flex flex-col justify-center">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 mb-0.5">
                            One-time
                          </span>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                            Price
                          </span>
                        </div>
                        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 flex items-baseline gap-1">
                          <span className="text-lg font-bold text-zinc-400 dark:text-zinc-500 mt-1">₹</span>
                          <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
                            {system.price}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    {!system.isLoggedIn ? (
                      <Link href="/auth/login">
                        <button className="group relative inline-flex items-center gap-2.5 px-10 h-12 font-semibold text-sm text-white bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
                          <span className="absolute inset-0 bg-rose-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                          <LogIn className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">
                            {system.isFree ? "Sign In — It's Free" : "Sign In to Purchase"}
                          </span>
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={handleBuy}
                        disabled={buying}
                        className="group relative inline-flex items-center gap-2.5 px-10 h-12 font-semibold text-sm text-white bg-rose-500 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <span className="absolute inset-0 bg-zinc-900 translate-y-full group-hover:translate-y-0 group-disabled:translate-y-full transition-transform duration-300 ease-out" />
                        <ShoppingCart className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">
                          {buying ? "Processing…" : "Buy Now"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
