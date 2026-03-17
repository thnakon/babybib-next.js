import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, LayoutDashboard, Users, BookOpen, Database, TrendingUp, Clock } from "lucide-react"
import { AdminSearch } from "@/components/admin/admin-search"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"
import { getAdminStats, getRecentActivity } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()
  const { recentUsers, recentCitations } = await getRecentActivity()

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-zinc-100 dark:border-zinc-800/50 pr-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashbord">
                    Overview
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <AdminSearch />
            <div className="flex items-center gap-2">
              <LanguageDropdown />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Administrative Overview</h1>
                <p className="text-xs text-zinc-500 font-medium">Real-time metrics and platform activity summary.</p>
              </div>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Total Users</CardTitle>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stats.userCount}</div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span>Personal information managed</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Active Projects</CardTitle>
                <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stats.projectCount}</div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                  <Database className="h-3 w-3 text-orange-500" />
                  <span>Research projects in progress</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Global Citations</CardTitle>
                <div className="p-2 bg-zinc-900 dark:bg-zinc-100 rounded-lg text-white dark:text-zinc-900 group-hover:scale-110 transition-transform">
                  <Database className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stats.citationCount}</div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3 text-zinc-500" />
                  <span>Citations generated by AI</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                    <Users className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <CardTitle className="text-sm font-bold">Recent New Users</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">
                          {user.username.substring(0, 2)}
                        </div>
                        <div className="grid gap-0.5">
                          <span className="text-sm font-bold leading-none">{user.username}</span>
                          <span className="text-[10px] text-zinc-500 truncate max-w-[150px]">{user.email}</span>
                        </div>
                      </div>
                      <div 
                        className="text-[10px] font-medium text-zinc-400 flex items-center gap-1"
                        suppressHydrationWarning
                      >
                        <Clock className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {recentUsers.length === 0 && (
                    <div className="p-8 text-center text-xs text-zinc-500 font-medium">No new users yet</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                    <BookOpen className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <CardTitle className="text-sm font-bold">Recent Citation Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {recentCitations.map((citation) => (
                    <div key={citation.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="flex flex-col gap-1 min-w-0 flex-1 mr-4">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[9px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
                            {citation.type}
                          </span>
                          <span className="text-xs font-bold truncate">
                            {citation.title || "Untitled Citation"}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 truncate">
                          in <span className="font-bold text-zinc-700 dark:text-zinc-300">{citation.project.name}</span> by {citation.project.user?.username || "Guest"}
                        </span>
                      </div>
                      <div 
                        className="text-[10px] font-medium text-zinc-400 flex items-center gap-1 shrink-0"
                        suppressHydrationWarning
                      >
                        <Clock className="h-3 w-3" />
                        {new Date(citation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {recentCitations.length === 0 && (
                    <div className="p-8 text-center text-xs text-zinc-500 font-medium">No activity recorded</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
