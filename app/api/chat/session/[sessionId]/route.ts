import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;
    const projectId = req.nextUrl.searchParams.get("projectId") || undefined;

    // Handle legacy sessionIds (format: legacy-YYYY-MM-DD-HH)
    let sessionMessages = [];
    
    if (sessionId.startsWith("legacy-")) {
      // Extract date and hour from legacy sessionId
      const parts = sessionId.replace("legacy-", "").split("-");
      if (parts.length >= 4) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // 0-indexed
        const day = parseInt(parts[2]);
        const hour = parseInt(parts[3]);
        
        const startOfHour = new Date(year, month, day, hour, 0, 0);
        const endOfHour = new Date(year, month, day, hour + 1, 0, 0);
        
        sessionMessages = await db.chatMessage.findMany({
          where: {
            userId: session.user.id,
            playgroundId: projectId ?? undefined,
            sessionId: null, // Old messages without sessionId
            createdAt: {
              gte: startOfHour,
              lt: endOfHour,
            },
          },
          orderBy: { createdAt: "asc" },
        });
      }
    } else {
      // New sessionId format
      sessionMessages = await db.chatMessage.findMany({
        where: {
          userId: session.user.id,
          sessionId: sessionId,
          playgroundId: projectId ?? undefined,
        },
        orderBy: { createdAt: "asc" },
      });
    }

    return NextResponse.json({
      messages: sessionMessages.map((m) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
        id: m.id,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching chat session:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to fetch chat session",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
