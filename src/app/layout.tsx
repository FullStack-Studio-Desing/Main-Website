import type { Metadata } from "next";
import { Big_Shoulders, Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PromoBanner } from "@/components/PromoBanner";
import { LocaleProvider } from "@/lib/locale-context";

/* Big Shoulders: display-style font (same family as Big Shoulders Display per Minifolio branding) */
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "FullStack Studio Design — Build. Scale. Dominate.",
  description:
    "Full-service digital agency: web development, software, AI solutions, and digital marketing. Serving US & Canada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${bricolage.variable} ${manrope.variable}`}>
      <body className="antialiased font-body overflow-x-hidden">
        <LocaleProvider>
          <Header />
          {children}
          <Footer />
          <PromoBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
