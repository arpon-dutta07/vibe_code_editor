"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, ArrowRight, Check, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createProject, checkProjectNameExists } from "@/features/project/actions"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

const PAGE_TYPES = [
  {
    id: "landing-page",
    label: "Landing Page",
    desc: "Hero, features, CTA — a single focused page to convert visitors",
    icon: "🚀",
  },
  {
    id: "saas",
    label: "SaaS Product",
    desc: "Product claim, features, pricing, FAQ — software promo page",
    icon: "⚡",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    desc: "Product showcase, categories, featured items, and store front",
    icon: "🛍️",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    desc: "Personal or agency work showcase with skills and contact",
    icon: "🎨",
  },
  {
    id: "agency",
    label: "Agency / Service",
    desc: "Services, case studies, team, and contact form",
    icon: "💼",
  },
  {
    id: "blog",
    label: "Blog / Magazine",
    desc: "Featured article, article grid, sidebar, and categories",
    icon: "✍️",
  },
  {
    id: "personal-brand",
    label: "Personal Brand",
    desc: "Author, creator or speaker — hero, about, work, newsletter",
    icon: "🌟",
  },
  {
    id: "event",
    label: "Event / Conference",
    desc: "Speakers, schedule, venue, sponsors, and registration",
    icon: "🎤",
  },
  {
    id: "restaurant",
    label: "Restaurant / Venue",
    desc: "Menu tabs, gallery, reservations, and hours",
    icon: "🍽️",
  },
  {
    id: "nonprofit",
    label: "Non-Profit / Cause",
    desc: "Mission, impact stats, programs, stories, and donate CTA",
    icon: "❤️",
  },
  {
    id: "documentation",
    label: "Docs / Wiki",
    desc: "Sidebar nav, content area, code blocks, and callout boxes",
    icon: "📚",
  },
  {
    id: "coming-soon",
    label: "Coming Soon",
    desc: "Pre-launch page with countdown, email capture, and teaser",
    icon: "⏳",
  },
]

