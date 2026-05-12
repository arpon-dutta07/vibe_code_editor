"use client"

import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const ALL_SKILLS = [
  { id: "frontend-design", label: "Frontend Design", implemented: true },
  { id: "architecture-design", label: "Architecture Design", implemented: false },
  { id: "database-selection", label: "Database Selection", implemented: false },
  { id: "logging", label: "Logging", implemented: false },
  { id: "testing-scripts", label: "Testing Scripts", implemented: false },
  { id: "frontend", label: "Frontend (Advanced)", implemented: false },
  { id: "backend", label: "Backend", implemented: false },
  { id: "docker", label: "Docker", implemented: false },
  { id: "deployment", label: "Deployment", implemented: false },
  { id: "ci-cd-pipelines", label: "CI/CD Pipelines", implemented: false },
]

interface SkillsPanelProps {
  activeSkills: string[]
  onToggle?: (skillId: string, enabled: boolean) => void
}

export function SkillsPanel({ activeSkills, onToggle }: SkillsPanelProps) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {ALL_SKILLS.map((skill) => {
        const isActive = activeSkills.includes(skill.id)
        return (
          <div key={skill.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm truncate">{skill.label}</span>
              {!skill.implemented && (
                <Badge variant="outline" className="text-[10px] py-0 shrink-0">Soon</Badge>
              )}
            </div>
            <Switch
              checked={isActive}
              disabled={!skill.implemented}
              onCheckedChange={(checked) => onToggle?.(skill.id, checked)}
            />
          </div>
        )
      })}
    </div>
  )
}
