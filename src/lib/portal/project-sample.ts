import { sampleBundle, sampleProject, sampleProjects } from "@/lib/portal/sample";
import type { ProjectTaskRecord, ProjectUpdateRecord } from "@/lib/portal/types";
import type { ClientProjectActivity, ProjectWorkspace } from "@/lib/portal/project-queries";

// Preview data for the project workspace when Supabase is not connected.

const CLIENT_ID = "sample-northwind";
const SITE = "sample-project-site";
const ADS = "sample-project-ads";

function task(
  id: string,
  projectId: string,
  fields: Partial<ProjectTaskRecord> & Pick<ProjectTaskRecord, "title">,
): ProjectTaskRecord {
  return {
    id,
    project_id: projectId,
    client_id: CLIENT_ID,
    details: null,
    status: "todo",
    priority: "normal",
    due_on: null,
    completed_at: null,
    sort_order: 0,
    created_at: "2026-11-01T15:00:00.000Z",
    updated_at: "2026-11-01T15:00:00.000Z",
    ...fields,
  };
}

const tasks: ProjectTaskRecord[] = [
  task("sample-task-1", SITE, {
    title: "Wireframes for the repair funnel",
    status: "done",
    priority: "high",
    due_on: "2026-10-01",
    completed_at: "2026-09-29T19:00:00.000Z",
  }),
  task("sample-task-2", SITE, {
    title: "Build the lead form with call tracking",
    status: "done",
    due_on: "2026-10-20",
    completed_at: "2026-10-18T19:00:00.000Z",
  }),
  task("sample-task-3", SITE, {
    title: "Rewrite the mobile hero on the repair page",
    details: "Shorter headline, phone number above the fold, one CTA.",
    status: "in_progress",
    priority: "urgent",
    due_on: "2026-11-18",
  }),
  task("sample-task-4", SITE, {
    title: "Client sign-off on service page copy",
    status: "blocked",
    priority: "high",
    due_on: "2026-11-25",
    details: "Waiting on pricing from Lena.",
  }),
  task("sample-task-5", SITE, {
    title: "Launch checklist and redirects",
    due_on: "2026-11-30",
  }),
  task("sample-task-6", ADS, {
    title: "Audit the current Google Ads account",
    priority: "high",
    due_on: "2026-11-24",
  }),
];

const updates: ProjectUpdateRecord[] = [
  {
    id: "sample-update-1",
    project_id: SITE,
    client_id: CLIENT_ID,
    kind: "blocker",
    body: "Service page copy is waiting on final pricing. Launch moves if it lands after Nov 25.",
    visible_to_client: true,
    created_at: "2026-11-19T16:30:00.000Z",
    updated_at: "2026-11-19T16:30:00.000Z",
  },
  {
    id: "sample-update-2",
    project_id: SITE,
    client_id: CLIENT_ID,
    kind: "note",
    body: "Mobile bounce on the repair page is 71%. Hero rewrite is the first fix to try.",
    visible_to_client: false,
    created_at: "2026-11-14T14:00:00.000Z",
    updated_at: "2026-11-14T14:00:00.000Z",
  },
  {
    id: "sample-update-3",
    project_id: SITE,
    client_id: CLIENT_ID,
    kind: "delivery",
    body: "Lead form is live with call tracking. Test submissions reach the shared inbox.",
    visible_to_client: true,
    created_at: "2026-10-18T19:00:00.000Z",
    updated_at: "2026-10-18T19:00:00.000Z",
  },
  {
    id: "sample-update-4",
    project_id: SITE,
    client_id: CLIENT_ID,
    kind: "milestone",
    body: "Wireframes approved. Design starts Monday.",
    visible_to_client: true,
    created_at: "2026-09-29T19:00:00.000Z",
    updated_at: "2026-09-29T19:00:00.000Z",
  },
];

export function sampleProjectWorkspace(id: string): ProjectWorkspace | null {
  const base = sampleProject(id);
  if (!base) return null;
  const bundle = sampleBundle(base.client.id);
  // Pretend the client's invoices and payments were billed to the main project.
  const linked = id === SITE;
  return {
    ...base,
    tasks: tasks.filter((item) => item.project_id === id),
    updates: updates.filter((item) => item.project_id === id),
    invoices: linked
      ? (bundle?.invoices ?? []).map((invoice) => ({ ...invoice, project_id: id }))
      : [],
    payments: linked
      ? (bundle?.payments ?? []).map((payment) => ({ ...payment, project_id: id }))
      : [],
    tasksReady: true,
  };
}

export function sampleClientProjectActivity(): ClientProjectActivity {
  const projects = sampleProjects()
    .filter((project) => project.client_id === CLIENT_ID)
    .map(({ company_name: _company, ...project }) => {
      const own = tasks.filter((item) => item.project_id === project.id);
      const done = own.filter((item) => item.status === "done").length;
      return { ...project, tasks_total: own.length, tasks_done: done, tasks_open: own.length - done };
    });
  const names = new Map(projects.map((project) => [project.id, project.name]));
  return {
    projects,
    updates: updates
      .filter((item) => item.visible_to_client)
      .map((item) => ({ ...item, project_name: names.get(item.project_id) ?? "" })),
  };
}
