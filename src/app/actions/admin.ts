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
