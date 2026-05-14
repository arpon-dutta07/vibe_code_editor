"use server";

import fs from "fs/promises";
import path from "path";

export async function getSkillMarkdown(skillId: string) {
  try {
    const skillPath = path.join(process.cwd(), "skills", skillId, "SKILL.md");
    const content = await fs.readFile(skillPath, "utf-8");
    return { success: true, content };
  } catch (error) {
    console.error(`Error reading SKILL.md for ${skillId}:`, error);
    return { success: false, error: "Failed to load skill details." };
  }
}
