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
  Archive
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
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { adminDeleteProjectAction } from "@/app/actions/admin"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProjectListProps {
  initialProjects: any[]
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const [projects, setProjects] = React.useState(initialProjects)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isPending, setIsPending] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  const filteredProjects = React.useMemo(() => {
    return projects.filter((p) => {
      const search = searchTerm.toLowerCase()
      return (
        p.name?.toLowerCase().includes(search) ||
        p.user?.username?.toLowerCase().includes(search) ||
        p.user?.email?.toLowerCase().includes(search)
      )
    })
  }, [projects, searchTerm])

  const handleDelete = async () => {
    if (!selectedProject) return

    setIsPending(true)
    try {
      const result = await adminDeleteProjectAction(selectedProject.id)
      if (result.success) {
        setProjects(projects.filter((p) => p.id !== selectedProject.id))
        toast.success("Project deleted successfully")
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      toast.error("Failed to delete project")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-sm:w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search projects or owners..."
            className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-none font-bold py-1 px-3 h-10">
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
                        <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-sm">
                          <Eye className="h-4 w-4" /> View Contents
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl">Confirm Project Deletion</DialogTitle>
            <DialogDescription className="text-center pt-2 text-zinc-500">
              Are you sure you want to delete <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedProject?.name}</span>? This will permanently remove all citations within this project for user <span className="font-bold">{selectedProject?.user?.username}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl font-bold h-11 flex-1"
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold h-11 flex-1 shadow-lg shadow-red-500/20"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
