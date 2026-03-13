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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"
import { getSubscriptionStats } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, TrendingUp, Users, DollarSign, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function AdminSubscriptionsPage() {
  const stats = await getSubscriptionStats()

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
                  <BreadcrumbPage>User Management</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Subscriptions</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <LanguageDropdown />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <CreditCard className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Revenue Analysis</h1>
            </div>
            <p className="text-sm text-zinc-500 font-medium ml-11">
              Track subscription health and revenue growth across the platform.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Active Plans</CardTitle>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{stats.totalActive}</div>
                <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1 font-black uppercase tracking-wider">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.5% vs last month</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Total Revenue</CardTitle>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span>Monthly Recurring Revenue</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Churn Rate</CardTitle>
                <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">2.4%</div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                  <span>Down from 3.1%</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-100">Subscription Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-zinc-300" />
                  <span className="text-sm font-bold text-zinc-400">Detailed Chart Coming Soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
