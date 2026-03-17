"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  LayoutDashboard,
  Users,
  Database,
  Bot,
  FileText,
  Settings2,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  LifeBuoy,
  History,
  ArrowRight
} from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const adminRoutes = [
  {
    title: "Dashboard",
    description: "Platform activity and stats",
    url: "/admin/dashbord",
    icon: LayoutDashboard,
    category: "Overview",
  },
  {
    title: "Analytics",
    description: "Deep dive into platform data",
    url: "/admin/analytics",
    icon: TrendingUp,
    category: "Overview",
  },
  {
    title: "All Users",
    description: "Manage registered members",
    url: "/admin/users",
    icon: Users,
    category: "User Management",
  },
  {
    title: "Subscriptions",
    description: "Plans and billing status",
    url: "/admin/subscriptions",
    icon: CreditCard,
    category: "User Management",
  },
  {
    title: "Support Tickets",
    description: "Customer help requests",
    url: "/admin/support",
    icon: LifeBuoy,
    category: "User Management",
  },
  {
    title: "Citations",
    description: "Global bibliographic data",
    url: "/admin/citations",
    icon: Database,
    category: "Master Data",
  },
  {
    title: "User Projects",
    description: "Monitor research archives",
    url: "/admin/projects",
    icon: Database,
    category: "Master Data",
  },
  {
    title: "System Logs",
    description: "Technical audit trails",
    url: "/admin/logs",
    icon: FileText,
    category: "System",
  },
  {
    title: "Security Settings",
    description: "Hardening and audits",
    url: "/admin/security",
    icon: ShieldCheck,
    category: "System",
  },
  {
    title: "General Settings",
    description: "Core platform config",
    url: "/admin/settings",
    icon: Settings2,
    category: "System",
  },
]

export function AdminSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const filteredRoutes = React.useMemo(() => {
    if (!query) return adminRoutes
    return adminRoutes.filter((route) =>
      route.title.toLowerCase().includes(query.toLowerCase()) ||
      route.description.toLowerCase().includes(query.toLowerCase()) ||
      route.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const onSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative flex h-9 w-64 items-center gap-2 rounded-xl border border-zinc-200 bg-white/50 px-3 text-xs text-zinc-400 transition-all hover:bg-white hover:ring-1 hover:ring-zinc-500/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 shadow-sm outline-none focus:ring-1 focus:ring-zinc-500/30"
      >
        <Search className="h-3.5 w-3.5 group-hover:text-zinc-600 transition-colors" />
        <span className="flex-1 text-left">Search resources...</span>
        <div className="flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800">
          <span>⌘</span>
          <span>K</span>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-[550px] gap-0 border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 px-4">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <Input
              placeholder="Search administration..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 border-0 bg-transparent text-sm focus-visible:ring-0 shadow-none px-3"
              autoFocus
            />
          </div>
          
          <div className="max-h-[380px] overflow-y-auto p-2">
            {filteredRoutes.length > 0 ? (
              <div className="flex flex-col gap-1">
                {/* Categorize results */}
                {Object.entries(
                  filteredRoutes.reduce((acc, route) => {
                    const category = route.category;
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(route);
                    return acc;
                  }, {} as Record<string, typeof adminRoutes>)
                ).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-1">
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400/80">
                      {category}
                    </div>
                    {items.map((route) => (
                      <button
                        key={route.url}
                        onClick={() => onSelect(route.url)}
                        className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 text-zinc-500 group-hover:text-zinc-900 transition-colors ring-1 ring-zinc-100 dark:ring-zinc-800">
                            <route.icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              {route.title}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-medium">
                              {route.description}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-full mb-3 ring-1 ring-zinc-100 dark:ring-zinc-800">
                    <Search className="h-6 w-6 text-zinc-300" />
                </div>
                <p className="text-sm font-bold text-zinc-500">No results found for "{query}"</p>
                <p className="text-[10px] text-zinc-400 mt-1">Try searching for modules like "users" or "settings"</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2.5">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <kbd className="rounded bg-white dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 ring-1 ring-zinc-200 dark:ring-zinc-700 shadow-sm italic font-mono">↵</kbd>
                    <span className="text-[10px] font-medium text-zinc-400">to select</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <kbd className="rounded bg-white dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 ring-1 ring-zinc-200 dark:ring-zinc-700 shadow-sm italic font-mono">esc</kbd>
                    <span className="text-[10px] font-medium text-zinc-400">to close</span>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-zinc-400">Go to Page</span>
                <ArrowRight className="h-3 w-3 text-zinc-400" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
