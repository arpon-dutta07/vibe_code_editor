"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "project"
}

export async function checkProjectNameExists(name: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const project = await db.project.findFirst({
    where: {
      userId: session.user.id,
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  })

  return !!project
}

export async function createProject(name: string, pageType = "landing", skill = "techsleek") {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existing = await db.project.findFirst({
    where: {
      userId: session.user.id,
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  })

  if (existing) {
    throw new Error("A project with this name already exists")
  }

  const baseSlug = toSlug(name)
  let slug = baseSlug
  let attempt = 0

  while (await db.project.findFirst({ where: { userId: session.user.id, slug } })) {
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const project = await db.project.create({
    data: {
      userId: session.user.id,
      name,
      slug,
      pageType,
      activeSkills: [skill],
    },
  })

  revalidatePath("/dashboard")
  return project
}

export async function getProjectsForUser() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { files: { select: { path: true }, take: 5 } },
  })
}

export async function getProjectById(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return db.project.findUnique({
    where: { id, userId: session.user.id },
    include: {
      files: { orderBy: { path: "asc" } },
      commits: { orderBy: { createdAt: "desc" }, take: 20 },
      messages: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  })
}

export async function deleteProject(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.project.delete({ where: { id, userId: session.user.id } })
  revalidatePath("/dashboard")
}

export async function renameProject(id: string, name: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.project.update({ where: { id, userId: session.user.id }, data: { name } })
  revalidatePath("/dashboard")
  revalidatePath(`/project/${id}`)
}

export async function getProjectFiles(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return db.projectFile.findMany({
    where: { projectId, project: { userId: session.user.id } },
    orderBy: { path: "asc" },
  })
}

export async function saveProjectFile(projectId: string, path: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.projectFile.upsert({
    where: { projectId_path: { projectId, path } },
    update: { content },
    create: { projectId, path, content },
  })
}

export async function getCommitHistory(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return db.projectCommit.findMany({
    where: { projectId, project: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}

export async function toggleStarProject(id: string, isStarred: boolean) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await db.project.update({
    where: { id, userId: session.user.id },
    data: { isStarred },
  })
  revalidatePath("/dashboard")
}

export async function getChatMessages(projectId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return db.chatMessage.findMany({
    where: { projectId, project: { userId: session.user.id } },
    orderBy: { createdAt: "asc" },
  })
}
