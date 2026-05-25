"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Skill config forms ───────────────────────────────────────────────────────

function ScrapeConvertForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [url, setUrl] = useState("")
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-1.5 block">Website URL to recreate</label>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
        />
      </div>
      <ApplyButton
        disabled={!url.trim()}
        onClick={() => onSubmit(`Recreate this website: ${url.trim()}. Analyze its structure, sections, and content hierarchy. Rebuild it from scratch using the active design style — do not copy code, only the purpose and structure.`)}
      />
    </div>
  )
}

function LogoToWebsiteForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [primary, setPrimary] = useState("#3b82f6")
  const [secondary, setSecondary] = useState("#1e40af")
  const [logo, setLogo] = useState("")
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-zinc-400 mb-1.5 block">Primary color</label>
          <div className="flex gap-2">
            <input type="color" value={primary} onChange={e => setPrimary(e.target.value)}
              className="w-10 h-9 rounded border border-zinc-800 bg-zinc-900 cursor-pointer p-0.5" />
            <input type="text" value={primary} onChange={e => setPrimary(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 font-mono focus:outline-none focus:border-zinc-600" />
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1.5 block">Secondary color</label>
          <div className="flex gap-2">
            <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)}
              className="w-10 h-9 rounded border border-zinc-800 bg-zinc-900 cursor-pointer p-0.5" />
            <input type="text" value={secondary} onChange={e => setSecondary(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 font-mono focus:outline-none focus:border-zinc-600" />
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-400 mb-1.5 block">Logo filename <span className="text-zinc-600">(optional)</span></label>
        <input type="text" value={logo} onChange={e => setLogo(e.target.value)}
          placeholder="logo.png"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600" />
      </div>
      <ApplyButton onClick={() => {
        const logoNote = logo.trim() ? ` Include the logo as <img src="${logo.trim()}" alt="Logo"> in the header.` : ""
        onSubmit(`Build a fully branded website. Primary brand color: ${primary}, secondary: ${secondary}.${logoNote} Override the design style colors with these brand colors but keep its layout and typography rules.`)
      }} />
    </div>
  )
}

function SeoSkeletonForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [type, setType] = useState<"full" | "geo" | "onpage">("full")
  const [keyword, setKeyword] = useState("")
  const options = [
    { value: "full", label: "Full SEO", desc: "Meta, OG, Twitter Card, JSON-LD + SERP preview card" },
    { value: "geo", label: "AI / GEO", desc: "Structured data + AI crawler accessibility + passage citations" },
    { value: "onpage", label: "On-Page SEO", desc: "Semantic HTML, heading hierarchy, internal links" },
  ] as const
  const prompts = {
    full: `a complete SEO head (title, meta description, Open Graph, Twitter Card, JSON-LD WebSite schema) with a mocked Google SERP preview card and OG social share card at the bottom of the page`,
    geo: `AI/GEO-optimized content with FAQ schema, HowTo schema where applicable, passage-level headings for AI citation, and llms.txt meta`,
    onpage: `strict on-page SEO: one H1, logical H2/H3 hierarchy, descriptive alt text on all images, semantic HTML5 landmarks, and internal anchor links between sections`,
  }
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">SEO focus</label>
        <div className="flex flex-col gap-2">
          {options.map(o => (
            <button key={o.value} onClick={() => setType(o.value)}
              className={cn("text-left px-3 py-2.5 rounded-lg border transition-all",
                type === o.value ? "border-[#FF2D78]/40 bg-[#FF2D78]/5" : "border-zinc-800 hover:border-zinc-700")}>
              <div className="text-sm font-medium text-zinc-200">{o.label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{o.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-zinc-400 mb-1.5 block">Target keyword <span className="text-zinc-600">(optional)</span></label>
        <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
          placeholder="e.g. AI landing page builder"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600" />
      </div>
      <ApplyButton onClick={() => {
        const kw = keyword.trim() ? ` Target keyword: "${keyword.trim()}".` : ""
        onSubmit(`Build with ${prompts[type]}.${kw}`)
      }} />
    </div>
  )
}

function WireframeForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [desc, setDesc] = useState("")
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-1.5 block">Describe your layout</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
          placeholder={"e.g. hero full width, then 3 feature columns, testimonials with 2-column grid, right sidebar on the blog section, sticky footer with 3 link columns"}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none leading-relaxed" />
        <p className="text-[10px] text-zinc-600 mt-1">Supports: "3 columns", "hero", "sidebar", "split", "grid of N", "full width"</p>
      </div>
      <ApplyButton disabled={!desc.trim()}
        onClick={() => onSubmit(`Build this exact layout: ${desc.trim()}. Parse the layout description carefully, then add the active design style on top. Include a wireframe toggle button fixed to the bottom-right.`)} />
    </div>
  )
}

const MOODS = ["Bold", "Calm", "Playful", "Serious", "Futuristic", "Warm", "Cold", "Minimal", "Loud", "Elegant", "Premium", "Dreamy", "Sharp", "Cozy", "Edgy", "Soft"]

function MoodboardForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (m: string) => setSelected(p => p.includes(m) ? p.filter(x => x !== m) : p.length < 3 ? [...p, m] : p)
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">Select up to 3 moods</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button key={m} onClick={() => toggle(m)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                selected.includes(m) ? "bg-[#FF2D78]/15 border-[#FF2D78]/50 text-[#FF2D78]" : "border-zinc-800 text-zinc-400 hover:border-zinc-600")}>
              {m}
            </button>
          ))}
        </div>
        {selected.length === 3 && <p className="text-[10px] text-zinc-600 mt-2">Max 3 selected</p>}
      </div>
      <ApplyButton disabled={selected.length === 0}
        onClick={() => onSubmit(`Build a page that feels: ${selected.join(", ")}. Apply these moods to every design decision — typography weight, color temperature, spacing density, border-radius, and animation speed. Someone viewing this should immediately feel ${selected[0]}.`)} />
    </div>
  )
}

function DarkModeForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [mode, setMode] = useState<"light" | "dark">("light")
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">Default theme</label>
        <div className="grid grid-cols-2 gap-2">
          {(["light", "dark"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={cn("px-4 py-3 rounded-lg border text-sm font-medium capitalize transition-all",
                mode === m ? "border-[#FF2D78]/40 bg-[#FF2D78]/5 text-zinc-200" : "border-zinc-800 text-zinc-500 hover:border-zinc-700")}>
              {m === "light" ? "☀️ Light first" : "🌙 Dark first"}
            </button>
          ))}
        </div>
      </div>
      <div className="text-xs text-zinc-600 px-1">Both themes are always generated. This sets the initial load state.</div>
      <ApplyButton onClick={() => onSubmit(`Build with a complete dark mode twin. Default to ${mode} mode on load. Every color must use CSS custom properties. Include a 🌙/☀️ toggle button in the navbar. The dark mode should feel designed — not just inverted.`)} />
    </div>
  )
}

function ResponsiveForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [bp, setBp] = useState<string[]>(["Mobile 375px", "Tablet 768px", "Desktop 1280px"])
  const all = ["Mobile 375px", "Tablet 768px", "Desktop 1280px", "Wide 1440px"]
  const toggle = (b: string) => setBp(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b])
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">Target breakpoints</label>
        <div className="flex flex-col gap-2">
          {all.map(b => (
            <button key={b} onClick={() => toggle(b)}
              className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left",
                bp.includes(b) ? "border-[#FF2D78]/40 bg-[#FF2D78]/5 text-zinc-200" : "border-zinc-800 text-zinc-500 hover:border-zinc-700")}>
              <div className={cn("w-3 h-3 rounded border flex-shrink-0", bp.includes(b) ? "bg-[#FF2D78] border-[#FF2D78]" : "border-zinc-600")} />
              {b}
            </button>
          ))}
        </div>
      </div>
      <ApplyButton disabled={bp.length === 0}
        onClick={() => onSubmit(`Build a fully responsive site for: ${bp.join(", ")}. Mobile-first CSS. Add a device frame preview section at the bottom showing the layout at each breakpoint.`)} />
    </div>
  )
}

function ScrollStoryForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [sections, setSections] = useState(4)
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">Number of sections — <span className="text-zinc-300 font-medium">{sections}</span></label>
        <input type="range" min={3} max={8} value={sections} onChange={e => setSections(+e.target.value)}
          className="w-full accent-[#FF2D78]" />
        <div className="flex justify-between text-[10px] text-zinc-600 mt-1"><span>3</span><span>8</span></div>
      </div>
      <ApplyButton onClick={() => onSubmit(`Build as a scroll-snap narrative with ${sections} main sections. Each section fills the viewport with scroll-snap-align: start. Add staggered entrance animations and a dot navigation indicator fixed to the right side.`)} />
    </div>
  )
}

const COMPONENTS = ["Color Palette", "Typography Scale", "Buttons", "Cards", "Forms", "Badges & Tags", "Alerts"]

function ComponentLibForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [sel, setSel] = useState<string[]>(COMPONENTS)
  const toggle = (c: string) => setSel(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">Include in library</label>
        <div className="flex flex-wrap gap-2">
          {COMPONENTS.map(c => (
            <button key={c} onClick={() => toggle(c)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                sel.includes(c) ? "bg-[#FF2D78]/15 border-[#FF2D78]/50 text-[#FF2D78]" : "border-zinc-800 text-zinc-400 hover:border-zinc-600")}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <ApplyButton disabled={sel.length === 0}
        onClick={() => onSubmit(`Build the site AND create a separate components.html file — a standalone component library page with the same design style documenting: ${sel.join(", ")}.`)} />
    </div>
  )
}

function A11yForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [level, setLevel] = useState<"AA" | "AAA">("AA")
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">WCAG compliance level</label>
        <div className="grid grid-cols-2 gap-2">
          {(["AA", "AAA"] as const).map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={cn("px-4 py-3 rounded-lg border transition-all text-left",
                level === l ? "border-[#FF2D78]/40 bg-[#FF2D78]/5" : "border-zinc-800 hover:border-zinc-700")}>
              <div className="text-sm font-semibold text-zinc-200">WCAG 2.1 {l}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">{l === "AA" ? "Recommended standard" : "Strictest — enhanced contrast"}</div>
            </button>
          ))}
        </div>
      </div>
      <ApplyButton onClick={() => onSubmit(`Build with full WCAG 2.1 ${level} accessibility compliance. Include: skip-to-content link, ARIA landmarks, visible focus states (never outline:none), descriptive alt text, form labels, keyboard navigation. Add a collapsible accessibility report panel at the bottom.`)} />
    </div>
  )
}

const LANGUAGES = ["English", "French", "Spanish", "German", "Portuguese", "Chinese", "Japanese", "Korean"]
const RTL_LANGS = ["None", "Arabic", "Hebrew", "Farsi", "Urdu"]

function MultilingualForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [primary, setPrimary] = useState("English")
  const [rtl, setRtl] = useState("Arabic")
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-zinc-400 mb-1.5 block">Primary language</label>
          <select value={primary} onChange={e => setPrimary(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600">
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1.5 block">RTL language</label>
          <select value={rtl} onChange={e => setRtl(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600">
            {RTL_LANGS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <ApplyButton onClick={() => {
        const rtlNote = rtl !== "None" ? ` RTL language: ${rtl} — use logical CSS properties and [dir="rtl"] overrides.` : " LTR only."
        onSubmit(`Build with bidirectional layout support. Primary: ${primary}.${rtlNote} Add a 🌐 LTR/RTL toggle button in the navbar.`)
      }} />
    </div>
  )
}

function AnimationForm({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [intensity, setIntensity] = useState<"Subtle" | "Moderate" | "Expressive">("Moderate")
  const opts = [
    { value: "Subtle", label: "Subtle", desc: "Hover effects on buttons & cards only" },
    { value: "Moderate", label: "Moderate", desc: "Entrances + hover states, staggered cards" },
    { value: "Expressive", label: "Expressive", desc: "Full motion — float, pulse CTA, page load sequence" },
  ] as const
  const prompts = {
    Subtle: "subtle CSS micro-interactions: hover lift on buttons (translateY -2px), hover shadow on cards. No entrance animations.",
    Moderate: "CSS micro-interactions + entrance animations: hero and cards fade-slide-up on load with staggered delays. Buttons and cards have hover effects.",
    Expressive: "full CSS motion design: page load reveal sequence, staggered card entrances, floating decorative elements, pulse on primary CTA, parallax-like hero shift. All driven by pure CSS.",
  }
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">Animation intensity</label>
        <div className="flex flex-col gap-2">
          {opts.map(o => (
            <button key={o.value} onClick={() => setIntensity(o.value)}
              className={cn("text-left px-3 py-2.5 rounded-lg border transition-all",
                intensity === o.value ? "border-[#FF2D78]/40 bg-[#FF2D78]/5" : "border-zinc-800 hover:border-zinc-700")}>
              <div className="text-sm font-medium text-zinc-200">{o.label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{o.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <ApplyButton onClick={() => onSubmit(`Build with ${prompts[intensity]} Include an ⚡ toggle button (fixed bottom-right) that freezes/unfreezes all animations via .no-animations class.`)} />
    </div>
  )
}

// ─── Shared apply button ──────────────────────────────────────────────────────

function ApplyButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={cn(
        "w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
        disabled
          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          : "bg-[#FF2D78] text-white hover:bg-[#FF2D78]/90 active:scale-[0.98] shadow-[0_0_20px_rgba(255,45,120,0.25)]"
      )}>
      Apply Skill →
    </button>
  )
}

// ─── Modal orchestrator ───────────────────────────────────────────────────────

const FORM_MAP: Record<string, React.FC<{ onSubmit: (p: string) => void }>> = {
  "scrape-convert":        ScrapeConvertForm,
  "logo-to-website":       LogoToWebsiteForm,
  "seo-skeleton":          SeoSkeletonForm,
  "wireframe-to-website":  WireframeForm,
  "moodboard-matcher":     MoodboardForm,
  "dark-mode-twin":        DarkModeForm,
  "responsive-wizard":     ResponsiveForm,
  "scroll-storyteller":    ScrollStoryForm,
  "component-library":     ComponentLibForm,
  "accessibility-auditor": A11yForm,
  "multilingual-switcher": MultilingualForm,
  "animation-layer":       AnimationForm,
}

interface SkillModalProps {
  skillId: string | null
  skillLabel: string
  isOpen: boolean
  onClose: () => void
  onApply: (skillId: string, prompt: string) => void
}

export function SkillModal({ skillId, skillLabel, isOpen, onClose, onApply }: SkillModalProps) {
  if (!skillId) return null
  const Form = FORM_MAP[skillId]
  if (!Form) return null

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="bg-[#111111] border border-zinc-800 text-zinc-200 max-w-md w-full p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-zinc-800/60">
          <DialogTitle className="text-base font-semibold text-zinc-100">{skillLabel}</DialogTitle>
          <p className="text-xs text-zinc-500 mt-0.5">Configure skill options, then apply to jump to chat.</p>
        </DialogHeader>
        <div className="px-5 py-4">
          <Form onSubmit={(prompt) => {
            onApply(skillId, prompt)
            onClose()
          }} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
