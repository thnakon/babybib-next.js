"use client"

import * as React from "react"
import { 
  Search, 
  Terminal, 
  User, 
  Shield, 
  Clock, 
  Database, 
  AlertCircle,
  CheckCircle2,
  Info,
  Calendar,
  Filter,
  MoreHorizontal
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface LogEntry {
  id: number
  action: string
  category: string
  status: string
  details: string | null
  userId: number | null
  ipAddress: string | null
  createdAt: string
  user: {
    username: string
    email: string
  } | null
}

export function LogList({ initialLogs }: { initialLogs: LogEntry[] }) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")

  const filteredLogs = React.useMemo(() => {
    return initialLogs.filter(log => {
      const logDate = new Date(log.createdAt).toISOString().split("T")[0]
      
      const matchesSearch = 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ipAddress || "").toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter
      const matchesStatus = statusFilter === "ALL" || log.status === statusFilter
      
      const matchesStartDate = !startDate || logDate >= startDate
      const matchesEndDate = !endDate || logDate <= endDate

      return matchesSearch && matchesCategory && matchesStatus && matchesStartDate && matchesEndDate
    })
  }, [searchTerm, categoryFilter, statusFilter, startDate, endDate, initialLogs])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS": return <CheckCircle2 className="h-3.5 w-3.5" />
      case "WARNING": return <AlertCircle className="h-3.5 w-3.5" />
      case "CRITICAL": return <AlertCircle className="h-3.5 w-3.5" />
      default: return <Info className="h-3.5 w-3.5" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AUTH": return <User className="h-3.5 w-3.5" />
      case "DATA": return <Database className="h-3.5 w-3.5" />
      case "SECURITY": return <Shield className="h-3.5 w-3.5" />
      default: return <Terminal className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              id="log-search-input"
              placeholder="Search activity logs..."
              className="pl-9 bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 rounded-xl h-8.5 text-xs focus-visible:ring-1 focus-visible:ring-purple-500/30 focus-visible:border-purple-500/30 transition-all shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap">Category</span>
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "ALL")}>
              <SelectTrigger id="category-filter-trigger" className="w-[130px] rounded-xl bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 !h-8.5 shadow-none text-[11px] font-semibold">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="AUTH">Authentication</SelectItem>
                <SelectItem value="DATA">Data Management</SelectItem>
                <SelectItem value="SECURITY">Security</SelectItem>
                <SelectItem value="SYSTEM">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap">Severity</span>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
              <SelectTrigger id="status-filter-trigger" className="w-[130px] rounded-xl bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 !h-8.5 shadow-none text-[11px] font-semibold">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SUCCESS" className="text-emerald-600">Success</SelectItem>
                <SelectItem value="WARNING" className="text-orange-600">Warning</SelectItem>
                <SelectItem value="CRITICAL" className="text-red-600">Critical</SelectItem>
                <SelectItem value="INFO" className="text-blue-600">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden xl:flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap">Range</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl">
              <input
                id="log-start-date-input"
                type="date"
                className="bg-transparent border-none outline-none text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 w-[100px] cursor-pointer"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <div className="w-1 h-[1px] bg-zinc-300 dark:bg-zinc-700" />
              <input
                id="log-end-date-input"
                type="date"
                className="bg-transparent border-none outline-none text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 w-[100px] cursor-pointer"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
              {filteredLogs.length} <span className="font-medium">Events Total</span>
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-[250px]">Event Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Initiator</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">LOG-{log.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      log.status === "SUCCESS" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
                      log.status === "WARNING" && "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400",
                      log.status === "CRITICAL" && "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 underline decoration-red-500/30 underline-offset-4",
                      log.status === "INFO" && "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
                    )}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 px-2 py-1 rounded-lg w-fit border border-zinc-100 dark:border-zinc-800/50">
                      {getCategoryIcon(log.category)}
                      {log.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        <User className="h-3 w-3" />
                        {log.user?.email || "System"}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight mt-0.5">{log.ipAddress || "Internal"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium" suppressHydrationWarning>
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                       <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4">
               <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-zinc-900 dark:text-zinc-100 font-bold">No results found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Adjust your filters or search term to discover more events.</p>
          </div>
        )}
      </div>

    </div>
  )
}
