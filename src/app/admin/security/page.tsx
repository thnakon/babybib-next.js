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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"
import { getSecurityOverview } from "@/lib/admin"
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Activity, 
  Globe, 
  Database, 
  Clock,
  AlertCircle,
  Shield,
  Zap,
  Fingerprint,
  Search,
  CheckCircle2,
  AlertTriangle,
  History
} from "lucide-react"
import { AdminSearch } from "@/components/admin/admin-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AdminSecurityPage() {
  const security = await getSecurityOverview()

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
                  <BreadcrumbPage>Security & Firewall</BreadcrumbPage>
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
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Security Administration</h1>
                <p className="text-xs text-zinc-500 font-medium">Real-time system integrity and threat monitoring.</p>
              </div>
            </div>
          </div>

          {/* Stats Grid - Matching Dashboard 3 columns */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">System Integrity</CardTitle>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">99.8%</div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span>All microservices operational</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Threat Alerts (24h)</CardTitle>
                <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{security.criticalLogs24h}</div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                   <Activity className="h-3 w-3 text-rose-500" />
                   <span>Suspicious attempts blocked</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-zinc-500">Security Coverage</CardTitle>
                <div className="p-2 bg-zinc-900 dark:bg-zinc-100 rounded-lg text-white dark:text-zinc-900 group-hover:scale-110 transition-transform">
                  <Lock className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">100%</div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-medium">
                  <Globe className="h-3 w-3 text-zinc-500" />
                  <span>SSL & Firewall verified</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detail Grid - Matching Dashboard 2 columns */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                    <Shield className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <CardTitle className="text-sm font-bold">Recent Critical Events</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {security.recentCritical.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase">
                          <Zap className="h-3.5 w-3.5" />
                        </div>
                        <div className="grid gap-0.5">
                          <span className="text-sm font-bold leading-none">{log.action}</span>
                          <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">{log.details}</span>
                        </div>
                      </div>
                      <div 
                        className="text-[10px] font-medium text-zinc-400 flex items-center gap-1 shrink-0"
                        suppressHydrationWarning
                      >
                        <Clock className="h-3 w-3" />
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  {security.recentCritical.length === 0 && (
                    <div className="p-12 text-center">
                       <ShieldCheck className="h-8 w-8 text-emerald-500/20 mx-auto mb-2" />
                       <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No active threats detected</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
               <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
                  <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                           <LayoutDashboard className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                         </div>
                         <CardTitle className="text-sm font-bold">System Hardening</CardTitle>
                       </div>
                       <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase">Optimal</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Key className="h-4 w-4 text-zinc-400" />
                           <div className="flex flex-col">
                              <span className="text-xs font-bold">Database Encryption</span>
                              <span className="text-[10px] text-zinc-500 font-medium">AES-256 Bit Enforced</span>
                           </div>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                     </div>
                     <Separator className="bg-zinc-100 dark:bg-zinc-800/50" />
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Fingerprint className="h-4 w-4 text-zinc-400" />
                           <div className="flex flex-col">
                              <span className="text-xs font-bold">Two-Factor Authentication</span>
                              <span className="text-[10px] text-zinc-500 font-medium">Enforced for all Admins</span>
                           </div>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm bg-zinc-900 text-zinc-100 dark:border-none overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Shield className="h-24 w-24" />
                  </div>
                  <CardContent className="p-6">
                     <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Security Health</span>
                           <h3 className="text-lg font-black mt-1">Maximum Protection</h3>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-[240px]">
                           All security protocols are currently active. Last automated vulnerability scan completed 14 minutes ago with zero anomalies found.
                        </p>
                        <Button className="w-fit h-9 bg-zinc-100 hover:bg-white text-zinc-900 font-black uppercase tracking-widest text-[9px] rounded-lg border-none px-6">
                           Initiate Audit
                        </Button>
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

function LayoutDashboard(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}
