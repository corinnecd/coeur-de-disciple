"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Check, Clock3, LoaderCircle, UsersRound } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { saveProfile, type ProfilePreferences } from "@/lib/data/profile";

type Step = "welcome" | "group" | "rhythm";
type GroupMode = "create" | "join";
const steps: Step[] = ["welcome", "group", "rhythm"];

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
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const preferences: ProfilePreferences = { rhythm: String(data.get("rhythm")) as ProfilePreferences["rhythm"], reminderTime: String(data.get("reminderTime")), translation: String(data.get("translation")) as ProfilePreferences["translation"] };
    try {
      await saveProfile(user, preferences);
      localStorage.setItem("coeur-de-disciple.preferences", JSON.stringify(preferences));
      router.push("/aujourdhui"); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Impossible d’enregistrer vos préférences."); }
    finally { setBusy(false); }
  }

  return <main className="onboarding-page">
    <Image src="/hero-communaute-mixte.webp" alt="Un groupe de femmes avance dans la foi avec joie" fill priority sizes="100vw" className="onboarding-background" />
    <div className="onboarding-shade" />
    <div className="onboarding-shell">
      <header className="onboarding-header"><Link href="/" className="onboarding-brand"><Image src="/logo-coeur-de-disciple.png" alt="" width={48} height={48}/><span>Cœur de Disciple</span></Link><div className="onboarding-progress" aria-label={"Étape " + (steps.indexOf(step) + 1) + " sur 3"}><small>Mise en route</small><div>{steps.map((item,index) => <span key={item} className={index <= steps.indexOf(step) ? "is-active" : ""}/>)}</div></div></header>
      <div className="onboarding-layout">
        <aside className="onboarding-message"><p className="home-kicker home-kicker-light">Votre chemin commence ici</p><h2>Un rythme doux.<br/><em>Une foi vivante.</em></h2><p>Quelques choix simples pour créer un espace qui vous accompagne sans pression.</p></aside>
        {step === "welcome" && <section className="onboarding-panel"><div className="onboarding-icon"><BookOpen/></div><p className="eyebrow">Bienvenue {user.name}</p><h1 className="onboarding-title">Votre marche commence par une action simple.</h1><p className="onboarding-copy">En quelques étapes, choisissez votre groupe et votre rythme. Vous pourrez tout modifier plus tard dans votre profil.</p><div className="onboarding-minicards"><MiniCard icon={UsersRound} text="Rejoindre une communauté"/><MiniCard icon={Clock3} text="Choisir votre rythme"/><MiniCard icon={Check} text="Commencer aujourd’hui"/></div><button onClick={() => setStep(hasGroup ? "rhythm" : "group")} className="onboarding-primary">Configurer mon espace</button></section>}
        {step === "group" && <section className="onboarding-panel"><p className="eyebrow">Votre communauté</p><h1 className="onboarding-title">Avec qui allez-vous marcher ?</h1><p className="onboarding-copy">Créez un groupe si vous en êtes responsable, ou utilisez le code reçu dans votre invitation.</p><div className="auth-tabs"><button onClick={() => {setGroupMode("create");setError("");}} className={"auth-tab " + (groupMode === "create" ? "auth-tab-active" : "")}>Créer un groupe</button><button onClick={() => {setGroupMode("join");setError("");}} className={"auth-tab " + (groupMode === "join" ? "auth-tab-active" : "")}>Rejoindre</button></div><form onSubmit={saveGroup} className="onboarding-form">{groupMode === "create" ? <label className="auth-label">Nom du groupe<input name="groupName" className="auth-input mt-2" placeholder="Ex. Les Persévérantes" required/></label> : <label className="auth-label">Code d’invitation<input name="invitationCode" className="auth-input mt-2 uppercase tracking-widest" placeholder="Saisissez le code reçu" required/></label>}{error && <p className="auth-error" role="alert">{error}</p>}<button disabled={busy} className="onboarding-primary">{busy && <LoaderCircle className="animate-spin" size={18}/>}Continuer</button></form></section>}
        {step === "rhythm" && <section className="onboarding-panel"><p className="eyebrow">Votre rythme</p><h1 className="onboarding-title">Quand souhaitez-vous vous recentrer ?</h1><p className="onboarding-copy">Choisissez un rythme réaliste. L’objectif est la fidélité, pas la pression.</p><form onSubmit={finish} className="onboarding-form"><fieldset><legend className="auth-label mb-3">Rythme de méditation</legend><div className="onboarding-choices"><Choice name="rhythm" value="daily" label="Chaque jour" defaultChecked/><Choice name="rhythm" value="weekdays" label="En semaine"/><Choice name="rhythm" value="three_days" label="3 jours / semaine"/></div></fieldset><label className="auth-label">Heure de rappel<input name="reminderTime" type="time" defaultValue="07:00" className="auth-input mt-2"/></label><label className="auth-label">Traduction biblique<select name="translation" className="auth-input mt-2" defaultValue="LSG"><option value="LSG">Louis Segond 1910</option><option value="S21">Segond 21</option><option value="BDS">Bible du Semeur</option></select></label>{error && <p className="auth-error" role="alert">{error}</p>}<button disabled={busy} className="onboarding-primary">{busy && <LoaderCircle className="animate-spin" size={18}/>}Enregistrer et entrer</button></form></section>}
      </div>
      <p className="onboarding-privacy">Vos préférences personnelles et vos notes restent privées par défaut.</p>
    </div>
  </main>;
}

function MiniCard({icon:Icon,text}:{icon:typeof UsersRound;text:string}) { return <div className="onboarding-mini"><Icon size={20}/><p>{text}</p></div>; }
function Choice({name,value,label,defaultChecked}:{name:string;value:string;label:string;defaultChecked?:boolean}) { return <label className="onboarding-choice"><input className="peer sr-only" type="radio" name={name} value={value} defaultChecked={defaultChecked}/><span>{label}</span></label>; }
