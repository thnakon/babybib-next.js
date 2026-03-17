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
  MoreHorizontal,
  Eye,
  Trash2,
  Loader2,
  Key
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuGroup,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { adminDeleteLogAction } from "@/app/actions/admin"

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
  const { data: session } = useSession()
  const [logs, setLogs] = React.useState(initialLogs)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")

  // Modal states
  const [selectedLog, setSelectedLog] = React.useState<LogEntry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [confirmAdminName, setConfirmAdminName] = React.useState("")

  const filteredLogs = React.useMemo(() => {
    return logs.filter(log => {
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
  }, [searchTerm, categoryFilter, statusFilter, startDate, endDate, logs])

  const handleDelete = async () => {
    if (!selectedLog) return
    if (confirmAdminName !== session?.user?.name) {
      toast.error("Admin name mismatch")
      return
    }

    setIsDeleting(true)
    try {
      const result = await adminDeleteLogAction(selectedLog.id)
      if (result.success) {
        setLogs(logs.filter(l => l.id !== selectedLog.id))
        toast.success("Audit log entry deleted successfully")
        setIsDeleteDialogOpen(false)
        setConfirmAdminName("")
      }
    } catch (error) {
      toast.error("Failed to delete audit log")
    } finally {
      setIsDeleting(false)
    }
  }

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
            <Input
              id="log-search-input"
              placeholder="Search activity logs..."
              className="pl-9 bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 rounded-xl h-8.5 text-xs focus-visible:ring-1 focus-visible:ring-zinc-500/30 focus-visible:border-zinc-500/30 transition-all shadow-none outline-none"
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
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none focus-visible:ring-0 ml-auto">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Log Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer font-medium text-sm"
                            onClick={() => {
                              setSelectedLog(log)
                              setIsDetailOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer font-medium text-sm text-red-500 focus:text-red-500"
                            onClick={() => {
                              setSelectedLog(log)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" /> Delete Log
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Log Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-2.5 rounded-xl",
                selectedLog?.status === "SUCCESS" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
                selectedLog?.status === "WARNING" && "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400",
                selectedLog?.status === "CRITICAL" && "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400",
                selectedLog?.status === "INFO" && "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
              )}>
                {selectedLog ? getStatusIcon(selectedLog.status) : null}
              </div>
              <div className="flex flex-col text-left">
                <DialogTitle className="text-xl font-bold">Event Log Transaction</DialogTitle>
                <DialogDescription className="text-xs font-medium text-zinc-500">
                  Full auditing trace for <span className="text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-tight">LOG-{selectedLog?.id}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Action</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">{selectedLog?.action}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Timestamp</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedLog ? new Date(selectedLog.createdAt).toLocaleString() : ""}
                </p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">IP Address</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{selectedLog?.ipAddress || "Internal System"}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Initiator</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{selectedLog?.user?.email || "System/Automated"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payload Details</span>
              <pre className="p-4 rounded-xl bg-zinc-900 text-zinc-100 text-[11px] font-mono overflow-auto max-h-[250px] border border-zinc-800 shadow-inner leading-relaxed">
                {selectedLog?.details ? (
                  (() => {
                    try {
                      return selectedLog?.details ? JSON.stringify(JSON.parse(selectedLog.details), null, 2) : ""
                    } catch {
                      return selectedLog?.details || ""
                    }
                  })()
                ) : "No auxiliary details available for this event."}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="rounded-xl font-bold h-10 border-zinc-200 dark:border-zinc-800">
              Close Trace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 rounded-2xl">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">Delete Audit Log Entry?</DialogTitle>
            <DialogDescription className="text-center text-sm pt-2">
              This action is irreversible. It will permanently remove 
              <span className="block font-bold text-zinc-900 dark:text-zinc-100 mt-1 uppercase tracking-tighter">LOG-{selectedLog?.id}: {selectedLog?.action}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Confirm with administrator name</label>
              <div className="relative group">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-red-500 transition-colors" />
                <Input 
                  placeholder={session?.user?.name || "Type admin name"} 
                  className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 rounded-xl focus-visible:ring-red-500/20 focus-visible:border-red-500/50"
                  value={confirmAdminName}
                  onChange={(e) => setConfirmAdminName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setConfirmAdminName("")
              }}
              className="flex-1 rounded-xl font-bold h-11 text-zinc-500"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting || confirmAdminName !== (session?.user?.name || "")}
              className="flex-1 rounded-xl font-bold h-11 shadow-lg shadow-red-500/20"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Deletion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
