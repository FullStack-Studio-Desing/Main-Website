"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { FlipWords } from "@/components/ui/flip-words";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Meteors } from "@/components/ui/meteors";
import { GlowEffect } from "@/components/ui/animated-beam";
import { hero } from "@/data/site-copy";
import { FloatingShapes, OrbitingDots, DataViz, CodeLines } from "@/components/ui/floating-graphics";
import { ShootingStars, StarsBackground } from "@/components/ui/shooting-stars";
import { useIsMobile } from "@/lib/hooks";

export function HeroSection() {
  const isMobile = useIsMobile();
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-bg-body px-4 py-24 md:py-32"
    >
      {/* Background Effects */}
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60 opacity-40" fill="#888888" />
      <Spotlight className="top-40 -right-40 md:top-20 md:-right-20 opacity-50" fill="#bff747" />

      {/* Shooting Stars — skip on mobile to save GPU */}
      {!isMobile && (
        <>
          <StarsBackground starDensity={0.0001} />
          <ShootingStars minDelay={2000} maxDelay={5000} />
          <GlowEffect className="-top-40 -left-40 opacity-30" size="xl" />
          <GlowEffect className="-bottom-40 -right-40 opacity-20" size="lg" />
          <Meteors number={15} />
          <FloatingShapes />
        </>
      )}

      {/* Decorative elements - left side */}
      <div className="absolute left-8 top-1/3 hidden lg:block overflow-hidden">
        <OrbitingDots className="opacity-30" />
      </div>

      {/* Decorative elements - right side */}
      <div className="absolute right-8 bottom-1/3 hidden lg:block overflow-hidden">
        <DataViz className="opacity-40" />
      </div>

      {/* Code lines decoration */}
      <CodeLines className="left-12 bottom-1/4 hidden xl:block overflow-hidden" />

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-default bg-bg-section/50 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-theme opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-theme"></span>
          </span>
          <span className="text-text-muted">Now accepting new projects for Q1 2025</span>
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="font-display text-3xl font-bold leading-[1.05] text-text-header sm:text-5xl md:text-7xl lg:text-8xl">
            {hero.headline}
            <br />
            <FlipWords
              words={[...hero.flipWords]}
              className="text-theme"
              duration={2500}
            />
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-body md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {hero.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <HoverBorderGradient
            containerClassName="rounded-full"
            as={Link}
            href="/contact"
            className="flex items-center gap-2 font-semibold"
          >
            {hero.cta}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </HoverBorderGradient>
          <Link
            href="/services"
            className="group flex items-center gap-2 rounded-full border border-brand-default bg-transparent px-6 py-3 font-semibold text-text-header transition-all duration-300 hover:border-theme hover:text-theme"
          >
            Explore Services
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-12 grid grid-cols-3 gap-4 sm:mt-20 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {hero.stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div className="font-display text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-theme to-theme-accent sm:text-4xl md:text-5xl lg:text-6xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-wider text-text-muted">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trusted by / Social Proof */}
        <motion.div
          className="mt-12 border-t border-brand-default pt-8 sm:mt-20 sm:pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="mb-6 text-sm uppercase tracking-wider text-text-muted">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 opacity-50 sm:gap-8">
            {["TechStart", "GrowthCo", "ScaleUp", "LaunchPad", "ServicePro"].map((company, i) => (
              <div key={i} className="font-display text-base font-bold text-text-muted sm:text-xl">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
