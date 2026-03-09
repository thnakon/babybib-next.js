import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Babybib - Smart Book Management",
  description: "Manage your book collection and search ISBNs effortlessly with Babybib.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-white dark:bg-[#0a0a0a]`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {children}
          </LanguageProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
