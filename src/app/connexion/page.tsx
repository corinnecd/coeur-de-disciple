import Image from "next/image";
import Link from "next/link";
import { AuthPanel } from "./auth-panel";

export default function SignInPage() {
  return <main className="grid min-h-screen bg-[#f8f5ed] lg:grid-cols-[.9fr_1.1fr]">
    <section className="relative hidden overflow-hidden bg-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
      <Link href="/" className="relative flex items-center gap-3"><Image src="/logo-coeur-de-disciple.png" alt="" width={54} height={54} className="h-12 w-12 rounded-full object-cover"/><span className="font-display text-xl font-semibold">Cœur de Disciple</span></Link>
      <div className="relative max-w-xl"><p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-amber-300">Enracinés dans la Parole</p><h1 className="font-display text-5xl font-semibold leading-tight">Votre espace pour méditer, grandir et marcher ensemble.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-white/60">Vos notes personnelles restent privées. Vos partages communautaires restent sous votre contrôle.</p></div>
      <p className="relative text-sm text-white/40">« Demeurez en moi, et je demeurerai en vous. » — Jean 15.4</p>
    </section>
    <section className="flex items-center justify-center px-5 py-12 sm:px-10"><div className="w-full max-w-md"><Link href="/" className="mb-10 flex items-center gap-3 lg:hidden"><Image src="/logo-coeur-de-disciple.png" alt="" width={48} height={48} className="h-11 w-11 rounded-full object-cover"/><span className="font-display text-xl font-semibold">Cœur de Disciple</span></Link><AuthPanel /></div></section>
  </main>;
}
