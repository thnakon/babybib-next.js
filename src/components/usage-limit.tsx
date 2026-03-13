"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-context"
import { translations } from "@/lib/translations"

interface UsageLimitProps {
  citationCount: number
  projectCount: number
}

export function UsageLimit({ citationCount, projectCount }: UsageLimitProps) {
  const { data: session } = useSession()
  const { language } = useLanguage()
  const t = translations[language].usage
  
  // Define limits
  const isGuest = !session
  const CITATION_LIMIT = isGuest ? 5 : 300
  const PROJECT_LIMIT = isGuest ? 1 : 30
  
  const citationProgress = Math.min((citationCount / CITATION_LIMIT) * 100, 100)
  const projectProgress = Math.min((projectCount / PROJECT_LIMIT) * 100, 100)

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Usage Progress Section */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm relative overflow-hidden">
        {isGuest && (
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[8px] font-bold uppercase tracking-tighter rounded-bl-lg border-l border-b border-amber-500/20">
            {t.expires}
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{t.title}</span>
          <span className="text-[10px] font-bold text-[#407bc4] dark:text-[#6ba1e6]">
            {isGuest ? translations[language].userNav.guest.toUpperCase() : translations[language].userNav.member.toUpperCase()}
          </span>
        </div>

        {/* Citations Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-zinc-600 dark:text-zinc-400">{t.citations}</span>
            <span className="text-zinc-900 dark:text-zinc-100">{citationCount} / {CITATION_LIMIT}</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${citationProgress}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-500",
                citationProgress > 80 ? "bg-amber-500" : "bg-[#407bc4]"
              )}
            />
          </div>
        </div>

        {/* Projects Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-zinc-600 dark:text-zinc-400">{t.projects}</span>
            <span className="text-zinc-900 dark:text-zinc-100">{projectCount} / {PROJECT_LIMIT}</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${projectProgress}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-500",
                projectProgress > 80 ? "bg-amber-500" : "bg-[#f58e58]"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
