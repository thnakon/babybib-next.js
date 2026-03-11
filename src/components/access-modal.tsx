"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, X, ArrowRight, Lock, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  featureName?: string
}

export function AccessModal({ 
  isOpen, 
  onClose, 
  title = "Unlock Full Access", 
  description = "Join Babybib today to save your work permanently and access premium features.",
  featureName 
}: AccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            {/* Header / Banner */}
            <div className="relative h-32 bg-gradient-to-br from-[#407bc4] to-[#2c5891] flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[200%] bg-[radial-gradient(circle,white_0%,transparent_70%)] blur-3xl animate-pulse" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                {featureName && (
                  <span className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    Feature: {featureName}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-center flex flex-col items-center">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                {title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed max-w-[280px]">
                {description}
              </p>

              <div className="grid w-full gap-3">
                <Link href="/signup" className="w-full">
                  <Button className="w-full h-12 rounded-2xl bg-[#407bc4] text-white font-bold hover:bg-[#32629e] transition-all shadow-lg shadow-[#407bc4]/20 group">
                    Join for Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full">
                  <button className="w-full h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                    Sign In
                  </button>
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 justify-center">
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                  <ShieldCheck className="h-4 w-4 text-[#407bc4]" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Secure Data</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 opacity-60">
                  <Sparkles className="h-4 w-4 text-[#f58e58]" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Unlimited Citations</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-black/10 text-white hover:bg-black/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
