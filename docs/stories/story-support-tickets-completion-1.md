# Story 1: Ticket attachments end to end

**Epic:** Support Tickets Completion
**Status:** Review (code complete 2026-11-27, untested against live R2/Resend)
**Points:** 5

## User Story

As a **client**, I want to attach screenshots and files when I open or reply to a ticket, so that the studio can see the problem without back and forth.
As the **studio**, I want to attach files to replies and internal notes.

## Acceptance Criteria

Tech spec AC 1, 2, 3, 4, 5.

1. A new ticket with up to 10 files (25 MB each) uploads straight to R2, and the files show on the first message.
2. The picker rejects oversize, excess and blocked files inline, and the server rejects them too.
3. Client replies and admin replies (including internal notes) support attachments, including replies that are only files.
4. Images (png, jpeg, webp, gif) show as thumbnails; other files show as name and size chips.
5. Internal-note files are never visible or downloadable to clients.

## Tasks

- [x] Create `src/lib/portal/ticket-limits.ts` and move the shared limits there
- [x] `confirmTicketUploads(ids, messageId)` with the message binding check
- [x] Return `ticketId`, `messageId` and `number` from `createTicket`, `replyToTicket` and `adminReply`
- [x] Allow attachment-only replies (`body = null` when `has_attachments=1`)
- [x] Rate limit `requestTicketUploads` (60 per hour per user)
- [x] Create `src/lib/portal/ticket-upload-client.ts` (XHR PUT with progress, 3 at a time)
- [x] Create `TicketAttachmentPicker.tsx`
- [x] Rename `TicketFormPlaceholder` to `TicketForm` and connect the picker
- [x] Connect the picker in both reply forms of `TicketConversation`, and render thumbnails and chips
- [x] Delete `TicketDetailPlaceholder.tsx`
- [x] Create `.verify/test-ticket-attachments.ts`
- [x] `npm run lint` and `npm run build` pass

## Files to Modify

See Source Tree Changes in `../tech-spec.md`.

## Dev Notes

The browser PUT `Content-Type` must exactly match the type sent to `requestTicketUploads`, or R2 returns 403. HEIC files are shown as chips, not thumbnails.
