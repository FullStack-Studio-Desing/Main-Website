import type { Metadata } from "next";
import { Lilita_One, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

/* Aeonik substitute per the brand guide */
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

/* Ozik substitute: heavy condensed display, used uppercase only */
const lilita = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "FullStack Studio Design",
  description:
    "Websites, native apps, marketing, sales growth, AI automation, AI employees, and custom CRMs. One team, one monthly plan, measurable results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(lilita.variable, "font-sans", geist.variable)}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
