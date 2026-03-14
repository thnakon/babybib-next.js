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
import { LogList } from "@/components/admin/log-list"
import { Terminal, ShieldAlert } from "lucide-react"

export default function AdminLogsPage() {
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
                  <BreadcrumbPage>System Control</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Audit Logs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-2 flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/20 rounded-full border border-red-100 dark:border-red-900/30">
               <ShieldAlert className="h-3 w-3 text-red-600 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-tighter text-red-600">Secure Audit</span>
            </div>
            <LanguageDropdown />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-purple-600 dark:text-purple-400">
                <Terminal className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">System Activity Logs</h1>
            </div>
            <p className="text-sm text-zinc-500 font-medium ml-11">
              Real-time auditing of system events, security exceptions, and administrative actions.
            </p>
          </div>

          <LogList />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
