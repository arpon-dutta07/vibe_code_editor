"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  Code2,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Package,
  Layers,
  Brain,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckoutDialog } from "@/components/checkout-dialog";
import { purchaseSkill } from "@/features/project/actions/skill-actions";
import { purchaseSystem } from "@/features/systems/actions/system-actions";
import { HeroOrbit } from "@/components/ui/hero-orbit";

// ── Data ─────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Code2,
    price: null,
    priceLabel: "Free",
    period: null,
    tagline: "Explore VibeCode with no commitment.",
    projects: "3 projects",
    context: "32K context window",
    skills: 3,
    systems: 6,
    highlight: false,
    badge: null,
    cta: "Get started",
    ctaHref: "/auth/sign-in",
    features: [
      "3 concurrent projects",
      "32K token context window",
      "3 free skills included",
      "6 free design systems",
      "Basic AI generation",
      "Community support",
    ],
    addons: "Buy skills & systems individually",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    price: 999,
    priceLabel: "₹999",
    period: "/mo",
    tagline: "More headroom, more tools, faster iteration.",
    projects: "10 projects",
    context: "128K context window",
    skills: 5,
    systems: 18,
    highlight: true,
    badge: "Most popular",
    cta: "Start Pro",
    ctaHref: "/auth/sign-in",
    features: [
      "10 concurrent projects",
      "128K token context window",
      "5 premium skills included",
      "All 18 design systems unlocked",
      "Priority AI generation queue",
      "Email support",
      "+3 context window top-ups/mo",
    ],
    addons: "Add more skills à la carte",
  },
  {
    id: "studio",
    name: "Studio",
    icon: Users,
    price: 2499,
    priceLabel: "₹2,499",
    period: "/mo",
    tagline: "Everything unlocked. Maximum creative power.",
    projects: "Unlimited projects",
    context: "256K context window",
    skills: 12,
    systems: 18,
    highlight: false,
    badge: "All-inclusive",
    cta: "Get Studio",
    ctaHref: "/auth/sign-in",
    features: [
      "Unlimited projects",
      "256K token context window",
      "All 12 skills included",
      "All 18 design systems included",
      "Highest AI priority queue",
      "Dedicated support",
      "Unlimited context top-ups",
      "Early access to new features",
    ],
    addons: null,
  },
];

const SKILLS_ADDONS = [
  { id: "logo-to-website",       name: "Logo to Website",        price: 499, category: "Design" },
  { id: "seo-skeleton",          name: "SEO Skeleton Builder",   price: 799, category: "SEO" },
  { id: "wireframe-to-website",  name: "Wireframe to Website",   price: 399, category: "Layout" },
  { id: "moodboard-matcher",     name: "Moodboard Matcher",      price: 299, category: "Design" },
  { id: "responsive-wizard",     name: "Responsive Wizard",      price: 599, category: "Layout" },
  { id: "scroll-storyteller",    name: "Scroll Storyteller",     price: 349, category: "Animation" },
  { id: "component-library",     name: "Component Library Drop", price: 999, category: "Design" },
  { id: "multilingual-switcher", name: "Multilingual Switcher",  price: 449, category: "Layout" },
  { id: "animation-layer",       name: "Animation Layer",        price: 649, category: "Animation" },
];

const SYSTEM_ADDONS = [
  { id: "corporate-professional", name: "Corporate",       price: 349 },
  { id: "dark-cyberpunk",         name: "Dark Cyberpunk",  price: 399 },
  { id: "flat-modern",            name: "Flat Modern",     price: 299 },
  { id: "futuristic",             name: "Futuristic",      price: 299 },
  { id: "glassdark",              name: "GlassDark",       price: 399 },
  { id: "glassmorphism",          name: "Glassmorphism",   price: 499 },
  { id: "minimalist-clean",       name: "Minimalist Clean",price: 299 },
  { id: "neumorphic",             name: "Neumorphic",      price: 299 },
  { id: "shopalike",              name: "Shopalike",       price: 499 },
  { id: "pastel-playful",         name: "VoiceBox",        price: 299 },
  { id: "3d-layered",             name: "Warm Earth",      price: 299 },
  { id: "warmearth",              name: "WarmEarth",       price: 399 },
];

const CONTEXT_ADDONS = [
  { label: "+64K tokens", price: 199, desc: "Good for longer pages" },
  { label: "+128K tokens", price: 349, desc: "Multi-file projects" },
  { label: "+256K tokens", price: 599, desc: "Full site refactors" },
];

