"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { loadProfile, saveProfile, type ProfilePreferences } from "@/lib/data/profile";

type Identity = { id:string; name:string; email:string };

const defaults: ProfilePreferences = {
  rhythm: "daily",
  reminderTime: "07:00",
  translation: "LSG",
};

export function ProfilePreferencesForm({ user }:{ user:Identity }) {
  const [preferences, setPreferences] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadProfile(user.id)
      .then((profile) => { if (profile) setPreferences(profile); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Impossible de charger vos préférences."))
      .finally(() => setLoading(false));
  }, [user.id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setSaved(false); setError("");
    try {
      await saveProfile(user, preferences);
      localStorage.setItem("coeur-de-disciple.preferences", JSON.stringify(preferences));
      setSaved(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d’enregistrer vos préférences.");
    } finally { setSaving(false); }
  }

  if (loading) return <div className="my-8 flex items-center gap-3 text-sm text-emerald-950/55"><LoaderCircle className="animate-spin" size={18}/>Chargement des préférences…</div>;

  return <form onSubmit={submit} className="my-8 space-y-5 border-y border-emerald-950/10 py-8">
    <div><p className="eyebrow">Rythme personnel</p><h2 className="font-display mt-2 text-2xl font-semibold">Mes préférences de méditation</h2></div>
    <label className="auth-label">Fréquence<select className="auth-input mt-2" value={preferences.rhythm} onChange={(event) => setPreferences({...preferences, rhythm:event.target.value as ProfilePreferences["rhythm"]})}><option value="daily">Chaque jour</option><option value="weekdays">En semaine</option><option value="three_days">3 jours par semaine</option></select></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="auth-label">Heure de rappel<input className="auth-input mt-2" type="time" value={preferences.reminderTime} onChange={(event) => setPreferences({...preferences, reminderTime:event.target.value})}/></label><label className="auth-label">Traduction biblique<select className="auth-input mt-2" value={preferences.translation} onChange={(event) => setPreferences({...preferences, translation:event.target.value as ProfilePreferences["translation"]})}><option value="LSG">Louis Segond 1910</option><option value="S21">Segond 21</option><option value="BDS">Bible du Semeur</option></select></label></div>
    {error && <p className="auth-error" role="alert">{error}</p>}
    {saved && <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18}/>Préférences enregistrées dans votre espace sécurisé.</p>}
    <button disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 font-bold text-white disabled:opacity-60">{saving && <LoaderCircle className="animate-spin" size={18}/>}Enregistrer mes préférences</button>
  </form>;
}
