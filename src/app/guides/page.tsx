"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GuidesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/guides/apa");
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}
