"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = sessionStorage.getItem("promoBannerDismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show banner after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("promoBannerDismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-theme/30 bg-gradient-to-r from-bg-section via-bg-body to-bg-section shadow-2xl shadow-theme/10 backdrop-blur-sm">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-theme/5 via-theme/10 to-theme/5 animate-pulse" />

              {/* Decorative elements */}
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-theme/20 blur-2xl" />
              <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-theme-accent/20 blur-2xl" />

              <div className="relative flex flex-col items-center gap-4 px-6 py-5 sm:flex-row sm:justify-between sm:gap-6">
                {/* Content */}
                <div className="flex items-center gap-4 text-center sm:text-left">
                  {/* Badge */}
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-theme/20 text-theme">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>

                  <div>
                    <p className="font-display text-base font-bold text-text-header sm:text-xl">
                      <span className="text-theme">20% OFF</span> Your First Project!
                    </p>
                    <p className="mt-1 text-xs text-text-muted sm:text-sm">
                      Limited time offer. Code{" "}
                      <span className="font-semibold text-theme">WELCOME20</span>
                    </p>
                  </div>
                </div>

                {/* CTA and Close */}
                <div className="flex items-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-theme px-5 py-2.5 text-sm font-semibold text-bg-body transition-all duration-300 hover:bg-theme-accent hover:shadow-lg hover:shadow-theme/25"
                  >
                    Claim Offer
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>

                  <button
                    onClick={handleDismiss}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-theme/10 hover:text-text-header"
                    aria-label="Dismiss banner"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
