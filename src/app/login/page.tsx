import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/LogoMark";
import { Blocked } from "@/components/studio/Blocked";
import { LoginForm } from "@/components/studio/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { brand } from "@/data/site-copy";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getSession } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Sign in · FullStack Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (isSupabaseConfigured()) {
    const session = await getSession();
    if (session.kind === "ready" && session.profile.role === "admin") redirect("/admin");
    if (session.kind === "ready") redirect("/portal");
  }

  return (
    <main className="studio-app flex min-h-dvh flex-col bg-background px-6 py-8 text-foreground">
      <Link href="/" className="flex items-center gap-2.5 text-foreground">
        <LogoMark className="h-7 w-7" tone="ink" />
        <span className="text-lg font-semibold tracking-tight">{brand.shortName}</span>
      </Link>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">
        {!isSupabaseConfigured() ? <Blocked session={{ kind: "unconfigured" }} /> : null}
        <Card className={!isSupabaseConfigured() ? "mt-8" : undefined}>
          <CardHeader>
            <CardDescription>Client portal</CardDescription>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Payments, your current plan, and every report we file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
