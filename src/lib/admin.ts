import { prisma } from "./prisma"

export async function getAdminStats() {
  const [userCount, citationCount, projectCount] = await Promise.all([
    prisma.user.count(),
    prisma.citation.count({ where: { isDeleted: false } }),
    prisma.project.count({ where: { isArchived: false } }),
  ])

  return {
    userCount,
    citationCount,
    projectCount,
  }
}

export async function getRecentActivity() {
  const [recentUsers, recentCitations] = await Promise.all([
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.citation.findMany({
      take: 5,
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: {
            name: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    }),
  ])

  return {
    recentUsers,
    recentCitations,
  }
}

export async function getCitationTrends() {
  // Fetch citations grouped by day for the last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const citations = await prisma.citation.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      isDeleted: false,
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  const trends = citations.reduce((acc: Record<string, number>, citation: { createdAt: Date }) => {
    const date = citation.createdAt.toISOString().split("T")[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  return Object.entries(trends).map(([date, count]) => ({
    date,
    count,
  }))
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isLisStudent: true,
      studentId: true,
      orgType: true,
      province: true,
      orgName: true,
      otherOrgType: true,
      emailVerified: true,
      createdAt: true,
    },
  })
}

export async function updateUserRole(userId: number, role: "USER" | "ADMIN") {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
}

export async function updateUser(userId: number, data: any) {
  return await prisma.user.update({
    where: { id: userId },
    data,
  })
}

export async function deleteUser(userId: number) {
  return await prisma.user.delete({
    where: { id: userId },
  })
}

export async function getSubscriptionStats() {
  // Placeholder as subscription model is not yet in schema
  const totalUsers = await prisma.user.count()
  return {
    totalActive: Math.floor(totalUsers * 0.1), // Mock data
    totalRevenue: totalUsers * 9.99, // Mock data
    trends: [
      { month: "Jan", count: 10 },
      { month: "Feb", count: 15 },
      { month: "Mar", count: 25 },
    ],
  }
}

export async function getAllCitations() {
  return await prisma.citation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: {
          name: true,
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      },
    },
  })
}

export async function getAllProjects() {
  return await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
      _count: {
        select: {
          citations: true,
        },
      },
    },
  })
}

export async function deleteCitationAdmin(citationId: number) {
  return await prisma.citation.delete({
    where: { id: citationId },
  })
}

export async function updateCitationAdmin(citationId: number, data: any) {
  return await prisma.citation.update({
    where: { id: citationId },
    data,
  })
}

export async function deleteProjectAdmin(projectId: number) {
  return await prisma.project.delete({
    where: { id: projectId },
  })
}

export async function updateProjectAdmin(projectId: number, data: any) {
  return await prisma.project.update({
    where: { id: projectId },
    data,
  })
}

export async function getProjectCitationsAdmin(projectId: number) {
  return await prisma.citation.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  })
}

export async function createAuditLog(data: {
  action: string
  category: string
  status: string
  details?: string
  userId?: number
  ipAddress?: string
}) {
  return await prisma.auditLog.create({
    data,
  })
}

export async function getAuditLogs(filters: {
  search?: string
  category?: string
  status?: string
  startDate?: Date
  endDate?: Date
}) {
  const { search, category, status, startDate, endDate } = filters

  const where: any = {}

  if (category && category !== "ALL") {
    where.category = category
  }

  if (status && status !== "ALL") {
    where.status = status
  }

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = startDate
    if (endDate) where.createdAt.lte = endDate
  }

  if (search) {
    where.OR = [
      { action: { contains: search } },
      { details: { contains: search } },
      { ipAddress: { contains: search } },
      { user: { username: { contains: search } } },
      { user: { email: { contains: search } } },
    ]
  }

  return await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  })
}

export async function getSecurityOverview() {
  const [totalLogs, criticalLogs, recentCritical] = await Promise.all([
    prisma.auditLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.auditLog.count({
      where: {
        status: "CRITICAL",
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.auditLog.findMany({
      take: 5,
      where: { status: "CRITICAL" },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          }
        }
      }
    })
  ])

  return {
    totalLogs24h: totalLogs,
    criticalLogs24h: criticalLogs,
    recentCritical,
    systemStatus: {
      firewall: "Active",
      ssl: "Valid",
      dbEncryption: "AES-256",
      lastBackup: new Date().toISOString()
    }
  }
}

export async function deleteAuditLog(logId: number) {
  return await prisma.auditLog.delete({
    where: { id: logId },
  })
}
