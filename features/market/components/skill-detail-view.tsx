"use client";

import * as React from "react";
import {
  Check,
  Copy,
  ChevronLeft,
  Activity,
  Lock,
  LogIn,
  ShoppingCart,
  Zap,
  BadgeCheck,
  FileText,
  TrendingUp,
  Download,
  Tag,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { MARKET_ITEMS, MarketItem } from "@/features/market/data/market-items";
import { purchaseSkill } from "@/features/project/actions/skill-actions";
import { useRouter } from "next/navigation";
import { CheckoutDialog } from "@/components/checkout-dialog";

interface SkillDetailViewProps {
  skill: Omit<MarketItem, "icon"> & {
    content: string;
    isLoggedIn: boolean;
    isPurchased: boolean;
  };
}

const PREVIEW_CHARS = 750;

// ── Motion variants ───────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// ── Main component ───────────────────────────────────────────────────
export function SkillDetailView({ skill }: SkillDetailViewProps) {
  const Icon =
    MARKET_ITEMS.find((item) => item.id === skill.id)?.icon || FileText;
  const router = useRouter();
  const [buying, setBuying] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  const showFullContent = skill.isPurchased;
  const isCopyAllowed = skill.isFree || skill.isPurchased;

  const previewContent = showFullContent
    ? skill.content
    : skill.content.slice(0, PREVIEW_CHARS);

  const [copiedFull, setCopiedFull] = React.useState(false);

  const handleCopyFullContent = () => {
    if (!isCopyAllowed) {
      toast.error("You must purchase this premium skill to copy its content.");
      return;
    }
    navigator.clipboard.writeText(skill.content);
    setCopiedFull(true);
    toast.success("Full skill content copied to clipboard!");
    setTimeout(() => setCopiedFull(false), 2000);
  };

  // ── Dynamic Code block with copy permission ─────────────────────────
  const CodeBlock = React.useMemo(() => {
    return ({ className, children, ...props }: any) => {
      const [copied, setCopied] = React.useState(false);

      const extractText = (child: any): string => {
        if (typeof child === "string") return child;
        if (Array.isArray(child)) return child.map(extractText).join("");
        if (child?.props?.children) return extractText(child.props.children);
        return "";
      };

      const handleCopy = () => {
        if (!isCopyAllowed) {
          toast.error("You must purchase this premium skill to copy its content.");
          return;
        }
        const text = extractText(children);
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      return (
        <div className="relative group my-6">
          <pre {...props} className={cn(className, "scrollbar-thin", !isCopyAllowed && "select-none")}>
            {children}
          </pre>
          {isCopyAllowed && (
            <button
              onClick={handleCopy}
              aria-label="Copy code"
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-white hover:bg-zinc-700 active:scale-95"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      );
    };
  }, [isCopyAllowed]);

  const relatedSkills = MARKET_ITEMS.filter(
    (item) => item.category === skill.category && item.id !== skill.id
  ).slice(0, 3);

  const handleBuy = () => {
    if (!skill.isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen pb-28 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">

        {/* ── Back link ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-12"
        >
          <Link
            href="/market"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground dark:hover:text-zinc-200 transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Market
          </Link>
        </motion.div>

        {/* ── Hero — asymmetric grid ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] lg:grid-cols-[1fr_220px] gap-8 lg:gap-14 items-start mb-16">

          {/* Left: title hierarchy */}
          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* Badge row */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-2.5 mb-5"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-muted-foreground dark:text-zinc-500">
                {skill.category}
              </span>
              {skill.trending && (
                <Badge className="bg-primary/10 border border-primary/20 text-primary dark:text-rose-400 flex items-center gap-1 font-semibold text-[11px] animate-badge-shimmer relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </span>
                </Badge>
              )}
              {skill.isFree ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
                  Free
                </Badge>
              ) : (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold text-[11px]">
                  &#8377;{skill.price}
                </Badge>
              )}
              {skill.isPurchased && !skill.isFree && (
                <Badge className="bg-primary/10 text-primary dark:text-rose-400 border border-primary/20 flex items-center gap-1 text-[11px]">
                  <BadgeCheck className="w-3 h-3" /> Purchased
                </Badge>
              )}
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-[-0.03em] leading-[0.9] text-foreground dark:text-white mb-5"
            >
              {skill.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground dark:text-zinc-400 leading-relaxed max-w-xl mb-8"
            >
              {skill.description}
            </motion.p>

            {/* Metadata bar */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-muted-foreground dark:text-zinc-500 pt-6 border-t border-border dark:border-zinc-800"
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 shrink-0" />
                {skill.author}
              </span>
              <span className="text-border dark:text-zinc-700 hidden sm:block">·</span>
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 shrink-0" />
                {skill.downloads} installs
              </span>
              <span className="text-border dark:text-zinc-700 hidden sm:block">·</span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                {skill.category}
              </span>
            </motion.div>
          </motion.div>

          {/* Right: dark icon panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block"
          >
            <div className="relative aspect-square w-full max-w-[220px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950">
              {/* Grid lines */}
              <div
                className="absolute inset-0 opacity-[0.055]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              {/* Rose radial glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(226,42,42,0.25) 0%, transparent 62%)",
                }}
              />
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-16 h-16 text-white/90" />
              </div>
              {/* Corner notch */}
              <div className="absolute bottom-0 right-0 w-5 h-5 border-t border-l border-zinc-700/60" />
            </div>
          </motion.div>
        </div>

        {/* ── Content + Sidebar grid ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-12 items-start">

          {/* ── README panel ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border border-border dark:border-zinc-800 bg-card/50 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
              {/* Tab bar with traffic light dots */}
              <div className="px-6 py-3.5 border-b border-border dark:border-zinc-800 bg-muted/30 dark:bg-zinc-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 mr-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  </div>
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground font-mono">
                    README.md
                  </span>
                </div>
                {isCopyAllowed && (
                  <button
                    onClick={handleCopyFullContent}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
                  >
                    {copiedFull ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Full Content</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Prose content */}
              <div 
                className="p-7 sm:p-10 relative"
                onCopy={(e) => {
                  if (!isCopyAllowed) {
                    e.preventDefault();
                    toast.error("You must purchase this premium skill to copy its content.");
                  }
                }}
              >
                <div
                  className={cn(
                    "prose prose-zinc dark:prose-invert max-w-none",
                    "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
                    "prose-h1:text-3xl prose-h1:mb-7",
                    "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border",
                    "prose-h3:text-xl prose-h3:mt-7 prose-h3:mb-4",
                    "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-5",
                    "prose-strong:text-foreground prose-strong:font-semibold",
                    "prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.88em] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
                    "prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:shadow-xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:my-7",
                    "prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6",
                    "prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6",
                    "prose-li:text-muted-foreground prose-li:my-1.5 marker:text-muted-foreground",
                    "prose-table:border-collapse prose-table:w-full prose-table:my-7",
                    "prose-th:bg-muted prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-foreground",
                    "prose-td:p-4 prose-td:border-t prose-td:border-border prose-td:text-muted-foreground",
                    "prose-tr:even:bg-muted/30",
                    "prose-hr:my-10 prose-hr:border-border",
                    "prose-a:text-primary hover:prose-a:underline prose-a:font-medium transition-colors",
                    !isCopyAllowed && "select-none"
                  )}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{ pre: CodeBlock }}
                  >
                    {previewContent}
                  </ReactMarkdown>
                </div>

                {/* ── Gate — content lock panel ─────────────── */}
                {!showFullContent && (
                  <div className="relative mt-0 select-none">
                    <div className="h-52 -mt-52 bg-gradient-to-b from-transparent via-card/60 dark:via-zinc-900/70 to-card dark:to-zinc-900 pointer-events-none relative z-10" />

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative overflow-hidden border border-zinc-300/60 dark:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-950"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                      }}
                    >
                      {/* Grid backdrop */}
                      <div
                        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
                        style={{
                          backgroundImage:
                            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                          backgroundSize: "28px 28px",
                        }}
                      />
                      {/* Glow */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-40 rounded-full blur-3xl pointer-events-none"
                        style={{ background: "rgba(226,42,42,0.07)" }}
                      />
                      {/* Corner notch accent */}
                      <div className="absolute top-0 right-0 w-5 h-5 border-b border-l border-zinc-400/40 dark:border-zinc-600/50" />

                      <div className="relative z-10 flex flex-col items-center text-center px-8 py-14">
                        {/* Status pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                            {skill.isFree ? "Free — Auth Required" : "Premium Content"}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none mb-3">
                          {!skill.isLoggedIn
                            ? skill.isFree
                              ? "Sign in to unlock for free"
                              : "Sign in to purchase"
                            : "Unlock the full skill"}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 max-w-sm leading-relaxed mb-10">
                          {skill.isFree
                            ? "This skill is completely free — just create an account to activate it."
                            : "One-time purchase. Works across all your projects, forever."}
                        </p>

                        {/* Price display — paid + logged in */}
                        {!skill.isFree && skill.isLoggedIn && (
                          <div className="flex items-stretch mb-10 border border-zinc-300 dark:border-zinc-700/80 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 bg-white dark:bg-zinc-900 border-r border-zinc-300 dark:border-zinc-700/80 flex flex-col justify-center">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 mb-0.5">
                                One-time
                              </span>
                              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                                Price
                              </span>
                            </div>
                            <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950 flex items-baseline gap-1">
                              <span className="text-lg font-bold text-zinc-400 dark:text-zinc-500 mt-1">
                                &#8377;
                              </span>
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

                        <p className="mt-6 text-[11px] font-mono text-zinc-400 dark:text-zinc-600 tracking-wide">
                          {skill.isFree
                            ? "NO PAYMENT REQUIRED · FREE FOREVER"
                            : "SECURE CHECKOUT · INSTANT ACCESS · NO SUBSCRIPTION"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:sticky lg:top-24 space-y-6"
          >
            {/* ── CTA / status card ─────────────────────────────── */}
            {skill.isFree ? (
              <div className="rounded-2xl border border-emerald-500/20 p-5"
                style={{ background: "rgba(16,185,129,0.05)" }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-xl" style={{ background: "rgba(16,185,129,0.1)" }}>
                    <Zap className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">Free Skill</div>
                    <div className="text-xs text-muted-foreground">No payment required</div>
                  </div>
                </div>
                {!skill.isLoggedIn && (
                  <Link href="/auth/login" className="block mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 active:scale-[0.98]"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Sign in to enable
                    </Button>
                  </Link>
                )}
              </div>
            ) : skill.isPurchased ? (
              <div className="rounded-2xl border border-primary/20 p-5"
                style={{ background: "rgba(226,42,42,0.05)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ background: "rgba(226,42,42,0.08)" }}>
                    <BadgeCheck className="w-4 h-4 text-primary dark:text-rose-400" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">Purchased</div>
                    <div className="text-xs text-muted-foreground">
                      Active across all projects
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Paid, not purchased — dramatic price card */
              <div className="rounded-2xl border border-border dark:border-zinc-800 bg-card dark:bg-zinc-900/40 overflow-hidden">
                <div className="px-6 pt-6 pb-5 border-b border-border dark:border-zinc-800">
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground dark:text-zinc-600 mb-2">
                    One-time price
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-muted-foreground dark:text-zinc-500">
                      &#8377;
                    </span>
                    <span className="text-5xl font-black tracking-tight text-foreground dark:text-white leading-none">
                      {skill.price}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <Button
                    onClick={handleBuy}
                    disabled={buying}
                    variant="brand"
                    className="w-full h-11 font-semibold gap-2 shadow-[0_4px_20px_rgba(226,42,42,0.2)] hover:shadow-[0_6px_28px_rgba(226,42,42,0.32)] transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {buying ? "Processing…" : "Buy Now"}
                  </Button>
                  <p className="text-center text-[10px] font-mono text-muted-foreground dark:text-zinc-600 tracking-wide uppercase">
                    Instant access · No subscription
                  </p>
                </div>
              </div>
            )}

            {/* ── Stats ─────────────────────────────────────────── */}
            <div className="divide-y divide-border dark:divide-zinc-800">
              {(
                [
                  { icon: Download, label: "Installs", value: skill.downloads },
                  { icon: Clock, label: "Updated", value: "Recently" },
                  { icon: Activity, label: "Author", value: skill.author },
                  {
                    icon: Lock,
                    label: "License",
                    value: skill.isFree ? (
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold">
                        Free
                      </span>
                    ) : (
                      <span className="font-bold">&#8377;{skill.price}</span>
                    ),
                  },
                ] as const
              ).map(({ icon: StatIcon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3.5"
                >
                  <span className="text-sm text-muted-foreground dark:text-zinc-500 flex items-center gap-2">
                    <StatIcon className="w-3.5 h-3.5 shrink-0" />
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-foreground dark:text-zinc-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Related skills ────────────────────────────────── */}
            {relatedSkills.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.17em] text-muted-foreground dark:text-zinc-600 mb-3">
                  Related
                </div>
                <div className="space-y-0.5">
                  {relatedSkills.map((rel) => (
                    <Link key={rel.id} href={`/market/${rel.id}`}>
                      <div className="group flex items-center gap-3 py-2.5 px-2.5 rounded-xl hover:bg-muted/60 dark:hover:bg-zinc-900/60 transition-colors duration-150">
                        <div className="p-1.5 rounded-lg bg-muted dark:bg-zinc-900 border border-border dark:border-zinc-800 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors shrink-0">
                          <rel.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary dark:group-hover:text-rose-400 transition-colors" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-foreground/70 dark:text-zinc-400 group-hover:text-foreground dark:group-hover:text-zinc-200 transition-colors truncate">
                          {rel.title}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => purchaseSkill(skill.id)}
        itemName={skill.title}
        itemPrice={skill.price ?? 299}
        itemType="skill"
      />
    </div>
  );
}
