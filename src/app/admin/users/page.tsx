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
import { getAllUsers } from "@/lib/admin"
import { UserList } from "@/components/admin/user-list"
import { Users } from "lucide-react"

export default async function AdminUsersPage() {
  const users = await getAllUsers()

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
                  <BreadcrumbPage>All Users</BreadcrumbPage>
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
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">User Identification</h1>
            </div>
            <p className="text-sm text-zinc-500 font-medium ml-11">
              Manage and monitor all registered accounts within the system.
            </p>
          </div>

          <UserList initialUsers={users} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
