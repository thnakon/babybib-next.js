"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"
import { 
  Database, 
  Clock, 
  History, 
  Cloud, 
  ShieldCheck, 
  Download, 
  Upload, 
  Settings2,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
  HardDrive
} from "lucide-react"
import { AdminSearch } from "@/components/admin/admin-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const categories = [
  { id: "overview", label: "Backup Overview", icon: ShieldCheck, description: "System backup health & status" },
  { id: "schedule", label: "Auto Schedule", icon: Clock, description: "Configure automated frequencies" },
  { id: "history", label: "Backup History", icon: History, description: "Manage past backup points" },
  { id: "storage", label: "Cloud Storage", icon: Cloud, description: "Remote storage destinations" },
]

export default function AdminBackupPageClient({ securityData }: { securityData: any }) {
  const [activeCategory, setActiveCategory] = React.useState("overview")
  const activeInfo = categories.find(c => c.id === activeCategory)

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
                    System
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Database Backup</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold text-zinc-900 dark:text-zinc-100">
                    {activeInfo?.label}
                  </BreadcrumbPage>
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

        <main className="flex flex-1 flex-col p-4 md:p-8 bg-zinc-50/30 dark:bg-zinc-950/20 gap-8">
          <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Automatic Database Backup</h1>
                    <p className="text-xs text-zinc-500 font-medium">Configure and manage your automated system snapshots.</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline"
                className="rounded-xl font-black text-[10px] uppercase tracking-wider h-9 px-5 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                onClick={() => {}}
              >
                <div className="flex items-center gap-2">
                   <span>Trigger Instant Backup</span>
                   <RefreshCcw className="h-3.5 w-3.5 text-zinc-400" />
                </div>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
              
              {/* Sidebar Navigation */}
              <aside className="flex flex-col gap-1.5 h-fit lg:sticky lg:top-24">
                <div className="px-3 mb-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">Backup Configuration</h2>
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden",
                      activeCategory === cat.id 
                        ? "bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800" 
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
                      activeCategory === cat.id 
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-lg shadow-zinc-900/10 rotate-0" 
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 -rotate-3 group-hover:rotate-0"
                    )}>
                      <cat.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className={cn(
                        "text-xs font-bold leading-none mb-0.5",
                        activeCategory === cat.id ? "text-zinc-900 dark:text-zinc-100" : ""
                      )}>
                        {cat.label}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-medium truncate">
                        {cat.description}
                      </span>
                    </div>
                    {activeCategory === cat.id && (
                      <motion.div 
                        layoutId="active-indicator-backup"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-zinc-900 dark:bg-zinc-100 rounded-l-full"
                      />
                    )}
                    {activeCategory !== cat.id && (
                      <ChevronRight className="h-3 w-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity -mr-1" />
                    )}
                  </button>
                ))}
              </aside>

              {/* Content Area */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4 h-12">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{activeInfo?.label}</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{activeInfo?.description}</p>
                  </div>
                </div>

                <div className="relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.23, ease: [0.23, 1, 0.32, 1] }}
                      className="flex flex-col gap-6"
                    >
                      {activeCategory === "overview" && (
                        <div className="grid gap-6">
                          <div className="grid gap-4 md:grid-cols-3">
                            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Backup Health</CardTitle>
                                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="text-xl font-black text-zinc-900 dark:text-zinc-100">100%</div>
                                <p className="text-[9px] text-zinc-400 mt-1 font-medium">Consistent Snapshots</p>
                              </CardContent>
                            </Card>

                            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Snapshot</CardTitle>
                                <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-zinc-100 group-hover:scale-110 transition-transform">
                                  <Clock className="h-3.5 w-3.5" />
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="text-xl font-black text-zinc-900 dark:text-zinc-100">14m Ago</div>
                                <p className="text-[9px] text-zinc-400 mt-1 font-medium">Auto-backup successful</p>
                              </CardContent>
                            </Card>

                            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cloud Sync</CardTitle>
                                <div className="p-1.5 bg-sky-50 dark:bg-sky-950/30 rounded-lg text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                                  <Cloud className="h-3.5 w-3.5" />
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="text-xl font-black text-zinc-900 dark:text-zinc-100">Active</div>
                                <p className="text-[9px] text-zinc-400 mt-1 font-medium">S3 Bucket Protected</p>
                              </CardContent>
                            </Card>
                          </div>

                          <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-zinc-900 text-zinc-100 dark:border-none relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                               <Database className="h-24 w-24" />
                            </div>
                            <CardContent className="p-6">
                               <div className="flex flex-col gap-4 relative z-10">
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Snapshot Integrity</span>
                                     <h3 className="text-lg font-black mt-1">Automated Recovery points</h3>
                                  </div>
                                  <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-[400px]">
                                     Your system is configured to perform automated backups every 6 hours. Snapshots are verified for integrity immediately after creation. Local and remote copies are maintained for redundancy.
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-[10px] font-bold">
                                         <HardDrive className="h-3 w-3 text-zinc-400" />
                                         <span>Local Storage: 2.1 GB used</span>
                                      </div>
                                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-[10px] font-bold">
                                         <Cloud className="h-3 w-3 text-sky-400" />
                                         <span>Cloud Storage: Connected</span>
                                      </div>
                                  </div>
                               </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {activeCategory === "schedule" && (
                        <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                          <CardHeader className="p-6 pb-2 border-b border-zinc-100 dark:border-zinc-800/50">
                             <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold">Auto Backup Schedule</CardTitle>
                                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-none">Active Engine</Badge>
                             </div>
                          </CardHeader>
                          <CardContent className="p-6 space-y-6">
                             <div className="grid gap-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                                   <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                                         <Clock className="h-5 w-5 text-zinc-400" />
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-xs font-bold">Hourly Incremental</span>
                                         <span className="text-[10px] text-zinc-500">Every 1 hour (Last 24 snapshots kept)</span>
                                      </div>
                                   </div>
                                   <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-none font-bold text-[8px] px-2.5 h-6">Disabled</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-950">
                                   <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                                         <Clock className="h-5 w-5 text-white dark:text-zinc-900" />
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Standard Daily</span>
                                         <span className="text-[10px] text-zinc-500">Every night at 02:00 AM (Recommended)</span>
                                      </div>
                                   </div>
                                   <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] px-2.5 h-6 uppercase tracking-wider">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 opacity-60">
                                   <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                                         <Clock className="h-5 w-5 text-zinc-400" />
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-xs font-bold">Weekly Full Snapshot</span>
                                         <span className="text-[10px] text-zinc-500">Every Sunday (Compressed archive)</span>
                                      </div>
                                   </div>
                                   <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-none font-bold text-[8px] px-2.5 h-6">Disabled</Badge>
                                </div>
                             </div>
                             
                             <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900">
                                   <Settings2 className="h-3.5 w-3.5 mr-2" /> Configure Advanced CRON
                                </Button>
                             </div>
                          </CardContent>
                        </Card>
                      )}

                      {activeCategory === "history" && (
                        <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                          <CardHeader className="p-6 pb-2">
                             <CardTitle className="text-sm font-bold">Recent Restoration Points</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                             <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {[
                                   { id: 1, type: "Auto", size: "256 MB", status: "Success", date: "Today, 02:00 AM" },
                                   { id: 2, type: "Manual", size: "254 MB", status: "Success", date: "Yesterday, 14:23 PM" },
                                   { id: 3, type: "Auto", size: "255 MB", status: "Success", date: "Mar 16, 02:00 AM" },
                                ].map((item) => (
                                   <div key={item.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all group">
                                      <div className="flex items-center gap-3">
                                         <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 transition-colors">
                                            <CheckCircle2 className="h-4 w-4" />
                                         </div>
                                         <div className="flex flex-col">
                                            <span className="text-xs font-bold">{item.type} Backup Snapshot</span>
                                            <span className="text-[10px] text-zinc-500 font-medium">{item.date} • {item.size}</span>
                                         </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                                            <Download className="h-3.5 w-3.5" />
                                         </Button>
                                         <Button variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest px-3 border-zinc-200 dark:border-zinc-800 transition-all hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100">
                                            Restore
                                         </Button>
                                      </div>
                                   </div>
                                ))}
                             </div>
                             <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 flex justify-center">
                                <Button variant="ghost" className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900">
                                   View All History <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                             </div>
                          </CardContent>
                        </Card>
                      )}

                      {activeCategory === "storage" && (
                        <div className="grid gap-6">
                           <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                            <CardHeader className="p-6 pb-2">
                               <CardTitle className="text-sm font-bold">Connected Storage Destinations</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                              <div className="flex items-center justify-between p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                                  <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-950/20 text-sky-600 flex items-center justify-center">
                                          <Cloud className="h-6 w-6" />
                                      </div>
                                      <div className="flex flex-col gap-0.5">
                                          <span className="text-sm font-bold">Amazon S3 (Encrypted)</span>
                                          <span className="text-[10px] text-zinc-500 font-medium">Bucket: babybib-system-backups-production</span>
                                      </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1.5">
                                     <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] tracking-widest px-2.5 h-6 uppercase">Connected</Badge>
                                     <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight">Sync Speed: 24.5 MB/s</span>
                                  </div>
                              </div>
                              
                              <div className="flex items-center justify-between p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20 opacity-60 grayscale group hover:grayscale-0 transition-all cursor-not-allowed">
                                  <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
                                          <Cloud className="h-6 w-6" />
                                      </div>
                                      <div className="flex flex-col gap-0.5">
                                          <span className="text-sm font-bold">Google Cloud Storage</span>
                                          <span className="text-[10px] text-zinc-500 font-medium">Not configured</span>
                                      </div>
                                  </div>
                                  <Button variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest">Setup</Button>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="p-5 rounded-3xl bg-amber-50/20 dark:bg-amber-950/5 border border-amber-100/30 dark:border-amber-900/10 flex items-start gap-4">
                             <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600">
                                 <AlertTriangle className="h-5 w-5" />
                             </div>
                             <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-tight">Storage Warning</span>
                                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed max-w-sm">
                                   Always maintain at least one remote backup destination. Relying solely on local storage may result in permanent data loss in the event of hardware failure.
                                </p>
                             </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
