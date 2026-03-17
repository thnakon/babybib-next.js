"use client"

import * as React from "react"
import { 
  MoreHorizontal, 
  Mail, 
  Shield, 
  ShieldCheck, 
  Calendar,
  Search,
  UserCheck,
  UserX,
  Trash2,
  User as UserIcon,
  Settings,
  AlertTriangle,
  Loader2
} from "lucide-react"
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { adminDeleteUserAction, adminUpdateUserAction, adminUpdateRoleAction } from "@/app/actions/admin"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PROVINCES, ORG_TYPES } from "@/lib/constants/auth"

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  isLisStudent: boolean
  studentId: string | null
  orgType: string | null
  province: string | null
  orgName: string | null
  otherOrgType: string | null
  emailVerified: Date | null
  createdAt: Date
}

interface UserListProps {
  initialUsers: User[]
}

export function UserList({ initialUsers }: UserListProps) {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL")
  const [lisFilter, setLisFilter] = React.useState<string>("ALL")
  const [users, setUsers] = React.useState(initialUsers)
  const [isPending, setIsPending] = React.useTransition()

  // Selection state
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [confirmUsername, setConfirmUsername] = React.useState("")

  // Edit form state
  const [editFirstName, setEditFirstName] = React.useState("")
  const [editLastName, setEditLastName] = React.useState("")
  const [editUsername, setEditUsername] = React.useState("")
  const [editOrgType, setEditOrgType] = React.useState("")
  const [editProvince, setEditProvince] = React.useState("")
  const [editOrgName, setEditOrgName] = React.useState("")
  const [editIsLisStudent, setEditIsLisStudent] = React.useState(false)
  const [editStudentId, setEditStudentId] = React.useState("")

  React.useEffect(() => {
    if (selectedUser) {
      setEditFirstName(selectedUser.firstName)
      setEditLastName(selectedUser.lastName)
      setEditUsername(selectedUser.username)
      setEditOrgType(selectedUser.orgType || "")
      setEditProvince(selectedUser.province || "")
      setEditOrgName(selectedUser.orgName || "")
      setEditIsLisStudent(selectedUser.isLisStudent)
      setEditStudentId(selectedUser.studentId || "")
    }
  }, [selectedUser])

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    setIsPending(async () => {
      try {
        await adminUpdateUserAction(selectedUser.id, {
          firstName: editFirstName,
          lastName: editLastName,
          username: editUsername,
          orgType: editOrgType,
          province: editProvince,
          orgName: editOrgName,
          isLisStudent: editIsLisStudent,
          studentId: editIsLisStudent ? editStudentId : null,
        })
        
        // Optimistic update
        setUsers(users.map(u => u.id === selectedUser.id ? {
          ...u,
          firstName: editFirstName,
          lastName: editLastName,
          username: editUsername,
          orgType: editOrgType,
          province: editProvince,
          orgName: editOrgName,
          isLisStudent: editIsLisStudent,
          studentId: editIsLisStudent ? editStudentId : null,
        } : u))
        
        toast.success("User updated successfully")
        setIsEditDialogOpen(false)
      } catch (error) {
        toast.error("Failed to update user")
      }
    })
  }

  const handleDeleteUser = async () => {
    if (!selectedUser || confirmUsername !== session?.user?.name) return

    setIsPending(async () => {
      try {
        await adminDeleteUserAction(selectedUser.id)
        setUsers(users.filter(u => u.id !== selectedUser.id))
        toast.success("User deleted successfully")
        setIsDeleteDialogOpen(false)
        setConfirmUsername("")
      } catch (error) {
        toast.error("Failed to delete user")
      }
    })
  }

  const handleToggleRole = async (user: User) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN"
    setIsPending(async () => {
      try {
        await adminUpdateRoleAction(user.id, newRole as any)
        setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u))
        toast.success(`User demoted to ${newRole}`)
      } catch (error) {
        toast.error("Failed to update role")
      }
    })
  }

  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      // Search match
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.isLisStudent && "student".includes(searchTerm.toLowerCase())) ||
        (user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()))

      // Role filter
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter

      // LIS filter
      const matchesLis = lisFilter === "ALL" || 
        (lisFilter === "LIS" && user.isLisStudent) || 
        (lisFilter === "NORMAL" && !user.isLisStudent)

      return matchesSearch && matchesRole && matchesLis
    })
  }, [users, searchTerm, roleFilter, lisFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
            <Input
              id="user-search-input"
              placeholder="Search users..."
              className="pl-9 bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 rounded-xl h-8.5 text-xs focus-visible:ring-1 focus-visible:ring-zinc-500/30 focus-visible:border-zinc-500/30 transition-all shadow-none outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap">Role</span>
            <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val || "ALL")}>
              <SelectTrigger id="role-filter-trigger" className="w-[130px] rounded-xl bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 !h-8.5 shadow-none text-[11px] font-semibold">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap">LIS Status</span>
            <Select value={lisFilter} onValueChange={(val) => setLisFilter(val || "ALL")}>
              <SelectTrigger id="lis-filter-trigger" className="w-[140px] rounded-xl bg-white/50 dark:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/60 !h-8.5 shadow-none text-[11px] font-semibold">
                <SelectValue placeholder="LIS Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Students</SelectItem>
                <SelectItem value="LIS">LIS Students</SelectItem>
                <SelectItem value="NORMAL">Regular User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
              {filteredUsers.length} <span className="font-medium">Users Total</span>
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">LIS</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Joined At</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-white dark:border-zinc-800 shadow-sm">
                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase">
                          {user.firstName.substring(0, 1)}{user.lastName.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isLisStudent ? (
                      <div className="flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                        <Badge className="h-4 px-1.5 text-[8px] border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-none">LIS</Badge>
                        {user.studentId}
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 font-medium">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all w-fit",
                      user.role === "ADMIN" 
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 ring-1 ring-zinc-950/10" 
                        : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 ring-1 ring-blue-500/10"
                    )}>
                      {user.role === "ADMIN" ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium" suppressHydrationWarning>
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(user.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        id={`user-actions-trigger-${user.id}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-auto"
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer font-medium text-sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <UserIcon className="h-4 w-4" /> View & Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer font-medium text-sm"
                            onClick={() => handleToggleRole(user)}
                          >
                            {user.role === "ADMIN" ? (
                              <><UserX className="h-4 w-4 text-orange-500" /> Demote to User</>
                            ) : (
                              <><UserCheck className="h-4 w-4 text-emerald-500" /> Promote to Admin</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer font-medium text-sm text-red-500 focus:text-red-500"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" /> Delete User
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
      </div>

      {/* User Detail Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-4 border-zinc-100 dark:border-zinc-800">
                <AvatarFallback className="text-xl font-black uppercase">
                  {selectedUser?.firstName.substring(0, 1)}{selectedUser?.lastName.substring(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <DialogTitle className="text-xl">User Profile Detail</DialogTitle>
                <DialogDescription className="text-xs">
                  Review and manage detailed information for <span className="text-zinc-900 dark:text-zinc-100 font-bold">{selectedUser?.username}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">First Name</Label>
                <Input 
                  value={editFirstName} 
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Name</Label>
                <Input 
                  value={editLastName} 
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Username</Label>
                <Input 
                  value={editUsername} 
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</Label>
                <div className="relative">
                  <Input 
                    value={selectedUser?.email || ""} 
                    disabled
                    className="rounded-xl bg-zinc-100 dark:bg-zinc-800 opacity-60 pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {selectedUser?.emailVerified ? (
                      <Badge className="bg-emerald-50 text-emerald-600 text-[8px] border-none font-black uppercase h-5">Verified</Badge>
                    ) : (
                      <Badge className="bg-orange-50 text-orange-600 text-[8px] border-none font-black uppercase h-5">Pending</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Org Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Organization Type</Label>
                <Select value={editOrgType} onValueChange={(val) => setEditOrgType(val || "")}>
                  <SelectTrigger id="edit-org-type-trigger" className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-none h-11">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Province</Label>
                <Select value={editProvince} onValueChange={(val) => setEditProvince(val || "")}>
                  <SelectTrigger id="edit-province-trigger" className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-none h-11">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((prov) => (
                      <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Organization Name</Label>
                <Input 
                  value={editOrgName} 
                  onChange={(e) => setEditOrgName(e.target.value)}
                  placeholder="e.g. CMU"
                  className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50"
                />
              </div>

              {/* LIS Section */}
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold">LIS Student</Label>
                  <Checkbox 
                    checked={editIsLisStudent} 
                    onCheckedChange={(checked) => setEditIsLisStudent(!!checked)}
                  />
                </div>
                {editIsLisStudent && (
                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Student ID</Label>
                    <Input 
                      value={editStudentId} 
                      onChange={(e) => setEditStudentId(e.target.value)}
                      placeholder="Enter ID..."
                      className="rounded-xl bg-white dark:bg-zinc-950 h-8 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-xl font-bold h-11"
            >
              Cancel
            </Button>
            <Button 
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-black h-11 px-8"
              onClick={handleUpdateUser}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Details"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-xl">Delete User Account</DialogTitle>
            <DialogDescription className="text-center pt-2">
              This action is <span className="text-red-600 font-bold">permanent</span> and cannot be undone. 
              All data associated with <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedUser?.username}</span> will be lost.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                To confirm, please type your admin username: <span className="font-bold text-zinc-900 dark:text-zinc-100">{session?.user?.name}</span>
              </p>
            </div>
            <Input 
              placeholder="Type your username..." 
              value={confirmUsername}
              onChange={(e) => setConfirmUsername(e.target.value)}
              className="rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl font-bold h-11 flex-1"
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold h-11 flex-1 shadow-lg shadow-red-500/20"
              disabled={confirmUsername !== session?.user?.name || isPending}
              onClick={handleDeleteUser}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
