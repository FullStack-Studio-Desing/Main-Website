import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/LogoMark";
import { Blocked } from "@/components/studio/Blocked";
import { LoginForm } from "@/components/studio/LoginForm";
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
    <main className="flex min-h-dvh flex-col bg-paper px-6 py-8">
      <Link href="/" className="flex items-center gap-2.5 text-ink">
        <LogoMark className="h-8 w-8" tone="ink" />
        <span className="text-xl font-bold tracking-tight">
          {brand.shortName}
          <span className="text-leaf">.</span>
        </span>
      </Link>
      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-16">
        {!isSupabaseConfigured() ? <Blocked session={{ kind: "unconfigured" }} /> : null}
        <p className={`text-sm font-medium text-muted ${isSupabaseConfigured() ? "" : "mt-10"}`}>
          Client portal
        </p>
        <h1 className="mt-3 font-display text-[44px] uppercase leading-none tracking-[-0.02em] text-ink">
          Sign in
        </h1>
        <p className="mt-4 text-base leading-relaxed text-body">
          Payments, your current plan, and every report we file.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
