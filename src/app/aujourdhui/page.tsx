import Link from "next/link";
import { BookMarked, BookOpen, CalendarDays, Check, ChevronRight, Flame, Heart, Home, Library, MessageCircleHeart, Settings, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/server";
import { SignOutButton } from "@/components/sign-out-button";

const nav = [{ label:"Aujourd’hui", icon:Home, active:true },{ label:"Parcours", icon:BookOpen },{ label:"Bibliothèque", icon:Library },{ label:"Communauté", icon:Users },{ label:"Progression", icon:CalendarDays }];

export default async function TodayPage() {
  await connection();
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/connexion");
  const displayName = session.user.name?.split(" ")[0] || "Disciple";
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date());
  const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  return <main className="min-h-screen bg-[#f4f1e8] text-emerald-950">
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-emerald-950/10 bg-emerald-950 p-6 text-white lg:flex">
      <Link href="/" className="font-display text-2xl font-semibold">Cœur de Disciple</Link>
      <nav className="mt-12 space-y-2">{nav.map(({label,icon:Icon,active}) => <a key={label} href="#" className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${active ? "bg-amber-300 text-emerald-950" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon size={19}/>{label}</a>)}</nav>
      <div className="mt-auto"><Link href="/profil" className="flex items-center gap-3 px-4 py-3 text-sm text-white/60"><Settings size={18}/>Paramètres</Link><div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 font-bold text-emerald-950">{displayName.slice(0,2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{displayName}</p><p className="truncate text-xs text-white/45">{session.user.email}</p></div></div><div className="mt-4 pl-4"><SignOutButton compact/></div></div>
    </aside>
    <div className="lg:pl-72">
      <header className="border-b border-emerald-950/10 bg-[#f4f1e8]/90 px-5 py-5 backdrop-blur sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between"><div><p className="text-sm text-emerald-950/50">{displayDate}</p><h1 className="font-display text-3xl font-semibold">Bonjour {displayName}, avançons ensemble.</h1></div><button aria-label="Besoin d’aide" className="rounded-full border border-emerald-950/10 bg-white p-3"><MessageCircleHeart size={20}/></button></div></header>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 xl:grid-cols-[1.5fr_.8fr]">
        <section className="space-y-6">
          <article className="overflow-hidden rounded-[2rem] bg-emerald-900 p-7 text-white shadow-xl sm:p-9"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Méditation du jour</p><span className="rounded-full bg-white/10 px-3 py-1 text-xs">12 min</span></div><h2 className="font-display mt-8 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">Demeurer attaché à la vraie vigne</h2><p className="mt-3 font-semibold text-amber-300">Jean 15.1–8</p><p className="mt-6 max-w-2xl leading-7 text-white/65">Aujourd’hui, laisse la Parole révéler ce qui nourrit vraiment ta vie et choisis une action simple pour demeurer en Christ.</p><div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><button className="rounded-full bg-amber-300 px-6 py-3 font-bold text-emerald-950">Commencer</button><div className="flex-1"><div className="mb-2 flex justify-between text-xs text-white/55"><span>Parcours Attaché à Dieu</span><span>43 %</span></div><div className="h-1.5 rounded-full bg-white/15"><div className="h-full w-[43%] rounded-full bg-amber-300"/></div></div></div></article>
          <div className="grid gap-5 sm:grid-cols-2"><Card icon={BookMarked} kicker="Versets de la semaine" title="Psaume 1.1–2" copy="Prochaine révision aujourd’hui" action="Réviser maintenant"/><Card icon={BookOpen} kicker="Lecture en cours" title="Sortir des prisons intérieures" copy="Prochain chapitre : Renouveler ses pensées" action="Continuer"/></div>
          <article className="dashboard-card"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="card-kicker mt-0">Prochaine étape choisie</p><h3 className="card-title">Prendre 10 minutes de silence chaque matin</h3><p className="card-copy">3 jours accomplis cette semaine</p></div><button aria-label="Marquer comme accomplie" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-white"><Check/></button></div></article>
        </section>
        <aside className="space-y-6"><article className="dashboard-card"><div className="flex items-center justify-between"><p className="card-kicker mt-0">Caractère du mois</p><Flame className="text-amber-600" size={21}/></div><h3 className="font-display mt-4 text-3xl font-semibold">La patience</h3><p className="mt-3 leading-7 text-emerald-950/60">Persévérer avec paix, même lorsque le fruit n’est pas encore visible.</p><div className="mt-6 flex gap-2">{[1,2,3,4,5,6,7].map(d => <span key={d} className={`h-2 flex-1 rounded-full ${d < 5 ? "bg-amber-400" : "bg-emerald-950/10"}`}/>)}</div></article><article className="dashboard-card"><div className="flex items-center justify-between"><p className="card-kicker mt-0">Sujets de prière suivis</p><Heart className="text-rose-600" size={20}/></div><div className="mt-5 space-y-4">{["Paix et sagesse pour une famille","Persévérance dans la recherche d’emploi","Guérison et consolation"].map(item => <div key={item} className="border-b border-emerald-950/10 pb-4 last:border-0 last:pb-0"><p className="font-semibold leading-6">{item}</p><p className="mt-1 text-xs text-emerald-950/45">Groupe Persévérants</p></div>)}</div></article></aside>
      </div>
    </div>
  </main>;
}

function Card({ icon:Icon, kicker, title, copy, action }:{ icon:typeof BookOpen; kicker:string; title:string; copy:string; action:string }) {
  return <article className="dashboard-card"><div className="card-icon"><Icon size={21}/></div><p className="card-kicker">{kicker}</p><h3 className="card-title">{title}</h3><p className="card-copy">{copy}</p><button className="card-link">{action}<ChevronRight size={16}/></button></article>;
}
