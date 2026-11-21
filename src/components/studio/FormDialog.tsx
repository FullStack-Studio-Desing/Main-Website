"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Button that opens a form in a dialog. Parents remount it (via `key`) after a successful
 * save so it closes; `hash` opens it on load when the URL ends in `#<hash>`.
 */
export function FormDialog({
  trigger,
  title,
  description,
  hash,
  variant,
  size,
  children,
}: {
  trigger: string;
  title: string;
  description?: string;
  hash?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hash && window.location.hash === `#${hash}`) setOpen(true);
  }, [hash]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Plus />
          {trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="studio-app max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="[&>form]:mt-0">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
