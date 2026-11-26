"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export function SignOutButton({ compact = false }:{ compact?:boolean }) {
  const router = useRouter();
  async function signOut() { await authClient.signOut(); router.push("/"); router.refresh(); }
  return <button onClick={signOut} className={compact ? "flex items-center gap-2 text-sm text-white/60 hover:text-white" : "flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-950/10 bg-white px-4 py-3 font-bold text-emerald-950 hover:bg-emerald-50"}><LogOut size={17}/>Se déconnecter</button>;
}
