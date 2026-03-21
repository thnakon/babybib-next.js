"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { 
  User, 
  Settings, 
  CreditCard, 
  Palette, 
  Bell, 
  Monitor, 
  Plus, 
  X,
  Loader2,
  Camera
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
  urls: z.array(z.string()).optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [urls, setUrls] = useState<string[]>([""])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      urls: [""],
      firstName: "",
      lastName: ""
    },
  })

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any
      const nameParts = user.name?.split(" ") || ["", ""]
      form.reset({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        urls: user.urls ? JSON.parse(user.urls) : [""],
        firstName: nameParts[0] || "",
        lastName: nameParts[1] || ""
      })
      if (user.urls) {
        setUrls(JSON.parse(user.urls))
      }
    }
  }, [session, form])

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          urls: JSON.stringify(urls.filter(url => url.trim() !== ""))
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      const result = await response.json()
      
      // Update session
      await update({
        username: data.username,
        name: `${data.firstName} ${data.lastName}`,
        bio: data.bio,
        urls: JSON.stringify(urls.filter(url => url.trim() !== ""))
      })

      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const onError = (errors: any) => {
    toast.error("Invalid input", {
      description: "Please check the form for errors.",
    })
  }

  const addUrl = () => {
    const newUrls = [...urls, ""]
    setUrls(newUrls)
    form.setValue("urls", newUrls)
  }
  const removeUrl = (index: number) => {
    const newUrls = [...urls]
    newUrls.splice(index, 1)
    setUrls(newUrls)
    form.setValue("urls", newUrls)
  }
  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
    form.setValue("urls", newUrls)
  }

  const sidebarNavItems = [
    { title: "Profile", icon: User, href: "/users/profile", active: true },
    { title: "Account", icon: Settings, href: "#" },
    { title: "Billing", icon: CreditCard, href: "#" },
    { title: "Appearance", icon: Palette, href: "#" },
    { title: "Notifications", icon: Bell, href: "#" },
    { title: "Display", icon: Monitor, href: "#" },
  ]

  return (
    <div className="container max-w-screen-2xl mx-auto py-10 px-4 md:px-8 lg:px-12 bg-background min-h-screen">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted group",
                  item.active ? "bg-muted text-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("size-4", item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl px-1">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Profile</h3>
              <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
              </p>
            </div>
            <Separator />
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-muted shadow-sm group-hover:opacity-80 transition-opacity">
                    <AvatarImage src={(session?.user as any)?.image} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                      {(session?.user as any)?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button type="button" className="absolute bottom-0 right-0 p-2 bg-background rounded-full border shadow-sm hover:bg-muted transition-colors">
                    <Camera className="size-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" type="button" className="font-semibold px-4 h-9">
                    Upload image
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    First Name
                  </label>
                  <Input 
                    placeholder="First Name" 
                    {...form.register("firstName")}
                    className="bg-background focus-visible:ring-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Last Name
                  </label>
                  <Input 
                    placeholder="Last Name" 
                    {...form.register("lastName")}
                    className="bg-background focus-visible:ring-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Username
                </label>
                <Input 
                  placeholder="shadcn" 
                  {...form.register("username")}
                  className="bg-background focus-visible:ring-1"
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input 
                  placeholder="Select a verified email to display" 
                  {...form.register("email")}
                  disabled
                  className="bg-muted/50 border-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  You can manage verified email addresses in your email settings.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Bio
                </label>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none bg-background focus-visible:ring-1 min-h-[120px]"
                  {...form.register("bio")}
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  You can @mention other users and organizations to link to them.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    URLs
                  </label>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Add links to your website, blog, or social media profiles.
                  </p>
                </div>
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      placeholder="https://shadcn.com"
                      className="bg-background focus-visible:ring-1"
                    />
                    {urls.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeUrl(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 h-9 border-dashed"
                  onClick={addUrl}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add URL
                </Button>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 h-10 font-semibold transition-all active:scale-[0.98]"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
