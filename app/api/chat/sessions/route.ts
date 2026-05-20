import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")

  if (!projectId) {
    return new Response(JSON.stringify({ error: "projectId required" }), { status: 400 })
  }

  // Returning empty sessions for now as there is no Session model in schema.prisma
  return new Response(JSON.stringify({ sessions: [], sessionsByDate: {} }), {
    headers: { "Content-Type": "application/json" },
  })
}
