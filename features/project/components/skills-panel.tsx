"use client"

import { useState } from "react"
import {
  Globe, Palette, Search, Layout, Smile, Moon,
  Smartphone, ChevronsDown, Package, Shield, Languages, Zap,
  Lock, ShoppingCart, X, ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SkillModal } from "./skill-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { MARKET_ITEMS } from "@/features/market/data/market-items"

const ALL_SKILLS = [
  { id: "scrape-convert",       label: "Scrape & Convert",      tagline: "Paste a URL. Get a website.",       icon: Globe },
  { id: "logo-to-website",      label: "Logo to Website",        tagline: "Brand colors → branded site.",      icon: Palette },
  { id: "seo-skeleton",         label: "SEO Skeleton",           tagline: "Every page search-ready.",          icon: Search },
  { id: "wireframe-to-website", label: "Wireframe to Site",      tagline: "Describe layout → get HTML.",       icon: Layout },
  { id: "moodboard-matcher",    label: "Moodboard Matcher",      tagline: "Pick moods. Get the feeling.",      icon: Smile },
  { id: "dark-mode-twin",       label: "Dark Mode Twin",         tagline: "Every site, day and night.",        icon: Moon },
  { id: "responsive-wizard",    label: "Responsive Wizard",      tagline: "One site, every screen.",           icon: Smartphone },
  { id: "scroll-storyteller",   label: "Scroll Storyteller",     tagline: "Snap sections. Dot nav.",           icon: ChevronsDown },
  { id: "component-library",    label: "Component Library",      tagline: "Site + design system at once.",     icon: Package },
  { id: "accessibility-auditor",label: "Accessibility Auditor",  tagline: "WCAG AA. Built in.",                icon: Shield },
  { id: "multilingual-switcher",label: "Multilingual Switcher",  tagline: "LTR ↔ RTL, one toggle.",           icon: Languages },
  { id: "animation-layer",      label: "Animation Layer",        tagline: "Motion that means something.",      icon: Zap },
]

interface SkillsPanelProps {
  activeSkills: string[]
  purchasedSkills?: string[]
  onToggle?: (skillId: string, enabled: boolean) => void
  onSkillActivate?: (prompt: string) => void
}

function BuyModal({
  skillId,
  onClose,
}: {
  skillId: string
  onClose: () => void
}) {
  const router = useRouter()
  const skill = ALL_SKILLS.find((s) => s.id === skillId)
  const marketItem = MARKET_ITEMS.find((s) => s.id === skillId)
  if (!skill || !marketItem) return null
  const Icon = skill.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Icon size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">{skill.label}</p>
            <p className="text-xs text-zinc-500">{skill.tagline}</p>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-400">One-time purchase</span>
            <span className="text-lg font-bold text-amber-400">₹{marketItem.price}</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Unlock this skill permanently and activate it in any project instantly.
          </p>
        </div>

        <Button
          className="w-full gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold"
          onClick={() => {
            onClose()
            router.push(`/market/${skillId}`)
          }}
        >
          <ShoppingCart size={16} />
          Buy Now — ₹{marketItem.price}
          <ArrowUpRight size={14} className="ml-auto" />
        </Button>

        <p className="text-center text-xs text-zinc-600 mt-3">
          You'll be taken to the marketplace page
        </p>
      </div>
    </div>
  )
}

export function SkillsPanel({ activeSkills, purchasedSkills = [], onToggle, onSkillActivate }: SkillsPanelProps) {
  const [openSkill, setOpenSkill] = useState<string | null>(null)
  const [buySkillId, setBuySkillId] = useState<string | null>(null)

  const openSkillData = openSkill ? ALL_SKILLS.find(s => s.id === openSkill) : null

  function handleApply(skillId: string, prompt: string) {
    if (!activeSkills.includes(skillId)) {
      onToggle?.(skillId, true)
    }
    onSkillActivate?.(prompt)
  }

  // Split skills: free always available, paid only if purchased
  const freeSkillIds = MARKET_ITEMS.filter((s) => s.isFree).map((s) => s.id)
  const paidSkillIds = MARKET_ITEMS.filter((s) => !s.isFree).map((s) => s.id)

  const unlockedSkills = ALL_SKILLS.filter(
    (s) => freeSkillIds.includes(s.id) || purchasedSkills.includes(s.id)
  )
  const lockedSkills = ALL_SKILLS.filter(
    (s) => paidSkillIds.includes(s.id) && !purchasedSkills.includes(s.id)
  )

  return (
    <>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium px-1 mb-2">
          Skills
        </p>

        {/* Unlocked skills */}
        <div className="grid grid-cols-1 gap-2">
          {unlockedSkills.map((skill) => {
            const isActive = activeSkills.includes(skill.id)
            const Icon = skill.icon
            return (
              <button
                key={skill.id}
                onClick={() => setOpenSkill(skill.id)}
                className={cn(
                  "group w-full text-left rounded-xl border p-3 transition-all duration-200",
                  "hover:border-zinc-700 hover:bg-zinc-900/50",
                  isActive
                    ? "border-[#FF2D78]/25 bg-[#FF2D78]/5"
                    : "border-zinc-800/60 bg-zinc-900/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    isActive ? "bg-[#FF2D78]/15 text-[#FF2D78]" : "bg-zinc-800/80 text-zinc-400 group-hover:text-zinc-300"
                  )}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-200 leading-tight">{skill.label}</span>
                      {isActive && (
                        <span className="text-[9px] font-semibold text-[#FF2D78] bg-[#FF2D78]/10 px-1.5 py-0.5 rounded-full border border-[#FF2D78]/20 leading-none">
                          ON
                        </span>
                      )}
                      {freeSkillIds.includes(skill.id) && (
                        <span className="text-[9px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 leading-none">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{skill.tagline}</p>
                  </div>
                  <span className="text-zinc-700 group-hover:text-zinc-500 text-xs transition-colors flex-shrink-0 mt-0.5">
                    →
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Locked paid skills — shown as promo cards */}
        {lockedSkills.length > 0 && (
          <>
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-medium px-1 mt-4 mb-2 flex items-center gap-1.5">
              <Lock size={9} />
              Premium Skills
            </p>
            <div className="grid grid-cols-1 gap-2">
              {lockedSkills.map((skill) => {
                const Icon = skill.icon
                const marketItem = MARKET_ITEMS.find((m) => m.id === skill.id)
                return (
                  <button
                    key={skill.id}
                    onClick={() => setBuySkillId(skill.id)}
                    className="group w-full text-left rounded-xl border border-amber-500/15 bg-amber-500/3 p-3 transition-all duration-200 hover:border-amber-500/30 hover:bg-amber-500/8"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-zinc-800/80 text-zinc-600 group-hover:text-amber-500 transition-colors">
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-400 leading-tight group-hover:text-zinc-200 transition-colors">
                            {skill.label}
                          </span>
                          <Badge className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 leading-none h-auto">
                            ₹{marketItem?.price}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-0.5 leading-tight group-hover:text-zinc-500 transition-colors">
                          {skill.tagline}
                        </p>
                      </div>
                      <Lock size={11} className="text-zinc-700 group-hover:text-amber-500/70 flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Skill config modal (for unlocked skills) */}
      <SkillModal
        skillId={openSkill}
        skillLabel={openSkillData?.label ?? ""}
        isOpen={openSkill !== null}
        onClose={() => setOpenSkill(null)}
        onApply={handleApply}
      />

      {/* Buy modal (for locked skills) */}
      {buySkillId && (
        <BuyModal skillId={buySkillId} onClose={() => setBuySkillId(null)} />
      )}
    </>
  )
}
