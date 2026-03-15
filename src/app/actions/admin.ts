"use server"

import { revalidatePath } from "next/cache"
import { updateUser, deleteUser, updateUserRole, createAuditLog } from "@/lib/admin"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { headers } from "next/headers"

export async function adminUpdateUserAction(userId: number, data: any) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await updateUser(userId, data)

  await createAuditLog({
    action: `Update User: ${userId}`,
    category: "AUTH",
    status: "SUCCESS",
    details: JSON.stringify(data),
    userId: Number(session.user.id),
    ipAddress: (await headers()).get("x-forwarded-for") || "unknown"
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function adminDeleteUserAction(userId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await deleteUser(userId)

  await createAuditLog({
    action: `Delete User: ${userId}`,
    category: "AUTH",
    status: "WARNING",
    userId: Number(session.user.id),
    ipAddress: (await headers()).get("x-forwarded-for") || "unknown"
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function adminUpdateRoleAction(userId: number, role: "USER" | "ADMIN") {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  await updateUserRole(userId, role)

  await createAuditLog({
    action: `Change User Role: ${userId} to ${role}`,
    category: "AUTH",
    status: "SUCCESS",
    userId: Number(session.user.id),
    ipAddress: (await headers()).get("x-forwarded-for") || "unknown"
  })

  revalidatePath("/admin/users")
  return { success: true }
}

export async function adminDeleteCitationAction(citationId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { deleteCitationAdmin, createAuditLog: createLog } = await import("@/lib/admin")
  await deleteCitationAdmin(citationId)

  await createLog({
    action: `Delete Citation: ${citationId}`,
    category: "DATA",
    status: "WARNING",
    userId: Number(session.user.id),
    ipAddress: (await headers()).get("x-forwarded-for") || "unknown"
  })

  revalidatePath("/admin/citations")
  return { success: true }
}

export async function adminDeleteProjectAction(projectId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { deleteProjectAdmin, createAuditLog: createLog } = await import("@/lib/admin")
  await deleteProjectAdmin(projectId)

  await createLog({
    action: `Delete Project: ${projectId}`,
    category: "DATA",
    status: "WARNING",
    userId: Number(session.user.id),
    ipAddress: (await headers()).get("x-forwarded-for") || "unknown"
  })

  revalidatePath("/admin/projects")
  return { success: true }
}

export async function adminUpdateCitationAction(citationId: number, data: any) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { updateCitationAdmin, createAuditLog: createLog } = await import("@/lib/admin")
  await updateCitationAdmin(citationId, data)

  await createLog({
    action: `Update Citation: ${citationId}`,
    category: "DATA",
    status: "SUCCESS",
    details: JSON.stringify(data),
    userId: Number(session.user.id),
    ipAddress: (await headers()).get("x-forwarded-for") || "unknown"
  })

  revalidatePath("/admin/citations")
  return { success: true }
}

export async function adminUpdateProjectAction(projectId: number, data: any) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { updateProjectAdmin, createAuditLog: createLog } = await import("@/lib/admin")
  await updateProjectAdmin(projectId, data)

  await createLog({
    action: `Update Project: ${projectId}`,
    category: "DATA",
    status: "SUCCESS",
    details: JSON.stringify(data),
    userId: Number(session.user.id),
    ipAddress: (await headers()).get("x-forwarded-for") || "unknown"
  })

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

export async function adminDeleteLogAction(logId: number) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized")
  }

  const { deleteAuditLog } = await import("@/lib/admin")
  await deleteAuditLog(logId)

  revalidatePath("/admin/logs")
  return { success: true }
}
