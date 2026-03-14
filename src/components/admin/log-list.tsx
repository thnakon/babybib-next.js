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
  id: string
  event: string
  category: "AUTH" | "DATA" | "SYSTEM" | "SECURITY"
  status: "SUCCESS" | "WARNING" | "INFO" | "CRITICAL"
  user: string
  ip: string
  timestamp: string
}

const MOCK_LOGS: LogEntry[] = [
  {
    id: "LOG-001",
    event: "User Login Successful",
    category: "AUTH",
    status: "SUCCESS",
    user: "admin",
    ip: "192.168.1.1",
    timestamp: new Date().toISOString()
  },
  {
    id: "LOG-002",
    event: "Permanent Project Deletion",
    category: "DATA",
    status: "WARNING",
    user: "thnakon",
    ip: "172.16.0.45",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: "LOG-003",
    event: "Unauthorized API Access Attempt",
    category: "SECURITY",
    status: "CRITICAL",
    user: "Guest_942",
    ip: "45.12.33.102",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: "LOG-004",
    event: "System Cache Cleared",
    category: "SYSTEM",
    status: "INFO",
    user: "System",
    ip: "Locahost",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "LOG-005",
    event: "New Citation Created",
    category: "DATA",
    status: "SUCCESS",
    user: "alice_w",
    ip: "158.42.11.9",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
]

export function LogList() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")
  const [statusFilter, setStatusFilter] = React.useState("ALL")

  const filteredLogs = React.useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchesSearch = 
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter
      const matchesStatus = statusFilter === "ALL" || log.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, categoryFilter, statusFilter])

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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="log-search-input"
              placeholder="Search by event, user, or IP..."
              className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl h-9 text-sm focus-visible:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category:</span>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category-filter" className="w-[130px] rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 !h-8 shadow-none text-xs font-bold">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Categories</SelectItem>
                <SelectItem value="AUTH" className="text-xs font-bold">Authentication</SelectItem>
                <SelectItem value="DATA" className="text-xs font-bold">Data Management</SelectItem>
                <SelectItem value="SECURITY" className="text-xs font-bold">Security</SelectItem>
                <SelectItem value="SYSTEM" className="text-xs font-bold">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Severity:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="w-[130px] rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 !h-8 shadow-none text-xs font-bold">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL" className="text-xs font-bold">All Status</SelectItem>
                <SelectItem value="SUCCESS" className="text-xs font-bold text-emerald-600">Success</SelectItem>
                <SelectItem value="WARNING" className="text-xs font-bold text-orange-600">Warning</SelectItem>
                <SelectItem value="CRITICAL" className="text-xs font-bold text-red-600">Critical</SelectItem>
                <SelectItem value="INFO" className="text-xs font-bold text-blue-600">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-none font-bold py-1 px-3">
            {filteredLogs.length} Events Total
          </Badge>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-400">
             <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider w-[250px]">Event Description</th>
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Initiator</th>
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {log.event}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{log.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
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
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 px-2 py-1 rounded-lg w-fit border border-zinc-100 dark:border-zinc-800/50">
                      {getCategoryIcon(log.category)}
                      {log.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        <User className="h-3 w-3" />
                        {log.user}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">{log.ip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium" suppressHydrationWarning>
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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

      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">System Status Insight</span>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Global Live Activity Monitoring</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950" />
             ))}
           </div>
           <span className="text-[10px] text-zinc-400 font-bold">Live Stream Active</span>
        </div>
      </div>
    </div>
  )
}
