"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Check, Clock3, LoaderCircle, UsersRound } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { saveProfile, type ProfilePreferences } from "@/lib/data/profile";

type Step = "welcome" | "group" | "rhythm";
type GroupMode = "create" | "join";

export function OnboardingFlow({ user }:{ user:{ id:string; name:string; email:string } }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [groupMode, setGroupMode] = useState<GroupMode>("create");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hasGroup, setHasGroup] = useState(false);

  useEffect(() => { authClient.organization.list().then(({ data }) => setHasGroup(Boolean(data?.length))).catch(() => undefined); }, []);

  async function saveGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      if (groupMode === "create") {
        const name = String(data.get("groupName") ?? "").trim();
        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const result = await authClient.organization.create({ name, slug });
        if (result.error) throw new Error(result.error.message);
        if (result.data?.id) await authClient.organization.setActive({ organizationId: result.data.id });
      } else {
        const invitationId = String(data.get("invitationCode") ?? "").trim();
        const result = await authClient.organization.acceptInvitation({ invitationId });
        if (result.error) throw new Error(result.error.message);
      }
      setHasGroup(true); setStep("rhythm");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Impossible d’enregistrer le groupe."); }
    finally { setBusy(false); }
  }

  async function finish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const preferences: ProfilePreferences = {
      rhythm: String(data.get("rhythm")) as ProfilePreferences["rhythm"],
      reminderTime: String(data.get("reminderTime")),
      translation: String(data.get("translation")) as ProfilePreferences["translation"],
    };
    try {
      await saveProfile(user, preferences);
      localStorage.setItem("coeur-de-disciple.preferences", JSON.stringify(preferences));
      router.push("/aujourdhui"); router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d’enregistrer vos préférences.");
    } finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-[#f8f5ed] px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl"><header className="flex items-center justify-between"><p className="font-display text-xl font-semibold text-emerald-950">Cœur de Disciple</p><p className="text-sm font-semibold text-emerald-950/45">Mise en route</p></header><div className="mt-8 flex gap-2">{["welcome","group","rhythm"].map((item,index) => <span key={item} className={`h-1.5 flex-1 rounded-full ${index <= ["welcome","group","rhythm"].indexOf(step) ? "bg-amber-400" : "bg-emerald-950/10"}`}/>)}</div>
    {step === "welcome" && <section className="onboarding-panel"><div className="onboarding-icon"><BookOpen/></div><p className="eyebrow">Bienvenue {user.name}</p><h1 className="onboarding-title">Votre marche commence par une action simple.</h1><p className="onboarding-copy">En quelques étapes, choisissez votre groupe et votre rythme. Vous pourrez tout modifier plus tard dans votre profil.</p><div className="mt-8 grid gap-3 sm:grid-cols-3"><MiniCard icon={UsersRound} text="Rejoindre une communauté"/><MiniCard icon={Clock3} text="Choisir votre rythme"/><MiniCard icon={Check} text="Commencer aujourd’hui"/></div><button onClick={() => setStep(hasGroup ? "rhythm" : "group")} className="onboarding-primary mt-9">Configurer mon espace</button></section>}
    {step === "group" && <section className="onboarding-panel"><p className="eyebrow">Votre communauté</p><h1 className="onboarding-title">Avec qui allez-vous marcher ?</h1><p className="onboarding-copy">Créez un groupe si vous en êtes responsable, ou utilisez le code reçu dans votre invitation.</p><div className="mt-7 grid grid-cols-2 rounded-xl bg-emerald-950/5 p-1"><button onClick={() => {setGroupMode("create");setError("");}} className={`auth-tab ${groupMode === "create" ? "auth-tab-active" : ""}`}>Créer un groupe</button><button onClick={() => {setGroupMode("join");setError("");}} className={`auth-tab ${groupMode === "join" ? "auth-tab-active" : ""}`}>Rejoindre</button></div><form onSubmit={saveGroup} className="mt-6 space-y-5">{groupMode === "create" ? <label className="auth-label">Nom du groupe<input name="groupName" className="auth-input mt-2" placeholder="Ex. Les Persévérants" required/></label> : <label className="auth-label">Code d’invitation<input name="invitationCode" className="auth-input mt-2 uppercase tracking-widest" placeholder="Saisissez le code reçu" required/></label>}{error && <p className="auth-error" role="alert">{error}</p>}<button disabled={busy} className="onboarding-primary flex items-center justify-center gap-2">{busy && <LoaderCircle className="animate-spin" size={18}/>}Continuer</button></form></section>}
    {step === "rhythm" && <section className="onboarding-panel"><p className="eyebrow">Votre rythme</p><h1 className="onboarding-title">Quand souhaitez-vous vous recentrer ?</h1><p className="onboarding-copy">Choisissez un rythme réaliste. L’objectif est la fidélité, pas la pression.</p><form onSubmit={finish} className="mt-8 space-y-6"><fieldset><legend className="auth-label mb-3">Rythme de méditation</legend><div className="grid gap-3 sm:grid-cols-3"><Choice name="rhythm" value="daily" label="Chaque jour" defaultChecked/><Choice name="rhythm" value="weekdays" label="En semaine"/><Choice name="rhythm" value="three_days" label="3 jours / semaine"/></div></fieldset><label className="auth-label">Heure de rappel<input name="reminderTime" type="time" defaultValue="07:00" className="auth-input mt-2"/></label><label className="auth-label">Traduction biblique<select name="translation" className="auth-input mt-2" defaultValue="LSG"><option value="LSG">Louis Segond 1910</option><option value="S21">Segond 21</option><option value="BDS">Bible du Semeur</option></select></label>{error && <p className="auth-error" role="alert">{error}</p>}<button disabled={busy} className="onboarding-primary flex items-center justify-center gap-2">{busy && <LoaderCircle className="animate-spin" size={18}/>}Enregistrer et entrer</button></form></section>}
    <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-emerald-950/40">Vos préférences personnelles et vos notes restent privées par défaut.</p></div></main>;
}

function MiniCard({icon:Icon,text}:{icon:typeof UsersRound;text:string}) { return <div className="rounded-2xl border border-emerald-950/10 bg-white p-4"><Icon className="mb-4 text-emerald-700" size={22}/><p className="text-sm font-semibold leading-5">{text}</p></div>; }
function Choice({name,value,label,defaultChecked}:{name:string;value:string;label:string;defaultChecked?:boolean}) { return <label className="cursor-pointer"><input className="peer sr-only" type="radio" name={name} value={value} defaultChecked={defaultChecked}/><span className="block rounded-xl border border-emerald-950/10 bg-white p-4 text-center text-sm font-bold peer-checked:border-emerald-700 peer-checked:bg-emerald-50">{label}</span></label>; }
