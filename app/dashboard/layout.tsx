import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar"
import { getProjectsForUser } from "@/features/project/actions"
import { Particles } from "@/components/ui/particles"
import type React from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const projects = await getProjectsForUser().catch(() => [])

  const sidebarItems = projects.map((p) => ({
    id: p.id,
    name: p.name,
    starred: false,
    icon: "Code2",
  }))

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar initialPlaygroundData={sidebarItems} />
        <main className="flex-1 relative overflow-hidden">
          <Particles
            className="absolute inset-0 z-0 pointer-events-none"
            quantity={120}
            staticity={40}
            ease={50}
          />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
