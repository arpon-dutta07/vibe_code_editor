import { streamText, stepCountIs } from "ai"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { getModel } from "@/lib/ai/provider"
import { buildProjectTools } from "@/lib/ai/tools"
import { buildSkillsPrompt } from "@/lib/skills/loader"

const BASE_SYSTEM_PROMPT = `You are an expert AI app generator. You help users build web applications.

When the user asks you to build or modify something:
1. Call list_files to understand the current project state.
2. Call read_file to read relevant existing files before editing.
3. Call write_file to create or update files.
4. Output a brief explanation of what you did after the tool calls complete.

For new projects, default to a single index.html file (HTML + inline CSS + inline JS), unless the user asks for multiple files.
Keep code clean, well-structured, and production-quality.
Never dump raw file contents into the chat message — use tool calls instead.`

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const body = await req.json()
  const { messages = [], projectId } = body as {
    messages?: Array<{ role: string; content: string; parts?: unknown[] }>
    projectId: string
  }

  if (!projectId) {
    return new Response(JSON.stringify({ error: "projectId required" }), { status: 400 })
  }

  const project = await db.project.findUnique({
    where: { id: projectId, userId: session.user.id },
    include: {
      files: { select: { path: true, content: true }, orderBy: { path: "asc" } },
    },
  })

  if (!project) {
    return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 })
  }

  const skillsPrompt = buildSkillsPrompt(project.activeSkills)

  const fileTree =
    project.files.length > 0
      ? project.files.map((f) => `  ${f.path} (${f.content.split("\n").length} lines)`).join("\n")
      : "  (no files yet)"

  const fileContents =
    project.files.length > 0
      ? project.files
          .slice(0, 5)
          .map((f) => `\n### ${f.path}\n\`\`\`\n${f.content.slice(0, 2000)}\n\`\`\``)
          .join("")
      : ""

  const systemPrompt = `${BASE_SYSTEM_PROMPT}${skillsPrompt}

## Current project: ${project.name}

### File tree
${fileTree}
${fileContents}`

  const tools = buildProjectTools(projectId, session.user.id)

  const result = streamText({
    model: getModel(),
    system: systemPrompt,
    messages: messages as NonNullable<Parameters<typeof streamText>[0]["messages"]>,
    tools,
    stopWhen: stepCountIs(15),
    onFinish: async ({ text, toolCalls, toolResults }) => {
      const parts: unknown[] = []
      if (text) parts.push({ type: "text", text })
      for (const tc of toolCalls ?? []) {
        if (!tc) continue
        parts.push({ type: "tool-call", toolName: tc.toolName, input: tc.input })
      }
      for (const tr of toolResults ?? []) {
        if (!tr) continue
        parts.push({ type: "tool-result", toolName: tr.toolName, output: tr.output })
      }

      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")
      if (lastUserMsg) {
        await db.chatMessage.createMany({
          data: [
            {
              projectId,
              role: "user",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              parts: (lastUserMsg.parts ?? [{ type: "text", text: lastUserMsg.content }]) as any,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { projectId, role: "assistant", parts: parts as any },
          ],
        })
      }

      if (toolResults && toolResults.length > 0) {
        const writtenFiles = (toolCalls ?? [])
          .filter((tc) => tc?.toolName === "write_file")
          .map((tc) => (tc?.input as { path?: string })?.path ?? "")
          .filter(Boolean)

        if (writtenFiles.length > 0) {
          await db.projectCommit.create({
            data: {
              projectId,
              message: text.slice(0, 120) || `Updated ${writtenFiles.join(", ")}`,
              summary: text.slice(0, 300) || "AI applied file changes",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              diff: {
                files: writtenFiles,
                toolCalls: toolCalls?.map((tc) => ({ name: tc?.toolName })),
              } as any,
            },
          })
        }
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
