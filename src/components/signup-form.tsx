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

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  orgType: z.string().min(1, "Organization type is required"),
  otherOrgType: z.string().optional(),
  province: z.string().min(1, "Province is required"),
  orgName: z.string().optional(),
  isLisStudent: z.boolean().default(false),
  studentId: z.string().optional(),
  terms: z.boolean().refine(v => v === true, "You must agree to the terms"),
}).refine((data) => {
  if (data.orgType === "อื่นๆ" && !data.otherOrgType) return false;
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

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        window.location.href = "/login";
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-[1.2fr_0.8fr]">
          <form className="p-6 md:p-10" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-start gap-2 text-left mb-4">
                <Logo />
                <h1 className="text-2xl font-bold mt-4">Join Babybib</h1>
                <p className="text-sm text-muted-foreground">
                  Create your account to start managing citations
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input id="firstName" {...register("firstName")} placeholder="John" />
                  {errors.firstName && <span className="text-xs text-destructive mt-1">{errors.firstName.message}</span>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                  {errors.lastName && <span className="text-xs text-destructive mt-1">{errors.lastName.message}</span>}
                </Field>
              </div>
              
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" {...register("username")} placeholder="johndoe" />
                {errors.username && <span className="text-xs text-destructive mt-1">{errors.username.message}</span>}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" {...register("email")} type="email" placeholder="m@example.com" />
                {errors.email && <span className="text-xs text-destructive mt-1">{errors.email.message}</span>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" {...register("password")} type="password" />
                {errors.password && <span className="text-xs text-destructive mt-1">{errors.password.message}</span>}
              </Field>
              
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Org Type</FieldLabel>
                  <Select onValueChange={(value) => setValue("orgType", value as any)}>
                    <SelectTrigger className="w-full h-10 bg-background">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-white dark:bg-zinc-950 border shadow-xl">
                      {ORG_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.orgType && <span className="text-xs text-destructive mt-1">{errors.orgType.message}</span>}
                </Field>

                <Field>
                  <FieldLabel>Province</FieldLabel>
                  <Select onValueChange={(value) => setValue("province", value as any)}>
                    <SelectTrigger className="w-full h-10 bg-background">
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-white dark:bg-zinc-950 border shadow-xl max-h-[300px]">
                      {PROVINCES.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province && <span className="text-xs text-destructive mt-1">{errors.province.message}</span>}
                </Field>
              </div>

              {orgType === "อื่นๆ" && (
                <Field className="animate-in fade-in slide-in-from-top-1">
                  <FieldLabel htmlFor="otherOrgType">Please specify</FieldLabel>
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
                  <FieldLabel htmlFor="isLisStudent" className="text-sm font-normal leading-none cursor-pointer">
                    LIS student at Faculty of Humanities, CMU
                  </FieldLabel>
                </div>

                {isLisStudent && (
                  <Field className="animate-in fade-in slide-in-from-top-1 ml-6">
                    <FieldLabel htmlFor="studentId">Student ID</FieldLabel>
                    <Input id="studentId" {...register("studentId")} className="h-9" />
                    {errors.studentId && <span className="text-xs text-destructive mt-1">{errors.studentId.message}</span>}
                  </Field>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    onCheckedChange={(checked) => setValue("terms", checked as boolean)}
                  />
                  <FieldLabel htmlFor="terms" className="text-sm font-normal leading-none cursor-pointer">
                    I agree to the <a href="#" className="underline">Terms</a>
                  </FieldLabel>
                </div>
                {errors.terms && <span className="text-xs text-destructive mt-1">{errors.terms.message}</span>}
              </div>

              <Field>
                <Button type="submit" className="w-full bg-[#407bc4] hover:bg-[#32629e] transition-all h-11 text-base font-medium" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
                <FieldDescription className="text-center pt-2">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#407bc4] hover:underline underline-offset-4 font-medium">
                    Login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1000"
              alt="Signup Background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-[#407bc4]/10" />
            <div className="absolute bottom-10 left-10 p-6 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 max-w-[80%] hidden lg:block">
              <p className="text-white text-lg font-medium italic">
                "Babybib helps me organize my academic citations in seconds. It's truly a game changer for researchers."
              </p>
              <footer className="text-white/80 text-sm mt-2">— Happy Researcher</footer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
