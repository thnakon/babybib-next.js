"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setLoading(true);
    // Mocking API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0 border-none shadow-2xl bg-card text-card-foreground">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="size-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-8 max-w-[300px]">
              We have sent a password reset link to your email address.
            </p>
            <Button className="w-full bg-[#407bc4] hover:bg-[#32629e] h-10 border-none shadow-md" onClick={() => window.location.href = "/login"}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-2xl bg-card text-card-foreground">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-start gap-2 text-left mb-4">
                <Logo />
                <h1 className="text-2xl font-bold tracking-tight mt-4">Reset Password</h1>
                <p className="text-balance text-muted-foreground font-medium">
                  Enter your email to receive a reset link
                </p>
              </div>
              
              <Field>
                <FieldLabel htmlFor="email">Email <span className="text-destructive">*</span></FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs text-destructive mt-1">{errors.email.message}</span>
                )}
              </Field>

              <Field>
                <Button type="submit" className="w-full bg-[#407bc4] hover:bg-[#32629e] transition-all h-10 border-none shadow-md" disabled={loading}>
                  {loading ? "Sending link..." : "Send Reset Link"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#407bc4] hover:underline underline-offset-4 pointer-events-auto font-medium">
                  <ArrowLeft className="size-4" />
                  Back to Login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-card md:block">
            <img
              src="https://images.unsplash.com/photo-1454165833767-0275ef84c1cc?auto=format&fit=crop&q=80&w=1000"
              alt="Password Reset Background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#407bc4]/10" />
            <div className="absolute bottom-6 left-6 p-4 backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-lg border border-white/20 dark:border-white/10 max-w-[85%] hidden lg:block">
              <p className="text-white text-sm font-medium italic">
                "Securing your citation workspace with easy account recovery."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-[11px] text-muted-foreground">
        Need help? Contact our <Link href="#" className="underline">support team</Link>.
      </FieldDescription>
    </div>
  )
}
