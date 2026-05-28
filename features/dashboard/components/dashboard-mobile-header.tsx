"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { ThemeToggle } from "@/components/ui/toggle-theme"
import Image from "next/image"
import Link from "next/link"

export function DashboardMobileHeader() {
  const { toggleSidebar } = useSidebar()
  const { data: session } = useSession()

  const displayName = session?.user?.name || "User"
  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/85 dark:bg-[#0a0a0a]/85 backdrop-blur-md border-b border-border/50 flex lg:hidden items-center justify-between px-4 z-40 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground h-10 w-10 hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="VibeCode Logo" width={24} height={24} />
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">VibeCode</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href={session?.user?.id ? `/users/${session.user.id}` : "/users"}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User avatar"}
              width={28}
              height={28}
              className="rounded-full ring-1 ring-border/50"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#E22A2A] flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {avatarLetter}
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}
