import type { Metadata } from "next";
import Link from "next/link";
import {
  Browser,
  ChartLineUp,
  Database,
  Robot,
  TrendUp,
  ArrowRight,
  type Icon,
} from "@phosphor-icons/react/dist/ssr";
import { brand, services } from "@/data/site-copy";
import { btnPrimary } from "@/components/buttons";

export const metadata: Metadata = {
  title: `Services | ${brand.name}`,
  description:
    "Websites, marketing, sales growth, AI automation, and custom CRMs. Five capabilities, one team.",
};

const icons: Record<string, Icon> = {
  browser: Browser,
  trend: TrendUp,
  chart: ChartLineUp,
  robot: Robot,
  database: Database,
};

export default function ServicesIndexPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-forest text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(62,91,67,0.45) 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-[1100px] px-6 pb-20 pt-36 text-center sm:px-10 lg:pb-28 lg:pt-44">
          <h1 className="font-display text-[40px] uppercase leading-[0.95] tracking-[-0.01em] sm:text-[56px] lg:text-[72px]">
            Everything your growth{" "}
            <span className="text-neon">depends on</span>
          </h1>
          <p className="mx-auto mt-8 max-w-[600px] text-lg font-medium leading-snug text-fog sm:text-xl">
            Five capabilities, one team, no hand-offs between agencies.
          </p>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <ul className="mx-auto max-w-[900px] divide-y divide-rule border-y border-rule px-6 sm:px-10">
          {services.map((service) => {
            const Glyph = icons[service.icon];
            return (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                  <span className="flex items-start gap-4 sm:items-center">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                      <Glyph size={24} weight="duotone" className="text-ink" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-muted">
                        {service.category}
                      </span>
                      <span className="mt-1 block text-2xl font-medium tracking-[-0.0125em] text-ink group-hover:text-leaf">
                        {service.title}
                      </span>
                      <span className="mt-2 block max-w-[520px] text-base leading-relaxed text-body">
                        {service.description}
                      </span>
                    </span>
                  </span>
                  <ArrowRight
                    size={22}
                    weight="bold"
                    className="shrink-0 self-end text-sage transition-transform duration-200 group-hover:translate-x-1 group-hover:text-leaf sm:self-center"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-16 flex justify-center px-6">
          <Link href="/contact" className={btnPrimary}>
            Book a call
          </Link>
        </div>
      </section>
    </main>
  );
}
