"use client"

import * as React from "react"
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
  Cpu,
  RefreshCw,
  ChevronRight,
  Shield,
  Zap,
  Bot,
  Type,
  Layout,
  Globe2,
  Bell,
  HardDrive,
  Cloud,
  Layers,
  Sparkles,
  SearchCode,
  Check
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type SettingsTab = "GENERAL" | "APPEARANCE" | "AI" | "BIBLIO" | "ADVANCED"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("GENERAL")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Settings saved successfully", {
        description: "System configuration has been updated."
      })
    }, 1000)
  }

  const navItems = [
    { id: "GENERAL", label: "General", icon: Settings2, description: "Platform info & support" },
    { id: "APPEARANCE", label: "Appearance", icon: Layout, description: "Theme & Thai fonts" },
    { id: "AI", label: "AI & Extraction", icon: Bot, description: "Models & providers" },
    { id: "BIBLIO", label: "Bibliographic", icon: Layers, description: "Search & metadata" },
    { id: "ADVANCED", label: "Advanced", icon: Terminal, description: "Maintenance & cache" },
  ] as const

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-zinc-100 dark:border-zinc-800/50 pr-4 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-30">
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

        <main className="flex flex-1 flex-col p-6 bg-zinc-50/50 dark:bg-zinc-950/50 overflow-auto">
          <div className="max-w-6xl mx-auto w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 uppercase italic">
                  System Configuration
                </h1>
                <p className="text-sm text-zinc-500 font-medium">
                  Manage global parameters and platform-wide defaults.
                </p>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-black h-11 px-8 shadow-lg shadow-zinc-500/20 dark:shadow-zinc-900/50 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? "SAVING..." : "SAVE CHANGES"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
              {/* Vertical Navigation Card */}
              <div className="space-y-4 sticky top-24">
                <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Settings Panels</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 flex flex-col gap-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "flex items-center gap-3 w-full p-3 rounded-xl transition-all group relative overflow-hidden",
                          activeTab === item.id 
                            ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md" 
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0 transition-transform", activeTab === item.id ? "scale-110" : "group-hover:scale-110")} />
                        <div className="flex flex-col items-start min-w-0">
                          <span className="text-xs font-black uppercase tracking-tight truncate w-full">{item.label}</span>
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-widest truncate w-full",
                            activeTab === item.id ? "opacity-70" : "text-zinc-400"
                          )}>
                            {item.description}
                          </span>
                        </div>
                        {activeTab === item.id && (
                          <div className="absolute right-3">
                            <ChevronRight className="h-3 w-3 opacity-50" />
                          </div>
                        )}
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-emerald-100/50 dark:border-emerald-900/20 shadow-sm bg-emerald-50/30 dark:bg-emerald-950/10 transition-all hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Security Integrity</span>
                      <span className="text-[9px] font-bold text-emerald-600/70 dark:text-emerald-500/50 uppercase italic tracking-tighter">Encrypted & Secure</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Settings Content Area */}
              <div className="space-y-6 min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === "GENERAL" && (
                  <div className="space-y-6">
                    <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 group">
                      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/30 p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center gap-4">
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Monitor className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-lg font-black uppercase tracking-tight italic">Platform Information</CardTitle>
                          <CardDescription className="text-xs font-medium tracking-tight">Core identifiers and contact points.</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Site Name</Label>
                            <Input 
                              defaultValue="Babybib - Smart Book Management" 
                              className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900 border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Platform Tagline</Label>
                            <Input 
                              defaultValue="Automated Bibliographic Extraction" 
                              className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900 border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium text-sm italic"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Support Email</Label>
                            <Input 
                              defaultValue="support@babybib.com" 
                              className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900 border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Docs URL</Label>
                            <Input 
                              defaultValue="https://docs.babybib.com" 
                              className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900 border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium text-sm"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm bg-zinc-900 text-white overflow-hidden relative group">
                      <div className="absolute right-0 bottom-0 p-8 opacity-10 rotate-12 translate-x-4 translate-y-4">
                        <Globe2 className="h-32 w-32" />
                      </div>
                      <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-white/20 text-white border-none w-fit text-[8px] font-black uppercase tracking-[0.2em] mb-1">Global Environment</Badge>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">Regional & Localization</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Default Language</span>
                              <span className="text-sm font-bold">Thai (TH-th)</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Timezone</span>
                              <span className="text-sm font-bold">Asia/Bangkok (GMT+7)</span>
                            </div>
                          </div>
                        </div>
                        <Button className="h-11 bg-white text-zinc-900 hover:bg-zinc-200 transition-colors font-black uppercase tracking-widest text-[10px] rounded-xl px-8 border-none shrink-0 group-hover:scale-105 transition-all">
                          Manage Regions
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "APPEARANCE" && (
                  <div className="space-y-6">
                    <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 group">
                      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/30 p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center gap-4">
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Type className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-lg font-black uppercase tracking-tight italic">Typography & Font-Face</CardTitle>
                          <CardDescription className="text-xs font-medium tracking-tight">Managing Thai and English font families.</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-8">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 group/item hover:border-emerald-500/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center font-black text-lg shadow-sm">กข</div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black uppercase tracking-tight">Anuphan Thai Font</span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">Optimized for legibility</span>
                            </div>
                          </div>
                          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase h-8 px-4 rounded-lg">ACTIVE</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Headings Weight</Label>
                             <div className="flex items-center gap-1">
                                {[300, 400, 500, 600, 700, 800, 900].map((w) => (
                                  <button key={w} className={cn("flex-1 h-8 rounded-lg text-[9px] font-black border transition-all", w === 900 ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-md" : "bg-white dark:bg-zinc-950 text-zinc-400 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300")}>
                                    {w}
                                  </button>
                                ))}
                             </div>
                           </div>
                           <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Body Line Height</Label>
                             <div className="flex items-center gap-2 h-8 px-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                               <div className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 w-[60%]"></div>
                               </div>
                               <span className="text-[10px] font-black text-zinc-900 dark:text-white tabular-nums">1.6</span>
                             </div>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "AI" && (
                  <div className="space-y-6">
                    <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 group">
                      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/30 p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center gap-4">
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Bot className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-lg font-black uppercase tracking-tight italic">AI Extraction Engine</CardTitle>
                          <CardDescription className="text-xs font-medium tracking-tight">Global model configurations and providers.</CardDescription>
                        </div>
                        <Badge className="ml-auto bg-purple-50 text-purple-600 border-none font-black text-[10px] uppercase h-7 px-3 rounded-lg shadow-sm">SMART Mode</Badge>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                           <div className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-black uppercase tracking-tight">Primary AI Model</span>
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">GPT-4o (Omni)</span>
                                 </div>
                              </div>
                              <Button variant="outline" className="rounded-lg h-9 font-black text-[10px] uppercase tracking-widest border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all px-4">Change Model</Button>
                           </div>

                           <div className="p-6 space-y-4">
                              <div className="flex items-center justify-between">
                                 <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-black uppercase tracking-tight">Extraction Provider</span>
                                    <span className="text-[10px] text-zinc-500 font-medium">Automatic fallback handling enabled</span>
                                 </div>
                                 <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                                    <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 text-[10px] font-black text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700">OPENAI</button>
                                    <button className="px-3 py-1.5 rounded-lg text-[10px] font-black text-zinc-400 hover:text-zinc-600 transition-colors">ANTHROPIC</button>
                                    <button className="px-3 py-1.5 rounded-lg text-[10px] font-black text-zinc-400 hover:text-zinc-600 transition-colors">GEMINI</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm transition-all hover:shadow-md">
                           <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="h-9 w-9 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-orange-500" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-tight">AI Temperature</span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Balanced (0.7)</span>
                                 </div>
                              </div>
                              <div className="h-1.5 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-orange-500 w-[70%]" />
                              </div>
                           </CardContent>
                        </Card>
                        <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm transition-all hover:shadow-md">
                           <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                                    <RefreshCw className="h-4 w-4 text-blue-500" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-tight">Smart Retries</span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Enabled (3 max)</span>
                                 </div>
                              </div>
                              <div className="h-6 w-10 bg-emerald-500 rounded-full flex items-center justify-end px-1 border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-pointer">
                                 <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                              </div>
                           </CardContent>
                        </Card>
                    </div>
                  </div>
                )}

                {activeTab === "BIBLIO" && (
                  <div className="space-y-6">
                    <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 group">
                      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/30 p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center gap-4">
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Layers className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-lg font-black uppercase tracking-tight italic">Bibliographic Logic</CardTitle>
                          <CardDescription className="text-xs font-medium tracking-tight">Search providers and default citation styles.</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-8">
                         <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Enabled Search Providers</Label>
                            <div className="grid md:grid-cols-3 gap-4">
                               {[
                                 { name: "Google Books", icon: Globe, active: true },
                                 { name: "ThaiLIS", icon: Database, active: true },
                                 { name: "Crossref DOI", icon: SearchCode, active: false }
                               ].map((provider) => (
                                 <div key={provider.name} className={cn(
                                   "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden group/card",
                                   provider.active 
                                     ? "border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/30 dark:bg-indigo-950/20" 
                                     : "border-zinc-100 bg-white dark:bg-zinc-950 dark:border-zinc-800 opacity-60 grayscale hover:grayscale-0"
                                 )}>
                                    <div className="flex items-center justify-between">
                                       <div className={cn("p-2 rounded-xl transition-colors", provider.active ? "bg-white dark:bg-zinc-900 text-indigo-500 shadow-sm" : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400")}>
                                          <provider.icon className="h-4 w-4" />
                                       </div>
                                       {provider.active && <Check className="h-4 w-4 text-indigo-600" />}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-tight">{provider.name}</span>
                                    {provider.active && <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500/50" />}
                                 </div>
                               ))}
                            </div>
                         </div>
                         
                         <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                           <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                 <span className="text-sm font-black uppercase tracking-tight">Default Citation Format</span>
                                 <span className="text-[10px] text-zinc-500 font-medium">Applied to all new projects by default.</span>
                              </div>
                              <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-x-auto no-scrollbar">
                                 {["APA 7", "MLA 9", "VANCOUVER", "HARVARD"].map((fmt) => (
                                   <button key={fmt} className={cn("px-3 py-1.5 rounded-lg text-[9px] font-black transition-all whitespace-nowrap", fmt === "APA 7" ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300")}>
                                     {fmt}
                                   </button>
                                 ))}
                              </div>
                           </div>
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "ADVANCED" && (
                  <div className="space-y-6">
                    <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 group">
                      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/30 p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center gap-4">
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Terminal className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-lg font-black uppercase tracking-tight italic">Advanced & Critical</CardTitle>
                          <CardDescription className="text-xs font-medium tracking-tight">System-level controls and maintenance tools.</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-8">
                         <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-rose-300/50 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center">
                                  <Activity className="h-5 w-5 text-rose-500" />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-sm font-black uppercase tracking-tight text-rose-600">Maintenance Mode</span>
                                  <span className="text-[10px] text-zinc-500 font-medium">Temporarily disable public access.</span>
                               </div>
                            </div>
                            <Button variant="ghost" className="rounded-lg h-9 font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-rose-500 transition-colors px-6 border border-zinc-200 dark:border-zinc-800 hover:border-rose-500/20">Enable Now</Button>
                         </div>

                         <div className="grid md:grid-cols-2 gap-4">
                            <Button variant="outline" className="h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 font-black text-xs uppercase tracking-tight flex items-center justify-start gap-3 px-6 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                               <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                  <RefreshCw className="h-4 w-4 text-zinc-500" />
                               </div>
                               <span>Clear Extraction Cache</span>
                            </Button>
                            <Button variant="outline" className="h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 font-black text-xs uppercase tracking-tight flex items-center justify-start gap-3 px-6 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                               <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                  <HardDrive className="h-4 w-4 text-zinc-500" />
                               </div>
                               <span>Re-index Database</span>
                            </Button>
                         </div>
                      </CardContent>
                    </Card>

                    <Card className="border-rose-100 dark:border-rose-950/30 shadow-sm bg-rose-50/20 dark:bg-rose-950/5">
                       <CardContent className="p-6 flex items-start gap-4">
                          <AlertCircle className="h-5 w-5 text-rose-500 mt-1 shrink-0" />
                          <div className="space-y-4 flex-1">
                             <div className="flex flex-col gap-1">
                                <span className="text-sm font-black uppercase tracking-tight text-rose-700 dark:text-rose-400">Danger Zone Operations</span>
                                <span className="text-xs text-zinc-500 font-medium leading-relaxed">
                                   Actions in this panel can cause significant data loss or system downtime. Ensure you have a recent snapshot of the database before proceeding with structural maintenance.
                                </span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Button className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-[9px] rounded-lg h-9 px-6 border-none shadow-lg shadow-rose-500/20 transition-all active:scale-95">Purge History</Button>
                                <Button variant="ghost" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-bold uppercase tracking-widest text-[9px] h-9">System Export</Button>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function ShieldCheck(props: any) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function AlertCircle(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}
