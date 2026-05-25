import { getSkillMarkdown } from "@/features/project/actions/skill-actions";
import { MARKET_ITEMS } from "@/features/market/data/market-items";
import { SkillDetailView } from "@/features/market/components/skill-detail-view";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface SkillDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { id } = await params;

  const skillMeta = MARKET_ITEMS.find((item) => item.id === id);
  if (!skillMeta) notFound();

  const result = await getSkillMarkdown(id);
  if (!result.success || !result.content) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  let isPurchased = false;
  if (isLoggedIn && !skillMeta.isFree) {
    const user = await db.user.findUnique({
      where: { id: session!.user!.id as string },
      select: { purchasedSkills: true },
    });
    isPurchased = user?.purchasedSkills.includes(id) ?? false;
  }

  const { icon, ...skillWithoutIcon } = skillMeta;

  const fullSkill = {
    ...skillWithoutIcon,
    content: result.content,
    isLoggedIn,
    isPurchased: skillMeta.isFree ? true : isPurchased,
  };

  return <SkillDetailView skill={fullSkill} />;
}
