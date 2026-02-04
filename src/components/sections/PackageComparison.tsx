"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const comparisonData = {
  categories: [
    {
      name: "Development",
      features: [
        { name: "Website Pages", starter: "5 pages", growth: "10 pages", enterprise: "Unlimited" },
        { name: "Custom Web App", starter: false, growth: true, enterprise: true },
        { name: "Custom Software", starter: false, growth: "Integration", enterprise: "Full Build" },
        { name: "Mobile Responsive", starter: true, growth: true, enterprise: true },
        { name: "CMS Integration", starter: "Basic", growth: "Advanced", enterprise: "Custom" },
        { name: "API Development", starter: false, growth: "Basic", enterprise: "Custom" },
      ],
    },
    {
      name: "Marketing",
      features: [
        { name: "SEO Optimization", starter: "Basic Setup", growth: "90-Day Campaign", enterprise: "Enterprise Strategy" },
        { name: "Google Ads", starter: false, growth: true, enterprise: true },
        { name: "Meta Ads", starter: false, growth: true, enterprise: true },
        { name: "LinkedIn Ads", starter: false, growth: false, enterprise: true },
        { name: "Content Marketing", starter: false, growth: true, enterprise: true },
        { name: "Email Marketing", starter: false, growth: "Setup", enterprise: "Full Management" },
      ],
    },
    {
      name: "AI & Automation",
      features: [
        { name: "AI Chatbot", starter: "FAQ Only", growth: "Lead Qualification", enterprise: "Custom AI" },
        { name: "Marketing Automation", starter: false, growth: "Basic", enterprise: "Advanced" },
        { name: "Custom AI Models", starter: false, growth: false, enterprise: true },
        { name: "Workflow Automation", starter: false, growth: true, enterprise: true },
      ],
    },
    {
      name: "Support & Analytics",
      features: [
        { name: "Support Period", starter: "30 Days", growth: "90 Days", enterprise: "6 Months" },
        { name: "Analytics Dashboard", starter: "Basic", growth: "Custom", enterprise: "Enterprise" },
        { name: "Dedicated Manager", starter: false, growth: false, enterprise: true },
        { name: "Priority Support", starter: false, growth: true, enterprise: "Same Day" },
        { name: "Strategy Sessions", starter: false, growth: "Monthly", enterprise: "Weekly" },
      ],
    },
  ],
  packages: [
    { name: "Starter", price: "$2,500", color: "#60A5FA" },
    { name: "Growth", price: "$7,500", color: "#BFF747", popular: true },
    { name: "Enterprise", price: "$20,000+", color: "#A855F7" },
  ],
};

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
  return (
    <section className="relative bg-[#050505] py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(191,247,71,0.03),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-theme text-sm font-medium uppercase tracking-widest">
            Compare Packages
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Find your perfect fit
          </h2>
          <p className="mt-4 text-lg text-white/50">
            See exactly what&apos;s included in each package at a glance.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <table className="w-full min-w-[700px]">
            {/* Header */}
            <thead>
              <tr>
                <th className="text-left p-4 pt-8 w-1/4" />
                {comparisonData.packages.map((pkg) => (
                  <th key={pkg.name} className="p-4 pt-8 text-center w-1/4">
                    <div className="relative">
                      {pkg.popular && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium px-3 py-1 rounded-full bg-theme/20 text-theme">
                          Most Popular
                        </span>
                      )}
                      <div className="font-display text-xl font-bold text-white">{pkg.name}</div>
                      <div className="mt-1 text-2xl font-bold" style={{ color: pkg.color }}>
                        {pkg.price}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {comparisonData.categories.map((category, catIndex) => (
                <>
                  {/* Category Header */}
                  <tr key={category.name}>
                    <td
                      colSpan={4}
                      className="pt-8 pb-4 px-4 text-sm font-semibold uppercase tracking-wider text-white/40"
                    >
                      {category.name}
                    </td>
                  </tr>

                  {/* Features */}
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
                      {comparisonData.packages.map((pkg) => {
                        const value = feature[pkg.name.toLowerCase() as "starter" | "growth" | "enterprise"];
                        return (
                          <td key={pkg.name} className="p-4 text-center">
                            <FeatureValue value={value} color={pkg.color} />
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>

            {/* Footer CTAs */}
            <tfoot>
              <tr className="border-t border-white/10">
                <td className="p-6" />
                {comparisonData.packages.map((pkg) => (
                  <td key={pkg.name} className="p-6 text-center">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all hover:shadow-lg w-full"
                      style={{ backgroundColor: pkg.color }}
                    >
                      Get {pkg.name}
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </motion.div>

        {/* Mobile Note */}
        <p className="mt-4 text-center text-sm text-white/40 lg:hidden">
          Scroll horizontally to see all packages →
        </p>
      </div>
    </section>
  );
}
