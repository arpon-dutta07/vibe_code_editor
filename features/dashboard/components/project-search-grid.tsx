"use client"

import { useState } from "react"
import { Search, Folder, FileText, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { AddProjectButton } from "./add-project-btn"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  name: string
  updatedAt: Date
  files: { path: string }[]
}

interface ProjectSearchGridProps {
  initialProjects: any[]
}

export function ProjectSearchGrid({ initialProjects }: ProjectSearchGridProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = initialProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
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
            className="bg-card border-border rounded-lg pl-12 h-12 text-base focus-visible:ring-[#FF2D6B]/20 focus-visible:border-[#FF2D6B]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <AddProjectButton variant="grid" />

        {filteredProjects.map((project) => {
          const isMatched = searchQuery.length > 0 && 
            project.name.toLowerCase().includes(searchQuery.toLowerCase())

          return (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className={cn(
                "bg-card rounded-lg p-6 flex flex-col justify-between border transition-all duration-300",
                isMatched 
                  ? "border-[#FF2D6B] shadow-[0_0_20px_rgba(255,45,107,0.15)] ring-1 ring-[#FF2D6B]/50" 
                  : "border-border"
              )}
            >
              <div>
                <div className="flex justify-between items-start">
                  <Folder className={cn(
                    "w-8 h-8 transition-colors",
                    isMatched ? "text-[#FF2D6B]" : "text-pink-500 dark:text-[#FF2D6B]"
                  )} />
                  <span className="px-3 py-1 text-sm font-semibold text-foreground bg-foreground/10 rounded-full">
                    HTML
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mt-6">{project.name}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{project.files.length} files</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>
            </Link>
          )
        })}

        {filteredProjects.length === 0 && searchQuery.length > 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center bg-card rounded-lg border border-dashed border-border">
            <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold">No matches found</h3>
            <p className="text-muted-foreground">Try searching for a different project name.</p>
          </div>
        )}
      </div>
    </>
  )
}
