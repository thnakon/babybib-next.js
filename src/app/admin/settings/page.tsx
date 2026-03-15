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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"
import { 
  Settings2, 
  Search, 
  Database, 
  Globe, 
  Activity, 
  Terminal, 
  Save,
  Monitor,
  HardDrive,
  Cloud,
  Cpu,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminSettingsPage() {
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
                  <BreadcrumbPage>System Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-purple-500 transition-colors" />
              <Input
                id="admin-settings-search"
                type="search"
                placeholder="Search settings..."
                className="pl-9 h-8.5 bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-purple-500/30 shadow-none transition-all"
              />
            </div>
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
                <Settings2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">General Settings</h1>
                <p className="text-xs text-zinc-500 font-medium">Configure global platform parameters and environment variables.</p>
              </div>
            </div>
          </div>

          {/* Stats Grid - Matching Dashboard 3 columns */}
          <div className="grid gap-4 md:grid-cols-3">
             <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Storage Usage</CardTitle>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <HardDrive className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">3.2 GB</div>
                <div className="mt-2 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[32%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2 font-bold uppercase tracking-tight">Total Capacity: 10 GB</p>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">System Load</CardTitle>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Cpu className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">12.4%</div>
                <p className="text-[10px] text-emerald-500 mt-2 font-black uppercase tracking-widest flex items-center gap-1">
                   <Activity className="h-3 w-3" /> Healthy Performance
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Cloud Status</CardTitle>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <Cloud className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Synced</div>
                <p className="text-[10px] text-zinc-400 mt-2 font-bold uppercase tracking-tight">Last sync: 12 minutes ago</p>
              </CardContent>
            </Card>
          </div>

          {/* Detail Grid - Matching Dashboard 2 columns */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm bg-white dark:bg-zinc-950">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                      <Monitor className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <CardTitle className="text-sm font-bold">Platform Information</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400">
                     <Save className="h-4 w-4 text-emerald-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Site Name</Label>
                    <Input defaultValue="Babybib - Smart Book Management" className="rounded-xl h-10 bg-zinc-50 dark:bg-zinc-900 border-none font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Primary Support Email</Label>
                    <Input defaultValue="support@babybib.com" className="rounded-xl h-10 bg-zinc-50 dark:bg-zinc-900 border-none font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">API Documentation URL</Label>
                    <Input defaultValue="https://docs.babybib.com/api" className="rounded-xl h-10 bg-zinc-50 dark:bg-zinc-900 border-none font-bold italic" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-xs font-black">Maintenance Mode</span>
                         <span className="text-[10px] text-zinc-400 font-medium">Bypass only for developer IPs</span>
                      </div>
                      <Badge variant="outline" className="h-7 px-3 rounded-lg border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900 text-zinc-400">Disabled</Badge>
                   </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
               <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
                  <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                         <Terminal className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                       </div>
                       <CardTitle className="text-sm font-bold">Execution & Runtime</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     {[
                        { label: "Node.js Version", value: "v20.11.0", icon: ChevronRight },
                        { label: "Prisma Engine", value: "5.10.2", icon: RefreshCw },
                        { label: "Database Driver", value: "MySQL 8.0", icon: Database },
                     ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                           <div className="flex items-center gap-3">
                              <item.icon className="h-3.5 w-3.5 text-zinc-400 group-hover:rotate-180 transition-transform duration-500" />
                              <span className="text-xs font-bold">{item.label}</span>
                           </div>
                           <span className="text-[11px] font-black text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">{item.value}</span>
                        </div>
                     ))}
                  </CardContent>
               </Card>

               <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none overflow-hidden group">
                  <CardContent className="p-6">
                     <div className="flex items-start justify-between">
                        <div className="space-y-4">
                           <div className="flex flex-col">
                              <Badge className="bg-white/20 text-white border-none w-fit text-[8px] font-black uppercase tracking-widest mb-2">Beta Feature</Badge>
                              <h3 className="text-lg font-black leading-tight">Advanced System Optimization</h3>
                           </div>
                           <p className="text-[11px] text-white/80 font-medium leading-relaxed max-w-[200px]">
                              Enable AI-driven cache purging and automatic database indexing for increased throughput.
                           </p>
                           <Button className="h-9 bg-white text-indigo-600 hover:bg-zinc-100 font-black uppercase tracking-widest text-[9px] rounded-lg px-6 border-none">
                              Apply Boost
                           </Button>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                           <Zap className="h-6 w-6 text-white animate-pulse" />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
