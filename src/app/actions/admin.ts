"use server"

import { revalidatePath } from "next/cache"
import { updateUser, deleteUser, updateUserRole } from "@/lib/admin"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function adminUpdateUserAction(userId: number, data: any) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await updateUser(userId, data)
  revalidatePath("/admin/users")
  return { success: true }
}

export async function adminDeleteUserAction(userId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await deleteUser(userId)
  revalidatePath("/admin/users")
  return { success: true }
}

export async function adminUpdateRoleAction(userId: number, role: "USER" | "ADMIN") {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await updateUserRole(userId, role)
  revalidatePath("/admin/users")
  return { success: true }
}

export async function adminDeleteCitationAction(citationId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { deleteCitationAdmin } = await import("@/lib/admin")
  await deleteCitationAdmin(citationId)
  revalidatePath("/admin/citations")
  return { success: true }
}

export async function adminDeleteProjectAction(projectId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { deleteProjectAdmin } = await import("@/lib/admin")
  await deleteProjectAdmin(projectId)
  revalidatePath("/admin/projects")
  return { success: true }
}

export async function adminUpdateCitationAction(citationId: number, data: any) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { updateCitationAdmin } = await import("@/lib/admin")
  await updateCitationAdmin(citationId, data)
  revalidatePath("/admin/citations")
  return { success: true }
}

export async function adminUpdateProjectAction(projectId: number, data: any) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { updateProjectAdmin } = await import("@/lib/admin")
  await updateProjectAdmin(projectId, data)
  revalidatePath("/admin/projects")
  return { success: true }
}

export async function adminGetProjectCitationsAction(projectId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { getProjectCitationsAdmin } = await import("@/lib/admin")
  const citations = await getProjectCitationsAdmin(projectId)
  return { success: true, citations }
}
