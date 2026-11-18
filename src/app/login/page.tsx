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
    <main className="flex min-h-dvh flex-col bg-background px-6 py-8">
      <Link href="/" className="flex items-center gap-2.5 text-foreground">
        <LogoMark className="h-8 w-8" tone="ink" />
        <span className="text-xl font-bold tracking-tight">
          {brand.shortName}
          <span className="text-leaf">.</span>
        </span>
      </Link>
      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-16">
        {!isSupabaseConfigured() ? <Blocked session={{ kind: "unconfigured" }} /> : null}
        <Card className={!isSupabaseConfigured() ? "mt-10" : undefined}>
          <CardHeader>
            <p className="text-sm font-medium text-muted-foreground">Client portal</p>
            <CardTitle className="font-display text-[44px] uppercase leading-none tracking-[-0.02em]">
              Sign in
            </CardTitle>
            <CardDescription className="text-base text-body">
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
