"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, ArrowRight, Check, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createProject } from "@/features/project/actions"
import { toast } from "sonner"

// ... (PAGE_TYPES and SKILLS constants remain the same)
const PAGE_TYPES = [
  {
    id: "landing",
    label: "Landing Page",
    desc: "Hero, features, CTA — a single focused page to convert visitors",
    icon: "▤",
  },
  {
    id: "ecom",
    label: "E-commerce",
    desc: "Product showcase, trust signals, and buy flow",
    icon: "◈",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    desc: "Personal or agency work showcase with contact",
    icon: "◉",
  },
]

const SKILLS = [
  {
    id: "techsleek",
    name: "TechSleek",
    tagline: "Clean · Minimal · Developer-trusted",
    desc: "Vercel/Linear/Stripe aesthetic. Sharp, confident, zero decoration.",
    palette: ["#fafafa", "#18181b", "#3b82f6"],
    accent: "#3b82f6",
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
]


export function AddProjectButton({ variant = 'card' }: { variant?: 'card' | 'sidebar' | 'grid' }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState("")
  const [pageType, setPageType] = useState("landing")
  const [skill, setSkill] = useState("techsleek")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function reset() {
    setStep(1)
    setName("")
    setPageType("landing")
    setSkill("techsleek")
    setLoading(false)
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
    } catch {
      toast.error("Failed to create project")
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
        <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden bg-slate-950 border border-slate-800 rounded-xl gap-0">
          <DialogTitle className="sr-only">New Project</DialogTitle>
          {/* Step indicator */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-colors",
                    step === s ? "bg-emerald-500 text-black" : step > s ? "bg-emerald-900 text-emerald-400" : "bg-slate-800 text-slate-600"
                  )}>
                    {step > s ? <Check className="w-3 h-3" /> : s}
                  </div>
                  {s < 3 && <div className={cn("w-10 h-px transition-colors", step > s ? "bg-emerald-800" : "bg-slate-800")} />}
                </div>
              ))}
              <span className="ml-2 text-[11px] font-mono text-slate-500">
                {step === 1 ? "name" : step === 2 ? "page type" : "design style"}
              </span>
            </div>
          </div>

          {/* Step 1 — Name */}
          {step === 1 && (
            <div className="px-6 py-6">
              <h2 className="text-base font-semibold text-slate-100 mb-1">What are you building?</h2>
              <p className="text-xs text-slate-500 font-mono mb-5">Give your project a name.</p>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:border-emerald-500 transition-colors">
                <span className="text-emerald-500 font-mono text-sm select-none shrink-0">$</span>
                <Input
                  placeholder="my-awesome-landing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(2)}
                  className="border-none bg-transparent focus-visible:ring-0 text-slate-100 font-mono placeholder:text-slate-600 p-0 h-auto text-sm"
                  autoFocus
                />
              </div>
              <div className="flex justify-end mt-5">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold gap-1 text-sm"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 — Page type */}
          {step === 2 && (
            <div className="px-6 py-6">
              <h2 className="text-base font-semibold text-slate-100 mb-1">What kind of page?</h2>
              <p className="text-xs text-slate-500 font-mono mb-5">Shapes layout and content structure.</p>
              <div className="flex flex-col gap-2">
                {PAGE_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setPageType(pt.id)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-lg border text-left transition-all",
                      pageType === pt.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700"
                    )}
                  >
                    <span className="text-xl select-none w-7 text-center shrink-0 opacity-70">{pt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100">{pt.label}</span>
                        {pageType === pt.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{pt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-5">
                <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-300 text-sm">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold gap-1 text-sm">
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Design style */}
          {step === 3 && (
            <div className="px-6 py-6">
              <h2 className="text-base font-semibold text-slate-100 mb-1">Design style</h2>
              <p className="text-xs text-slate-500 font-mono mb-4">Sets typography, colors, and visual language.</p>

              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-0.5">
                {SKILLS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSkill(s.id)}
                    className={cn(
                      "flex flex-col gap-2.5 p-3 rounded-lg border text-left transition-all",
                      skill === s.id
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {s.palette.map((c, i) => (
                          <div
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-white/10"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      {skill === s.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{s.name}</div>
                      <div className="text-[10px] font-mono mt-0.5" style={{ color: s.accent }}>{s.tagline}</div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-500 overflow-hidden">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span className="text-slate-300 truncate">{name}</span>
                <span className="text-slate-700 shrink-0">·</span>
                <span className="shrink-0">{selectedPage.label}</span>
                <span className="text-slate-700 shrink-0">·</span>
                <span className="shrink-0 font-semibold" style={{ color: selectedSkill.accent }}>{selectedSkill.name}</span>
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-300 text-sm">
                  Back
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-sm"
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
