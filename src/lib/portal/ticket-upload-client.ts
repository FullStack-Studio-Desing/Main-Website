"use client";

import { confirmTicketUploads, requestTicketUploads } from "@/lib/portal/ticket-actions";
import { uploadContentType } from "@/lib/portal/ticket-limits";

const PARALLEL = 3;

export type UploadProgress = (index: number, percent: number) => void;

export type UploadResult = { failed: number; error?: string };

function putFile(url: string, file: File, onProgress: (percent: number) => void) {
  return new Promise<boolean>((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    // Must match the content type the URL was signed with, or R2 answers 403.
    xhr.setRequestHeader("Content-Type", uploadContentType(file.type));
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300);
    xhr.onerror = () => resolve(false);
    xhr.onabort = () => resolve(false);
    xhr.send(file);
  });
}

/** Uploads files straight to R2, then binds them to the message. Never throws. */
export async function uploadTicketFiles(
  ticketId: string,
  messageId: string,
  files: File[],
  onProgress: UploadProgress,
): Promise<UploadResult> {
  if (!files.length) return { failed: 0 };

  const signed = await requestTicketUploads(
    ticketId,
    files.map((file) => ({ name: file.name, type: file.type, size: file.size })),
  );
  if (!signed?.uploads?.length) {
    return { failed: files.length, error: signed?.error ?? "Could not start the upload." };
  }
  const uploads = signed.uploads;

  const done: string[] = [];
  let next = 0;
  async function worker() {
    while (next < uploads.length) {
      const index = next++;
      const ok = await putFile(uploads[index].uploadUrl, files[index], (percent) =>
        onProgress(index, percent),
      );
      if (ok) done.push(uploads[index].id);
      else onProgress(index, -1);
    }
  }
  await Promise.all(Array.from({ length: Math.min(PARALLEL, uploads.length) }, worker));

  if (!done.length) return { failed: files.length };
  const confirmed = await confirmTicketUploads(done, messageId);
  if (confirmed?.error) return { failed: files.length, error: confirmed.error };
  return { failed: files.length - (confirmed?.confirmed ?? 0) };
}
