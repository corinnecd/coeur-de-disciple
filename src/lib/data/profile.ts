"use client";

import { loadProfileAction, saveProfileAction } from "./profile-actions";
import type { ProfilePreferences } from "./types";

export type { ProfilePreferences } from "./types";

type Identity = { id: string; email: string; name: string; firstName?: string; lastName?: string };

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || "Disciple", lastName: parts.slice(1).join(" ") || null };
}

function resolveProfileName(identity: Identity) {
  if (identity.firstName?.trim() && identity.lastName?.trim()) return { firstName: identity.firstName.trim(), lastName: identity.lastName.trim() };
  if (typeof window !== "undefined") {
    const pendingName = localStorage.getItem("coeur-de-disciple.pending-name");
    if (pendingName) {
      try {
        const parsed = JSON.parse(pendingName) as { firstName?: string; lastName?: string; email?: string };
        if (parsed.email?.toLowerCase() === identity.email.toLowerCase() && parsed.firstName?.trim() && parsed.lastName?.trim()) return { firstName: parsed.firstName.trim(), lastName: parsed.lastName.trim() };
      } catch { localStorage.removeItem("coeur-de-disciple.pending-name"); }
    }
  }
  return splitName(identity.name);
}

export async function saveProfile(identity: Identity, preferences: ProfilePreferences) {
  const { firstName, lastName } = resolveProfileName(identity);
  await saveProfileAction(preferences, { firstName, lastName });
  if (typeof window !== "undefined") localStorage.removeItem("coeur-de-disciple.pending-name");
}

export async function loadProfile(authUserId: string): Promise<ProfilePreferences | null> {
  void authUserId;
  return loadProfileAction();
}
