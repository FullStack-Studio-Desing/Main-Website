"use client";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { useT } from "@/lib/i18n";

interface Package {
  name: string;
  price: string;
  bestFor: string;
  includes: readonly string[];
  cta: string;
  popular?: boolean;
}

function PricingCard({
  pkg,
  index,
  popularLabel = "Popular",
}: {
  pkg: Package;
  index: number;
  popularLabel?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative h-full perspective-1000"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={`
          relative h-full rounded-[2.5rem] p-[1px] transition-all duration-500
          ${pkg.popular
            ? 'bg-gradient-to-b from-theme via-theme/50 to-theme/20'
            : 'bg-gradient-to-b from-white/20 via-white/5 to-transparent'
          }
        `}
      >
        <div className={`
          relative flex h-full flex-col rounded-[2.4rem] p-6 sm:p-8 lg:p-10 overflow-hidden
          ${pkg.popular ? 'bg-[#0a0a0a]' : 'bg-[#0a0a0a]'}
        `}>
          {/* Ambient glow on hover */}
          <motion.div
            className={`absolute -inset-px rounded-[2.5rem] opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`}
            style={{
              background: pkg.popular
                ? 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(191, 247, 71, 0.06), transparent 40%)'
                : 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.03), transparent 40%)',
            }}
          />

          {/* Popular indicator */}
          {pkg.popular && (
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-theme/10 border border-theme/20 px-3 py-1 text-xs font-medium text-theme">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-theme" />
                </span>
                {popularLabel}
              </span>
            </div>
          )}

          {/* Package header */}
          <div className="relative">
            <h3 className="font-display text-lg font-medium text-white/60 tracking-wide">
              {pkg.name}
            </h3>

            <div className="mt-6 flex items-baseline gap-2">
              <span className={`
                font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight
                ${pkg.popular ? 'text-theme' : 'text-white'}
              `}>
                {pkg.price}
              </span>
            </div>

            <p className="mt-4 text-sm text-white/40 leading-relaxed">
              {pkg.bestFor}
            </p>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-white/10" />

          {/* Features */}
          <ul className="flex-1 space-y-4">
            {pkg.includes.map((item, i) => (
              <motion.li
                key={item}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <svg
                  className={`h-5 w-5 shrink-0 mt-0.5 ${pkg.popular ? 'text-theme' : 'text-white/40'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-white/70">{item}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="mt-10">
            <Link
              href="/contact"
              className={`
                group relative flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold transition-all duration-300
                ${pkg.popular
                  ? 'bg-theme text-black hover:bg-white hover:shadow-lg hover:shadow-theme/20'
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
                }
              `}
            >
              {pkg.cta}
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PackagesSection() {
  const ps = useT("packagesSection");
  const packages = useT("packages") as unknown as { name: string; price: string; bestFor: string; includes: string[]; cta: string; popular?: boolean }[];
  return (
    <section id="packages" className="relative overflow-hidden bg-[#050505] py-24 lg:py-32">
      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#BFF747"
      />

      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(191,247,71,0.03),transparent)]" />


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-theme text-sm font-medium uppercase tracking-widest mb-4"
          >
            {ps.label}
          </motion.span>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {ps.headline}
          </h2>
          <p className="mt-6 text-lg text-white/50 leading-relaxed">
            {ps.body}
          </p>
        </motion.div>

        {/* Pricing Grid - 3 columns */}
        <div className="mt-20 grid gap-8 lg:grid-cols-3 items-stretch">
          {packages.map((pkg, index) => (
            <PricingCard key={pkg.name} pkg={pkg} index={index} popularLabel={ps.popular} />
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-sm text-white/40">
            {ps.bottomNote}{" "}
            <Link href="/contact" className="text-theme hover:text-white transition-colors">
              {ps.customLink}
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
