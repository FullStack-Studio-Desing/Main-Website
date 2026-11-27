"use client";

import { FileText, ImageIcon, Paperclip, X } from "lucide-react";
import { useCallback, useId, useState } from "react";
import { ACCEPT_ATTR, formatBytes, MAX_FILES, validateFile } from "@/lib/portal/ticket-limits";
import { uploadTicketFiles, type UploadResult } from "@/lib/portal/ticket-upload-client";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type PickedFile = { key: string; file: File; progress: number };

/** File state for one message composer. Pass the result to <TicketAttachmentPicker>. */
export function useTicketAttachments() {
  const [items, setItems] = useState<PickedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const add = useCallback(
    (list: FileList | File[]) => {
      const next = [...items];
      const problems: string[] = [];
      for (const file of Array.from(list)) {
        if (next.length >= MAX_FILES) {
          problems.push(`Attach up to ${MAX_FILES} files per message.`);
          break;
        }
        const problem = validateFile({ name: file.name, type: file.type, size: file.size });
        if (problem) {
          problems.push(problem);
          continue;
        }
        next.push({ key: `${file.name}-${file.size}-${file.lastModified}-${next.length}`, file, progress: 0 });
      }
      setItems(next);
      setError(problems.length ? problems.join(" ") : null);
    },
    [items],
  );

  const remove = useCallback((key: string) => {
    setError(null);
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setError(null);
  }, []);

  const upload = useCallback(
    async (ticketId: string, messageId: string): Promise<UploadResult> => {
      if (!items.length) return { failed: 0 };
      setUploading(true);
      try {
        return await uploadTicketFiles(
          ticketId,
          messageId,
          items.map((item) => item.file),
          (index, percent) =>
            setItems((current) =>
              current.map((item, i) => (i === index ? { ...item, progress: percent } : item)),
            ),
        );
      } finally {
        setUploading(false);
      }
    },
    [items],
  );

  return { items, error, uploading, add, remove, clear, upload, count: items.length };
}

export type TicketAttachments = ReturnType<typeof useTicketAttachments>;

export function TicketAttachmentPicker({
  attachments,
  disabled,
}: {
  attachments: TicketAttachments;
  disabled?: boolean;
}) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const { items, error, uploading, add, remove } = attachments;
  const locked = disabled || uploading;

  return (
    <div className="space-y-2">
      {/* Tells the server action a body-less message is fine because files follow. */}
      <input type="hidden" name="has_attachments" value={items.length ? "1" : "0"} />
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          if (!locked) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!locked && event.dataTransfer.files.length) add(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-4 py-4 text-sm text-muted-foreground transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-muted/40",
          dragging && "border-primary bg-muted/40",
          locked && "pointer-events-none opacity-60",
        )}
      >
        <Paperclip className="size-4 shrink-0" aria-hidden />
        <span className="hidden sm:inline">Drop files or browse · up to {MAX_FILES} files, 25 MB each</span>
        <span className="sm:hidden">Add files</span>
        <input
          id={inputId}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="sr-only"
          disabled={locked}
          onChange={(event) => {
            if (event.target.files?.length) add(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {items.length ? (
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.file.type.startsWith("image/") ? ImageIcon : FileText;
            return (
              <li key={item.key} className="rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{item.file.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(item.file.size)}</span>
                  {!uploading ? (
                    <button
                      type="button"
                      onClick={() => remove(item.key)}
                      aria-label={`Remove ${item.file.name}`}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  ) : null}
                </div>
                {uploading && item.progress >= 0 ? (
                  <Progress
                    value={item.progress}
                    className="mt-2 h-1"
                    aria-label={`Uploading ${item.file.name}`}
                  />
                ) : null}
                {item.progress < 0 ? <p className="mt-1 text-xs text-destructive">Upload failed.</p> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
