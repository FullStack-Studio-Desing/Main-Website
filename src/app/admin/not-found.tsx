import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That client, project, or report is not here.
      </p>
      <Button asChild className="mt-6">
        <Link href="/admin">Back to CRM</Link>
      </Button>
    </div>
  );
}
