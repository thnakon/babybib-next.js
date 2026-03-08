"use client";

import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { 
  BookOpen, Triangle, Pencil, Copy, ChevronDown, 
  ArrowLeft, ArrowRight, RotateCw, SlidersHorizontal, AlignLeft, Plus,
  FileText, Globe, Smartphone, Bot, ShoppingCart, LayoutDashboard, Briefcase, Library,
  Heart, ShieldCheck, Search, HelpCircle, Book
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

            <button className="flex h-8 w-32 mx-auto items-center justify-center gap-1.5 rounded-md bg-[#407bc4] text-xs font-medium text-white hover:bg-[#32629e] active:scale-95 transition-all shadow-sm">
              <Plus className="h-3.5 w-3.5" /> Add new
            </button>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#407bc4]/10 dark:bg-[#407bc4]/20">
                  <BookOpen className="h-3 w-3 text-[#407bc4] dark:text-[#6ba1e6]" />
                </div>
                <span className="text-sm font-semibold">Project</span>
              </div>
              <ul className="flex flex-col gap-2 border-l border-zinc-200 dark:border-zinc-800 ml-2.5 pl-4 pb-2">
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <Globe className="h-3 w-3 shrink-0" /> <span className="truncate">Babybib Next.js</span>
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-[#407bc4] dark:text-[#6ba1e6] cursor-pointer truncate">
                  <FileText className="h-3 w-3 shrink-0" /> <span className="truncate">Preview Link Card</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <Library className="h-3 w-3 shrink-0" /> <span className="truncate">Smart ISBN API</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <Smartphone className="h-3 w-3 shrink-0" /> <span className="truncate">Chat UI System</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <Bot className="h-3 w-3 shrink-0" /> <span className="truncate">Attitudes AI Tool</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <ShoppingCart className="h-3 w-3 shrink-0" /> <span className="truncate">E-commerce API</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <LayoutDashboard className="h-3 w-3 shrink-0" /> <span className="truncate">Admin Dashboard</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <Briefcase className="h-3 w-3 shrink-0" /> <span className="truncate">Portfolio Templates</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                  <Triangle className="h-3 w-3 text-zinc-500" />
                </div>
                <span className="text-sm font-semibold text-zinc-500">Latest bibliography</span>
              </div>
              <ul className="flex flex-col gap-2 border-l border-zinc-200 dark:border-zinc-800 ml-2.5 pl-4 pb-2">
                <li className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <span className="truncate">Kahneman, D. (2011). Thinking, fast and slow...</span>
                </li>
                <li className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <span className="truncate">Harari, Y. N. (2014). Sapiens: A brief history...</span>
                </li>
                <li className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <span className="truncate">Chomsky, N. (1957). Syntactic structures...</span>
                </li>
                <li className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <span className="truncate">Dawkins, R. (1976). The selfish gene...</span>
                </li>
                <li className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <span className="truncate">Hawking, S. (1988). A brief history of time...</span>
                </li>
                <li className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <span className="truncate">Taleb, N. N. (2007). The black swan...</span>
                </li>
                <li className="flex items-start text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                  <span className="truncate">Gladwell, M. (2008). Outliers: The story of success...</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-1.5 pt-4 mt-auto mx-auto pb-4">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Made by <span className="font-bold"><span className="text-[#407bc4]">Baby</span><span className="text-[#f58e58]">bib</span></span>
              </span>
              <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 font-medium tracking-tight">
                <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-zinc-400 dark:text-zinc-500 decoration-transparent underline-offset-4 hover:underline">Privacy</Link>
                <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-zinc-400 dark:text-zinc-500 decoration-transparent underline-offset-4 hover:underline">Terms</Link>
                <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                <Link href="#" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors text-zinc-400 dark:text-zinc-500 decoration-transparent underline-offset-4 hover:underline">About</Link>
              </div>
            </div>

          </div>
        </aside>

        {/* Center Content Area */}
        <main className="relative py-6 lg:py-8 w-full min-w-0 px-6 md:px-8 xl:px-12 flex-1">
          <div className="mx-auto w-full min-w-0">
            
            {/* Search Input Section */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <span className="inline-flex items-center rounded-full bg-[#407bc4]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#407bc4] dark:bg-[#407bc4]/20">
                    Manual
                  </span>
                  
                  <nav className="flex items-center gap-4 sm:gap-6">
                    <button className="group flex items-center gap-1.5 text-sm font-semibold text-[#407bc4] border-b-2 border-[#407bc4] pb-1 transition-all">
                      <Book className="h-4 w-4" /> Books
                    </button>
                    <button className="group flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 pb-1 transition-all">
                      <FileText className="h-4 w-4" /> Articles
                    </button>
                    <button className="group flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 pb-1 transition-all">
                      <Globe className="h-4 w-4" /> Websites
                    </button>
                    <button className="group flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 pb-1 transition-all">
                      <Plus className="h-4 w-4" /> More
                    </button>
                  </nav>
                </div>
                
                <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group">
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Help</span>
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-[#407bc4] transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search by ISBN / DOI / URL / Title etc." 
                  className="w-full h-14 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-16 text-base font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-[#407bc4]/5 dark:focus:ring-[#407bc4]/10 focus:border-[#407bc4] transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
            </div>

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
            <AlignLeft className="h-4 w-4 text-[#407bc4] dark:text-[#6ba1e6]" />
            <span className="text-sm font-medium text-[#407bc4] dark:text-[#6ba1e6]">On this page</span>
          </div>

          <div className="flex flex-col text-sm border-l border-zinc-200 dark:border-zinc-800">
            <a href="#" className="border-l-2 border-[#407bc4] -ml-[1px] pl-4 py-1.5 font-medium text-[#407bc4] dark:text-[#6ba1e6]">Installation</a>
            <a href="#" className="border-l-2 border-transparent -ml-[1px] pl-4 py-1.5 text-zinc-500 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] transition-colors">Usage</a>
            <a href="#" className="border-l-2 border-transparent -ml-[1px] pl-4 py-1.5 text-zinc-500 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] transition-colors">API Reference</a>
            
            <div className="flex flex-col pl-4 mt-1 mb-1 gap-1.5">
              <a href="#" className="pl-4 text-zinc-500 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] transition-colors">PreviewLinkCard</a>
              <a href="#" className="pl-4 text-zinc-500 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] transition-colors">PreviewLinkCardTrigger</a>
              <a href="#" className="pl-4 text-zinc-500 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] transition-colors">PreviewLinkCardContent</a>
              <a href="#" className="pl-4 text-zinc-500 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] transition-colors">PreviewLinkCardImage</a>
            </div>

            <a href="#" className="border-l-2 border-transparent -ml-[1px] pl-4 py-1.5 text-zinc-500 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] transition-colors mt-2">Credits</a>
          </div>
        </aside>

      </div>
    </div>
  );
}
