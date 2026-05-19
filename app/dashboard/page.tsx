import { AddProjectButton } from "@/features/dashboard/components/add-project-btn"
import { getProjectsForUser } from "@/features/project/actions"
import Link from "next/link"
import { FileText, Clock, Search, Folder, Users, Layers, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Input } from "@/components/ui/input"

const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-card rounded-lg p-6 border border-border">
    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-bold text-foreground mt-2">{value}</p>
  </div>
)

export default async function DashboardPage() {
  const projects = await getProjectsForUser().catch(() => [])

  return (
    <div className="ml-[360px] p-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Projects</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and collaborate on your VibeCode projects.
          </p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="bg-card border-border rounded-lg pl-12 h-12 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-12">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Deployments" value={0} />
        <StatCard label="Collaborators" value={1} />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <AddProjectButton variant="grid" />

        {projects.length > 0 ? (
          <Link
            href={`/project/${projects[0].id}`}
            className="bg-card rounded-lg p-6 flex flex-col justify-between border border-border"
          >
            <div>
              <div className="flex justify-between items-start">
                <Folder className="w-8 h-8 text-pink-500 dark:text-[#FF2D6B]" />
                <span className="px-3 py-1 text-sm font-semibold text-foreground bg-foreground/10 rounded-full">
                  HTML
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-6">{projects[0].name}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{projects[0].files.length} files</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(projects[0].updatedAt), { addSuffix: true })}</span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="h-full bg-card rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground border-border">
            <p>No projects yet.</p>
          </div>
        )}
      </div>

      {projects.length > 1 && (
        <div className="mt-8 text-center">
          <Link href="/projects">
            <span className="text-muted-foreground hover:text-foreground transition-colors">
              View all playgrounds
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}
