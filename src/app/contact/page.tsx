import { ContactSection } from "@/components/sections/ContactSection";

export const metadata = {
  title: "Contact — FullStack Studio Design",
  description: "Get in touch for a free consultation. Serving US & Canada.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-body">
      <ContactSection />
    </main>
  );
}