const BUNDLES = [
  {
    id: "skills-bundle",
    name: "Skills Bundle",
    icon: Sparkles,
    desc: "All 9 premium skills. One price, no picking.",
    includes: ["All 9 premium AI skills", "Permanent unlock, not subscription", "Works on any plan"],
    price: 2999,
    originalPrice: 6081,
    accent: "from-rose-500 to-pink-500",
    shadow: "shadow-[0_0_48px_rgba(226,42,42,0.18)]",
  },
  {
    id: "systems-bundle",
    name: "Systems Bundle",
    icon: Layers,
    desc: "All 12 premium design systems unlocked forever.",
    includes: ["All 12 premium design systems", "Permanent unlock", "Applies across all projects"],
    price: 3499,
    originalPrice: 4688,
    accent: "from-violet-500 to-indigo-500",
    shadow: "shadow-[0_0_48px_rgba(139,92,246,0.18)]",
  },
  {
    id: "full-stack-bundle",
    name: "Full Stack Bundle",
    icon: Package,
    desc: "Every skill + every design system. Total unlock.",
    includes: ["All 9 premium skills", "All 12 premium design systems", "Best value — save ₹5,270"],
    price: 5499,
    originalPrice: 10769,
    accent: "from-amber-500 to-rose-500",
    shadow: "shadow-[0_0_48px_rgba(245,158,11,0.18)]",
    featured: true,
  },
  {
    id: "context-bundle",
    name: "Context Max",
    icon: Brain,
    desc: "Boost your context window to the absolute maximum.",
    includes: ["+512K tokens added to your plan", "Per-month subscription add-on", "Stacks with any base plan"],
    price: 899,
    originalPrice: 1147,
    accent: "from-emerald-500 to-cyan-500",
    shadow: "shadow-[0_0_48px_rgba(16,185,129,0.18)]",
  },
];

const FAQS = [
  {
    q: "Can I buy skills individually without a plan upgrade?",
    a: "Yes. All premium skills and design systems are available as one-time purchases on any plan, including Starter.",
  },
  {
    q: "What is the context window?",
    a: "Context window is how much of your project (code, prompts, history) the AI can see at once. A larger window means better understanding of complex, multi-file sites.",
  },
  {
    q: "Are bundle purchases one-time or recurring?",
    a: "Skills and design system bundles are one-time purchases — permanent unlocks. Context window top-ups are monthly add-ons.",
  },
  {
    q: "What happens to my skills if I downgrade my plan?",
    a: "Skills and systems you've individually purchased are yours forever, regardless of plan changes.",
  },
  {
    q: "Is there a free trial for Pro or Studio?",
    a: "The Starter plan is free indefinitely. We don't offer timed trials, but you can upgrade and cancel anytime.",
  },
];

// ── Sub-components ───────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
      <span className="w-4 h-px bg-primary" />
      {children}
      <span className="w-4 h-px bg-primary" />
    </span>
  );
}

