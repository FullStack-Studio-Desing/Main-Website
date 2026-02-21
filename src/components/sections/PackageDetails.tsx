"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const packageDetails = [
  {
    id: "starter",
    name: "Starter",
    price: "$2,500",
    tagline: "Launch Your Digital Presence",
    description:
      "Perfect for startups and small businesses ready to establish a professional online presence. Get everything you need to start attracting customers online.",
    color: "#60A5FA",
    bgGradient: "from-blue-500/10 via-transparent to-transparent",
    features: [
      {
        title: "5-Page Responsive Website",
        description: "Home, About, Services, Contact, and one custom page designed to convert visitors into leads.",
      },
      {
        title: "Basic SEO Setup",
        description: "On-page optimization, meta tags, sitemap, and Google Search Console integration.",
      },
      {
        title: "Social Media Starter Kit",
        description: "Profile setup and branding for 2 platforms with 10 post templates.",
      },
      {
        title: "AI Chatbot",
        description: "24/7 FAQ automation to handle common questions while you sleep.",
      },
    ],
    stats: [
      { label: "Pages", value: "5" },
      { label: "Support", value: "30 Days" },
      { label: "Delivery", value: "2-3 Weeks" },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$7,500",
    tagline: "Scale Your Business",
    description:
      "For established businesses ready to accelerate growth. A comprehensive solution combining development, marketing, and AI to drive measurable results.",
    color: "#BFF747",
    bgGradient: "from-theme/10 via-transparent to-transparent",
    popular: true,
    features: [
      {
        title: "10-Page Website or Web App",
        description: "Full-featured website with blog, integrations, or a custom web application.",
      },
      {
        title: "Full SEO Campaign (90 Days)",
        description: "Keyword research, content optimization, link building, and monthly reports.",
      },
      {
        title: "Google & Meta Ads",
        description: "Campaign setup, optimization, and management for maximum ROI.",
      },
      {
        title: "AI Lead Qualification",
        description: "Smart chatbot that qualifies leads and books meetings automatically.",
      },
      {
        title: "Content Marketing",
        description: "Blog posts, social media content, and email newsletter setup.",
      },
      {
        title: "Analytics Dashboard",
        description: "Real-time metrics tracking with custom KPI dashboard.",
      },
    ],
    stats: [
      { label: "Conversion", value: "+127%" },
      { label: "Traffic", value: "3.2x" },
      { label: "ROAS", value: "4.8x" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$20,000+",
    tagline: "Dominate Your Market",
    description:
      "Full-scale digital transformation for market leaders. Custom platforms, advanced AI, and comprehensive marketing to establish industry dominance.",
    color: "#A855F7",
    bgGradient: "from-purple-500/10 via-transparent to-transparent",
    features: [
      {
        title: "Custom Software Platform",
        description: "Bespoke application built from scratch for your unique business needs.",
      },
      {
        title: "Advanced AI Suite",
        description: "Custom AI models, automation workflows, and intelligent integrations.",
      },
      {
        title: "Enterprise SEO Strategy",
        description: "Comprehensive SEO including technical audits, content strategy, and authority building.",
      },
      {
        title: "Multi-Channel Advertising",
        description: "Google, Meta, LinkedIn, TikTok - wherever your audience is.",
      },
      {
        title: "Marketing Automation",
        description: "End-to-end automation from lead capture to customer nurturing.",
      },
      {
        title: "Dedicated Success Manager",
        description: "Your personal point of contact for strategy, support, and growth.",
      },
    ],
    stats: [
      { label: "Support", value: "6 Months" },
      { label: "Channels", value: "4+" },
      { label: "Custom", value: "100%" },
    ],
  },
];

export function PackageDetails() {
  return (
    <div className="relative">
      {packageDetails.map((pkg, index) => (
        <section
          key={pkg.id}
          id={pkg.id}
          className={`relative min-h-screen py-24 lg:py-32 overflow-hidden ${
            index % 2 === 0 ? "bg-bg-body" : "bg-[#080808]"
          }`}
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${pkg.bgGradient}`}
          />

          {/* Decorative elements - contained to prevent mobile overflow */}
          <div
            className="hidden sm:block absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/4"
            style={{ backgroundColor: pkg.color }}
          />
          <div
            className="hidden sm:block absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/4"
            style={{ backgroundColor: pkg.color }}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Package Number */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span
                className="text-6xl sm:text-8xl lg:text-9xl font-display font-bold opacity-10"
                style={{ color: pkg.color }}
              >
                0{index + 1}
              </span>
            </motion.div>

            {/* Header */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {pkg.popular && (
                  <span className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-theme/10 border border-theme/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-theme" />
                    </span>
                    <span className="text-sm font-medium text-theme">Most Popular</span>
                  </span>
                )}

                <h2 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4">
                  {pkg.name}
                </h2>

                <p
                  className="text-lg sm:text-xl lg:text-2xl font-medium mb-6"
                  style={{ color: pkg.color }}
                >
                  {pkg.tagline}
                </p>

                <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                  {pkg.description}
                </p>
              </motion.div>

              {/* Price & Stats */}
              <motion.div
                className="flex flex-col justify-center"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mb-8">
                  <span className="text-sm uppercase tracking-widest text-white/40 mb-2 block">
                    Starting at
                  </span>
                  <span
                    className="font-display text-4xl sm:text-6xl lg:text-8xl font-bold"
                    style={{ color: pkg.color }}
                  >
                    {pkg.price}
                  </span>
                </div>

                {/* Stats */}
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
                      <div
                        className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1"
                        style={{ color: pkg.color }}
                      >
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

            {/* Features */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-white/40 mb-8">
                What&apos;s Included
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
                    {/* Accent line */}
                    <div
                      className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: pkg.color }}
                    />

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: pkg.color + "15" }}
                    >
                      <svg
                        className="h-5 w-5"
                        style={{ color: pkg.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
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

            {/* CTA */}
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
                style={{ backgroundColor: pkg.color }}
              >
                Get {pkg.name}
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              <span className="text-sm text-white/40">
                Free consultation • No commitment required
              </span>
            </motion.div>

          </div>
        </section>
      ))}
    </div>
  );
}
