import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/LogoMark";
import { brand } from "@/data/site-copy";
import { signOut } from "@/lib/portal/actions";

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
    <div className="flex h-dvh overflow-hidden bg-paper text-body">
      <aside className="hidden h-full w-[260px] shrink-0 flex-col justify-between bg-forest px-6 py-8 lg:flex">
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
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-action px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    active ? "bg-white/10 text-white" : "text-white/70 hover:text-white"
                  }`}
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
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-forest px-5 py-4 text-white lg:hidden">
          <BrandLockup href={homeHref} compact />
          <div className="flex items-center gap-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-white/85">
                {item.label}
              </Link>
            ))}
            {preview ? null : (
              <form action={signOut}>
                <button type="submit" className="text-sm font-medium text-white/70">
                  Sign out
                </button>
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
      {preview ? (
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-white/70 transition-colors duration-200 hover:text-neon"
        >
          View site
        </Link>
      ) : (
        <form action={signOut} className="mt-4">
          <button
            type="submit"
            className="text-sm font-medium text-white/70 transition-colors duration-200 hover:text-neon"
          >
            Sign out
          </button>
        </form>
      )}
    </div>
  );
}
