"use client";

import { useActionState, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { CalendarDays, ListTodo, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/portal/format";
import {
  createTask,
  deleteTask,
  setTaskStatus,
  updateTask,
} from "@/lib/portal/project-actions";
import type { ActionState, ProjectTaskRecord, TaskStatus } from "@/lib/portal/types";
import { SubmitButton } from "@/components/studio/SubmitButton";
import { Alert, EmptyState, Field } from "@/components/studio/ui";
import { ConfirmDelete } from "@/components/studio/project/ConfirmDelete";
import { ProjectProgress } from "@/components/studio/project/ProjectProgress";
import {
  isOverdue,
  priorityLabel,
  priorityVariant,
  taskPriorityOptions,
  taskStatusLabel,
  taskStatusOptions,
} from "@/components/studio/project/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function TaskBoard({
  projectId,
  tasks,
}: {
  projectId: string;
  tasks: ProjectTaskRecord[];
}) {
  const open = tasks.filter((task) => task.status !== "done");
  const done = tasks.filter((task) => task.status === "done");

  return (
    <div className="space-y-6">
      <ProjectProgress tasks={tasks} />
      <TaskQuickAdd projectId={projectId} />

      {tasks.length === 0 ? (
        <EmptyState
          icon={<ListTodo />}
          title="No tasks yet"
          description="Add the first one above. Press Enter to save it."
        />
      ) : (
        <>
          <TaskGroup title="Open" tasks={open} empty="Everything is done." />
          {done.length > 0 ? <TaskGroup title="Done" tasks={done} /> : null}
        </>
      )}
    </div>
  );
}

function TaskGroup({
  title,
  tasks,
  empty,
}: {
  title: string;
  tasks: ProjectTaskRecord[];
  empty?: string;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        {title} <span className="tabular-nums">· {tasks.length}</span>
      </h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <Card>
          <ul className="divide-y">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

function TaskQuickAdd({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState(createTask.bind(null, projectId), null);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error ? <Alert tone="error">{state.error}</Alert> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Label htmlFor="task-quick-title" className="sr-only">
          New task
        </Label>
        <Input
          id="task-quick-title"
          name="title"
          required
          maxLength={200}
          placeholder="Add a task and press Enter"
          className="sm:flex-1"
        />
        <div className="flex gap-2">
          <Label htmlFor="task-quick-priority" className="sr-only">
            Priority
          </Label>
          <NativeSelect
            id="task-quick-priority"
            name="priority"
            defaultValue="normal"
            className="w-full sm:w-[112px]"
          >
            {taskPriorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
          <Label htmlFor="task-quick-due" className="sr-only">
            Due date
          </Label>
          <Input id="task-quick-due" name="due_on" type="date" className="w-full sm:w-[150px]" />
        </div>
        <SubmitButton pendingLabel="Adding" className="w-full sm:w-auto">
          Add task
        </SubmitButton>
      </div>
    </form>
  );
}

function TaskRow({ task }: { task: ProjectTaskRecord }) {
  const [status, setOptimisticStatus] = useOptimistic(task.status);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDone = status === "done";
  const overdue = isOverdue({ status, due_on: task.due_on });

  function changeStatus(next: TaskStatus) {
    startTransition(async () => {
      setOptimisticStatus(next);
      const result = await setTaskStatus(task.id, next);
      if (result?.error) toast.error(result.error);
      else if (next === "done") toast.success("Task done");
    });
  }

  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <Checkbox
        checked={isDone}
        onCheckedChange={(checked) => changeStatus(checked === true ? "done" : "todo")}
        disabled={pending}
        aria-label={isDone ? `Mark “${task.title}” as not done` : `Mark “${task.title}” as done`}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1 space-y-1.5">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={cn(
            "block text-left text-sm font-medium text-foreground hover:underline",
            isDone && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </button>
        {task.details ? (
          <p className="line-clamp-2 whitespace-pre-line text-sm text-muted-foreground">
            {task.details}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          {task.priority !== "normal" ? (
            <Badge variant={priorityVariant[task.priority]}>{priorityLabel[task.priority]}</Badge>
          ) : null}
          {status === "blocked" ? <Badge variant="destructive">Blocked</Badge> : null}
          {task.due_on ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs text-muted-foreground",
                overdue && "font-medium text-destructive",
              )}
            >
              <CalendarDays className="size-3.5" aria-hidden />
              {overdue ? "Overdue · " : "Due "}
              {formatDate(task.due_on)}
            </span>
          ) : null}
          {isDone && task.completed_at ? (
            <span className="text-xs text-muted-foreground">
              Done {formatDate(task.completed_at)}
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Label htmlFor={`task-status-${task.id}`} className="sr-only">
          Status
        </Label>
        <NativeSelect
          id={`task-status-${task.id}`}
          value={status}
          disabled={pending}
          onChange={(event) => changeStatus(event.currentTarget.value as TaskStatus)}
          className="hidden h-9 w-[132px] sm:flex"
        >
          {taskStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-9" aria-label="Task actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="studio-app">
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            {/* Status lives here on phones, where the inline select is hidden. */}
            {taskStatusOptions
              .filter((option) => option.value !== status)
              .map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className="sm:hidden"
                  onSelect={() => changeStatus(option.value)}
                >
                  Mark {option.label.toLowerCase()}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => setDeleting(true)}
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TaskDialog task={task} open={editing} onOpenChange={setEditing} />
      <ConfirmDelete
        open={deleting}
        onOpenChange={setDeleting}
        title="Delete this task?"
        description={`“${task.title}” will be removed from the project. This cannot be undone.`}
        action={() => deleteTask(task.id)}
        successMessage="Task deleted"
      />
    </li>
  );
}

function TaskDialog({
  task,
  open,
  onOpenChange,
}: {
  task: ProjectTaskRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Close the dialog from inside the action once the save succeeds.
  const [state, formAction] = useActionState(
    async (prev: ActionState, formData: FormData) => {
      const result = await updateTask(task.id, prev, formData);
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
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            {taskStatusLabel[task.status]}
            {task.due_on ? ` · due ${formatDate(task.due_on)}` : ""}
          </DialogDescription>
        </DialogHeader>
        <form key={task.updated_at} action={formAction} className="grid gap-4 sm:grid-cols-2">
          {state?.error ? (
            <div className="sm:col-span-2">
              <Alert tone="error">{state.error}</Alert>
            </div>
          ) : null}
          <Field label="Title" className="sm:col-span-2">
            <Input name="title" required maxLength={200} defaultValue={task.title} />
          </Field>
          <Field label="Status">
            <NativeSelect name="status" defaultValue={task.status}>
              {taskStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Priority">
            <NativeSelect name="priority" defaultValue={task.priority}>
              {taskPriorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Due date" className="sm:col-span-2">
            <Input name="due_on" type="date" defaultValue={task.due_on ?? ""} />
          </Field>
          <Field label="Details" className="sm:col-span-2">
            <Textarea
              name="details"
              rows={5}
              maxLength={4000}
              defaultValue={task.details ?? ""}
              placeholder="Optional notes, links, acceptance criteria"
            />
          </Field>
          <DialogFooter className="gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <SubmitButton pendingLabel="Saving">Save task</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
