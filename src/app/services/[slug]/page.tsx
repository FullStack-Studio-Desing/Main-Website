"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getServiceBySlug, services } from "@/data/site-copy";
import dynamic from "next/dynamic";
import { Spotlight } from "@/components/ui/spotlight";
import { Boxes } from "@/components/ui/background-boxes";
import { ShootingStars, StarsBackground } from "@/components/ui/shooting-stars";
import { useT } from "@/lib/i18n";

const Globe = dynamic(
  () => import("@/components/ui/globe").then((mod) => mod.Globe),
  { ssr: false }
);
import { ServiceIncludesBento } from "@/components/ui/service-includes-widget";
import { AnimatedCodeEditor } from "@/components/ui/animated-code-editor";
import { TechStackMarquee, serviceTitles } from "@/components/ui/tech-stack-marquee";
import {
  SoftwareDevWidget,
  AISolutionsWidget,
  DigitalMarketingWidget,
  PaidAdvertisingWidget,
  SEOWidget,
} from "@/components/ui/service-hero-widgets";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/hooks";

// Service icons mapping
const serviceIcons: Record<string, React.ReactNode> = {
  "web-development": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "software-development": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  "ai-solutions": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  "digital-marketing": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  ),
  "paid-advertising": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "seo": (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

// Service card gradient backgrounds
const serviceGradients: Record<string, string> = {
  "web-development": "from-blue-500/20 via-cyan-500/10 to-transparent",
  "software-development": "from-purple-500/20 via-violet-500/10 to-transparent",
  "ai-solutions": "from-theme/20 via-theme-accent/10 to-transparent",
  "digital-marketing": "from-pink-500/20 via-rose-500/10 to-transparent",
  "paid-advertising": "from-orange-500/20 via-amber-500/10 to-transparent",
  "seo": "from-emerald-500/20 via-green-500/10 to-transparent",
};

// Unique hero images/visuals for each service
const serviceVisuals: Record<string, React.ReactNode> = {
  "web-development": <AnimatedCodeEditor />,
  "software-development": <SoftwareDevWidget />,
  "ai-solutions": <AISolutionsWidget />,
  "digital-marketing": <DigitalMarketingWidget />,
  "paid-advertising": <PaidAdvertisingWidget />,
  "seo": <SEOWidget />,
};

// Benefits data
const serviceBenefits: Record<string, { icon: React.ReactNode }[]> = {
  "web-development": [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
  ],
  "software-development": [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
  ],
  "ai-solutions": [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ],
  "digital-marketing": [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> },
  ],
  "paid-advertising": [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
  ],
  "seo": [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ],
};

