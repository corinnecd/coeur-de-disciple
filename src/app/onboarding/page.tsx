import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth/server";
import { OnboardingFlow } from "./onboarding-flow";

export default async function OnboardingPage() {
  await connection();
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/connexion");
  return <OnboardingFlow user={{ id: session.user.id, name: session.user.name || "Disciple", email: session.user.email }} />;
}
