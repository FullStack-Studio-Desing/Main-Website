"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CaretDown, List, X } from "@phosphor-icons/react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { brand, navLinks, services } from "@/data/site-copy";
import { LogoMark } from "@/components/LogoMark";

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 32));

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const solid = scrolled || open || servicesOpen;
  const homeLink = navLinks.find((l) => l.label === "Home");
  const secondaryLinks = navLinks.filter(
    (l) => l.label !== "Services" && l.label !== "Home",
  );

  function closeAll() {
    setOpen(false);
    setServicesOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 lg:pt-4">
      <div
        className={`mx-auto flex h-16 max-w-[1536px] items-center justify-between px-6 py-3 transition-colors duration-300 sm:px-10 lg:h-20 lg:rounded-capsule ${
          solid ? "bg-forest" : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white"
          onClick={closeAll}
        >
          <LogoMark className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" tone="neon" />
          <span className="text-xl font-bold tracking-tight sm:text-2xl">
            {brand.shortName}
            <span className="text-neon">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {homeLink && (
            <Link
              href={homeLink.href}
              className="rounded-action px-4 py-2 text-base font-medium text-white/85 transition-colors duration-200 hover:text-neon"
            >
              {homeLink.label}
            </Link>
          )}

          <div ref={servicesRef} className="relative">
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              onClick={() => setServicesOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-action px-4 py-2 text-base font-medium text-white/85 transition-colors duration-200 hover:text-neon"
            >
              Services
              <CaretDown
                size={14}
                weight="bold"
                className={`transition-transform duration-200 ${
                  servicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {servicesOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full z-50 mt-3 w-[280px] rounded-shell bg-forest p-2 shadow-form-lift ring-1 ring-white/10"
              >
                <Link
                  href="/services"
                  role="menuitem"
                  onClick={closeAll}
                  className="block rounded-panel px-4 py-2.5 text-sm font-medium text-sage transition-colors duration-200 hover:bg-white/10 hover:text-white"
                >
                  All services
                </Link>
                <div className="my-1 h-px bg-white/10" />
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    role="menuitem"
                    onClick={closeAll}
                    className="block rounded-panel px-4 py-2.5 text-base font-medium text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-neon"
                  >
                    {service.shortLabel}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-action px-4 py-2 text-base font-medium text-white/85 transition-colors duration-200 hover:text-neon"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-2 inline-flex h-12 items-center justify-center rounded-action bg-neon px-5 text-base font-medium text-ink transition-colors duration-200 hover:bg-neon-active lg:h-14"
          >
            Book a call
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
          onClick={() => {
            setOpen((v) => !v);
            setServicesOpen(false);
          }}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {open && (
        <nav className="mx-auto mt-2 max-w-[1536px] px-6 sm:px-10 lg:hidden">
          <div className="rounded-shell bg-forest p-4">
            <div className="flex flex-col gap-1">
              {homeLink && (
                <Link
                  href={homeLink.href}
                  className="rounded-panel px-4 py-3 text-base font-medium text-white/85 hover:bg-white/10 hover:text-white"
                  onClick={closeAll}
                >
                  {homeLink.label}
                </Link>
              )}

              <p className="px-4 pb-1 pt-2 text-xs font-medium uppercase tracking-[0.14em] text-neon">
                Services
              </p>
              <Link
                href="/services"
                className="rounded-panel px-4 py-3 text-base font-medium text-white/85 hover:bg-white/10 hover:text-white"
                onClick={closeAll}
              >
                All services
              </Link>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="rounded-panel px-4 py-3 text-base font-medium text-white/85 hover:bg-white/10 hover:text-white"
                  onClick={closeAll}
                >
                  {service.shortLabel}
                </Link>
              ))}

              <div className="my-2 h-px bg-white/10" />

              {secondaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-panel px-4 py-3 text-base font-medium text-white/85 hover:bg-white/10 hover:text-white"
                  onClick={closeAll}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-2 inline-flex h-12 items-center justify-center rounded-action bg-neon px-5 text-base font-medium text-ink"
                onClick={closeAll}
              >
                Book a call
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
