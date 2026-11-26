"use client";

import { createClient } from "@neondatabase/neon-js";
import { authClient } from "@/lib/auth/client";

const dataApiUrl = process.env.NEXT_PUBLIC_NEON_DATA_API_URL;

if (!dataApiUrl) {
  throw new Error("NEXT_PUBLIC_NEON_DATA_API_URL doit être définie.");
}

export const dataClient = createClient({
  dataApi: {
    url: dataApiUrl,
    getToken: async () => {
      const { data } = await authClient.getSession();
      return data?.session.token ?? null;
    },
  },
});
