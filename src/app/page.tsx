import Image from "next/image";
import Link from "next/link";
import { ArrowDown, BookOpen, HeartHandshake, Sprout, Users } from "lucide-react";

const pillars = [
  { icon: BookOpen, title: "Méditer la Parole", text: "Des parcours bibliques guidés pour comprendre, prier et mettre en pratique." },
  { icon: Sprout, title: "Grandir avec constance", text: "Une progression personnelle qui encourage sans comparer ni culpabiliser." },
  { icon: Users, title: "Marcher ensemble", text: "Un espace de groupe modéré pour partager résumés, témoignages et prières." },
];

export default function Home() {
  return <main>
    <section className="hero-shell min-h-[92vh] overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Accueil Cœur de Disciple">
          <Image src="/logo-coeur-de-disciple.png" alt="" width={52} height={52} className="h-12 w-12 rounded-full object-cover" priority />
          <span className="font-display text-lg font-semibold leading-tight text-white">Cœur de<br />Disciple</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex"><a href="#vision">La vision</a><a href="#parcours">Les parcours</a><a href="#communaute">La communauté</a></div>
        <Link href="/connexion" className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-emerald-950">Se connecter</Link>
      </nav>
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.12fr_.88fr] lg:pt-24">
        <div><p className="mb-5 text-sm font-bold uppercase tracking-[.22em] text-amber-300">Enracinés dans la Parole</p><h1 className="font-display max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-.04em] text-white sm:text-7xl">Une foi vécue.<br /><span className="text-amber-300">Un cœur transformé.</span></h1><p className="mt-7 max-w-2xl text-lg leading-8 text-emerald-50/80 sm:text-xl">Méditez, mémorisez et avancez avec une communauté de disciples qui choisissent de mettre la Parole en pratique chaque jour.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/connexion" className="rounded-full bg-amber-300 px-7 py-3.5 text-center font-bold text-emerald-950 transition hover:bg-amber-200">Commencer aujourd’hui</Link><a href="#vision" className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10">Comprendre la vision <ArrowDown size={17} /></a></div></div>
        <div className="relative mx-auto w-full max-w-md"><div className="absolute -inset-12 rounded-full bg-amber-300/10 blur-3xl" /><div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"><div className="rounded-[1.5rem] bg-[#f8f5ed] p-6 text-emerald-950"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Méditation du jour</span><span className="text-xs text-emerald-900/50">Jour 3 sur 7</span></div><p className="font-display mt-8 text-3xl font-semibold">Demeurer dans sa présence</p><p className="mt-3 text-sm font-semibold text-amber-700">Jean 15.4–5</p><p className="mt-5 leading-7 text-emerald-950/70">« Demeurez en moi, et je demeurerai en vous. »</p><div className="mt-8 h-2 overflow-hidden rounded-full bg-emerald-950/10"><div className="h-full w-[43%] rounded-full bg-emerald-700" /></div><button className="mt-5 w-full rounded-xl bg-emerald-900 py-3.5 font-bold text-white">Continuer la méditation</button></div></div></div>
      </div>
    </section>
    <section id="vision" className="bg-[#f8f5ed] px-5 py-24 sm:px-8"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="eyebrow">Notre vision</p><h2 className="section-title">De ce que je sais à ce que je pratique.</h2><p className="mt-6 text-lg leading-8 text-emerald-950/65">La transformation ne vient pas d’une accumulation de contenus. Chaque parcours relie vérité biblique, examen du cœur, prière et action concrète.</p></div><div id="parcours" className="mt-14 grid gap-5 md:grid-cols-3">{pillars.map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-3xl border border-emerald-950/10 bg-white p-7 shadow-[0_20px_60px_rgba(12,56,42,.06)]"><div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-900 text-amber-300"><Icon size={23} /></div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-700">0{index + 1}</p><h3 className="font-display text-2xl font-semibold text-emerald-950">{title}</h3><p className="mt-3 leading-7 text-emerald-950/60">{text}</p></article>)}</div></div></section>
    <section id="communaute" className="bg-amber-300 px-5 py-20 sm:px-8"><div className="mx-auto flex max-w-5xl flex-col items-center text-center"><HeartHandshake className="mb-5 text-emerald-950" size={38} /><h2 className="font-display text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">« Moi et ma maison, nous servirons l’Éternel. »</h2><p className="mt-4 text-emerald-950/65">Josué 24.15</p></div></section>
  </main>;
}
