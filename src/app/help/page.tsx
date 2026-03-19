"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Search, HelpCircle, ChevronRight, 
  MessageCircle, Mail, ExternalLink, ArrowRight,
  Sparkles, Zap, ShieldCheck, Download, List, Globe, Book, PenTool, Layout, FileText
} from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NavLinks } from "@/components/nav-links";
import { UserNav } from "@/components/user-nav";
import { Footer } from "@/components/footer";

export default function HelpPage() {
  const { language } = useLanguage();
  const t = translations[language].help;
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
    { id: "getting-started", label: t.gettingStarted.title, icon: <Zap className="h-4 w-4" /> },
    { id: "features", label: t.features.title, icon: <Sparkles className="h-4 w-4" /> },
    { id: "faq", label: t.faq.title, icon: <HelpCircle className="h-4 w-4" /> },
    { id: "contact", label: t.sections.contact, icon: <MessageCircle className="h-4 w-4" /> },
  ];

  const onThisPage = [
    { id: "getting-started", label: t.gettingStarted.title },
    { id: "features", label: t.features.title },
    { id: "faq", label: t.faq.title },
    { id: "contact", label: t.sections.contact },
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

    onThisPage.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onThisPage]);

  // Search indexing
  const searchableContent = React.useMemo(() => {
    const results: { sectionId: string; title: string; text: string; id: string }[] = [];
    
    // Getting Started
    t.gettingStarted.steps.forEach((step, idx) => {
      results.push({ sectionId: "getting-started", title: `${t.gettingStarted.title} - Step ${idx + 1}`, text: step, id: `step-${idx}` });
    });

    // Features
    results.push({ sectionId: "features", title: "Smart Search", text: t.features.smartSearch, id: "feat-search" });
    results.push({ sectionId: "features", title: "AI Scanner", text: t.features.aiScan, id: "feat-ai" });
    results.push({ sectionId: "features", title: "Projects", text: t.features.projects, id: "feat-proj" });
    results.push({ sectionId: "features", title: "Export", text: t.features.export, id: "feat-export" });

    // FAQ
    results.push({ sectionId: "faq", title: t.faq.q1, text: t.faq.a1, id: "faq-1" });
    results.push({ sectionId: "faq", title: t.faq.q2, text: t.faq.a2, id: "faq-2" });
    results.push({ sectionId: "faq", title: t.faq.q3, text: t.faq.a3, id: "faq-3" });

    return results;
  }, [t]);

  const filteredResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchableContent.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.text.toLowerCase().includes(q)
    );
  }, [searchQuery, searchableContent]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100">
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
            <nav className="sticky top-32 space-y-1">
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-3">
                {t.sections.guide}
              </div>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setSearchQuery("");
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeSection === section.id && !searchQuery
                      ? "bg-[#407bc4]/10 text-[#407bc4] dark:bg-[#407bc4]/20 dark:text-[#6ba1e6]"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Center Content */}
          <div className="flex-1 max-w-3xl">
            <div className="space-y-12">
              <header className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                  {searchQuery ? "Search Results" : (activeSection === "introduction" ? t.title : sections.find(s => s.id === activeSection)?.label)}
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  {searchQuery ? `Found ${filteredResults.length} matches for "${searchQuery}"` : (activeSection === "introduction" ? t.description : "")}
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
                            setActiveSection(result.sectionId);
                            setSearchQuery("");
                            setTimeout(() => {
                              const el = document.getElementById(result.sectionId);
                              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#407bc4] bg-[#407bc4]/5 px-2 py-0.5 rounded">
                              {result.sectionId.replace('-', ' ')}
                            </span>
                            <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-[#407bc4] transition-colors" />
                          </div>
                          <h3 className="font-semibold mb-1 group-hover:text-[#407bc4] transition-colors">{result.title}</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{result.text}</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <HelpCircle className="h-12 w-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No results found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Try searching for something else like "PDF" or "guest".</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-16"
                    >
                      {activeSection === "introduction" || activeSection === "getting-started" ? (
                        <section id="getting-started" className="scroll-mt-32 space-y-6">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-600 dark:text-orange-400">
                              <Zap className="h-5 w-5" />
                            </span>
                            <h2 className="text-2xl font-bold">{t.gettingStarted.title}</h2>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {t.gettingStarted.intro}
                          </p>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {t.gettingStarted.steps.map((step, idx) => (
                              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:translate-y-[-2px] transition-transform">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#407bc4] text-[10px] font-bold text-white">
                                  {idx + 1}
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-snug">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>
                      ) : null}

                      {(activeSection === "introduction" || activeSection === "features") && (
                        <section id="features" className="scroll-mt-32 space-y-6">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 dark:text-blue-400">
                              <Sparkles className="h-5 w-5" />
                            </span>
                            <h2 className="text-2xl font-bold">{t.features.title}</h2>
                          </div>
                          <div className="space-y-4">
                            <FeatureItem icon={<Search className="h-4 w-4" />} title="Smart Search" description={t.features.smartSearch} />
                            <FeatureItem icon={<FileText className="h-4 w-4" />} title="AI Scanner" description={t.features.aiScan} />
                            <FeatureItem icon={<Layout className="h-4 w-4" />} title="Projects" description={t.features.projects} />
                            <FeatureItem icon={<Download className="h-4 w-4" />} title="Export" description={t.features.export} />
                          </div>
                        </section>
                      )}

                      {(activeSection === "introduction" || activeSection === "faq") && (
                        <section id="faq" className="scroll-mt-32 space-y-8">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 dark:text-emerald-400">
                              <HelpCircle className="h-5 w-5" />
                            </span>
                            <h2 className="text-2xl font-bold">{t.faq.title}</h2>
                          </div>
                          <div className="grid gap-6">
                            <FaqItem question={t.faq.q1} answer={t.faq.a1} />
                            <FaqItem question={t.faq.q2} answer={t.faq.a2} />
                            <FaqItem question={t.faq.q3} answer={t.faq.a3} />
                          </div>
                        </section>
                      )}

                      {activeSection === "contact" && (
                        <section id="contact" className="scroll-mt-32 space-y-8">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-purple-600 dark:text-purple-400">
                              <MessageCircle className="h-5 w-5" />
                            </span>
                            <h2 className="text-2xl font-bold">{t.sections.contact}</h2>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                             <a href="mailto:support@babybib.com" className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-[#407bc4]/50 transition-all group">
                                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 shadow-sm transition-colors group-hover:text-[#407bc4]">
                                  <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-bold">Email Support</h3>
                                  <p className="text-sm text-zinc-500">support@babybib.com</p>
                                </div>
                             </a>
                             <a href="#" className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-[#f58e58]/50 transition-all group">
                                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 shadow-sm transition-colors group-hover:text-[#f58e58]">
                                  <MessageCircle className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-bold">Live Chat</h3>
                                  <p className="text-sm text-zinc-500">Mon-Fri, 9am - 6pm</p>
                                </div>
                             </a>
                          </div>
                        </section>
                      )}

                      <div className="pt-12 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                        <Link href="/" className="flex flex-col gap-1 group">
                          <span className="text-xs text-zinc-500">{t.sections.support}</span>
                          <span className="text-sm font-semibold group-hover:text-[#407bc4] transition-colors">← Back Home</span>
                        </Link>
                        <Link href="/generate" className="flex flex-col items-end gap-1 group">
                          <span className="text-xs text-zinc-500">{navT.generate}</span>
                          <span className="text-sm font-semibold group-hover:text-[#f58e58] transition-colors flex items-center gap-1">
                            Start Generating <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
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
                {onThisPage.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        const targetId = item.id;
                        setActiveSection(targetId === "contact" ? "contact" : (targetId === "features" ? "features" : (targetId === "faq" ? "faq" : "getting-started")));
                        setTimeout(() => {
                           const el = document.getElementById(item.id);
                           if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 50);
                      }}
                      className={`block text-xs transition-colors py-1 text-left ${
                        activeOnPage === item.id 
                          ? "text-[#407bc4] font-bold border-l-2 border-[#407bc4] -ml-[13px] pl-3" 
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-[#407bc4]/5 to-[#f58e58]/5 border border-[#407bc4]/10 dark:border-[#407bc4]/20">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Need more help?</p>
                <Link href="/contact" className="text-xs font-bold text-[#407bc4] hover:underline flex items-center gap-1">
                  Contact Support <ExternalLink className="h-2.5 w-2.5" />
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm group-hover:border-[#407bc4]/50 transition-colors text-zinc-400 group-hover:text-[#407bc4]">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold group-hover:text-[#407bc4] transition-colors">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="space-y-2 group">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#407bc4] transition-colors">
        {question}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
