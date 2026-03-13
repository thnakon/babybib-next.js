"use client"

import * as React from "react"
import { 
  MoreHorizontal, 
  Mail, 
  Shield, 
  ShieldCheck, 
  Calendar,
  Search,
  UserX,
  UserCheck
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
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  isLisStudent: boolean
  studentId: string | null
  createdAt: Date
}

interface UserListProps {
  initialUsers: User[]
}

export function UserList({ initialUsers }: UserListProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [users, setUsers] = React.useState(initialUsers)

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.isLisStudent && "student".includes(searchTerm.toLowerCase())) ||
    (user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            id="user-search-input"
            placeholder="Search users..."
            className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-none font-bold py-1 px-3">
            {filteredUsers.length} Users
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider">Joined At</th>
                <th className="px-6 py-4 text-xs font-black text-zinc-500 uppercase tracking-wider text-right">Actions</th>
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
                          {user.isLisStudent && (
                            <Badge className="h-4 px-1.5 text-[8px] font-black uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-none">
                              LIS: {user.studentId || "Student"}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all",
                      user.role === "ADMIN" 
                        ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 ring-1 ring-purple-500/10" 
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
                          "h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-sm">
                            <Mail className="h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-sm">
                            {user.role === "ADMIN" ? (
                              <><UserX className="h-4 w-4 text-orange-500" /> Demote to User</>
                            ) : (
                              <><UserCheck className="h-4 w-4 text-emerald-500" /> Promote to Admin</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-sm text-red-500 focus:text-red-500">
                            Delete User
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
    </div>
  )
}
