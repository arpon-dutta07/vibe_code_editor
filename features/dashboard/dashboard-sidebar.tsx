"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
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
import { useSidebar } from "@/components/ui/sidebar"

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
  onClick,
}: {
  href: string
  children: React.ReactNode
  isActive: boolean
  onClick?: () => void
}) => (
  <Link href={href} onClick={onClick}>
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
        isActive
          ? "bg-muted text-foreground font-bold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </div>
  </Link>
)

export function DashboardSidebar({ initialPlaygroundData }: { initialPlaygroundData: PlaygroundData[] }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { openMobile, setOpenMobile } = useSidebar()
  const starredPlaygrounds = initialPlaygroundData.filter((p) => p.starred)
  const recentPlaygrounds = initialPlaygroundData

  const handleItemClick = () => {
    setOpenMobile(false)
  }

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {openMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setOpenMobile(false)}
        />
      )}

      <div className={cn(
        "w-[300px] sm:w-[360px] h-screen bg-white/90 dark:bg-white/[0.05] backdrop-blur-xl text-foreground flex flex-col fixed left-0 top-0 border-r border-border/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transition-transform duration-300 ease-in-out",
        openMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="px-6 pt-6 pb-8">
          <Link href="/" onClick={handleItemClick}>
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="VibeCode Logo" width={30} height={30} />
              <span className="text-xl font-bold">VibeCode</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex flex-col gap-6 px-6 overflow-y-auto custom-scrollbar">
          <AddProjectButton variant="sidebar" />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              MENU
            </p>
            <NavItem href="/dashboard" isActive={pathname === "/dashboard"} onClick={handleItemClick}>
              <LayoutDashboard
                className={cn("w-5 h-5", pathname === "/dashboard" && "text-[#E22A2A]")}
              />
              Dashboard
            </NavItem>
            <NavItem href="/" isActive={pathname === "/"} onClick={handleItemClick}>
              <Home className={cn("w-5 h-5", pathname === "/" && "text-[#E22A2A]")} />
              Home
            </NavItem>
            <NavItem href="/dashboard/starred" isActive={pathname === "/dashboard/starred"} onClick={handleItemClick}>
              <Star className={cn("w-5 h-5", pathname === "/dashboard/starred" && "text-[#E22A2A]")} />
              Starred
            </NavItem>
            <NavItem href="/dashboard/recent" isActive={pathname === "/dashboard/recent"} onClick={handleItemClick}>
              <History className={cn("w-5 h-5", pathname === "/dashboard/recent" && "text-[#E22A2A]")} />
              Recent
            </NavItem>
          </div>

          {starredPlaygrounds.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                STARRED
              </p>
              {starredPlaygrounds.map((playground) => {
                const IconComponent = lucideIconMap[playground.icon] || Code2
                return (
                  <Link href={`/project/${playground.id}`} key={playground.id} onClick={handleItemClick}>
                    <div className="flex items-center justify-between px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <IconComponent className="w-5 h-5 flex-shrink-0 text-yellow-500" />
                        <span className="truncate">{playground.name}</span>
                      </div>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              RECENTS
            </p>
            {recentPlaygrounds.slice(0, 5).map((playground) => {
              const IconComponent = lucideIconMap[playground.icon] || Code2
              return (
                <Link href={`/project/${playground.id}`} key={playground.id} onClick={handleItemClick}>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
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
            <NavItem href="/dashboard/settings" isActive={pathname === "/dashboard/settings"} onClick={handleItemClick}>
              <Settings className={cn("w-5 h-5", pathname === "/dashboard/settings" && "text-[#E22A2A]")} />
              Settings
            </NavItem>
          </div>
          <div className="border-t border-border/50 pt-4 flex items-center justify-between gap-3">
            <Link
              href={session?.user?.id ? `/users/${session.user.id}` : "/users"}
              onClick={handleItemClick}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer group"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User avatar"}
                  width={36}
                  height={36}
                  className="rounded-full group-hover:ring-2 group-hover:ring-[#E22A2A] transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#E22A2A] flex items-center justify-center text-sm font-bold text-white group-hover:scale-105 transition-transform">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground group-hover:text-[#E22A2A] transition-colors">{session?.user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">Pro Plan</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
