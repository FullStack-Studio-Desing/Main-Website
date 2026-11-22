import Link from "next/link";
import { FileText, Mail, Pencil, Phone, UserRound, Wallet } from "lucide-react";
import {
  createPayment,
  createProject,
  createReport,
  deletePayment,
  savePortalLogin,
} from "@/lib/portal/actions";
import { createInvoice } from "@/lib/portal/billing-actions";
import { formatDate, formatUsd } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validators";
import type {
  ClientRecord,
  InvoiceRecord,
  PaymentMethodRecord,
  PaymentRecord,
  PortalLogin,
  ProjectRecord,
  ReportRecord,
  TicketListItem,
} from "@/lib/portal/types";
import { AdminTicketList } from "@/components/studio/ticket/AdminTicketList";
import { AccessForm } from "@/components/studio/AccessForm";
import { ConfirmForm } from "@/components/studio/ConfirmForm";
import { FormDialog } from "@/components/studio/FormDialog";
import { HashTabs } from "@/components/studio/HashTabs";
import { InvoiceForm } from "@/components/studio/InvoiceForm";
import { InvoiceList } from "@/components/studio/InvoiceList";
import { PaymentForm } from "@/components/studio/PaymentForm";
import { PaymentMethodList } from "@/components/studio/PaymentMethodList";
import { PaymentStatusSelect } from "@/components/studio/PaymentStatusSelect";
import { ClientProjects } from "@/components/studio/ProjectList";
import { ProjectForm } from "@/components/studio/ProjectForm";
import { ReportForm } from "@/components/studio/ReportForm";
import {
  BackLink,
  EmptyState,
  SectionCard,
  StatCard,
  StatusBadge,
  initials,
} from "@/components/studio/ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import type { ReactNode } from "react";

