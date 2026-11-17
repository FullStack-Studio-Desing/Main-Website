import Link from "next/link";
import { brand, footer } from "@/data/site-copy";

export function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="mx-auto max-w-[1536px] px-6 pb-16 pt-20 sm:px-10">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
