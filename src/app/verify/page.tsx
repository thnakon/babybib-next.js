"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageDropdown } from "@/components/language-dropdown"

export default function VerifyPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user && (session.user as any).emailVerified) {
      router.push("/generate")
    }
  }, [status, session, router])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const verifyOtp = async () => {
    const code = otp.join("")
    if (code.length !== 6) return

    setVerifying(true)
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email, code }),
      })

      if (res.ok) {
        toast.success("Email verified successfully")
        // Force session update with the new status
        await update({ emailVerified: new Date() })
        // Use window.location.href to ensure middleware sees the new session state
        window.location.href = "/generate"
      } else {
        const errorData = await res.json()
        console.error("Verification error response:", errorData)
        toast.error(errorData.message || "Invalid verification code")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setVerifying(false)
    }
  }

  const resendOtp = async () => {
    if (!session?.user?.email) {
        toast.error("User email not found in session")
        return
    }
    setResending(true)
    try {
      const res = await fetch("/api/verify/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email }),
      })

      if (res.ok) {
        toast.success("New verification code sent to your email")
      } else {
        const errorData = await res.json()
        console.error("Resend error response:", errorData)
        const errorMsg = errorData.error ? (typeof errorData.error === 'object' ? JSON.stringify(errorData.error) : errorData.error) : (errorData.message || "Failed to resend code")
        toast.error(`Error: ${errorMsg}`)
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setResending(false)
    }
  }

  if (status === "loading") return null

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10 font-sans">
      <div className="absolute top-6 right-6 z-50 flex items-center gap-1">
        <LanguageDropdown />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm md:max-w-md z-10">
        <Card className="overflow-hidden p-0 border-none shadow-2xl bg-card text-card-foreground">
          <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 text-center">
            <div className="size-16 rounded-full bg-[#407bc4]/10 flex items-center justify-center mb-6">
              <Mail className="size-8 text-[#407bc4]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Verify your email</h1>
            <p className="text-muted-foreground mb-8">
              We've sent a 6-digit verification code to <br />
              <span className="text-foreground font-semibold">{session?.user?.email}</span>
            </p>

            <div className="flex gap-2 mb-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="size-11 sm:size-12 text-center text-xl font-bold rounded-lg border border-input bg-background focus:border-[#407bc4] focus:ring-2 focus:ring-[#407bc4]/20 outline-none transition-all"
                />
              ))}
            </div>

            <Button 
              onClick={verifyOtp} 
              disabled={otp.join("").length !== 6 || verifying}
              className="w-full bg-[#407bc4] hover:bg-[#32629e] h-11 text-base font-bold shadow-md border-none mb-4"
            >
              {verifying ? "Verifying..." : "Verify & Continue"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button 
                onClick={resendOtp}
                disabled={resending}
                className="text-[#407bc4] font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend code"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
