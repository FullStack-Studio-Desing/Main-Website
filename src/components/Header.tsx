"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { brand } from "@/data/site-copy";
import { cn } from "@/lib/utils";

const serviceLinks = [
  {
    href: "/services/web-development",
    label: "Web Development",
    desc: "Blazing-fast, conversion-optimized websites",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/services/software-development",
    label: "Custom Software",
    desc: "Scalable apps and platforms built to last",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    href: "/services/ai-solutions",
    label: "AI & Automation",
    desc: "Intelligent solutions that work 24/7",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    href: "/services/digital-marketing",
    label: "Digital Marketing",
    desc: "Data-driven campaigns that convert",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    href: "/services/paid-advertising",
    label: "Paid Advertising",
    desc: "Maximum ROI on every ad dollar",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/services/seo",
    label: "SEO",
    desc: "Dominate search rankings organically",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeAll = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 transition-all duration-500",
          scrolled ? "sm:px-4" : "sm:px-6"
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl border transition-all duration-500",
            scrolled
              ? "border-white/10 bg-bg-body/90 shadow-2xl shadow-black/20 backdrop-blur-xl"
              : "border-white/5 bg-white/5 backdrop-blur-md"
          )}
        >
          {/* Animated gradient border on hover/scroll */}
          <div
            className={cn(
              "absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-theme/0 via-theme/50 to-theme/0 opacity-0 blur-sm transition-opacity duration-500",
              scrolled && "opacity-30"
            )}
          />

          <div className="relative flex h-16 items-center justify-between px-6">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center"
              onClick={closeAll}
            >
              <Image
                src="/images/logo.png"
                alt={brand.name}
                width={180}
                height={40}
                className="h-8 w-auto sm:h-10"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-1">
              {navLinks.slice(0, 1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-text-body transition-colors hover:text-text-header"
                  onClick={closeAll}
                >
                  {link.label}
                </Link>
              ))}

              {/* Services Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors",
                    servicesOpen ? "text-theme" : "text-text-body hover:text-text-header"
                  )}
                  onClick={() => setServicesOpen(!servicesOpen)}
                  onMouseEnter={() => setServicesOpen(true)}
                  aria-expanded={servicesOpen}
                >
                  Services
                  <motion.svg
                    animate={{ rotate: servicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-text-body transition-colors hover:text-text-header"
                  onClick={closeAll}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Status Indicator - Hidden on mobile */}
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 lg:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-theme opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-theme" />
                </span>
                <span className="text-xs font-medium text-text-muted">Available</span>
              </div>

              {/* CTA Button */}
              <Link
                href="/contact"
                className="group relative hidden overflow-hidden rounded-xl bg-theme px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-theme/30 sm:block"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Let&apos;s Talk
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-body transition-all hover:border-theme/30 hover:text-theme lg:hidden"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={open ? "open" : "closed"}
                  className="flex flex-col items-center justify-center gap-1.5"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 },
                    }}
                    className="h-0.5 w-5 rounded-full bg-current"
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    className="h-0.5 w-5 rounded-full bg-current"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    className="h-0.5 w-5 rounded-full bg-current"
                  />
                </motion.div>
              </button>
            </div>
          </div>

          {/* Desktop Mega Menu */}
          <AnimatePresence>
            {servicesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full mt-2 hidden lg:block"
                onMouseLeave={() => setServicesOpen(false)}
              >
                <div className="rounded-2xl border border-brand-default bg-bg-section/90 p-6 backdrop-blur-sm">
                  {/* Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-text-header">Our Services</h3>
                      <p className="text-sm text-text-muted">Full-stack digital solutions</p>
                    </div>
                    <Link
                      href="/services"
                      className="group flex items-center gap-2 rounded-full border border-theme/30 bg-theme/10 px-4 py-2 text-sm font-semibold text-theme transition-all hover:bg-theme hover:text-black"
                      onClick={closeAll}
                    >
                      View All
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {serviceLinks.map((service, index) => (
                      <motion.div
                        key={service.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <Link
                          href={service.href}
                          className="group flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-white/5"
                          onClick={closeAll}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-text-muted transition-all group-hover:bg-theme/20 group-hover:text-theme">
                            {service.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-text-header transition-colors group-hover:text-theme">
                              {service.label}
                            </h4>
                            <p className="mt-0.5 truncate text-xs text-text-muted">
                              {service.desc}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom Banner */}
                  <div className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-theme/10 via-theme/5 to-theme-accent/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-theme/20 text-theme">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-header">Not sure what you need?</p>
                        <p className="text-xs text-text-muted">Free strategy call • No commitment</p>
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="group flex items-center gap-2 rounded-full bg-theme px-4 py-2 text-sm font-semibold text-black transition-all hover:shadow-lg hover:shadow-theme/30"
                      onClick={closeAll}
                    >
                      Book a Call
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden lg:hidden"
              >
                <div className="border-t border-white/10 px-4 py-6">
                  <nav className="space-y-1">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-text-body transition-colors hover:bg-white/5 hover:text-text-header"
                          onClick={closeAll}
                        >
                          {link.label}
                          <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>
                    ))}

                    {/* Services Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="pt-4"
                    >
                      <div className="mb-3 flex items-center justify-between px-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Services</span>
                        <Link
                          href="/services"
                          className="text-xs font-medium text-theme hover:underline"
                          onClick={closeAll}
                        >
                          View All →
                        </Link>
                      </div>
                      <div className="space-y-1">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-text-body"
                            onClick={closeAll}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-text-muted">
                              {service.icon}
                            </div>
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  </nav>

                  {/* Mobile CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                  >
                    <Link
                      href="/contact"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-theme py-4 text-base font-semibold text-black transition-all hover:shadow-lg hover:shadow-theme/30"
                      onClick={closeAll}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/30" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-black/50" />
                      </span>
                      Start Your Project
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
