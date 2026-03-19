"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NavLinks } from "@/components/nav-links";
import { UserNav } from "@/components/user-nav";
import { Footer } from "@/components/footer";
import { useParams, usePathname } from "next/navigation";
import { Book, PenTool, List, Mail, MessageCircle, ExternalLink } from "lucide-react";

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const t = translations[language].guides;
  const params = useParams();
  const selectedStyleId = params.slug || "apa";

  const styles = [
    { id: "apa", label: "APA - 7th Edition" },
    { id: "mla", label: "MLA - 9th Edition" },
    { id: "harvard", label: "Harvard" },
    { id: "chicago", label: "Chicago" },
    { id: "ama", label: "AMA" },
    { id: "cse", label: "CSE" },
    { id: "thaiSarabun", label: "Thai Sarabun" },
  ];

  const onThisPage = [
    { id: "overview", label: t.ui.overview },
    { id: "in-text", label: t.ui.inText },
    { id: "bibliography", label: t.ui.bibliography },
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
              <div className="mb-6 px-3">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#407bc4] dark:text-[#6ba1e6]">Citation Styles</h2>
              </div>
              {styles.map((style) => (
                <Link
                  key={style.id}
                  href={`/guides/${style.id}`}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    selectedStyleId === style.id
                      ? "text-[#407bc4] dark:text-[#6ba1e6] bg-[#407bc4]/5 dark:bg-[#407bc4]/10"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  {style.label}
                  {selectedStyleId === style.id && <motion.div layoutId="active-indicator" className="h-1.5 w-1.5 rounded-full bg-[#407bc4]" />}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Center Content Component */}
          <div className="flex-1 max-w-3xl">
            {children}
          </div>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-48 shrink-0">
            <nav className="sticky top-32 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 px-3">
                On this page
              </div>
              <ul className="space-y-2 px-3 border-l border-zinc-100 dark:border-zinc-800">
                {onThisPage.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`block text-xs transition-colors py-1 ${
                        activeOnPage === item.id 
                          ? "text-[#407bc4] font-bold border-l-2 border-[#407bc4] -ml-[13px] pl-3" 
                          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      {item.label}
                    </a>
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
