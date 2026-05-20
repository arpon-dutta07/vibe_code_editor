import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const { sessionId } = await params
  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")

  if (!projectId) {
    return new Response(JSON.stringify({ error: "projectId required" }), { status: 400 })
  }

  // Returning empty messages for now as there is no Session model to link messages to
  return new Response(JSON.stringify({ messages: [] }), {
    headers: { "Content-Type": "application/json" },
  })
}
