"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";

export function NavLinks() {
  const { language } = useLanguage();
  const t = translations[language].nav;

  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
      <Link href="/help" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        {t.help}
      </Link>
      <Link href="/guides" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        {t.guides}
      </Link>
      <Link href="/generate" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        {t.generate}
      </Link>
      
      {/* Dropdown for More */}
      <div className="relative group/more">
        <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-2">
          {t.more}
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="absolute top-full right-0 pt-2 hidden group-hover/more:block">
          <div className="flex flex-col w-48 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800 p-2">
            
            {/* Nested Sub-Menu for Share */}
            <div className="relative group/share">
              <button className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-default">
                {t.share}
                <ChevronRight className="h-4 w-4 opacity-50 group-hover/share:opacity-100 transition-opacity" />
              </button>
              
              {/* Added a left-full (pushing from left edge to end) and left padding to extend popup to the right */}
              <div className="absolute top-0 left-full pl-2 hidden group-hover/share:block">
                 <div className="flex flex-col w-40 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800 p-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white">
                      <Facebook className="h-4 w-4 text-[#1877F2]" /> {t.facebook}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white">
                      <Instagram className="h-4 w-4 text-[#E4405F]" /> {t.instagram}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white">
                      <Twitter className="h-4 w-4 text-black dark:text-white" /> {t.twitter}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white">
                      <MessageCircle className="h-4 w-4 text-[#06C755]" /> {t.line}
                    </button>
                 </div>
              </div>
            </div>

            <Link 
              href="/contact" 
              className="px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
            >
              {t.contact}
            </Link>
            <Link 
              href="/terms" 
              className="px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
            >
              {t.terms}
            </Link>
            <Link 
              href="/privacy" 
              className="px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
            >
              {t.privacy}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
