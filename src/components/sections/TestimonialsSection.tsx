"use client";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { useT } from "@/lib/i18n";
import { Spotlight } from "@/components/ui/spotlight";
import { Particles, AnimatedGrid } from "@/components/ui/floating-graphics";

export function TestimonialsSection() {
  const tt = useT("testimonials");
  const testimonials = useT("testimonialItems") as unknown as { quote: string; author: string; role: string }[];
  return (
    <section className="relative overflow-hidden border-t border-brand-default bg-bg-body py-24 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(191,247,71,0.03),transparent)]" />
      <Spotlight className="top-0 -right-40" fill="rgba(191, 247, 71, 0.06)" />
      <Particles count={10} />
      <AnimatedGrid />

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
            <svg className="h-4 w-4 text-theme" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-theme uppercase tracking-wider">
              {tt.label}
            </span>
          </motion.div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-header sm:text-5xl lg:text-6xl">
            {tt.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-body">
            {tt.body}
          </p>

          {/* Stats Row */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:gap-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {(tt.stats as unknown as { value: string; label: string }[]).map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-theme to-theme-accent lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          className="relative mt-16 -mx-4 sm:-mx-6 lg:-mx-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <InfiniteMovingCards
            items={[...testimonials]}
            direction="left"
            speed="slow"
            pauseOnHover={true}
          />
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-16 flex flex-col items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-bg-body bg-gradient-to-br from-theme/40 to-theme-accent/40 text-xs font-bold text-white"
                >
                  {["JD", "SK", "ML", "AR"][i]}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-theme" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-text-muted">
                {tt.ratedText}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
