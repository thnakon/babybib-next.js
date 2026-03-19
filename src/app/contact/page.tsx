"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Mail, MessageCircle, Send, ArrowLeft, 
  ChevronRight, Globe, Github, Twitter, 
  CheckCircle2, Sparkles, HelpCircle
} from "lucide-react";
import { useLanguage } from "@/components/language-context";
import { translations } from "@/lib/translations";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NavLinks } from "@/components/nav-links";
import { UserNav } from "@/components/user-nav";
import { Footer } from "@/components/footer";
import { toast } from "sonner";

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const commonT = translations[language].common;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success(t.form.success);

    // Reset success after 5 seconds to show form again or just stay
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 selection:bg-[#407bc4]/10 selection:text-[#407bc4]">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 flex w-full h-16 items-center justify-between px-6 sm:px-8 lg:px-12 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-100/50 dark:border-zinc-800/50 shadow-sm"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-md transition-transform group-hover:scale-105">
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

      <main className="relative overflow-hidden pt-16 pb-24">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#407bc4]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f58e58]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <Link href="/help" className="inline-flex items-center gap-2 text-sm font-medium text-[#407bc4] hover:underline mb-4">
                  <ArrowLeft className="h-4 w-4" /> {t.backToHelp}
                </Link>
                <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-zinc-900 dark:text-white leading-[1.1]">
                  {t.title}
                </h1>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                  {t.description}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <ContactOption 
                  icon={<Mail className="h-6 w-6 text-[#407bc4]" />} 
                  title={t.options.email.title} 
                  desc={t.options.email.desc}
                  href="mailto:support@babybib.com"
                />
                <ContactOption 
                  icon={<MessageCircle className="h-6 w-6 text-[#f58e58]" />} 
                  title={t.options.chat.title} 
                  desc={t.options.chat.desc}
                  href="/help"
                />
              </div>

              <div className="pt-10 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">{t.trustedBy}</h3>
                <div className="flex flex-wrap gap-8 items-center grayscale opacity-50 dark:invert">
                   {/* Simplified brand logos or placeholders */}
                   <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                   <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                   <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#407bc4] to-[#f58e58] rounded-[2.5rem] blur opacity-10" />
              <div className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-[#407bc4]/5">
                
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold">{t.form.success}</h2>
                    <p className="text-zinc-500 max-w-xs mx-auto">
                      {t.successDesc}
                    </p>
                    <button 
                      onClick={() => setIsSuccess(false)}
                      className="mt-8 text-sm font-bold text-[#407bc4] hover:underline"
                    >
                      {t.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormGroup label={t.form.name}>
                        <input 
                          required 
                          placeholder={t.form.namePlaceholder} 
                          className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#407bc4]/50 transition-all"
                        />
                      </FormGroup>
                      <FormGroup label={t.form.email}>
                        <input 
                          required 
                          type="email" 
                          placeholder={t.form.emailPlaceholder} 
                          className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#407bc4]/50 transition-all"
                        />
                      </FormGroup>
                    </div>
                    
                    <FormGroup label={t.form.subject}>
                      <input 
                        required 
                        placeholder={t.form.subjectPlaceholder} 
                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#407bc4]/50 transition-all"
                      />
                    </FormGroup>

                    <FormGroup label={t.form.message}>
                      <textarea 
                        required 
                        rows={5} 
                        placeholder={t.form.messagePlaceholder} 
                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#407bc4]/50 transition-all resize-none"
                      />
                    </FormGroup>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#407bc4] hover:bg-[#3569a7] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#407bc4]/20 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          {t.form.submit}
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-xs text-zinc-500 px-4">
                      {t.privacyNote.start}
                      <Link href="/privacy" className="underline">
                        {String(t.privacyNote.link)}
                      </Link>
                      {t.privacyNote.end}
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-100 dark:border-zinc-800 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
           <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-100 dark:border-zinc-700 shadow-sm">
             <HelpCircle className="h-4 w-4 text-[#407bc4]" />
             <span className="text-sm font-bold">{t.faqTitle}</span>
           </div>
           <h2 className="text-3xl font-bold">{t.selfServiceTitle}</h2>
           <p className="text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
             {t.selfServiceDesc}
           </p>
           <div className="flex items-center justify-center gap-4">
              <Link href="/help" className="px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold hover:shadow-md transition-all">
                {t.browseHelp}
              </Link>
              <Link href="/guides" className="px-6 py-3 text-[#407bc4] font-bold hover:underline flex items-center gap-1">
                {t.citationGuides} <ChevronRight className="h-4 w-4" />
              </Link>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactOption({ icon, title, desc, href }: { icon: React.ReactNode, title: string, desc: string, href: string }) {
  return (
    <a href={href} className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-[#407bc4] transition-all">
      <div className="h-12 w-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-zinc-500">{desc}</p>
    </a>
  );
}

function FormGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">{label}</label>
      {children}
    </div>
  );
}
