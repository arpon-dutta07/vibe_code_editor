import { AddProjectButton } from "@/features/dashboard/components/add-project-btn"
import { getProjectsForUser } from "@/features/project/actions"
import Link from "next/link"
import { FileText, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default async function DashboardPage() {
  const projects = await getProjectsForUser().catch(() => [])

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <AddProjectButton />
      </div>

      <div className="mt-10 w-full">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-xl font-semibold text-muted-foreground">No projects yet</h2>
            <p className="text-muted-foreground mt-1">Create your first project to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="flex flex-col gap-2 p-4 rounded-lg border bg-card hover:border-primary/50 hover:bg-accent/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold truncate">{project.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{project.files.length} file{project.files.length !== 1 ? "s" : ""}</span>
                  {project.files.length > 0 && (
                    <span className="ml-1 font-mono">{project.files.map((f) => f.path).join(", ").slice(0, 40)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
