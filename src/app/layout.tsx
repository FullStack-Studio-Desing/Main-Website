import type { Metadata } from "next";
import { Inter, Lilita_One } from "next/font/google";
import "./globals.css";

/* Aeonik substitute per the brand guide */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

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
    "Websites, marketing, sales growth, AI automation, and custom CRMs. One team, one monthly plan, measurable results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lilita.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
