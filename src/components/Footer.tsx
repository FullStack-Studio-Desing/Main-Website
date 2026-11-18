import Link from "next/link";
import { brand, footer } from "@/data/site-copy";
import { LogoMark } from "@/components/LogoMark";

export function Footer() {
  return (
    <footer className="w-full bg-black pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto w-full max-w-[1536px] px-6 pb-16 pt-20 sm:px-10">
        <Link
          href="/"
          className="mb-14 inline-flex items-center gap-2.5 text-white"
        >
          <LogoMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" tone="neon" />
          <span className="text-2xl font-bold tracking-tight sm:text-3xl">
            {brand.shortName}
            <span className="text-neon">.</span>
          </span>
        </Link>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
          {footer.columns.map((column) => (
            <nav key={column.label} className="flex flex-col gap-4">
              <span className="text-sm font-medium uppercase tracking-[0.143em] text-neon">
                {column.label}
              </span>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base tracking-[0.0125em] text-white transition-colors duration-200 hover:text-neon hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium uppercase tracking-[0.143em] text-neon">
              Reach us
            </span>
            <a
              href={`mailto:${brand.email}`}
              className="text-base tracking-[0.0125em] text-white transition-colors duration-200 hover:text-neon hover:underline"
            >
              {brand.email}
            </a>
            <span className="text-base text-white/50">{brand.hours}</span>
            <span className="text-base text-white/50">{brand.location}</span>
          </div>
        </div>

        {/* Legal baseline */}
        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-white/50">
            {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-base text-white/50 transition-colors duration-200 hover:text-neon"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-base text-white/50 transition-colors duration-200 hover:text-neon"
            >
              Terms
            </Link>
            <Link
              href="/login"
              className="text-base text-white/50 transition-colors duration-200 hover:text-neon"
            >
              Client login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
