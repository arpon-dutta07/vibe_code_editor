"use server";

import fs from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSkillMarkdown(skillId: string) {
  try {
    const skillPath = path.join(process.cwd(), "actual-skills", skillId, "SKILL.md");
    const content = await fs.readFile(skillPath, "utf-8");
    return { success: true, content };
  } catch (error) {
    console.error(`Error reading SKILL.md for ${skillId}:`, error);
    return { success: false, error: "Failed to load skill details." };
  }
}

export async function updateProjectSkills(projectId: string, activeSkills: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.project.update({
    where: { id: projectId, userId: session.user.id },
    data: { activeSkills },
  });

  revalidatePath(`/project/${projectId}`);
}
