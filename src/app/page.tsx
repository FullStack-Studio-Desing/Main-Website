import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollingTagline } from "@/components/ui/scrolling-banner";

// Below-fold sections: lazy loaded to reduce initial bundle
const AboutSection = dynamic(() => import("@/components/sections/AboutSection").then(m => m.AboutSection));
const ServicesSection = dynamic(() => import("@/components/sections/ServicesSection").then(m => m.ServicesSection));
const PackagesSection = dynamic(() => import("@/components/sections/PackagesSection").then(m => m.PackagesSection));
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection").then(m => m.TestimonialsSection));
const FAQSection = dynamic(() => import("@/components/sections/FAQSection").then(m => m.FAQSection));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection").then(m => m.ContactSection));
const Marquee = dynamic(() => import("@/components/ui/marquee").then(m => m.Marquee));

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-body">
      <HeroSection />
      <ScrollingTagline words={["Create", "Code", "Connect"]} speed="slow" />
      <AboutSection />
      <ServicesSection />
      <PackagesSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Marquee text="Have a project in mind? Let's work together." />
    </main>
  );
}
