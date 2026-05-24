import { getSkillMarkdown } from "@/features/project/actions/skill-actions";
import { MARKET_ITEMS } from "@/features/market/data/market-items";
import { SkillDetailView } from "@/features/market/components/skill-detail-view";
import { notFound } from "next/navigation";

interface SkillDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { id } = await params;
  
  // Find the skill metadata
  const skillMeta = MARKET_ITEMS.find((item) => item.id === id);
  
  if (!skillMeta) {
    notFound();
  }

  // Fetch the markdown content
  const result = await getSkillMarkdown(id);
  
  if (!result.success || !result.content) {
    // In a real app we might want to show a custom error, 
    // but for now we can fallback to notFound or an error UI
    notFound();
  }

  const { icon, ...skillWithoutIcon } = skillMeta;

  const fullSkill = {
    ...skillWithoutIcon,
    content: result.content
  };

  return <SkillDetailView skill={fullSkill} />;
}
