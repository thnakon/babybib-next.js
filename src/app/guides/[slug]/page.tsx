"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, PenTool, List, Info, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function GuideSlugPage() {
  const { language } = useLanguage();
  const t = translations[language].guides;
  const params = useParams();
  const slug = params.slug as string;

  const currentStyle = t.items[slug as keyof typeof t.items] || t.items.apa;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slug}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-12"
      >
        {/* Style Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#f58e58]">
            <Sparkles className="h-4 w-4" />
            {currentStyle.version || "Citation Standard"}
          </div>
          <h1 className="text-[30px] font-bold tracking-tight text-zinc-900 dark:text-white">
            {currentStyle.title}
          </h1>
          <p className="text-[18px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {currentStyle.description}
          </p>
        </header>

        <div className="p-0.5 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full" />

        {/* Guide Sections */}
        <div className="space-y-16">
          <section id="overview" className="scroll-mt-32 space-y-6">
            <h2 className="text-[24px] font-bold flex items-center gap-3 text-zinc-900 dark:text-white">
              <div className="flex items-center justify-center text-[#407bc4]">
                <Book className="h-6 w-6" />
              </div>
              {t.ui.overview}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This guide provides the basic rules for citing sources using {currentStyle.title}. 
              Always ensure you check for the most recent updates to the style and verify with your specific institution's requirements.
            </p>
          </section>

          {"content" in currentStyle && currentStyle.content && (
            <>
              <section id="in-text" className="scroll-mt-32 space-y-6">
                <h2 className="text-[24px] font-bold flex items-center gap-3 text-zinc-900 dark:text-white">
                  <div className="flex items-center justify-center text-[#f58e58]">
                    <PenTool className="h-6 w-6" />
                  </div>
                  {currentStyle.content.inText.title}
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-600 dark:text-zinc-400">{(currentStyle.content as any).inText.rules}</p>
                  <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 font-mono text-sm group relative">
                     <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">Example</div>
                     <span className="text-[#407bc4] dark:text-[#6ba1e6]">{(currentStyle.content as any).inText.example}</span>
                  </div>
                </div>
              </section>

              <section id="bibliography" className="scroll-mt-32 space-y-6">
                <h2 className="text-[24px] font-bold flex items-center gap-3 text-zinc-900 dark:text-white">
                  <div className="flex items-center justify-center text-emerald-600">
                    <List className="h-6 w-6" />
                  </div>
                  {t.ui.bibliography}
                </h2>
                <div className="space-y-4">
                  <p className="text-zinc-600 dark:text-zinc-400">{(currentStyle.content as any).bibliography.rules}</p>
                  <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 font-mono text-sm leading-relaxed group relative">
                     <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">Example</div>
                     <span className="text-zinc-700 dark:text-zinc-300">{(currentStyle.content as any).bibliography.example}</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {!("content" in currentStyle) && (
            <div className="p-12 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-4">
               <Info className="h-8 w-8 text-zinc-300 mx-auto" />
               <h3 className="font-bold">Content Coming Soon</h3>
               <p className="text-sm text-zinc-500 max-w-xs mx-auto text-balance">We are currently compiling the detailed rules for this citation style. Check back soon for examples!</p>
            </div>
          )}

          <div className="pt-12 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
            <Link href="/help" className="flex flex-col gap-1 group">
              <span className="text-xs text-zinc-500 text-zinc-400">Need help?</span>
              <span className="text-sm font-semibold group-hover:text-[#407bc4] transition-colors flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                ← Visit Help Center
              </span>
            </Link>
            <Link href="/generate" className="flex flex-col items-end gap-1 group">
              <span className="text-xs text-zinc-500 text-zinc-400">Ready to cite?</span>
              <span className="text-sm font-semibold group-hover:text-[#f58e58] transition-colors flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                Start Generating →
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
