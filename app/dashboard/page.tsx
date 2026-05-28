import { getProjectsForUser } from "@/features/project/actions"
import { ProjectSearchGrid } from "@/features/dashboard/components/project-search-grid"

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-bold text-foreground mt-2">{value}</p>
  </div>
)

export default async function DashboardPage() {
  const projects = await getProjectsForUser().catch(() => [])

  return (
    <div className="lg:ml-[360px] p-6 md:p-12 pt-20 lg:pt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Deployments" value={0} />
        <StatCard label="Collaborators" value={1} />
      </div>

      <ProjectSearchGrid initialProjects={projects} />
    </div>
  )
}
