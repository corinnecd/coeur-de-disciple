import { redirect } from "next/navigation";
import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@/lib/auth/server";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfilePreferencesForm } from "./profile-preferences";

export default async function ProfilePage() {
  await connection();
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/connexion");
  return <main className="min-h-screen bg-[#f4f1e8] px-5 py-10 sm:px-8"><div className="mx-auto max-w-2xl"><Link href="/aujourdhui" className="text-sm font-bold text-emerald-800">← Retour à aujourd’hui</Link><section className="mt-7 rounded-[2rem] border border-emerald-950/10 bg-white p-7 shadow-sm sm:p-10"><p className="eyebrow">Mon profil</p><h1 className="font-display mt-3 text-4xl font-semibold">{session.user.name || "Disciple"}</h1><p className="mt-2 text-emerald-950/55">{session.user.email}</p><ProfilePreferencesForm user={{ id:session.user.id, name:session.user.name || "Disciple", email:session.user.email }}/><h2 className="font-display text-2xl font-semibold">Confidentialité par défaut</h2><p className="mt-3 leading-7 text-emerald-950/60">Vos notes de méditation et vos réponses personnelles restent privées. Tout partage avec un responsable ou un groupe nécessite une action explicite.</p><div className="mt-8"><SignOutButton/></div></section></div></main>;
}
