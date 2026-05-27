"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUserProfile } from "../actions"
import { Loader2 } from "lucide-react"

interface EditProfileDialogProps {
  currentName: string
  userId: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function EditProfileDialog({
  currentName,
  trigger,
  onSuccess,
}: EditProfileDialogProps) {
  const [name, setName] = useState(currentName || "")
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    setIsPending(true)
    try {
      const res = await updateUserProfile(name.trim())
      if (res.success) {
        toast.success("Profile updated successfully")
        setIsOpen(false)
        router.refresh()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(res.error || "Failed to update profile")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-400 text-sm font-medium">
              Display Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={isPending}
              className="bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus-visible:ring-rose-500 focus-visible:ring-offset-zinc-950"
            />
          </div>
          <DialogFooter className="flex gap-2 justify-end pt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                className="text-zinc-400 hover:text-white hover:bg-zinc-900 border-0"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 font-medium"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
