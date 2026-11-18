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
    <div className="studio-app flex h-dvh overflow-hidden bg-background text-foreground">
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-muted/40 lg:flex">
        <div className="flex h-14 items-center border-b border-border px-6">
          <BrandLockup href={homeHref} />
        </div>
        <div className="flex flex-1 flex-col justify-between px-3 py-4">
          <div>
            {preview ? (
              <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Preview
              </p>
            ) : null}
            <nav className="flex flex-col gap-1">
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
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <AccountFooter email={email} preview={preview} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <BrandLockup href={homeHref} compact />
            {preview ? null : (
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            )}
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-2 py-2">
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
                    "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function BrandLockup({ href, compact = false }: { href: string; compact?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 text-foreground">
      <LogoMark className={compact ? "h-6 w-6" : "h-7 w-7"} tone="ink" />
      <span className={cn("font-semibold tracking-tight", compact ? "text-base" : "text-lg")}>
        {compact ? "Studio" : brand.shortName}
      </span>
    </Link>
  );
}

function AccountFooter({ email, preview }: { email?: string; preview: boolean }) {
  return (
    <div className="px-3">
      {email ? (
        <p className="break-all text-xs leading-relaxed text-muted-foreground">{email}</p>
      ) : null}
      <Separator className="my-3" />
      {preview ? (
        <Button asChild variant="link" className="h-auto px-0 text-muted-foreground">
          <Link href="/">View site</Link>
        </Button>
      ) : (
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm" className="h-8 w-full justify-start px-2">
            Sign out
          </Button>
        </form>
      )}
    </div>
  );
}
