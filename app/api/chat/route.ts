import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import path from "path"
import fs from "fs/promises"
import { exec } from "child_process"
import { promisify } from "util"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

type ChatRole = ChatMessage["role"]

interface EnhancePromptRequest {
  prompt: string
  context?: {
    fileName?: string
    language?: string
    codeContent?: string
  }
}

function getFileStructure(projectFiles: any, prefix = ""): string {
  if (!projectFiles) return ""
  
  let structure = ""
  
  if (projectFiles.items && Array.isArray(projectFiles.items)) {
    projectFiles.items.forEach((item: any) => {
      if (item.type === "file") {
        structure += `${prefix}📄 ${item.filename}.${item.fileExtension}\n`
      } else if (item.type === "folder") {
        structure += `${prefix}📁 ${item.name}/\n`
        if (item.children) {
          item.children.forEach((child: any) => {
            if (child.type === "file") {
              structure += `${prefix}  📄 ${child.filename}.${child.fileExtension}\n`
            } else if (child.type === "folder") {
              structure += `${prefix}  📁 ${child.name}/\n`
            }
          })
        }
      }
    })
  }
  
  return structure || "No files found"
}

async function generateAIResponse(
  messages: ChatMessage[],
  projectContext?: { projectFiles?: any; openFiles?: any[] }
) {
  let systemPrompt = `You are an expert AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. When showing code, use proper formatting with language-specific syntax.
Keep responses concise but comprehensive. Use code blocks with language specification when providing code examples.`

  // Add project context if available
  if (projectContext?.openFiles && projectContext.openFiles.length > 0) {
    systemPrompt += `\n\nCURRENT PROJECT CONTEXT:
The user is working on a project with the following open files:
${projectContext.openFiles.map((f: any) => `- ${f.name} (${f.language})`).join("\n")}

You have access to this context and should reference these files when providing help. Consider the existing code structure and patterns when suggesting improvements.`
  }

  if (projectContext?.projectFiles) {
    const fileStructure = getFileStructure(projectContext.projectFiles)
    systemPrompt += `\n\nPROJECT FILE STRUCTURE:
${fileStructure}`
  }

  const fullMessages = [{ role: "system", content: systemPrompt }, ...messages]

  const prompt = fullMessages.map((msg) => `${msg.role}: ${msg.content}`).join("\n\n")

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-oss:120b-cloud",
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000,
          num_predict: 1000,
          repeat_penalty: 1.1,
          context_length: 2048,
        },
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error from AI model API:", errorText)
      throw new Error(`AI model API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    if (!data.response) {
      throw new Error("No response from AI model")
    }
    return data.response.trim()
  } catch (error) {
    clearTimeout(timeoutId)
    if ((error as Error).name === "AbortError") {
      throw new Error("Request timeout: AI model took too long to respond (15s)")
    }
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("AI generation error:", errorMsg)
    throw error
  }
}

async function enhancePrompt(request: EnhancePromptRequest) {
  const enhancementPrompt = `You are a prompt enhancement assistant. Take the user's basic prompt and enhance it to be more specific, detailed, and effective for a coding AI assistant.

Original prompt: "${request.prompt}"

Context: ${request.context ? JSON.stringify(request.context, null, 2) : "No additional context"}

Enhanced prompt should:
- Be more specific and detailed
- Include relevant technical context
- Ask for specific examples or explanations
- Be clear about expected output format
- Maintain the original intent

Return only the enhanced prompt, nothing else.`

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "codellama:latest",
        prompt: enhancementPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          max_tokens: 500,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to enhance prompt")
    }

    const data = await response.json()
    return data.response?.trim() || request.prompt
  } catch (error) {
    console.error("Prompt enhancement error:", error)
    return request.prompt // Return original if enhancement fails
  }
}

const execAsync = promisify(exec)

const sanitizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "react-app"

async function scaffoldReactApp(projectName: string) {
  const slug = sanitizeName(projectName)
  const baseDir = path.join(process.cwd(), "generated", slug)

  await fs.mkdir(path.join(baseDir, "src"), { recursive: true })
  await fs.mkdir(path.join(baseDir, "public"), { recursive: true })

  const pkg = {
    name: slug,
    private: true,
    version: "0.1.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      lint: "eslint .",
      preview: "vite preview",
    },
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
    devDependencies: {
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.3.0",
      typescript: "^5.5.0",
      vite: "^6.0.0",
      eslint: "^9.11.1",
      "@typescript-eslint/eslint-plugin": "^8.7.0",
      "@typescript-eslint/parser": "^8.7.0",
    },
  }

  const files: Record<string, string> = {
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ESNext",
          useDefineForClassFields: true,
          lib: ["DOM", "DOM.Iterable", "ESNext"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "Bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
        },
        include: ["src"],
      },
      null,
      2,
    ),
    "tsconfig.node.json": JSON.stringify(
      {
        compilerOptions: {
          composite: true,
          skipLibCheck: true,
          module: "ESNext",
          moduleResolution: "Bundler",
          allowSyntheticDefaultImports: true,
        },
        include: ["vite.config.ts"],
      },
      null,
      2,
    ),
    ".gitignore": ["node_modules", "dist", ".DS_Store"].join("\n"),
    "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${slug}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    "src/main.tsx": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    "src/App.tsx": `import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>Hello from ${slug}</h1>
      <p>Edit src/App.tsx to get started.</p>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
    </div>
  );
}

