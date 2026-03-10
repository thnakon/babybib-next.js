import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-[#407bc4]/5 blur-[120px] dark:bg-[#407bc4]/15" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] rounded-full bg-[#407bc4]/5 blur-[120px] dark:bg-[#407bc4]/15" />
      </div>

      {/* Top Left: Back to Home */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-background/50 backdrop-blur-sm p-2 rounded-md border border-border/50"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>

      {/* Top Right: Language and Theme */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-background/50 backdrop-blur-sm p-1.5 rounded-full border border-border/50 shadow-sm">
        <LanguageDropdown />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm md:max-w-4xl z-10">
        <LoginForm />
      </div>
    </div>
  )
}
