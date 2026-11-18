import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/LogoMark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { brand } from "@/data/site-copy";
import { signOut } from "@/lib/portal/actions";
import { cn } from "@/lib/utils";

export function StudioShell({
  homeHref,
  nav,
  pathname,
  email,
  preview = false,
  children,
}: {
  homeHref: string;
  nav: { href: string; label: string }[];
  pathname: string;
  email?: string;
  preview?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <aside className="hidden h-full w-[260px] shrink-0 flex-col justify-between bg-primary px-6 py-8 text-primary-foreground lg:flex">
        <div>
          <BrandLockup href={homeHref} />
          {preview ? (
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-neon">
              Preview
            </p>
          ) : null}
          <nav className="mt-10 flex flex-col gap-1">
            {nav.map((item) => {
              const active =
                item.href === "/admin" || item.href === "/portal"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <AccountFooter email={email} preview={preview} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-primary px-5 py-4 text-primary-foreground lg:hidden">
          <BrandLockup href={homeHref} compact />
          <div className="flex items-center gap-3">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-white/85">
                {item.label}
              </Link>
            ))}
            {preview ? null : (
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white">
                  Sign out
                </Button>
              </form>
            )}
          </div>
        </div>
        <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-10 sm:py-12">
          {children}
        </div>
      </div>
    </div>
  );
}

function BrandLockup({ href, compact = false }: { href: string; compact?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-white">
      <LogoMark className={compact ? "h-7 w-7" : "h-8 w-8"} tone="neon" />
      <span className={`font-bold tracking-tight ${compact ? "text-lg" : "text-xl"}`}>
        {compact ? "Studio" : brand.shortName}
        <span className="text-neon">.</span>
      </span>
    </Link>
  );
}

function AccountFooter({ email, preview }: { email?: string; preview: boolean }) {
  return (
    <div>
      {email ? <p className="break-all text-xs leading-relaxed text-white/50">{email}</p> : null}
      <Separator className="my-4 bg-white/10" />
      {preview ? (
        <Button asChild variant="link" className="h-auto p-0 text-white/70 hover:text-neon">
          <Link href="/">View site</Link>
        </Button>
      ) : (
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="h-auto px-0 text-white/70 hover:bg-transparent hover:text-neon"
          >
            Sign out
          </Button>
        </form>
      )}
    </div>
  );
}
