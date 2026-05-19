import { getProjectsForUser } from "@/features/project/actions"
import { ProjectSearchGrid } from "@/features/dashboard/components/project-search-grid"

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-bold text-foreground mt-2">{value}</p>
  </div>
)

export default async function StarredProjectsPage() {
  const allProjects = await getProjectsForUser().catch(() => [])
  const starredProjects = allProjects.filter(p => p.isStarred)

  return (
    <div className="ml-[360px] p-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Starred Projects</h1>
          <p className="text-muted-foreground mt-1">
            Your most important projects, all in one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-12">
        <StatCard label="Starred Projects" value={starredProjects.length} />
      </div>

      <ProjectSearchGrid initialProjects={starredProjects} />
    </div>
  )
}
