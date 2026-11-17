import type { Session } from "@/lib/portal/session";

type BlockedSession = Exclude<Session, { kind: "ready" | "anonymous" }>;

export function Blocked({ session }: { session: BlockedSession }) {
  if (session.kind === "unconfigured") {
    return (
      <div className="rounded-panel border border-rule bg-white px-5 py-5 text-sm leading-relaxed text-body">
        <p className="font-medium text-ink">Supabase is not connected yet</p>
        <p className="mt-2">
          Add these to <code className="font-mono text-[13px] text-ink">.env.local</code> and
          restart the dev server.
        </p>
        <ul className="mt-3 space-y-1 font-mono text-[13px] text-ink">
          <li>NEXT_PUBLIC_SUPABASE_URL</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          <li>SUPABASE_SERVICE_ROLE_KEY</li>
          <li>PORTAL_ADMIN_EMAILS</li>
        </ul>
        <p className="mt-3">
          Then run{" "}
          <code className="font-mono text-[13px] text-ink">
            supabase/migrations/20261117120000_client_portal.sql
          </code>{" "}
          once in the Supabase SQL editor.
        </p>
      </div>
    );
  }

  if (session.kind === "schema") {
    return (
      <div className="rounded-panel border border-rule bg-white px-5 py-5 text-sm leading-relaxed text-body">
        <p className="font-medium text-ink">The portal tables are not installed</p>
        <p className="mt-2">
          Open the Supabase SQL editor and run{" "}
          <code className="font-mono text-[13px] text-ink">
            supabase/migrations/20261117120000_client_portal.sql
          </code>{" "}
          once. Then refresh this page.
        </p>
      </div>
    );
  }

  if (session.kind === "needs-promotion") {
    return (
      <div className="rounded-panel border border-rule bg-white px-5 py-5 text-sm leading-relaxed text-body">
        <p className="font-medium text-ink">This login is not an admin yet</p>
        <p className="mt-2">
          <span className="font-mono text-[13px] text-ink">{session.email}</span> is listed in{" "}
          <code className="font-mono text-[13px] text-ink">PORTAL_ADMIN_EMAILS</code>, but the
          service role key is missing, so the role cannot be saved.
        </p>
        <p className="mt-2">
          Add <code className="font-mono text-[13px] text-ink">SUPABASE_SERVICE_ROLE_KEY</code> and
          sign in again, or run this in the SQL editor:
        </p>
        <p className="mt-3 overflow-x-auto font-mono text-[13px] text-ink">
          update public.profiles set role = &apos;admin&apos; where email = &apos;{session.email}&apos;;
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-panel border border-rule bg-white px-5 py-5 text-sm leading-relaxed text-body">
      <p className="font-medium text-ink">This login has no profile</p>
      <p className="mt-2">
        Run the portal SQL migration, then sign in again. If this user was created before that
        migration, add the profile in the SQL editor:
      </p>
      <p className="mt-3 overflow-x-auto font-mono text-[13px] text-ink">
        insert into public.profiles (id, email, role) select id, email, &apos;admin&apos; from
        auth.users where email = &apos;{session.email}&apos; on conflict (id) do update set role =
        &apos;admin&apos;;
      </p>
    </div>
  );
}

export function QueryError({ reason }: { reason: "schema" | "auth" | "error" }) {
  if (reason === "schema") return <Blocked session={{ kind: "schema" }} />;
  if (reason === "auth") {
    return (
      <div className="rounded-panel border border-rule bg-white px-5 py-5 text-sm leading-relaxed text-body">
        <p className="font-medium text-ink">Supabase rejected the API key</p>
        <p className="mt-2">
          Check <code className="font-mono text-[13px] text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          in <code className="font-mono text-[13px] text-ink">.env.local</code>, then restart the
          dev server.
        </p>
      </div>
    );
  }
  return <p className="text-sm leading-relaxed text-body">The portal could not load this page.</p>;
}

export function PreviewNote() {
  return (
    <p className="mt-4 text-sm leading-relaxed text-muted">
      The records below are sample data so you can see the portal. Nothing is saved until
      Supabase is connected.
    </p>
  );
}
