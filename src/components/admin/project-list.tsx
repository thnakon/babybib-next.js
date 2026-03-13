"use client"

import * as React from "react"
import { 
  Projector, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  Loader2,
  AlertTriangle,
  Mail,
  FileText,
  Calendar,
  Archive,
  Settings,
  Check,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { adminDeleteProjectAction, adminUpdateProjectAction, adminGetProjectCitationsAction } from "@/app/actions/admin"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"

interface ProjectListProps {
  initialProjects: any[]
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const { data: session } = useSession()
  const [projects, setProjects] = React.useState(initialProjects)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [ownerFilter, setOwnerFilter] = React.useState<string>("ALL")
  const [isPending, setIsPending] = React.useState(false)
  
  // Selection & Dialog states
  const [selectedProject, setSelectedProject] = React.useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isContentViewOpen, setIsContentViewOpen] = React.useState(false)
  const [projectCitations, setProjectCitations] = React.useState<any[]>([])
  const [isLoadingCitations, setIsLoadingCitations] = React.useState(false)
  const [confirmAdminName, setConfirmAdminName] = React.useState("")

  // Edit form state
  const [editName, setEditName] = React.useState("")
  const [editDescription, setEditDescription] = React.useState("")
  const [editArchived, setEditArchived] = React.useState(false)

  const owners = React.useMemo(() => {
    const uniqueOwners = Array.from(new Set(projects.map(p => p.user?.username))).filter(Boolean)
    return uniqueOwners.sort()
  }, [projects])

  const filteredProjects = React.useMemo(() => {
    return projects.filter((p) => {
      const search = searchTerm.toLowerCase()
      const matchesSearch = (
        p.name?.toLowerCase().includes(search) ||
        p.user?.username?.toLowerCase().includes(search) ||
        p.user?.email?.toLowerCase().includes(search)
      )
      
      const matchesStatus = statusFilter === "ALL" || 
        (statusFilter === "ACTIVE" && !p.isArchived) || 
        (statusFilter === "ARCHIVED" && p.isArchived)
        
      const matchesOwner = ownerFilter === "ALL" || p.user?.username === ownerFilter
      
      return matchesSearch && matchesStatus && matchesOwner
    })
  }, [projects, searchTerm, statusFilter, ownerFilter])

  const handleDelete = async () => {
    if (!selectedProject || confirmAdminName !== session?.user?.name) {
      toast.error("Admin name mismatch")
      return
    }

    setIsPending(true)
    try {
      const result = await adminDeleteProjectAction(selectedProject.id)
      if (result.success) {
        setProjects(projects.filter((p) => p.id !== selectedProject.id))
        toast.success("Project deleted successfully")
        setIsDeleteDialogOpen(false)
        setConfirmAdminName("")
      }
    } catch (error) {
      toast.error("Failed to delete project")
    } finally {
      setIsPending(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedProject) return

    setIsPending(true)
    try {
      const data = {
        name: editName,
        description: editDescription,
        isArchived: editArchived
      }
      const result = await adminUpdateProjectAction(selectedProject.id, data)
      if (result.success) {
        setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...data } : p))
        toast.success("Project updated successfully")
        setIsEditDialogOpen(false)
      }
    } catch (error) {
      toast.error("Failed to update project")
    } finally {
      setIsPending(false)
    }
  }

  const handleViewContents = async (project: any) => {
    setSelectedProject(project)
    setIsContentViewOpen(true)
    setIsLoadingCitations(true)
    setProjectCitations([])
    try {
      const result = await adminGetProjectCitationsAction(project.id)
      if (result.success) {
        setProjectCitations(result.citations)
      }
    } catch (error) {
      toast.error("Failed to fetch citations")
    } finally {
      setIsLoadingCitations(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search projects..."
              className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl h-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">Status:</span>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
              <SelectTrigger id="status-filter" className="w-[120px] rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 !h-8 shadow-none text-xs font-bold">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                <SelectItem value="ALL" className="text-xs font-bold">All Status</SelectItem>
                <SelectItem value="ACTIVE" className="text-xs font-bold">Active</SelectItem>
                <SelectItem value="ARCHIVED" className="text-xs font-bold">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">Owner:</span>
            <Select value={ownerFilter} onValueChange={(val) => setOwnerFilter(val || "ALL")}>
              <SelectTrigger id="owner-filter" className="w-[150px] rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 !h-8 shadow-none text-xs font-bold">
                <SelectValue placeholder="All Owners" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                <SelectItem value="ALL" className="text-xs font-bold">All Owners</SelectItem>
                {owners.map(owner => (
                  <SelectItem key={owner} value={owner} className="text-xs font-bold">{owner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-none font-bold py-1 px-3">
          {filteredProjects.length} Projects
        </Badge>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Project Info</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Owner</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Stats</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredProjects.map((project) => (
              <TableRow key={project.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                      style={{ backgroundColor: `${project.color}15`, color: project.color }}
                    >
                      <Projector className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {project.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      {project.user?.username}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-bold uppercase tracking-tight">
                      <Mail className="h-3 w-3" />
                      {project.user?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-bold">{project._count?.citations || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {project.isArchived ? (
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 border-none">
                      <Archive className="h-2.5 w-2.5 mr-1" /> Archived
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-none">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                      )}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">Admin Oversight</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer font-medium text-sm"
                          onClick={() => handleViewContents(project)}
                        >
                          <Eye className="h-4 w-4" /> View Contents
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer font-medium text-sm"
                          onClick={() => {
                            setSelectedProject(project)
                            setEditName(project.name || "")
                            setEditDescription(project.description || "")
                            setEditArchived(project.isArchived || false)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Settings className="h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer font-medium text-sm text-red-500 focus:text-red-500"
                          onClick={() => {
                            setSelectedProject(project)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" /> Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isContentViewOpen} onOpenChange={setIsContentViewOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="h-14 w-14 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-sm"
                style={{ backgroundColor: `${selectedProject?.color}20`, color: selectedProject?.color }}
              >
                <Projector className="h-7 w-7" />
              </div>
              <div className="flex flex-col text-left">
                <DialogTitle className="text-xl font-bold">Project Contents Overview</DialogTitle>
                <DialogDescription className="text-xs font-medium text-zinc-500">
                  Managing information for project: <span className="text-zinc-900 dark:text-zinc-100 font-bold">{selectedProject?.name}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Items</span>
                <span className="text-lg font-bold">{projectCitations.length} Citations</span>
              </div>
              <Badge variant="outline" className="h-8 px-4 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold uppercase text-[10px] tracking-widest bg-zinc-50 dark:bg-zinc-900/50">
                Live Overview
              </Badge>
            </div>
            
            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
              <div className="max-h-[300px] overflow-y-auto">
                {isLoadingCitations ? (
                  <div className="h-40 flex flex-col items-center justify-center gap-3 text-zinc-400">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="font-bold text-xs uppercase tracking-widest">Fetching data...</span>
                  </div>
                ) : projectCitations.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center gap-2 text-zinc-400 grayscale opacity-50">
                    <Archive className="h-10 w-10" />
                    <span className="font-black text-sm uppercase tracking-widest">No citations found</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50 dark:bg-zinc-900 border-none">
                        <TableHead className="text-[10px] font-black uppercase tracking-widest px-4">Title / Type</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest px-4">Year</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest px-4">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectCitations.map((cit) => (
                        <TableRow key={cit.id} className="border-zinc-50 dark:border-zinc-900">
                          <TableCell className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{cit.title || "Untitled"}</span>
                              <span className="text-[9px] font-black uppercase text-blue-500 tracking-tighter">{cit.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs font-medium text-zinc-500">{cit.year || "-"}</TableCell>
                          <TableCell className="px-4 py-3 text-xs font-medium text-zinc-500 max-w-[200px] truncate">{cit.source || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-6">
             <Button 
               variant="outline" 
               className="w-full h-11 rounded-xl font-bold" 
               onClick={() => setIsContentViewOpen(false)}
             >
               Close Overview
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="h-14 w-14 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-sm"
                style={{ backgroundColor: `${selectedProject?.color}20`, color: selectedProject?.color }}
              >
                <Projector className="h-7 w-7" />
              </div>
              <div className="flex flex-col text-left">
                <DialogTitle className="text-xl font-bold">Edit Project Details</DialogTitle>
                <DialogDescription className="text-xs font-medium text-zinc-500">
                  Review and manage detailed information for administrative corrections
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Project Name</Label>
                <Input 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900/50 border-none focus-visible:ring-2 focus-visible:ring-emerald-500 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Description (Optional)</Label>
                <Input 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900/50 border-none focus-visible:ring-2 focus-visible:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">Archive Status</Label>
                  <Button 
                    variant={editArchived ? "default" : "outline"}
                    size="sm"
                    className={cn("h-8 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest px-3", editArchived ? "bg-orange-500 hover:bg-orange-600 text-white border-none" : "")}
                    onClick={() => setEditArchived(!editArchived)}
                  >
                    {editArchived ? <><Check className="h-3 w-3 mr-1" /> Archived</> : <><X className="h-3 w-3 mr-1" /> Active</>}
                  </Button>
                </div>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                   <p className="text-[10px] text-zinc-500 font-medium">When archived, this project will be hidden from the user&apos;s active workspace.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Project Owner</Label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 opacity-60">
                   <Mail className="h-4 w-4 text-zinc-400" />
                   <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{selectedProject?.user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-xl font-bold h-11 flex-1"
            >
              Cancel
            </Button>
            <Button 
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-black h-11 flex-1 px-8"
              onClick={handleUpdate}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl">Confirm Project Deletion</DialogTitle>
            <DialogDescription className="text-center pt-2 text-zinc-500">
              Are you sure you want to delete <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedProject?.name}</span>? This will permanently remove all citations within this project for user <span className="font-bold">{selectedProject?.user?.username}</span>.
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                <Label className="text-red-800 dark:text-red-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Confirm with your admin username:</Label>
                <Input 
                  placeholder={session?.user?.name || "Admin Name"}
                  className="bg-white dark:bg-zinc-900 border-red-200 dark:border-red-900 focus-visible:ring-red-500 h-11 rounded-xl font-black"
                  value={confirmAdminName}
                  onChange={(e) => setConfirmAdminName(e.target.value)}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setConfirmAdminName("")
              }}
              className="rounded-xl font-bold h-11 flex-1"
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold h-11 flex-1 shadow-lg shadow-red-500/20"
              onClick={handleDelete}
              disabled={isPending || confirmAdminName !== session?.user?.name}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
