import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-lg">
        <Image src="/logo.png" alt="Babybib Logo" fill className="object-contain" priority />
      </div>
      <div className="text-xl font-bold tracking-tight">
        <span className="text-[#407bc4]">Baby</span>
        <span className="text-[#f58e58]">bib</span>
      </div>
    </Link>
  )
}