const SKILLS = [
  // ─── Original 6 styles ───────────────────────────────────────────────────
  {
    id: "techsleek",
    name: "Arctic Frost",
    tagline: "Icy · Clean · Professional",
    desc: "Icy white canvas, steel blue accents, ultra-clean geometry. Precise and professional.",
    palette: ["#F7F9FC", "#3B6B9E", "#6BA3D6"],
    accent: "#3B6B9E",
  },
  {
    id: "shopalike",
    name: "Shopalike",
    tagline: "Trust · Conversion · Premium consumer",
    desc: "Modern DTC brand. Clean whites, trust green, warm amber CTAs.",
    palette: ["#ffffff", "#1d6f42", "#f5a623"],
    accent: "#1d6f42",
  },
  {
    id: "futuristic",
    name: "Futuristic",
    tagline: "Neon · Dark · Sci-fi precision",
    desc: "Cyberpunk-inspired. Deep black, neon cyan glows, monospace type.",
    palette: ["#050810", "#00ffc8", "#7c3aed"],
    accent: "#00ffc8",
  },
  {
    id: "boldcraft",
    name: "BoldCraft",
    tagline: "Editorial · Oversized · Unapologetic",
    desc: "Magazine-level type hierarchy. Big serif headlines, editorial red.",
    palette: ["#f5f2ed", "#0d0d0d", "#d62828"],
    accent: "#d62828",
  },
  {
    id: "warmearth",
    name: "WarmEarth",
    tagline: "Human · Cozy · Wellness-brand",
    desc: "Cream, terracotta, sage. Rounded, approachable, organic feel.",
    palette: ["#fdf8f3", "#c47c4a", "#6b8f71"],
    accent: "#c47c4a",
  },
  {
    id: "glassdark",
    name: "GlassDark",
    tagline: "Frosted glass · Deep space · Premium dark",
    desc: "macOS-era glassmorphism. Dark gradients, indigo glow, depth layers.",
    palette: ["#08091a", "#6366f1", "#a78bfa"],
    accent: "#6366f1",
  },
  // ─── 12 new styles from implementation guide ─────────────────────────────
  {
    id: "minimalist-clean",
    name: "Minimalist Clean",
    tagline: "White · Inter · Generous space",
    desc: "Apple/Notion aesthetic. Max whitespace, flat accent, no decoration.",
    palette: ["#FFFFFF", "#111111", "#007AFF"],
    accent: "#007AFF",
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    tagline: "Frosted · Gradient bg · Depth",
    desc: "Dark gradient background, frosted glass panels, purple/lavender glow.",
    palette: ["#1a1a2e", "#7B61FF", "#E0AAFF"],
    accent: "#7B61FF",
  },
  {
    id: "dark-cyberpunk",
    name: "Dark Cyberpunk",
    tagline: "Neon · Grid · Terminal",
    desc: "Deep black, neon cyan/pink, CSS grid overlay, mono headings.",
    palette: ["#0a0e27", "#00d4ff", "#ff006e"],
    accent: "#00d4ff",
  },
  {
    id: "warm-organic",
    name: "Warm Organic",
    tagline: "Earthy · Serif · Rounded",
    desc: "Cream/terracotta, Lora serif headings, pill buttons, wavy dividers.",
    palette: ["#FEFAE0", "#D4845A", "#a8c0a0"],
    accent: "#D4845A",
  },
  {
    id: "corporate-professional",
    name: "Corporate",
    tagline: "Navy · Structured · Trust",
    desc: "Enterprise feel. Merriweather serif, navy header, structured grid.",
    palette: ["#1a3a52", "#FFFFFF", "#2E86AB"],
    accent: "#2E86AB",
  },
  {
    id: "vibrant-retro",
    name: "Retro Bold",
    tagline: "80s · Hard shadows · Chunky",
    desc: "Righteous font, hard offset shadows, bold color section alternation.",
    palette: ["#FF6B6B", "#FFE66D", "#4ECDC4"],
    accent: "#4ECDC4",
  },
  {
    id: "neumorphic",
    name: "Neumorphic",
    tagline: "Soft 3D · Extruded · Tactile",
    desc: "Uniform grey bg, soft push/pull shadows, no hard borders.",
    palette: ["#E0E5EC", "#ffffff", "#6C63FF"],
    accent: "#6C63FF",
  },
  {
    id: "brutalist-bold",
    name: "Brutalist",
    tagline: "Raw · Asymmetric · Anti-design",
    desc: "Space Grotesk 900, hard 5px borders, zero radius, jarring contrast.",
    palette: ["#FFFFFF", "#000000", "#FF4136"],
    accent: "#FF4136",
  },
  {
    id: "pastel-playful",
    name: "VoiceBox",
    tagline: "Editorial · High-contrast · Magazine",
    desc: "Bold, opinionated, magazine-style. Massive headlines and aggressive red accents.",
    palette: ["#FAFAFA", "#0A0A0A", "#EF4444"],
    accent: "#EF4444",
  },
  {
    id: "luxury-gold",
    name: "Luxury Gold",
    tagline: "Black · Gold · Italic serif",
    desc: "Near-black bg, Playfair Display italic, gold borders and accents.",
    palette: ["#1C1C1C", "#D4AF37", "#F5F0E8"],
    accent: "#D4AF37",
  },
  {
    id: "flat-modern",
    name: "Flat Modern",
    tagline: "Zero shadow · Color blocks · DM Sans",
    desc: "Strictly flat. Bold color block sections for separation, no gradients.",
    palette: ["#F0F4F8", "#3D5A80", "#EE6C4D"],
    accent: "#EE6C4D",
  },
  {
    id: "3d-layered",
    name: "Warm Earth",
    tagline: "Creamy · Terracotta · Organic",
    desc: "Creamy canvas, terracotta and olive accents, organic shapes. Warm and grounded.",
    palette: ["#FAF5EF", "#C4653A", "#6B7D3A"],
    accent: "#C4653A",
  },
]


