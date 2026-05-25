import fs from "fs"
import path from "path"

interface Skill {
  id: string
  body: string
}

const skillsDir = path.join(process.cwd(), "skills")
const actualSkillsDir = path.join(process.cwd(), "actual-skills")
const cache = new Map<string, Skill>()

function loadSkillSync(id: string, baseDir: string): Skill | null {
  const cacheKey = `${baseDir}::${id}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)!

  const skillPath = path.join(baseDir, id, "SKILL.md")
  if (!fs.existsSync(skillPath)) return null

  const body = fs.readFileSync(skillPath, "utf8")
  if (body.includes("NOT_IMPLEMENTED")) return null

  const skill = { id, body }
  cache.set(cacheKey, skill)
  return skill
}

export function buildSkillsPrompt(activeSkills: string[]): string {
  const parts: string[] = []
  for (const id of activeSkills) {
    const skill = loadSkillSync(id, skillsDir)
    if (!skill) continue
    parts.push(`\n## Design Style: ${id}\n${skill.body}`)
  }
  return parts.join("\n")
}

export function buildActualSkillsPrompt(activeSkills: string[]): string {
  const parts: string[] = []
  for (const id of activeSkills) {
    const skill = loadSkillSync(id, actualSkillsDir)
    if (!skill) continue
    parts.push(`\n## Active Skill: ${id}\n${skill.body}`)
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

export function listActualSkills(): string[] {
  if (!fs.existsSync(actualSkillsDir)) return []
  return fs.readdirSync(actualSkillsDir).filter((d) => {
    const p = path.join(actualSkillsDir, d, "SKILL.md")
    return fs.existsSync(p)
  })
}
