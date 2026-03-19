"use client";

import React from "react";
import Image from "next/image";
import { Twitter, Github, Globe } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;

  return (
    <footer className="py-12 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-sm">
        <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
          <div className="relative h-6 w-6 overflow-hidden rounded-md">
            <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority sizes="24px" />
          </div>
          <span className="tracking-tight">
            <span className="text-[#407bc4]">Baby</span>
            <span className="text-[#f58e58]">bib</span>
          </span>
        </div>
        <p>{t.copyright}</p>
        <div className="flex items-center gap-6">
          <Twitter className="h-4 w-4 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
          <Github className="h-4 w-4 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
          <Globe className="h-4 w-4 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
}
