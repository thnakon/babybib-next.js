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
import { MessageSquare, LifeBuoy, Clock, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function AdminSupportPage() {
  const mockTickets = [
    { id: "T-1001", subject: "Cannot reset password", user: "Somchai R.", status: "open", priority: "high", time: "2h ago" },
    { id: "T-1002", subject: "Subscription inquiry", user: "Jane Doe", status: "in-progress", priority: "medium", time: "5h ago" },
    { id: "T-1003", subject: "Bulk upload error", user: "Kittisak S.", status: "resolved", priority: "low", time: "1d ago" },
  ]

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
                  <BreadcrumbPage>Support Tickets</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <div className="mr-2 flex items-center gap-2 px-2.5 py-1 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
               <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Secure Audit</span>
            </div>
            <LanguageDropdown />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Customer Support</h1>
                <p className="text-xs text-zinc-500 font-medium">
                  Respond to user inquiries and resolve technical issues.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100/50 dark:bg-orange-800/50 rounded-full border border-orange-200/50 dark:border-orange-700/50">
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                3 <span className="font-medium">Pending Tickets</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
              <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                12 <span className="font-medium">Resolved Today</span>
              </span>
            </div>
          </div>

            <div className="space-y-3">
              {mockTickets.map((ticket) => (
                <Card key={ticket.id} className="border-zinc-100 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-3 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                          ticket.status === "open" ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" :
                          ticket.status === "in-progress" ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400" :
                          "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                        )}>
                          {ticket.status === "open" ? <AlertCircle className="h-5 w-5" /> : 
                           ticket.status === "in-progress" ? <Clock className="h-5 w-5" /> : 
                           <CheckCircle2 className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{ticket.id}</span>
                            <Badge className={cn(
                              "text-[9px] font-black uppercase px-2 py-0 border-none",
                              ticket.priority === "high" ? "bg-red-500/10 text-red-500" :
                              ticket.priority === "medium" ? "bg-orange-500/10 text-orange-500" :
                              "bg-zinc-500/10 text-zinc-500"
                            )}>
                              {ticket.priority} priority
                            </Badge>
                          </div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {ticket.subject}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{ticket.user}</span>
                            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {ticket.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl font-bold border-zinc-200 dark:border-zinc-800">
                          View Details
                        </Button>
                        <Button size="sm" className="h-9 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex h-[150px] items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex flex-col items-center gap-2">
                <MessageSquare className="h-8 w-8 text-zinc-200" />
                <span className="text-sm font-bold text-zinc-400">All caught up! No more tickets.</span>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
