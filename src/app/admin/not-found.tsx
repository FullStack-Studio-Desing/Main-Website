import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="py-16">
      <h1 className="font-display text-[36px] uppercase leading-none tracking-[-0.02em] text-foreground">
        Not found
      </h1>
      <p className="mt-4 text-base text-muted-foreground">That client, project, or report is not here.</p>
      <Button asChild variant="brand" className="mt-8">
        <Link href="/admin">Back to CRM</Link>
      </Button>
    </div>
  );
}
