import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { LogIn } from "lucide-react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { KitengePageBanner } from "@/components/shop/KitengePageBanner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Amazing Grace Boutique" },
      { name: "description", content: "Sign in to your Amazing Grace Boutique account." },
      { property: "og:title", content: "Sign in — Amazing Grace Boutique" },
      { property: "og:description", content: "Sign in to your Amazing Grace Boutique account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [mode, setMode] = React.useState<"in" | "up">("in");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      navigate({ to: "/" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setBusy(false);
      if (error) return setMsg(error.message);
      setMsg("Check your email and tap the confirmation link to finish creating your account.");
    }
  }

  async function google() {
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) return setMsg("Google sign-in failed. Please try again.");
    if (result.redirected) return;
    navigate({ to: "/" });
  }

  return (
    <SiteLayout>
      <KitengePageBanner eyebrow="Welcome" title="Sign in" description="Access your account." icon={LogIn} motif="diamonds" />
      <div className="mx-auto max-w-md px-4 py-12">
        {ready && user ? (
          <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-sm text-foreground">
              Signed in as <strong>{user.email}</strong>
            </p>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
          </div>
        ) : (
          <div className="space-y-5 rounded-lg border border-border bg-card p-6">
            <Button type="button" variant="outline" className="w-full" onClick={google}>
              Continue with Google
            </Button>
            <div className="text-center text-xs text-muted-foreground">or use your email</div>
            <form onSubmit={submit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
              </Button>
            </form>
            {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
            <button
              type="button"
              className="w-full text-center text-sm text-primary underline"
              onClick={() => {
                setMode(mode === "in" ? "up" : "in");
                setMsg(null);
              }}
            >
              {mode === "in" ? "No account? Create one" : "Have an account? Sign in"}
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
