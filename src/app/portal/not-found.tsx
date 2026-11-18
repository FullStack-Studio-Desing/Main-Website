import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PortalNotFound() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        That report is not available
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        It may still be a draft, or it belongs to another company.
      </p>
      <Button asChild className="mt-6">
        <Link href="/portal">Back to your plan</Link>
      </Button>
    </div>
  );
}
