"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundRippleStatic } from "@/components/ui/background-ripple";
import { ShootingStars, StarsBackground } from "@/components/ui/shooting-stars";

// Dynamically import Globe to avoid SSR issues with canvas
const Globe = dynamic(
  () => import("@/components/ui/globe").then((mod) => mod.Globe),
  { ssr: false }
);

const values = [
  {
    number: "01",
    title: "Ship Fast, Ship Right",
    description: "Weeks, not months. Quality at speed.",
  },
  {
    number: "02",
    title: "Outcomes Over Output",
    description: "Your growth is our KPI.",
  },
  {
    number: "03",
    title: "Radically Transparent",
    description: "No surprises. You always know where you stand.",
  },
  {
    number: "04",
    title: "Built to Scale",
    description: "We build for tomorrow, not just today.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-bg-body py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(191,247,71,0.05),transparent)]" />
      <Spotlight className="top-0 -left-40" fill="rgba(40, 233, 140, 0.06)" />
      <BackgroundRippleStatic rows={8} cols={24} cellSize={56} className="opacity-30" />

      {/* Shooting Stars Background */}
      <StarsBackground starDensity={0.00012} allStarsTwinkle={true} twinkleProbability={0.8} />
      <ShootingStars
        minDelay={1500}
        maxDelay={4000}
        starColor="#bff747"
        trailColor="#28e98c"
        starWidth={12}
        starHeight={1}
      />

      <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-12">
        {/* Two Column Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Globe */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mx-auto h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] md:h-[550px] md:w-[550px] lg:h-[650px] lg:w-[650px]">
              <Globe />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            className="order-1 lg:order-2 flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <span className="inline-block text-theme text-sm font-semibold uppercase tracking-wider mb-4">
              About Us
            </span>
            <h2 className="font-display text-4xl font-bold tracking-tight text-text-header sm:text-5xl lg:text-6xl">
              More Than an Agency
            </h2>
            <p className="mt-6 text-xl text-text-body leading-relaxed max-w-lg">
              Engineers, designers, and marketers building great products—fast.
            </p>

            {/* Values - Vertical Stack */}
            <div className="mt-12 space-y-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="group flex items-center gap-6 border-l-2 border-brand-default pl-6 hover:border-theme transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className="font-display text-4xl font-bold text-theme/20 group-hover:text-theme transition-colors">
                    {value.number}
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-semibold text-text-header">
                      {value.title}
                    </h4>
                    <p className="text-sm text-text-muted">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
