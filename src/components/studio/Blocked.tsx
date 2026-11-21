import { Database, Info, KeyRound, ShieldAlert, UserX } from "lucide-react";
import type { Session } from "@/lib/portal/session";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type BlockedSession = Exclude<Session, { kind: "ready" | "anonymous" }>;

const code = "rounded bg-muted px-1 py-0.5 font-mono text-[13px] text-foreground";

export function Blocked({ session }: { session: BlockedSession }) {
  if (session.kind === "unconfigured") {
    return (
      <Alert>
        <Database className="size-4" />
        <AlertTitle>Supabase is not connected yet</AlertTitle>
        <AlertDescription className="space-y-2 text-muted-foreground">
          <p>
            Add these to <code className={code}>.env.local</code> and restart the dev server.
          </p>
          <ul className="flex flex-wrap gap-1.5">
            <li className={code}>NEXT_PUBLIC_SUPABASE_URL</li>
            <li className={code}>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li className={code}>SUPABASE_SERVICE_ROLE_KEY</li>
            <li className={code}>PORTAL_ADMIN_EMAILS</li>
          </ul>
          <p>
            Then run the SQL files in <code className={code}>supabase/migrations/</code> once in the
            Supabase SQL editor (portal + CRM projects).
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  if (session.kind === "schema") {
    return (
      <Alert>
        <Database className="size-4" />
        <AlertTitle>The portal tables are not installed</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Open the Supabase SQL editor and run the files in{" "}
          <code className={code}>supabase/migrations/</code> (portal + CRM projects). Then refresh
          this page.
        </AlertDescription>
      </Alert>
    );
  }

  if (session.kind === "needs-promotion") {
    return (
      <Alert>
        <ShieldAlert className="size-4" />
        <AlertTitle>This login is not an admin yet</AlertTitle>
        <AlertDescription className="space-y-2 text-muted-foreground">
          <p>
            <span className={code}>{session.email}</span> is listed in{" "}
            <code className={code}>PORTAL_ADMIN_EMAILS</code>, but the service role key is missing,
            so the role cannot be saved.
          </p>
          <p>
            Add <code className={code}>SUPABASE_SERVICE_ROLE_KEY</code> and sign in again, or run
            this in the SQL editor:
          </p>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-[13px] text-foreground">
            update public.profiles set role = &apos;admin&apos; where email = &apos;{session.email}
            &apos;;
          </pre>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <UserX className="size-4" />
      <AlertTitle>This login has no profile</AlertTitle>
      <AlertDescription className="space-y-2 text-muted-foreground">
        <p>
          Run the portal SQL migration, then sign in again. If this user was created before that
          migration, add the profile in the SQL editor:
        </p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-3 font-mono text-[13px] text-foreground">
          insert into public.profiles (id, email, role) select id, email, &apos;admin&apos; from
          auth.users where email = &apos;{session.email}&apos; on conflict (id) do update set role =
          &apos;admin&apos;;
        </pre>
      </AlertDescription>
    </Alert>
  );
}

export function QueryError({ reason }: { reason: "schema" | "auth" | "error" }) {
  if (reason === "schema") return <Blocked session={{ kind: "schema" }} />;
  if (reason === "auth") {
    return (
      <Alert variant="destructive">
        <KeyRound className="size-4" />
        <AlertTitle>Supabase rejected the API key</AlertTitle>
        <AlertDescription>
          Check <code className={code}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
          <code className={code}>.env.local</code>, then restart the dev server.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="destructive">
      <Info className="size-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>The portal could not load this page. Try again in a moment.</AlertDescription>
    </Alert>
  );
}

export function PreviewNote() {
  return (
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
      The records below are sample data so you can see the portal. Nothing is saved until Supabase is
      connected.
    </p>
  );
}