export function AddProjectButton({ variant = 'card' }: { variant?: 'card' | 'sidebar' | 'grid' }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState("")
  const [pageType, setPageType] = useState("landing-page")
  const [skill, setSkill] = useState("techsleek")
  const [loading, setLoading] = useState(false)
  const [nameExists, setNameExists] = useState(false)
  const [checkingName, setCheckingName] = useState(false)
  const router = useRouter()

  function reset() {
    setStep(1)
    setName("")
    setPageType("landing")
    setSkill("techsleek")
    setLoading(false)
    setNameExists(false)
    setCheckingName(false)
  }

  async function handleNextStep() {
    if (step === 1) {
      if (!name.trim()) return
      setCheckingName(true)
      try {
        const exists = await checkProjectNameExists(name.trim())
        if (exists) {
          setNameExists(true)
          setCheckingName(false)
          return
        }
      } catch (error) {
        console.error(error)
      }
      setCheckingName(false)
      setNameExists(false)
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    try {
      const project = await createProject(name.trim(), pageType, skill)
      toast.success("Project created")
      setOpen(false)
      reset()
      router.push(`/project/${project.id}`)
    } catch (error: any) {
      toast.error(error.message || "Failed to create project")
      setLoading(false)
    }
  }

  const selectedSkill = SKILLS.find((s) => s.id === skill)!
  const selectedPage = PAGE_TYPES.find((p) => p.id === pageType)!

  const triggerButton = () => {
    switch (variant) {
      case 'sidebar':
        return (
          <Button
            onClick={() => { reset(); setOpen(true) }}
            variant="brand"
            className="w-full h-12 text-base bg-[#FF2D6B] rounded-[10px] flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            New Project
          </Button>
        );
      case 'grid':
        return (
            <div
                onClick={() => { reset(); setOpen(true) }}
                className="cursor-pointer h-full border-2 border-dashed dark:border-[#333] border-gray-300 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-pink-500 hover:text-pink-500 dark:hover:border-[#FF2D6B] dark:hover:text-[#FF2D6B] transition-colors"
            >
                <Plus className="w-12 h-12 mb-4 text-pink-500 dark:text-[#FF2D6B]" />
                <p className="text-xl font-bold text-pink-500 dark:text-[#FF2D6B]">New Project</p>
                <p className="mt-1 text-muted-foreground">Build a landing page with AI</p>
            </div>
        );
      case 'card':
      default:
        return (
          <button
            onClick={() => { reset(); setOpen(true) }}
            className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer
            transition-all duration-300 ease-in-out
            hover:bg-background hover:border-primary hover:scale-[1.02]
            shadow-[0_2px_10px_rgba(0,0,0,0.08)]
            dark:hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
          >
            <div className="flex flex-row justify-center items-start gap-4">
              <span className="flex justify-center items-center w-10 h-10 rounded-md border bg-white dark:group-hover:bg-[#fff8f8] dark:group-hover:border-[#E93F3F] dark:group-hover:text-[#E93F3F] transition-colors duration-300">
                <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
              </span>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary">New Project</h1>
                <p className="text-sm text-muted-foreground max-w-[220px]">Build a landing page with AI</p>
              </div>
            </div>
          </button>
        );
    }
  }

  return (
    <>
      {triggerButton()}

      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); reset() } }}>
        <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden bg-white dark:bg-[#161616] border border-black/[0.08] dark:border-white/[0.08] rounded-[16px] gap-0 shadow-[0_24px_64px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.4)] flex flex-col max-h-[85vh]">
          <DialogTitle className="sr-only">New Project</DialogTitle>
          {/* Step indicator */}
          <div className="px-6 pt-6 pb-4 border-b border-black/[0.05] dark:border-white/[0.05] shrink-0">
            <div className="flex items-center gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300",
                    step === s 
                      ? "bg-[#FF2D6B] text-white shadow-[0_0_15px_rgba(255,45,107,0.3)]" 
                      : step > s 
                        ? "bg-[#FF2D6B] text-white" 
                        : "bg-transparent border border-muted-foreground/30 text-muted-foreground/60"
                  )}>
                    {step > s ? <Check className="w-4 h-4" strokeWidth={3} /> : s}
                  </div>
                  {s < 3 && (
                    <div className={cn(
                      "w-12 h-[1px] transition-colors duration-300",
                      step > s ? "bg-[#FF2D6B]/50" : "bg-muted-foreground/20"
                    )} />
                  )}
                </div>
              ))}
              <span className="ml-2 text-xs font-medium text-muted-foreground capitalize">
                {step === 1 ? "project name" : step === 2 ? "page type" : "design style"}
              </span>
            </div>
          </div>

          {/* Step 1 — Name */}
          {step === 1 && (
            <div className="px-8 py-8 flex-1">
              <h2 className="text-[22px] font-bold text-slate-900 dark:text-white mb-2 leading-tight">What are you building?</h2>
              <p className="text-sm text-muted-foreground mb-6">Give your project a name to get started.</p>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pr-3 border-r border-black/[0.08] dark:border-white/[0.08]">
                  <span className="text-[#FF2D6B] font-semibold text-sm select-none">/</span>
                </div>
                <Input
                  placeholder="my-awesome-landing"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (nameExists) setNameExists(false)
                  }}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && handleNextStep()}
                  className={cn(
                    "pl-12 h-12 bg-[#f5f5f5] dark:bg-[#0d0d0d] border-black/[0.1] dark:border-white/[0.1] rounded-[10px] focus-visible:ring-1 focus-visible:ring-[#FF2D6B] focus-visible:border-[#FF2D6B] text-slate-900 dark:text-white placeholder:text-muted-foreground/50 transition-all",
                    nameExists && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                  )}
                  autoFocus
                />
              </div>

              {nameExists && (
                <p className="text-[13px] text-red-500 mt-2 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  A project with this name already exists
                </p>
              )}

              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleNextStep}
                  disabled={!name.trim() || checkingName}
                  className="h-11 px-6 bg-[#FF2D6B] hover:bg-[#e0175a] text-white font-semibold rounded-[10px] transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
                >
                  {checkingName ? "Checking..." : "Next"} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Page type */}
          {step === 2 && (
            <div className="flex flex-col flex-1 overflow-hidden px-8 pt-8">
              <h2 className="text-[22px] font-bold text-slate-900 dark:text-white mb-2 leading-tight shrink-0">What kind of page?</h2>
              <p className="text-sm text-muted-foreground mb-6 shrink-0">Shapes layout and content structure.</p>

              <div className="grid grid-cols-2 gap-2 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar pb-2">
                {PAGE_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setPageType(pt.id)}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 rounded-[12px] border text-left transition-all duration-200 group",
                      pageType === pt.id
                        ? "border-[#FF2D6B] bg-[#FF2D6B]/[0.06]"
                        : "border-black/[0.06] dark:border-white/[0.06] bg-[#f9f9f9] dark:bg-[#1a1a1a] hover:bg-white dark:hover:bg-[#222] hover:border-black/[0.1] dark:hover:border-white/[0.1]"
                    )}
                  >
                    <span className="text-xl select-none mt-0.5 shrink-0">{pt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-[13px] text-slate-900 dark:text-white truncate">{pt.label}</span>
                        {pageType === pt.id && <div className="w-4 h-4 rounded-full bg-[#FF2D6B] flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-white" strokeWidth={4} /></div>}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{pt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between py-6 shrink-0">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-transparent hover:underline px-0"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="h-11 px-6 bg-[#FF2D6B] hover:bg-[#e0175a] text-white font-semibold rounded-[10px] transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Design style */}
          {step === 3 && (
            <div className="flex flex-col flex-1 overflow-hidden px-8 pt-8">
              <h2 className="text-[22px] font-bold text-slate-900 dark:text-white mb-2 leading-tight shrink-0">Design style</h2>
              <p className="text-sm text-muted-foreground mb-6 shrink-0">Sets typography, colors, and visual language.</p>

              <div className="grid grid-cols-2 gap-3 flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar pb-2">
                {SKILLS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSkill(s.id)}
                    className={cn(
                      "flex flex-col gap-3 p-4 rounded-[12px] border text-left transition-all duration-200 group",
                      skill === s.id
                        ? "border-[#FF2D6B] bg-[#FF2D6B]/[0.06]"
                        : "border-black/[0.06] dark:border-white/[0.06] bg-[#f9f9f9] dark:bg-[#1a1a1a] hover:bg-white dark:hover:bg-[#222] hover:border-black/[0.1] dark:hover:border-white/[0.1]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {s.palette.map((c, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-black/5 dark:border-white/10 shadow-sm"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      {skill === s.id && <div className="w-5 h-5 rounded-full bg-[#FF2D6B] flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={4} /></div>}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">{s.name}</div>
                      <div className="text-[11px] font-medium mt-1 uppercase tracking-wider opacity-80" style={{ color: s.accent }}>{s.tagline}</div>
                    </div>
                    <p className="text-[12px] text-muted-foreground leading-snug line-clamp-2">{s.desc}</p>
                  </button>
                ))}
              </div>

              {/* Summary Bar */}
              <div className="mt-4 px-4 py-3 rounded-[8px] bg-black/[0.04] dark:bg-white/[0.04] flex items-center gap-2 text-[13px] text-muted-foreground overflow-hidden shrink-0">
                <Check className="w-4 h-4 text-[#FF2D6B] shrink-0" strokeWidth={3} />
                <span className="text-slate-900 dark:text-slate-100 font-medium truncate">{name}</span>
                <span className="opacity-30">·</span>
                <span className="truncate">{selectedPage.label}</span>
                <span className="opacity-30">·</span>
                <span className="shrink-0 font-bold" style={{ color: "#FF2D6B" }}>{selectedSkill.name}</span>
              </div>

              <div className="flex justify-between py-6 shrink-0">
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-transparent hover:underline px-0"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="h-11 px-8 bg-[#FF2D6B] hover:bg-[#e0175a] text-white font-semibold rounded-[10px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Creating…" : "Create Project"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
