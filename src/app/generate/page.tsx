"use client";

import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { 
  BookOpen, Triangle, Pencil, Copy, ChevronDown, Check,
  ArrowLeft, ArrowRight, RotateCw, SlidersHorizontal, AlignLeft, Plus,
  FileText, Globe, Smartphone, Bot, ShoppingCart, LayoutDashboard, Briefcase, Library,
  Heart, ShieldCheck, Search, HelpCircle, Book, Download, FileJson, FileCode, FileSpreadsheet,
  List, LayoutList, Settings2, Info, Trash2, Quote, GripVertical, Sparkles,
  Archive, Type, ArrowDownAz, Trash
} from "lucide-react";

export default function GeneratePage() {
  const { language } = useLanguage();
  const [style, setStyle] = React.useState("APA - 7th Edition");
  const [isStyleOpen, setIsStyleOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("Bibliography");
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<number | null>(null);
  
  // Bibliography Data State
  const [citations, setCitations] = React.useState([
    { id: 1, inText: "(Kahneman, 2011)", content: <>Kahneman, D. (2011). <i>Thinking, fast and slow: The psychology of human judgment and decision-making processes in uncertain environments.</i> Farrar, Straus and Giroux.</> },
    { id: 2, inText: "(Harari, 2014)", content: <>Harari, Y. N. (2014). <i>Sapiens: A brief history of humankind from the cognitive revolution to the modern age of biotechnology.</i> Vintage Books.</> },
    { id: 3, inText: "(Chomsky, 1957)", content: <>Chomsky, N. (1957). <i>Syntactic structures: A formal analysis of linguistic representation and the underlying structures of human language.</i> Mouton & Co.</> },
    { id: 4, inText: "(Dawkins, 1976)", content: <>Dawkins, R. (1976). <i>The selfish gene: An exploration of the biological basis of altruism and the evolutionary pressure on genetic transmission.</i> Oxford University Press.</> },
    { id: 5, inText: "(Hawking, 1988)", content: <>Hawking, S. (1988). <i>A brief history of time: From the big bang to black holes and the fundamental nature of space-time physics.</i> Bantam Books.</> },
    { id: 6, inText: "(Taleb, 2007)", content: <>Taleb, N. N. (2007). <i>The black swan: The impact of the highly improbable events that shape human history and the fragility of our complex systems.</i> Random House.</> },
    { id: 7, inText: "(Gladwell, 2008)", content: <>Gladwell, M. (2008). <i>Outliers: The story of success and the unique environmental factors that contribute to exceptional human achievement.</i> Little, Brown and Company.</> },
    { id: 8, inText: "(Diamond, 1997)", content: <>Diamond, J. M. (1997). <i>Guns, germs, and steel: The fates of human societies and the environmental factors that shaped world history.</i> W. W. Norton & Company.</> },
    { id: 9, inText: "(Pinker, 2011)", content: <>Pinker, S. (2011). <i>The better angels of our nature: Why violence has declined and the historical shift in human behavior towards cooperation.</i> Viking Penguin.</> },
    { id: 10, inText: "(Harari, 2018)", content: <>Sapiens, Y. N. (2018). <i>21 Lessons for the 21st Century: Navigating the challenges of technology, politics, and global crises in a changing world.</i> Jonathan Cape.</> },
  ]);

  // Drag and Drop State
  const dragItem = React.useRef<number | null>(null);
  const dragOverItem = React.useRef<number | null>(null);

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _citations = [...citations];
    const draggedItemContent = _citations.splice(dragItem.current, 1)[0];
    _citations.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setCitations(_citations);
  };

  const deleteCitation = (id: number) => {
    setCitations(prev => prev.filter(c => c.id !== id));
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleItemCopy = (id: number) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const styles = ["APA - 7th Edition", "MLA - 9th Edition", "Harvard", "Chicago", "AMA", "CSE"];
  
  const views = [
    { id: "Plain list", icon: <List className="h-4 w-4" />, label: "Plain list" },
    { id: "Bibliography", icon: <FileText className="h-4 w-4" />, label: "Bibliography" },
    { id: "Bibliography and in-text citations", icon: <LayoutList className="h-4 w-4" />, label: "Bibliography and in-text citations" },
  ];

  const exportFormats = [
    { name: "Word (.docx)", icon: <FileText className="h-3 w-3" /> },
    { name: "PDF (.pdf)", icon: <FileSpreadsheet className="h-3 w-3" /> },
    { name: "BibTeX (.bib)", icon: <FileCode className="h-3 w-3" /> },
    { name: "RIS (.ris)", icon: <FileJson className="h-3 w-3" /> },
  ];

  // Bibliography Settings
  const [settings, setSettings] = React.useState({
    alphabetical: true,
    hangingIndent: true,
    doubleSpaced: false,
    showUrls: true,
    font: "Serif",
    textSize: "Medium",
    sortBy: "Author",
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-transparent font-sans text-black dark:text-white transition-colors duration-300">
      {/* 
        Navbar 
        - Increased size
      */}
      <nav className="sticky top-0 z-50 flex w-full h-16 items-center justify-between px-6 sm:px-8 lg:px-12 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#407bc4]">Baby</span>
              <span className="text-[#f58e58]">bib</span>
            </span>
          </Link>
          {/* Nav Links */}
          <div className="hidden lg:flex items-center ml-4">
            <NavLinks />
          </div>
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
          <div className="flex flex-col gap-8">

            <button className="flex h-9 w-32 mx-auto items-center justify-center gap-1.5 rounded-full bg-[#407bc4] text-xs font-bold text-white hover:bg-[#32629e] active:scale-95 transition-all shadow-sm mb-2">
              <Plus className="h-3.5 w-3.5" /> Add new
            </button>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-[#407bc4]/10 dark:bg-[#407bc4]/20">
                  <BookOpen className="h-3 w-3 text-[#407bc4] dark:text-[#6ba1e6]" />
                </div>
                <span className="text-sm font-bold">Project</span>
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
              </ul>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800">
                  <Triangle className="h-2.5 w-2.5 text-zinc-500" />
                </div>
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Latest bibliography</span>
              </div>
              <ul className="flex flex-col gap-1.5 border-l border-zinc-200 dark:border-zinc-800 ml-2.5 pl-4 pb-4">
                {citations.slice(0, 5).map((citation) => (
                  <li key={citation.id} className="flex items-start text-[13px] text-zinc-500 dark:text-zinc-400 hover:text-[#407bc4] dark:hover:text-[#6ba1e6] cursor-pointer transition-colors truncate">
                    <span className="truncate">{citation.inText.replace(/[()]/g, '')} ...</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 ml-2.5 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                <button className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-[#407bc4] transition-colors group">
                  <Archive className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" /> Archived Projects
                </button>
                <button className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-red-500 transition-colors group">
                  <Trash className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" /> Recently deleted
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
               <div className="flex items-center gap-2">
                 <div className="flex h-5 w-5 items-center justify-center rounded bg-[#407bc4]/10 dark:bg-[#407bc4]/20 text-[#407bc4]">
                   <Settings2 className="h-3 w-3" />
                 </div>
                 <span className="text-sm font-bold">Bibliography Settings</span>
               </div>
               
               <div className="flex flex-col gap-5 pl-7">
                  {/* Toggles */}
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 transition-colors">Alphabetical</span>
                      <input type="checkbox" className="sr-only" checked={settings.alphabetical} onChange={() => toggleSetting('alphabetical')} />
                      <div className={`w-8 h-4 rounded-full transition-colors relative ${settings.alphabetical ? 'bg-[#407bc4]' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.alphabetical ? 'translate-x-4' : ''}`} />
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 transition-colors">Double spaced</span>
                      <input type="checkbox" className="sr-only" checked={settings.doubleSpaced} onChange={() => toggleSetting('doubleSpaced')} />
                      <div className={`w-8 h-4 rounded-full transition-colors relative ${settings.doubleSpaced ? 'bg-[#407bc4]' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${settings.doubleSpaced ? 'translate-x-4' : ''}`} />
                      </div>
                    </label>
                  </div>

                  {/* New Dropdown Settings */}
                  <div className="flex flex-col gap-3 pb-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                        <Type className="h-3 w-3" /> Font Family
                      </div>
                      <select 
                        value={settings.font}
                        onChange={(e) => setSettings(prev => ({...prev, font: e.target.value}))}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#407bc4] transition-all"
                      >
                        <option>Serif</option>
                        <option>Sans-serif</option>
                        <option>Mono</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                        <List className="h-3 w-3" /> Text Size
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {['Small', 'Medium', 'Large'].map((size) => (
                          <button 
                            key={size}
                            onClick={() => setSettings(prev => ({...prev, textSize: size}))}
                            className={`py-1 text-[10px] font-medium rounded-md border transition-all ${
                              settings.textSize === size 
                                ? 'bg-[#407bc4] text-white border-[#407bc4]' 
                                : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                        <ArrowDownAz className="h-3 w-3" /> Sort By
                      </div>
                      <select 
                        value={settings.sortBy}
                        onChange={(e) => setSettings(prev => ({...prev, sortBy: e.target.value}))}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#407bc4] transition-all"
                      >
                        <option>Author</option>
                        <option>Publication Year</option>
                        <option>Title</option>
                        <option>Recently Added</option>
                      </select>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 pt-4 mt-auto mx-auto pb-4">
              <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                Made by <span className="font-bold"><span className="text-[#407bc4]">Baby</span><span className="text-[#f58e58]">bib</span></span>
              </span>
              <div className="flex items-center gap-3 text-[10px] text-zinc-400 dark:text-zinc-600 font-medium">
                <Link href="#" className="hover:text-[#407bc4] transition-colors">Privacy</Link>
                <Link href="#" className="hover:text-[#407bc4] transition-colors">Terms</Link>
                <Link href="#" className="hover:text-[#407bc4] transition-colors">About</Link>
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
                  className="w-full h-11 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-12 pr-16 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-[#407bc4]/5 dark:focus:ring-[#407bc4]/10 focus:border-[#407bc4] transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                  <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-5 -mt-4">
              <div className="relative">
                <button 
                  onClick={() => setIsStyleOpen(!isStyleOpen)}
                  className="flex h-8 items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-800"
                >
                  <span className="text-zinc-400">Style:</span> {style}
                  <ChevronDown className={`h-3 w-3 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isStyleOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsStyleOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-64 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg z-50 overflow-hidden flex flex-col">
                      <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                        <p className="text-[10px] text-zinc-500 leading-relaxed">
                          Choose a style format your bibliography and citation. <Link href="#" className="text-[#407bc4] hover:underline">Learn More</Link>
                        </p>
                      </div>
                      <div className="py-1">
                        {styles.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setStyle(s);
                              setIsStyleOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${style === s ? 'text-[#407bc4] font-bold bg-zinc-50 dark:bg-zinc-800/50' : 'text-zinc-600 dark:text-zinc-400'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div className="px-3 py-2 border-t border-zinc-100 dark:border-zinc-800">
                        <button className="flex items-center justify-between w-full text-[10px] font-bold text-[#407bc4] hover:underline group">
                          <span>More Citation styles</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* View Mode Selector - Centered */}
              <div className="flex-1 flex justify-center items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">view</span>
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  {views.map((view) => (
                    <div key={view.id} className="relative group">
                      <button
                        onClick={() => setViewMode(view.id)}
                        className={`flex h-7 w-9 items-center justify-center rounded-md transition-all ${
                          viewMode === view.id 
                            ? "bg-white dark:bg-zinc-700 text-[#407bc4] shadow-sm" 
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        {view.icon}
                      </button>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                        {view.label}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="flex h-8 items-center gap-2 rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-800"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="flex h-8 items-center gap-1 rounded-md bg-[#407bc4] pl-3 pr-2 text-xs font-medium text-white hover:bg-[#32629e] transition-colors shadow-sm"
                  >
                    <Download className="h-3 w-3 mr-1" /> Export <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isExportOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                      <div className="absolute top-full right-0 mt-1 w-40 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg z-50 py-1 overflow-hidden">
                        {exportFormats.map((format) => (
                          <button
                            key={format.name}
                            onClick={() => setIsExportOpen(false)}
                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <span className="text-zinc-400">{format.icon}</span>
                            {format.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* References Paper Area */}
            <div className="relative w-full min-h-[600px] bg-white dark:bg-[#1c1c1e] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col pt-12">
              
              {/* Box Toolbar */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button className="flex h-7 px-3 items-center gap-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors uppercase tracking-tight">
                  <RotateCw className="h-3 w-3" /> Refresh
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-all shadow-sm ${
                      isSettingsOpen 
                        ? "bg-[#407bc4] text-white" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </button>

                  {isSettingsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-50 overflow-hidden flex flex-col translate-y-0 opacity-100 transition-all">
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <Settings2 className="h-3.5 w-3.5 text-[#407bc4]" /> Bibliography Settings
                          </span>
                        </div>
                        
                        <div className="p-2 flex flex-col gap-1">
                          {[
                            { id: 'alphabetical', label: 'Sort Alphabetically', desc: 'Order by author last name' },
                            { id: 'hangingIndent', label: 'Hanging Indent', desc: 'Second line indentation' },
                            { id: 'doubleSpaced', label: 'Double Spacing', desc: 'Increase vertical spacing' },
                            { id: 'showUrls', label: 'Show URLs / DOI', desc: 'Display electronic links' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => toggleSetting(item.id as keyof typeof settings)}
                              className="flex items-center justify-between w-full p-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group text-left"
                            >
                              <div className="flex flex-col">
                                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                  {item.label}
                                </span>
                                <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                                  {item.desc}
                                </span>
                              </div>
                              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${settings[item.id as keyof typeof settings] ? 'bg-[#407bc4]' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${settings[item.id as keyof typeof settings] ? 'translate-x-3.5' : 'translate-x-0'}`} />
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-start gap-2">
                            <Info className="h-3 w-3 text-[#407bc4] mt-0.5 shrink-0" />
                            <p className="text-[9px] text-zinc-500 leading-tight">
                              These settings applied to the current bibliography view. Changes are saved automatically.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Paper Content */}
              <div 
                className={`px-24 py-16 max-w-5xl mx-auto w-full transition-all duration-300 ${
                  settings.font === 'Serif' ? 'font-serif' : settings.font === 'Mono' ? 'font-mono' : 'font-sans'
                } ${
                  settings.textSize === 'Small' ? 'text-sm' : settings.textSize === 'Large' ? 'text-lg' : 'text-base'
                }`}
              >
                <h2 className="text-2xl font-serif text-center mb-12 text-zinc-900 dark:text-zinc-100 italic">References</h2>
                
                {citations.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {citations.map((citation, index) => (
                      <div 
                        key={citation.id} 
                        draggable
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        className="group relative flex items-start gap-4 p-4 -mx-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-default"
                      >
                        {/* Drag Handle */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700">
                          <GripVertical className="h-4 w-4" />
                        </div>

                        <div 
                          className={`flex-1 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 transition-all ${
                            viewMode === "Bibliography" || viewMode === "Bibliography and in-text citations"
                              ? (settings.hangingIndent ? 'pl-8 -indent-8' : '')
                              : ''
                          }`}
                          style={{ lineHeight: settings.doubleSpaced ? '2.5' : '1.8' }}
                        >
                          {viewMode === "Bibliography" && (
                            <div>{citation.content}</div>
                          )}
                          
                          {viewMode === "Plain list" && (
                            <div className="flex items-center gap-3">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#407bc4] shrink-0" />
                              {citation.content}
                            </div>
                          )}

                          {viewMode === "Bibliography and in-text citations" && (
                            <div className="flex flex-col gap-3">
                              <div>{citation.content}</div>
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50/80 dark:bg-[#407bc4]/10 border border-blue-200/60 dark:border-[#407bc4]/30 rounded-full w-fit group cursor-help transition-all hover:bg-white dark:hover:bg-[#407bc4]/20 shadow-sm border-dashed">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center border border-blue-100 dark:border-[#407bc4]/20 shadow-xs">
                                  <Quote className="h-2.5 w-2.5 text-[#407bc4] fill-[#407bc4]/10" />
                                </div>
                                <span className="text-[12px] font-bold text-[#407bc4] tracking-tight leading-none">
                                  {citation.inText}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Hover Actions - Positioned at bottom right to avoid overlap */}
                        <div className="absolute bottom-2 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                          <button className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#407bc4] hover:border-[#407bc4] transition-all shadow-sm" title="Edit">
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#407bc4] hover:border-[#407bc4] transition-all shadow-sm" title="In-text citation">
                            <Quote className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleItemCopy(citation.id)}
                            className={`h-7 w-7 flex items-center justify-center rounded-full border transition-all shadow-sm ${
                              copiedId === citation.id 
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400" 
                                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#407bc4] hover:border-[#407bc4]"
                            }`} 
                            title="Copy"
                          >
                            {copiedId === citation.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                          <button 
                            onClick={() => deleteCitation(citation.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm" title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-20 w-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800">
                      <Library className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No citations yet</h3>
                    <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                      Search above or use the "Add new" button to start building your bibliography.
                    </p>
                  </div>
                )}
              </div>

              {/* Watermark/Footer on paper */}
              <div className="mt-auto py-8 text-center border-t border-zinc-50 dark:border-zinc-900/50">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-800 font-bold">Generated by Babybib</span>
              </div>
            </div>

          </div>
        </main>

        {/* Right Sidebar (Registration CTA) */}
        <aside className="hidden xl:sticky top-16 z-30 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto py-6 xl:block xl:w-[240px] 2xl:w-[280px] pr-6 sm:pr-8 lg:pr-12">
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">

              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {language === 'TH' ? 'สมัครสมาชิกฟรี' : 'Join for Free'}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
                {language === 'TH' 
                  ? 'สร้างบรรณานุกรมของคุณให้ปลอดภัย และเข้าถึงได้จากทุกที่ทุกเวลา' 
                  : 'Save your bibliographies securely and access them from anywhere, anytime.'}
              </p>
              <button className="w-full py-2.5 px-4 bg-[#407bc4] text-white text-[11px] font-bold rounded-full hover:bg-[#32629e] transition-all shadow-sm active:scale-95 mb-5 group">
                {language === 'TH' ? 'รับสิทธิพิเศษตอนนี้' : 'Get exclusive access'} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              

            </div>
            
            <div className="p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 opacity-60">
               <p className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center italic leading-relaxed">
                 {language === 'TH' ? '"เครื่องมือที่ช่วยให้งานวิจัยของคุณง่ายขึ้น"' : '"The tool that makes your research easier"'}
               </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
