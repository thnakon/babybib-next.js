"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register("firstName")} placeholder="John" />
                  {errors.firstName && <span className="text-xs text-destructive">{errors.firstName.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                  {errors.lastName && <span className="text-xs text-destructive">{errors.lastName.message}</span>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register("username")} placeholder="johndoe" />
                {errors.username && <span className="text-xs text-destructive">{errors.username.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} type="email" placeholder="m@example.com" />
                {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" {...register("password")} type="password" />
                {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
              </div>
              
              <div className="grid gap-2">
                <Label>Organization Type</Label>
                <Select onValueChange={(value) => setValue("orgType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.orgType && <span className="text-xs text-destructive">{errors.orgType.message}</span>}
              </div>

              {orgType === "อื่นๆ" && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                  <Label htmlFor="otherOrgType">Please specify</Label>
                  <Input id="otherOrgType" {...register("otherOrgType")} />
                  {errors.otherOrgType && <span className="text-xs text-destructive">{errors.otherOrgType.message}</span>}
                </div>
              )}

              <div className="grid gap-2">
                <Label>Province</Label>
                <Select onValueChange={(value) => setValue("province", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PROVINCES.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && <span className="text-xs text-destructive">{errors.province.message}</span>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="orgName">Organization Name (Optional)</Label>
                <Input id="orgName" {...register("orgName")} />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <Checkbox 
                  id="isLisStudent" 
                  checked={isLisStudent}
                  onCheckedChange={(checked) => setValue("isLisStudent", checked as boolean)}
                />
                <Label htmlFor="isLisStudent" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  LIS student at Faculty of Humanities, Chiang Mai University
                </Label>
              </div>

              {isLisStudent && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" {...register("studentId")} />
                  {errors.studentId && <span className="text-xs text-destructive">{errors.studentId.message}</span>}
                </div>
              )}

              <div className="flex items-center space-x-2 py-2">
                <Checkbox 
                  id="terms" 
                  onCheckedChange={(checked) => setValue("terms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the Terms of Service
                </Label>
              </div>
              {errors.terms && <span className="text-xs text-destructive">{errors.terms.message}</span>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
