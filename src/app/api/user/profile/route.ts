import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { username, firstName, lastName, bio, image, urls } = body

    // Basic validation
    if (!username || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if username is taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: Number((session.user as any).id) }
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Update user in database using raw SQL to bypass Prisma client sync issues
    const userId = Number((session.user as any).id)
    const urlsJson = typeof urls === 'string' ? urls : JSON.stringify(urls)
    
    await (prisma as any).$executeRawUnsafe(
      `UPDATE User SET username = ?, firstName = ?, lastName = ?, bio = ?, image = ?, urls = ? WHERE id = ?`,
      username, firstName, lastName, bio || null, image || null, urlsJson || null, userId
    )

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        username,
        firstName,
        lastName,
        bio,
        image,
        urls: urlsJson
      }
    })
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
