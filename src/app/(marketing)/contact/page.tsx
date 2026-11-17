import type { Metadata } from "next";
import { brand, contact } from "@/data/site-copy";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: `Contact | ${brand.name}`,
  description: contact.body,
};

export default function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
