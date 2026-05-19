import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar"
import { getProjectsForUser } from "@/features/project/actions"
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
      <div className="flex min-h-screen w-full bg-[#0a0a0a]">
        <DashboardSidebar initialPlaygroundData={sidebarItems} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  )
}
