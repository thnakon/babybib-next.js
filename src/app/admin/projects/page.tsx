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
import { getAllProjects } from "@/lib/admin"
import { ProjectList } from "@/components/admin/project-list"
import { Projector } from "lucide-react"
import { AdminSearch } from "@/components/admin/admin-search"

export default async function AdminProjectsPage() {
  const projects = await getAllProjects()

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
                  <BreadcrumbPage>Master Data</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>User Projects</BreadcrumbPage>
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

        <main className="flex flex-1 flex-col gap-6 p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                <Projector className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Project Management</h1>
                <p className="text-xs text-zinc-500 font-medium">
                  Administrator view of all user-created bibliography projects and their citation counts.
                </p>
              </div>
            </div>
          </div>

          <ProjectList initialProjects={projects} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
