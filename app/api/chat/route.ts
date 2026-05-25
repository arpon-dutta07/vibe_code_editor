import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from "ai"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { getModel } from "@/lib/ai/provider"
import { buildProjectTools } from "@/lib/ai/tools"
import { buildSkillsPrompt, buildActualSkillsPrompt } from "@/lib/skills/loader"
import { WEBSITE_TYPES } from "@/lib/website-types"

const BASE_INSTRUCTIONS = `
## Your role

You are an expert landing page generator. Build visually stunning, production-quality HTML pages.

## Tool workflow

When the user asks you to build or modify anything:
1. Call list_files to check existing project files.
2. Call read_file to read relevant files before editing (skip if project is empty).
3. Call write_file to create or update files.
4. After all writes, output a brief explanation of what you built.

## Interaction Rule (Navigation Guard)

- **IMPORTANT**: The generated website must NOT redirect the user or perform navigation actions (like form submissions or link follows) by default.
- **Visuals**: Interactive elements (buttons, links) should look FULLY ACTIVE and interactive (hover states, animations, etc.). Do NOT use the \`disabled\` attribute or \`pointer-events: none\`.
- **Logic**: Implement a "Navigation Guard" using a small, inline \`<script>\` that intercepts all click events.
    - If a user clicks a link or button that would cause a navigation/redirect, use \`event.preventDefault()\` and perhaps show a subtle, polished "Preview Mode" toast or log.
    - These interactions should ONLY be "unlocked" (allowed to function normally) if the user explicitly asks for the "extension of the website preview" or uses the word "extend" or "extension" in their prompt.
- **Implementation**: When the "extension" state is FALSE, inject a script that prevents navigation. When TRUE, either remove the script or set a flag (e.g., \`window.__PREVIEW_UNLOCKED__ = true\`) to allow normal behavior.

## Output format

- Default: a single \`index.html\` with inline \`<style>\` and \`<script>\` blocks.
- If CSS or JS exceeds ~200 lines, split into \`index.html\` + \`style.css\` + \`script.js\`.
- No build tools. No npm. Pure HTML/CSS/JS (ES2020+). No jQuery.
- All CSS variables defined at \`:root\` level.
- No placeholder "Lorem ipsum" — write realistic, believable demo content.
- **Deterministic Images**: Always use seeded picsum URLs for placeholder images in this exact format: \`https://picsum.photos/seed/[descriptive-keyword]/[width]/[height]\`. For the seed, use a simple, relevant keyword like 'hero', 'product1', 'avatar', 'background'. Never use unseeded random image URLs.
- **Absolute URLs**: Never use relative image paths. Always use absolute URLs for all assets.
- **CRITICAL CSP & CORS**: To ensure images load correctly in the preview iframe, you MUST add these two things:
    1.  Add the attribute \`crossorigin="anonymous"\` to EVERY \`<img>\` tag.
    2.  Add this exact CSP meta tag inside the \`<head>\`: \`<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;">\`
- Never output raw file contents in chat — always use write_file.
`

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
  const featureSkills = project.activeSkills.slice(1)
  const skillBlock = buildSkillsPrompt([designSkill])
  const featureSkillBlock = buildActualSkillsPrompt(featureSkills)

  const websiteType = WEBSITE_TYPES[project.pageType]
  const pageContext = websiteType?.label ?? project.pageType
  const typePromptLayer = websiteType?.promptLayer ?? ""

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

  const hasExtensionPrompt = messages.some((m) => {
    if (m.role !== "user") return false

    if (Array.isArray(m.parts)) {
      for (const part of m.parts) {
        if (part.type === "text" && typeof part.text === "string") {
          const low = part.text.toLowerCase()
          if (
            low.includes("extension of the website preview") ||
            low.includes("extend") ||
            low.includes("extension")
          ) {
            return true
          }
        }
      }
    }

    return false
  })

  const extensionState = hasExtensionPrompt
    ? "The user HAS requested an extension of the website preview. You may now UNLOCK all navigation and interactions. (Ensure no event.preventDefault() logic is blocking clicks)."
    : "The user HAS NOT requested an extension of the website preview yet. YOU MUST implement a Navigation Guard (JS interceptor) that prevents redirection or navigation while keeping the UI looking fully active and polished."

  // Design style + active feature skills prepend base instructions
  const systemPrompt = `${skillBlock}
${featureSkillBlock ? featureSkillBlock + "\n" : ""}${BASE_INSTRUCTIONS}

## Website Type Instructions
${typePromptLayer}

## Current Interaction State

${extensionState}

## Project context

- **Name:** ${project.name}
- **Page type:** ${pageContext}
- **Design style:** ${designSkill}

Always build a **${pageContext}**. Follow the Website Type Instructions above for section structure. Apply the design style strictly.

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

  const history = await db.chatMessage.findMany({
    where: { projectId, project: { userId: session.user.id } },
    orderBy: { createdAt: "asc" },
  })

  // Format history for the sidepanel which expects { role, content, createdAt, id }
  const formattedHistory = history.map((m) => {
    // parts is Json, we need to extract text content
    let content = ""
    if (Array.isArray(m.parts)) {
      content = m.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("\n")
    }

    return {
      id: m.id,
      role: m.role,
      content: content,
      createdAt: m.createdAt,
    }
  })

  return new Response(JSON.stringify({ history: formattedHistory }), {
    headers: { "Content-Type": "application/json" },
  })
}
