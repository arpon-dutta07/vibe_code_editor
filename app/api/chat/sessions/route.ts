import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface ChatSession {
  id: string;
  date: string;
  preview: string;
  messageCount: number;
  firstMessageTime: Date;
  lastMessageTime: Date;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = req.nextUrl.searchParams.get("projectId") || undefined;

    // Fetch all messages for the user/project
    const messages = await db.chatMessage.findMany({
      where: {
        userId: session.user.id,
        playgroundId: projectId ?? undefined,
      },
      orderBy: { createdAt: "asc" },
    });

    // Group messages by sessionId (or use timestamp for old messages without sessionId)
    const sessionMap = new Map<string, typeof messages>();
    for (const message of messages) {
      // Use sessionId if available, otherwise group by date + hour for backward compatibility
      const key = message.sessionId || `legacy-${message.createdAt.toISOString().split('T')[0]}-${message.createdAt.getHours()}`;
      if (!sessionMap.has(key)) {
        sessionMap.set(key, []);
      }
      sessionMap.get(key)!.push(message);
    }

    // Convert to ChatSession objects
    const sessions: ChatSession[] = [];
    sessionMap.forEach((sessionMessages, sessionId) => {
      if (sessionMessages.length === 0) return;
      
      const sessionDate = sessionMessages[0].createdAt.toISOString().split("T")[0];
      const firstUserMessage = sessionMessages.find((m) => m.role === "user");
      const lastMessage = sessionMessages[sessionMessages.length - 1];
      
      sessions.push({
        id: sessionId,
        date: sessionDate,
        preview: firstUserMessage?.content.substring(0, 100) || "Chat session",
        messageCount: sessionMessages.length,
        firstMessageTime: sessionMessages[0].createdAt,
        lastMessageTime: lastMessage.createdAt,
      });
    });

    // Group sessions by date
    const sessionsByDate: Record<string, ChatSession[]> = {};
    sessions.forEach((session) => {
      if (!sessionsByDate[session.date]) {
        sessionsByDate[session.date] = [];
      }
      sessionsByDate[session.date].push(session);
    });

    // Sort sessions within each date (newest first)
    Object.keys(sessionsByDate).forEach((date) => {
      sessionsByDate[date].sort(
        (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
      );
    });

    return NextResponse.json({
      sessions: sessions.reverse(), // Reverse to show oldest first
      sessionsByDate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to fetch chat sessions",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
