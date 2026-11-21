import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <EmptyState
      className="mt-8 py-16"
      icon={<SearchX />}
      title="Not found"
      description="That client, project, or report is not here."
      action={
        <Button asChild>
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      }
    />
  );
}
