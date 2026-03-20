"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, List, Book, Layout, FileText,
  User, ShieldAlert, BookOpen, HelpCircle, MessageCircle,
  Search, ArrowRight, ExternalLink, Eye, Database, Share2, Lock, Fingerprint
} from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NavLinks } from "@/components/nav-links";
import { UserNav } from "@/components/user-nav";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const t = translations[language].privacy;
  const navT = translations[language].nav;
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeSection, setActiveSection] = React.useState("introduction");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sections = [
    { id: "introduction", label: t.sections.introduction, icon: <BookOpen className="h-4 w-4" /> },
    { id: "collection", label: t.sections.collection, icon: <Database className="h-4 w-4" /> },
    { id: "usage", label: t.sections.usage, icon: <Eye className="h-4 w-4" /> },
    { id: "sharing", label: t.sections.sharing, icon: <Share2 className="h-4 w-4" /> },
    { id: "security", label: t.sections.security, icon: <Lock className="h-4 w-4" /> },
    { id: "rights", label: t.sections.rights, icon: <Fingerprint className="h-4 w-4" /> },
  ];

  const [activeOnPage, setActiveOnPage] = React.useState("");

  // Scroll spy logic
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveOnPage(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-10% 0% -80% 0%" }
    );

    t.topics.forEach((_, i) => {
      const el = document.getElementById(`topic-${i}`);
      if (el) observer.observe(el);
    });
    
    const introEl = document.getElementById("intro-overview");
    if (introEl) observer.observe(introEl);

    return () => observer.disconnect();
  }, [t.topics]);

  const filteredResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return t.topics.map((topic, i) => ({ ...topic, id: `topic-${i}`, sectionId: "privacy-content" }))
      .filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.content.toLowerCase().includes(q)
      );
  }, [searchQuery, t.topics]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-anuphan">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 flex w-full h-16 items-center justify-between px-6 sm:px-8 lg:px-12 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-100/50 dark:border-zinc-800/50 shadow-sm"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority sizes="40px" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#407bc4]">Baby</span>
              <span className="text-[#f58e58]">bib</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center ml-4">
            <NavLinks />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageDropdown />
          <ThemeToggle />
          <UserNav />
        </div>
      </motion.nav>

      <main className="mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <nav className="sticky top-32 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    {navT.privacy}
                  </span>
                </div>

                <div className="relative border-l border-zinc-100 dark:border-zinc-800 ml-3 pl-4 space-y-1">
                  {sections.map((section) => {
                    const isActive = activeSection === section.id && !searchQuery;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setSearchQuery("");
                          const el = document.getElementById(section.id === "introduction" ? "intro-overview" : `topic-${sections.indexOf(section) - 1}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`group relative flex w-full items-center py-2 text-[15px] font-medium transition-all ${
                          isActive
                            ? "text-zinc-900 dark:text-white"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -left-[17.5px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#407bc4] dark:bg-[#407bc4] rounded-r-full"
                          />
                        )}
                        <span className="flex items-center gap-3">
                          <span className={`transition-colors ${isActive ? "text-[#407bc4]" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-400"}`}>
                            {section.icon}
                          </span>
                          {section.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </aside>

          {/* Center Content */}
          <div className="flex-1 max-w-3xl">
            <div className="space-y-12">
              <header className="space-y-4">
                <h1 className="text-[30px] font-bold tracking-tight">
                  {t.title}
                </h1>
                <p className="text-[18px] text-zinc-600 dark:text-zinc-400">
                  {t.description}
                </p>
              </header>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#407bc4]/10 to-[#f58e58]/10 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-sm group-focus-within:border-[#407bc4]/50 transition-all">
                  <Search className="h-5 w-5 text-zinc-400 shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t.searchPlaceholder}
                    className="ml-3 w-full bg-transparent outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 font-mono">⌘</span>
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 font-mono">K</span>
                  </div>
                </div>
              </div>

              <div className="space-y-16">
                {searchQuery ? (
                  <div className="space-y-6">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result) => (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={result.id}
                          className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-[#407bc4]/30 transition-all group cursor-pointer"
                          onClick={() => {
                            setSearchQuery("");
                            setTimeout(() => {
                              const el = document.getElementById(result.id);
                              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#407bc4] bg-[#407bc4]/5 px-2 py-0.5 rounded">
                              Privacy
                            </span>
                            <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-[#407bc4] transition-colors" />
                          </div>
                          <h3 className="font-semibold mb-1 group-hover:text-[#407bc4] transition-colors">{result.title}</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{result.content}</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <HelpCircle className="h-12 w-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No results found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Try searching for something else like "Security" or "Data Sharing".</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-16">
                    <section id="intro-overview" className="scroll-mt-32 space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 dark:text-blue-400">
                          <BookOpen className="h-5 w-5" />
                        </span>
                        <h2 className="text-[24px] font-bold">{t.intro.title}</h2>
                      </div>
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t.intro.overview}</p>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[17px]">
                          {t.intro.content}
                        </p>
                      </div>
                    </section>

                    <div className="space-y-12">
                      {t.topics.map((topic, i) => (
                        <section key={i} id={`topic-${i}`} className="scroll-mt-32 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group hover:border-[#407bc4]/30 transition-all">
                          <h3 className="text-lg font-bold mb-3 group-hover:text-[#407bc4] transition-colors">{topic.title}</h3>
                          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[16px]">{topic.content}</p>
                        </section>
                      ))}
                    </div>

                    <div className="pt-12 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                      <Link href="/" className="flex flex-col gap-1 group">
                        <span className="text-xs text-zinc-500">{navT.help}</span>
                        <span className="text-sm font-semibold group-hover:text-[#407bc4] transition-colors">← Back Home</span>
                      </Link>
                      <Link href="/terms" className="flex flex-col items-end gap-1 group">
                        <span className="text-xs text-zinc-500">{navT.terms}</span>
                        <span className="text-sm font-semibold group-hover:text-[#f58e58] transition-colors flex items-center gap-1">
                          Terms of Service <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="hidden xl:block w-48 shrink-0">
            <nav className="sticky top-32 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-3">
                <List className="h-3 w-3" />
                On this page
              </div>
              <ul className="space-y-2 px-3 border-l border-zinc-100 dark:border-zinc-800">
                <li key="intro-overview">
                  <button
                    onClick={() => {
                      document.getElementById("intro-overview")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`block text-xs transition-colors py-1 text-left ${activeOnPage === "intro-overview" ? "text-[#407bc4] font-bold border-l-2 border-[#407bc4] -ml-[13px] pl-3" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"}`}
                  >
                    {t.intro.title}
                  </button>
                </li>
                {t.topics.map((topic, i) => (
                  <li key={`topic-${i}`}>
                    <button
                      onClick={() => {
                        document.getElementById(`topic-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`block text-xs transition-colors py-1 text-left ${
                        activeOnPage === `topic-${i}` 
                          ? "text-[#407bc4] font-bold border-l-2 border-[#407bc4] -ml-[13px] pl-3" 
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      {topic.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
