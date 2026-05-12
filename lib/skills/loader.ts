import fs from "fs"
import path from "path"

interface Skill {
  id: string
  body: string
}

const skillsDir = path.join(process.cwd(), "skills")
const cache = new Map<string, Skill>()

function loadSkillSync(id: string): Skill | null {
  if (cache.has(id)) return cache.get(id)!

  const skillPath = path.join(skillsDir, id, "SKILL.md")
  if (!fs.existsSync(skillPath)) return null

  const body = fs.readFileSync(skillPath, "utf8")
  if (body.includes("NOT_IMPLEMENTED")) return null

  const skill = { id, body }
  cache.set(id, skill)
  return skill
}

export function buildSkillsPrompt(activeSkills: string[]): string {
  const parts: string[] = []

  for (const id of activeSkills) {
    const skill = loadSkillSync(id)
    if (!skill) continue
    parts.push(`\n## Skill: ${id}\n${skill.body}`)
  }

  return parts.join("\n")
}

export function listAvailableSkills(): string[] {
  if (!fs.existsSync(skillsDir)) return []
  return fs.readdirSync(skillsDir).filter((d) => {
    const p = path.join(skillsDir, d, "SKILL.md")
    return fs.existsSync(p)
  })
}
