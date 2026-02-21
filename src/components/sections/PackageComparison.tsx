"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useT } from "@/lib/i18n";

const packageColors = ["#60A5FA", "#BFF747", "#A855F7"];

function FeatureValue({ value, color }: { value: boolean | string; color: string }) {
  if (value === true) {
    return (
      <svg className="h-5 w-5 mx-auto" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (value === false) {
    return (
      <svg className="h-5 w-5 mx-auto text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return <span className="text-sm text-white/70">{value}</span>;
}

export function PackageComparison() {
  const pc = useT("packageComparison");

  return (
    <section className="relative bg-[#050505] py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(191,247,71,0.03),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-theme text-sm font-medium uppercase tracking-widest">
            {pc.label}
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            {pc.headline}
          </h2>
          <p className="mt-4 text-lg text-white/50">
            {pc.body}
          </p>
        </motion.div>

        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left p-4 pt-8 w-1/4" />
                {pc.packages.map((pkg, i) => {
                  const isPopular = i === 1;
                  return (
                    <th key={pkg.name} className="p-4 pt-8 text-center w-1/4">
                      <div className="relative">
                        {isPopular && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full bg-theme/20 text-theme">
                            {pc.mostPopular}
                          </span>
                        )}
                        <div className="font-display text-xl font-bold text-white">{pkg.name}</div>
                        <div className="mt-1 text-2xl font-bold" style={{ color: packageColors[i] }}>
                          {pkg.price}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {pc.categories.map((category, catIndex) => (
                <>
                  <tr key={category.name}>
                    <td
                      colSpan={4}
                      className="pt-8 pb-4 px-4 text-sm font-semibold uppercase tracking-wider text-white/40"
                    >
                      {category.name}
                    </td>
                  </tr>

                  {category.features.map((feature, featureIndex) => (
                    <motion.tr
                      key={feature.name}
                      className="border-t border-white/5 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (catIndex * category.features.length + featureIndex) * 0.02 }}
                    >
                      <td className="p-4 text-sm text-white/70">{feature.name}</td>
                      {pc.packages.map((pkg, i) => {
                        const value = feature[pkg.name.toLowerCase() as "starter" | "growth" | "enterprise"];
                        return (
                          <td key={pkg.name} className="p-4 text-center">
                            <FeatureValue value={value} color={packageColors[i]} />
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t border-white/10">
                <td className="p-6" />
                {pc.packages.map((pkg, i) => (
                  <td key={pkg.name} className="p-6 text-center">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all hover:shadow-lg w-full"
                      style={{ backgroundColor: packageColors[i] }}
                    >
                      {pc.getPackage} {pkg.name}
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </motion.div>

        <p className="mt-4 text-center text-sm text-white/40 lg:hidden">
          {pc.mobileNote}
        </p>
      </div>
    </section>
  );
}
