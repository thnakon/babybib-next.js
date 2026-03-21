import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background font-sans">
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 md:p-10">
        {/* Top Left: Back to Home */}
        <div className="absolute top-6 left-6 z-50">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>

        {/* Top Right: Language and Theme */}
        <div className="absolute top-6 right-6 z-50 flex items-center gap-1">
          <LanguageDropdown />
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm md:max-w-4xl z-10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
