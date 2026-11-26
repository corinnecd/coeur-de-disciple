"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userProfiles, users } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import type { ProfilePreferences } from "./types";

type ProfileName = { firstName: string; lastName: string | null };
const rhythms = new Set(["daily", "weekdays", "three_days"]);
const translations = new Set(["LSG", "S21", "BDS"]);

function fallbackName(name: string): ProfileName {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || "Disciple", lastName: parts.slice(1).join(" ") || null };
}

export async function saveProfileAction(preferences: ProfilePreferences, suppliedName?: ProfileName) {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Votre session a expiré. Reconnectez-vous pour continuer.");
  if (!rhythms.has(preferences.rhythm) || !translations.has(preferences.translation) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(preferences.reminderTime)) throw new Error("Vérifiez les préférences sélectionnées puis réessayez.");
  const safeName = suppliedName?.firstName.trim() ? { firstName: suppliedName.firstName.trim(), lastName: suppliedName.lastName?.trim() || null } : fallbackName(session.user.name || "Disciple");

  try {
    const now = new Date();
    const [user] = await db.insert(users).values({ authUserId: session.user.id, email: session.user.email, updatedAt: now }).onConflictDoUpdate({ target: users.authUserId, set: { email: session.user.email, updatedAt: now } }).returning({ id: users.id });
    await db.insert(userProfiles).values({
      userId: user.id, firstName: safeName.firstName, lastName: safeName.lastName,
      bibleTranslation: preferences.translation, meditationRhythm: preferences.rhythm,
      reminderTime: preferences.reminderTime + ":00", timezone: "Europe/Paris",
      onboardingCompletedAt: now, updatedAt: now,
    }).onConflictDoUpdate({
      target: userProfiles.userId,
      set: { firstName: safeName.firstName, lastName: safeName.lastName, bibleTranslation: preferences.translation, meditationRhythm: preferences.rhythm, reminderTime: preferences.reminderTime + ":00", timezone: "Europe/Paris", onboardingCompletedAt: now, updatedAt: now },
    });
  } catch (error) {
    console.error("Profile save failed", error);
    throw new Error("L’enregistrement a rencontré un problème. Réessayez dans un instant.");
  }
}

export async function loadProfileAction(): Promise<ProfilePreferences | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) throw new Error("Votre session a expiré. Reconnectez-vous pour continuer.");
  const [result] = await db.select({ rhythm: userProfiles.meditationRhythm, reminderTime: userProfiles.reminderTime, translation: userProfiles.bibleTranslation }).from(users).innerJoin(userProfiles, eq(users.id, userProfiles.userId)).where(eq(users.authUserId, session.user.id)).limit(1);
  if (!result) return null;
  return { rhythm: result.rhythm, reminderTime: String(result.reminderTime).slice(0, 5), translation: result.translation as ProfilePreferences["translation"] };
}
