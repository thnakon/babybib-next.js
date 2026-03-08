"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { type Language } from "@/lib/translations";

export function LanguageDropdown() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group/lang">
      <button
        className="flex h-9 items-center gap-2 rounded-full px-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm font-medium transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{language}</span>
      </button>

      <div className="absolute right-0 top-full pt-2 z-50 w-32 hidden group-hover/lang:block">
        <div className="rounded-xl bg-white dark:bg-zinc-900 shadow-lg py-1 flex flex-col border border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setLanguage("EN")}
            className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            English
          </button>
          <button
            onClick={() => setLanguage("TH")}
            className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            ภาษาไทย
          </button>
          <button
            onClick={() => setLanguage("ZH")}
            className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            中文
          </button>
        </div>
      </div>
    </div>
  );
}
