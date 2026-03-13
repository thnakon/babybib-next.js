"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  BadgeCheck, 
  CreditCard, 
  Bell, 
  LogOut, 
  ChevronDown,
  User
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-context"
import { translations } from "@/lib/translations"

export function UserNav() {
  const { data: session, status } = useSession()
  const { language } = useLanguage()
  const t = translations[language].userNav
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (status === "loading") {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
  }

  if (!session) {
    return (
      <Link 
        href="/login" 
        className="hidden sm:flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#407bc4] px-4 text-sm font-medium text-white transition-all hover:bg-[#32629e] active:scale-95 shadow-sm"
      >
        {translations[language].nav.signIn} <span aria-hidden="true">&rarr;</span>
      </Link>
    )
  }

  const user = session.user
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : (t.guest === "Guest" ? "G" : "U")

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#407bc4]/10 text-[#407bc4] text-xs font-bold border border-[#407bc4]/20">
          {initials}
        </div>
        <span className="text-sm font-medium hidden md:block">
          {user?.name || t.guest}
        </span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-2xl z-[100]"
          >
            {/* User Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground text-sm font-bold border border-border">
                {initials}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-1.5">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted/80 hover:text-foreground transition-colors group">
                <Sparkles className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">{t.upgrade}</span>
              </button>
              
              <div className="my-1.5 h-px bg-border/50 mx-1.5" />
              
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted/80 hover:text-foreground transition-colors group">
                <BadgeCheck className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">{t.account}</span>
              </button>
              
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted/80 hover:text-foreground transition-colors group">
                <CreditCard className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">{t.billing}</span>
              </button>
              
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted/80 hover:text-foreground transition-colors group">
                <Bell className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-medium">{t.notifications}</span>
              </button>

              <div className="my-1.5 h-px bg-border/50 mx-1.5" />

              <button 
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors group"
              >
                <LogOut className="size-4 transition-colors" />
                <span className="font-medium">{t.logout}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
