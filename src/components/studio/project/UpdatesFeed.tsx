"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Newspaper, Pencil, Trash2 } from "lucide-react";
import { createUpdate, deleteUpdate, updateUpdate } from "@/lib/portal/project-actions";
import type { ActionState, ProjectUpdateRecord } from "@/lib/portal/types";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, EmptyState } from "@/components/studio/ui";
import { ConfirmDelete } from "@/components/studio/project/ConfirmDelete";
import { UpdateTimeline, UpdateTimelineItem } from "@/components/studio/project/UpdateTimeline";
import { updateKindOptions } from "@/components/studio/project/labels";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function UpdatesFeed({
  projectId,
  updates,
}: {
  projectId: string;
  updates: ProjectUpdateRecord[];
}) {
  return (
    <div className="space-y-8">
      <UpdateComposer projectId={projectId} />
      {updates.length === 0 ? (
        <EmptyState
          icon={<Newspaper />}
          title="No updates yet"
          description="Post notes, milestones, blockers and deliveries. Switch on “Visible to client” to show one in their portal."
        />
      ) : (
        <UpdateTimeline>
          {updates.map((update) => (
            <UpdateEntry key={update.id} update={update} />
          ))}
        </UpdateTimeline>
      )}
    </div>
  );
}

function UpdateFields({
  update,
  idPrefix,
}: {
  update?: ProjectUpdateRecord;
  idPrefix: string;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-body`} className="sr-only">
          Update
        </Label>
        <Textarea
          id={`${idPrefix}-body`}
          name="body"
          required
          rows={update ? 6 : 3}
          maxLength={8000}
          defaultValue={update?.body ?? ""}
          placeholder="What changed on this project?"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor={`${idPrefix}-kind`} className="text-muted-foreground">
              Type
            </Label>
            <NativeSelect
              id={`${idPrefix}-kind`}
              name="kind"
              defaultValue={update?.kind ?? "note"}
              className="h-9 w-[132px]"
            >
              {updateKindOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id={`${idPrefix}-visible`}
              name="visible_to_client"
              defaultChecked={update?.visible_to_client ?? false}
            />
            <Label htmlFor={`${idPrefix}-visible`}>Visible to client</Label>
          </div>
        </div>
      </div>
    </>
  );
}

function UpdateComposer({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState(createUpdate.bind(null, projectId), null);

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <form action={formAction} className="space-y-3">
          {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
          {state?.notice ? <Alert tone="notice">{state.notice}</Alert> : null}
          <UpdateFields idPrefix="update-new" />
          <div className="flex justify-end">
            <SubmitButton pendingLabel="Posting" className="w-full sm:w-auto">
              Post update
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function UpdateEntry({ update }: { update: ProjectUpdateRecord }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <UpdateTimelineItem
        update={update}
        showVisibility
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                aria-label="Update actions"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="studio-app">
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => setDeleting(true)}
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <UpdateDialog update={update} open={editing} onOpenChange={setEditing} />
      <ConfirmDelete
        open={deleting}
        onOpenChange={setDeleting}
        title="Delete this update?"
        description={
          update.visible_to_client
            ? "The client will no longer see it in their portal. This cannot be undone."
            : "This cannot be undone."
        }
        action={() => deleteUpdate(update.id)}
        successMessage="Update deleted"
      />
    </>
  );
}

function UpdateDialog({
  update,
  open,
  onOpenChange,
}: {
  update: ProjectUpdateRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await updateUpdate(update.id, prev, formData);
      if (result?.notice) {
        onOpenChange(false);
        toast.success(result.notice);
      }
      return result;
    },
    null,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="studio-app max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit update</DialogTitle>
          <DialogDescription>Changes show in the client portal if it is visible.</DialogDescription>
        </DialogHeader>
        <form key={update.updated_at} action={formAction} className="space-y-4">
          {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
          <UpdateFields update={update} idPrefix={`update-${update.id}`} />
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <SubmitButton pendingLabel="Saving">Save update</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
