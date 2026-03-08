import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NavLinks } from "@/components/nav-links";
import Image from "next/image";
import Link from "next/link";

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-transparent font-sans text-black dark:text-white transition-colors duration-300">
      {/* Navigation (simplified version for top layer) */}
      <nav className="fixed top-0 left-0 right-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-12 py-4 backdrop-blur-sm bg-white/50 dark:bg-black/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
              <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority />
            </div>
            <span className="text-xl font-bold tracking-tight pr-4">
              <span className="text-[#407bc4]">Baby</span>
              <span className="text-[#f58e58]">bib</span>
            </span>
          </Link>
          <NavLinks />
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageDropdown />
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center pt-40 pb-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Generate Content</h1>
        <p className="text-lg text-zinc-500 max-w-xl mb-12">
          This is the generation page where you can create new ISBNs, bibliography citations, and more.
        </p>

        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl">
           <p className="text-zinc-400 italic">Generation tools coming soon...</p>
        </div>
        
        <Link href="/" className="mt-12 text-[#407bc4] hover:underline">
          &larr; Back to Home
        </Link>
      </main>
    </div>
  );
}
