import { todayISO } from "@/lib/portal/format";
import type {
  ProjectTaskRecord,
  ProjectUpdateKind,
  TaskPriority,
  TaskStatus,
} from "@/lib/portal/types";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const taskStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "blocked", label: "Blocked" },
  { value: "done", label: "Done" },
];

export const taskPriorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const updateKindOptions: { value: ProjectUpdateKind; label: string }[] = [
  { value: "note", label: "Note" },
  { value: "milestone", label: "Milestone" },
  { value: "blocker", label: "Blocker" },
  { value: "delivery", label: "Delivery" },
];

export const taskStatusLabel: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done",
};

export const priorityLabel: Record<TaskPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const priorityVariant: Record<TaskPriority, BadgeVariant> = {
  low: "outline",
  normal: "outline",
  high: "secondary",
  urgent: "destructive",
};

export const updateKindLabel: Record<ProjectUpdateKind, string> = {
  note: "Note",
  milestone: "Milestone",
  blocker: "Blocker",
  delivery: "Delivery",
};

export const updateKindVariant: Record<ProjectUpdateKind, BadgeVariant> = {
  note: "outline",
  milestone: "default",
  blocker: "destructive",
  delivery: "secondary",
};

export function isOverdue(task: Pick<ProjectTaskRecord, "status" | "due_on">, today = todayISO()) {
  return Boolean(task.due_on && task.status !== "done" && task.due_on < today);
}

export function taskProgress(tasks: Pick<ProjectTaskRecord, "status" | "due_on">[]) {
  const today = todayISO();
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "done").length;
  return {
    total,
    done,
    open: total - done,
    blocked: tasks.filter((task) => task.status === "blocked").length,
    overdue: tasks.filter((task) => isOverdue(task, today)).length,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

const relative = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

const steps: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

export function relativeTime(value: string, now = Date.now()) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";
  const seconds = Math.round((time - now) / 1000);
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
