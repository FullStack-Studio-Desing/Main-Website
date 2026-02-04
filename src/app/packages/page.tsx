import { PackagesSection } from "@/components/sections/PackagesSection";
import { PackageDetails } from "@/components/sections/PackageDetails";
import { PackageComparison } from "@/components/sections/PackageComparison";
import { PackageFAQ } from "@/components/sections/PackageFAQ";

export const metadata = {
  title: "Packages — FullStack Studio Design",
  description:
    "Starter, Growth, Enterprise packages. Choose a package that fits your stage and budget.",
};

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-bg-body">
      <PackagesSection />
      <PackageDetails />
      <PackageComparison />
      <PackageFAQ />
    </main>
  );
}