function AddonPill({ name, price, tag, onBuy }: { name: string; price: number; tag?: string; onBuy: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border border-border/60 dark:border-zinc-800 bg-card/50 dark:bg-zinc-900/50 hover:border-border dark:hover:border-zinc-700 transition-colors group">
      <div className="flex items-center gap-2 min-w-0">
        {tag && (
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
            {tag}
          </span>
        )}
        <span className="text-sm text-foreground dark:text-zinc-200 truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-bold text-foreground dark:text-white">₹{price}</span>
        <Button variant="outline" className="h-6 px-2 text-[10px]" onClick={onBuy}>Add</Button>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-border/50 dark:border-zinc-800 py-5 cursor-pointer group"
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-foreground dark:text-white group-hover:text-primary transition-colors">
          {q}
        </span>
        <span className={cn("text-muted-foreground transition-transform duration-200 shrink-0", open && "rotate-45")}>
          <X className="w-4 h-4" />
        </span>
      </div>
      {open && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground dark:text-zinc-400 mt-3 leading-relaxed"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

type CheckoutItem = {
  name: string
  price: number
  type: "skill" | "style"
  onSuccess: () => Promise<{ success: boolean; error?: string; alreadyOwned?: boolean }>
}

export default function PricingPage() {
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null)

  const openSkill = (id: string, name: string, price: number) =>
    setCheckoutItem({ name, price, type: "skill", onSuccess: () => purchaseSkill(id) })

  const openSystem = (id: string, name: string, price: number) =>
    setCheckoutItem({ name, price, type: "style", onSuccess: () => purchaseSystem(id) })

  const openBundle = (name: string, price: number) =>
    setCheckoutItem({ name, price, type: "skill", onSuccess: async () => ({ success: true, alreadyOwned: false }) })

  return (
    <main className="min-h-screen bg-background pt-24 pb-32">
      {/* ── HERO ── */}
      <section className="px-6 py-20 md:py-28 text-center relative overflow-hidden">
        {/* Soft glow bg */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[300px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <SectionLabel>Pricing</SectionLabel>
          <div className="relative mb-5">
            <HeroOrbit
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[960px] h-[640px]"
              primaryRgb="6,182,212"
              accentRgb="139,92,246"
            />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-foreground dark:text-white leading-[1.02] relative" style={{ zIndex: 1 }}>
              Start free.{" "}
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-transparent">
                Build without limits.
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Every plan starts with a solid foundation. Add skills, design systems,
            and context windows exactly as you need them — individually or in bundles.
          </p>
        </motion.div>
      </section>

      {/* ── BASE PLANS ── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative rounded-2xl p-6 flex flex-col gap-5",
                    plan.highlight
                      ? "border-2 border-primary/40 bg-card dark:bg-zinc-900 shadow-[0_0_60px_rgba(226,42,42,0.15)] dark:shadow-[0_0_60px_rgba(226,42,42,0.22)]"
                      : "border border-border/80 dark:border-zinc-800 bg-card dark:bg-zinc-900"
                  )}
                >
                  {plan.badge && (
                    <span
                      className={cn(
                        "absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider",
                        plan.highlight
                          ? "bg-gradient-to-r from-rose-500 to-pink-500"
                          : "bg-zinc-700 dark:bg-zinc-600"
                      )}
                    >
                      {plan.badge}
                    </span>
                  )}

                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          plan.highlight ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <span className="text-sm font-bold text-foreground dark:text-white">{plan.name}</span>
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-4xl font-black text-foreground dark:text-white tracking-tight">
                        {plan.priceLabel}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-muted-foreground pb-1">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{plan.tagline}</p>
                  </div>

                  {/* Specs pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {[plan.projects, plan.context].map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-400"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground dark:text-zinc-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-px" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Add-on note */}
                  {plan.addons && (
                    <p className="text-[10px] text-muted-foreground border-t border-border/50 dark:border-zinc-800 pt-3">
                      + {plan.addons}
                    </p>
                  )}

                  {/* CTA */}
                  <Button
                    onClick={() => openBundle(plan.name, plan.price ?? 0)}
                    className={cn(
                      "w-full font-semibold transition-all duration-300 active:scale-[0.98]",
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_rgba(226,42,42,0.3)] hover:shadow-[0_6px_28px_rgba(226,42,42,0.45)]"
                        : ""
                    )}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BUNDLES ── */}
      <section className="px-6 py-20 bg-muted/30 dark:bg-zinc-950/50 border-y border-border/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Bundles</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.025em] text-foreground dark:text-white mb-3">
              Buy more, spend less.
            </h2>
            <p className="text-muted-foreground dark:text-zinc-400 text-base max-w-md mx-auto">
              Bundle deals unlock everything in a category at a steep discount.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BUNDLES.map((bundle, i) => {
              const Icon = bundle.icon;
              const savings = bundle.originalPrice - bundle.price;
              return (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative rounded-2xl p-6 border border-border/60 dark:border-zinc-800 bg-card dark:bg-zinc-900 flex flex-col gap-4",
                    bundle.featured && "md:col-span-2 md:flex-row md:items-center md:gap-8",
                    bundle.shadow
                  )}
                >
                  {bundle.featured && (
                    <span className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Best value
                    </span>
                  )}

                  <div className={cn("flex flex-col gap-3", bundle.featured && "md:flex-1")}>
                    <div className="flex items-center gap-2.5">
                      <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center", bundle.accent)}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-foreground dark:text-white">{bundle.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-zinc-400">{bundle.desc}</p>
                    <ul className="space-y-1.5">
                      {bundle.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground dark:text-zinc-400">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={cn("flex flex-col gap-3", bundle.featured && "md:items-end md:shrink-0")}>
                    <div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-foreground dark:text-white tracking-tight">
                          ₹{bundle.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground line-through pb-1">
                          ₹{bundle.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-green-500">
                        Save ₹{savings.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      onClick={() => openBundle(bundle.name, bundle.price)}
                      className={cn(
                        "font-semibold bg-gradient-to-r text-white border-0 hover:opacity-90 transition-opacity active:scale-[0.98]",
                        bundle.accent,
                        bundle.featured ? "w-full md:w-48" : "w-full"
                      )}
                    >
                      Get bundle
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── À LA CARTE: SKILLS ── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Skills */}
            <div>
              <div className="mb-6">
                <SectionLabel>Skills</SectionLabel>
                <h2 className="text-3xl font-black tracking-[-0.02em] text-foreground dark:text-white mb-2">
                  Add skills individually
                </h2>
                <p className="text-sm text-muted-foreground dark:text-zinc-400">
                  One-time purchase. Works on every plan. Three free skills always included.
                </p>
              </div>
              <div className="space-y-2">
                {SKILLS_ADDONS.map((skill) => (
                  <AddonPill key={skill.name} name={skill.name} price={skill.price} tag={skill.category} onBuy={() => openSkill(skill.id, skill.name, skill.price)} />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">All 9 premium skills</span>
                <Link href="/market" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Browse market <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Design Systems */}
            <div>
              <div className="mb-6">
                <SectionLabel>Design Systems</SectionLabel>
                <h2 className="text-3xl font-black tracking-[-0.02em] text-foreground dark:text-white mb-2">
                  Add design systems
                </h2>
                <p className="text-sm text-muted-foreground dark:text-zinc-400">
                  One-time purchase. Six free systems always available on all plans.
                </p>
              </div>
              <div className="space-y-2">
                {SYSTEM_ADDONS.map((sys) => (
                  <AddonPill key={sys.name} name={sys.name} price={sys.price} onBuy={() => openSystem(sys.id, sys.name, sys.price)} />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">12 premium systems</span>
                <Link href="/systems" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Browse systems <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTEXT WINDOW TOP-UPS ── */}
      <section className="px-6 py-16 bg-muted/20 dark:bg-zinc-950/30 border-y border-border/50 dark:border-zinc-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Context Windows</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-foreground dark:text-white mb-2">
              Need more context?
            </h2>
            <p className="text-muted-foreground dark:text-zinc-400 text-sm max-w-sm mx-auto">
              Stack additional context on top of your plan. Billed monthly. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {CONTEXT_ADDONS.map((ctx, i) => (
              <motion.div
                key={ctx.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border border-border/80 dark:border-zinc-800 bg-card dark:bg-zinc-900 p-5 flex flex-col gap-3"
              >
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{ctx.label}</span>
                  <div className="text-2xl font-black text-foreground dark:text-white mt-1">
                    ₹{ctx.price}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground flex-1">{ctx.desc}</p>
                <Button
                  variant="outline"
                  className="w-full text-xs h-8"
                  onClick={() => openBundle(ctx.label, ctx.price)}
                >
                  Add to plan
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE (compact) ── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Compare plans</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-foreground dark:text-white">
              What's included
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/60 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 dark:border-zinc-800 bg-muted/40 dark:bg-zinc-900">
                  <th className="text-left px-5 py-4 font-semibold text-foreground dark:text-white w-[40%]">Feature</th>
                  <th className="text-center px-4 py-4 font-semibold text-muted-foreground">Starter</th>
                  <th className="text-center px-4 py-4 font-semibold text-primary">Pro</th>
                  <th className="text-center px-4 py-4 font-semibold text-muted-foreground">Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 dark:divide-zinc-800">
                {[
                  { feature: "Projects", starter: "3", pro: "10", studio: "Unlimited" },
                  { feature: "Context window", starter: "32K", pro: "128K", studio: "256K" },
                  { feature: "Free skills", starter: "3", pro: "3", studio: "3" },
                  { feature: "Included premium skills", starter: "—", pro: "5", studio: "All 12" },
                  { feature: "Free design systems", starter: "6", pro: "6", studio: "6" },
                  { feature: "Included premium systems", starter: "—", pro: "All 18", studio: "All 18" },
                  { feature: "À la carte purchases", starter: "✓", pro: "✓", studio: "✓" },
                  { feature: "Context top-ups", starter: "Available", pro: "+3 free/mo", studio: "Unlimited" },
                  { feature: "Support", starter: "Community", pro: "Email", studio: "Dedicated" },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-muted/20 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-3.5 text-muted-foreground dark:text-zinc-400 font-medium">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center text-muted-foreground dark:text-zinc-500">{row.starter}</td>
                    <td className="px-4 py-3.5 text-center font-semibold text-foreground dark:text-white">{row.pro}</td>
                    <td className="px-4 py-3.5 text-center text-muted-foreground dark:text-zinc-400">{row.studio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-foreground dark:text-white">
              Common questions
            </h2>
          </div>
          <div>
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/8 p-12"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.025em] text-foreground dark:text-white mb-4 leading-tight">
            Ready to start building?
          </h2>
          <p className="text-muted-foreground dark:text-zinc-400 mb-8 leading-relaxed">
            Starter is free forever. Upgrade when you need more power.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/sign-in">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_rgba(226,42,42,0.3)] hover:shadow-[0_6px_28px_rgba(226,42,42,0.45)] transition-all font-semibold px-6">
                Start for free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/market">
              <Button variant="outline" className="px-6">
                Browse skills
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {checkoutItem && (
        <CheckoutDialog
          isOpen={!!checkoutItem}
          onClose={() => setCheckoutItem(null)}
          onSuccess={checkoutItem.onSuccess}
          itemName={checkoutItem.name}
          itemPrice={checkoutItem.price}
          itemType={checkoutItem.type}
        />
      )}
    </main>
  );
}