export default App;
`,
    "src/index.css": `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: #e2e8f0;
  background-color: #0f172a;
}

body {
  margin: 0;
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #1e293b, #0f172a 40%),
    radial-gradient(circle at 80% 0, #312e81, #0f172a 35%);
}

.app {
  max-width: 640px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

button {
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid #475569;
  background: #1e293b;
  color: #e2e8f0;
  cursor: pointer;
}
`,
    "src/App.css": `.app h1 { margin-bottom: 0.5rem; }
button:hover { border-color: #93c5fd; }
`,
    "vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,
  }

  await Promise.all(
    Object.entries(files).map(([relative, content]) =>
      fs.writeFile(path.join(baseDir, relative), content, "utf8"),
    ),
  )

  await fs.writeFile(path.join(baseDir, "package.json"), JSON.stringify(pkg, null, 2), "utf8")

  let installLog = ""
  try {
    const { stdout, stderr } = await execAsync("npm install", { cwd: baseDir, timeout: 60000 })
    installLog = `${stdout}\n${stderr}`
  } catch (error: any) {
    installLog = `npm install failed or timed out: ${error?.message ?? error}`
  }

  return {
    path: baseDir,
    slug,
    installLog,
    files: Object.keys(files),
  }
}

function detectBuildRequest(message: string) {
  const lower = message.toLowerCase()
  
  // Check for explicit build/scaffold request with react
  const hasReact = lower.includes("react")
  const hasApp = lower.includes("app") || lower.includes("project")
  const hasCreate = lower.includes("create") || lower.includes("build") || lower.includes("scaffold")
  const hasStarting = lower.includes("starting with") || lower.includes("using react") || lower.includes("react app")
  
  // Must have react AND (create/build/scaffold) AND (app/project or starting phrase)
  if (!hasReact || !hasCreate || (!hasApp && !hasStarting)) return null

  const nameMatch = lower.match(/named\s+([a-z0-9\-\s]+)/i)
  const name = nameMatch?.[1]?.trim() || "react-app"

  return { framework: "react", name }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const projectId = body.projectId as string | undefined
    const sessionId = body.sessionId as string | undefined

    // Handle prompt enhancement
    if (body.action === "enhance") {
      const enhancedPrompt = await enhancePrompt(body as EnhancePromptRequest)
      return NextResponse.json({ enhancedPrompt })
    }

    // Handle regular chat
    const { message, history } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    // Use provided sessionId or the one from active session
    const currentSessionId = sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Fetch chat history - handle both old messages (without sessionId) and new ones (with sessionId)
    const persistedHistory = await db.chatMessage.findMany({
      where: {
        userId: session.user.id,
        playgroundId: projectId ?? undefined,
        // If sessionId is provided, filter by it; otherwise get all messages for backward compatibility
        ...(sessionId ? { sessionId: currentSessionId } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    })

    const recentHistory: ChatMessage[] = persistedHistory.map((msg) => ({
      role: msg.role as ChatRole,
      content: msg.content,
    }))

    const messages: ChatMessage[] = [...recentHistory, { role: "user", content: message }]

    const buildIntent = detectBuildRequest(message)
    if (buildIntent) {
      const result = await scaffoldReactApp(buildIntent.name)
      const responseText = `Scaffolded React app "${buildIntent.name}" at ${result.path}.

Files created:
- ${result.files.join("\n- ")}

Install log:
${result.installLog}

Next steps:
- cd ${result.path}
- npm run dev
`

      await db.chatMessage.createMany({
        data: [
          {
            userId: session.user.id,
            sessionId: currentSessionId,
            playgroundId: projectId,
            role: "user",
            content: message,
          },
          {
            userId: session.user.id,
            sessionId: currentSessionId,
            playgroundId: projectId,
            role: "assistant",
            content: responseText,
          },
        ],
      })

      return NextResponse.json({
        response: responseText,
        timestamp: new Date().toISOString(),
        action: "scaffold",
        sessionId: currentSessionId,
      })
    }

    const aiResponse = await generateAIResponse(messages, {
      projectFiles: body.projectFiles,
      openFiles: body.openFiles,
    })

    if (!aiResponse) {
      throw new Error("Empty response from AI model")
    }

    await db.chatMessage.createMany({
      data: [
        {
          userId: session.user.id,
          sessionId: currentSessionId,
          playgroundId: projectId,
          role: "user",
          content: message,
        },
        {
          userId: session.user.id,
          sessionId: currentSessionId,
          playgroundId: projectId,
          role: "assistant",
          content: aiResponse,
        },
      ],
    })

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      sessionId: currentSessionId,
    })
  } catch (error) {
    console.error("Error in AI chat route:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projectId = req.nextUrl.searchParams.get("projectId") || undefined

  const messages = await db.chatMessage.findMany({
    where: {
      userId: session.user.id,
      playgroundId: projectId,
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  })

  return NextResponse.json({
    history: messages.map((m) => ({
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    })),
    timestamp: new Date().toISOString(),
  })
}
