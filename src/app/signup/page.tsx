"use client"

import { SignupForm } from "@/components/signup-form"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between gap-2 md:justify-start">
          <Logo />
          <div className="flex items-center gap-2 lg:hidden">
             <LanguageDropdown />
             <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 justify-start">
            <LanguageDropdown />
            <ThemeToggle />
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
          alt="Office space"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
        />
      </div>
    </div>
  )
}
