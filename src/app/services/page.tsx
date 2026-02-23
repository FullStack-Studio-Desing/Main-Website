"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/data/site-copy";
import { Spotlight } from "@/components/ui/spotlight";
import { Boxes } from "@/components/ui/background-boxes";
import { ShootingStars, StarsBackground } from "@/components/ui/shooting-stars";
import { useT } from "@/lib/i18n";

const serviceIcons: Record<string, React.ReactNode> = {
  "web-development": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "software-development": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  "ai-solutions": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  "digital-marketing": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
  "paid-advertising": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "seo": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

export default function ServicesPage() {
  const sp = useT("servicesPage");
  const sl = useT("serviceLabels");
  const sd = useT("serviceData");
  const sDescs = useT("serviceDescs");
  const sc = useT("serviceContent");

  return (
    <main className="min-h-screen bg-bg-body">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Boxes />
          <div className="absolute inset-0 w-full h-full bg-bg-body z-[1] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] pointer-events-none" />
        </div>

        <div className="absolute inset-0 z-[1]">
          <StarsBackground starDensity={0.00008} />
          <ShootingStars minDelay={2500} maxDelay={5500} />
        </div>

        <div className="absolute inset-0 z-[2]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(191,247,71,0.12),rgba(6,6,6,0))]" />
          <motion.div
            className="hidden sm:block absolute top-1/3 right-1/4 w-96 h-96 bg-theme/5 rounded-full blur-[100px]"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <Spotlight className="-top-40 left-0 md:left-60 z-[3]" fill="rgba(191, 247, 71, 0.15)" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-theme/20 bg-theme/5 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-theme" />
              </span>
              <span className="text-sm font-medium text-theme uppercase tracking-wider">
                {sp.badge}
              </span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-text-header mb-6">
              {sp.headline}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-theme to-theme-accent">
                {sp.headlineAccent}
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-text-body">
              {sp.body}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative border-t border-white/10 bg-bg-section py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const slug = service.slug as keyof typeof sd;
              const serviceT = sd[slug];
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 transition-all duration-500 hover:border-theme/30 hover:bg-white/10"
                  >
                    <span className="absolute top-6 right-6 font-display text-6xl font-bold text-white/5 transition-colors group-hover:text-theme/10">
                      0{index + 1}
                    </span>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-theme/10 text-theme transition-all group-hover:bg-theme group-hover:text-black group-hover:scale-110">
                      {serviceIcons[service.slug]}
                    </div>

                    <h3 className="mt-6 font-display text-2xl font-bold text-text-header transition-colors group-hover:text-theme">
                      {serviceT?.title || service.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-theme/80">
                      {serviceT?.headline || service.headline}
                    </p>
                    <p className="mt-4 flex-grow text-text-muted leading-relaxed">
                      {sDescs[slug as keyof typeof sDescs] || service.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {(sc[slug as keyof typeof sc]?.includes || service.includes).slice(0, 3).map((item) => (
                        <span
                          key={item.title}
                          className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-text-muted"
                        >
                          {item.title.split(" ").slice(0, 3).join(" ")}
                          {item.title.split(" ").length > 3 && "..."}
                        </span>
                      ))}
                      {service.includes.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-theme/10 px-3 py-1 text-xs text-theme">
                          +{service.includes.length - 3} {sp.more}
                        </span>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                      <div>
                        <span className="text-xs text-text-muted">{sp.startingAt}</span>
                        <div className="font-display text-xl font-bold text-text-header">
                          {serviceT?.price || service.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-theme opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <span className="text-sm font-semibold">{sp.learnMore}</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(191,247,71,0.03),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-theme">
              {sp.whyLabel}
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold text-text-header sm:text-5xl">
              {sp.whyHeadline}
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {sp.whyItems.map((item, index) => (
              <motion.div
                key={item.title}
                className="group text-center p-8 rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-theme/30 hover:bg-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-theme/10 text-theme transition-all group-hover:bg-theme group-hover:text-black">
                  {index === 0 && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-text-header">
                  {item.title}
                </h3>
                <p className="mt-3 text-text-muted">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/10 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(191,247,71,0.08),transparent)]" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold text-text-header sm:text-5xl lg:text-6xl">
              {sp.ctaHeadline}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-theme to-theme-accent">
                {sp.ctaAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
              {sp.ctaBody}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group relative overflow-hidden rounded-xl bg-theme px-8 py-4 text-lg font-semibold text-black transition-all hover:shadow-lg hover:shadow-theme/25"
              >
                <span className="relative z-10">{sp.ctaButton}</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                href="/packages"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-text-header transition-all hover:border-theme/30 hover:bg-white/10"
              >
                {sp.ctaPackages}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
