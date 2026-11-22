"use client";

import { useState } from "react";
import { Check, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Download the invoice as a PDF, or share this page's link (native share sheet, else copy). */
export function InvoiceShareActions({ pdfPath, number }: { pdfPath: string; number: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href.split("#")[0];
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `Invoice ${number}`, url });
        return;
      } catch (error) {
        // Closing the share sheet is not an error worth reporting; fall through to copy otherwise.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this invoice link:", url);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button type="button" variant="outline" size="sm" onClick={share} aria-live="polite">
        {copied ? <Check aria-hidden /> : <Share2 aria-hidden />}
        {copied ? "Link copied" : "Share"}
      </Button>
      <Button asChild variant="outline" size="sm">
        <a href={pdfPath} download>
          <Download aria-hidden />
          Download PDF
        </a>
      </Button>
    </div>
  );
}
