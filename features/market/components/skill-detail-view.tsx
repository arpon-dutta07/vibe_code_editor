"use client";

import * as React from "react";
import {
  Check,
  Copy,
  ChevronLeft,
  Calendar,
  FileText,
  Activity,
  Lock,
  LogIn,
  ShoppingCart,
  Zap,
  BadgeCheck,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MARKET_ITEMS, MarketItem } from "@/features/market/data/market-items";
import { Particles } from "@/components/ui/particles";
import { purchaseSkill } from "@/features/project/actions/skill-actions";
import { useRouter } from "next/navigation";

interface SkillDetailViewProps {
  skill: Omit<MarketItem, "icon"> & {
    content: string;
    isLoggedIn: boolean;
    isPurchased: boolean;
  };
}

const PREVIEW_CHARS = 750;

const CodeBlock = ({ node, className, children, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);

  const extractText = (child: any): string => {
    if (typeof child === "string") return child;
    if (Array.isArray(child)) return child.map(extractText).join("");
    if (child?.props?.children) return extractText(child.props.children);
    return "";
  };

  const text = extractText(children);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <pre {...props} className={cn(className, "scrollbar-thin")}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-white hover:bg-zinc-700 active:scale-95 shadow-sm"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export function SkillDetailView({ skill }: SkillDetailViewProps) {
  const Icon = MARKET_ITEMS.find((item) => item.id === skill.id)?.icon || FileText;
  const router = useRouter();
  const [buying, setBuying] = React.useState(false);

  const showFullContent = skill.isPurchased;
  const previewContent = showFullContent
    ? skill.content
    : skill.content.slice(0, PREVIEW_CHARS);

  const handleBuy = async () => {
    if (!skill.isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setBuying(true);
    try {
      const res = await purchaseSkill(skill.id);
      if (res.success) {
        toast.success(res.alreadyOwned ? "Already owned!" : `${skill.title} unlocked!`);
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
          href="/market"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Market
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-inner border border-border shrink-0">
              <Icon className="w-12 h-12 text-primary" />
            </div>
            <div className="flex flex-col pt-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  {skill.title}
                </h1>
                {skill.trending && (
                  <Badge
                    variant="secondary"
                    className="bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  >
                    Trending
                  </Badge>
                )}
                {skill.isFree ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Free
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                    ₹{skill.price}
                  </Badge>
                )}
                {skill.isPurchased && !skill.isFree && (
                  <Badge className="bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Purchased
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">{skill.description}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">README.md</span>
            </div>
            <div className="p-8 sm:p-12 relative">
              <div
                className={cn(
                  "prose prose-zinc dark:prose-invert max-w-none",
                  "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
                  "prose-h1:text-4xl prose-h1:mb-8",
                  "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border",
                  "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
                  "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6",
                  "prose-strong:text-foreground prose-strong:font-semibold",
                  "prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
                  "prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:my-8",
                  "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
                  "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
                  "prose-li:text-muted-foreground prose-li:my-2 marker:text-muted-foreground",
                  "prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:border prose-table:border-border prose-table:rounded-xl prose-table:overflow-hidden",
                  "prose-th:bg-muted prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-foreground",
                  "prose-td:p-4 prose-td:border-t prose-td:border-border prose-td:text-muted-foreground",
                  "prose-tr:even:bg-muted/30",
                  "prose-hr:my-12 prose-hr:border-border",
                  "prose-a:text-primary hover:prose-a:underline prose-a:font-medium transition-colors"
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{ pre: CodeBlock }}
                >
                  {previewContent}
                </ReactMarkdown>
              </div>

              {/* Gate — shown when not purchased */}
              {!showFullContent && (
                <div className="relative mt-0 select-none">
                  {/* Deep fade from content */}
                  <div className="h-52 -mt-52 bg-gradient-to-b from-transparent via-card/60 dark:via-zinc-900/70 to-card dark:to-zinc-900 pointer-events-none relative z-10" />

                  {/* Gate panel */}
                  <div
                    className="relative overflow-hidden border border-zinc-700/60 dark:border-zinc-700/40 bg-zinc-50 dark:bg-zinc-950"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
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

                    {/* Corner accent — top-right notch fill */}
                    <div
                      className="absolute top-0 right-0 w-5 h-5 border-b border-l border-zinc-600/50 dark:border-zinc-600/60"
                      style={{ background: "transparent" }}
                    />

                    <div className="relative z-10 flex flex-col items-center text-center px-8 py-12 gap-0">
                      {/* Status badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 mb-7 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                          {skill.isFree ? "Free — Auth Required" : "Premium Content"}
                        </span>
                      </div>

                      {/* Heading */}
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none mb-3">
                        {!skill.isLoggedIn
                          ? skill.isFree
                            ? "Sign in to unlock for free"
                            : "Sign in to purchase"
                          : `Unlock the full skill`}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-500 max-w-sm leading-relaxed mb-8">
                        {skill.isFree
                          ? "This skill is completely free — just create an account to activate it."
                          : "One-time purchase. Works across all your projects, forever."}
                      </p>

                      {/* Price slab — paid + logged in only */}
                      {!skill.isFree && skill.isLoggedIn && (
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
                              {skill.price}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      {!skill.isLoggedIn ? (
                        <Link href="/auth/login">
                          <button className="group relative inline-flex items-center gap-2.5 px-10 h-12 font-semibold text-sm text-white bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <span className="absolute inset-0 bg-rose-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <LogIn className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">
                              {skill.isFree ? "Sign In — It's Free" : "Sign In to Purchase"}
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

                      {/* Fine print */}
                      <p className="mt-5 text-[11px] font-mono text-zinc-400 dark:text-zinc-600 tracking-wide">
                        {skill.isFree
                          ? "NO PAYMENT REQUIRED · FREE FOREVER"
                          : "SECURE CHECKOUT · INSTANT ACCESS · NO SUBSCRIPTION"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
          <div className="sticky top-24 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
              {/* CTA button */}
              {skill.isFree ? (
                <div className="w-full h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-base">
                  <Zap className="w-5 h-5" />
                  {skill.isLoggedIn ? "Enabled by Default" : "Free — Sign in to enable"}
                </div>
              ) : skill.isPurchased ? (
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
                  {buying ? "Processing…" : `Buy Now — ₹${skill.price}`}
                </Button>
              )}

              <div className="mt-8 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Installs
                  </span>
                  <span className="text-sm font-medium text-foreground">{skill.downloads}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Updated
                  </span>
                  <span className="text-sm font-medium text-foreground">Recently</span>
                </div>

                <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Author</span>
                  <span className="text-sm font-medium text-foreground">{skill.author}</span>
                </div>

                <div className="pt-5 mt-5 border-t border-border flex flex-col gap-3">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-muted/50 rounded-md">
                      {skill.category}
                    </Badge>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-bold text-foreground">
                    {skill.isFree ? (
                      <span className="text-emerald-500">Free</span>
                    ) : (
                      <span>₹{skill.price}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
