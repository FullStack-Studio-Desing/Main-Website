"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { brand } from "@/data/site-copy";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/translations";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spotlight } from "@/components/ui/spotlight";
import { Boxes } from "@/components/ui/background-boxes";
import { ShootingStars, StarsBackground } from "@/components/ui/shooting-stars";

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-theme to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-theme-accent to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ct = useT("contactSection");
  const { locale } = useLocale();
  const brandT = t("brand", locale);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen overflow-hidden bg-bg-body"
    >
      {/* Background Boxes */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Boxes />
        {/* Mask overlay to fade out boxes */}
        <div className="absolute inset-0 w-full h-full bg-bg-body z-[1] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] pointer-events-none" />
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0 z-[1]">
        <StarsBackground starDensity={0.00008} />
        <ShootingStars minDelay={3000} maxDelay={6000} />
      </div>

      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-[2]">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(191,247,71,0.12),rgba(6,6,6,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(40,233,140,0.06),rgba(6,6,6,0))]" />

        {/* Floating orbs */}
        <motion.div
          className="hidden sm:block absolute top-1/4 left-1/4 w-96 h-96 bg-theme/5 rounded-full blur-[100px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="hidden sm:block absolute bottom-1/4 right-1/4 w-80 h-80 bg-theme-accent/5 rounded-full blur-[100px]"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 z-[3]"
        fill="rgba(191, 247, 71, 0.15)"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-theme/20 bg-theme/5 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-theme"></span>
            </span>
            <span className="text-sm font-medium text-theme uppercase tracking-wider">
              {ct.availableBadge}
            </span>
          </motion.div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-text-header mb-6">
            {ct.headline.split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2 sm:mr-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-lg sm:text-xl text-text-body max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {ct.subheadline}
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left Column - Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              <ContactCard
                icon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                label={ct.email}
                value={brand.email}
                href={`mailto:${brand.email}`}
                delay={0.4}
              />
              <ContactCard
                icon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                label={ct.serviceArea}
                value={brandT.location}
                delay={0.6}
              />
              <ContactCard
                icon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                label={ct.businessHours}
                value={brandT.hours}
                delay={0.7}
              />
            </div>

            {/* Trust Badges */}
            <motion.div
              className="pt-8 border-t border-brand-default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <p className="text-xs uppercase tracking-wider text-text-muted mb-4">
                {ct.trustedBy}
              </p>
              <div className="flex flex-wrap gap-4">
                {ct.badges.map(
                  (badge, i) => (
                    <motion.div
                      key={badge}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-section border border-brand-default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                    >
                      <svg
                        className="h-3.5 w-3.5 text-theme"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium text-text-body">
                        {badge}
                      </span>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Form Container with premium border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-theme/50 via-theme-accent/50 to-theme/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />

              <div className="relative rounded-2xl border border-brand-default bg-bg-body/80 backdrop-blur-xl p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-text-header">
                    {ct.formTitle}
                  </h2>
                  <p className="mt-2 text-text-muted">
                    {ct.formSubtitle}
                  </p>
                </div>

                {submitted ? (
                  <motion.div
                    className="rounded-xl border border-theme/30 bg-theme/5 p-8 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-theme"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.2,
                      }}
                    >
                      <svg
                        className="h-8 w-8 text-bg-body"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="text-xl font-semibold text-text-header mb-2">
                      {ct.successTitle}
                    </h3>
                    <p className="text-text-body">
                      {ct.successBody}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <LabelInputContainer>
                        <Label htmlFor="name">{ct.fieldName}</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder={ct.placeholderName}
                          required
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="email">
                          {ct.fieldEmail}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder={ct.placeholderEmail}
                          required
                        />
                      </LabelInputContainer>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <LabelInputContainer>
                        <Label htmlFor="company">
                          {ct.fieldCompany}
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          placeholder={ct.placeholderCompany}
                        />
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="phone">
                          {ct.fieldPhone}
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder={ct.placeholderPhone}
                        />
                      </LabelInputContainer>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <LabelInputContainer>
                        <Label htmlFor="service">
                          {ct.fieldService}
                        </Label>
                        <Select id="service" name="service" required>
                          <option value="">{ct.selectService}</option>
                          {ct.serviceOptions.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </Select>
                      </LabelInputContainer>
                      <LabelInputContainer>
                        <Label htmlFor="budget">
                          {ct.fieldBudget}
                        </Label>
                        <Select id="budget" name="budget">
                          <option value="">{ct.selectBudget}</option>
                          {ct.budgetOptions.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </Select>
                      </LabelInputContainer>
                    </div>

                    <LabelInputContainer>
                      <Label htmlFor="message">
                        {ct.fieldMessage}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={ct.placeholderMessage}
                        rows={5}
                        required
                      />
                    </LabelInputContainer>

                    {error && (
                      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group/btn relative block h-14 w-full rounded-lg bg-gradient-to-br from-theme to-theme-accent font-ui text-base font-semibold text-bg-body transition-all duration-300 hover:shadow-[0_0_40px_rgba(191,247,71,0.4)] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {ct.sending}
                          </>
                        ) : (
                          <>
                            {ct.sendMessage}
                            <svg
                              className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </>
                        )}
                      </span>
                      <BottomGradient />
                    </button>

                    <p className="text-center text-xs text-text-muted pt-2">
                      {ct.privacyConsent}{" "}
                      <a
                        href="/privacy"
                        className="text-theme hover:underline"
                      >
                        {ct.privacyLink}
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay?: number;
}) {
  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-theme/10 text-theme transition-colors group-hover:bg-theme group-hover:text-bg-body">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider text-text-muted mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-text-header truncate group-hover:text-theme transition-colors">
          {value}
        </p>
      </div>
      {href && (
        <svg
          className="h-5 w-5 text-text-muted transition-all duration-300 group-hover:text-theme group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </>
  );

  const cardClasses =
    "group flex items-center gap-4 p-4 rounded-xl border border-brand-default bg-bg-section/50 backdrop-blur-sm transition-all duration-300 hover:border-theme/30 hover:bg-bg-section";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {href ? (
        <a href={href} className={cardClasses}>
          {content}
        </a>
      ) : (
        <div className={cardClasses}>{content}</div>
      )}
    </motion.div>
  );
}
