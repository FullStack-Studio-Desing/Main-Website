import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { LogoMark } from "@/components/LogoMark";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { brand } from "@/data/site-copy";

export const metadata: Metadata = {
  title: `Test checkout · ${brand.shortName}`,
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main className="studio-app flex min-h-dvh flex-col bg-background px-6 py-8 text-foreground">
      <Link href="/" className="flex items-center gap-2.5 text-foreground">
        <LogoMark className="h-7 w-7" tone="ink" />
        <span className="text-lg font-semibold tracking-tight">{brand.shortName}</span>
      </Link>
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-12">
        <Card>
          <CardHeader>
            <CardDescription>Mercado Pago · test only</CardDescription>
            <CardTitle className="text-2xl">Card payment</CardTitle>
            <CardDescription>
              Email + card only (no RFC). Uses your test Public Key / Access Token and a
              Mercado Pago test card.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CheckoutForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
