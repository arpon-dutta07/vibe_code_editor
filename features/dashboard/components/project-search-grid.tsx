"use client"
import { useState, useTransition, useRef } from "react"
import { Search, Folder, FileText, Clock, Trash2, Loader2, Star, Edit2, Check, X, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { AddProjectButton } from "./add-project-btn"
import { cn } from "@/lib/utils"
import { deleteProject, toggleStarProject, renameProject } from "@/features/project/actions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

interface Project {
  id: string
  name: string
  isStarred: boolean
  updatedAt: Date
  files: { path: string }[]
  pageType?: string
}

interface ProjectSearchGridProps {
  initialProjects: any[]
}

export function ProjectSearchGrid({ initialProjects }: ProjectSearchGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  const filteredProjects = initialProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deleteProject(id)
        toast.success("Project deleted")
      } catch (error) {
        toast.error("Failed to delete project")
      }
    })
  }

  const handleToggleStar = async (id: string, currentStarred: boolean) => {
    startTransition(async () => {
      try {
        await toggleStarProject(id, !currentStarred)
        toast.success(!currentStarred ? "Project starred" : "Project unstarred")
      } catch (error) {
        toast.error("Failed to update project")
      }
    })
  }

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  const handleRename = async (id: string) => {
    if (!editName.trim() || editName === initialProjects.find(p => p.id === id)?.name) {
      setEditingId(null)
      return
    }

    startTransition(async () => {
      try {
        await renameProject(id, editName.trim())
        toast.success("Project renamed")
        setEditingId(null)
      } catch (error) {
        toast.error("Failed to rename project")
      }
    })
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground dark:text-white">Your Workspace</h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-2 text-lg">
            Create, manage, and scale your AI-powered projects with precision.
          </p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#E22A2A] transition-colors" />
          <Input
            placeholder="Search projects..."
            className="bg-card dark:bg-zinc-900/50 border-border dark:border-zinc-800 rounded-2xl pl-12 h-14 text-lg focus-visible:ring-[#E22A2A]/20 focus-visible:border-[#E22A2A] transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="h-full">
          <AddProjectButton variant="grid" />
        </div>

        {filteredProjects.map((project, index) => {
          const isMatched = searchQuery.length > 0 && 
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
          
          const isEditing = editingId === project.id

          return (
            <SpotlightCard
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative bg-card dark:bg-zinc-900/40 rounded-2xl p-6 flex flex-col justify-between border transition-all duration-300 backdrop-blur-sm",
                isMatched 
                  ? "border-[#E22A2A] shadow-[0_0_20px_rgba(226,42,42,0.15)] ring-1 ring-[#E22A2A]/50" 
                  : "border-border dark:border-zinc-800 hover:border-[#E22A2A]/40 hover:-translate-y-1.5"
              )}
              spotlightColor="rgba(226, 42, 42, 0.12)"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#E22A2A]/10 dark:bg-[#E22A2A]/10 group-hover:scale-110 transition-transform duration-300">
                      <Folder className={cn(
                        "w-7 h-7 transition-colors",
                        isMatched ? "text-[#E22A2A]" : "text-[#E22A2A]"
                      )} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 transition-all duration-300 rounded-lg",
                        project.isStarred 
                          ? "text-yellow-500 hover:text-yellow-600 bg-yellow-500/10" 
                          : "text-muted-foreground hover:text-yellow-500 opacity-0 group-hover:opacity-100"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        handleToggleStar(project.id, project.isStarred)
                      }}
                    >
                      <Star className={cn("h-4.5 w-4.5", project.isStarred && "fill-current")} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-1.5 relative z-20">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "rounded-lg border-border dark:border-zinc-800 px-2.5 py-1 text-xs font-semibold transition-colors",
                        project.pageType === "landing" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        project.pageType === "saas" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                        "bg-zinc-50 dark:bg-zinc-900/50"
                      )}
                    >
                      {project.pageType?.toUpperCase() || "WEB"}
                    </Badge>
                    
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-[#E22A2A] hover:bg-[#E22A2A]/10 rounded-lg"
                        onClick={(e) => {
                          e.preventDefault()
                          handleStartRename(project.id, project.name)
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="dark:bg-zinc-950 dark:border-zinc-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription className="dark:text-gray-400">
                              This will permanently delete "{project.name}" and all its files.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project.id)}
                              className="bg-destructive text-white hover:bg-destructive/90 rounded-xl"
                            >
                              {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Delete Project
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2 relative z-30 bg-card dark:bg-zinc-900 rounded-lg p-1 border border-[#E22A2A]/30 mb-2"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Input
                        ref={editInputRef}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-9 border-0 focus-visible:ring-0 px-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(project.id)
                          if (e.key === "Escape") setEditingId(null)
                        }}
                      />
                      <div className="flex items-center pr-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                          onClick={() => handleRename(project.id)}
                        >
                          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.h3 
                      layoutId={`title-${project.id}`}
                      className="text-2xl font-bold text-foreground dark:text-zinc-50 group-hover:text-[#E22A2A] transition-colors truncate"
                    >
                      {project.name}
                    </motion.h3>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="relative z-10 flex flex-col gap-3 mt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span>{project.files.length} files</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-border dark:border-zinc-800/50">
                  <Link 
                    href={`/project/${project.id}`}
                    className="text-xs font-semibold text-[#E22A2A] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 translate-y-2 group-hover:translate-y-0 hover:underline cursor-pointer relative z-20"
                  >
                    Open Editor
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Live
                    </div>
                    
                    <div className="flex -space-x-2">
                      {[
                        { initials: "VC", color: "from-indigo-500 to-purple-600" },
                        { initials: "AI", color: "from-rose-500 to-orange-500" },
                        { initials: "ED", color: "from-emerald-400 to-cyan-500" }
                      ].map((avatar, i) => (
                        <Avatar 
                          key={i} 
                          className={cn(
                            "w-7 h-7 border-2 border-card ring-0 transition-all duration-300 hover:-translate-y-1 hover:z-30 cursor-help shadow-sm",
                            "opacity-0 group-hover:opacity-100",
                            i === 0 ? "delay-[100ms]" : i === 1 ? "delay-[200ms]" : "delay-[300ms]"
                          )}
                        >
                          <AvatarImage src={`https://i.pravatar.cc/100?u=${project.id}-${i}`} />
                          <AvatarFallback className={cn("text-[8px] font-bold text-white bg-gradient-to-br shadow-inner", avatar.color)}>
                            {avatar.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          )
        })}

        {filteredProjects.length === 0 && searchQuery.length > 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-20 text-center bg-card dark:bg-zinc-900/20 rounded-3xl border border-dashed border-border dark:border-zinc-800">
            <div className="p-6 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6">
              <Search className="w-12 h-12 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">No matches found</h3>
            <p className="text-muted-foreground dark:text-gray-400 mt-2 max-w-xs">
              We couldn't find any projects matching "{searchQuery}". Try a different keyword.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
