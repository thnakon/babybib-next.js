import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] font-sans selection:bg-purple-500/30">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />

      <main className="z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
            <span className="text-2xl font-bold text-white">B</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Babybib</h2>
        </div>

        <h1 className="max-w-4xl bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
          Everything your library <br /> needs, at your fingertips.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          The modern bibliography companion for collectors and researchers. 
          Search ISBN markers, track your collection, and organize your reading list with ease.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button className="h-12 rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95">
            Get Started
          </button>
          <button className="h-12 rounded-full border border-zinc-800 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-zinc-700">
            Learn More
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { title: "Smart Search", desc: "Instant ISBN lookup and metadata retrieval." },
            { title: "Cloud Sync", desc: "Your library, accessible from any device." },
            { title: "Collections", desc: "Organize books into beautiful custom lists." }
          ].map((feature, i) => (
            <div key={i} className="group relative rounded-2xl border border-zinc-800 bg-white/5 p-6 text-left backdrop-blur-sm transition-all hover:border-zinc-700">
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="absolute bottom-8 text-zinc-600 text-sm">
        © 2026 Babybib. All rights reserved.
      </footer>
    </div>
  );
}
