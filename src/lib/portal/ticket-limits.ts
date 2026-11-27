/** Upload limits shared by the attachment picker and the ticket server actions. */

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 26_214_400;

export const BLOCKED_EXT =
  /\.(exe|js|sh|bat|msi|dmg|apk|html|htm|svg|scr|com|cmd|vbs|ps1|jar)$/i;

export const ALLOWED_EXT =
  /\.(png|jpe?g|webp|gif|heic|pdf|txt|csv|docx?|xlsx?|pptx?|zip|mp4|mov)$/i;

/** Value for the file input `accept` attribute. */
export const ACCEPT_ATTR =
  ".png,.jpg,.jpeg,.webp,.gif,.heic,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.mp4,.mov";

/** Image types browsers render inline; HEIC is excluded on purpose. */
export const PREVIEWABLE_IMAGE = /^image\/(png|jpeg|webp|gif)$/i;

export type UploadFileMeta = { name: string; type: string; size: number };

export function sanitizeFileName(name: string) {
  const base = name.split(/[/\\]/).pop() ?? "file";
  const cleaned = base.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
  return cleaned || "file";
}

/** Content type the browser must send on PUT; it has to match the presigned one. */
export function uploadContentType(type: string | undefined) {
  return type?.trim() || "application/octet-stream";
}

export function validateFile(file: UploadFileMeta): string | null {
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
    return `${file.name} is too large. The limit is 25 MB per file.`;
  }
  const lower = file.name.toLowerCase();
  if (BLOCKED_EXT.test(lower) || !ALLOWED_EXT.test(lower)) {
    return `${file.name} is not an allowed file type.`;
  }
  if (file.type && file.type.includes("javascript")) {
    return `${file.name} is not an allowed file type.`;
  }
  return null;
}

export function validateUploadMeta(files: UploadFileMeta[]): string | null {
  if (!files.length) return "Pick at least one file.";
  if (files.length > MAX_FILES) return `Attach up to ${MAX_FILES} files per message.`;
  for (const file of files) {
    const error = validateFile(file);
    if (error) return error;
  }
  return null;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
