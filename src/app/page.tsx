import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageDropdown } from "@/components/language-dropdown";
export default function Home() {
  return (
    <div className="min-h-screen bg-transparent font-sans text-black dark:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-12 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-lg">
            <Image
              src="/logo.png"
              alt="Babybib Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#407bc4]">baby</span>
            <span className="text-[#f58e58]">bib</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageDropdown />
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex flex-col items-center pt-32 pb-20">
        {/* Badge */}
        <div className="mb-12 flex items-center gap-2 rounded-full border border-[#407bc4]/20 dark:border-[#407bc4]/30 bg-[#407bc4]/5 dark:bg-[#407bc4]/10 px-3 py-1 text-sm font-medium">
          <span className="rounded-full bg-[#f58e58] px-1.5 py-0.5 text-[10px] text-white">New</span>
          <span className="text-[#407bc4] dark:text-[#6ba1e6]">Smart ISBN Search</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center px-4 text-center">
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#407bc4] to-[#f58e58]">your library</span> <br /> with smooth style
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-zinc-500">
            A fully featured, open-source book management system. Browse a list of 
            books, track collections and ISBNs that you can install and use in your projects.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <button className="flex h-12 items-center gap-2 rounded-xl bg-[#407bc4] px-8 text-sm font-semibold text-white transition-all hover:bg-[#32629e] active:scale-95 shadow-lg shadow-[#407bc4]/20">
              Get Started →
            </button>
            <button className="flex h-12 items-center rounded-xl bg-[#f58e58]/10 px-8 text-sm font-semibold text-[#dd7742] dark:text-[#f58e58] transition-all hover:bg-[#f58e58]/20 active:scale-95">
              Browse Collections
            </button>
          </div>

          {/* Tech Icons Placeholder */}
          <div className="mt-12 flex items-center gap-6 opacity-40 grayscale">
            <div className="h-6 w-6 bg-black dark:bg-white rounded-full" />
            <div className="h-6 w-10 bg-black dark:bg-white rounded" />
            <div className="h-6 w-6 bg-black dark:bg-white rounded-sm" />
            <div className="h-4 w-12 bg-black dark:bg-white rounded" />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl w-full">
          {[
            { title: "Primitives", icon: "□" },
            { title: "Components", icon: "⬚" },
            { title: "Icons", icon: "✧" },
            { title: "Soon...", icon: "⋯" }
          ].map((card, i) => (
            <div key={i} className="group relative flex aspect-[1.2/1] flex-col rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-6 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-[#407bc4]/5 border border-transparent hover:border-[#407bc4]/20">
              <span className="mb-auto text-center font-serif italic text-zinc-400 text-xl group-hover:text-[#f58e58] transition-colors">{card.title}</span>
              <div className="flex h-full items-center justify-center">
                <div className="h-24 w-40 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 flex flex-col p-4 gap-2 transition-colors group-hover:bg-[#407bc4]/5 dark:group-hover:bg-[#407bc4]/10">
                   <div className="h-4 w-8 bg-zinc-300 dark:bg-zinc-700 rounded group-hover:bg-[#f58e58]/40 transition-colors" />
                   <div className="h-2 w-24 bg-zinc-300 dark:bg-zinc-700 rounded group-hover:bg-[#407bc4]/40 transition-colors" />
                   <div className="h-2 w-20 bg-zinc-300 dark:bg-zinc-700 rounded group-hover:bg-[#407bc4]/30 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
