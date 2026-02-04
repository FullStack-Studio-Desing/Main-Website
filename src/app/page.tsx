import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Marquee } from "@/components/ui/marquee";
import { ScrollingTagline } from "@/components/ui/scrolling-banner";

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