// We need per-slug benefit text translations
// For now, benefits text comes from translations via serviceDetail benefits
// Since there are no per-slug benefit translations in the translation file,
// we keep the original English data and use generic labels from serviceDetail

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = getServiceBySlug(slug);
  const isMobile = useIsMobile();
  const dt = useT("serviceDetail");
  const sd = useT("serviceData");
  const sct = useT("serviceCardTitles");
  const scd = useT("serviceCardDescriptions");

  if (!service) {
    return (
      <main className="min-h-screen bg-bg-body flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-header">{dt.serviceNotFound}</h1>
          <Link href="/services" className="mt-4 text-theme hover:underline">
            {dt.backToServicesLink}
          </Link>
        </div>
      </main>
    );
  }

  const benefits = serviceBenefits[slug] || serviceBenefits["web-development"];
  const visual = serviceVisuals[slug] || serviceVisuals["web-development"];
  const serviceT = sd[slug as keyof typeof sd];
  const trustIndicators = [dt.noHiddenFees, dt.freeConsultation, dt.resultsGuaranteed];

  return (
    <main className="min-h-screen bg-bg-body">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {!isMobile && (
          <>
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <Boxes className="pointer-events-auto" />
              <div className="absolute inset-0 w-full h-full bg-bg-body [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] pointer-events-none" />
            </div>
            <div className="absolute inset-0 z-[1]">
              <StarsBackground starDensity={0.00006} />
              <ShootingStars minDelay={3000} maxDelay={6000} />
            </div>
          </>
        )}

        <div className="absolute inset-0 z-[2]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(191,247,71,0.12),rgba(6,6,6,0))]" />
          {!isMobile && (
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-theme/5 rounded-full blur-[100px]"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>

        <Spotlight className="-top-40 left-0 md:left-60 z-[3]" fill="rgba(191, 247, 71, 0.15)" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-theme/20 bg-theme/5 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-theme" />
                </span>
                <span className="text-sm font-medium text-theme uppercase tracking-wider">
                  {serviceT?.title || service.title}
                </span>
              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-header mb-6">
                {serviceT?.headline || service.headline}
              </h1>

              <p className="text-lg text-text-body leading-relaxed mb-8 max-w-xl">
                {service.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4">
                  <span className="text-sm text-text-muted">{dt.startingAt}</span>
                  <div className="font-display text-3xl font-bold text-theme">
                    {serviceT?.price || service.price}
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="group relative overflow-hidden rounded-xl bg-theme px-8 py-4 text-lg font-semibold text-black transition-all hover:shadow-lg hover:shadow-theme/25"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {dt.getStarted}
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {trustIndicators.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <svg className="h-5 w-5 text-theme" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-text-muted">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative h-80 lg:h-[500px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {visual}
            </motion.div>
          </div>

          <motion.div
            className="mt-16 lg:mt-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <span className="text-sm font-medium text-text-muted uppercase tracking-wider">
                {dt.techTitle}
              </span>
            </div>
            <TechStackMarquee serviceSlug={slug} />
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="relative border-t border-white/10 bg-bg-section py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-theme">
              {dt.whatsIncluded}
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold text-text-header sm:text-5xl">
              {dt.everythingYouNeed}
            </h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto">
              {dt.includesBody}
            </p>
          </motion.div>

          <ServiceIncludesBento includes={service.includes} />
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(191,247,71,0.04),transparent)]" />
        <div className="hidden sm:block absolute top-20 left-10 w-72 h-72 bg-theme/5 rounded-full blur-[100px]" />
        <div className="hidden sm:block absolute bottom-20 right-10 w-96 h-96 bg-theme-accent/5 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-theme/20 bg-theme/5 text-sm font-semibold uppercase tracking-wider text-theme mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-theme animate-pulse" />
              {dt.whyLabel}
            </span>
            <h2 className="font-display text-4xl font-bold text-text-header sm:text-5xl">
              {dt.builtFor}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme to-theme-accent">
                {dt.results}
              </span>
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-full p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-theme/30 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-theme/5 hover:-translate-y-2">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-theme/10 via-transparent to-theme-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative mb-5">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-theme/20 to-theme/5 text-theme transition-all duration-300 group-hover:scale-110 group-hover:from-theme group-hover:to-theme-accent group-hover:text-black">
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {benefit.icon}
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-xl border border-theme/20 scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-theme/10 to-transparent transform translate-x-4 -translate-y-4 rotate-45 group-hover:from-theme/20 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative border-t border-white/10 bg-bg-section py-24 lg:py-32 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-theme">
                {dt.processLabel}
              </span>
              <h2 className="mt-3 font-display text-4xl font-bold text-text-header sm:text-5xl">
                {dt.processHeadline}
              </h2>
            </motion.div>
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-text-muted leading-relaxed">
                {dt.processBody}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {dt.processSteps.map((item, index) => (
              <motion.div
                key={item.step}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={cn(
                  "relative h-full p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500",
                  "hover:border-theme/30 hover:bg-white/[0.04]"
                )}>
                  <div className="absolute top-6 right-6 font-display text-7xl font-bold text-white/[0.03] select-none transition-all duration-500 group-hover:text-theme/10">
                    {item.step}
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-theme/10 text-theme font-display font-bold transition-all duration-300 group-hover:bg-theme group-hover:text-black">
                        {index + 1}
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-r from-theme/20 to-transparent" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-text-header mb-3 transition-colors group-hover:text-theme">
                      {item.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed max-w-sm">
                      {item.desc}
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-theme/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Services - Apple Cards Carousel */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {!isMobile && (
          <div className="absolute inset-0">
            <StarsBackground starDensity={0.00015} />
            <ShootingStars minDelay={4000} maxDelay={8000} />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(191,247,71,0.04),transparent)]" />

        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-theme">
                {dt.moreSolutions}
              </span>
              <h3 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-text-header">
                {dt.exploreOther}
              </h3>
              <p className="mt-4 text-text-muted max-w-2xl mx-auto">
                {dt.exploreOtherBody}
              </p>
            </motion.div>
          </div>

          <Carousel
            items={services
              .filter((s) => s.slug !== slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group block"
                >
                  <div className={cn(
                    "relative h-96 w-56 md:h-[36rem] md:w-80 rounded-3xl overflow-hidden border border-white/10 bg-bg-section transition-all duration-500",
                    "hover:border-theme/30 hover:shadow-2xl hover:shadow-theme/10"
                  )}>
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br",
                      serviceGradients[s.slug] || "from-theme/20 via-theme/10 to-transparent"
                    )} />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.03] transition-all duration-700 group-hover:text-white/[0.06] group-hover:scale-110">
                      <div className="w-64 h-64 md:w-80 md:h-80">
                        {serviceIcons[s.slug] && (
                          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                            {s.slug === "web-development" && <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                            {s.slug === "software-development" && <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />}
                            {s.slug === "ai-solutions" && <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />}
                            {s.slug === "digital-marketing" && <><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></>}
                            {s.slug === "paid-advertising" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                            {s.slug === "seo" && <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full bg-theme/10 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                    <div className="relative h-full flex flex-col p-6 md:p-8">
                      <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-sm text-theme mb-auto transition-all duration-500 group-hover:bg-theme group-hover:text-black group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-theme/30">
                        {serviceIcons[s.slug]}
                      </div>

                      <h4 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 transition-colors group-hover:text-theme">
                        {sct[s.slug as keyof typeof sct] || s.title}
                      </h4>

                      <p className="text-sm text-text-muted leading-relaxed mb-4">
                        {scd[s.slug as keyof typeof scd]}
                      </p>

                      <div className="flex items-center gap-2 text-sm font-medium text-theme">
                        <span>{dt.learnMore}</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-theme to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </Link>
              ))}
          />

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-white/10 bg-white/5 text-text-body font-medium transition-all duration-300 hover:border-theme/30 hover:bg-white/10 hover:text-theme"
            >
              {dt.viewAllServices}
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
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
              {dt.ctaHeadline}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
              {dt.ctaBody}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group relative overflow-hidden rounded-xl bg-theme px-8 py-4 text-lg font-semibold text-black transition-all hover:shadow-lg hover:shadow-theme/25"
              >
                <span className="relative z-10">{dt.startProject}</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link
                href="/services"
                className="flex items-center gap-2 text-text-muted hover:text-theme transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {dt.backToServices}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
