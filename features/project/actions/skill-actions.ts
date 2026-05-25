"use server";

import fs from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MARKET_ITEMS } from "@/features/market/data/market-items";

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

export async function getUserPurchasedSkills(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { purchasedSkills: true },
  });
  return user?.purchasedSkills ?? [];
}

export async function purchaseSkill(skillId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not logged in" };

  const skill = MARKET_ITEMS.find((s) => s.id === skillId);
  if (!skill) return { success: false, error: "Skill not found" };
  if (skill.isFree) return { success: false, error: "Skill is free" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { purchasedSkills: true },
  });

  if (user?.purchasedSkills.includes(skillId)) {
    return { success: true, alreadyOwned: true };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { purchasedSkills: { push: skillId } },
  });

  revalidatePath(`/market/${skillId}`);
  revalidatePath("/market");
  return { success: true, alreadyOwned: false };
}
