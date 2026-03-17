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
  Globe,
  Database,
  Bot,
  Type,
  Layers,
  Terminal,
  Save,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react"
import { AdminSearch } from "@/components/admin/admin-search"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const categories = [
  { id: "general", label: "General", icon: Globe, description: "Platform info and identifiers" },
  { id: "ai", label: "AI & Extraction", icon: Bot, description: "Model and provider config" },
  { id: "engine", label: "Book Engine", icon: Database, description: "Bibliographic and citation rules" },
  { id: "appearance", label: "Appearance", icon: Type, description: "UI, fonts and visual styles" },
  { id: "maintenance", label: "Maintenance", icon: Terminal, description: "System health and cache" },
]

export default function AdminSettingsPage() {
  const [activeCategory, setActiveCategory] = React.useState("general")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Settings saved successfully", {
        description: `Your ${activeCategory} configuration has been updated.`,
        duration: 2000
      })
    }, 1200)
  }

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
                    Overview
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
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

        <main className="flex flex-1 flex-col p-4 md:p-8 bg-zinc-50/30 dark:bg-zinc-950/20">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="flex flex-col gap-1.5 h-fit lg:sticky lg:top-24">
              <div className="px-3 mb-2">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400">Settings Manager</h2>
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
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20 rotate-0" 
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
                      layoutId="active-indicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-500 rounded-l-full"
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
                   <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{activeInfo?.label} Settings</h1>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{activeInfo?.description}</p>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="rounded-xl font-black text-[10px] uppercase tracking-wider h-10 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 transition-all shadow-xl shadow-zinc-900/10 dark:shadow-white/5 border-none"
                >
                  {isSaving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                       <span>Apply Changes</span>
                       <Save className="h-3.5 w-3.5" />
                    </div>
                  )}
                </Button>
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
                    {activeCategory === "general" && (
                      <div className="grid gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                          <CardHeader className="p-6 pb-2">
                             <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Core</Badge>
                             </div>
                             <CardTitle className="text-sm font-bold">Platform Information</CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Site Title</Label>
                                <Input defaultValue="Babybib - Smart Book Management" className="rounded-xl h-11 text-xs border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 focus:ring-purple-500/20" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Support Inquiry Email</Label>
                                <Input defaultValue="support@babybib.com" className="rounded-xl h-11 text-xs border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 focus:ring-purple-500/20" />
                              </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Default Locale</Label>
                                <Input defaultValue="Thai (Standard)" className="rounded-xl h-11 text-xs border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 focus:ring-purple-500/20" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {activeCategory === "ai" && (
                      <div className="grid gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                          <CardHeader className="p-6 pb-2">
                             <CardTitle className="text-sm font-bold">Extraction Intelligence</CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Default Extraction Model</Label>
                                <div className="flex flex-col gap-2">
                                    <Input defaultValue="GPT-4o (Omni)" className="rounded-xl h-11 text-xs border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950" />
                                    <span className="text-[9px] text-zinc-400 flex items-center gap-1.5 px-1 font-medium">
                                        <Zap className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                                        High accuracy mode active
                                    </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Model Provider</Label>
                                <Input defaultValue="OpenAI" className="rounded-xl h-11 text-xs border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950" />
                              </div>
                            </div>
                            <Separator className="bg-zinc-100 dark:bg-zinc-800/50" />
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 group">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold">AI Usage Quota</span>
                                    <span className="text-[9px] opacity-60">System-wide processing limit</span>
                                </div>
                                <span className="text-sm font-black tracking-tighter">Unlimited</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {activeCategory === "engine" && (
                      <div className="grid gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                          <CardHeader className="p-6 pb-2">
                             <CardTitle className="text-sm font-bold">Bibliographic Engine</CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Primary RuleSet</Label>
                                <Input defaultValue="APA 7th Edition" className="rounded-xl h-11 text-xs border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Metadata Fallback</Label>
                                <Input defaultValue="Library of Congress" className="rounded-xl h-11 text-xs border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {activeCategory === "appearance" && (
                      <div className="grid gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                          <CardHeader className="p-6 pb-2">
                             <CardTitle className="text-sm font-bold">Visual Language</CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-sm">กข</div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Anuphan Font Engine</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">Standard for Thai academic rendering</span>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] tracking-widest px-2.5 h-6">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Dynamic Motion UI</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">Enable fluid interface transitions</span>
                                    </div>
                                </div>
                                <Badge className="bg-purple-500 text-white border-none font-black text-[8px] tracking-widest px-2.5 h-6 uppercase">Enabled</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {activeCategory === "maintenance" && (
                      <div className="grid gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-800 overflow-hidden bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                          <CardHeader className="p-6 pb-2">
                             <CardTitle className="text-sm font-bold">System Operations</CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 space-y-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Maintenance Mode</span>
                                        <span className="text-[10px] text-zinc-500 font-medium">Platform restricted to administrators only</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-bold text-zinc-400 border-zinc-200 dark:border-zinc-800 px-3 uppercase tracking-tighter">Standby</Badge>
                                </div>
                                <Separator className="bg-zinc-100 dark:bg-zinc-800/30" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Button variant="outline" className="h-12 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                        <Activity className="h-3.5 w-3.5 mr-2 text-zinc-400" />
                                        Clear Cache
                                    </Button>
                                    <Button variant="outline" className="h-12 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                        <Database className="h-3.5 w-3.5 mr-2 text-zinc-400" />
                                        Index Refresh
                                    </Button>
                                </div>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="p-5 rounded-3xl bg-rose-50/20 dark:bg-rose-950/5 border border-rose-100/30 dark:border-rose-900/10 flex items-start gap-4">
                           <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-500">
                               <ShieldCheck className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col gap-1.5">
                              <span className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase tracking-tight">Privileged Environment</span>
                              <p className="text-[10px] text-zinc-500 font-medium leading-relaxed max-w-sm">
                                 System modifications require high-level authorization. All administrative actions are recorded in the system audit trail.
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
