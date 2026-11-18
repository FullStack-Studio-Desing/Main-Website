import type { Session } from "@/lib/portal/session";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

type BlockedSession = Exclude<Session, { kind: "ready" | "anonymous" }>;

export function Blocked({ session }: { session: BlockedSession }) {
  if (session.kind === "unconfigured") {
    return (
      <Card>
        <CardContent className="space-y-3 p-5 text-sm leading-relaxed">
          <p className="font-medium text-foreground">Supabase is not connected yet</p>
          <p>
            Add these to <code className="font-mono text-[13px]">.env.local</code> and restart the
            dev server.
          </p>
          <ul className="space-y-1 font-mono text-[13px]">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>SUPABASE_SERVICE_ROLE_KEY</li>
            <li>PORTAL_ADMIN_EMAILS</li>
          </ul>
          <p>
            Then run the SQL files in{" "}
            <code className="font-mono text-[13px]">supabase/migrations/</code> once in the
            Supabase SQL editor (portal + CRM projects).
          </p>
        </CardContent>
      </Card>
    );
  }

  if (session.kind === "schema") {
    return (
      <Alert>
        <AlertTitle>The portal tables are not installed</AlertTitle>
        <AlertDescription>
          Open the Supabase SQL editor and run the files in{" "}
          <code className="font-mono text-[13px]">supabase/migrations/</code> (portal + CRM
          projects). Then refresh this page.
        </AlertDescription>
      </Alert>
    );
  }

  if (session.kind === "needs-promotion") {
    return (
      <Card>
        <CardContent className="space-y-3 p-5 text-sm leading-relaxed">
          <p className="font-medium text-foreground">This login is not an admin yet</p>
          <p>
            <span className="font-mono text-[13px]">{session.email}</span> is listed in{" "}
            <code className="font-mono text-[13px]">PORTAL_ADMIN_EMAILS</code>, but the service role
            key is missing, so the role cannot be saved.
          </p>
          <p>
            Add <code className="font-mono text-[13px]">SUPABASE_SERVICE_ROLE_KEY</code> and sign in
            again, or run this in the SQL editor:
          </p>
          <p className="overflow-x-auto font-mono text-[13px]">
            update public.profiles set role = &apos;admin&apos; where email = &apos;{session.email}
            &apos;;
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-5 text-sm leading-relaxed">
        <p className="font-medium text-foreground">This login has no profile</p>
        <p>
          Run the portal SQL migration, then sign in again. If this user was created before that
          migration, add the profile in the SQL editor:
        </p>
        <p className="overflow-x-auto font-mono text-[13px]">
          insert into public.profiles (id, email, role) select id, email, &apos;admin&apos; from
          auth.users where email = &apos;{session.email}&apos; on conflict (id) do update set role =
          &apos;admin&apos;;
        </p>
      </CardContent>
    </Card>
  );
}

export function QueryError({ reason }: { reason: "schema" | "auth" | "error" }) {
  if (reason === "schema") return <Blocked session={{ kind: "schema" }} />;
  if (reason === "auth") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Supabase rejected the API key</AlertTitle>
        <AlertDescription>
          Check <code className="font-mono text-[13px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
          <code className="font-mono text-[13px]">.env.local</code>, then restart the dev server.
        </AlertDescription>
      </Alert>
    );
  }
  return <p className="text-sm text-muted-foreground">The portal could not load this page.</p>;
}

export function PreviewNote() {
  return (
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
      The records below are sample data so you can see the portal. Nothing is saved until Supabase is
      connected.
    </p>
  );
}
