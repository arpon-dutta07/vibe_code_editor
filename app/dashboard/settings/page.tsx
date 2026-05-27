"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { updateUserProfile } from "@/features/auth/actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  User, 
  Settings, 
  Cpu, 
  CreditCard, 
  Loader2, 
  Sliders, 
  Sparkles, 
  Database, 
  Terminal, 
  Check,
  Moon,
  Sun,
  Laptop
} from "lucide-react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { theme, setTheme } = useTheme()

  // Form states
  const [name, setName] = useState("")
  const [isPending, setIsPending] = useState(false)

  // Editor states
  const [fontSize, setFontSize] = useState("14px")
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const [activeAIModel, setActiveAIModel] = useState("gemini-2.5-flash")

  // Initialize display name when session is available
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    setIsPending(true)
    try {
      const res = await updateUserProfile(name.trim())
      if (res.success) {
        toast.success("Profile updated successfully")
        // Update next-auth session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: name.trim()
          }
        })
      } else {
        toast.error(res.error || "Failed to update profile")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setIsPending(false)
    }
  }

  const handleSavePreferences = () => {
    // Save to localStorage so components (like Monaco wrapper) can read it in real time
    if (typeof window !== "undefined") {
      localStorage.setItem("editor-font-size", fontSize)
      localStorage.setItem("editor-theme", editorTheme)
      localStorage.setItem("active-ai-model", activeAIModel)
      toast.success("IDE preferences saved successfully")
    }
  }

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFontSize = localStorage.getItem("editor-font-size")
      const savedEditorTheme = localStorage.getItem("editor-theme")
      const savedAIModel = localStorage.getItem("active-ai-model")
      
      if (savedFontSize) setFontSize(savedFontSize)
      if (savedEditorTheme) setEditorTheme(savedEditorTheme)
      if (savedAIModel) setActiveAIModel(savedAIModel)
    }
  }, [])

  const displayName = session?.user?.name || "User"
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="ml-[360px] p-12 min-h-screen text-foreground bg-transparent relative z-10 selection:bg-primary/30 selection:text-primary/90">
      
      {/* Title Header */}
      <div className="mb-10 max-w-[800px]">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2 font-sans flex items-center gap-3">
          <Settings className="w-9 h-9 text-primary animate-spin" style={{ animationDuration: "12s" }} />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm font-medium">
          Manage your user profile details, editor configuration, active AI generative systems, and premium billing.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-[1100px]">
        
        {/* Card 1: Profile Settings */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-border/40">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">Profile Settings</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Avatar block */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="w-14 h-14 rounded-full bg-[#3c965c] flex items-center justify-center text-2xl font-bold text-white border border-emerald-400/20 shadow-lg">
                {avatarLetter}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{displayName}</p>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5 uppercase tracking-wide">
                  {session?.user?.id ? `ID: ${session.user.id.slice(0, 15)}...` : "Logged In User"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Display Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className="bg-muted/50 border-border text-foreground placeholder-muted-foreground h-11 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="email"
                value={session?.user?.email || ""}
                disabled
                className="bg-muted/20 border-border/30 text-muted-foreground h-11 cursor-not-allowed select-all"
              />
              <p className="text-[10px] text-muted-foreground">
                Your email address is linked to your login provider and cannot be changed.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl shadow-md shadow-primary/20 font-semibold cursor-pointer transition-all border-0"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile Name"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Card 2: Editor Preferences */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-border/40">
            <Sliders className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">Editor Preferences</h2>
          </div>

          <div className="space-y-5">
            {/* System UI Theme */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                System UI Theme
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === "dark" ? "brand" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="h-10 text-xs font-semibold cursor-pointer border-border"
                >
                  <Moon className="w-3.5 h-3.5 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === "light" ? "brand" : "outline"}
                  onClick={() => setTheme("light")}
                  className="h-10 text-xs font-semibold cursor-pointer border-border"
                >
                  <Sun className="w-3.5 h-3.5 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === "system" ? "brand" : "outline"}
                  onClick={() => setTheme("system")}
                  className="h-10 text-xs font-semibold cursor-pointer border-border"
                >
                  <Laptop className="w-3.5 h-3.5 mr-2" />
                  System
                </Button>
              </div>
            </div>

            {/* Monaco Font Size */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Monaco Editor Font Size
              </Label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full h-11 bg-muted/50 border border-border text-foreground rounded-xl px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="12px">12px - Small</option>
                <option value="14px">14px - Default</option>
                <option value="16px">16px - Medium</option>
                <option value="18px">18px - Large</option>
              </select>
            </div>

            {/* Monaco Editor Theme */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Monaco Editor Theme
              </Label>
              <select
                value={editorTheme}
                onChange={(e) => setEditorTheme(e.target.value)}
                className="w-full h-11 bg-muted/50 border border-border text-foreground rounded-xl px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="vs-dark">VS Dark (Default)</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast Black</option>
              </select>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSavePreferences}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl shadow-md shadow-primary/20 font-semibold cursor-pointer transition-all border-0"
              >
                Save IDE Preferences
              </Button>
            </div>
          </div>
        </div>

        {/* Card 3: AI & Platform Systems */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-border/40">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">AI & Cloud Systems</h2>
          </div>

          <div className="space-y-5">
            {/* Generative AI Model */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Active Generative AI Model
              </Label>
              <select
                value={activeAIModel}
                onChange={(e) => setActiveAIModel(e.target.value)}
                className="w-full h-11 bg-muted/50 border border-border text-foreground rounded-xl px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Standard Rebuild)</option>
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Premium Access)</option>
                <option value="gemini-3-pro">Gemini 3 Pro (Inference Mode)</option>
              </select>
              <p className="text-[10px] text-primary font-mono mt-1 flex items-center gap-1.5 select-none font-bold">
                <Sparkles className="w-3 h-3 animate-pulse text-primary" />
                Special Skills System active for this model
              </p>
            </div>

            {/* Cloud Stack Metrics */}
            <div className="space-y-3 pt-2">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block">
                Systems Deployment Status
              </Label>
              
              <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-foreground">Prisma Database Provider</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  POSTGRESQL (NEON)
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-foreground">Fallback Local Runtime</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  WEBCONTAINERS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Plan & Billing */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-border/40">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">Plan & Billing</h2>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Current Tier</p>
                <p className="text-2xl font-black text-primary tracking-tight mt-1 flex items-center gap-2 select-all">
                  Pro Plan
                </p>
              </div>
              <span className="text-[10px] font-bold px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center gap-1 select-none">
                <Check className="w-3 h-3" />
                Active
              </span>
            </div>

            {/* Quota progress limit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Generative Tokens Quota</span>
                <span className="font-mono text-foreground">10,000 / 10,000 credits</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden border border-border/30">
                <div className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(226,42,42,0.4)]" style={{ width: "100%" }} />
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Your credits quota resets on the 1st of every month. Unlimited manual edits inside Monaco are always free.
              </p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => toast.success("Manage subscription dialogue loading...")}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground h-11 rounded-xl shadow-md shadow-primary/20 font-semibold cursor-pointer transition-all border-0"
              >
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
