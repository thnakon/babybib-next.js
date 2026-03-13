"use client"

import * as React from "react"
import { 
  FileText, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  ExternalLink,
  Loader2,
  AlertTriangle,
  Mail,
  Projector,
  Settings
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { adminDeleteCitationAction, adminUpdateCitationAction } from "@/app/actions/admin"
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

interface CitationListProps {
  initialCitations: any[]
}

export function CitationList({ initialCitations }: CitationListProps) {
  const { data: session } = useSession()
  const [citations, setCitations] = React.useState(initialCitations)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL")
  const [projectFilter, setProjectFilter] = React.useState<string>("ALL")
  const [isPending, setIsPending] = React.useState(false)
  
  // Selection & Dialog states
  const [selectedCitation, setSelectedCitation] = React.useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)
  const [confirmAdminName, setConfirmAdminName] = React.useState("")

  // Edit form state
  const [editTitle, setEditTitle] = React.useState("")
  const [editSource, setEditSource] = React.useState("")
  const [editYear, setEditYear] = React.useState("")
  const [editUrl, setEditUrl] = React.useState("")

  const projects = React.useMemo(() => {
    const uniqueProjects = Array.from(new Set(citations.map(c => c.project?.name))).filter(Boolean)
    return uniqueProjects.sort()
  }, [citations])

  const types = React.useMemo(() => {
    const uniqueTypes = Array.from(new Set(citations.map(c => c.type))).filter(Boolean)
    return uniqueTypes.sort()
  }, [citations])

  const filteredCitations = React.useMemo(() => {
    return citations.filter((c) => {
      const search = searchTerm.toLowerCase()
      const matchesSearch = (
        c.title?.toLowerCase().includes(search) ||
        c.project?.name?.toLowerCase().includes(search) ||
        c.project?.user?.username?.toLowerCase().includes(search) ||
        c.project?.user?.email?.toLowerCase().includes(search) ||
        formatFullBibliography(c).toLowerCase().includes(search)
      )
      
      const matchesType = typeFilter === "ALL" || c.type === typeFilter
      const matchesProject = projectFilter === "ALL" || c.project?.name === projectFilter
      
      return matchesSearch && matchesType && matchesProject
    })
  }, [citations, searchTerm, typeFilter, projectFilter])

  function formatFullBibliography(c: any) {
    if (!c) return ""
    const authors = c.authors ? JSON.parse(c.authors) : []
    const authorStr = authors.map((a: any) => `${a.lastName}, ${a.firstName.charAt(0)}..`).join(", ")
    const yearStr = c.year ? `(${c.year}).` : ""
    const titleStr = c.title ? `${c.title}.` : ""
    const sourceStr = c.source ? `${c.source}.` : ""
    return `${authorStr} ${yearStr} ${titleStr} ${sourceStr}`.trim()
  }

  const handleDelete = async () => {
    if (!selectedCitation || confirmAdminName !== session?.user?.name) {
      toast.error("Admin name mismatch")
      return
    }

    setIsPending(true)
    try {
      const result = await adminDeleteCitationAction(selectedCitation.id)
      if (result.success) {
        setCitations(citations.filter((c) => c.id !== selectedCitation.id))
        toast.success("Citation deleted successfully")
        setIsDeleteDialogOpen(false)
        setConfirmAdminName("")
      }
    } catch (error) {
      toast.error("Failed to delete citation")
    } finally {
      setIsPending(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedCitation) return

    setIsPending(true)
    try {
      const data = {
        title: editTitle,
        source: editSource,
        year: editYear,
        url: editUrl
      }
      const result = await adminUpdateCitationAction(selectedCitation.id, data)
      if (result.success) {
        setCitations(citations.map(c => c.id === selectedCitation.id ? { ...c, ...data } : c))
        toast.success("Citation updated successfully")
        setIsEditDialogOpen(false)
      }
    } catch (error) {
      toast.error("Failed to update citation")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search citations..."
              className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl h-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">Type:</span>
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "ALL")}>
              <SelectTrigger id="type-filter" className="w-[130px] rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 !h-8 shadow-none text-xs font-bold">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                <SelectItem value="ALL" className="text-xs font-bold">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type} className="text-xs font-bold">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">Project:</span>
            <Select value={projectFilter} onValueChange={(val) => setProjectFilter(val || "ALL")}>
              <SelectTrigger id="project-filter" className="w-[150px] rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 !h-8 shadow-none text-xs font-bold">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                <SelectItem value="ALL" className="text-xs font-bold">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project} value={project} className="text-xs font-bold">{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-none font-bold py-1 px-3">
          {filteredCitations.length} Citations
        </Badge>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Citation Content</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Full Bibliography</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Project & Owner</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Type</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredCitations.map((citation) => (
              <TableRow key={citation.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                <TableCell className="px-6 py-4 max-w-[200px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {citation.title || "Untitled"}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded w-fit flex items-center gap-1">
                      <Mail className="h-2.5 w-2.5" />
                      {citation.project?.user?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 max-w-md">
                   <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/30 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                     {formatFullBibliography(citation)}
                   </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      <Projector className="h-3.5 w-3.5" />
                      {citation.project?.name}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">
                      <Mail className="h-3 w-3" />
                      {citation.project?.user?.username}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                    {citation.type}
                  </Badge>
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
                          onClick={() => {
                            setSelectedCitation(citation)
                            setIsPreviewOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" /> Quick Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer font-medium text-sm"
                          onClick={() => {
                            setSelectedCitation(citation)
                            setEditTitle(citation.title || "")
                            setEditSource(citation.source || "")
                            setEditYear(citation.year || "")
                            setEditUrl(citation.url || "")
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Settings className="h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        {citation.url && (
                          <DropdownMenuItem className="p-0">
                            <a 
                              href={citation.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 w-full px-1.5 py-1 font-medium text-sm"
                            >
                              <ExternalLink className="h-4 w-4" /> Open Source URL
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer font-medium text-sm text-red-500 focus:text-red-500"
                          onClick={() => {
                            setSelectedCitation(citation)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" /> Force Delete
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

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-sm">
                <Eye className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col text-left">
                <DialogTitle className="text-xl font-bold">Citation Preview</DialogTitle>
                <DialogDescription className="text-xs font-medium text-zinc-500">
                  Detailed administrator overview of formatted bibliography
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Standard APA 7th Edition</Label>
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 text-sm italic font-medium leading-relaxed">
                  {formatFullBibliography(selectedCitation)}
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Project Folder</Label>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Projector className="h-4 w-4 text-blue-500" />
                {selectedCitation?.project?.name}
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">Creator Account</Label>
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                <Mail className="h-4 w-4 text-zinc-400" />
                {selectedCitation?.project?.user?.email}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <Button 
              className="w-full h-11 rounded-xl font-black bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              onClick={() => setIsPreviewOpen(false)}
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-sm">
                <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col text-left">
                <DialogTitle className="text-xl font-bold">Edit Citation Details</DialogTitle>
                <DialogDescription className="text-xs font-medium text-zinc-500">
                  Review and manage detailed information for administrative corrections
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Title</Label>
                <Input 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Source / Publisher</Label>
                <Input 
                  value={editSource} 
                  onChange={(e) => setEditSource(e.target.value)} 
                  className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Year</Label>
                  <Input 
                    value={editYear} 
                    onChange={(e) => setEditYear(e.target.value)} 
                    className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium text-center"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <Badge variant="outline" className="h-11 rounded-xl justify-center font-black uppercase tracking-tight bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-none">
                    {selectedCitation?.type}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Source URL</Label>
                <Input 
                  value={editUrl} 
                  onChange={(e) => setEditUrl(e.target.value)} 
                  className="rounded-xl h-11 bg-zinc-50 dark:bg-zinc-900/50 border-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                />
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
            <DialogTitle className="text-center text-xl">Confirm Permanent Deletion</DialogTitle>
            <DialogDescription className="text-center pt-2 text-zinc-500">
              Are you sure you want to delete this citation? This will remove it from <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedCitation?.project?.user?.username}&apos;s</span> project permanently.
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
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
