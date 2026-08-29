import { useSession } from "@tanstack/react-start/server";

type AdminSession = { unlocked?: boolean };

export async function isAdminUnlocked() {
  const session = await useSession<AdminSession>({
    password: process.env["SESSION_SECRET"]!,
    name: "agb-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  });
  return session.data.unlocked === true;
}
