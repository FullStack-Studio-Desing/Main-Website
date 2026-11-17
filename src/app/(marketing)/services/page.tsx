import type { Metadata } from "next";
import { brand } from "@/data/site-copy";
import { ServicesIndex } from "@/components/sections/ServicesIndex";

export const metadata: Metadata = {
  title: `Services | ${brand.name}`,
  description:
    "Websites, marketing, sales growth, AI automation, and custom CRMs. Five capabilities, one team.",
};

export default function ServicesIndexPage() {
  return (
    <main>
      <ServicesIndex />
    </main>
  );
}
