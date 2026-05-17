import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from "ai"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { getModel } from "@/lib/ai/provider"
import { buildProjectTools } from "@/lib/ai/tools"
import { buildSkillsPrompt } from "@/lib/skills/loader"

const BASE_INSTRUCTIONS = `
## Your role

You are an expert landing page generator. Build visually stunning, production-quality HTML pages.

## Tool workflow

When the user asks you to build or modify anything:
1. Call list_files to check existing project files.
2. Call read_file to read relevant files before editing (skip if project is empty).
3. Call write_file to create or update files.
4. After all writes, output a brief explanation of what you built.

## Output format

- Default: a single \`index.html\` with inline \`<style>\` and \`<script>\` blocks.
- If CSS or JS exceeds ~200 lines, split into \`index.html\` + \`style.css\` + \`script.js\`.
- No build tools. No npm. Pure HTML/CSS/JS (ES2020+). No jQuery.
- All CSS variables defined at \`:root\` level.
- No placeholder "Lorem ipsum" — write realistic, believable demo content.
- Never output raw file contents in chat — always use write_file.`

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const body = await req.json()
  const { messages = [], projectId } = body as {
    messages?: UIMessage[]
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

  const designSkill = project.activeSkills[0] ?? "techsleek"
  const skillBlock = buildSkillsPrompt([designSkill])

  const pageTypeLabel: Record<string, string> = {
    landing: "landing page",
    ecom: "e-commerce product/store page",
    portfolio: "personal portfolio page",
  }
  const pageContext = pageTypeLabel[project.pageType] ?? project.pageType

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

  // Skill is the outer design-system wrapper; base instructions + project context come after
  const systemPrompt = `${skillBlock}
${BASE_INSTRUCTIONS}

## Project context

- **Name:** ${project.name}
- **Page type:** ${pageContext}
- **Design style:** ${designSkill}

Always build a **${pageContext}**. Apply the design style above strictly.

### Current files
${fileTree}
${fileContents}`

  const tools = buildProjectTools(projectId, session.user.id)
  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: getModel(),
    system: systemPrompt,
    messages: modelMessages,
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
              parts: lastUserMsg.parts as any,
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
