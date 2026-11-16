import Link from "next/link";
import { brand, footer } from "@/data/site-copy";
import { LogoMark } from "@/components/LogoMark";

export function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto max-w-[1536px] px-6 pb-16 pt-20 sm:px-10">
        {/* Commitment strip */}
        <div className="flex flex-col gap-6 rounded-shell bg-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon/15 ring-1 ring-neon/30">
              <LogoMark className="h-5 w-5" tone="neon" />
            </span>
            <p className="text-base font-medium text-white/85">
              {footer.commitment}
            </p>
          </div>
          <Link
            href="/#pricing"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-action bg-white/10 px-5 text-base font-medium text-white backdrop-blur-xl transition-colors duration-200 hover:bg-white/15"
          >
            See pricing
          </Link>
        </div>

        {/* Link columns */}
        <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