export function ClientDetail({
  client,
  payments,
  projects,
  reports,
  invoices,
  paymentMethods,
  login,
  tickets = [],
  ticketsPending = false,
}: {
  client: ClientRecord;
  payments: PaymentRecord[];
  projects: ProjectRecord[];
  reports: ReportRecord[];
  invoices: InvoiceRecord[];
  paymentMethods: PaymentMethodRecord[];
  login: PortalLogin | null;
  tickets?: TicketListItem[];
  ticketsPending?: boolean;
}) {
  const real = isUuid(client.id);
  const collected = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const openInvoices = invoices.filter(
    (invoice) => invoice.status === "sent" || invoice.status === "failed"
  );
  const contacts = client.contacts ?? [];
  const people = client.people ?? [];

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "projects", label: "Projects", count: projects.length },
    { value: "invoices", label: "Invoices", count: invoices.length },
    { value: "payments", label: "Payments", count: payments.length },
    { value: "billing", label: "Cards", count: paymentMethods.length },
    { value: "reports", label: "Reports", count: reports.length },
    { value: "support", label: "Support", count: ticketsPending ? undefined : tickets.length },
    { value: "access", label: "Portal access" },
  ];

  return (
    <div className="space-y-6">
      <BackLink href="/admin/clients">← Clients</BackLink>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar className="size-12">
            <AvatarFallback className="font-medium">{initials(client.company_name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {client.company_name}
              </h1>
              <StatusBadge status={client.status} />
            </div>
            <p className="mt-1 break-words text-sm text-muted-foreground">
              {[client.contact_name, client.email, client.phone].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/admin/clients/${client.id}/edit`}>
            <Pencil />
            Edit client
          </Link>
        </Button>
      </div>

      <HashTabs tabs={tabs} defaultValue="overview">
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Plan"
              value={client.plan_name}
              hint={
                client.started_on ? `Started ${formatDate(client.started_on)}` : "Start date not set"
              }
            />
            <StatCard label="Monthly" value={formatUsd(client.monthly_amount)} hint="Per month" />
            <StatCard
              label="Collected"
              value={formatUsd(collected)}
              hint="All paid payments"
              icon={<Wallet />}
            />
            <StatCard
              label="Open invoices"
              value={openInvoices.length}
              hint={formatUsd(openInvoices.reduce((sum, invoice) => sum + invoice.amount, 0))}
              icon={<FileText />}
            />
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-2">
            <SectionCard title="Contact methods" description="Company emails and phones.">
              {contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contact methods yet.</p>
              ) : (
                <ul className="space-y-3">
                  {contacts.map((contact) => (
                    <li key={contact.id} className="flex items-start gap-3 text-sm">
                      {contact.kind === "email" ? (
                        <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="min-w-0">
                        <p className="break-all font-medium">{contact.value}</p>
                        <p className="text-muted-foreground">
                          {[contact.kind === "email" ? "Email" : "Phone", contact.label]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard title="People" description="Named contacts at this company.">
              {people.length === 0 ? (
                <p className="text-sm text-muted-foreground">No people yet.</p>
              ) : (
                <ul className="space-y-3">
                  {people.map((person) => (
                    <li key={person.id} className="flex items-start gap-3 text-sm">
                      <UserRound className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="font-medium">
                          {person.name}
                          <span className="ml-2 font-normal text-muted-foreground">
                            {person.role}
                          </span>
                        </p>
                        <p className="break-all text-muted-foreground">
                          {[person.email, person.phone].filter(Boolean).join(" · ") ||
                            "No email or phone"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>

          {client.billing_notes ? (
            <SectionCard title="Notes" description="Only the studio sees this.">
              <p className="max-w-[68ch] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {client.billing_notes}
              </p>
            </SectionCard>
          ) : null}
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <TabSection
            id="projects"
            title="Projects"
            description="Track deliverables and retainers for this client."
            action={
              real ? (
                <FormDialog
                  key={projects.length}
                  trigger="Add project"
                  title="Add project"
                  description={`New project for ${client.company_name}.`}
                  size="sm"
                >
                  <ProjectForm action={createProject.bind(null, client.id)} showSeparator={false} />
                </FormDialog>
              ) : null
            }
          >
            <ClientProjects clientId={client.id} projects={projects} />
          </TabSection>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <TabSection
            id="invoices"
            title="Invoices"
            description="Send one-time or recurring invoices and charge the card on file with Mercado Pago."
          >
            <InvoiceList invoices={invoices} />
            {real ? (
              <InvoiceForm
                action={createInvoice.bind(null, client.id)}
                paymentMethods={paymentMethods}
                projects={projects}
                defaultAmount={client.monthly_amount}
                defaultTitle={`${client.plan_name} retainer`}
              />
            ) : null}
          </TabSection>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <TabSection
            id="payments"
            title="Payments"
            description="Manual payment records plus Mercado Pago charges from invoices."
            action={
              <FormDialog
                key={payments.length}
                trigger="Record payment"
                title="Record payment"
                description={`Manual payment for ${client.company_name}.`}
                size="sm"
              >
                <PaymentForm action={createPayment.bind(null, client.id)} />
              </FormDialog>
            }
          >
            <ClientPayments clientId={client.id} payments={payments} real={real} />
          </TabSection>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <TabSection
            id="billing"
            title="Cards on file"
            description="Clients add Mercado Pago cards in their portal. Charge them from invoices."
          >
            <PaymentMethodList clientId={client.id} methods={paymentMethods} />
          </TabSection>
        </TabsContent>

        <TabsContent value="reports" className="mt-4 space-y-4">
          <TabSection
            id="reports"
            title="Reports"
            description="Published reports show up in the client portal. Drafts stay here."
          >
            {reports.length === 0 ? (
              <EmptyState icon={<FileText />} title="No reports yet" />
            ) : (
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead className="hidden sm:table-cell">Period</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Link
                            href={`/admin/reports/${report.id}`}
                            className="font-medium hover:underline"
                          >
                            {report.title}
                          </Link>
                          <span className="block text-xs text-muted-foreground sm:hidden">
                            {report.period_label}
                          </span>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {report.period_label}
                        </TableCell>
                        <TableCell className="text-right">
                          <StatusBadge status={report.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabSection>
          <SectionCard title="New report" description="File a report for this client.">
            <ReportForm action={createReport.bind(null, client.id)} submitLabel="File report" />
          </SectionCard>
        </TabsContent>

        <TabsContent value="support" className="mt-4">
          <TabSection
            id="support"
            title="Support tickets"
            description="Conversations this client opened with the studio."
            action={
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/tickets?client=${client.id}`}>View inbox</Link>
              </Button>
            }
          >
            {ticketsPending ? (
              <p className="text-sm text-muted-foreground">
                Run the support tickets migration in Supabase to enable tickets.
              </p>
            ) : (
              <AdminTicketList tickets={tickets} showClient={false} />
            )}
          </TabSection>
        </TabsContent>

        <TabsContent value="access" className="mt-4">
          <SectionCard
            title="Portal login"
            description={
              login
                ? `${login.email} can sign in and see this plan, its payments, and published reports.`
                : "Create a login so this client can open their own portal."
            }
            className="max-w-xl"
          >
            <AccessForm
              action={savePortalLogin.bind(null, client.id)}
              login={login}
              defaultEmail={client.email}
            />
          </SectionCard>
        </TabsContent>
      </HashTabs>
    </div>
  );
}

function ClientPayments({
  clientId,
  payments,
  real,
}: {
  clientId: string;
  payments: PaymentRecord[];
  real: boolean;
}) {
  if (payments.length === 0) {
    return <EmptyState icon={<Wallet />} title="No payments yet" />;
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="min-w-[160px]">
                <span className="block font-medium">
                  {payment.paid_on ? formatDate(payment.paid_on) : "No date"}
                  {payment.period_label ? ` · ${payment.period_label}` : ""}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {[payment.method, payment.reference].filter(Boolean).join(" · ") || "—"}
                </span>
                {payment.notes ? (
                  <span className="mt-1 block max-w-[48ch] text-xs text-muted-foreground">
                    {payment.notes}
                  </span>
                ) : null}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatUsd(payment.amount)}
              </TableCell>
              <TableCell>
                {real ? (
                  <PaymentStatusSelect
                    clientId={clientId}
                    paymentId={payment.id}
                    status={payment.status}
                  />
                ) : (
                  <StatusBadge status={payment.status} />
                )}
              </TableCell>
              <TableCell className="text-right">
                {real ? (
                  <ConfirmForm
                    action={deletePayment.bind(null, clientId, payment.id)}
                    message={`Delete this ${formatUsd(payment.amount)} payment?`}
                    label="Delete"
                  />
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

/** Heading row for a tab whose body is already a card or table. */
function TabSection({
  id,
  title,
  description,
  action,
  children,
}: {
  id: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
