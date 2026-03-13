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
  Projector
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
import { adminDeleteCitationAction } from "@/app/actions/admin"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CitationListProps {
  initialCitations: any[]
}

export function CitationList({ initialCitations }: CitationListProps) {
  const [citations, setCitations] = React.useState(initialCitations)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isPending, setIsPending] = React.useState(false)
  const [selectedCitation, setSelectedCitation] = React.useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  const filteredCitations = React.useMemo(() => {
    return citations.filter((c) => {
      const search = searchTerm.toLowerCase()
      return (
        c.title?.toLowerCase().includes(search) ||
        c.project?.name?.toLowerCase().includes(search) ||
        c.project?.user?.username?.toLowerCase().includes(search) ||
        c.project?.user?.email?.toLowerCase().includes(search)
      )
    })
  }, [citations, searchTerm])

  const handleDelete = async () => {
    if (!selectedCitation) return

    setIsPending(true)
    try {
      const result = await adminDeleteCitationAction(selectedCitation.id)
      if (result.success) {
        setCitations(citations.filter((c) => c.id !== selectedCitation.id))
        toast.success("Citation deleted successfully")
        setIsDeleteDialogOpen(false)
      }
    } catch (error) {
      toast.error("Failed to delete citation")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search citations, projects, or users..."
            className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-none font-bold py-1 px-3 h-10">
          {filteredCitations.length} Citations
        </Badge>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Citation Content</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Project & Owner</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Type</TableHead>
              <TableHead className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredCitations.map((citation) => (
              <TableRow key={citation.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                <TableCell className="px-6 py-4 max-w-md">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {citation.title || "Untitled"}
                    </span>
                    <span className="text-xs text-zinc-500 line-clamp-2 italic font-medium">
                      {citation.authors ? JSON.parse(citation.authors).map((a: any) => `${a.lastName}, ${a.firstName}`).join("; ") : "No authors"}
                    </span>
                  </div>
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
                        <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-sm">
                          <Eye className="h-4 w-4" /> Quick Preview
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl">Confirm Permanent Deletion</DialogTitle>
            <DialogDescription className="text-center pt-2 text-zinc-500">
              Are you sure you want to delete this citation? This will remove it from <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedCitation?.project?.user?.username}&apos;s</span> project permanently.
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
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
