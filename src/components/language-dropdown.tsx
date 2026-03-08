"use client";

import * as React from "react";
import { Globe } from "lucide-react";

export function LanguageDropdown() {
  const [open, setOpen] = React.useState(false);
  const [language, setLanguage] = React.useState("EN");

  const toggleOpen = () => setOpen(!open);
  
  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="flex h-9 items-center gap-2 rounded-full px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span>{language}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-32 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg py-1">
          <button
            onClick={() => selectLanguage("EN")}
            className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            English
          </button>
          <button
            onClick={() => selectLanguage("TH")}
            className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            ภาษาไทย
          </button>
        </div>
      )}
    </div>
  );
}
