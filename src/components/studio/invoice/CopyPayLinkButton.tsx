"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

/** Copies the public /pay/<token> link. `path` is relative; the origin comes from the browser. */
export function CopyPayLinkButton({
  path,
  label = "Copy pay link",
  variant = "outline",
  size = "sm",
  className,
}: {
  path: string;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Pay link copied", { description: url });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link", { description: url });
    }
  }

  return (
    <Button type="button" variant={variant} size={size} className={className} onClick={copy}>
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
      {label ? label : <span className="sr-only">Copy pay link</span>}
    </Button>
  );
}
