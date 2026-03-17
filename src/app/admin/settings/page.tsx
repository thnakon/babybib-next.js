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
  AlertCircle
} from "lucide-react"
import { AdminSearch } from "@/components/admin/admin-search"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function AdminSettingsPage() {
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
                  <BreadcrumbPage>System Configuration</BreadcrumbPage>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">System Configuration</h1>
                  <p className="text-xs text-zinc-500 font-medium">
                    Manage global platform parameters and environment variables.
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="md:w-32 rounded-xl font-bold h-10 shadow-sm"
            >
              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="grid gap-6 max-w-4xl">
            {/* General Settings */}
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-zinc-500" />
                  <CardTitle className="text-sm font-bold">Platform Information</CardTitle>
                </div>
                <CardDescription className="text-xs">Core identifiers and contact points.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Site Name</Label>
                    <Input defaultValue="Babybib - Smart Book Management" className="rounded-xl h-9 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Support Email</Label>
                    <Input defaultValue="support@babybib.com" className="rounded-xl h-9 text-xs" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Settings */}
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-zinc-500" />
                  <CardTitle className="text-sm font-bold">AI & Extraction</CardTitle>
                </div>
                <CardDescription className="text-xs">Configure AI model and extraction providers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Primary AI Model</Label>
                    <Input defaultValue="GPT-4o (Omni)" className="rounded-xl h-9 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Provider</Label>
                    <Input defaultValue="OpenAI" className="rounded-xl h-9 text-xs" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bibliographic Settings */}
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-zinc-500" />
                  <CardTitle className="text-sm font-bold">Bibliographic Engine</CardTitle>
                </div>
                <CardDescription className="text-xs">Default citation styles and metadata behavior.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Default Citation Style</Label>
                    <Input defaultValue="APA 7" className="rounded-xl h-9 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500">Language Fallback</Label>
                    <Input defaultValue="Thai (TH-th)" className="rounded-xl h-9 text-xs" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-zinc-500" />
                  <CardTitle className="text-sm font-bold">Appearance Controls</CardTitle>
                </div>
                <CardDescription className="text-xs">Manage fonts and global UI behaviors.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center font-bold text-xs ring-1 ring-zinc-200 dark:ring-zinc-700">กข</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Anuphan Thai Font</span>
                        <span className="text-[10px] text-zinc-500 font-medium">Optimized Thai readability</span>
                      </div>
                   </div>
                   <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] uppercase h-6">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card className="border-zinc-100 dark:border-zinc-800/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-zinc-500" />
                  <CardTitle className="text-sm font-bold">System Maintenance</CardTitle>
                </div>
                <CardDescription className="text-xs">Critical operations and environment controls.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Maintenance Mode</span>
                      <span className="text-[10px] text-zinc-500">Temporarily disable public access</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-bold text-zinc-400">Disabled</Badge>
                  </div>
                  <Separator className="bg-zinc-100 dark:bg-zinc-800/50" />
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-tight">Clear Extraction Cache</Button>
                    <Button variant="outline" className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-tight">Re-index Search Data</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/20 flex items-start gap-3">
               <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5" />
               <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Danger Zone Warning</span>
                  <p className="text-[10px] text-zinc-500 font-medium leading-normal">
                     Modifying system-level configurations can affect the entire platform's stability. Please handle with care.
                  </p>
               </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
