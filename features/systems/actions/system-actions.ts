"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { SYSTEM_ITEMS } from "@/features/systems/data/system-items";

export async function getUserPurchasedSystems(): Promise<string[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { purchasedSystems: true },
  });
  return user?.purchasedSystems ?? [];
}

export async function purchaseSystem(systemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not logged in" };

  const system = SYSTEM_ITEMS.find((s) => s.id === systemId);
  if (!system) return { success: false, error: "System not found" };
  if (system.isFree) return { success: false, error: "System is free" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { purchasedSystems: true },
  });

  if (user?.purchasedSystems.includes(systemId)) {
    return { success: true, alreadyOwned: true };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { purchasedSystems: { push: systemId } },
  });

  revalidatePath(`/systems/${systemId}`);
  revalidatePath("/systems");
  return { success: true, alreadyOwned: false };
}
