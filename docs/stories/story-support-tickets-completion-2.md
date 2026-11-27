# Story 2: Client and studio status emails

**Epic:** Support Tickets Completion
**Status:** Review (code complete 2026-11-27, untested against live R2/Resend)
**Points:** 3

## User Story

As a **client**, I want an email when my ticket is received, when the studio needs something from me, and when it's resolved or closed, so that I don't have to keep checking the portal.
As the **studio**, I want an email when a client resolves or reopens a ticket.

## Acceptance Criteria

Tech spec AC 6, 7, 8, 9.

1. Creating a ticket emails the client "we received" and the studio "new ticket".
2. `setTicketStatus` and `bulkUpdateTickets` to `awaiting_client`, `resolved` or `closed` email the client once. Other statuses send nothing.
3. An admin reply that also changes status sends one email, with the status in the subject.
4. A client resolving or reopening their own ticket emails the studio, not the client.
5. Every send runs inside `after()`.

## Tasks

- [x] `notifyClientTicketReceived`, `notifyClientStatusChange`, `notifyStudioClientResolved`, `notifyStudioClientReopened` in `ticket-mail.ts`
- [x] Delete `notifyClientTicketResolved`
- [x] Add the status suffix to `notifyClientStudioReply`
- [x] Wire into `createTicket`, `setTicketStatus`, `bulkUpdateTickets`, `resolveTicket`, `reopenTicket`, `adminReply`
- [x] Replace every `void notify…` with `after(() => notify…)`

## Files to Modify

- `src/server/billing/ticket-mail.ts`
- `src/lib/portal/ticket-actions.ts`
