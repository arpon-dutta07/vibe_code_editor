"use client"

import { useState } from "react"
import {
  Globe, Palette, Search, Layout, Smile, Moon,
  Smartphone, ChevronsDown, Package, Shield, Languages, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SkillModal } from "./skill-modal"

const ALL_SKILLS = [
  {
    id: "scrape-convert",
    label: "Scrape & Convert",
    tagline: "Paste a URL. Get a website.",
    icon: Globe,
  },
  {
    id: "logo-to-website",
    label: "Logo to Website",
    tagline: "Brand colors → branded site.",
    icon: Palette,
  },
  {
    id: "seo-skeleton",
    label: "SEO Skeleton",
    tagline: "Every page search-ready.",
    icon: Search,
  },
  {
    id: "wireframe-to-website",
    label: "Wireframe to Site",
    tagline: "Describe layout → get HTML.",
    icon: Layout,
  },
  {
    id: "moodboard-matcher",
    label: "Moodboard Matcher",
    tagline: "Pick moods. Get the feeling.",
    icon: Smile,
  },
  {
    id: "dark-mode-twin",
    label: "Dark Mode Twin",
    tagline: "Every site, day and night.",
    icon: Moon,
  },
  {
    id: "responsive-wizard",
    label: "Responsive Wizard",
    tagline: "One site, every screen.",
    icon: Smartphone,
  },
  {
    id: "scroll-storyteller",
    label: "Scroll Storyteller",
    tagline: "Snap sections. Dot nav.",
    icon: ChevronsDown,
  },
  {
    id: "component-library",
    label: "Component Library",
    tagline: "Site + design system at once.",
    icon: Package,
  },
  {
    id: "accessibility-auditor",
    label: "Accessibility Auditor",
    tagline: "WCAG AA. Built in.",
    icon: Shield,
  },
  {
    id: "multilingual-switcher",
    label: "Multilingual Switcher",
    tagline: "LTR ↔ RTL, one toggle.",
    icon: Languages,
  },
  {
    id: "animation-layer",
    label: "Animation Layer",
    tagline: "Motion that means something.",
    icon: Zap,
  },
]

interface SkillsPanelProps {
  activeSkills: string[]
  onToggle?: (skillId: string, enabled: boolean) => void
  onSkillActivate?: (prompt: string) => void
}

export function SkillsPanel({ activeSkills, onToggle, onSkillActivate }: SkillsPanelProps) {
  const [openSkill, setOpenSkill] = useState<string | null>(null)

  const openSkillData = openSkill ? ALL_SKILLS.find(s => s.id === openSkill) : null

  function handleApply(skillId: string, prompt: string) {
    if (!activeSkills.includes(skillId)) {
      onToggle?.(skillId, true)
    }
    onSkillActivate?.(prompt)
  }

  return (
    <>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium px-1 mb-2">
          Skills
        </p>
        <div className="grid grid-cols-1 gap-2">
          {ALL_SKILLS.map((skill) => {
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
      </div>

      <SkillModal
        skillId={openSkill}
        skillLabel={openSkillData?.label ?? ""}
        isOpen={openSkill !== null}
        onClose={() => setOpenSkill(null)}
        onApply={handleApply}
      />
    </>
  )
}
