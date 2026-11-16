import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand, getService, services } from "@/data/site-copy";
import { ServiceDetail } from "@/components/sections/ServiceDetail";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: brand.name };

  return {
    title: `${service.title} | ${brand.name}`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return <ServiceDetail service={service} />;
}
