"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProject } from "@/features/project/actions"
import { toast } from "sonner"

export function AddProjectButton() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    try {
      const project = await createProject(name.trim())
      toast.success("Project created")
      setOpen(false)
      setName("")
      router.push(`/project/${project.id}`)
    } catch {
      toast.error("Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer
        transition-all duration-300 ease-in-out
        hover:bg-background hover:border-[#E93F3F] hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant="outline"
            className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#E93F3F] group-hover:text-[#E93F3F] transition-colors duration-300"
            size="icon"
          >
            <Plus size={30} className="transition-transform duration-300 group-hover:rotate-90" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#e93f3f]">New Project</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Build an app with AI</p>
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="My awesome app"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || loading}>
              {loading ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
