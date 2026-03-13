"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  PieChart,
  LogOut,
  ChevronRight,
  Search,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarInset,
} from "@/components/animate-ui/components/radix/sidebar"
import Image from "next/image"
import { signOut } from "next-auth/react"

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2.5 px-3 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white shadow-lg overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="Babybib Logo" 
                width={24} 
                height={24} 
                className="object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white truncate">
                Babybib Admin
              </span>
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                v1.0.0
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton id="dashboard-btn" tooltip="Dashboard" isActive>
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton id="users-btn" tooltip="Users">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton id="citations-btn" tooltip="Citations">
                <FileText className="h-4 w-4" />
                <span>Citations</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton id="analytics-btn" tooltip="Analytics">
                <PieChart className="h-4 w-4" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton id="settings-btn" tooltip="Settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                id="logout-btn"
                tooltip="Logout" 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <h1 className="text-sm font-medium">Dashboard Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="h-8 w-64 rounded-lg bg-zinc-100 dark:bg-zinc-900 pl-8 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#407bc4]"
              />
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#407bc4] to-[#f58e58]" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
