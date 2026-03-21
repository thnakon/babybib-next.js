import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      emailVerified: Date | null
      role: string
      bio?: string | null
      image?: string | null
      urls?: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    username: string
    emailVerified: Date | null
    role: string
    bio?: string | null
    image?: string | null
    urls?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    emailVerified: Date | null
    role: string
    bio?: string | null
    image?: string | null
    urls?: string | null
  }
}
