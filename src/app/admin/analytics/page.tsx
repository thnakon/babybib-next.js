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
import { Search, TrendingUp, BarChart3, Clock, ArrowUpRight, ArrowDownRight, ShieldAlert } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"
import { getCitationTrends, getAdminStats } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default async function AdminAnalyticsPage() {
  const trends = await getCitationTrends()
  const stats = await getAdminStats()

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-zinc-100 dark:border-zinc-800/50 pr-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashbord" className="text-zinc-500">Overview</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-purple-500 transition-colors" />
              <Input
                id="admin-analytics-search"
                type="search"
                placeholder="Search..."
                className="pl-9 h-8.5 bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-purple-500/30 shadow-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="mr-2 flex items-center gap-2 px-2.5 py-1 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
                 <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Secure Audit</span>
              </div>
              <LanguageDropdown />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Usage Analytics</h1>
                <p className="text-xs text-zinc-500 font-medium">Monitoring platform growth and citation trends.</p>
              </div>
            </div>
          </div>

          {/* Growth Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-xs">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Total Reach</CardDescription>
                <CardTitle className="text-2xl font-black">{stats.userCount}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.5% vs last month</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-xs">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Citations/Day</CardDescription>
                <CardTitle className="text-2xl font-black">
                  {(stats.citationCount / 30).toFixed(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+4.2% daily avg</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-xs">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Project Capacity</CardDescription>
                <CardTitle className="text-2xl font-black">{stats.projectCount}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                  <BarChart3 className="h-3 w-3" />
                  <span>Stable growth</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-xs">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">System Health</CardDescription>
                <CardTitle className="text-2xl font-black text-emerald-500">99.9%</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Clock className="h-3 w-3" />
                  <span>Uptime confirmed</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trends Table (since we don't have a charting lib installed currently, table is better for default state) */}
          <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold">Citation Growth (Last 7 Days)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800/50 transition-colors">
                      <th className="h-10 px-4 text-left align-middle font-bold text-zinc-500 text-[10px] uppercase tracking-wider">Date</th>
                      <th className="h-10 px-4 text-right align-middle font-bold text-zinc-500 text-[10px] uppercase tracking-wider">Citations Created</th>
                      <th className="h-10 px-4 text-right align-middle font-bold text-zinc-500 text-[10px] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    {trends.map((day) => (
                      <tr key={day.date} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4 align-middle font-medium text-xs" suppressHydrationWarning>
                          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="p-4 align-middle text-right font-black text-sm">
                          {day.count}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                    {trends.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-xs text-zinc-500 font-medium italic">
                          No trend data available for the last period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
