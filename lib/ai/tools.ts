import { tool } from "ai"
import { z } from "zod"
import { db } from "@/lib/db"

export function buildProjectTools(projectId: string, userId: string, webContainerActive = false) {
  return {
    read_file: tool({
      description: "Read the contents of a file in the project. Shows 'Reading <path>' in the UI.",
      inputSchema: z.object({ path: z.string().describe("File path relative to project root") }),
      execute: async ({ path }) => {
        const file = await db.projectFile.findUnique({
          where: { projectId_path: { projectId, path } },
        })
        if (!file) return { error: `File not found: ${path}` }
        return { path, content: file.content, lines: file.content.split("\n").length }
      },
    }),

    write_file: tool({
      description: "Write or replace a file in the project. Shows 'Editing <path>' then 'Wrote <path>' in the UI.",
      inputSchema: z.object({
        path: z.string().describe("File path relative to project root"),
        content: z.string().describe("Full file content to write"),
      }),
      execute: async ({ path, content }) => {
        await db.projectFile.upsert({
          where: { projectId_path: { projectId, path } },
          update: { content },
          create: { projectId, path, content },
        })
        return { success: true, path, bytes: content.length }
      },
    }),

    delete_file: tool({
      description: "Delete a file from the project. Shows 'Deleting <path>' in the UI.",
      inputSchema: z.object({ path: z.string().describe("File path to delete") }),
      execute: async ({ path }) => {
        await db.projectFile.delete({
          where: { projectId_path: { projectId, path } },
        }).catch(() => null)
        return { success: true, path }
      },
    }),

    list_files: tool({
      description: "List all files in the project. Shows 'Scanning project' in the UI.",
      inputSchema: z.object({}),
      execute: async () => {
        const files = await db.projectFile.findMany({
          where: { projectId },
          select: { path: true },
          orderBy: { path: "asc" },
        })
        return { files: files.map((f) => f.path), count: files.length }
      },
    }),

    ...(webContainerActive
      ? {
          run_command: tool({
            description: "Run a shell command in the WebContainer (Node mode only). Shows 'Running: <cmd>' in the UI.",
            inputSchema: z.object({
              cmd: z.string().describe("Shell command to run"),
            }),
            execute: async ({ cmd }) => {
              return { note: "Command queued for WebContainer execution", cmd }
            },
          }),
        }
      : {}),
  }
}
