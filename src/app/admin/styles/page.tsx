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
import { Database, Settings2, Info } from "lucide-react"

export default function AdminStylesPage() {
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
                  <BreadcrumbPage>Citation Styles</BreadcrumbPage>
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
          <div className="flex flex-col gap-1 text-center items-center justify-center py-20">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl text-purple-600 dark:text-purple-400 mb-4 ring-8 ring-purple-500/5 items-center justify-center flex">
              <Database className="h-10 w-10 animate-pulse" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">Style Engine Configuration</h1>
            <p className="text-sm text-zinc-500 font-medium max-w-sm mt-2">
              The citation style engine is currently running on the default global ruleset (APA, MLA, Chicago). Advanced customization will be available in the next system update.
            </p>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              {[
                { title: "APA - 7th Ed", desc: "Active & Synced", icon: <Settings2 className="h-4 w-4" /> },
                { title: "MLA - 9th Ed", desc: "Active & Synced", icon: <Settings2 className="h-4 w-4" /> },
                { title: "Chicago - 17th Ed", desc: "Active & Synced", icon: <Settings2 className="h-4 w-4" /> }
              ].map((style, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-500">
                      {style.icon}
                    </div>
                    <span className="text-sm font-bold">{style.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-8">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{style.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-2 p-3 bg-zinc-100 dark:bg-zinc-900/80 rounded-xl px-5 border border-zinc-200 dark:border-zinc-800">
              <Info className="h-4 w-4 text-zinc-400" />
              <span className="text-[11px] font-bold text-zinc-500">System is currently locked to global standard citations.</span>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
