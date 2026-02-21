"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/data/site-copy";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Spotlight } from "@/components/ui/spotlight";
import { CornerAccents } from "@/components/ui/floating-graphics";
import { BackgroundRippleStatic } from "@/components/ui/background-ripple";
import { useT } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/translations";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Icon mapping for services
const serviceIcons: Record<string, React.ReactNode> = {
  "web-design": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "web-development": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  "ecommerce": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  "seo": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  "branding": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  "maintenance": (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export function ServicesSection() {
  const ss = useT("servicesSection");
  const { locale } = useLocale();
  const sd = t("serviceData", locale) as Record<string, { title: string; headline: string; price: string }>;
  const sl = t("serviceLabels", locale) as Record<string, string>;
  return (
    <section id="services" className="relative overflow-hidden border-t border-brand-default bg-bg-body py-24 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(191,247,71,0.08),transparent)]" />
      <Spotlight className="-top-20 right-0" fill="rgba(191, 247, 71, 0.08)" />
      <BackgroundRippleStatic rows={9} cols={22} cellSize={54} className="opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-theme/20 bg-theme/5 mb-6"
          >
            <span className="text-sm font-medium text-theme uppercase tracking-wider">
              {ss.label}
            </span>
          </motion.div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-header sm:text-5xl lg:text-6xl">
            {ss.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-body">
            {ss.body}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((s, index) => (
            <motion.div key={s.title} variants={itemVariants}>
              <CardSpotlight className="h-full">
                <div className="p-6 lg:p-8 relative h-full flex flex-col">
                  <CornerAccents className="opacity-30" />
                  {/* Service Icon */}
                  <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-theme/10 p-3 text-theme">
                    {serviceIcons[s.slug] || (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>

                  {/* Service Number */}
                  <div className="absolute top-6 right-6 font-display text-5xl font-bold text-theme/10 lg:text-6xl">
                    0{index + 1}
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-text-header lg:text-2xl">
                    {sd[s.slug]?.title || s.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-theme">
                    {sd[s.slug]?.headline || s.headline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-text-body">
                    {s.description}
                  </p>

                  {/* Features */}
                  <ul className="mt-6 space-y-2">
                    {s.includes.slice(0, 4).map((item) => (
                      <li key={item.title} className="flex items-start gap-3 text-sm text-text-muted">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-theme/20">
                          <svg className="h-2.5 w-2.5 text-theme" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                          </svg>
                        </span>
                        {item.title}
                      </li>
                    ))}
                  </ul>

                  {/* Footer - pushed to bottom */}
                  <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between border-t border-brand-default pt-6">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-text-muted">{ss.startingAt}</span>
                        <div className="font-display text-xl font-bold text-text-header">
                          {sd[s.slug]?.price || s.price}
                        </div>
                      </div>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex items-center gap-2 rounded-full bg-theme/10 px-4 py-2 text-sm font-semibold text-theme transition-all duration-300 hover:bg-theme hover:text-bg-body"
                      >
                        {ss.explore}
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-text-muted mb-4">
            {ss.customNote}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-theme font-semibold hover:underline"
          >
            {ss.customCta}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
