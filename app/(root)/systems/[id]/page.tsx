import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SYSTEM_ITEMS } from "@/features/systems/data/system-items";
import { SystemDetailView } from "@/features/systems/components/system-detail-view";

interface SystemDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SystemDetailPage({ params }: SystemDetailPageProps) {
  const { id } = await params;

  const systemMeta = SYSTEM_ITEMS.find((item) => item.id === id);
  if (!systemMeta) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  let isPurchased = false;
  if (isLoggedIn && !systemMeta.isFree) {
    const user = await db.user.findUnique({
      where: { id: session!.user!.id as string },
      select: { purchasedSkills: true }, // We can reuse purchasedSkills for systems for now
    });
    isPurchased = user?.purchasedSkills.includes(id) ?? false;
  }

  const fullSystem = {
    ...systemMeta,
    isLoggedIn,
    isPurchased: systemMeta.isFree ? true : isPurchased,
  };

  // Read SKILL.md content
  let skillMd = "";
  try {
    const filePath = path.join(process.cwd(), "skills", id, "SKILL.md");
    if (fs.existsSync(filePath)) {
      skillMd = fs.readFileSync(filePath, "utf-8");
    }
  } catch (error) {
    console.error(`Failed to read SKILL.md for ${id}:`, error);
  }

  return <SystemDetailView system={fullSystem} skillMd={skillMd} />;
}

