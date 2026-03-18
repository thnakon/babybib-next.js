"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Database,
  Bot,
  FileText,
  Settings2,
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  ChevronsUpDown,
  ShieldCheck,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/animate-ui/components/radix/sidebar"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NextImage from "next/image"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: LayoutDashboard,
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashbord",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Subscriptions",
          url: "/admin/subscriptions",
        },
        {
          title: "Support Tickets",
          url: "/admin/support",
        },
      ],
    },
    {
      title: "Master Data",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Citations",
          url: "/admin/citations",
        },
        {
          title: "User Projects",
          url: "/admin/projects",
        },
      ],
    },
    {
      title: "AI & Technical",
      url: "/admin/models",
      icon: Bot,
      items: [
        {
          title: "Extraction Models",
          url: "/admin/models",
        },
        {
          title: "API Configurations",
          url: "/admin/api-keys",
        },
      ],
    },
  ],
  system: [
    {
      name: "System Logs",
      url: "/admin/logs",
      icon: FileText,
    },
    {
      name: "Database Backup",
      url: "/admin/backup",
      icon: Database,
    },
    {
      name: "General Settings",
      url: "/admin/settings",
      icon: Settings2,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const normalizedPathname = pathname?.replace(/\/$/, '') || ''
  
  // Debug to see if path matches correctly
  React.useEffect(() => {
    console.log("DEBUG AdminSidebar:", {
      pathname,
      normalizedPathname,
    });
  }, [pathname, normalizedPathname]);

  return (
    <Sidebar collapsible="icon" value={normalizedPathname} animateOnHover={true} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="group-data-[state=collapsed]:p-0" value="brand">
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent shrink-0">
                  <NextImage 
                    src="/logo.png" 
                    alt="Babybib Logo" 
                    width={24} 
                    height={24} 
                    className="object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[state=collapsed]:hidden">
                  <span className="truncate font-semibold text-zinc-900 dark:text-white">Babybib Inc</span>
                  <span className="truncate text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const itemUrl = (item.url || '').replace(/\/$/, '');
              const subItems = item.items || [];
              const activeSubItem = subItems.find(sub => (sub.url || '').replace(/\/$/, '') === normalizedPathname);
              const isChildActive = !!activeSubItem;
              
              // Parent is ONLY active if its own URL matches AND it's not just a placeholder
              const isActive = itemUrl !== '#' && itemUrl !== '' && normalizedPathname === itemUrl;
              
              // The value should ONLY match normalizedPathname if it is the intended active item
              // If a child is active, the parent's value should be its title to avoid double highlight
              const activeValue = isActive ? itemUrl : item.title;
              
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={isActive}
                    value={activeValue}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {subItems.length ? (
                    <SidebarMenuSub>
                      {subItems.map((subItem) => {
                        const subUrl = (subItem.url || '').replace(/\/$/, '');
                        const isSubActive = normalizedPathname === subUrl;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild
                              isActive={isSubActive}
                              value={subUrl}
                            >
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            {data.system.map((item) => {
              const systemUrl = (item.url || '').replace(/\/$/, '');
              const isActive = normalizedPathname === systemUrl;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive}
                    value={systemUrl}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                id="user-menu-trigger"
                render={
                  <SidebarMenuButton
                    id="admin-sidebar-footer-button"
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    value="user-menu"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                      <AvatarFallback className="rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-black uppercase">
                        {user?.name?.substring(0, 2) || "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || "Admin"}</span>
                      <span className="truncate text-xs text-zinc-500">{user?.email || "admin@babybib.com"}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-zinc-400" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                        <AvatarFallback className="rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-black uppercase">
                          {user?.name?.substring(0, 2) || "AD"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.name || "Admin"}</span>
                        <span className="truncate text-xs text-zinc-500">{user?.email || "admin@babybib.com"}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded-md">
                    <BadgeCheck className="mr-2 size-4" />
                    <span className="font-medium">Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded-md">
                    <CreditCard className="mr-2 size-4" />
                    <span className="font-medium">Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded-md">
                    <Bell className="mr-2 size-4" />
                    <span className="font-medium">Notifications</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer rounded-md"
                >
                  <LogOut className="mr-2 size-4" />
                  <span className="font-bold">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
