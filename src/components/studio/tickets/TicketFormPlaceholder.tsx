"use client";

import { createTicket } from "@/lib/portal/ticket-actions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Alert, Field } from "@/components/studio/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { ProjectRecord } from "@/lib/portal/types";

const categories = [
  "bug",
  "change_request",
  "question",
  "content_update",
  "billing",
  "account",
  "other",
] as const;

export function TicketFormPlaceholder({ projects }: { projects: ProjectRecord[] }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createTicket, null);

  useEffect(() => {
    if (!state?.notice) return;
    toast.success(state.notice);
    const match = state.notice.match(/TCK-\d+/);
    if (match) router.push(`/portal/tickets/${match[0]}`);
  }, [state, router]);

  return (
    <form action={action} className="space-y-6">
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state?.notice ? <Alert tone="notice">{state.notice}</Alert> : null}
      <Card>
        <CardContent className="space-y-4 p-6 pt-6">
          <Field label="Project" hint="General is fine when the ticket is not about one project.">
            <select
              name="project_id"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="">General (not about a project)</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select
              name="category"
              defaultValue="question"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title">
            <Input name="title" required maxLength={140} placeholder="Short summary" />
          </Field>
          <Field label="Description" hint="Include steps, links, or what you expected.">
            <Textarea name="description" required rows={6} className="min-h-[8rem]" />
          </Field>
          <Field label="Priority">
            <select
              name="priority"
              defaultValue="normal"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </Field>
          <p className="text-sm text-muted-foreground">
            File attachments will appear here after R2 upload wiring is in place.
          </p>
          <Button type="submit" disabled={pending}>
            {pending ? "Opening…" : "Open ticket"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}