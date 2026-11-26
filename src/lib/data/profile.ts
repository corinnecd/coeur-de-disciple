"use client";

import { dataClient } from "./client";

export type ProfilePreferences = {
  rhythm: "daily" | "weekdays" | "three_days";
  reminderTime: string;
  translation: "LSG" | "S21" | "BDS";
};

type Identity = {
  id: string;
  email: string;
  name: string;
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Disciple",
    lastName: parts.slice(1).join(" ") || null,
  };
}

export async function saveProfile(identity: Identity, preferences: ProfilePreferences) {
  const { data: user, error: userError } = await dataClient
    .from("users")
    .upsert(
      { auth_user_id: identity.id, email: identity.email, updated_at: new Date().toISOString() },
      { onConflict: "auth_user_id" },
    )
    .select("id")
    .single();

  if (userError || !user) {
    throw new Error(userError?.message || "Impossible de créer le profil utilisateur.");
  }

  const { firstName, lastName } = splitName(identity.name);
  const { error: profileError } = await dataClient.from("user_profiles").upsert(
    {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      bible_translation: preferences.translation,
      meditation_rhythm: preferences.rhythm,
      reminder_time: `${preferences.reminderTime}:00`,
      timezone: "Europe/Paris",
      onboarding_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (profileError) throw new Error(profileError.message);
}

export async function loadProfile(authUserId: string): Promise<ProfilePreferences | null> {
  const { data: user, error: userError } = await dataClient
    .from("users")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (userError) throw new Error(userError.message);
  if (!user) return null;

  const { data: profile, error: profileError } = await dataClient
    .from("user_profiles")
    .select("bible_translation, meditation_rhythm, reminder_time")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!profile) return null;

  return {
    rhythm: profile.meditation_rhythm as ProfilePreferences["rhythm"],
    reminderTime: String(profile.reminder_time).slice(0, 5),
    translation: profile.bible_translation as ProfilePreferences["translation"],
  };
}
