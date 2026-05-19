"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Code2,
  Compass,
  FolderPlus,
  History,
  Home,
  LayoutDashboard,
  Lightbulb,
  type LucideIcon,
  Plus,
  Settings,
  Star,
  Terminal,
  Zap,
  Database,
  FlameIcon,
  PlusCircle,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/toggle-theme"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { AddProjectButton } from "@/features/dashboard/components/add-project-btn"

// Define the interface for a single playground item, icon is now a string
interface PlaygroundData {
  id: string
  name: string
  icon: string // Changed to string
  starred: boolean
}

// Map icon names (strings) to their corresponding LucideIcon components
const lucideIconMap: Record<string, LucideIcon> = {
  Zap: Zap,
  Lightbulb: Lightbulb,
  Database: Database,
  Compass: Compass,
  FlameIcon: FlameIcon,
  Terminal: Terminal,
  Code2: Code2, // Include the default icon
  // Add any other icons you might use dynamically
}

const NavItem = ({
  href,
  children,
  isActive,
}: {
  href: string
  children: React.ReactNode
  isActive: boolean
}) => (
  <Link href={href}>
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
        isActive
          ? "bg-[#1e1e1e] text-white font-bold"
          : "text-[#6b7280] hover:bg-[#1a1a1a] hover:text-white"
      )}
    >
      {children}
    </div>
  </Link>
)

export function DashboardSidebar({ initialPlaygroundData }: { initialPlaygroundData: PlaygroundData[] }) {
  const pathname = usePathname()
  const [starredPlaygrounds, setStarredPlaygrounds] = useState(initialPlaygroundData.filter((p) => p.starred))
  const [recentPlaygrounds, setRecentPlaygrounds] = useState(initialPlaygroundData)

  return (
    <div className="w-[360px] h-screen bg-[#0d0d0d] text-white flex flex-col fixed left-0 top-0 border-r border-[#1f1f1f]">
      <div className="px-6 pt-6 pb-8">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="VibeCode Logo" width={30} height={30} />
            <span className="text-xl font-bold">VibeCode</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-8 px-6">
        <AddProjectButton />

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-[#6b7280] tracking-wider">
            MENU
          </p>
          <NavItem href="/dashboard" isActive={pathname === "/dashboard"}>
            <LayoutDashboard
              className={cn("w-5 h-5", pathname === "/dashboard" && "text-[#FF2D6B]")}
            />
            Dashboard
          </NavItem>
          <NavItem href="/" isActive={pathname === "/"}>
            <Home className={cn("w-5 h-5", pathname === "/" && "text-[#FF2D6B]")} />
            Home
          </NavItem>
          <NavItem href="/dashboard/starred" isActive={pathname === "/dashboard/starred"}>
            <Star className={cn("w-5 h-5", pathname === "/dashboard/starred" && "text-[#FF2D6B]")} />
            Starred
          </NavItem>
          <NavItem href="/dashboard/recent" isActive={pathname === "/dashboard/recent"}>
            <History className={cn("w-5 h-5", pathname === "/dashboard/recent" && "text-[#FF2D6B]")} />
            Recent
          </NavItem>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-[#6b7280] tracking-wider">
            RECENTS
          </p>
          {recentPlaygrounds.slice(0, 3).map((playground) => {
            const IconComponent = lucideIconMap[playground.icon] || Code2
            return (
              <Link href={`/project/${playground.id}`} key={playground.id}>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#6b7280] hover:bg-[#1a1a1a] hover:text-white transition-colors">
                  <IconComponent className="w-5 h-5" />
                  <span className="truncate">{playground.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4">
        <div className="space-y-2">
          <NavItem href="/settings" isActive={pathname === "/settings"}>
            <Settings className={cn("w-5 h-5", pathname === "/settings" && "text-[#FF2D6B]")} />
            Settings
          </NavItem>
        </div>
        <div className="border-t border-[#1f1f1f] pt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FF2D6B] flex items-center justify-center text-sm font-bold">
              U
            </div>
            <div>
              <p className="font-semibold text-white">User</p>
              <p className="text-xs text-[#6b7280]">Pro Plan</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
