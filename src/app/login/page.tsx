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
    <main className="studio-app flex min-h-dvh flex-col bg-muted/40 px-4 py-6 text-foreground sm:px-6">
      <Link href="/" className="flex items-center gap-2 self-start text-foreground">
        <LogoMark className="size-6" tone="ink" />
        <span className="text-base font-semibold tracking-tight">{brand.shortName}</span>
      </Link>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 py-12">
        {!isSupabaseConfigured() ? <Blocked session={{ kind: "unconfigured" }} /> : null}
        <Card>
          <CardHeader className="space-y-1 text-center">
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
