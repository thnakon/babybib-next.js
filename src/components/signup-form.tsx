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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PROVINCES, ORG_TYPES } from "@/lib/constants/auth"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Eye, EyeOff, Mail, CheckCircle2 } from "lucide-react"

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  orgType: z.string().optional(),
  otherOrgType: z.string().optional(),
  province: z.string().optional(),
  orgName: z.string().optional(),
  isLisStudent: z.boolean(),
  studentId: z.string().optional(),
  terms: z.boolean().refine(v => v === true, "You must agree to the terms"),
}).refine((data) => {
  if (data.orgType === "Other" && !data.otherOrgType) return false;
  return true;
}, {
  message: "Please specify your organization type",
  path: ["otherOrgType"],
}).refine((data) => {
  if (data.isLisStudent && !data.studentId) return false;
  return true;
}, {
  message: "Student ID is required",
  path: ["studentId"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Signup, 2: Verification
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      orgType: "",
      province: "",
      isLisStudent: false,
      terms: false,
    }
  });

  const orgType = watch("orgType");
  const isLisStudent = watch("isLisStudent");
  const userEmail = watch("email");

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        // Instead of redirecting, go to verification step
        setStep(2);
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    setVerifying(true);
    // Dev mode: simulation
    setTimeout(() => {
      setVerifying(false);
      window.location.href = "/generate";
    }, 1500);
  };

  if (step === 2) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0 border-none shadow-2xl bg-card text-card-foreground">
          <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 text-center">
            <div className="size-16 rounded-full bg-[#407bc4]/10 flex items-center justify-center mb-6">
              <Mail className="size-8 text-[#407bc4]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Verify your email</h1>
            <p className="text-muted-foreground mb-8 max-w-[320px]">
              We've sent a 6-digit verification code to <span className="text-foreground font-semibold">{userEmail}</span>
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
              <button className="text-[#407bc4] font-semibold hover:underline">Resend code</button>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-2xl bg-card text-card-foreground">
        <CardContent className="grid p-0 md:grid-cols-[1.2fr_0.8fr]">
          <form className="p-6 md:p-10" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-start gap-2 text-left mb-4">
                <Logo />
                <h1 className="text-2xl font-bold mt-4 tracking-tight">Join Babybib</h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Create your account to start managing citations
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name <span className="text-destructive">*</span></FieldLabel>
                  <Input id="firstName" {...register("firstName")} placeholder="John" />
                  {errors.firstName && <span className="text-xs text-destructive mt-1">{errors.firstName.message}</span>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name <span className="text-destructive">*</span></FieldLabel>
                  <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                  {errors.lastName && <span className="text-xs text-destructive mt-1">{errors.lastName.message}</span>}
                </Field>
              </div>
              
              <Field>
                <FieldLabel htmlFor="username">Username <span className="text-destructive">*</span></FieldLabel>
                <Input id="username" {...register("username")} placeholder="johndoe" />
                {errors.username && <span className="text-xs text-destructive mt-1">{errors.username.message}</span>}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email <span className="text-destructive">*</span></FieldLabel>
                <Input id="email" {...register("email")} type="email" placeholder="m@example.com" />
                {errors.email && <span className="text-xs text-destructive mt-1">{errors.email.message}</span>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password <span className="text-destructive">*</span></FieldLabel>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    {...register("password")} 
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        watch("password")?.length >= 8 ? "bg-emerald-500" : "bg-muted",
                        watch("password")?.length > 0 && "w-1/2"
                      )} 
                    />
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        /[A-Z]/.test(watch("password") || "") ? "bg-emerald-500" : "bg-muted",
                        watch("password")?.length > 0 && "w-1/2"
                      )} 
                    />
                  </div>
                  <ul className="text-[11px] space-y-1">
                    <li className={cn(
                      "flex items-center gap-1.5 transition-colors",
                      watch("password")?.length >= 8 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                    )}>
                      <div className={cn("size-1 rounded-full", watch("password")?.length >= 8 ? "bg-emerald-500" : "bg-muted-foreground/30")} />
                      At least 8 characters
                    </li>
                    <li className={cn(
                      "flex items-center gap-1.5 transition-colors",
                      /[A-Z]/.test(watch("password") || "") ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                    )}>
                      <div className={cn("size-1 rounded-full", /[A-Z]/.test(watch("password") || "") ? "bg-emerald-500" : "bg-muted-foreground/30")} />
                      At least 1 uppercase letter (A-Z)
                    </li>
                  </ul>
                </div>
                {errors.password && <span className="text-xs text-destructive mt-1">{errors.password.message}</span>}
              </Field>
              
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Org Type</FieldLabel>
                  <Select onValueChange={(value) => setValue("orgType", value as any)}>
                    <SelectTrigger className="w-full h-10 bg-background border-input hover:bg-muted/30 transition-colors">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-popover text-popover-foreground border shadow-xl">
                      {ORG_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Province</FieldLabel>
                  <Select onValueChange={(value) => setValue("province", value as any)}>
                    <SelectTrigger className="w-full h-10 bg-background border-input hover:bg-muted/30 transition-colors">
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-popover text-popover-foreground border shadow-xl max-h-[300px]">
                      {PROVINCES.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {orgType === "Other" && (
                <Field className="animate-in fade-in slide-in-from-top-1">
                  <FieldLabel htmlFor="otherOrgType">Please specify <span className="text-destructive">*</span></FieldLabel>
                  <Input id="otherOrgType" {...register("otherOrgType")} />
                  {errors.otherOrgType && <span className="text-xs text-destructive mt-1">{errors.otherOrgType.message}</span>}
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="orgName">Organization Name (Optional)</FieldLabel>
                <Input id="orgName" {...register("orgName")} />
              </Field>

              <div className="space-y-3 py-2 border-y border-border/50">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isLisStudent" 
                    checked={isLisStudent}
                    onCheckedChange={(checked) => setValue("isLisStudent", checked as boolean)}
                  />
                  <FieldLabel htmlFor="isLisStudent" className="text-sm font-medium leading-none cursor-pointer">
                    LIS student at Faculty of Humanities, CMU
                  </FieldLabel>
                </div>

                {isLisStudent && (
                  <Field className="animate-in fade-in slide-in-from-top-1 ml-6">
                    <FieldLabel htmlFor="studentId">Student ID <span className="text-destructive">*</span></FieldLabel>
                    <Input id="studentId" {...register("studentId")} className="h-9" />
                    {errors.studentId && <span className="text-xs text-destructive mt-1">{errors.studentId.message}</span>}
                  </Field>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    onCheckedChange={(checked) => setValue("terms", checked as boolean)}
                  />
                  <FieldLabel htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
                    I agree to the <a href="#" className="underline font-bold">Terms</a> <span className="text-destructive">*</span>
                  </FieldLabel>
                </div>
                {errors.terms && <span className="text-xs text-destructive mt-1">{errors.terms.message}</span>}
              </div>

              <Field>
                <Button type="submit" className="w-full bg-[#407bc4] hover:bg-[#32629e] transition-all h-11 text-base font-bold shadow-md border-none" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
                <FieldDescription className="text-center pt-2">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#407bc4] hover:underline underline-offset-4 font-bold">
                    Login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-card md:block">
            <img
              src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1000"
              alt="Signup Background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#407bc4]/10" />
            <div className="absolute bottom-10 left-10 p-6 backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-xl border border-white/20 dark:border-white/10 max-w-[80%] hidden lg:block">
              <p className="text-white text-lg font-medium italic">
                "Babybib helps me organize my academic citations in seconds."
              </p>
              <footer className="text-white/80 text-sm mt-2">— Verified User</footer>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-[11px] text-muted-foreground">
        By continuing, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy</a>.
      </FieldDescription>
    </div>
  )
}
