"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useT } from "@/lib/i18n";

const packageColors = ["#60A5FA", "#BFF747", "#A855F7"];
const packageGradients = [
  "from-blue-500/10 via-transparent to-transparent",
  "from-theme/10 via-transparent to-transparent",
  "from-purple-500/10 via-transparent to-transparent",
];

export function PackageDetails() {
  const pd = useT("packageDetails");

  return (
    <div className="relative">
      {pd.items.map((pkg, index) => {
        const color = packageColors[index];
        const bgGradient = packageGradients[index];
        const isPopular = "popular" in pkg && pkg.popular;

        return (
          <section
            key={pkg.name}
            id={pkg.name.toLowerCase()}
            className={`relative min-h-screen py-24 lg:py-32 overflow-hidden ${
              index % 2 === 0 ? "bg-bg-body" : "bg-[#080808]"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`} />
            <div
              className="hidden sm:block absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/4"
              style={{ backgroundColor: color }}
            />
            <div
              className="hidden sm:block absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/4"
              style={{ backgroundColor: color }}
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span
                  className="text-6xl sm:text-8xl lg:text-9xl font-display font-bold opacity-10"
                  style={{ color }}
                >
                  0{index + 1}
                </span>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {isPopular && (
                    <span className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-theme/10 border border-theme/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-theme" />
                      </span>
                      <span className="text-sm font-medium text-theme">{pd.mostPopular}</span>
                    </span>
                  )}

                  <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4">
                    {pkg.name}
                  </h2>
                  <p className="text-lg sm:text-xl lg:text-2xl font-medium mb-6" style={{ color }}>
                    {pkg.tagline}
                  </p>
                  <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                    {pkg.description}
                  </p>
                </motion.div>

                <motion.div
                  className="flex flex-col justify-center"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="mb-8">
                    <span className="text-sm uppercase tracking-widest text-white/40 mb-2 block">
                      {pd.startingAt}
                    </span>
                    <span className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold" style={{ color }}>
                      {pkg.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {pkg.stats.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        className="text-center p-4 rounded-2xl bg-white/5 border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                      >
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1" style={{ color }}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-sm uppercase tracking-widest text-white/40 mb-8">
                  {pd.whatsIncluded}
                </h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.features.map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <div
                        className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: color }}
                      />
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: color + "15" }}
                      >
                        <svg
                          className="h-5 w-5"
                          style={{ color }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-white text-lg mb-2 group-hover:text-white transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-black text-lg transition-all hover:shadow-xl hover:scale-105"
                  style={{ backgroundColor: color }}
                >
                  {pd.getPackage} {pkg.name}
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <span className="text-sm text-white/40">
                  {pd.freeConsultation}
                </span>
              </motion.div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
