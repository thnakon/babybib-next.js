import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid email or password");
        }

        const returnUser = {
          id: user.id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          username: user.username,
          emailVerified: user.emailVerified,
          role: (user as any).role,
          bio: user.bio,
          image: user.image,
          urls: user.urls,
        };

        return returnUser;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.emailVerified = (user as any).emailVerified;
        token.role = (user as any).role;
        token.bio = (user as any).bio;
        token.image = (user as any).image;
        token.urls = (user as any).urls;
      }

      // Handle session update on the client side
      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.name) token.name = session.name;
        if (session.emailVerified) token.emailVerified = session.emailVerified;
        if (session.bio !== undefined) token.bio = session.bio;
        if (session.image !== undefined) token.image = session.image;
        if (session.urls !== undefined) token.urls = session.urls;
      } else if (trigger === "update") {
        // Fallback: re-fetch from database if needed
        const updatedUser = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          select: { 
            emailVerified: true,
            username: true,
            firstName: true,
            lastName: true,
            bio: true,
            image: true,
            urls: true
          }
        });
        if (updatedUser) {
          token.emailVerified = updatedUser.emailVerified;
          token.username = updatedUser.username;
          token.name = `${updatedUser.firstName} ${updatedUser.lastName}`;
          token.bio = updatedUser.bio;
          token.image = updatedUser.image;
          token.urls = updatedUser.urls;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).emailVerified = token.emailVerified;
        (session.user as any).role = token.role;
        (session.user as any).bio = token.bio;
        (session.user as any).image = token.image;
        (session.user as any).urls = token.urls;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
