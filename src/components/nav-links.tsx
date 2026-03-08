import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
      <Link href="/help" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        Help
      </Link>
      <Link href="/guides" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        Guides
      </Link>
      <Link href="/generate" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
        Generate
      </Link>
      
      {/* Dropdown for More */}
      <div className="relative group/more">
        <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-2">
          More
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="absolute top-full right-0 pt-2 hidden group-hover/more:block">
          <div className="flex flex-col w-48 rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800 p-2">
            <Link 
              href="/share" 
              className="px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
            >
              Share
            </Link>
            <Link 
              href="/contact" 
              className="px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
            >
              Contact
            </Link>
            <Link 
              href="/terms" 
              className="px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              className="px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
