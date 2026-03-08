"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NavLinks } from "@/components/nav-links";
import { Sparkles, Book, Library, PenTool, Bookmark } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language].home;
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-transparent font-sans text-black dark:text-white transition-colors duration-300">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]"
          >
            <div className="flex items-center gap-6">
              <motion.div layoutId="logo-container" className="relative h-24 w-24 overflow-hidden rounded-2xl">
                <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority />
              </motion.div>
              <motion.div layoutId="brand-text" className="text-6xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text animate-[shine_3s_linear_infinite] bg-[linear-gradient(110deg,#407bc4,45%,#a0c4f2,55%,#407bc4)] bg-[length:200%_100%]">Baby</span>
                <span className="text-transparent bg-clip-text animate-[shine_3s_linear_infinite] bg-[linear-gradient(110deg,#f58e58,45%,#fad1bc,55%,#f58e58)] bg-[length:200%_100%]">bib</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-12 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {!showIntro ? (
            <>
              <motion.div layoutId="logo-container" className="relative h-14 w-14 overflow-hidden rounded-lg">
                <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority />
              </motion.div>
              <motion.div layoutId="brand-text" className="text-2xl font-bold tracking-tight pr-8">
                <span className="text-transparent bg-clip-text animate-[shine_3s_linear_infinite] bg-[linear-gradient(110deg,#407bc4,45%,#a0c4f2,55%,#407bc4)] bg-[length:200%_100%]">Baby</span>
                <span className="text-transparent bg-clip-text animate-[shine_3s_linear_infinite] bg-[linear-gradient(110deg,#f58e58,45%,#fad1bc,55%,#f58e58)] bg-[length:200%_100%]">bib</span>
              </motion.div>
            </>
          ) : (
            <div className="h-14 w-14" /> /* Placeholder space */
          )}
          
          <motion.div animate={{ opacity: showIntro ? 0 : 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <NavLinks />
          </motion.div>
        </div>
        
        <motion.div className="flex items-center gap-4" animate={{ opacity: showIntro ? 0 : 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <LanguageDropdown />
          <ThemeToggle />
        </motion.div>
      </nav>

      <motion.main 
        animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }} 
        initial={{ opacity: 0, y: 20 }} 
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col items-center pt-32 pb-20"
      >
        {/* Badge */}
        <div className="group mb-12 relative overflow-hidden flex items-center gap-2 rounded-full border border-[#407bc4]/20 dark:border-[#407bc4]/30 bg-[#407bc4]/5 dark:bg-[#407bc4]/10 px-3 py-1 text-sm font-medium cursor-pointer transition-colors hover:border-[#407bc4]/40 dark:hover:border-[#407bc4]/50">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
          <span className="relative z-10 flex items-center gap-1 rounded-full bg-[#f58e58] px-2 py-0.5 text-[10px] text-white">
            <Sparkles className="h-3 w-3" /> {t.new}
          </span>
          <span className="relative z-10 text-[#407bc4] dark:text-[#6ba1e6]">{t.badge}</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center px-4 text-center">
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
            {t.heroTitlePart1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#407bc4] to-[#f58e58]">{t.heroTitleHighlight}</span> {t.heroTitlePart2.startsWith("with") ? <><br /> {t.heroTitlePart2}</> : t.heroTitlePart2}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-zinc-500">
            {t.heroDesc}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <button className="flex h-12 items-center gap-2 rounded-xl bg-[#407bc4] px-8 text-sm font-semibold text-white transition-all hover:bg-[#32629e] active:scale-95 shadow-lg shadow-[#407bc4]/20">
              {t.btnGetStarted}
            </button>
            <button className="flex h-12 items-center rounded-xl bg-[#f58e58]/10 px-8 text-sm font-semibold text-[#dd7742] dark:text-[#f58e58] transition-all hover:bg-[#f58e58]/20 active:scale-95">
              {t.btnBrowse}
            </button>
          </div>

          {/* Tech Icons */}
          <div className="mt-12 flex items-center gap-8 opacity-70">
            <Book className="h-7 w-7 text-zinc-500 dark:text-zinc-400 hover:-translate-y-1.5 hover:rotate-6 hover:scale-110 transition-transform cursor-pointer" />
            <Library className="h-8 w-8 text-[#407bc4] hover:-translate-y-1.5 hover:-rotate-6 hover:scale-110 transition-transform cursor-pointer" />
            <PenTool className="h-7 w-7 text-[#f58e58] hover:-translate-y-1.5 hover:rotate-12 hover:scale-110 transition-transform cursor-pointer" />
            <Bookmark className="h-6 w-6 text-zinc-500 dark:text-zinc-400 hover:-translate-y-1.5 hover:-rotate-12 hover:scale-110 transition-transform cursor-pointer" />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl w-full">
          {[
            { title: t.gridPrimitives, icon: "□" },
            { title: t.gridComponents, icon: "⬚" },
            { title: t.gridIcons, icon: "✧" },
            { title: t.gridSoon, icon: "⋯" }
          ].map((card, i) => (
            <div key={i} className="group relative flex aspect-[1.2/1] flex-col rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-6 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-[#407bc4]/5 border border-transparent hover:border-[#407bc4]/20">
              <span className="mb-auto text-center font-serif italic text-zinc-400 text-xl group-hover:text-[#f58e58] transition-colors">{card.title}</span>
              <div className="flex h-full items-center justify-center">
                <div className="h-24 w-40 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 flex flex-col p-4 gap-2 transition-colors group-hover:bg-[#407bc4]/5 dark:group-hover:bg-[#407bc4]/10">
                   <div className="h-4 w-8 bg-zinc-300 dark:bg-zinc-700 rounded group-hover:bg-[#f58e58]/40 transition-colors" />
                   <div className="h-2 w-24 bg-zinc-300 dark:bg-zinc-700 rounded group-hover:bg-[#407bc4]/40 transition-colors" />
                   <div className="h-2 w-20 bg-zinc-300 dark:bg-zinc-700 rounded group-hover:bg-[#407bc4]/30 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
