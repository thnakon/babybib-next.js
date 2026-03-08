"use client";

import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { 
  BookOpen, Triangle, Hexagon, Pencil, Copy, ChevronDown, 
  ArrowLeft, ArrowRight, RotateCw, SlidersHorizontal, AlignLeft 
} from "lucide-react";

export default function GeneratePage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-transparent font-sans text-black dark:text-white transition-colors duration-300">
      {/* 
        Navbar 
        - Increased size
      */}
      <nav className="sticky top-0 z-50 flex w-full h-16 items-center justify-between px-6 sm:px-8 lg:px-12 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#407bc4]">Baby</span>
              <span className="text-[#f58e58]">bib</span>
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageDropdown />
          <ThemeToggle />
          <button className="hidden sm:flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#407bc4] px-4 text-sm font-medium text-white transition-all hover:bg-[#32629e] active:scale-95 shadow-sm">
            {translations[language].nav.signIn} <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>

      {/* Main Container - 3 Column Layout */}
      <div className="mx-auto flex w-full max-w-screen-2xl items-start">
        
        {/* Left Sidebar */}
        <aside className="hidden top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-transparent py-6 pr-6 md:sticky md:block lg:py-8 md:w-[240px] lg:w-[280px] pl-6 sm:pl-8 lg:pl-12">
          <div className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                  <BookOpen className="h-3 w-3 text-zinc-500" />
                </div>
                <span className="text-sm font-semibold">Guide</span>
              </div>
              <ul className="flex flex-col gap-2 border-l border-zinc-200 dark:border-zinc-800 ml-2.5 pl-4 pb-2">
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Introduction</li>
                <li className="text-sm font-medium text-black dark:text-white cursor-pointer">Installation</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Accessibility</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">MCP</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Troubleshooting</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Changelog</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Roadmap</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Other animated distributions</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                  <Triangle className="h-3 w-3 text-zinc-500" />
                </div>
                <span className="text-sm font-semibold">Animate UI</span>
              </div>
              <ul className="flex flex-col gap-2 border-l border-zinc-200 dark:border-zinc-800 ml-2.5 pl-4 pb-2">
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Avatar Group</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Code</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Code Tabs</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Cursor</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">GitHub Stars Wheel</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Tabs</li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">Tooltip</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                  <Hexagon className="h-3 w-3 text-zinc-500" />
                </div>
                <span className="text-sm font-semibold text-zinc-500">Radix UI</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Center Content Area */}
        <main className="relative py-6 lg:py-8 w-full min-w-0 px-6 md:px-8 xl:px-12 flex-1">
          <div className="mx-auto w-full min-w-0">
            
            {/* Header / Nav Buttons */}
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-4xl font-bold tracking-tight">Preview Link Card</h1>
              <div className="hidden sm:flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                  <ArrowLeft className="h-4 w-4 text-zinc-500" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                  <ArrowRight className="h-4 w-4 text-zinc-500" />
                </button>
              </div>
            </div>

            <p className="text-lg text-zinc-500 mb-4">Displays a preview image of a link when hovered.</p>
            <p className="text-sm text-zinc-500 italic mb-8">Made by <span className="text-black dark:text-white font-medium not-italic">imskyleen</span></p>

            {/* Utility Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <button className="flex h-8 items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <Pencil className="h-3 w-3" /> Edit on GitHub
              </button>
              <button className="flex h-8 items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <Copy className="h-3 w-3" /> Copy Markdown
              </button>
              <button className="flex h-8 items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 pl-3 pr-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                Open <ChevronDown className="h-3 w-3 ml-1 text-zinc-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-transparent mb-4">
              <button className="flex h-8 items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-3 text-sm font-medium text-black dark:text-white">
                Preview
              </button>
              <button className="flex h-8 items-center px-3 text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
                Code
              </button>
            </div>

            {/* Preview Box */}
            <div className="relative flex min-h-[500px] w-full items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-4 shadow-sm">
              
              {/* Box Toolbar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button className="flex h-8 items-center gap-2 rounded-md bg-black dark:bg-white px-3 text-xs font-medium text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                  Open in v0
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                  <RotateCw className="h-4 w-4 text-zinc-500" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                  <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="text-center text-zinc-500 text-sm">
                Read the <span className="font-semibold underline underline-offset-4 text-black dark:text-white">Babybib Docs</span> — hover to preview, click to dive in.
              </div>
            </div>

          </div>
        </main>

        {/* Right Sidebar (Table of Contents) */}
        <aside className="hidden xl:sticky top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto py-6 xl:block xl:w-[240px] 2xl:w-[280px] pr-6 sm:pr-8 lg:pr-12">
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft className="h-4 w-4 text-zinc-500" />
            <span className="text-sm font-medium text-zinc-500">On this page</span>
          </div>

          <div className="flex flex-col text-sm border-l border-zinc-200 dark:border-zinc-800">
            <a href="#" className="border-l-2 border-black dark:border-white -ml-[1px] pl-4 py-1.5 font-medium text-black dark:text-white">Installation</a>
            <a href="#" className="border-l-2 border-transparent -ml-[1px] pl-4 py-1.5 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">Usage</a>
            <a href="#" className="border-l-2 border-transparent -ml-[1px] pl-4 py-1.5 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">API Reference</a>
            
            <div className="flex flex-col pl-4 mt-1 mb-1 gap-1.5">
              <a href="#" className="pl-4 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">PreviewLinkCard</a>
              <a href="#" className="pl-4 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">PreviewLinkCardTrigger</a>
              <a href="#" className="pl-4 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">PreviewLinkCardContent</a>
              <a href="#" className="pl-4 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">PreviewLinkCardImage</a>
            </div>

            <a href="#" className="border-l-2 border-transparent -ml-[1px] pl-4 py-1.5 text-zinc-500 hover:text-black dark:hover:text-white transition-colors mt-2">Credits</a>
          </div>
        </aside>

      </div>
    </div>
  );
}
