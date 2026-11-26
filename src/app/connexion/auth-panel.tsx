"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";

type Mode = "sign-in" | "sign-up" | "verify";

export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (mode === "verify") {
        const form = new FormData(event.currentTarget);
        const otp = String(form.get("otp") ?? "").trim();
        const verified = await authClient.emailOtp.verifyEmail({ email, otp });
        if (verified.error) throw new Error(verified.error.message);
        const signedIn = await authClient.signIn.email({ email, password });
        if (signedIn.error) throw new Error(signedIn.error.message);
        router.push("/onboarding"); router.refresh(); return;
      }
      if (mode === "sign-up") {
        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        if (!cleanFirstName || !cleanLastName) throw new Error("Renseignez votre prénom et votre nom séparément.");
        const result = await authClient.signUp.email({ name: cleanFirstName + " " + cleanLastName, email, password });
        if (result.error) throw new Error(result.error.message);
        localStorage.setItem("coeur-de-disciple.pending-name", JSON.stringify({ firstName: cleanFirstName, lastName: cleanLastName, email }));
        setMode("verify"); return;
      }
      const result = await authClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message);
      router.push("/aujourdhui"); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Une erreur est survenue. Réessayez."); }
    finally { setBusy(false); }
  }

  async function signInWithGoogle() {
    setBusy(true); setError("");
    const result = await authClient.signIn.social({ provider: "google", callbackURL: "/onboarding" });
    if (result?.error) { setError(result.error.message ?? "Connexion Google impossible."); setBusy(false); }
  }

  function switchMode(next: Mode) { setMode(next); setError(""); }

  if (mode === "verify") return <div className="auth-card"><CheckCircle2 className="auth-success-icon" size={34}/><h1 className="auth-title mt-5">Vérifiez votre adresse</h1><p className="auth-copy">Un code a été envoyé à <strong>{email}</strong>. Saisissez-le pour activer votre compte.</p><form onSubmit={submit} className="mt-7 space-y-4"><label className="auth-label">Code de vérification<input className="auth-input mt-2 text-center text-xl tracking-[.35em]" name="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={8} required/></label>{error && <p className="auth-error" role="alert">{error}</p>}<SubmitButton busy={busy} label="Vérifier mon compte" /></form><button onClick={() => switchMode("sign-up")} className="auth-back-button">Modifier l’adresse e-mail</button></div>;

  return <div className="auth-card"><p className="eyebrow">Votre espace personnel</p><h1 className="auth-title">{mode === "sign-in" ? "Heureux de vous retrouver." : "Faisons le premier pas."}</h1><p className="auth-copy">{mode === "sign-in" ? "Connectez-vous pour reprendre votre parcours." : "Créez votre compte et rejoignez votre groupe de disciples."}</p><div className="auth-tabs"><button onClick={() => switchMode("sign-in")} className={`auth-tab ${mode === "sign-in" ? "auth-tab-active" : ""}`}>Connexion</button><button onClick={() => switchMode("sign-up")} className={`auth-tab ${mode === "sign-up" ? "auth-tab-active" : ""}`}>Créer un compte</button></div><button onClick={signInWithGoogle} disabled={busy} className="auth-google"><span>G</span>Continuer avec Google</button><div className="auth-divider"><span/>ou par e-mail<span/></div><form onSubmit={submit} className="space-y-4">{mode === "sign-up" && <div className="grid gap-4 sm:grid-cols-2"><label className="auth-label">Prénom<input className="auth-input mt-2" value={firstName} onChange={event => setFirstName(event.target.value)} autoComplete="given-name" required/></label><label className="auth-label">Nom<input className="auth-input mt-2" value={lastName} onChange={event => setLastName(event.target.value)} autoComplete="family-name" required/></label></div>}<label className="auth-label">Adresse e-mail<input className="auth-input mt-2" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required/></label><label className="auth-label">Mot de passe<input className="auth-input mt-2" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete={mode === "sign-up" ? "new-password" : "current-password"} minLength={8} required/></label>{error && <p className="auth-error" role="alert">{error}</p>}<SubmitButton busy={busy} label={mode === "sign-in" ? "Se connecter" : "Créer mon compte"}/></form><p className="auth-terms">En continuant, vous acceptez la charte communautaire et la politique de confidentialité.</p></div>;
}

function SubmitButton({ busy, label }:{ busy:boolean; label:string }) { return <button disabled={busy} className="auth-primary">{busy && <LoaderCircle className="animate-spin" size={18}/>} {label}</button>; }
