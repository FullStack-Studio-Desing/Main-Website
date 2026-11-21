import type { ReactNode } from "react";
import { Eye, EyeOff, Flag, OctagonAlert, PackageCheck, StickyNote } from "lucide-react";
import { formatDate } from "@/lib/portal/format";
import type { ProjectUpdateKind, ProjectUpdateRecord } from "@/lib/portal/types";
import {
  relativeTime,
  updateKindLabel,
  updateKindVariant,
} from "@/components/studio/project/labels";
import { Badge } from "@/components/ui/badge";

const kindIcon: Record<ProjectUpdateKind, typeof StickyNote> = {
  note: StickyNote,
  milestone: Flag,
  blocker: OctagonAlert,
  delivery: PackageCheck,
};

// Shared timeline markup for the admin feed and the client portal.
export function UpdateTimeline({ children }: { children: ReactNode }) {
  return <ol className="relative space-y-6 border-l pl-6">{children}</ol>;
}

export function UpdateTimelineItem({
  update,
  eyebrow,
  showVisibility = false,
  actions,
}: {
  update: ProjectUpdateRecord;
  eyebrow?: string;
  showVisibility?: boolean;
  actions?: ReactNode;
}) {
  const Icon = kindIcon[update.kind];
  const edited = update.updated_at !== update.created_at;

  return (
    <li className="relative">
      <span className="absolute -left-[37px] top-0 grid size-6 place-items-center rounded-full border bg-background text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <Badge variant={updateKindVariant[update.kind]}>{updateKindLabel[update.kind]}</Badge>
            {eyebrow ? <span className="font-medium text-foreground">{eyebrow}</span> : null}
            <time
              dateTime={update.created_at}
              title={formatDate(update.created_at)}
              suppressHydrationWarning
            >
              {relativeTime(update.created_at)}
            </time>
            {edited ? <span>· edited</span> : null}
            {showVisibility ? (
              update.visible_to_client ? (
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3.5" aria-hidden /> Client can see
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <EyeOff className="size-3.5" aria-hidden /> Internal
                </span>
              )
            ) : null}
          </div>
          <p className="whitespace-pre-line break-words text-sm leading-relaxed text-foreground">
            {update.body}
          </p>
        </div>
        {actions}
      </div>
    </li>
  );
}
